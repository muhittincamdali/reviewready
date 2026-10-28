// Runs reviewready from JavaScript and prints one line per project, most errors first: the counts,
// the project and the rules found.
//
//   node examples/api/summary.mjs [project ...]
//
// Without arguments it checks the fixtures in this repository. In your own code, install
// @mcamdali/reviewready and pass the folders of your apps.
import { fileURLToPath } from 'node:url';
import { scan } from '@mcamdali/reviewready';

const root = fileURLToPath(new URL('../../', import.meta.url));
const projects =
  process.argv.length > 2
    ? process.argv.slice(2)
    : [
        'native-swiftui-rejected',
        'native-uikit-ready',
        'flutter-harvest',
        'rn-088-camera',
        'expo-58-camera',
        'expo-58-default',
      ].map((name) => `${root}fixtures/${name}`);

const reports = await Promise.all(projects.map((path) => scan(path)));
reports.sort(
  (left, right) =>
    right.summary.errors - left.summary.errors || right.summary.warnings - left.summary.warnings,
);
for (const report of reports) {
  const { errors, warnings } = report.summary;
  const rules = [...new Set(report.findings.map((finding) => finding.rule))].join(', ') || 'none';
  console.log(
    `${String(errors).padStart(2)} errors ${String(warnings).padStart(2)} warnings  ${report.project.name} (${report.project.ecosystem}): ${rules}`,
  );
}
