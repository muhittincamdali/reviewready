import { rmSync } from 'node:fs';
import { SCRATCH } from '../helpers/scratch.js';

// Every test that writes files makes its own folder under .test-work/ (scratchDir). The folders
// are removed once all test files have run, so they do not pile up from one run to the next.
export default function setup(): () => void {
  return () => rmSync(SCRATCH, { recursive: true, force: true });
}
