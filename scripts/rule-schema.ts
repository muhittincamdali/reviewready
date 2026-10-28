// Writes rules/schema.json, the JSON Schema of rules/app-review.json for editors, from the zod
// schema the CLI checks the data with. The tests fail when the committed file is out of date.
//
//   node scripts/rule-schema.ts
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { ruleDataSchema } from '../src/rules/data.ts';

export function ruleSchemaJson(): string {
  const schema = z.toJSONSchema(ruleDataSchema, { target: 'draft-2020-12' });
  return `${JSON.stringify({ ...schema, title: 'reviewready rule data' }, null, 2)}\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(fileURLToPath(new URL('../rules/schema.json', import.meta.url)), ruleSchemaJson());
  console.log('rules/schema.json');
}
