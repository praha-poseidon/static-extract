# Static Extract Spec Examples

These examples are executable compatibility fixtures for runtime
implementations. Each example contains:

- `input/`: source files used by the runtime.
- `rule.ser`: the SER rule under test.
- `expected.jsonl`: the expected extracted fact output.

Runtime test suites SHOULD run the examples for their supported languages and
compare the produced JSONL with `expected.jsonl`. Values in `expected.jsonl`
may use `${EXAMPLE_DIR}` for the absolute path of the example directory.

