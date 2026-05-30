import {
  BaseErrorListener,
  CharStream,
  CommonTokenStream,
  RecognitionException,
  Recognizer,
  Token
} from "antlr4ng";
import { SerLexer } from "../generated/ser/SerLexer.js";
import {
  BuildDeclContext,
  BuildExprContext,
  FindDeclContext,
  LetDeclContext,
  PipelineStepContext,
  SerParser,
  SourceExprContext,
  SourceLineContext,
  TraceEntryContext,
  WhenDeclContext
} from "../generated/ser/SerParser.js";

type SourceSpec = {
  element: string;
  name?: string;
  index?: number;
  on?: string;
  take: string;
};

type LetSpec = {
  sources: SourceSpec[];
  defaultValue?: string;
  map: Record<string, string>;
};

type BuildValue = string | { ref: string };
type ConcatBuildValue = { concat: Array<string | { ref: string }> };
type PipelineStepModel =
  | { op: "normalize"; name: string }
  | { op: "regex"; pattern: string; group: number }
  | { op: "replace"; pattern: string; replacement: string }
  | { op: "map"; entries: Record<string, string> };
type BuildSpec = { value: BuildValue | ConcatBuildValue; pipeline: PipelineStepModel[] };

export type SerRuleModel = {
  name: string;
  factType: string;
  find: { kind: string; name: string | string[] };
  when: TraceWhenModel[];
  lets: Record<string, LetSpec>;
  build: Record<string, BuildSpec>;
};

export type TraceRuleSetModel = {
  name: string;
  entries: TraceEntryModel[];
};

export type TraceEntryModel = {
  target: string;
  when: TraceWhenModel[];
  lets: Record<string, LetSpec>;
  build: Record<string, BuildSpec>;
};

export type TraceWhenModel = {
  kind: string;
  name?: string;
  owner?: string;
  value?: string;
  type?: string;
};

export function parseRuleModel(source: string, file: string): SerRuleModel {
  const parser = createParser(source, file);
  const tree = parser.ruleFile();
  throwIfSyntaxErrors(parser, file);
  return {
    name: unquote(tree.ruleDecl().STRING().getText()),
    factType: tree.ruleTargetDecl().factDecl()?.valueToken().getText() ?? "endpoint",
    find: parseFind(tree.findDecl()),
    when: tree.whenDecl().map(parseWhen),
    lets: parseLets(tree.letDecl()),
    build: parseBuild(tree.buildDecl())
  };
}

export function parseTraceRuleSetModel(source: string, file: string): TraceRuleSetModel {
  const parser = createParser(source, file);
  const tree = parser.traceFile();
  throwIfSyntaxErrors(parser, file);
  return {
    name: unquote(tree.traceDecl().STRING().getText()),
    entries: tree.traceEntry().map(parseTraceEntry)
  };
}

function createParser(source: string, file: string): SerParser {
  const errors: string[] = [];
  const listener = new ThrowingErrorListener(file, errors);
  const lexer = new SerLexer(CharStream.fromString(source));
  lexer.removeErrorListeners();
  lexer.addErrorListener(listener);
  const tokens = new CommonTokenStream(lexer);
  const parser = new SerParser(tokens);
  parser.removeErrorListeners();
  parser.addErrorListener(listener);
  (parser as SerParser & { staticExtractErrors?: string[] }).staticExtractErrors = errors;
  return parser;
}

function throwIfSyntaxErrors(parser: SerParser, file: string): void {
  const errors = (parser as SerParser & { staticExtractErrors?: string[] }).staticExtractErrors ?? [];
  if (errors.length > 0) {
    throw new Error(`Failed to parse SER file ${file}: ${errors.join("; ")}`);
  }
}

class ThrowingErrorListener extends BaseErrorListener {
  public constructor(private readonly file: string, private readonly errors: string[]) {
    super();
  }

  public override syntaxError(
    _recognizer: Recognizer<any>,
    _offendingSymbol: Token | null,
    line: number,
    column: number,
    msg: string,
    _e: RecognitionException | null
  ): void {
    this.errors.push(`${this.file}:${line}:${column} ${msg}`);
  }
}

function parseFind(ctx: FindDeclContext): { kind: string; name: string | string[] } {
  if (ctx._genericFindKind) {
    return { kind: text(ctx._genericFindKind), name: ctx._genericFindName ? parseFindName(ctx._genericFindName) : "*" };
  }
  if (ctx.METHOD()) {
    return { kind: "method", name: ctx.methodPattern()?.getText() ?? "*" };
  }
  if (ctx.CLASS()) {
    return { kind: "class", name: "*" };
  }
  if (ctx.FIELD()) {
    return { kind: "field", name: ctx._fieldName ? text(ctx._fieldName) : "*" };
  }
  return { kind: "unknown", name: "*" };
}

function parseFindName(ctx: { getText(): string }): string | string[] {
  const value = ctx.getText();
  if (!value.startsWith("[") || !value.endsWith("]")) {
    return value;
  }
  const inner = value.slice(1, -1).trim();
  return inner ? inner.split(",").map((item) => item.trim()).filter(Boolean) : [];
}

function parseLets(contexts: LetDeclContext[]): Record<string, LetSpec> {
  const lets: Record<string, LetSpec> = {};
  for (const ctx of contexts) {
    lets[text(ctx.nameItem())] = {
      sources: ctx.sourceLine().map(parseSourceLine),
      ...(ctx.defaultLine()?.literal() ? { defaultValue: unquote(ctx.defaultLine()!.literal().getText()) } : {}),
      map: parseMapEntries(ctx.mapBlock()?.mapEntry() ?? [])
    };
  }
  return lets;
}

function parseSourceLine(ctx: SourceLineContext): SourceSpec {
  return {
    ...parseSource(ctx.sourceExpr()),
    take: normalizeTake(ctx.takeExpr().getText())
  };
}

function parseSource(ctx: SourceExprContext): Omit<SourceSpec, "take"> {
  if (ctx.ARGUMENT()) {
    return { element: "argument", index: Number(ctx.INT()?.getText() ?? "0") };
  }
  if (ctx._genericSourceKind) {
    return {
      element: text(ctx._genericSourceKind),
      ...(ctx._genericSourceName ? { name: text(ctx._genericSourceName) } : {})
    };
  }
  if (ctx.CALL()) {
    return { element: "call" };
  }
  if (ctx.RETURN()) {
    return { element: "return" };
  }
  if (ctx.FIELD()) {
    return { element: "field", ...(ctx._sourceName ? { name: text(ctx._sourceName) } : {}) };
  }
  if (ctx.PARAMETER()) {
    return { element: "parameter", ...(ctx._sourceName ? { name: text(ctx._sourceName) } : {}) };
  }
  if (ctx.CLASS()) {
    return { element: "class" };
  }
  if (ctx.METHOD()) {
    return { element: "method" };
  }
  if (ctx.ASSIGNMENT()) {
    return { element: "assignment" };
  }
  if (ctx.LITERAL()) {
    return { element: "literal", name: unquote(ctx.literal()?.getText() ?? "") };
  }
  if (ctx.NEW()) {
    return { element: "new", name: ctx.qualifiedName()?.getText() ?? "" };
  }
  if (ctx.ANNOTATION()) {
    return { element: "annotation", name: ctx.annotationRef()?.getText() ?? "", on: ctx.elementRef()?.getText() };
  }
  if (ctx.DECORATOR()) {
    return {
      element: "decorator",
      name: ctx.decoratorRef()?.getText() ?? "",
      on: ctx.elementRef()?.getText()
    };
  }
  return { element: ctx.getText() };
}

function parseBuild(ctx: BuildDeclContext): Record<string, BuildSpec> {
  const build: Record<string, BuildSpec> = {};
  for (const field of ctx.buildField()) {
    const name = field.buildFieldName().getText();
    build[name] = {
      value: parseBuildExpr(field.buildExpr()),
      pipeline: field.pipelineStep().map(parsePipelineStep)
    };
  }
  return build;
}

function parseBuildExpr(ctx: BuildExprContext): BuildValue | ConcatBuildValue {
  if (ctx.STRING()) {
    return unquote(ctx.STRING()!.getText());
  }
  if (ctx.CONCAT()) {
    return {
      concat: ctx.concatList()?.concatItem().map((item) => {
        if (item.STRING()) {
          return unquote(item.STRING()!.getText());
        }
        return { ref: item.nameItem()?.getText() ?? item.getText() };
      }) ?? []
    };
  }
  return { ref: ctx.nameItem()?.getText() ?? ctx.getText() };
}

function parsePipelineStep(ctx: PipelineStepContext): PipelineStepModel {
  if (ctx.NORMALIZE()) {
    return { op: "normalize", name: ctx.IDENT()?.getText() ?? "" };
  }
  if (ctx.REGEX()) {
    return {
      op: "regex",
      pattern: unquote(ctx.STRING(0)?.getText() ?? ""),
      group: Number(ctx.INT()?.getText() ?? "0")
    };
  }
  if (ctx.REPLACE()) {
    return {
      op: "replace",
      pattern: unquote(ctx.STRING(0)?.getText() ?? ""),
      replacement: unquote(ctx.STRING(1)?.getText() ?? "")
    };
  }
  return { op: "map", entries: parseMapEntries(ctx.mapEntry()) };
}

function parseMapEntries(entries: Array<{ valueToken(i?: number): any }>): Record<string, string> {
  const values: Record<string, string> = {};
  for (const entry of entries) {
    const key = entry.valueToken(0)?.getText() ?? "";
    const value = entry.valueToken(1)?.getText() ?? "";
    values[key] = value;
  }
  return values;
}

function parseTraceEntry(ctx: TraceEntryContext): TraceEntryModel {
  return {
    target: ctx.traceTarget().getText(),
    when: ctx.whenDecl().map(parseWhen),
    lets: parseLets(ctx.letDecl()),
    build: parseBuild(ctx.buildDecl())
  };
}

function parseWhen(ctx: WhenDeclContext): TraceWhenModel {
  if (ctx.CALL() && ctx.methodPattern()) {
    const pattern = ctx.methodPattern()!.getText();
    const lastDot = pattern.lastIndexOf(".");
    return {
      kind: "call",
      owner: lastDot >= 0 ? pattern.slice(0, lastDot) : undefined,
      name: lastDot >= 0 ? pattern.slice(lastDot + 1) : pattern
    };
  }
  if (ctx.CALL() && ctx.NAME()) {
    return { kind: "callName", value: ctx.valueToken()?.getText() ?? "" };
  }
  if (ctx.CALL() && ctx.OWNER()) {
    return { kind: "callOwner", value: ctx.qualifiedName()?.getText() ?? "" };
  }
  if (ctx.METHOD() && ctx.NAME()) {
    return { kind: "methodName", value: ctx.valueToken()?.getText() ?? "" };
  }
  if (ctx.METHOD() && ctx.methodPattern()) {
    const pattern = ctx.methodPattern()!.getText();
    const lastDot = pattern.lastIndexOf(".");
    return {
      kind: "method",
      owner: lastDot >= 0 ? pattern.slice(0, lastDot) : undefined,
      name: lastDot >= 0 ? pattern.slice(lastDot + 1) : pattern
    };
  }
  if (ctx.FIELD() && ctx.NAME()) {
    return { kind: "fieldName", value: ctx.valueToken()?.getText() ?? "" };
  }
  if (ctx.FIELD() && ctx.TYPE()) {
    return { kind: "fieldType", value: ctx.qualifiedName()?.getText() ?? "" };
  }
  if (ctx.PARAMETER() && ctx.NAME()) {
    return { kind: "parameterName", value: ctx.valueToken()?.getText() ?? "" };
  }
  if (ctx.PARAMETER() && ctx.TYPE()) {
    return { kind: "parameterType", value: ctx.qualifiedName()?.getText() ?? "" };
  }
  if (ctx.ASSIGNMENT() && ctx.FIELD()) {
    return { kind: "assignmentField", value: ctx.valueToken()?.getText() ?? "" };
  }
  return { kind: ctx.getText() };
}

function normalizeTake(value: string): string {
  const attr = value.match(/^attr\((.+)\)$/);
  return attr ? `attr(${attr[1]})` : value;
}

function text(value: { getText(): string }): string {
  return value.getText();
}

function unquote(value: string): string {
  if (!value.startsWith("\"") || !value.endsWith("\"")) {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value.slice(1, -1).replace(/\\"/g, "\"").replace(/\\\\/g, "\\");
  }
}
