# Static Extract TypeScript Runtime

This module implements the TypeScript-family Static Extract runtime with
`ts-morph`.

It owns `.ts`, `.tsx`, `.js`, and `.jsx` parsing, AST find/source/value
evaluation, built-in TS rules, and the `static-extract-ts` CLI. It implements
the shared contracts under `spec/` directly in TypeScript-family JavaScript and
does not depend on the Java core jar.

## Commands

```bash
npm test
node bin/static-extract-ts.mjs --help
node bin/static-extract-ts.mjs run --project ./app --builtin --out facts.jsonl
```

## Architecture

```text
src/rule-parser.mjs      SER subset parser used by this runtime
src/ast-model.mjs        ts-morph SourceFile creation
src/find-executor.mjs    find jsx/call/function/variable
src/source-evaluator.mjs from/take evaluation
src/value-tracer.mjs     syntax-only value tracing
src/runtime.mjs          CLI-facing orchestration
```
