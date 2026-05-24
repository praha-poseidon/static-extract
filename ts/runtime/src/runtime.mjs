import { existsSync, statSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { Node, SyntaxKind } from "ts-morph";
import { createAstModel } from "./ast-model.mjs";
import { callName, callOwner, findAnchors } from "./find-executor.mjs";
import { parseRule } from "./rule-parser.mjs";
import { buildFields, evaluateLets, jsxAttribute, jsxTagName } from "./source-evaluator.mjs";
import { referenceValue, traceValue } from "./value-tracer.mjs";

const runtimeRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export async function init(request) {
  const projectRoot = resolvePath(request.project);
  const workspaceDir = join(projectRoot, ".ser");
  const generatedRulesDir = join(workspaceDir, "generated");
  const rulesDir = join(workspaceDir, "rules");
  const outputDir = join(workspaceDir, "out");
  await mkdir(generatedRulesDir, { recursive: true });
  await mkdir(rulesDir, { recursive: true });
  await mkdir(outputDir, { recursive: true });
  return { status: "OK", runtime: "ts", projectRoot, workspaceDir, generatedRulesDir, rulesDir, outputDir };
}

export async function tryRules(request) {
  const report = await extract(request);
  return { status: report.resultCount > 0 ? "MATCH" : "NO_MATCH", runtime: "ts", resultCount: report.resultCount, results: report.results };
}

export async function diagnose(request) {
  const report = await extract(request);
  const sourceFiles = await resolveSourceFiles(request.sources);
  return {
    status: report.resultCount > 0 ? "MATCH" : "NO_MATCH",
    runtime: "ts",
    resultCount: report.resultCount,
    results: report.results,
    sourceFacts: report.resultCount > 0 ? [] : await collectSourceFacts(sourceFiles, request.project)
  };
}

export async function run(request) {
  const report = await extract(request);
  const lines = report.results.map((result) => JSON.stringify(result)).join("\n");
  if (request.outputFile) {
    await mkdir(dirname(resolvePath(request.outputFile)), { recursive: true });
    await writeFile(request.outputFile, lines ? lines + "\n" : "", "utf8");
  }
  return { resultCount: report.resultCount, outputFile: request.outputFile, results: report.results };
}

async function extract(request) {
  const ruleFiles = await resolveRuleFiles(request);
  if (ruleFiles.length === 0) {
    throw new Error("Pass at least one SER rule file, rule directory, or enable builtin rules.");
  }
  const rules = [];
  for (const file of ruleFiles) {
    rules.push(parseRule(await readFile(file, "utf8"), file));
  }
  const sourceFiles = await resolveSourceFiles(request.sources);
  const results = [];
  for (const sourceFile of sourceFiles) {
    const sourceText = await readFile(sourceFile, "utf8");
    const model = createAstModel(sourceFile, sourceText);
    for (const rule of rules) {
      for (const anchor of findAnchors(rule, model)) {
        const values = evaluateLets(rule, anchor);
        results.push({
          rule: rule.name,
          factType: rule.factType,
          classifiers: {},
          fields: buildFields(rule, values),
          projectFilePath: projectFilePath(sourceFile, request.project),
          absoluteFilePath: sourceFile,
          startLine: lineAt(sourceText, anchor.index),
          endLine: lineAt(sourceText, anchor.index + anchor.raw.length - 1),
          enclosingSymbol: enclosingSymbol(anchor.node)
        });
      }
    }
  }
  return { resultCount: results.length, results };
}

async function resolveRuleFiles(request) {
  const files = [];
  files.push(...request.ruleFiles.map((file) => resolvePath(file)));
  for (const directory of request.ruleDirectories) {
    files.push(...await scanFiles(resolvePath(directory), [".ser"]));
  }
  if (request.builtinRules) {
    const manifest = JSON.parse(await readFile(join(runtimeRoot, "rules/manifest.json"), "utf8"));
    files.push(...manifest.rules.map((rule) => join(runtimeRoot, "rules", rule)));
  }
  return [...new Set(files)].sort();
}

async function resolveSourceFiles(sources) {
  const files = [];
  for (const source of sources) {
    const resolved = resolvePath(source);
    if (!existsSync(resolved)) {
      continue;
    }
    if (statSync(resolved).isDirectory()) {
      files.push(...await scanFiles(resolved, [".jsx", ".tsx", ".ts", ".js"]));
    } else {
      files.push(resolved);
    }
  }
  return files.sort();
}

async function scanFiles(root, extensions) {
  if (!existsSync(root)) {
    return [];
  }
  const files = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "target" || entry.name === ".git" || entry.name === ".ser") {
      continue;
    }
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...await scanFiles(path, extensions));
    } else if (entry.isFile() && extensions.includes(extname(entry.name))) {
      files.push(path);
    }
  }
  return files;
}

async function collectSourceFacts(sourceFiles, projectRoot) {
  const facts = [];
  for (const sourceFile of sourceFiles) {
    const sourceText = await readFile(sourceFile, "utf8");
    const model = createAstModel(sourceFile, sourceText);
    facts.push(...jsxFacts(model, sourceFile, projectRoot));
    facts.push(...callFacts(model, sourceFile, projectRoot));
    facts.push(...functionFacts(model, sourceFile, projectRoot));
    facts.push(...variableFacts(model, sourceFile, projectRoot));
  }
  return facts;
}

function jsxFacts(model, sourceFile, projectRoot) {
  return findAnchors({ find: { kind: "jsx", name: "*" } }, model).map((anchor) => ({
    kind: "jsx",
    name: anchor.name,
    text: jsxText(anchor.node),
    events: jsxEvents(anchor.node),
    props: jsxProps(anchor.node),
    raw: anchor.raw,
    ...locationFields(model, sourceFile, projectRoot, anchor)
  }));
}

function callFacts(model, sourceFile, projectRoot) {
  return findAnchors({ find: { kind: "call", name: "*" } }, model).map((anchor) => ({
    kind: "call",
    name: callName(anchor.node),
    owner: callOwner(anchor.node),
    raw: anchor.raw,
    ...locationFields(model, sourceFile, projectRoot, anchor)
  }));
}

function functionFacts(model, sourceFile, projectRoot) {
  return findAnchors({ find: { kind: "function", name: "*" } }, model).map((anchor) => ({
    kind: "function",
    name: anchor.name,
    raw: anchor.raw,
    ...locationFields(model, sourceFile, projectRoot, anchor)
  }));
}

function variableFacts(model, sourceFile, projectRoot) {
  return findAnchors({ find: { kind: "variable", name: "*" } }, model).map((anchor) => ({
    kind: "variable",
    name: anchor.name,
    value: traceValue(anchor.node.getInitializer()),
    raw: anchor.raw,
    ...locationFields(model, sourceFile, projectRoot, anchor)
  }));
}

function locationFields(model, sourceFile, projectRoot, anchor) {
  return {
    projectFilePath: projectFilePath(sourceFile, projectRoot),
    absoluteFilePath: sourceFile,
    startLine: lineAt(model.sourceText, anchor.index),
    endLine: lineAt(model.sourceText, anchor.index + anchor.raw.length - 1),
    enclosingSymbol: enclosingSymbol(anchor.node)
  };
}

function jsxText(node) {
  if (!Node.isJsxElement(node)) {
    return "";
  }
  return node.getJsxChildren()
    .map((child) => {
      if (Node.isJsxText(child)) {
        return child.getText();
      }
      if (Node.isJsxExpression(child) && child.getExpression()) {
        return traceValue(child.getExpression());
      }
      return "";
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function jsxEvents(node) {
  const events = {};
  for (const [name, value] of Object.entries(jsxProps(node))) {
    if (name.startsWith("on") && value) {
      events[name] = value;
    }
  }
  return events;
}

function jsxProps(node) {
  const out = {};
  const attributes = Node.isJsxElement(node) ? node.getOpeningElement().getAttributes() : node.getAttributes();
  for (const attribute of attributes) {
    if (!Node.isJsxAttribute(attribute)) {
      continue;
    }
    const initializer = attribute.getInitializer();
    if (!initializer) {
      out[attribute.getNameNode().getText()] = "";
    } else if (Node.isStringLiteral(initializer)) {
      out[attribute.getNameNode().getText()] = initializer.getLiteralText();
    } else if (Node.isJsxExpression(initializer)) {
      out[attribute.getNameNode().getText()] = referenceValue(initializer.getExpression());
    } else {
      out[attribute.getNameNode().getText()] = initializer.getText();
    }
  }
  return out;
}

function enclosingSymbol(node) {
  const functionLike = node.getFirstAncestor((ancestor) =>
    [SyntaxKind.FunctionDeclaration, SyntaxKind.FunctionExpression, SyntaxKind.ArrowFunction, SyntaxKind.MethodDeclaration]
      .includes(ancestor.getKind()));
  if (!functionLike) {
    return null;
  }
  if (typeof functionLike.getName === "function" && functionLike.getName()) {
    return functionLike.getName();
  }
  const variable = functionLike.getFirstAncestorByKind(SyntaxKind.VariableDeclaration);
  return variable && typeof variable.getName === "function" ? variable.getName() : null;
}

function lineAt(source, index) {
  return source.slice(0, index).split("\n").length;
}

function projectFilePath(sourceFile, projectRoot) {
  if (!projectRoot) {
    return sourceFile.split(sep).join("/");
  }
  return relative(resolvePath(projectRoot), sourceFile).split(sep).join("/");
}

function resolvePath(path) {
  return isAbsolute(path) ? resolve(path) : resolve(process.cwd(), path);
}
