# Static Extract TypeScript Runtime Vocabulary

This file defines the SER vocabulary currently implemented by the TypeScript
runtime. SER authoring tools and Skills must stay within this vocabulary unless
they also update the runtime.

## React

Supported find selectors:

```ser
find jsx button
find call fetch
find call axios
```

Supported source expressions:

```ser
from jsx button take text
from prop onClick take reference
from call take method
from call take name
from call take owner
from argument[0] take value
```

Current behavior:

- Scans `.tsx` and `.jsx` files.
- Matches `<button>...</button>`.
- Extracts literal text, for example `<button>Save</button>` -> `Save`.
- Extracts simple expression text as a symbolic label, for example
  `<button>{submitText}</button>` -> `{submitText}`.
- Extracts simple `onClick` handler references from button props, for example
  `<button onClick={handleSave}>Save</button>` -> `handleSave`.
- Emits `enclosingSymbol` when the button appears inside a function component
  such as `function App()`.
- Matches `fetch("/path")`.
- Matches `axios.get("/path")`, `axios.post("/path")`, `axios.put("/path")`,
  `axios.patch("/path")`, and `axios.delete("/path")`.
- Resolves simple string constants used as call arguments.

Recommended fact:

```ser
fact ui_text
fact ui_action
fact frontend_api_call
```

Recommended build fields:

```ser
build {
  component: "react"
  kind: "button"
  event: "click"
  text: label
  handler: handler
}
```

```ser
build {
  client: "axios"
  method: method
  path: path
}
```
