import { Node } from "ts-morph";

export function traceValue(node) {
  if (!node) {
    return "";
  }
  if (Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node)) {
    return node.getLiteralText();
  }
  if (Node.isIdentifier(node)) {
    return traceIdentifier(node);
  }
  if (Node.isTemplateExpression(node)) {
    return traceTemplate(node);
  }
  if (Node.isBinaryExpression(node) && node.getOperatorToken().getText() === "+") {
    return traceValue(node.getLeft()) + traceValue(node.getRight());
  }
  if (Node.isPropertyAccessExpression(node)) {
    return tracePropertyAccess(node);
  }
  return node.getText() ? `{${node.getText()}}` : "";
}

export function referenceValue(node) {
  if (!node) {
    return "";
  }
  if (Node.isIdentifier(node) || Node.isPropertyAccessExpression(node)) {
    return node.getText();
  }
  if (Node.isCallExpression(node)) {
    return node.getExpression().getText();
  }
  if (Node.isArrowFunction(node)) {
    const body = node.getBody();
    if (Node.isCallExpression(body)) {
      return body.getExpression().getText();
    }
  }
  return `{${node.getText()}}`;
}

function traceIdentifier(node) {
  const declaration = node.getDefinitions()[0]?.getDeclarationNode();
  if (declaration && Node.isVariableDeclaration(declaration)) {
    return traceValue(declaration.getInitializer());
  }
  return `{${node.getText()}}`;
}

function traceTemplate(node) {
  let out = node.getHead().getLiteralText();
  for (const span of node.getTemplateSpans()) {
    out += traceValue(span.getExpression());
    out += span.getLiteral().getLiteralText();
  }
  return out;
}

function tracePropertyAccess(node) {
  const expression = node.getExpression();
  const name = node.getName();
  if (!Node.isIdentifier(expression)) {
    return `{${node.getText()}}`;
  }
  const declaration = expression.getDefinitions()[0]?.getDeclarationNode();
  if (!declaration || !Node.isVariableDeclaration(declaration)) {
    return `{${node.getText()}}`;
  }
  const initializer = declaration.getInitializer();
  if (!initializer || !Node.isObjectLiteralExpression(initializer)) {
    return `{${node.getText()}}`;
  }
  for (const property of initializer.getProperties()) {
    if (Node.isPropertyAssignment(property) && property.getName() === name) {
      return traceValue(property.getInitializer());
    }
  }
  return `{${node.getText()}}`;
}
