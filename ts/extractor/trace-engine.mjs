import { Node, SyntaxKind } from "ts-morph";
import { callName, callOwner } from "./find-executor.mjs";
import { evaluateSource } from "./source-evaluator.mjs";

export function resolveTrace(node, options = {}) {
  if (!node || !options.traceRuleSets?.length) {
    return "";
  }
  const target = traceTarget(node);
  if (!target) {
    return "";
  }
  for (const ruleSet of options.traceRuleSets) {
    for (const entry of ruleSet.entries ?? []) {
      if (entry.target !== target.kind || !matchesWhen(entry.when ?? [], target)) {
        continue;
      }
      const values = evaluateTraceLets(entry, target, options);
      const built = buildTraceFields(entry, values);
      const resolved = resolveExternalValue(built, options.externalValues);
      if (resolved !== "") {
        return resolved;
      }
      if (typeof built.value === "string") {
        return built.value;
      }
      if (typeof built.default === "string") {
        return built.default;
      }
    }
  }
  return "";
}

function traceTarget(node) {
  if (Node.isCallExpression(node)) {
    return {
      kind: "call",
      node,
      name: callName(node),
      owner: callOwner(node),
      raw: node.getText()
    };
  }
  if (Node.isParameterDeclaration(node)) {
    return {
      kind: "parameter",
      node,
      name: node.getName(),
      type: node.getTypeNode()?.getText() ?? "",
      raw: node.getText()
    };
  }
  if (Node.isVariableDeclaration(node) || Node.isPropertyDeclaration(node)) {
    return {
      kind: "field",
      node,
      name: node.getName(),
      type: node.getTypeNode()?.getText() ?? "",
      raw: node.getText()
    };
  }
  if (Node.isPropertyAccessExpression(node)) {
    return {
      kind: "field",
      node,
      name: node.getName(),
      type: "",
      raw: node.getText()
    };
  }
  if (Node.isFunctionDeclaration(node) || Node.isMethodDeclaration(node) || Node.isArrowFunction(node) || Node.isFunctionExpression(node)) {
    return {
      kind: "method",
      node,
      name: functionName(node),
      raw: node.getText()
    };
  }
  if (Node.isReturnStatement(node)) {
    return {
      kind: "return",
      node,
      name: "",
      raw: node.getText()
    };
  }
  if (Node.isBinaryExpression(node) && node.getOperatorToken().getKind() === SyntaxKind.EqualsToken) {
    return {
      kind: "assignment",
      node,
      name: assignmentFieldName(node),
      raw: node.getText()
    };
  }
  return null;
}

function matchesWhen(conditions, target) {
  return conditions.every((condition) => {
    if (condition.kind === "call") {
      return (!condition.name || condition.name === target.name) &&
        (!condition.owner || condition.owner === target.owner || `${condition.owner}.${condition.name}` === `${target.owner}.${target.name}`);
    }
    if (condition.kind === "callName") {
      return condition.value === target.name;
    }
    if (condition.kind === "callOwner") {
      return condition.value === target.owner;
    }
    if (condition.kind === "fieldName") {
      return condition.value === target.name;
    }
    if (condition.kind === "fieldType") {
      return matchesType(condition.value, target.type);
    }
    if (condition.kind === "parameterName") {
      return condition.value === target.name;
    }
    if (condition.kind === "parameterType") {
      return matchesType(condition.value, target.type);
    }
    if (condition.kind === "method") {
      return !condition.name || condition.name === target.name;
    }
    if (condition.kind === "methodName") {
      return condition.value === target.name;
    }
    if (condition.kind === "assignmentField") {
      return condition.value === target.name;
    }
    return true;
  });
}

function evaluateTraceLets(entry, target, options) {
  const values = {};
  for (const [name, spec] of Object.entries(entry.lets ?? {})) {
    const letSpec = normalizeLetSpec(spec);
    for (const source of letSpec.sources) {
      const value = evaluateSource(source, target, options);
      if (value !== "") {
        values[name] = applyLetMap(value, letSpec.map);
        break;
      }
    }
    if (!Object.hasOwn(values, name)) {
      values[name] = applyLetMap(letSpec.defaultValue ?? "", letSpec.map);
    }
  }
  return values;
}

function normalizeLetSpec(spec) {
  return Array.isArray(spec)
    ? { sources: spec, defaultValue: "", map: {} }
    : { sources: spec?.sources ?? [], defaultValue: spec?.defaultValue ?? "", map: spec?.map ?? {} };
}

function applyLetMap(value, entries = {}) {
  return Object.hasOwn(entries, value) ? entries[value] : value;
}

function buildTraceFields(entry, values) {
  const fields = {};
  for (const [name, spec] of Object.entries(entry.build ?? {})) {
    const buildSpec = Object.hasOwn(spec ?? {}, "value") ? spec : { value: spec, pipeline: [] };
    fields[name] = applyPipeline(evaluateBuildValue(buildSpec.value, values), buildSpec.pipeline ?? []);
  }
  return fields;
}

function evaluateBuildValue(value, values) {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value?.concat)) {
    return value.concat.map((part) => typeof part === "string" ? part : values[part.ref] ?? "").join("");
  }
  return Object.hasOwn(values, value.ref) ? values[value.ref] : "";
}

function applyPipeline(input, pipeline) {
  let value = String(input ?? "");
  for (const step of pipeline) {
    if (step.op === "normalize") {
      value = normalizeValue(value, step.name);
    } else if (step.op === "regex") {
      const match = value.match(new RegExp(step.pattern));
      value = match ? match[step.group] ?? "" : "";
    } else if (step.op === "replace") {
      value = value.replace(new RegExp(step.pattern, "g"), step.replacement);
    } else if (step.op === "map") {
      value = Object.hasOwn(step.entries ?? {}, value) ? step.entries[value] : value;
    }
  }
  return value;
}

function normalizeValue(value, name) {
  if (name === "trim") {
    return value.trim();
  }
  if (name === "upper") {
    return value.toUpperCase();
  }
  if (name === "lower") {
    return value.toLowerCase();
  }
  if (name === "slash" || name === "httpPath" || name === "routePath") {
    return normalizeSlashPath(value);
  }
  if (name === "fileRoutePath") {
    return normalizeFileRoutePath(value);
  }
  return value;
}

function normalizeSlashPath(value) {
  let path = value.trim().replace(/^https?:\/\/[^/]+/i, "");
  path = path.split("?")[0] ?? path;
  path = path.replace(/\\/g, "/").replace(/\/+/g, "/");
  path = path.replace(/:([A-Za-z_$][\w$]*)/g, "{param}");
  path = path.replace(/\$\{[^}]+}/g, "{param}");
  path = path.replace(/\{[^}/]+}/g, "{param}");
  path = path.replace(/\[\[\.{3}[^\]]+]]/g, "{param}");
  path = path.replace(/\[\.{3}[^\]]+]/g, "{param}");
  path = path.replace(/\[[^\]]+]/g, "{param}");
  if (path && !path.startsWith("/")) {
    path = `/${path}`;
  }
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

function normalizeFileRoutePath(value) {
  let path = value.trim().replace(/\\/g, "/");
  path = path.replace(/\.(tsx|ts|jsx|js|mjs|cjs)$/i, "");
  path = path.replace(/\/(route|page|index)$/i, "");
  const segments = path.split("/")
    .filter(Boolean)
    .filter((segment) => !segment.startsWith("(") && !segment.startsWith("@"));
  const apiIndex = segments.lastIndexOf("api");
  if (apiIndex >= 0) {
    path = `/${segments.slice(apiIndex).join("/")}`;
  } else if (segments[0] === "src") {
    path = `/${segments.slice(1).join("/")}`;
  }
  return normalizeSlashPath(path);
}

function resolveExternalValue(fields, externalValues = {}) {
  const namespace = fields.namespace ?? "default";
  const key = fields.key ?? fields.lookup ?? "";
  if (!key) {
    return "";
  }
  const namespaceValues = externalValues[namespace];
  if (!namespaceValues || !Object.hasOwn(namespaceValues, key)) {
    return "";
  }
  const value = namespaceValues[key];
  return Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "");
}

function functionName(node) {
  if (typeof node.getName === "function" && node.getName()) {
    return node.getName();
  }
  const variable = node.getFirstAncestorByKind?.(SyntaxKind.VariableDeclaration);
  return variable && typeof variable.getName === "function" ? variable.getName() : "";
}

function assignmentFieldName(node) {
  const left = node.getLeft();
  if (Node.isIdentifier(left)) {
    return left.getText();
  }
  if (Node.isPropertyAccessExpression(left)) {
    return left.getName();
  }
  if (Node.isElementAccessExpression(left)) {
    return left.getArgumentExpression()?.getText().replace(/^["']|["']$/g, "") ?? "";
  }
  return left.getText();
}

function matchesType(expected, actual = "") {
  return !expected || expected === actual || actual.endsWith(`.${expected}`);
}
