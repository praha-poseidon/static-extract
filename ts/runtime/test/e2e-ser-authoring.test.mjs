import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repo = findRepoRoot(root);
const tempDir = mkdtempSync(resolve(tmpdir(), "static-extract-ser-author-"));
const generatedRule = resolve(tempDir, "generated.ser");
const factsFile = resolve(tempDir, "facts.jsonl");
const orchestratedDir = resolve(tempDir, "orchestrated");

const requestFile = resolve(root, "test/fixtures/ser-author-react-button/request.txt");
const example = resolve(repo, "spec/examples/ts/react-button-text");
const orchestratedProject = resolve(tempDir, "react-button-text-project");
cpSync(example, orchestratedProject, { recursive: true });

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
  "--project", orchestratedProject,
  "--mode", "generate-and-extract",
  "--request", requestFile,
  "--out-dir", orchestratedDir
], { encoding: "utf8" }));
assert.equal(orchestrationReport.runtime, "react");
assert.equal(orchestrationReport.extractReport.resultCount, 2);
assert.equal(orchestrationReport.extractReport.tryReport.status, "MATCH");
assert.ok(existsSync(resolve(orchestratedDir, "generated.ser")));
assert.ok(existsSync(resolve(orchestratedDir, "facts.jsonl")));
assert.ok(existsSync(resolve(orchestratedDir, "report.json")));

const reactActionRequest = resolve(root, "test/fixtures/ser-author-react-action/request.txt");
const reactActionRule = resolve(tempDir, "react-action.ser");
execFileSync("node", [
  resolve(repo, "skills/ser-author/scripts/generate_ser.mjs"),
  "--runtime", "react",
  "--request", reactActionRequest,
  "--out", reactActionRule
], { encoding: "utf8" });
assert.match(readFileSync(reactActionRule, "utf8"), /fact ui_action/);

const reactApiRequest = resolve(root, "test/fixtures/ser-author-react-api/request.txt");
const reactApiRule = resolve(tempDir, "react-api.ser");
execFileSync("node", [
  resolve(repo, "skills/ser-author/scripts/generate_ser.mjs"),
  "--runtime", "react",
  "--request", reactApiRequest,
  "--out", reactApiRule
], { encoding: "utf8" });
assert.match(readFileSync(reactApiRule, "utf8"), /fact frontend_api_call/);

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
