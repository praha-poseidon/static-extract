import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

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
  return {
    status: "OK",
    runtime: "ts",
    projectRoot,
    workspaceDir,
    generatedRulesDir,
    rulesDir,
    outputDir
  };
}

export async function tryRules(request) {
  const report = await extract(request);
  return {
    status: report.resultCount > 0 ? "MATCH" : "NO_MATCH",
    runtime: "ts",
    resultCount: report.resultCount,
    results: report.results
  };
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
  return {
    resultCount: report.resultCount,
    outputFile: request.outputFile,
    results: report.results
  };
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
    const source = await readFile(sourceFile, "utf8");
    for (const rule of rules) {
      if (rule.findKind === "jsx" && rule.findName === "button") {
        results.push(...extractReactButtons(rule, source, sourceFile, request.project));
      } else if (rule.findKind === "call" && (rule.findName === "fetch" || rule.findName === "axios")) {
        results.push(...extractApiCalls(rule, source, sourceFile, request.project));
      }
    }
  }

  return {
    resultCount: results.length,
    results
  };
}

async function resolveRuleFiles(request) {
  const files = [];
  files.push(...request.ruleFiles.map((file) => resolvePath(file)));
  for (const directory of request.ruleDirectories) {
    files.push(...await scanFiles(resolvePath(directory), [".ser"]));
  }
  if (request.builtinRules) {
    const manifestFile = join(runtimeRoot, "rules/manifest.json");
    const manifest = JSON.parse(await readFile(manifestFile, "utf8"));
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
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...await scanFiles(path, extensions));
    } else if (entry.isFile() && extensions.includes(extname(entry.name))) {
      files.push(path);
    }
  }
  return files;
}

function parseRule(source, file) {
  const ruleName = matchRequired(source, /^rule\s+"([^"]+)"/m, "rule name", file);
  const factType = matchRequired(source, /^fact\s+([A-Za-z_][\w$-]*)/m, "fact type", file);
  const find = matchRequired(source, /^find\s+([A-Za-z_][\w$-]*)\s+([A-Za-z_][\w$-]*)/m, "find", file);
  const buildSource = matchRequired(source, /build\s*\{([\s\S]*?)\}/m, "build block", file);
  const fields = {};
  for (const line of buildSource.split(/\r?\n/)) {
    const match = line.trim().match(/^([A-Za-z_][\w$-]*)\s*:\s*(.+)$/);
    if (!match) {
      continue;
    }
    const [, name, rawValue] = match;
    const quoted = rawValue.match(/^"((?:\\"|[^"])*)"$/);
    fields[name] = quoted ? quoted[1].replace(/\\"/g, "\"") : { ref: rawValue.trim() };
  }
  return {
    name: ruleName,
    factType,
    findKind: find[1],
    findName: find[2],
    fields
  };
}

function matchRequired(source, regex, label, file) {
  const match = source.match(regex);
  if (!match) {
    throw new Error(`Failed to parse ${label} in SER rule: ${file}`);
  }
  return match.length === 2 ? match[1] : match;
}

function extractReactButtons(rule, source, sourceFile, projectRoot) {
  const results = [];
  const buttonPattern = /<button\b([^>]*)>([\s\S]*?)<\/button>/g;
  let match;
  while ((match = buttonPattern.exec(source)) !== null) {
    const label = readButtonText(match[2]);
    if (!label) {
      continue;
    }
    const handler = readButtonHandler(match[1]);
    const startLine = lineAt(source, match.index);
    const endLine = lineAt(source, match.index + match[0].length - 1);
    const fields = {};
    for (const [name, value] of Object.entries(rule.fields)) {
      if (typeof value === "object" && value.ref === "label") {
        fields[name] = label;
      } else if (typeof value === "object" && value.ref === "handler") {
        fields[name] = handler;
      } else {
        fields[name] = value;
      }
    }
    results.push({
      rule: rule.name,
      factType: rule.factType,
      classifiers: {},
      fields,
      projectFilePath: projectFilePath(sourceFile, projectRoot),
      absoluteFilePath: sourceFile,
      startLine,
      endLine,
      enclosingSymbol: enclosingComponent(source, match.index)
    });
  }
  return results;
}

function extractApiCalls(rule, source, sourceFile, projectRoot) {
  const constants = collectStringConstants(source);
  const calls = rule.findName === "fetch" ? findFetchCalls(source, constants) : findAxiosCalls(source, constants);
  return calls.map((call) => {
    const fields = {};
    for (const [name, value] of Object.entries(rule.fields)) {
      if (typeof value === "object" && Object.hasOwn(call.values, value.ref)) {
        fields[name] = call.values[value.ref];
      } else {
        fields[name] = value;
      }
    }
    return {
      rule: rule.name,
      factType: rule.factType,
      classifiers: {},
      fields,
      projectFilePath: projectFilePath(sourceFile, projectRoot),
      absoluteFilePath: sourceFile,
      startLine: lineAt(source, call.index),
      endLine: lineAt(source, call.index + call.raw.length - 1),
      enclosingSymbol: enclosingComponent(source, call.index)
    };
  });
}

function findFetchCalls(source, constants) {
  const calls = [];
  const pattern = /\bfetch\s*\(\s*([^,\n\r)]*)(?:,\s*([\s\S]*?))?\)/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    const path = resolveTsValue(match[1], constants);
    if (!path) {
      continue;
    }
    calls.push({
      raw: match[0],
      index: match.index,
      values: {
        owner: "global",
        name: "fetch",
        method: fetchMethod(match[2]),
        path
      }
    });
  }
  return calls;
}

function findAxiosCalls(source, constants) {
  const calls = [];
  const pattern = /\baxios\.(get|post|put|patch|delete)\s*\(\s*([^,\n\r)]*)/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    const path = resolveTsValue(match[2], constants);
    if (!path) {
      continue;
    }
    calls.push({
      raw: match[0],
      index: match.index,
      values: {
        owner: "axios",
        name: match[1],
        method: match[1].toUpperCase(),
        path
      }
    });
  }
  return calls;
}

function fetchMethod(optionsSource) {
  if (!optionsSource) {
    return "GET";
  }
  const method = optionsSource.match(/\bmethod\s*:\s*["'`]([A-Za-z]+)["'`]/);
  return method ? method[1].toUpperCase() : "GET";
}

function collectStringConstants(source) {
  const constants = new Map();
  const pattern = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(["'`])([^"'`$]*)\2/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    constants.set(match[1], match[3]);
  }
  return constants;
}

function resolveTsValue(raw, constants) {
  const value = raw.trim();
  const literal = value.match(/^(["'`])([^"'`$]*)\1$/);
  if (literal) {
    return literal[2];
  }
  if (constants.has(value)) {
    return constants.get(value);
  }
  return value ? `{${value}}` : "";
}

function readButtonText(inner) {
  const expression = inner.trim().match(/^\{\s*([^}]+?)\s*\}$/);
  if (expression) {
    return `{${expression[1].trim()}}`;
  }
  return inner.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function readButtonHandler(attributes) {
  const match = attributes.match(/\bonClick\s*=\s*\{\s*([^}]+?)\s*\}/);
  if (!match) {
    return "";
  }
  return normalizeHandlerReference(match[1].trim());
}

function normalizeHandlerReference(value) {
  const callThrough = value.match(/^\(\s*\)\s*=>\s*([A-Za-z_$][\w$.]*)\s*\(/);
  if (callThrough) {
    return callThrough[1];
  }
  const identifier = value.match(/^([A-Za-z_$][\w$.]*)$/);
  return identifier ? identifier[1] : `{${value}}`;
}

async function collectSourceFacts(sourceFiles, projectRoot) {
  const facts = [];
  for (const sourceFile of sourceFiles) {
    const source = await readFile(sourceFile, "utf8");
    const buttonPattern = /<button\b([^>]*)>([\s\S]*?)<\/button>/g;
    let match;
    while ((match = buttonPattern.exec(source)) !== null) {
      const handler = readButtonHandler(match[1]);
      facts.push({
        kind: "jsx",
        name: "button",
        text: readButtonText(match[2]),
        events: handler ? { onClick: handler } : {},
        raw: match[0],
        projectFilePath: projectFilePath(sourceFile, projectRoot),
        absoluteFilePath: sourceFile,
        startLine: lineAt(source, match.index),
        endLine: lineAt(source, match.index + match[0].length - 1),
        enclosingSymbol: enclosingComponent(source, match.index)
      });
    }
    for (const call of [...findFetchCalls(source, collectStringConstants(source)), ...findAxiosCalls(source, collectStringConstants(source))]) {
      facts.push({
        kind: "call",
        name: call.values.name,
        owner: call.values.owner,
        method: call.values.method,
        path: call.values.path,
        raw: call.raw,
        projectFilePath: projectFilePath(sourceFile, projectRoot),
        absoluteFilePath: sourceFile,
        startLine: lineAt(source, call.index),
        endLine: lineAt(source, call.index + call.raw.length - 1),
        enclosingSymbol: enclosingComponent(source, call.index)
      });
    }
  }
  return facts;
}

function lineAt(source, index) {
  return source.slice(0, index).split("\n").length;
}

function enclosingComponent(source, index) {
  const before = source.slice(0, index);
  const functionMatches = [...before.matchAll(/(?:export\s+)?function\s+([A-Z][A-Za-z0-9_]*)\s*\(/g)];
  if (functionMatches.length > 0) {
    return functionMatches.at(-1)[1];
  }
  const constMatches = [...before.matchAll(/(?:export\s+)?const\s+([A-Z][A-Za-z0-9_]*)\s*=/g)];
  if (constMatches.length > 0) {
    return constMatches.at(-1)[1];
  }
  return null;
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
