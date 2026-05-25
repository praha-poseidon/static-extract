# Static Extract TypeScript Extractor

This module implements the TypeScript-family Static Extract extractor with
`ts-morph`.

It owns `.ts`, `.tsx`, `.js`, and `.jsx` parsing, AST find/source/value
evaluation, built-in TS rules, and the `static-extract-ts` CLI. It implements
the shared contracts under `spec/` directly in TypeScript-family JavaScript and
does not depend on the Java core jar.

## Commands

```bash
npm run generate:ser-parser
npm run build
npm test
node cli/static-extract-ts.mjs --help
node cli/static-extract-ts.mjs run --project ./app --builtin --out facts.jsonl
```

## Module API

```js
import { runStaticExtractTs } from "@static-extract/extractor-ts";

const report = await runStaticExtractTs({
  project: "/path/to/react-project",
  source: "/path/to/react-project/src",
  rule: "/path/to/react-project/.ser/generated/api.ser",
  traceRule: "/path/to/react-project/.ser/generated/config.trace.ser",
  externalValues: "/path/to/react-project/.ser/generated/external-values.json"
});

console.log(report.results);
```

Use `builtin: true` to load built-in TS/React rules instead of passing `rule`.

For tools that run extraction repeatedly, create one session and reuse its
project AST:

```js
import { createStaticExtractTsSession } from "@static-extract/extractor-ts";

const session = await createStaticExtractTsSession({
  project: "/path/to/react-project",
  source: "/path/to/react-project/src"
});

const apiFacts = await session.run({
  rule: "/path/to/rules/api.ser",
  traceRule: "/path/to/rules/api.trace.ser",
  externalValues: "/path/to/external-values.json"
});

const uiFacts = await session.run({
  rule: "/path/to/rules/ui.ser"
});

session.dispose();
```

## Architecture

```text
cli/static-extract-ts.mjs    command line entry point
src/generated/ser/           ANTLR TypeScript parser generated from spec/ser/Ser.g4
src/extractor/antlr-ser-parser.ts
                             maps generated parser trees to extractor rule models
dist/                        compiled generated parser and parser adapter
extractor/rule-parser.mjs    thin runtime wrapper around dist parser adapter
extractor/ast-model.mjs      ts-morph SourceFile creation
extractor/find-executor.mjs  find jsx/call/function/variable
extractor/source-evaluator.mjs
                             from/take evaluation
extractor/value-tracer.mjs   syntax value tracing plus trace-ser continuation
extractor/extractor.mjs      extraction orchestration
rules/                       built-in TS/React SER rules
```

The TS trace-ser engine supports the same target names as the shared SER
grammar: `call`, `field`, `parameter`, `method`, `return`, and `assignment`.
These targets are applied to TypeScript-family AST shapes and external value
lookup through `--external-values`.
