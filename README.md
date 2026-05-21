# Static Extract

Static Extract provides a small SER rule language, runtime-neutral rule models,
and language runtimes for extracting static facts from source code. The current
runtime is Java/JDT.

Static Extract 提供一套小型 SER 规则语言、运行时无关的规则模型，以及面向不同语言的运行时，用来从源码中静态提取信息。当前运行时是 Java/JDT。

It is designed for AI coding agents and other automation that needs reliable
static facts instead of fragile text search.

它面向 AI 编码 agent 和其他自动化场景，目标是提供可靠的静态事实，而不是依赖脆弱的文本搜索。

Current status: `0.0.1-SNAPSHOT`, alpha. The core model is usable, but SER
syntax and Java APIs may still change before a stable release.

当前状态是 `0.0.1-SNAPSHOT`，alpha 阶段。核心模型已经可以使用，但在稳定版本之前，SER 语法和 Java API 仍可能调整。

## Background

Many tools need to extract structured facts from source code: HTTP endpoints,
RPC calls, message topics, database operations, cache keys, UI actions, or other
framework-specific code shapes. These facts are often written in code as
annotations, method calls, constants, string concatenations, return values, or
configuration placeholders.

很多工具都需要从源码中提取结构化信息，例如 HTTP 入口、RPC 调用、消息 topic、数据库操作、缓存 key、UI action，或者其他框架相关的代码形态。这些信息通常不是直接写在一个地方，而是分散在注解、方法调用、常量、字符串拼接、返回值、配置占位符等代码形态里。

Hard-coding every framework parser into an engine makes the engine difficult to
extend. Static Extract separates the problem into two parts:

把所有框架解析逻辑都写死在引擎里，会让引擎很难扩展。Static Extract 把问题拆成两层：

- SER rules describe what code shape to find and what fields to build.
- A language runtime executes those rules, traces values for that language, and
  returns a stable field map. The first runtime is Java/JDT.

- SER 规则描述要找什么代码形态，以及最终要 build 出哪些字段。
- 语言运行时负责执行规则、追踪对应语言里的值，并返回稳定的字段 Map。当前第一个运行时是 Java/JDT。

## AI and Agent Use

AI 编码助手通常需要从源码中拿到可验证的结构化事实。直接让大模型扫描源码容易受到上下文长度、幻觉和字符串匹配误差影响。Static Extract 把这部分工作拆成可执行、可验证的规则：

- AI agents can generate or adjust SER rules, then call the CLI to verify them
  against real Java files.
- AI agents can use `diagnose` to inspect source facts when a rule does not
  match, instead of guessing from raw source text.
- SER rules keep framework-specific extraction logic explicit and versionable.

- AI agent 可以生成或调整 SER 规则，再调用 CLI 在真实 Java 文件上验证。
- 当规则没有命中时，AI agent 可以用 `diagnose` 查看源码事实，而不是只靠源码文本猜测。
- SER 规则把框架相关的提取逻辑显式化，并且可以像代码一样版本化。

## What It Can Do

Static Extract can:

Static Extract 当前可以做这些事：

- Locate Java classes, methods, fields, annotations, method calls, arguments,
  return values, object creation, and literals.
- 定位 Java 类、方法、字段、注解、方法调用、参数、返回值、对象创建和字面量。
- Extract names, raw source text, types, annotation attributes, and semantic
  values.
- 抽取名称、源码文本、类型、注解属性和语义值。
- Trace simple Java values through string literals, local variables, fields,
  string concatenation, and return expressions.
- 追踪简单 Java 值，包括字符串字面量、局部变量、字段、字符串拼接和 return 表达式。
- Use trace rules to resolve external configuration values such as
  `@Value("${...}")` and `Environment.getProperty(...)`.
- 使用 trace 规则解析外部配置值，例如 `@Value("${...}")` 和 `Environment.getProperty(...)`。
- Build arbitrary output fields as `Map<String, String>`.
- 通过 `build` 生成任意输出字段，最终得到 `Map<String, String>`。
- Let users provide their own extract rules, trace rules, external value
  resolver, or JDT trace resolver.
- 允许用户提供自己的提取规则、trace 规则、外部值解析器，或者自定义 JDT trace 解析逻辑。

The runtime module does not ship framework rules by default. Framework examples
such as Spring MVC and RestTemplate live in `static-extract-examples-java`.

runtime 模块默认不内置框架规则。Spring MVC、RestTemplate 这类规则放在 `static-extract-examples-java` 里作为示例。

## Modules

项目分为核心模块和语言运行时模块。核心模块只放通用规则模型；Java 相关能力放在 Java runtime、Java CLI 和 Java 示例模块里。

```text
static-extract-core
  SER grammar, parser contracts, and runtime-neutral rule models.
  定义 SER 语法、解析接口，以及不依赖具体运行时的规则模型。

static-extract-runtime-java-jdt
  Eclipse JDT based runtime, loaders, value tracing, and build evaluators.
  基于 Eclipse JDT 执行规则，负责加载规则、追踪值、计算 build 输出。

static-extract-runtime-java-assistant
  Agent-facing workflow API: init, try, diagnose, and run.
  面向 agent 的工作流 API：init、try、diagnose、run。

static-extract-runtime-java-cli
  Picocli based command line entry point over the assistant workflow API.
  基于 picocli 的命令行入口，底层调用 assistant 工作流 API。

static-extract-examples-java
  Example SER rules. This module is optional and is not required by the JDT
  runtime.
  示例规则模块，是可选模块；JDT runtime 不依赖它，也不会默认内置这些框架规则。
```

## CLI

The CLI is designed for agents and local automation. It does not generate SER
rules by itself. An agent can inspect a project, write SER files, call `try` or
`diagnose`, adjust the rules, and finally call `run`.

CLI 是给 agent 和本地自动化用的。它本身不负责生成 SER 规则；agent 可以自己扫描项目、写 SER 文件、调用 `try` 或 `diagnose` 验证规则，再调整规则，最后调用 `run`。

Typical CLI workflow:

典型 CLI 使用流程：

```text
init      prepare a .ser workspace under the target Java project
try       test one or more SER rules against selected Java files
diagnose  inspect source facts when a rule does not match
run       execute stable rules against the whole project and write results
```

```text
init      在目标 Java 项目下准备 .ser 工作区
try       用指定 Java 文件试跑一份或多份 SER 规则
diagnose  规则没有命中时查看源码事实，辅助调整规则
run       对完整项目执行稳定规则，并写出结果
```

Recommended install for normal users:

普通用户推荐安装方式：

```bash
curl -L -o static-extract-java.zip \
  https://github.com/praha-poseidon/java-static-extract/releases/latest/download/static-extract-java.zip
unzip static-extract-java.zip
export PATH="$PWD/static-extract-java/bin:$PATH"
static-extract-java --help
```

The release package contains the CLI scripts and dependency jars. It does not
need Maven on the target machine. It only needs JDK 21 or newer.

release 包已经包含 CLI 脚本和依赖 jar，目标机器不需要安装 Maven，只需要 JDK 21 或更新版本。

Source install for contributors:

贡献者源码安装方式：

```bash
./install.sh
```

If the downloaded file is not executable, run it through `bash`:

如果下载后脚本没有执行权限，可以直接用 `bash` 运行：

```bash
bash install.sh
```

This builds the CLI from source, links `static-extract-java` into
`~/.local/bin`, and installs the agent skill into
`~/.codex/skills/static-extract-java` and `~/.claude/skills/static-extract-java`.

它会从源码构建 CLI，把 `static-extract-java` 命令链接到 `~/.local/bin`，并把 agent skill 安装到 `~/.codex/skills/static-extract-java` 和 `~/.claude/skills/static-extract-java`。

If the command is not found after installation, add `~/.local/bin` to `PATH`.

如果安装后找不到命令，把 `~/.local/bin` 加到 `PATH`。

Source install prerequisites:

源码安装前置条件：

```text
JDK 21 or newer
Maven 3.8+ or a project Maven wrapper
Network access to Maven repositories, unless dependencies are already cached
```

```text
JDK 21 或更新版本
Maven 3.8+，或者项目自带 Maven wrapper
可以访问 Maven 仓库的网络，除非依赖已经在本机缓存
```

On locked-down corporate machines, common fixes are:

公司电脑限制较多时，常见处理方式：

```bash
# Install only the CLI and skip agent skill installation.
./install.sh --no-skills

# Install into a writable directory when ~/.local/bin is restricted.
./install.sh --bin-dir "$HOME/bin"

# If Maven dependencies cannot be downloaded, configure the company Maven mirror
# in ~/.m2/settings.xml, then rerun install.
```

```bash
# 只安装 CLI，跳过 agent skill 安装。
./install.sh --no-skills

# 如果 ~/.local/bin 受限，安装到一个可写目录。
./install.sh --bin-dir "$HOME/bin"

# 如果 Maven 依赖下载失败，先在 ~/.m2/settings.xml 配置公司 Maven 镜像，再重新执行安装。
```

Manual build:

手动构建：

```bash
mvn -pl static-extract-runtime-java-cli -am package
```

The package step creates a normal command script:

package 会生成一个普通命令脚本：

```text
static-extract-runtime-java-cli/target/appassembler/bin/static-extract-java
```

Available commands:

可用命令：

```text
init       Create .ser/generated, .ser/report, and .ser/result under a project.
           在项目下创建 .ser/generated、.ser/report、.ser/result。

try        Run one or more SER rules against selected Java files.
           用一份或多份 SER 规则试跑指定 Java 文件。

diagnose   Run try and return source facts when no result is emitted.
           先试跑；如果没有结果，就返回源码事实，帮助 agent 修规则。

run        Run rules against a project or explicit source paths.
           对整个项目或显式 source 执行规则。
```

Common options:

常用参数：

```text
--project          Java project root. Common Maven and Gradle paths are inferred.
--file             Java file used by try or diagnose. Can be repeated.
--source           Java source directory or file used by run. Can be repeated.
--classes          Compiled class directory. Helps JDT resolve exact types.
--dependency       Dependency jar or directory containing jars.
--rule             SER extract rule file. Can be repeated.
--rules            Directory containing SER extract rules.
--trace-rule       SER trace rule file. Can be repeated.
--trace-rules      Directory containing SER trace rules.
--builtin          Load classpath rules and trace rules.
--external-values  JSON file used by trace rules to resolve external values.
--out              JSONL output path for run.
```

```text
--project          Java 项目根目录，会自动推断常见 Maven 和 Gradle 路径。
--file             try 或 diagnose 使用的 Java 文件，可重复传入。
--source           run 使用的 Java 源码目录或文件，可重复传入。
--classes          编译后的 class 目录，帮助 JDT 解析准确类型。
--dependency       依赖 jar，或包含 jar 的目录。
--rule             SER 提取规则文件，可重复传入。
--rules            包含 SER 提取规则的目录。
--trace-rule       SER trace 规则文件，可重复传入。
--trace-rules      包含 SER trace 规则的目录。
--builtin          加载 classpath 中的规则和 trace 规则。
--external-values  trace 规则解析外部值时使用的 JSON 文件。
--out              run 命令的 JSONL 输出路径。
```

Example:

示例：

```bash
static-extract-runtime-java-cli/target/appassembler/bin/static-extract-java init \
  --project /my-project

static-extract-runtime-java-cli/target/appassembler/bin/static-extract-java try \
  --project /my-project \
  --file /my-project/src/main/java/demo/Api.java \
  --rule /my-project/.ser/generated/http.ser

static-extract-runtime-java-cli/target/appassembler/bin/static-extract-java diagnose \
  --project /my-project \
  --file /my-project/src/main/java/demo/Api.java \
  --rule /my-project/.ser/generated/http.ser

static-extract-runtime-java-cli/target/appassembler/bin/static-extract-java run \
  --project /my-project \
  --rule /my-project/.ser/generated/http.ser \
  --out /my-project/.ser/result/extract.jsonl
```

`run` also accepts explicit inputs when no project root should be inferred:

如果不想让 runner 从项目根目录推断，也可以显式传输入：

```bash
static-extract-runtime-java-cli/target/appassembler/bin/static-extract-java run \
  --source /my-project/src/main/java \
  --classes /my-project/target/classes \
  --dependency /my-project/target/dependency \
  --rule /my-project/.ser/generated/http.ser
```

Every command prints JSON. `run --out` writes JSON Lines, one extracted record
per line. Trace external values can be passed with `--external-values` as JSON:

每个命令都会输出 JSON。`run --out` 会写 JSON Lines，每行一条提取结果。trace 所需的外部值可以通过 `--external-values` 传入 JSON：

```json
{
  "config": {
    "service.base-url": ["http://users"]
  }
}
```

## SER File Loading

SER 文件加载规则。

Classpath resources use fixed directories plus `index.txt`. Java cannot
reliably list files from a directory after resources are packaged into a jar, so
classpath loading is explicit through the index file.

classpath 资源使用固定目录和 `index.txt`。因为 Java 资源打成 jar 后不能可靠枚举目录，所以 classpath 下必须通过 `index.txt` 明确声明要加载哪些规则文件。

Application extract rules:

业务项目自己的提取规则放在这里。

```text
src/main/resources/static-extract/rules/index.txt
src/main/resources/static-extract/rules/**/*.ser
```

Application trace rules:

业务项目自己的 trace 规则放在这里。

```text
src/main/resources/static-extract/traces/index.txt
src/main/resources/static-extract/traces/**/*.ser
```

Each `index.txt` contains paths relative to its directory:

每个 `index.txt` 里写的是相对当前目录的规则文件路径。

```text
# src/main/resources/static-extract/rules/index.txt
spring/http-inbound.ser
client/rest-template-outbound.ser
```

When rules come from the filesystem instead of classpath resources, callers may
pass a directory directly. Directory loading recursively reads `*.ser` files and
does not need `index.txt`.

如果规则来自普通文件系统目录，而不是 classpath 资源，可以直接传目录。目录加载会递归读取所有 `*.ser` 文件，不需要 `index.txt`。

## Loader API

规则加载 API。

```java
SerRuleLoader loader = new SerRuleLoader();

List<StaticExtractRule> rules = loader.loadAll();
List<StaticTraceRuleSet> traces = loader.loadApplicationTraceRules();
```

`loadAll()` loads application rules from `static-extract/rules/index.txt` when
that resource exists. The runtime module does not ship framework rules by
default.

`loadAll()` 会读取应用 classpath 下的 `static-extract/rules/index.txt`。runtime 模块不默认携带 Spring MVC、RestTemplate 等框架规则。

For explicit files:

如果你想显式指定文件系统目录，可以这样加载。

```java
List<StaticExtractRule> rules = loader.loadRulesFromDirectory(Path.of("rules"));
List<StaticTraceRuleSet> traces = loader.loadTraceRulesFromDirectory(Path.of("traces"));
```

## Project Runner

项目级运行入口。

Most callers should use `JavaStaticExtractProjectRunner`. Pass a project root
and it will find common Maven and Gradle source/class/dependency locations.

大多数使用方应该直接用 `JavaStaticExtractProjectRunner`。传入项目根目录后，它会自动查找常见的 Maven、Gradle 源码目录、编译输出目录和依赖目录。

```java
JavaStaticExtractProjectRunner runner = JavaStaticExtractProjectRunner.builder()
    .project(Path.of("/my-project"))
    .externalValues(Map.of(
        "config", Map.of("service.base-url", List.of("http://users"))))
    .build();

List<StaticExtractResult> results = runner.extract();
```

`project` is the project root, usually the directory containing `pom.xml` or
`build.gradle`. If only `project` is passed, the runner checks these common
locations:

`project` 是项目根目录，通常就是包含 `pom.xml` 或 `build.gradle` 的目录。只传 `project` 时，runner 会检查这些常见位置：

```text
src/main/java
src/test/java
target/classes
target/test-classes
build/classes/java/main
build/classes/java/test
libs
target/dependency
```

When there is no project root, pass the inputs explicitly:

如果没有项目根目录，就显式传入需要解析的内容：

```java
JavaStaticExtractProjectRunner runner = JavaStaticExtractProjectRunner.builder()
    .source(Path.of("/my-project/src/main/java"))
    .classes(Path.of("/my-project/target/classes"))
    .dependency(Path.of("/my-project/target/dependency"))
    .build();
```

`source` is the Java source directory or one `.java` file to analyze.

`source` 是要分析的 Java 源码目录，或者单个 `.java` 文件。

`classes` is the compiled class directory of the current project, such as
`target/classes`. It helps JDT confirm exact Java types.

`classes` 是当前项目编译后的 class 目录，例如 `target/classes`。它用来帮助 JDT 确认准确的 Java 类型。

`dependency` is one dependency jar, or a directory containing dependency jars,
such as `libs` or `target/dependency`.

`dependency` 是一个依赖 jar，或者一个包含依赖 jar 的目录，例如 `libs` 或 `target/dependency`。

Only `source` is required when `project` is not passed. `classes` and
`dependency` are optional, but rules that need to know whether a call belongs to
a specific framework class need them to be accurate.

不传 `project` 时，只有 `source` 是必须的。`classes` 和 `dependency` 不是强制项，但如果规则要判断某个调用是不是属于某个框架类，就需要它们才能更准确。

By default, the project runner loads application extract rules from
`static-extract/rules/index.txt` and application trace rules from
`static-extract/traces/index.txt`.

默认情况下，runner 会加载应用 classpath 下的提取规则和 trace 规则。

For fully explicit rule sets:

如果你想完全手动指定规则来源，可以关闭 classpath 读取并传入目录或 resolver。

```java
JavaStaticExtractProjectRunner runner = JavaStaticExtractProjectRunner.builder()
    .project(Path.of("/my-project"))
    .classpathRules(false)
    .classpathTraceRules(false)
    .rulesFromDirectory(Path.of("rules"))
    .traceRulesFromDirectory(Path.of("traces"))
    .externalValueResolver(customResolver)
    .build();
```

The output is Java objects, not JSON. Each `StaticExtractResult` contains the
matched rule, line range, method hint, and the final `fields` map built by the
SER `build` block.

输出协议是 Java 对象，不是固定 JSON。每个 `StaticExtractResult` 包含命中的规则、行号范围、方法提示，以及 SER `build` 块最终生成的 `fields` 字段 Map。

## AST Runner

AST 级运行入口。

`JavaStaticExtractRunner` is the lower-level entry point when the caller already
has a JDT `CompilationUnit`.

`JavaStaticExtractRunner` 是更底层的入口，适合调用方已经自己拿到了 JDT `CompilationUnit` 的场景。

## Custom Trace Extension

There are two extension levels:

trace 有两层扩展方式。

- Implement `SerTraceRuleParser` when you want a different trace rule syntax
  that still produces `StaticTraceRuleSet`.
- Implement `JdtTraceResolver` when the JDT runtime needs custom logic for a
  stuck trace point that cannot be described by the default trace model.


- 如果只是想换 trace 规则语法，实现 `SerTraceRuleParser`，最终产出 `StaticTraceRuleSet` 即可。
- 如果 JDT 追踪卡住点需要自定义解释逻辑，实现 `JdtTraceResolver`。

```java
JdtTraceResolver resolver = new JdtTraceResolver() {
    @Override
    public List<String> resolveField(
        FieldDeclaration field,
        VariableDeclarationFragment fragment,
        TypeDeclaration type,
        JdtTraceContext context) {
        return List.of();
    }
};

JavaStaticExtractProjectRunner runner = JavaStaticExtractProjectRunner.builder()
    .project(Path.of("/my-project"))
    .addTraceResolver(resolver)
    .build();
```

More detail: [SER Rule Guide](docs/SER_RULES.md) and [Trace SER Rules](docs/TRACE_RULES.md).

更多规则写法见 [SER Rule Guide](docs/SER_RULES.md) 和 [Trace SER Rules](docs/TRACE_RULES.md)。
