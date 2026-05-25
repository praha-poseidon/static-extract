export type StaticExtractTsOptions = {
  project?: string;
  source?: string | string[];
  sources?: string | string[];
  rule?: string | string[];
  ruleFile?: string | string[];
  ruleFiles?: string | string[];
  ruleDirectory?: string | string[];
  ruleDirectories?: string | string[];
  rules?: string | string[];
  traceRule?: string | string[];
  traceRuleFile?: string | string[];
  traceRuleFiles?: string | string[];
  traceRuleDirectory?: string | string[];
  traceRuleDirectories?: string | string[];
  traceRules?: string | string[];
  externalValues?: string;
  externalValuesFile?: string;
  builtin?: boolean;
  builtinRules?: boolean;
  out?: string;
  outputFile?: string;
};

export type StaticExtractFact = {
  rule: string;
  factType: string;
  classifiers: Record<string, string>;
  fields: Record<string, string>;
  projectFilePath: string;
  absoluteFilePath: string;
  startLine: number;
  endLine: number;
  enclosingSymbol?: string | null;
};

export type StaticExtractRunResult = {
  resultCount: number;
  outputFile?: string;
  results: StaticExtractFact[];
};

export type StaticExtractTsSession = {
  run(options?: StaticExtractTsOptions): Promise<StaticExtractRunResult>;
  tryRules(options?: StaticExtractTsOptions): Promise<Record<string, unknown>>;
  diagnose(options?: StaticExtractTsOptions): Promise<Record<string, unknown>>;
  dispose(): void;
};

export function init(request: { project: string }): Promise<Record<string, unknown>>;
export function run(request: Record<string, unknown>): Promise<StaticExtractRunResult>;
export function tryRules(request: Record<string, unknown>): Promise<Record<string, unknown>>;
export function diagnose(request: Record<string, unknown>): Promise<Record<string, unknown>>;
export function createSession(request: Record<string, unknown>): Promise<StaticExtractTsSession>;
export function runStaticExtractTs(options: StaticExtractTsOptions): Promise<StaticExtractRunResult>;
export function tryStaticExtractTs(options: StaticExtractTsOptions): Promise<Record<string, unknown>>;
export function diagnoseStaticExtractTs(options: StaticExtractTsOptions): Promise<Record<string, unknown>>;
export function createStaticExtractTsSession(options?: StaticExtractTsOptions): Promise<StaticExtractTsSession>;
