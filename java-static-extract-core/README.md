# Java Static Extract Rule Language

This module defines the user-facing rule language and the execution model for
extracting static facts from Java code elements.

The rule authoring model is intentionally small:

```text
rule      metadata
fact      standard fact type for cross-language outputs
endpoint  endpoint type and direction
find      locate a Java code position
let       extract named values from nearby code elements
build     assemble output fields from those values
```

## Core Idea

Rules should read like a description of code:

```ser
rule "Spring MVC HTTP Inbound"
fact backend_endpoint

find method with annotation @*Mapping

let basePath =
  from annotation on class @RequestMapping take attr(value)
  from annotation on class @RequestMapping take attr(path)
  default ""

let methodPath =
  from annotation on method @*Mapping take attr(value)
  from annotation on method @*Mapping take attr(path)
  default ""

let httpMethod =
  from annotation on method @*Mapping
  take name
  map {
    GetMapping: GET
    PostMapping: POST
    PutMapping: PUT
    DeleteMapping: DELETE
    PatchMapping: PATCH
    RequestMapping: GET
  }

build {
  httpMethod: httpMethod
  path: concat(basePath, methodPath) | normalize slash
}
```

## Module Layout

```text
com.poseidon.javastatic.extract.language
  Public SER words and parser contracts.
  Examples: rule, endpoint, find, from, on, take, build.
  Ser.g4 defines the grammar; AntlrSerRuleParser turns text into the rule model.
  RuleVocabulary describes runtime-specific words such as Java method/field or
  future TSX jsx/prop/children terms.

com.poseidon.javastatic.extract.rule
  The complete rule shape.
  StaticExtractRule = endpoint + find + let values + build fields.

com.poseidon.javastatic.extract.source
  The value extraction model.
  It describes Java elements, selectors, from/on/take, ordered fallback sources,
  and named let values.

com.poseidon.javastatic.extract.build
  The endpoint assembly model.
  It describes concat, references, constants, and build-time actions such as
  regex, replace, normalize, upper, lower, and map.

com.poseidon.javastatic.extract.runtime
  Runtime-neutral execution contracts. Concrete engines such as JDT should
  implement these contracts without exposing AST terms to rule authors.
```

## Operators

- `rule`: names a rule.
- `fact`: declares a standard fact type, for example `backend_endpoint`,
  `frontend_api_call`, `ui_action`, or `config_key`.
- `endpoint`: declares the endpoint kind, for example `HTTP inbound`.
- `endpoint`: declares endpoint labels such as `HTTP inbound`, `MQ outbound`,
  or any custom pair. The extract layer does not validate these labels.
- `find`: locates the Java code position that anchors extraction.
- `let`: declares a named value extracted from ordered sources.
- `from`: selects the source code element to read from.
- `take`: selects which value is read from that source.
- `default`: fallback value when all sources for a `let` are empty.
- `map`: maps raw values to normalized business values.
- `build`: assembles final endpoint fields.

Built-in expression functions are separate from structural operators:

- `concat`: combines values; multi-value inputs produce multiple endpoint rows.
- `regex`, `replace`, `normalize`: build-time value processing.

## Parser Flow

```text
.ser text
  -> ANTLR lexer/parser generated from Ser.g4
  -> AntlrSerRuleParser
  -> StaticExtractRule
```

The generated ANTLR classes only parse syntax. The conversion into domain
objects is owned by `AntlrSerRuleParser`.

## Java Elements

The language describes Java concepts, not JDT AST names:

- `package`
- `import`
- `class`
- `annotation`
- `field`
- `method`
- `parameter`
- `argument`
- `return`
- `new`
- `literal`

Assignments and local variables are primarily internal tracing concepts. A rule
usually says `take value`; the runtime then resolves variables, fields, string
concatenation, and supported configuration placeholders automatically.

## Value Semantics

Each `let` may declare multiple `from` sources. Sources are tried in order; the
first source that yields a value wins. If no source yields a value, `default` is
used.

`take value` means "give me the semantic value". It traces by default.

Use `take raw` only when the rule needs the surface code expression.

```ser
let path =
  from argument[0]
  take value
```

This should resolve all of these when possible:

```java
restTemplate.getForObject("/api/users", User.class);

String path = "/api/users";
restTemplate.getForObject(path, User.class);

String path = basePath + "/users";
restTemplate.getForObject(path, User.class);
```

## Method Calls

Rules should describe the Java method being invoked:

```ser
find method RestTemplate.[getForObject,postForObject,exchange]
find method Router.[get,post,put,delete,patch]
find method KafkaTemplate.send
```

The runtime decides whether a `method` rule means a declaration, such as a
Spring controller method with annotations, or an invocation, such as
`Router.get(...)`, from the rest of the selector.

## Endpoint Fields

The build block emits arbitrary fields. This module does not require fixed
fields such as `httpMethod`, `path`, `topic`, or `keyPattern`.

```ser
endpoint HTTP inbound

build {
  httpMethod: httpMethod
  path: concat(basePath, methodPath) | normalize slash
}
```

The extracted fields are the values produced by the rule.
