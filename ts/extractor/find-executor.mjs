import { Node, SyntaxKind } from "ts-morph";
import { relative } from "node:path";

export function findAnchors(rule, model) {
  return annotateAnchors(findAnchorsForRule(rule, model), model);
}

function findAnchorsForRule(rule, model) {
  const { kind, name } = rule.find;
  if (kind === "file") {
    return fileAnchors(model, name);
  }
  if (kind === "jsx") {
    return jsxAnchors(model, name);
  }
  if (kind === "call") {
    return callAnchors(model, name);
  }
  if (kind === "function") {
    return functionAnchors(model, name);
  }
  if (kind === "variable") {
    return variableAnchors(model, name);
  }
  if (kind === "import") {
    return importAnchors(model, name);
  }
  if (kind === "class") {
    return classAnchors(model, name);
  }
  if (kind === "method") {
    return methodAnchors(model, name);
  }
  if (kind === "field") {
    return fieldAnchors(model, name);
  }
  if (kind === "parameter") {
    return parameterAnchors(model, name);
  }
  if (kind === "assignment") {
    return assignmentAnchors(model, name);
  }
  if (kind === "return") {
    return returnAnchors(model, name);
  }
  if (kind === "decorator") {
    return decoratorAnchors(model, name);
  }
  if (kind === "export") {
    return exportAnchors(model, name);
  }
  return [];
}

function annotateAnchors(anchors, model) {
  const filePath = model.projectRoot
    ? relative(model.projectRoot, model.sourceFile.getFilePath()).split("\\").join("/")
    : model.sourceFile.getFilePath().split("\\").join("/");
  return anchors.map((anchor) => ({ filePath, ...anchor }));
}

export function matchesAnchorWhen(anchor, conditions = []) {
  return conditions.every((condition) => {
    if (condition.kind === "call") {
      return anchor.kind === "call" &&
        (!condition.name || condition.name === callName(anchor.node)) &&
        (!condition.owner || condition.owner === callOwner(anchor.node) || condition.owner === callCallee(anchor.node));
    }
    if (condition.kind === "callName") {
      return anchor.kind === "call" && condition.value === callName(anchor.node);
    }
    if (condition.kind === "callOwner") {
      return anchor.kind === "call" && condition.value === callOwner(anchor.node);
    }
    if (condition.kind === "method" || condition.kind === "methodName") {
      return anchor.kind === "method" && (!condition.value || condition.value === anchor.name) && (!condition.name || condition.name === anchor.name);
    }
    if (condition.kind === "fieldName") {
      return anchor.kind === "field" && condition.value === anchor.name;
    }
    if (condition.kind === "fieldType") {
      return anchor.kind === "field" && matchesType(condition.value, anchor.node.getTypeNode?.()?.getText() ?? "");
    }
    if (condition.kind === "parameterName") {
      return anchor.kind === "parameter" && condition.value === anchor.name;
    }
    if (condition.kind === "parameterType") {
      return anchor.kind === "parameter" && matchesType(condition.value, anchor.node.getTypeNode?.()?.getText() ?? "");
    }
    if (condition.kind === "assignmentField") {
      return anchor.kind === "assignment" && condition.value === anchor.name;
    }
    return true;
  });
}

function fileAnchors(model, name) {
  const filePath = model.projectRoot
    ? relative(model.projectRoot, model.sourceFile.getFilePath()).split("\\").join("/")
    : model.sourceFile.getFilePath().split("\\").join("/");
  const baseName = filePath.split("/").at(-1);
  const stem = baseName?.split(".")[0];
  if (!matches(filePath, name) && !matches(baseName, name) && !matches(stem, name)) {
    return [];
  }
  return [{
    kind: "file",
    name: filePath,
    filePath,
    node: model.sourceFile,
    declaration: null,
    index: 0,
    raw: filePath
  }];
}

function jsxAnchors(model, name) {
  const anchors = [];
  for (const node of model.sourceFile.getDescendants()) {
    if (Node.isJsxElement(node)) {
      const tagName = node.getOpeningElement().getTagNameNode().getText();
      if (matches(tagName, name)) {
        anchors.push(anchor("jsx", tagName, node));
      }
    } else if (Node.isJsxSelfClosingElement(node)) {
      const tagName = node.getTagNameNode().getText();
      if (matches(tagName, name)) {
        anchors.push(anchor("jsx", tagName, node));
      }
    }
  }
  return anchors;
}

function callAnchors(model, name) {
  return model.sourceFile
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .filter((node) => matchesCall(node, name))
    .map((node) => anchor("call", callName(node), node));
}

function functionAnchors(model, name) {
  const anchors = [];
  for (const node of model.sourceFile.getDescendants()) {
    if (Node.isFunctionDeclaration(node) && node.getName() && matches(node.getName(), name)) {
      anchors.push(anchor("function", node.getName(), node));
    }
    if (Node.isVariableDeclaration(node) && matches(node.getName(), name)) {
      const initializer = node.getInitializer();
      if (initializer && (Node.isArrowFunction(initializer) || Node.isFunctionExpression(initializer))) {
        anchors.push(anchor("function", node.getName(), initializer, node));
      }
    }
  }
  return anchors;
}

function variableAnchors(model, name) {
  return model.sourceFile
    .getDescendantsOfKind(SyntaxKind.VariableDeclaration)
    .filter((node) => matches(node.getName(), name))
    .map((node) => anchor("variable", node.getName(), node));
}

function importAnchors(model, name) {
  return model.sourceFile
    .getDescendantsOfKind(SyntaxKind.ImportDeclaration)
    .filter((node) => matches(node.getModuleSpecifierValue(), name))
    .map((node) => anchor("import", node.getModuleSpecifierValue(), node));
}

function classAnchors(model, name) {
  return model.sourceFile
    .getDescendantsOfKind(SyntaxKind.ClassDeclaration)
    .filter((node) => node.getName() && matches(node.getName(), name))
    .map((node) => anchor("class", node.getName(), node));
}

function methodAnchors(model, name) {
  return model.sourceFile
    .getDescendantsOfKind(SyntaxKind.MethodDeclaration)
    .filter((node) => matches(node.getName(), name))
    .map((node) => anchor("method", node.getName(), node));
}

function fieldAnchors(model, name) {
  return model.sourceFile
    .getDescendantsOfKind(SyntaxKind.PropertyDeclaration)
    .filter((node) => matches(node.getName(), name))
    .map((node) => anchor("field", node.getName(), node));
}

function parameterAnchors(model, name) {
  return model.sourceFile
    .getDescendantsOfKind(SyntaxKind.Parameter)
    .filter((node) => matches(node.getName(), name))
    .map((node) => anchor("parameter", node.getName(), node));
}

function assignmentAnchors(model, name) {
  return model.sourceFile
    .getDescendantsOfKind(SyntaxKind.BinaryExpression)
    .filter((node) => node.getOperatorToken().getKind() === SyntaxKind.EqualsToken)
    .filter((node) => matches(assignmentName(node), name))
    .map((node) => anchor("assignment", assignmentName(node), node));
}

function returnAnchors(model, name) {
  return model.sourceFile
    .getDescendantsOfKind(SyntaxKind.ReturnStatement)
    .filter((node) => matches(node.getExpression()?.getText() ?? "return", name))
    .map((node) => anchor("return", node.getExpression()?.getText() ?? "return", node));
}

function decoratorAnchors(model, name) {
  return model.sourceFile
    .getDescendantsOfKind(SyntaxKind.Decorator)
    .filter((node) => matches(node.getName(), name))
    .map((node) => anchor("decorator", node.getName(), node));
}

function exportAnchors(model, name) {
  return exportEntries(model.sourceFile)
    .filter((entry) => matches(entry.name, name))
    .map((entry) => anchor("export", entry.name, entry.node, null, { exportInfo: entry }));
}

export function exportEntries(sourceFile) {
  return [
    ...declarationExportEntries(sourceFile),
    ...exportDeclarationEntries(sourceFile),
    ...exportAssignmentEntries(sourceFile)
  ];
}

function declarationExportEntries(sourceFile) {
  const entries = [];
  for (const node of sourceFile.getFunctions()) {
    if (hasDefaultExportKeyword(node)) {
      entries.push(exportEntry("default", node.getName() ?? "default", "function", "", node));
    } else if (node.hasExportKeyword?.() && node.getName()) {
      entries.push(exportEntry(node.getName(), node.getName(), "function", "", node));
    }
  }
  for (const node of sourceFile.getClasses()) {
    if (hasDefaultExportKeyword(node)) {
      entries.push(exportEntry("default", node.getName() ?? "default", "class", "", node));
    } else if (node.hasExportKeyword?.() && node.getName()) {
      entries.push(exportEntry(node.getName(), node.getName(), "class", "", node));
    }
  }
  for (const node of sourceFile.getVariableDeclarations()) {
    const statement = node.getVariableStatement();
    if (statement?.hasExportKeyword?.()) {
      entries.push(exportEntry(node.getName(), node.getName(), "variable", "", node));
    }
  }
  return entries;
}

function hasDefaultExportKeyword(node) {
  return node.getText().startsWith("export default");
}

function exportDeclarationEntries(sourceFile) {
  const entries = [];
  for (const node of sourceFile.getExportDeclarations()) {
    const module = node.getModuleSpecifierValue() ?? "";
    for (const specifier of node.getNamedExports()) {
      const reference = specifier.getName();
      const name = specifier.getAliasNode()?.getText() ?? reference;
      entries.push(exportEntry(name, reference, module ? "reexport" : "export", module, node));
    }
  }
  return entries;
}

function exportAssignmentEntries(sourceFile) {
  const entries = [];
  for (const node of sourceFile.getExportAssignments()) {
    if (!node.isExportEquals()) {
      const expression = node.getExpression();
      entries.push(exportEntry("default", expression?.getText() || "default", "default", "", node));
    }
  }
  return entries;
}

function exportEntry(name, reference, kind, module, node) {
  return {
    name,
    reference,
    value: module ? `${module}/${reference}` : reference,
    kind,
    module,
    raw: node.getText(),
    node
  };
}

function anchor(kind, name, node, declaration = null, extra = {}) {
  return {
    kind,
    name,
    node,
    declaration,
    index: node.getStart(),
    raw: node.getText(),
    ...extra
  };
}

function matches(actual, expected) {
  if (Array.isArray(expected)) {
    return expected.some((item) => matches(actual, item));
  }
  return expected === "*" || actual === expected;
}

function assignmentName(node) {
  const left = node.getLeft();
  return Node.isPropertyAccessExpression(left) ? left.getName() : left.getText();
}

function matchesCall(node, expected) {
  if (Array.isArray(expected)) {
    return expected.some((item) => matchesCall(node, item));
  }
  return expected === "*" || callCallee(node) === expected || callName(node) === expected || callOwner(node) === expected;
}

function matchesType(expected, actual = "") {
  return !expected || expected === actual || actual.endsWith(`.${expected}`);
}

export function callCallee(node) {
  return node.getExpression().getText();
}

export function callName(node) {
  const expression = node.getExpression();
  if (Node.isPropertyAccessExpression(expression)) {
    return expression.getName();
  }
  return expression.getText();
}

export function callOwner(node) {
  const expression = node.getExpression();
  if (Node.isPropertyAccessExpression(expression)) {
    return expression.getExpression().getText();
  }
  return "global";
}
