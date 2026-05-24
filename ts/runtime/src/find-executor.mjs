import { Node, SyntaxKind } from "ts-morph";

export function findAnchors(rule, model) {
  const { kind, name } = rule.find;
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
  return [];
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

function anchor(kind, name, node, declaration = null) {
  return {
    kind,
    name,
    node,
    declaration,
    index: node.getStart(),
    raw: node.getText()
  };
}

function matches(actual, expected) {
  return expected === "*" || actual === expected;
}

function matchesCall(node, expected) {
  return expected === "*" || callCallee(node) === expected || callName(node) === expected || callOwner(node) === expected;
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
