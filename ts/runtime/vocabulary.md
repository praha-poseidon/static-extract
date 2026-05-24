# Static Extract TypeScript Runtime Vocabulary

This runtime is implemented on top of `ts-morph` and the TypeScript AST. SER
selectors map to AST shapes instead of framework-specific branches.

## Supported Find Selectors

```ser
find jsx <tagName>
find call <callee>
find function <name>
find variable <name>
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
from call take method
from call take raw
from return take value
from return take raw
from variable take name
from variable take value
from variable take raw
```

## Value Tracing

The first AST implementation supports syntax-only tracing for:

- string literals
- no-substitution template literals
- identifiers bound to local variable declarations
- template expressions
- binary string concatenation with `+`
- object property access for local object literals

This runtime does not yet use the TypeScript type checker or cross-file symbol
resolution.
