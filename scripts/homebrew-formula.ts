// Writes the Homebrew formula for one release. The release workflow runs it with the SHA-256 of the
// release tarball (the file the GitHub release carries and npm publishes as @mcamdali/reviewready) and
// opens a pull request on muhittincamdali/homebrew-tap:
//
//   node scripts/homebrew-formula.ts 0.1.0 <sha256> > Formula/reviewready.rb
import { fileURLToPath } from 'node:url';

export interface FormulaInput {
  version: string;
  /** SHA-256 of the release tarball, reviewready-<version>.tgz */
  sha256: string;
}

const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const SHA256 = /^[0-9a-f]{64}$/;

export const DESCRIPTION = 'Catch App Review rejections in iOS, Flutter and React Native projects';

export function formula({ version, sha256 }: FormulaInput): string {
  if (!SEMVER.test(version)) throw new Error(`Not a version: ${version}`);
  if (!SHA256.test(sha256)) throw new Error(`Not a SHA-256: ${sha256}`);
  return `class Reviewready < Formula
  desc "${DESCRIPTION}"
  homepage "https://github.com/muhittincamdali/reviewready"
  url "https://github.com/muhittincamdali/reviewready/releases/download/v${version}/reviewready-${version}.tgz"
  sha256 "${sha256}"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink libexec.glob("bin/*")
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/reviewready --version")

    output = shell_output("#{bin}/reviewready #{testpath} 2>&1", 2)
    assert_match "No iOS project found", output
  end
end
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [version = '', sha256 = ''] = process.argv.slice(2);
  process.stdout.write(formula({ version, sha256 }));
}
