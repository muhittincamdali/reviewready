import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Command, CommanderError, InvalidArgumentError, Option } from 'commander';
import { ProjectError } from '../detect/project.js';
import type { Report } from '../model.js';
import { FORMATS, type Format, render } from '../report/index.js';
import { clean, REPOSITORY_URL } from '../report/text.js';
import { RULE_IDS, type RuleId } from '../rules/data.js';
import { scan } from '../scan.js';
import { VERSION } from '../version.js';

/** Exit codes; documented in the README and `--help`. */
export const EXIT = { ok: 0, findings: 1, error: 2 } as const;

export const FAIL_ON = ['error', 'warning', 'info', 'none'] as const;
type FailOn = (typeof FAIL_ON)[number];

/** Everything the CLI touches outside its arguments, so tests can run it in-process. */
export interface CliEnvironment {
  cwd: string;
  env: Record<string, string | undefined>;
  stdout: (text: string) => void;
  stderr: (text: string) => void;
  /** Whether stdout is a terminal; turns colour on for the tty format. */
  stdoutIsTty: boolean;
  /** Terminal width, when stdout is a terminal. */
  columns?: number | undefined;
}

interface Options {
  format: Format;
  json?: boolean;
  output?: string;
  failOn: FailOn;
  ignore: RuleId[];
  color: boolean;
}

/** The npm package; the command it installs is `reviewready`. */
export const PACKAGE_NAME = '@mcamdali/reviewready';

/** The tarball the GitHub release of this version carries (the same file as on npm). */
export const RELEASE_TARBALL_URL = `${REPOSITORY_URL}/releases/download/v${VERSION}/reviewready-${VERSION}.tgz`;

const HELP_AFTER = `
Exit codes:
  0  no findings at or above --fail-on
  1  findings at or above --fail-on, or an app project or config that could not
     be read (so a rejection in it is not known); not with --fail-on none
  2  bad arguments, no iOS project found, or an unexpected error

Examples:
  reviewready                           checks the project in the current folder
  reviewready path/to/app --format markdown --output reviewready.md
  reviewready --json > reviewready.json
  reviewready --fail-on error           fails only on what App Review or App Store
                                        Connect turns away, e.g. in CI
  reviewready --ignore RVW301,RVW401    leaves two rules out

The npm package is ${PACKAGE_NAME}; the command is reviewready:
  npx ${PACKAGE_NAME}             runs the latest version without installing it
  npm i -g ${PACKAGE_NAME}        installs the reviewready command
  npx ${RELEASE_TARBALL_URL}
                                        runs this release from GitHub

Docs: ${REPOSITORY_URL}#readme`;

/** Parses one --ignore value ("RVW301" or "RVW301,RVW401") and adds it to the list. */
function ignoreList(value: string, previous: RuleId[] = []): RuleId[] {
  const ids = value
    .split(',')
    .map((id) => id.trim().toUpperCase())
    .filter(Boolean);
  const unknown = ids.filter((id) => !(RULE_IDS as readonly string[]).includes(id));
  if (unknown.length > 0) {
    throw new InvalidArgumentError(
      `unknown rule ${unknown.join(', ')} (rules: ${RULE_IDS.join(', ')})`,
    );
  }
  return [...previous, ...(ids as RuleId[])];
}

function program(io: CliEnvironment): Command {
  return new Command('reviewready')
    .description(
      'Checks a native iOS, Flutter or React Native/Expo project for the App Review rejections its files can show before you submit, with the source of every rule and how to fix each finding.',
    )
    .version(VERSION, '-v, --version')
    .argument('[path]', 'project folder or .xcodeproj (default: current folder)')
    .addOption(new Option('-f, --format <format>', 'output format').choices(FORMATS).default('tty'))
    .option('--json', 'same as --format json')
    .option('-o, --output <file>', 'write the report to a file instead of stdout')
    .addOption(
      new Option('--fail-on <severity>', 'lowest severity that makes the exit code 1')
        .choices(FAIL_ON)
        .default('warning'),
    )
    .option(
      '--ignore <rules>',
      'rule IDs to leave out, comma-separated (repeatable)',
      ignoreList,
      [],
    )
    .option('--no-color', 'plain text even in a terminal')
    .addHelpText('after', HELP_AFTER)
    .showHelpAfterError('(add --help for usage)')
    .exitOverride()
    .configureOutput({
      writeOut: io.stdout,
      writeErr: io.stderr,
      outputError: (text, write) => write(text),
    });
}

function useColor(options: Options, io: CliEnvironment): boolean {
  if (options.format !== 'tty' || options.output || !options.color) return false;
  if (io.env.NO_COLOR) return false;
  if (io.env.FORCE_COLOR && io.env.FORCE_COLOR !== '0') return true;
  return io.stdoutIsTty;
}

const RANK = { error: 3, warning: 2, info: 1 } as const;

/**
 * Whether the report has a finding at or above `failOn`, or an app it could not read: what it
 * did not read may hold an error-level problem, so only --fail-on none lets it pass.
 */
export function failsOn(report: Report, failOn: FailOn): boolean {
  if (failOn === 'none') return false;
  if (report.verdict.code === 'not-known') return true;
  return report.findings.some((item) => RANK[item.severity] >= RANK[failOn]);
}

/** Runs the CLI with the given arguments (without `node` and the script) and returns the exit code. */
export async function run(argv: readonly string[], environment: CliEnvironment): Promise<number> {
  // Messages name folders and files of the checked project. Every write to stderr is cleaned here,
  // so none of them can carry an escape sequence to the terminal.
  const io = { ...environment, stderr: (text: string) => environment.stderr(clean(text)) };
  const command = program(io);
  try {
    await command.parseAsync([...argv], { from: 'user' });
  } catch (error) {
    if (error instanceof CommanderError) return error.exitCode === 0 ? EXIT.ok : EXIT.error;
    throw error;
  }
  const options = command.opts<Options>();
  if (options.json) options.format = 'json';
  const path = (command.processedArgs[0] as string | undefined) ?? '.';
  try {
    const report = await scan(resolve(io.cwd, path), { ignore: options.ignore });
    report.project.path = path;
    const width = io.stdoutIsTty && io.columns ? Math.min(io.columns, 100) : 100;
    const output = render(report, options.format, { color: useColor(options, io), width });
    if (options.output) {
      await writeFile(resolve(io.cwd, options.output), output);
      io.stderr(`Wrote ${options.output}: ${report.verdict.text}\n`);
    } else {
      io.stdout(output);
    }
    return failsOn(report, options.failOn) ? EXIT.findings : EXIT.ok;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    io.stderr(`reviewready: ${message}\n`);
    if (!(error instanceof ProjectError)) {
      io.stderr(
        `This looks like a bug in reviewready; please report it at ${REPOSITORY_URL}/issues\n`,
      );
    }
    return EXIT.error;
  }
}
