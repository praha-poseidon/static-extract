import { Node, SyntaxKind } from "ts-morph";
import { callName, callOwner } from "./find-executor.mjs";
import { referenceValue, traceValue } from "./value-tracer.mjs";

export function evaluateLets(rule, anchor) {
  const values = {};
  for (const [name, sources] of Object.entries(rule.lets)) {
    for (const source of sources) {
      const value = evaluateSource(source, anchor);
      if (value !== "") {
        values[name] = value;
        break;
      }
    }
    if (!Object.hasOwn(values, name)) {
      values[name] = "";
    }
  }
  return values;
}

export function buildFields(rule, values) {
  const fields = {};
  for (const [name, value] of Object.entries(rule.build)) {
    fields[name] = typeof value === "object"
      ? Object.hasOwn(values, value.ref) ? values[value.ref] : ""
      : value;
  }
  return fields;
}

export function evaluateSource(source, anchor) {
  if ((source.element === "children" || source.element === "jsx") && anchor.kind === "jsx") {
    return takeJsxValue(anchor.node, source.take);
  }
  if (source.element === "prop" && anchor.kind === "jsx") {
    return takePropValue(jsxAttribute(anchor.node, source.name), source.take);
  }
  if (source.element === "argument" && anchor.kind === "call") {
    return takeArgumentValue(anchor.node.getArguments()[source.index], source.take);
  }
  if (source.element === "call" && anchor.kind === "call") {
    return takeCallValue(anchor.node, source.take);
  }
  if (source.element === "return" && anchor.kind === "function") {
    return takeReturnValue(anchor.node, source.take);
  }
  if (source.element === "variable" && anchor.kind === "variable") {
    return takeVariableValue(anchor.node, source.take);
  }
  return "";
}

function takeJsxValue(node, take) {
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
          return traceValue(child.getExpression());
        }
        return "";
      })
      .join("")
      .replace(/\s+/g, " ")
      .trim();
  }
  return "";
}

function takePropValue(attribute, take) {
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
    return take === "reference" ? referenceValue(expression) : traceValue(expression);
  }
  return initializer.getText();
}

function takeArgumentValue(argument, take) {
  if (!argument) {
    return "";
  }
  if (take === "raw" || take === "name") {
    return argument.getText();
  }
  if (take === "value") {
    return traceValue(argument);
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
  if (take === "method") {
    const name = callName(node);
    return ["get", "post", "put", "patch", "delete"].includes(name.toLowerCase()) ? name.toUpperCase() : name;
  }
  return "";
}

function takeReturnValue(node, take) {
  const expression = firstReturnExpression(node);
  if (!expression) {
    return "";
  }
  if (take === "raw") {
    return expression.getText();
  }
  if (take === "value") {
    return traceValue(expression);
  }
  return "";
}

function takeVariableValue(node, take) {
  if (take === "name") {
    return node.getName();
  }
  if (take === "raw") {
    return node.getText();
  }
  if (take === "value") {
    return traceValue(node.getInitializer());
  }
  return "";
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
