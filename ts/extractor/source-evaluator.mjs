import { Node, SyntaxKind } from "ts-morph";
import { callName, callOwner, exportEntries } from "./find-executor.mjs";
import { referenceValue, traceValue } from "./value-tracer.mjs";

export function evaluateLets(rule, anchor, options = {}) {
  const values = {};
  for (const [name, spec] of Object.entries(rule.lets)) {
    const letSpec = normalizeLetSpec(spec);
    for (const source of letSpec.sources) {
      const value = evaluateSource(source, anchor, options);
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

export function buildFields(rule, values) {
  const fields = {};
  for (const [name, spec] of Object.entries(rule.build)) {
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
  const segments = path.split("/").filter(Boolean);
  const apiIndex = segments.lastIndexOf("api");
  if (apiIndex >= 0) {
    path = `/${segments.slice(apiIndex).join("/")}`;
  } else if (segments[0] === "src") {
    path = `/${segments.slice(1).join("/")}`;
  }
  return normalizeSlashPath(path);
}

export function evaluateSource(source, anchor, options = {}) {
  if ((source.element === "children" || source.element === "jsx") && anchor.kind === "jsx") {
    return takeJsxValue(anchor.node, source.take, options);
  }
  if (source.element === "prop" && anchor.kind === "jsx") {
    return takePropValue(jsxAttribute(anchor.node, source.name), source.take, options);
  }
  if (source.element === "argument" && anchor.kind === "call") {
    return takeArgumentValue(anchor.node.getArguments()[source.index], source.take, options);
  }
  if (source.element === "call" && anchor.kind === "call") {
    return takeCallValue(anchor.node, source.take);
  }
  if (source.element === "handler" && anchor.kind === "call") {
    return takeHandlerValue(anchor.node, source.take, source.name);
  }
  if (source.element === "file") {
    return takeFileValue(anchor, source.take);
  }
  if (source.element === "export" && anchor.kind === "file") {
    return takeFileExportValue(anchor.node, source.name, source.take);
  }
  if ((source.element === "decorator" || source.element === "annotation") && source.on) {
    return takeRelatedDecoratorValue(anchor.node, source.on, source.name, source.take, options);
  }
  if (source.element === "decorator" && anchor.kind === "decorator") {
    return takeDecoratorValue(anchor.node, source.take, options);
  }
  if (source.element === "argument" && anchor.kind === "assignment") {
    return takeAssignmentValue(anchor.node, source.take, options);
  }
  if (source.element === "return" && anchor.kind === "function") {
    return takeReturnValue(anchor.node, source.take, options);
  }
  if (source.element === "return" && anchor.kind === "return") {
    return takeReturnStatementValue(anchor.node, source.take, options);
  }
  if (source.element === "method" && anchor.kind === "method") {
    return takeMethodValue(anchor.node, source.take);
  }
  if (source.element === "field" && anchor.kind === "field") {
    return takeFieldValue(anchor.node, source.take, options);
  }
  if (source.element === "parameter" && anchor.kind === "parameter") {
    return takeParameterValue(anchor.node, source.take);
  }
  if (source.element === "assignment" && anchor.kind === "assignment") {
    return takeAssignmentValue(anchor.node, source.take, options);
  }
  if (source.element === "variable" && anchor.kind === "variable") {
    return takeVariableValue(anchor.node, source.take, options);
  }
  if (source.element === "import" && anchor.kind === "import") {
    return takeImportValue(anchor.node, source.take);
  }
  if (source.element === "class" && anchor.kind === "class") {
    return takeClassValue(anchor.node, source.take);
  }
  if (source.element === "export" && anchor.kind === "export") {
    return takeExportValue(anchor, source.take);
  }
  return "";
}

function takeRelatedDecoratorValue(node, ownerKind, name, take, options) {
  const owner = relatedOwner(node, ownerKind);
  if (!owner || typeof owner.getDecorators !== "function") {
    return "";
  }
  const expected = normalizeDecoratorName(name);
  const decorator = owner.getDecorators().find((item) => !expected || item.getName() === expected);
  return decorator ? takeDecoratorValue(decorator, take, options) : "";
}

function relatedOwner(node, ownerKind) {
  if (ownerKind === "class") {
    return Node.isClassDeclaration(node) ? node : node.getFirstAncestorByKind(SyntaxKind.ClassDeclaration);
  }
  if (ownerKind === "method") {
    return Node.isMethodDeclaration(node) ? node : node.getFirstAncestorByKind(SyntaxKind.MethodDeclaration);
  }
  if (ownerKind === "field") {
    return Node.isPropertyDeclaration(node) ? node : node.getFirstAncestorByKind(SyntaxKind.PropertyDeclaration);
  }
  if (ownerKind === "parameter") {
    return Node.isParameterDeclaration(node) ? node : node.getFirstAncestorByKind(SyntaxKind.Parameter);
  }
  return null;
}

function normalizeDecoratorName(name = "") {
  return name.replace(/^@/, "").replace(/^\*/, "");
}

function takeJsxValue(node, take, options) {
  if (take === "name") {
    return jsxTagName(node);
  }
  if (take === "raw") {
    return node.getText();
  }
  if (take === "text" || take === "value") {
    if (!Node.isJsxElement(node)) {
      return "";
    }
    return node.getJsxChildren()
      .map((child) => {
        if (Node.isJsxText(child)) {
          return child.getText();
        }
        if (Node.isJsxExpression(child) && child.getExpression()) {
          return traceValue(child.getExpression(), options);
        }
        return "";
      })
      .join("")
      .replace(/\s+/g, " ")
      .trim();
  }
  return "";
}

function takePropValue(attribute, take, options) {
  if (!attribute) {
    return "";
  }
  if (take === "name") {
    return jsxAttributeName(attribute);
  }
  if (take === "raw") {
    return attribute.getText();
  }
  const initializer = attribute.getInitializer();
  if (!initializer) {
    return "";
  }
  if (Node.isStringLiteral(initializer)) {
    return initializer.getLiteralText();
  }
  if (Node.isJsxExpression(initializer)) {
    const expression = initializer.getExpression();
    return take === "reference" ? referenceValue(expression) : traceValue(expression, options);
  }
  return initializer.getText();
}

function takeArgumentValue(argument, take, options) {
  if (!argument) {
    return "";
  }
  if (take === "raw" || take === "name") {
    return argument.getText();
  }
  if (take === "value") {
    return traceValue(argument, options);
  }
  return "";
}

function takeCallValue(node, take) {
  if (take === "name") {
    return callName(node);
  }
  if (take === "owner") {
    return callOwner(node);
  }
  if (take === "raw") {
    return node.getText();
  }
  if (take === "callee") {
    return node.getExpression().getText();
  }
  if (take === "method") {
    return callName(node);
  }
  return "";
}

function takeHandlerValue(node, take, selector) {
  const args = node.getArguments();
  const arg = selector === "last"
    ? lastFunctionLikeArgument(args)
    : args[Number(selector ?? args.length - 1)] ?? lastFunctionLikeArgument(args);
  if (!arg) {
    return "";
  }
  if (take === "raw") {
    return arg.getText();
  }
  if (take === "name" || take === "reference" || take === "value") {
    return referenceValue(arg);
  }
  return "";
}

function takeFileValue(anchor, take) {
  const path = anchor.filePath ?? anchor.name ?? sourceFilePath(anchor.node);
  if (take === "path" || take === "value" || take === "raw") {
    return path;
  }
  if (take === "name") {
    return path.split("/").at(-1) ?? path;
  }
  if (take === "dir") {
    return path.split("/").slice(0, -1).join("/");
  }
  if (take === "extension") {
    const name = path.split("/").at(-1) ?? "";
    const index = name.indexOf(".");
    return index >= 0 ? name.slice(index) : "";
  }
  return "";
}

function sourceFilePath(node) {
  return node?.getSourceFile?.()?.getFilePath?.()?.split("\\").join("/") ?? "";
}

function takeDecoratorValue(node, take, options) {
  if (take === "name") {
    return node.getName();
  }
  if (take === "raw") {
    return node.getText();
  }
  const args = node.getArguments();
  const first = args[0];
  if (take === "value") {
    return first ? traceValue(first, options) : "";
  }
  const attr = take.match(/^attr\((.+)\)$/);
  if (attr) {
    const index = Number(attr[1]);
    const argument = Number.isFinite(index) ? args[index] : first;
    return argument ? traceValue(argument, options) : "";
  }
  return "";
}

function lastFunctionLikeArgument(args) {
  for (let index = args.length - 1; index >= 0; index -= 1) {
    const arg = args[index];
    if (Node.isIdentifier(arg) || Node.isPropertyAccessExpression(arg) || Node.isArrowFunction(arg) || Node.isFunctionExpression(arg) || Node.isCallExpression(arg)) {
      return arg;
    }
  }
  return null;
}

function takeMethodValue(node, take) {
  if (take === "name") {
    return typeof node.getName === "function" ? node.getName() ?? "" : "";
  }
  if (take === "raw") {
    return node.getText();
  }
  return "";
}

function takeFieldValue(node, take, options) {
  if (take === "name") {
    return node.getName();
  }
  if (take === "type") {
    return node.getTypeNode()?.getText() ?? "";
  }
  if (take === "raw") {
    return node.getText();
  }
  if (take === "value") {
    return traceValue(node.getInitializer?.(), options);
  }
  return "";
}

function takeParameterValue(node, take) {
  if (take === "name") {
    return node.getName();
  }
  if (take === "type") {
    return node.getTypeNode()?.getText() ?? "";
  }
  if (take === "raw") {
    return node.getText();
  }
  return "";
}

function takeAssignmentValue(node, take, options) {
  if (take === "name") {
    const left = node.getLeft();
    return Node.isPropertyAccessExpression(left) ? left.getName() : left.getText();
  }
  if (take === "raw") {
    return node.getText();
  }
  if (take === "value") {
    return traceValue(node.getRight(), options);
  }
  return "";
}

function takeReturnValue(node, take, options) {
  const expression = firstReturnExpression(node);
  if (!expression) {
    return "";
  }
  if (take === "raw") {
    return expression.getText();
  }
  if (take === "value") {
    return traceValue(expression, options);
  }
  return "";
}

function takeReturnStatementValue(node, take, options) {
  const expression = node.getExpression();
  if (!expression) {
    return "";
  }
  if (take === "raw") {
    return expression.getText();
  }
  if (take === "value") {
    return traceValue(expression, options);
  }
  return "";
}

function takeVariableValue(node, take, options) {
  if (take === "name") {
    return node.getName();
  }
  if (take === "raw") {
    return node.getText();
  }
  if (take === "value") {
    return traceValue(node.getInitializer(), options);
  }
  return "";
}

function takeImportValue(node, take) {
  if (take === "module" || take === "value") {
    return node.getModuleSpecifierValue();
  }
  if (take === "default") {
    return node.getDefaultImport()?.getText() ?? "";
  }
  if (take === "namespace") {
    return node.getNamespaceImport()?.getText() ?? "";
  }
  if (take === "named") {
    return node.getNamedImports().map((namedImport) => namedImport.getName()).join(",");
  }
  if (take === "raw") {
    return node.getText();
  }
  return "";
}

function takeClassValue(node, take) {
  if (take === "name" || take === "value") {
    return node.getName() ?? "";
  }
  if (take === "extends") {
    return node.getExtends()?.getExpression().getText() ?? "";
  }
  if (take === "raw") {
    return node.getText();
  }
  return "";
}

function takeFileExportValue(sourceFile, name, take) {
  const expected = name || "*";
  const entry = exportEntries(sourceFile).find((entry) => expected === "*" || entry.name === expected);
  return entry ? takeExportEntryValue(entry, take) : "";
}

function takeExportValue(anchor, take) {
  const entry = anchor.exportInfo ?? exportEntryFromNode(anchor.node, anchor.name);
  return entry ? takeExportEntryValue(entry, take) : "";
}

function takeExportEntryValue(entry, take) {
  if (take === "name") {
    return entry.name;
  }
  if (take === "reference" || take === "value") {
    return take === "value" ? entry.value : entry.reference;
  }
  if (take === "raw") {
    return entry.raw;
  }
  if (take === "kind" || take === "type") {
    return entry.kind;
  }
  if (take === "module") {
    return entry.module;
  }
  return "";
}

function exportEntryFromNode(node, name) {
  return exportEntries(node.getSourceFile()).find((entry) => entry.node === node && entry.name === name)
    ?? exportEntries(node.getSourceFile()).find((entry) => entry.node === node)
    ?? null;
}

export function jsxAttribute(node, name) {
  const attributes = Node.isJsxElement(node) ? node.getOpeningElement().getAttributes() : node.getAttributes();
  return attributes.find((attribute) => Node.isJsxAttribute(attribute) && jsxAttributeName(attribute) === name);
}

function jsxAttributeName(attribute) {
  return attribute.getNameNode().getText();
}

export function jsxTagName(node) {
  return Node.isJsxElement(node)
    ? node.getOpeningElement().getTagNameNode().getText()
    : node.getTagNameNode().getText();
}

function firstReturnExpression(node) {
  if (Node.isArrowFunction(node) && !Node.isBlock(node.getBody())) {
    return node.getBody();
  }
  return node.getDescendantsOfKind(SyntaxKind.ReturnStatement)[0]?.getExpression();
}
