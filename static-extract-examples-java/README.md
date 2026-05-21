# Static Extract Examples

This module contains example SER rules. It is not required by
`static-extract-runtime-java-jdt`.

这个模块提供示例 SER 规则。`static-extract-runtime-java-jdt` 不依赖这个模块。

The rules are packaged under the same classpath location that applications use:

示例规则放在和业务应用相同的 classpath 目录结构下：

```text
static-extract/rules/index.txt
static-extract/rules/**/*.ser
static-extract/traces/index.txt
static-extract/traces/**/*.ser
```

If this module is added to a runtime classpath, `SerRuleLoader` and
`JavaStaticExtractRunner` can load these examples as application rules. In a
real project, copy the rules you want into your own
`src/main/resources/static-extract/rules/` directory and modify them there.

如果这个模块被加入运行时 classpath，`SerRuleLoader` 和 runner 就能把这些示例规则当成应用规则加载。真实项目里建议把需要的规则复制到自己项目的 `src/main/resources/static-extract/rules/` 目录下再修改。

Current examples:

当前示例：

- Spring MVC HTTP inbound extract rule
- RestTemplate HTTP outbound extract rule
- Spring config trace rule for `@Value("${...}")` and `Environment.getProperty(...)`

- Spring MVC HTTP 入站提取规则
- RestTemplate HTTP 出站提取规则
- 用于 `@Value("${...}")` 和 `Environment.getProperty(...)` 的 Spring 配置 trace 规则

## Runnable Example Project

可运行示例项目。

The module also contains a tiny Spring-style project under:

这个模块还包含一个很小的 Spring 风格示例项目：

```text
src/test/resources/example-project
```

It includes:

里面包含：

- `UserController`, with `@RequestMapping`, `@GetMapping`, and `@PostMapping`.
- `UserController`，包含 `@RequestMapping`、`@GetMapping` 和 `@PostMapping`。
- `UserClient`, with `RestTemplate.getForObject` and `postForObject`.
- `UserClient`，包含 `RestTemplate.getForObject` 和 `postForObject`。
- Small fake Spring annotations and `RestTemplate` classes, so the example can
  run without downloading Spring.
- 很小的模拟 Spring 注解和 `RestTemplate` 类，所以这个示例不需要下载 Spring 也能跑。

Run:

运行：

```bash
mvn -pl static-extract-examples-java -am test
```

The test writes the extracted result to:

测试会把提取结果写到：

```text
static-extract-examples-java/target/example-output.txt
```

Expected facts include:

预期提取结果包括：

```text
HTTP inbound  GET  /api/users/{param}
HTTP inbound  POST /api/users
HTTP outbound GET  /api/users/{param}
HTTP outbound POST /api/users
```

Trace rule guide: [../docs/TRACE_RULES.md](../docs/TRACE_RULES.md).

trace 规则说明见 [../docs/TRACE_RULES.md](../docs/TRACE_RULES.md)。
