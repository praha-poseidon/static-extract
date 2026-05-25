import { existsSync, statSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { Node, SyntaxKind } from "ts-morph";
import { createAstProject } from "./ast-model.mjs";
import { callName, callOwner, findAnchors } from "./find-executor.mjs";
import { parseRule, parseTrace } from "./rule-parser.mjs";
import { buildFields, evaluateLets, jsxAttribute, jsxTagName } from "./source-evaluator.mjs";
import { referenceValue, traceValue } from "./value-tracer.mjs";

const extractorRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export async function init(request) {
  const projectRoot = resolvePath(request.project);
  const workspaceDir = join(projectRoot, ".ser");
  const generatedRulesDir = join(workspaceDir, "generated");
  const rulesDir = join(workspaceDir, "rules");
  const outputDir = join(workspaceDir, "out");
  await mkdir(generatedRulesDir, { recursive: true });
  await mkdir(rulesDir, { recursive: true });
  await mkdir(outputDir, { recursive: true });
  return { status: "OK", extractor: "ts", projectRoot, workspaceDir, generatedRulesDir, rulesDir, outputDir };
}

export async function tryRules(request) {
  const report = await extract(request);
  return { status: report.resultCount > 0 ? "MATCH" : "NO_MATCH", extractor: "ts", resultCount: report.resultCount, results: report.results };
}

export async function diagnose(request) {
  const report = await extract(request);
  const sourceFiles = await resolveSourceFiles(request.sources);
  return {
    status: report.resultCount > 0 ? "MATCH" : "NO_MATCH",
    extractor: "ts",
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

export async function createSession(request) {
  const state = await createExtractionState(request);
  return {
    async tryRules(overrides = {}) {
      const nextRequest = mergeRequest(request, overrides);
      const report = await extractWithState(nextRequest, state);
      return { status: report.resultCount > 0 ? "MATCH" : "NO_MATCH", extractor: "ts", resultCount: report.resultCount, results: report.results };
    },
    async diagnose(overrides = {}) {
      const nextRequest = mergeRequest(request, overrides);
      const report = await extractWithState(nextRequest, state);
      const sourceFiles = await sessionSourceFiles(nextRequest, state);
      return {
        status: report.resultCount > 0 ? "MATCH" : "NO_MATCH",
        extractor: "ts",
        resultCount: report.resultCount,
        results: report.results,
        sourceFacts: report.resultCount > 0 ? [] : collectSourceFactsFromState(sourceFiles, nextRequest.project, state)
      };
    },
    async run(overrides = {}) {
      const nextRequest = mergeRequest(request, overrides);
      const report = await extractWithState(nextRequest, state);
      const lines = report.results.map((result) => JSON.stringify(result)).join("\n");
      if (nextRequest.outputFile) {
        await mkdir(dirname(resolvePath(nextRequest.outputFile)), { recursive: true });
        await writeFile(nextRequest.outputFile, lines ? lines + "\n" : "", "utf8");
      }
      return { resultCount: report.resultCount, outputFile: nextRequest.outputFile, results: report.results };
    },
    dispose() {
      state.astProject.models.clear();
      state.ruleCache.clear();
      state.traceCache.clear();
    }
  };
}

async function extract(request) {
  const state = await createExtractionState(request);
  return extractWithState(request, state);
}

async function createExtractionState(request) {
  const sourceFiles = await resolveSourceFiles(request.sources);
  return {
    sourceFiles,
    astProject: createAstProject(request.project, sourceFiles),
    ruleCache: new Map(),
    traceCache: new Map()
  };
}

async function extractWithState(request, state) {
  const ruleFiles = await resolveRuleFiles(request);
  if (ruleFiles.length === 0) {
    throw new Error("Pass at least one SER rule file, rule directory, or enable builtin rules.");
  }
  const rules = [];
  for (const file of ruleFiles) {
    rules.push(await parseRuleCached(file, state));
  }
  const traceOptions = await resolveTraceOptions(request, state);
  const sourceFiles = await sessionSourceFiles(request, state);
  const results = [];
  for (const sourceFile of sourceFiles) {
    const model = state.astProject.models.get(resolve(sourceFile));
    if (!model) {
      continue;
    }
    for (const rule of rules) {
      for (const anchor of findAnchors(rule, model)) {
        const values = evaluateLets(rule, anchor, traceOptions);
        results.push({
          rule: rule.name,
          factType: rule.factType,
          classifiers: {},
          fields: buildFields(rule, values),
          projectFilePath: projectFilePath(sourceFile, request.project),
          absoluteFilePath: sourceFile,
          startLine: lineAt(model.sourceText, anchor.index),
          endLine: lineAt(model.sourceText, anchor.index + anchor.raw.length - 1),
          enclosingSymbol: enclosingSymbol(anchor.node)
        });
      }
    }
  }
  return { resultCount: results.length, results };
}

async function parseRuleCached(file, state) {
  const resolved = resolvePath(file);
  if (!state.ruleCache.has(resolved)) {
    state.ruleCache.set(resolved, parseRule(await readFile(resolved, "utf8"), resolved));
  }
  return state.ruleCache.get(resolved);
}

async function resolveRuleFiles(request) {
  const files = [];
  files.push(...request.ruleFiles.map((file) => resolvePath(file)));
  for (const directory of request.ruleDirectories) {
    files.push(...await scanFiles(resolvePath(directory), [".ser"]));
  }
  if (request.builtinRules) {
    const manifest = JSON.parse(await readFile(join(extractorRoot, "rules/manifest.json"), "utf8"));
    files.push(...manifest.rules.map((rule) => join(extractorRoot, "rules", rule)));
  }
  return [...new Set(files)].sort();
}

async function resolveTraceOptions(request, state) {
  const traceFiles = [];
  for (const file of request.traceRuleFiles ?? []) {
    traceFiles.push(resolvePath(file));
  }
  for (const directory of request.traceRuleDirectories ?? []) {
    traceFiles.push(...await scanFiles(resolvePath(directory), [".ser"]));
  }
  const externalValues = request.externalValuesFile
    ? JSON.parse(await readFile(resolvePath(request.externalValuesFile), "utf8"))
    : {};
  if (!state) {
    const traceRuleSets = [];
    for (const file of [...new Set(traceFiles)].sort()) {
      traceRuleSets.push(parseTrace(await readFile(file, "utf8"), file));
    }
    return { traceRuleSets, externalValues };
  }
  const traceRuleSets = [];
  for (const file of [...new Set(traceFiles)].sort()) {
    if (!state.traceCache.has(file)) {
      state.traceCache.set(file, parseTrace(await readFile(file, "utf8"), file));
    }
    traceRuleSets.push(state.traceCache.get(file));
  }
  return { traceRuleSets, externalValues };
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
  const astProject = createAstProject(projectRoot, sourceFiles);
  return collectSourceFactsFromState(sourceFiles, projectRoot, { astProject });
}

function collectSourceFactsFromState(sourceFiles, projectRoot, state) {
  const facts = [];
  for (const sourceFile of sourceFiles) {
    const model = state.astProject.models.get(resolve(sourceFile));
    if (!model) {
      continue;
    }
    facts.push(...jsxFacts(model, sourceFile, projectRoot));
    facts.push(...callFacts(model, sourceFile, projectRoot));
    facts.push(...functionFacts(model, sourceFile, projectRoot));
    facts.push(...variableFacts(model, sourceFile, projectRoot));
    facts.push(...importFacts(model, sourceFile, projectRoot));
    facts.push(...classFacts(model, sourceFile, projectRoot));
  }
  return facts;
}

async function sessionSourceFiles(request, state) {
  if (!request.sources?.length) {
    return state.sourceFiles;
  }
  const sourceFiles = await resolveSourceFiles(request.sources);
  return sourceFiles.filter((file) => state.astProject.models.has(resolve(file)));
}

function mergeRequest(base, overrides) {
  return {
    ...base,
    ...overrides,
    ruleFiles: overrides.ruleFiles ?? base.ruleFiles,
    ruleDirectories: overrides.ruleDirectories ?? base.ruleDirectories,
    traceRuleFiles: overrides.traceRuleFiles ?? base.traceRuleFiles,
    traceRuleDirectories: overrides.traceRuleDirectories ?? base.traceRuleDirectories,
    sources: overrides.sources ?? base.sources
  };
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

function importFacts(model, sourceFile, projectRoot) {
  return findAnchors({ find: { kind: "import", name: "*" } }, model).map((anchor) => ({
    kind: "import",
    module: anchor.node.getModuleSpecifierValue(),
    defaultImport: anchor.node.getDefaultImport()?.getText() ?? "",
    namespaceImport: anchor.node.getNamespaceImport()?.getText() ?? "",
    namedImports: anchor.node.getNamedImports().map((namedImport) => namedImport.getName()),
    raw: anchor.raw,
    ...locationFields(model, sourceFile, projectRoot, anchor)
  }));
}

function classFacts(model, sourceFile, projectRoot) {
  return findAnchors({ find: { kind: "class", name: "*" } }, model).map((anchor) => ({
    kind: "class",
    name: anchor.name,
    extends: anchor.node.getExtends()?.getExpression().getText() ?? "",
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
