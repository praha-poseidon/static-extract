# SER Language Specification

SER is the Static Extract Rule language. This document defines the portable
language contract shared by all extractors.

`spec/ser/Ser.g4` is the grammar source of truth. This document defines the
semantics that grammar alone cannot express.

## Compatibility Terms

The words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are normative.

## File Types

SER has two top-level file types.

### Extraction Rule File

An extraction rule file MUST contain exactly one extraction rule:

```text
ruleDecl ruleTargetDecl findDecl letDecl* buildDecl EOF
```

Order is significant and MUST be:

```ser
rule "Readable Rule Name"
fact fact_type

find extractor selector

let valueName =
  from extractor source take extractor value
  default "optional fallback"

build {
  fieldName: expression
}
```

`endpoint` MAY be used instead of `fact` for legacy endpoint rules, but new
cross-language rules SHOULD use `fact`.

### Trace Rule File

A trace rule file MUST contain one trace declaration and zero or more trace
entries:

```text
traceDecl traceEntry* EOF
```

Trace rules are extractor-specific extensions used to resolve external values or
language-specific value flows.

## Shared Syntax

These language constructs are shared by all extractors:

```text
rule
fact
endpoint
find
let
from
take
default
map
build
concat
normalize
regex
replace
trace
when
```

Shared syntax defines structure only. Extractor vocabulary defines what a selector
means for a source language.

## Extractor Vocabulary

Extractor vocabulary is the set of words an extractor understands inside `find`,
`from`, `take`, and `when`.

Examples:

```text
Java/JDT: method, class, field, annotation, argument, return, call, new
TS/TSX: jsx, component, prop, children, hook, import, route, call
Vue: component, template, directive, slot, event, binding, script
```

A parser MUST preserve unknown vocabulary as structured names when the grammar
accepts it. An extractor MUST validate whether it supports that vocabulary before
or during execution. Unsupported vocabulary MUST produce a diagnostic or an
empty result; it MUST NOT silently produce incorrect fields.

## Rule Metadata

### `rule`

`rule` declares a human-readable name.

```ser
rule "React Button Action"
```

The rule name MUST be included in every emitted fact as `rule`.

### `fact`

`fact` declares the output fact type.

```ser
fact ui_action
```

The fact type MUST be included in every emitted fact as `factType`.

Fact type values are identifiers. The spec does not hard-code a closed list, but
extractors and rule packs SHOULD prefer stable, lower-case snake-case names.

### `endpoint`

`endpoint` is a legacy rule target:

```ser
endpoint HTTP inbound
```

Extractors MUST expose endpoint labels as classifiers:

```json
{
  "category": "HTTP",
  "direction": "inbound"
}
```

For compatibility, extractors MAY derive `factType` from endpoint labels. New
rules SHOULD use explicit `fact`.

## Find

`find` selects the anchor locations where a rule runs.

```ser
find method with annotation @GetMapping
find method RestTemplate.getForObject
find jsx Button
find export [GET,POST]
```

Extractor vocabularies MAY support a bracketed name list after `find`. A list is
equivalent to running the same selector once per listed name and may emit
multiple facts from one rule.

Each matched anchor MAY emit zero, one, or multiple facts, depending on value
cardinality during `build`.

If `find` matches nothing, the rule emits no facts.

## Let

`let` declares a named value.

```ser
let path =
  from annotation on method @GetMapping take attr(value)
  from annotation on method @GetMapping take attr(path)
  default ""
```

Each `let` MUST contain one or more `from ... take ...` sources.

Sources are evaluated in order. The first source that yields one or more values
wins. Later sources MUST NOT be evaluated for the same `let` after a value is
found, except for diagnostics.

If no source yields a value and `default` is present, the default value is used.
If no source yields a value and no `default` is present, the value is empty.

## From

`from` selects a source relative to the current anchor.

```ser
from annotation on method @Route take attr(value)
from argument[0] take value
from children take text
from prop onClick take reference
```

The grammar includes built-in Java-oriented source forms and generic source
forms. Non-Javan extractors SHOULD use generic forms when their vocabulary is not
represented by a built-in grammar branch.

## Take

`take` selects what to read from a source.

Shared take names include:

```text
name
value
raw
type
owner
signature
attr(...)
```

Extractor-specific take names are allowed:

```ser
from children take text
from prop onClick take reference
```

`take raw` MUST mean source text or extractor-native surface representation.

`take value` MUST mean semantic value after extractor-supported static tracing.
The tracing depth and language features are extractor-specific, but extractors MUST
document their supported value tracing behavior.

`take attr(a,b,c)` MUST try attributes in the listed order and return the first
attribute that exists and has a value.

## Map

A `map` block on a `let` maps raw extracted values to normalized values.

```ser
let httpMethod =
  from annotation on method @*Mapping take name
  map {
    GetMapping: GET
    PostMapping: POST
  }
```

If a value exists in the map, it MUST be replaced with the mapped value.
If a value does not exist in the map, it SHOULD remain unchanged.

Pipeline `map` has the same value-mapping semantics and applies at build time.

## Build

`build` declares output fields.

```ser
build {
  method: httpMethod
  path: concat(basePath, "/", methodPath) | normalize slash
}
```

Only fields declared in `build` appear inside the emitted fact's `fields`
object. Extractors MUST NOT add framework-specific fields to `fields` unless the
rule declared them.

Build field names are identifiers. Values are strings. An extractor MAY skip a
field when the expression resolves to no value, but it MUST NOT invent a value.

If a build expression produces multiple values, extractors MAY emit multiple
facts. All emitted facts MUST preserve the same stable envelope and differ only
where expression values differ.

## Expressions

Build expressions are:

```text
string literal
let reference
concat(...)
```

`concat` joins string values in order. If any input has multiple values,
extractors SHOULD produce the cross-product in stable order.

## Pipelines

Pipeline steps transform build expression values:

```ser
path: raw | regex "path=(.*)" group 1 | replace "\\s+" "" | normalize slash
```

Pipeline steps run left to right.

Supported shared pipeline operators are:

```text
normalize IDENT
regex STRING group INT
replace STRING STRING
map { ... }
```

Normalizer names are extractor-defined. An extractor MUST document its supported
normalizers. Unsupported normalizers MUST produce a diagnostic or leave the value
unchanged with a warning; they MUST NOT corrupt the value silently.

## Comments And Whitespace

Whitespace separates tokens and is otherwise not semantically significant.

Line comments start with `#` or `//`.

Block comments use `/* ... */`.

Comments MUST NOT affect rule semantics.

## Output Contract

Every emitted fact MUST validate against:

```text
spec/schema/extracted-fact.schema.json
```

The stable envelope is:

```json
{
  "rule": "Rule Name",
  "factType": "fact_type",
  "classifiers": {},
  "fields": {},
  "projectFilePath": "relative/path",
  "absoluteFilePath": "/absolute/path",
  "startLine": 1,
  "endLine": 1,
  "enclosingSymbol": "symbolName"
}
```

`classifiers` contains rule target labels and other stable classification data.
`fields` contains only rule-built fields.

## Diagnostics

Extractors SHOULD provide diagnostics when:

- the parser rejects a SER file;
- an extractor vocabulary item is unsupported;
- a `take` operation is unsupported for a matched source;
- a pipeline operator or normalizer is unsupported;
- a rule matches anchors but cannot build any fields.

Diagnostics are extractor-specific and are not part of the extracted fact schema.

## Conformance

An extractor conforms to this spec when it:

- parses `spec/ser/Ser.g4` or a grammar generated from it;
- preserves and validates extractor vocabulary;
- follows the `let`, `default`, `map`, `build`, and pipeline semantics in this
  document;
- emits JSONL records that validate against
  `spec/schema/extracted-fact.schema.json`;
- exposes a CLI compatible with `spec/cli/extractor-cli.md`.
