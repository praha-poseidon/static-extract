import { createSession, diagnose, init, run, tryRules } from "./extractor/extractor.mjs";

export { createSession, diagnose, init, run, tryRules };

export async function runStaticExtractTs(options) {
  return run(normalizeExtractionOptions(options));
}

export async function tryStaticExtractTs(options) {
  return tryRules(normalizeExtractionOptions(options));
}

export async function diagnoseStaticExtractTs(options) {
  return diagnose(normalizeExtractionOptions(options));
}

export async function createStaticExtractTsSession(options = {}) {
  const baseOptions = normalizeExtractionOptions(options);
  const session = await createSession(baseOptions);
  return {
    async run(options = {}) {
      return session.run(normalizeExtractionOptions(options, baseOptions));
    },
    async tryRules(options = {}) {
      return session.tryRules(normalizeExtractionOptions(options, baseOptions));
    },
    async diagnose(options = {}) {
      return session.diagnose(normalizeExtractionOptions(options, baseOptions));
    },
    dispose() {
      session.dispose();
    }
  };
}

function normalizeExtractionOptions(options = {}, defaults = {}) {
  const project = options.project ?? defaults.project ?? process.cwd();
  return {
    project,
    sources: array(options.sources ?? options.source ?? defaults.sources ?? [project]),
    ruleFiles: array(options.ruleFiles ?? options.ruleFile ?? options.rule ?? defaults.ruleFiles),
    ruleDirectories: array(options.ruleDirectories ?? options.ruleDirectory ?? options.rules ?? defaults.ruleDirectories),
    traceRuleFiles: array(options.traceRuleFiles ?? options.traceRuleFile ?? options.traceRule ?? defaults.traceRuleFiles),
    traceRuleDirectories: array(options.traceRuleDirectories ?? options.traceRuleDirectory ?? options.traceRules ?? defaults.traceRuleDirectories),
    builtinRules: Boolean(options.builtinRules ?? options.builtin ?? defaults.builtinRules),
    externalValuesFile: options.externalValuesFile ?? options.externalValues ?? defaults.externalValuesFile,
    outputFile: options.outputFile ?? options.out ?? defaults.outputFile
  };
}

function array(value) {
  if (value === undefined || value === null || value === false) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}
