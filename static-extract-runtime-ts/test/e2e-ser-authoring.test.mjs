import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync } from "node:fs";
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
assert.equal(orchestrationReport.extractReport.runReport.resultCount, 2);
assert.ok(existsSync(resolve(orchestratedDir, "generated.ser")));
assert.ok(existsSync(resolve(orchestratedDir, "facts.jsonl")));
assert.ok(existsSync(resolve(orchestratedDir, "report.json")));

const orchestratedActual = readFileSync(resolve(orchestratedDir, "facts.jsonl"), "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line));
const orchestratedExpected = readFileSync(resolve(orchestratedProject, "expected.jsonl"), "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line.replaceAll("${EXAMPLE_DIR}", orchestratedProject)));
assert.deepEqual(orchestratedActual, orchestratedExpected);

const javaAnnotationRequest = resolve(root, "test/fixtures/ser-author-java-annotation/request.txt");
const reactActionRequest = resolve(root, "test/fixtures/ser-author-react-action/request.txt");
const reactActionRule = resolve(tempDir, "react-action.ser");
execFileSync("node", [
  resolve(repo, "skills/ser-author/scripts/generate_ser.mjs"),
  "--runtime", "react",
  "--request", reactActionRequest,
  "--out", reactActionRule
], { encoding: "utf8" });
const reactActionGenerated = readFileSync(reactActionRule, "utf8");
assert.match(reactActionGenerated, /fact ui_action/);
assert.match(reactActionGenerated, /from prop onClick take reference/);

const reactApiRequest = resolve(root, "test/fixtures/ser-author-react-api/request.txt");
const reactApiRule = resolve(tempDir, "react-api.ser");
execFileSync("node", [
  resolve(repo, "skills/ser-author/scripts/generate_ser.mjs"),
  "--runtime", "react",
  "--request", reactApiRequest,
  "--out", reactApiRule
], { encoding: "utf8" });
const reactApiGenerated = readFileSync(reactApiRule, "utf8");
assert.match(reactApiGenerated, /fact frontend_api_call/);
assert.match(reactApiGenerated, /find call axios/);

const javaGeneratedRule = resolve(tempDir, "java-annotation.ser");
execFileSync("node", [
  resolve(repo, "skills/ser-author/scripts/generate_ser.mjs"),
  "--runtime", "java-jdt",
  "--request", javaAnnotationRequest,
  "--out", javaGeneratedRule
], { encoding: "utf8" });
const javaGenerated = readFileSync(javaGeneratedRule, "utf8");
assert.match(javaGenerated, /fact backend_endpoint/);
assert.match(javaGenerated, /find method with annotation @RouteGet/);

const javaConfigRequest = resolve(root, "test/fixtures/ser-author-java-config/request.txt");
const javaConfigRule = resolve(tempDir, "java-config.ser");
execFileSync("node", [
  resolve(repo, "skills/ser-author/scripts/generate_ser.mjs"),
  "--runtime", "java-jdt",
  "--request", javaConfigRequest,
  "--out", javaConfigRule
], { encoding: "utf8" });
const javaConfigGenerated = readFileSync(javaConfigRule, "utf8");
assert.match(javaConfigGenerated, /fact config_key/);
assert.match(javaConfigGenerated, /find field with annotation @ConfigProperty/);
