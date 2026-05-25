import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createStaticExtractTsSession, runStaticExtractTs, tryStaticExtractTs } from "../index.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repo = findRepoRoot(root);
const example = resolve(repo, "spec/examples/ts/trace-external-call");

const tryReport = await tryStaticExtractTs({
  project: example,
  source: resolve(example, "input"),
  rule: resolve(example, "rule.ser"),
  traceRule: resolve(example, "trace.ser"),
  externalValues: resolve(example, "external-values.json")
});
assert.equal(tryReport.status, "MATCH");
assert.equal(tryReport.resultCount, 1);

const runReport = await runStaticExtractTs({
  project: example,
  source: resolve(example, "input"),
  rule: resolve(example, "rule.ser"),
  traceRule: resolve(example, "trace.ser"),
  externalValues: resolve(example, "external-values.json")
});
assert.equal(runReport.resultCount, 1);
assert.equal(runReport.results[0].fields.path, "/api/users");

const session = await createStaticExtractTsSession({
  project: example,
  source: resolve(example, "input")
});
const sessionReport = await session.run({
  rule: resolve(example, "rule.ser"),
  traceRule: resolve(example, "trace.ser"),
  externalValues: resolve(example, "external-values.json")
});
assert.equal(sessionReport.resultCount, 1);
assert.equal(sessionReport.results[0].fields.path, "/api/users");
session.dispose();

function findRepoRoot(start) {
  let current = start;
  for (let i = 0; i < 8; i += 1) {
    if (existsSync(resolve(current, "spec/ser/Ser.g4"))) {
      return current;
    }
    const parent = resolve(current, "..");
    if (parent === current) {
      break;
    }
    current = parent;
  }
  throw new Error(`Could not find repo root from ${start}`);
}
