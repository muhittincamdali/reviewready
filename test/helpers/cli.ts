import { fileURLToPath } from 'node:url';
import { run } from '../../src/cli/run.js';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));

export interface CliResult {
  code: number;
  stdout: string;
  stderr: string;
}

/** Runs the CLI in-process from the repository root, as the README examples do. */
export async function reviewready(
  args: string[],
  options: { tty?: boolean; env?: Record<string, string>; cwd?: string } = {},
): Promise<CliResult> {
  let stdout = '';
  let stderr = '';
  const code = await run(args, {
    cwd: options.cwd ?? ROOT,
    env: options.env ?? {},
    stdout: (text) => {
      stdout += text;
    },
    stderr: (text) => {
      stderr += text;
    },
    stdoutIsTty: options.tty ?? false,
    columns: 80,
  });
  return { code, stdout, stderr };
}
