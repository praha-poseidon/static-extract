import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repo = resolve(root, "..");
const tempDir = mkdtempSync(resolve(tmpdir(), "static-extract-ser-author-"));
const generatedRule = resolve(tempDir, "generated.ser");
const factsFile = resolve(tempDir, "facts.jsonl");
const orchestratedDir = resolve(tempDir, "orchestrated");

const requestFile = resolve(root, "test/fixtures/ser-author-react-button/request.txt");
const example = resolve(repo, "spec/examples/ts/react-button-text");

execFileSync("node", [
  resolve(repo, "skills/ser-author/scripts/generate_ser.mjs"),
  "--runtime", "react",
  "--request", requestFile,
  "--out", generatedRule
], { encoding: "utf8" });

const generated = readFileSync(generatedRule, "utf8");
assert.match(generated, /rule "React Button Text"/);
assert.match(generated, /find jsx button/);
assert.match(generated, /from jsx button take text/);

const report = execFileSync("node", [
  resolve(root, "bin/static-extract-ts.mjs"),
  "run",
  "--project", example,
  "--source", resolve(example, "input"),
  "--rule", generatedRule,
  "--out", factsFile
], { encoding: "utf8" });
assert.match(report, /"resultCount": 2/);

const actual = readFileSync(factsFile, "utf8").trim().split("\n").map((line) => JSON.parse(line));
const expected = readFileSync(resolve(example, "expected.jsonl"), "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line.replaceAll("${EXAMPLE_DIR}", example)));
assert.deepEqual(actual, expected);

const orchestrationReport = JSON.parse(execFileSync("node", [
  resolve(repo, "skills/ser-author/scripts/run_static_extract.mjs"),
  "--project", example,
  "--mode", "generate-and-extract",
  "--request", requestFile,
  "--out-dir", orchestratedDir
], { encoding: "utf8" }));
assert.equal(orchestrationReport.runtime, "react");
assert.equal(orchestrationReport.extractReport.resultCount, 2);

const orchestratedActual = readFileSync(resolve(orchestratedDir, "facts.jsonl"), "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line));
assert.deepEqual(orchestratedActual, expected);
