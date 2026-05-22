---
name: ser-author
description: Generate Static Extract SER rules from natural-language extraction requests, using runtime vocabulary files, and optionally validate generated SER by running a Static Extract CLI against a target project.
---

# SER Author

Use this skill when the user asks to generate SER, run Static Extract against a
project, or do both as one extraction workflow.

## Workflow

1. Identify the target runtime from the project or user request: Java/JDT,
   React/TS, or another runtime.
2. Read the matching vocabulary reference before writing SER:
   - Java/JDT: `references/java-jdt-vocabulary.md`
   - React/TS: `references/react-ts-vocabulary.md`
3. Generate one `.ser` file containing the needed `rule` and optional `trace`
   blocks. Do not split rule and trace into separate files unless the user asks.
4. If source code is available and the user wants extraction, run the matching
   CLI workflow: `init`, `try`, `diagnose` if `try` has no matches, then `run`.
5. Return the generated SER path, JSONL facts path, and report path.

## Guardrails

- Stay inside the runtime vocabulary. Do not invent selectors such as
  `find component` unless the target runtime vocabulary says it is supported.
- Prefer generic fact types such as `ui_text`, `api_call`, `config_key`, and
  `backend_endpoint`.
- Keep output fields descriptive and runtime-neutral where possible.
- SER is the asset. The generated `.ser` should be reusable by a graph system
  or by CLI execution.

## Deterministic Helper

For repeatable tests or simple supported prompts, use one of these helpers.

Generate SER only:

```bash
node skills/ser-author/scripts/generate_ser.mjs \
  --runtime react \
  --request request.txt \
  --out generated.ser
```

Generate SER and run the right CLI:

```bash
node skills/ser-author/scripts/run_static_extract.mjs \
  --project ./my-react-project \
  --mode generate-and-extract \
  --request request.txt \
  --out-dir .static-extract
```

Supported modes:

- `generate`: write a `.ser` file only.
- `extract`: run extraction with an existing `--rule`.
- `generate-and-extract`: generate SER, run CLI, and write `facts.jsonl`.

The helper writes:

```text
.static-extract/generated.ser
.static-extract/facts.jsonl
.static-extract/report.json
```

The deterministic helper currently supports React button text, React button
actions, React frontend API calls, Java annotated method facts, and Java config
field facts. For other requests, author SER directly from the vocabulary
reference, then use the relevant CLI.
