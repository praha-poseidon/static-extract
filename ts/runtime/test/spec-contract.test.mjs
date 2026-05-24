import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repo = findRepoRoot(root);

assert.ok(existsSync(resolve(repo, "spec/ser/Ser.g4")));
const schemaFile = resolve(repo, "spec/schema/extracted-fact.schema.json");
assert.ok(existsSync(schemaFile));

const manifest = JSON.parse(readFileSync(resolve(root, "rules/manifest.json"), "utf8"));
assert.equal(manifest.runtime, "ts");
assert.deepEqual(manifest.rules, [
  "react/axios-api-call.ser",
  "react/fetch-api-call.ser",
  "react/react-button-text.ser"
]);
for (const rule of manifest.rules) {
  assert.ok(existsSync(resolve(root, "rules", rule)), `Missing rule: ${rule}`);
}

const help = execFileSync("node", [resolve(root, "bin/static-extract-ts.mjs"), "--help"], { encoding: "utf8" });
assert.match(help, /Usage: static-extract-ts/);
assert.match(help, /init/);
assert.match(help, /try/);
assert.match(help, /diagnose/);

const initProject = mkdtempSync(resolve(tmpdir(), "static-extract-ts-init-"));
const initReport = execFileSync("node", [
  resolve(root, "bin/static-extract-ts.mjs"),
  "init",
  "--project", initProject
], { encoding: "utf8" });
assert.match(initReport, /"runtime": "ts"/);
assert.ok(existsSync(resolve(initProject, ".ser/generated")));
assert.ok(existsSync(resolve(initProject, ".ser/rules")));
assert.ok(existsSync(resolve(initProject, ".ser/out")));

const examplesRoot = resolve(repo, "spec/examples/ts");
const examples = readdirSync(examplesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => resolve(examplesRoot, entry.name))
  .sort();
assert.ok(examples.length > 0, "No TS spec examples found.");

for (const example of examples) {
  assertExample(example);
}

function assertExample(example) {
  const expectedLines = readFileSync(resolve(example, "expected.jsonl"), "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line.replaceAll("${EXAMPLE_DIR}", example)));
  const output = resolve(mkdtempSync(resolve(tmpdir(), "static-extract-ts-")), "facts.jsonl");
  const tryReport = execFileSync("node", [
    resolve(root, "bin/static-extract-ts.mjs"),
    "try",
    "--project", example,
    "--source", resolve(example, "input"),
    "--rule", resolve(example, "rule.ser")
  ], { encoding: "utf8" });
  assert.match(tryReport, /"status": "MATCH"/);
  assert.match(tryReport, new RegExp(`"resultCount": ${expectedLines.length}`));

  const missingRule = resolve(mkdtempSync(resolve(tmpdir(), "static-extract-ts-rule-")), "missing.ser");
  writeFileSync(missingRule, `rule "Missing JSX"
fact ui_text

find jsx DoesNotExist

let label =
  from children take text

build {
  label: label
}
`);
  const diagnoseReport = execFileSync("node", [
    resolve(root, "bin/static-extract-ts.mjs"),
    "diagnose",
    "--project", example,
    "--source", resolve(example, "input"),
    "--rule", missingRule
  ], { encoding: "utf8" });
  assert.match(diagnoseReport, /"status": "NO_MATCH"/);
  assert.match(diagnoseReport, /"sourceFacts"/);

  const report = execFileSync("node", [
    resolve(root, "bin/static-extract-ts.mjs"),
    "run",
    "--project", example,
    "--source", resolve(example, "input"),
    "--rule", resolve(example, "rule.ser"),
    "--out", output
  ], { encoding: "utf8" });
  assert.match(report, new RegExp(`"resultCount": ${expectedLines.length}`));

  const actualLines = readFileSync(output, "utf8").trim().split("\n").map((line) => JSON.parse(line));
  const schema = JSON.parse(readFileSync(schemaFile, "utf8"));
  for (const record of actualLines) {
    assertExtractedFactShape(record, schema);
  }
  assert.deepEqual(actualLines, expectedLines);
}

const buttonExample = resolve(repo, "spec/examples/ts/react-button-text");
const buttonBuiltinReport = execFileSync("node", [
  resolve(root, "bin/static-extract-ts.mjs"),
  "run",
  "--project", buttonExample,
  "--source", resolve(buttonExample, "input"),
  "--builtin"
], { encoding: "utf8" });
assert.match(buttonBuiltinReport, /"resultCount": 2/);

const apiExample = resolve(repo, "spec/examples/ts/api-call");
const apiBuiltinReport = execFileSync("node", [
  resolve(root, "bin/static-extract-ts.mjs"),
  "run",
  "--project", apiExample,
  "--source", resolve(apiExample, "input"),
  "--builtin"
], { encoding: "utf8" });
assert.match(apiBuiltinReport, /"resultCount": 3/);

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

function assertExtractedFactShape(record, schema) {
  assert.equal(typeof record, "object");
  assert.notEqual(record, null);
  for (const name of schema.required) {
    assert.ok(Object.hasOwn(record, name), `Missing field: ${name}`);
  }
  for (const name of Object.keys(record)) {
    assert.ok(Object.hasOwn(schema.properties, name), `Unexpected field: ${name}`);
    assertMatchesType(record[name], schema.properties[name].type, name);
  }
}

function assertMatchesType(value, typeSpec, name) {
  const allowed = Array.isArray(typeSpec) ? typeSpec : [typeSpec];
  assert.ok(allowed.some((type) => matchesType(value, type)), `Field ${name} does not match schema type ${JSON.stringify(typeSpec)}`);
}

function matchesType(value, type) {
  switch (type) {
    case "string":
      return typeof value === "string";
    case "integer":
      return Number.isInteger(value);
    case "object":
      return typeof value === "object" && value !== null && !Array.isArray(value);
    case "null":
      return value === null;
    default:
      return false;
  }
}
