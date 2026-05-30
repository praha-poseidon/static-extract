# Static Extract TypeScript Extractor Vocabulary

This extractor is implemented on top of `ts-morph` and the TypeScript AST. SER
selectors map to AST shapes instead of framework-specific branches.

## Supported Find Selectors

```ser
find file
find export <name>
find import <moduleSpecifier>
find class <name>
find function <name>
find method <name>
find field <name>
find variable <name>
find parameter <name>
find call <callee>
find return <name>
find assignment <name>
find decorator <name>
find jsx <tagName>
```

Selectors accept one name, no name (`*`), or a bracketed list. One rule can emit
facts for every matched name:

```ser
find export [GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS]
find call [get,post,put,patch,delete]
find decorator [Get,Post,Put,Patch,Delete]
find jsx [button,a,Button]
```

Examples:

```ser
find jsx button
find jsx ActionButton
find call fetch
find call axios.post
find call request
find function handleSave
find variable API_PATH
find import react
find class UserPanel
find method save
find decorator Get
find file route
find export default
```

The extractor treats these as TypeScript/JavaScript language elements only. It
does not assign endpoint, UI action, route, or framework meaning to any match;
SER rules decide what a matched element means.

## Rule Conditions

Extract rules can narrow anchors with generic `when` clauses:

```ser
find call get
when call owner router

find call request
when call name request

find method save
when method name save

find field url
when field type string

find parameter path
when parameter name path

find assignment url
when assignment field url
```

## Supported Sources

```ser
from children take text
from jsx <tagName> take text
from prop <name> take value
from prop <name> take reference
from prop <name> take raw
from argument[0] take value
from argument[0] take raw
from call take name
from call take owner
from call take callee
from call take method
from call take raw
from handler take reference
from handler take raw
from handler last take reference
from file take path
from file take name
from file take dir
from file take extension
from export default take reference
from export GET take reference
from decorator take name
from decorator take value
from decorator take attr(0)
from return take value
from return take raw
from method take name
from method take raw
from field take name
from field take type
from field take value
from parameter take name
from parameter take type
from assignment take name
from assignment take value
from variable take name
from variable take value
from variable take raw
from import take module
from import take default
from import take namespace
from import take named
from import take raw
from class take name
from class take extends
from class take raw
from export take name
from export take value
from export take reference
from export take module
from export take kind
from export take raw
```

`from file ...` reads the current source file. It works from any anchor in that
file, including `find export ...`.

`from export <name> ...` reads exports from the current file when the current
anchor is `file`. For example, `from export default take reference` returns the
local symbol behind a default export when one exists.

Export values are language-level module facts:

- `name`: exported name, such as `GET`, `POST`, or `default`
- `reference`: local symbol or expression behind the export, such as `handler`
- `value`: same as `reference`, or `module/reference` for re-exports
- `raw`: source text for the export node
- `kind`: `function`, `class`, `variable`, `export`, `reexport`, or `default`
- `module`: module specifier for re-exports

`let` supports source fallback and value mapping:

```ser
let method =
  from variable take value
  default post
  map { get: GET post: POST }
```

`build` supports `concat(...)` and generic pipeline steps:

```ser
build {
  path: concat(basePath, "/", methodPath) | normalize httpPath
  method: rawMethod | map { get: GET post: POST }
  key: raw | regex "\\$\\{([^}:]+)" group 1
  pathWithoutQuery: raw | replace "\\?.*$" ""
}
```

Built-in normalizers are generic value transforms: `trim`, `upper`, `lower`,
`slash`, `httpPath`, `routePath`, and `fileRoutePath`.

`fileRoutePath` is a generic file-route path normalizer. It removes common source
prefixes and file suffixes, uses the last `api` path segment when present,
removes group/slot path segments such as `(group)` and `@slot`, and normalizes
bracket parameters like `[id]`, `[...slug]`, and `[[...slug]]` to `{param}`.

## Value Tracing

The TypeScript extractor builds a `ts-morph` project for the selected sources.
Value tracing supports:

- string literals
- no-substitution template literals
- identifiers bound to local and imported variable declarations
- template expressions
- binary string concatenation with `+`
- object property access for local object literals
- object destructuring from traced object literals
- array element access and array destructuring from traced array literals
- assignment values
- called function returns with simple argument-to-parameter substitution
- trace-ser continuation for stuck `call`, `field`, `parameter`, `method`,
  `return`, and `assignment` targets
- external dictionary lookup through trace-ser `namespace` + `key`

Basic cross-file tracing works when TypeScript can resolve the imported symbol.
For example, `fetch(API)` can resolve `API` from `import { API } from "./config"`.

Project sessions created through `createStaticExtractTsSession` reuse the same
project AST across repeated rule runs.

Limits still apply for dynamic `require`, runtime mutation, generated aliases
that are not visible to the TypeScript project, and values that only exist at
runtime unless they are supplied through external values.

## Limits

Route chains such as `router.route("/users/:id").get(handler)` are not modeled
as a framework concept. The extractor can expose the language-level calls
(`router.route(...)` and `.get(...)`) and their arguments, but a portable SER
rule currently cannot join receiver-call arguments into one fact without a more
general receiver-call vocabulary. Keep this composition in downstream rules or a
future generic receiver-call extension.
