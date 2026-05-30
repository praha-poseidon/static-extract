import { Node, SyntaxKind } from "ts-morph";
import { resolveTrace } from "./trace-engine.mjs";

export function traceValue(node, options = {}) {
  if (!node) {
    return "";
  }
  if (Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node)) {
    return node.getLiteralText();
  }
  if (Node.isNumericLiteral(node)) {
    return node.getText();
  }
  if ([SyntaxKind.TrueKeyword, SyntaxKind.FalseKeyword, SyntaxKind.NullKeyword].includes(node.getKind())) {
    return node.getText();
  }
  if (Node.isIdentifier(node)) {
    return traceIdentifier(node, options);
  }
  if (Node.isTemplateExpression(node)) {
    return traceTemplate(node, options);
  }
  if (Node.isBinaryExpression(node) && node.getOperatorToken().getText() === "+") {
    return traceValue(node.getLeft(), options) + traceValue(node.getRight(), options);
  }
  if (Node.isPropertyAccessExpression(node)) {
    return tracePropertyAccess(node, options);
  }
  if (Node.isElementAccessExpression(node)) {
    return traceElementAccess(node, options);
  }
  if (Node.isArrayLiteralExpression(node)) {
    return node.getElements().map((element) => traceValue(element, options)).join(",");
  }
  if (Node.isCallExpression(node)) {
    const traced = resolveTrace(node, options);
    if (traced !== "") {
      return traced;
    }
    const returned = traceCalledFunctionReturn(node, options);
    return returned !== "" ? returned : `{${node.getText()}}`;
  }
  if (Node.isBinaryExpression(node) && node.getOperatorToken().getKind() === SyntaxKind.EqualsToken) {
    const traced = resolveTrace(node, options);
    return traced !== "" ? traced : traceValue(node.getRight(), options);
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
    return "inline";
  }
  if (Node.isFunctionExpression(node) || Node.isFunctionDeclaration(node)) {
    return typeof node.getName === "function" ? node.getName() ?? "inline" : "inline";
  }
  return `{${node.getText()}}`;
}

function traceIdentifier(node, options) {
  const declaration = resolvedDeclaration(node);
  if (declaration && Node.isParameterDeclaration(declaration)) {
    const argument = options.parameterValues?.get(parameterKey(declaration)) ?? options.parameterValues?.get(declaration.getName());
    if (argument) {
      return traceValue(argument, { ...options, parameterValues: undefined });
    }
  }
  if (declaration && Node.isVariableDeclaration(declaration)) {
    const value = traceValue(declaration.getInitializer(), options);
    if (value !== "") {
      return value;
    }
    const assigned = traceAssignedValue(node, options);
    if (assigned !== "") {
      return assigned;
    }
    const traced = resolveTrace(declaration, options);
    return traced !== "" ? traced : `{${node.getText()}}`;
  }
  if (declaration && Node.isParameterDeclaration(declaration)) {
    const traced = resolveTrace(declaration, options);
    return traced !== "" ? traced : `{${node.getText()}}`;
  }
  if (declaration && Node.isPropertyDeclaration(declaration)) {
    const value = traceValue(declaration.getInitializer(), options);
    if (value !== "") {
      return value;
    }
    const traced = resolveTrace(declaration, options);
    return traced !== "" ? traced : `{${node.getText()}}`;
  }
  if (declaration && Node.isBindingElement(declaration)) {
    const traced = traceBindingElement(declaration, options);
    return traced !== "" ? traced : `{${node.getText()}}`;
  }
  return `{${node.getText()}}`;
}

function traceAssignedValue(node, options) {
  const sourceFile = node.getSourceFile();
  const name = node.getText();
  const assignments = sourceFile.getDescendantsOfKind(SyntaxKind.BinaryExpression)
    .filter((candidate) => candidate.getOperatorToken().getKind() === SyntaxKind.EqualsToken)
    .filter((candidate) => candidate.getStart() < node.getStart())
    .filter((candidate) => {
      const left = candidate.getLeft();
      if (Node.isIdentifier(left)) {
        return left.getText() === name;
      }
      if (Node.isPropertyAccessExpression(left)) {
        return left.getName() === name;
      }
      return false;
    });
  const assignment = assignments.at(-1);
  if (!assignment) {
    return "";
  }
  const traced = resolveTrace(assignment, options);
  return traced !== "" ? traced : traceValue(assignment.getRight(), options);
}

function traceCalledFunctionReturn(node, options) {
  const declaration = node.getExpression().getDefinitions?.()[0]?.getDeclarationNode();
  const functionNode = callableFunctionNode(declaration);
  if (!functionNode) {
    return "";
  }
  const methodTrace = resolveTrace(functionNode, options);
  if (methodTrace !== "") {
    return methodTrace;
  }
  const parameterValues = functionParameterValues(functionNode, node.getArguments());
  const nextOptions = parameterValues.size > 0 ? { ...options, parameterValues } : options;
  if (Node.isArrowFunction(functionNode) && !Node.isBlock(functionNode.getBody())) {
    return traceValue(functionNode.getBody(), nextOptions);
  }
  const returnStatement = functionNode.getDescendantsOfKind(SyntaxKind.ReturnStatement)[0];
  if (!returnStatement) {
    return "";
  }
  const returnTrace = resolveTrace(returnStatement, options);
  if (returnTrace !== "") {
    return returnTrace;
  }
  return traceValue(returnStatement.getExpression(), nextOptions);
}

function callableFunctionNode(declaration) {
  if (!declaration) {
    return null;
  }
  if (Node.isFunctionDeclaration(declaration) || Node.isMethodDeclaration(declaration) || Node.isFunctionExpression(declaration) || Node.isArrowFunction(declaration)) {
    return declaration;
  }
  if (Node.isVariableDeclaration(declaration)) {
    const initializer = declaration.getInitializer();
    if (initializer && (Node.isArrowFunction(initializer) || Node.isFunctionExpression(initializer))) {
      return initializer;
    }
  }
  return null;
}

function traceTemplate(node, options) {
  let out = node.getHead().getLiteralText();
  for (const span of node.getTemplateSpans()) {
    out += traceValue(span.getExpression(), options);
    out += span.getLiteral().getLiteralText();
  }
  return out;
}

function tracePropertyAccess(node, options) {
  const expression = node.getExpression();
  const name = node.getName();
  if (!Node.isIdentifier(expression)) {
    const traced = resolveTrace(node, options);
    return traced !== "" ? traced : `{${node.getText()}}`;
  }
  const declaration = resolvedDeclaration(expression);
  if (!declaration || !Node.isVariableDeclaration(declaration)) {
    const traced = resolveTrace(node, options);
    return traced !== "" ? traced : `{${node.getText()}}`;
  }
  const initializer = declaration.getInitializer();
  if (!initializer || !Node.isObjectLiteralExpression(initializer)) {
    return `{${node.getText()}}`;
  }
  for (const property of initializer.getProperties()) {
    if (Node.isPropertyAssignment(property) && property.getName() === name) {
      return traceValue(property.getInitializer(), options);
    }
  }
  return `{${node.getText()}}`;
}

function traceElementAccess(node, options) {
  const expression = node.getExpression();
  const argument = node.getArgumentExpression();
  const key = argument ? traceElementKey(argument, options) : "";
  if (!key) {
    const traced = resolveTrace(node, options);
    return traced !== "" ? traced : `{${node.getText()}}`;
  }
  const declaration = Node.isIdentifier(expression) ? resolvedDeclaration(expression) : null;
  const initializer = declaration && Node.isVariableDeclaration(declaration) ? declaration.getInitializer() : expression;
  if (Node.isArrayLiteralExpression(initializer) && /^\d+$/.test(key)) {
    return traceValue(initializer.getElements()[Number(key)], options);
  }
  if (Node.isObjectLiteralExpression(initializer)) {
    for (const property of initializer.getProperties()) {
      if (Node.isPropertyAssignment(property) && property.getName().replace(/^['"]|['"]$/g, "") === key) {
        return traceValue(property.getInitializer(), options);
      }
    }
  }
  const traced = resolveTrace(node, options);
  return traced !== "" ? traced : `{${node.getText()}}`;
}

function traceElementKey(node, options) {
  if (Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node) || Node.isNumericLiteral(node)) {
    return node.getLiteralText?.() ?? node.getText();
  }
  const traced = traceValue(node, options);
  return traced.startsWith("{") ? "" : traced;
}

function traceBindingElement(node, options) {
  const variable = node.getFirstAncestorByKind(SyntaxKind.VariableDeclaration);
  const initializer = variable?.getInitializer();
  if (!initializer) {
    return "";
  }
  const arrayLiteral = resolveArrayLiteral(initializer);
  if (arrayLiteral && Node.isArrayBindingPattern(node.getParent())) {
    const index = node.getParent().getElements().indexOf(node);
    return traceValue(arrayLiteral.getElements()[index], options);
  }
  const declaration = Node.isIdentifier(initializer) ? resolvedDeclaration(initializer) : null;
  const objectLiteral = Node.isObjectLiteralExpression(initializer)
    ? initializer
    : declaration && Node.isVariableDeclaration(declaration) && Node.isObjectLiteralExpression(declaration.getInitializer())
      ? declaration.getInitializer()
      : null;
  if (!objectLiteral) {
    return "";
  }
  const propertyName = node.getPropertyNameNode()?.getText().replace(/^['"]|['"]$/g, "") ?? node.getName();
  for (const property of objectLiteral.getProperties()) {
    if (Node.isPropertyAssignment(property) && property.getName() === propertyName) {
      return traceValue(property.getInitializer(), options);
    }
  }
  return "";
}

function resolveArrayLiteral(node) {
  if (Node.isArrayLiteralExpression(node)) {
    return node;
  }
  const declaration = Node.isIdentifier(node) ? resolvedDeclaration(node) : null;
  return declaration && Node.isVariableDeclaration(declaration) && Node.isArrayLiteralExpression(declaration.getInitializer())
    ? declaration.getInitializer()
    : null;
}

function resolvedDeclaration(node) {
  const symbol = node.getSymbol?.();
  const aliased = symbol?.getAliasedSymbol?.();
  return aliased?.getDeclarations?.()[0] ?? node.getDefinitions?.()[0]?.getDeclarationNode();
}

function functionParameterValues(functionNode, args) {
  const values = new Map();
  const parameters = typeof functionNode.getParameters === "function" ? functionNode.getParameters() : [];
  for (let index = 0; index < parameters.length; index += 1) {
    const argument = args[index];
    if (!argument) {
      continue;
    }
    values.set(parameterKey(parameters[index]), argument);
    values.set(parameters[index].getName(), argument);
  }
  return values;
}

function parameterKey(parameter) {
  return `${parameter.getSourceFile().getFilePath()}#${parameter.getStart()}:${parameter.getName()}`;
}
