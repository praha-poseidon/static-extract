package com.poseidon.javastatic.extract.jdt.load;

import com.poseidon.javastatic.extract.rule.StaticExtractRule;
import com.poseidon.javastatic.extract.trace.StaticTraceRuleSet;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.net.URLClassLoader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
class SerRuleLoaderTest {

    @Test
    void loadAllReturnsNoRulesWhenApplicationClasspathHasNoIndex() {
        List<StaticExtractRule> rules = new SerRuleLoader().loadAll();

        assertEquals(0, rules.size());
    }

    @Test
    void loadsApplicationRulesFromFixedResourceDirectory(@TempDir Path tempDir) throws Exception {
        write(
                tempDir.resolve("static-extract/rules/index.txt"),
                """
                custom/http.ser
                """);
        write(tempDir.resolve("static-extract/rules/custom/http.ser"), minimalRule("Custom HTTP Rule"));

        try (URLClassLoader classLoader =
                new URLClassLoader(new java.net.URL[] {tempDir.toUri().toURL()}, getClass().getClassLoader())) {
            List<StaticExtractRule> rules = new SerRuleLoader(classLoader, new com.poseidon.javastatic.extract.language.AntlrSerRuleParser())
                    .loadApplicationRules();

            assertEquals(1, rules.size());
            assertEquals("Custom HTTP Rule", rules.get(0).name());
        }
    }

    @Test
    void loadsTraceRulesFromFixedResourceDirectory(@TempDir Path tempDir) throws Exception {
        write(
                tempDir.resolve("static-extract/traces/index.txt"),
                """
                spring-config.ser
                """);
        write(
                tempDir.resolve("static-extract/traces/spring-config.ser"),
                """
                trace "Spring Config Trace"

                from field
when annotation @Value on field

let rawValue =
  from annotation on field @Value take attr(value)

build {
  namespace: "config"
  lookup: rawValue | normalize placeholderLookup
  default: rawValue | normalize placeholderDefault
}
                """);

        try (URLClassLoader classLoader =
                new URLClassLoader(new java.net.URL[] {tempDir.toUri().toURL()}, getClass().getClassLoader())) {
            List<StaticTraceRuleSet> rules = new SerRuleLoader(classLoader, new com.poseidon.javastatic.extract.language.AntlrSerRuleParser())
                    .loadApplicationTraceRules();

            assertEquals(1, rules.size());
            assertEquals("Spring Config Trace", rules.get(0).name());
        }
    }

    @Test
    void scansRuleDirectoryWhenRulesAreProvidedAsFiles(@TempDir Path tempDir) throws Exception {
        write(tempDir.resolve("a.ser"), minimalRule("A Rule"));
        write(tempDir.resolve("nested/b.ser"), minimalRule("B Rule"));
        write(tempDir.resolve("ignore.txt"), "not a rule");

        List<StaticExtractRule> rules = new SerRuleLoader().loadRulesFromDirectory(tempDir);

        assertEquals(List.of("A Rule", "B Rule"), rules.stream().map(StaticExtractRule::name).toList());
    }

    @Test
    void loadsExplicitFilesAndHandlesEmptyInputs(@TempDir Path tempDir) throws Exception {
        Path ruleFile = tempDir.resolve("rule.ser");
        Path traceFile = tempDir.resolve("trace.ser");
        write(ruleFile, minimalRule("File Rule"));
        write(
                traceFile,
                """
                trace "File Trace"
                """);
        SerRuleLoader loader = new SerRuleLoader();

        assertEquals(List.of(), loader.loadRulesFromFiles(null));
        assertEquals(List.of(), loader.loadTraceRulesFromFiles(List.of()));
        assertEquals(List.of(), loader.loadRulesFromDirectory(tempDir.resolve("missing")));
        assertEquals("File Rule", loader.loadRulesFromFiles(List.of(ruleFile)).get(0).name());
        assertEquals("File Trace", loader.loadTraceRulesFromFiles(List.of(traceFile)).get(0).name());
    }

    @Test
    void loadsRuleAndTraceBlocksFromSameSerFile(@TempDir Path tempDir) throws Exception {
        Path file = tempDir.resolve("combined.ser");
        write(
                file,
                minimalRule("Combined Rule")
                        + "\n"
                        + """
                        trace "Combined Trace"

                        from field
                        when annotation @Value on field

                        let rawValue =
                          from annotation on field @Value take attr(value)

                        build {
                          namespace: "config"
                          lookup: rawValue | normalize placeholderLookup
                        }
                        """);

        SerRuleLoader loader = new SerRuleLoader();

        assertEquals("Combined Rule", loader.loadRulesFromFiles(List.of(file)).get(0).name());
        assertEquals("Combined Trace", loader.loadTraceRulesFromFiles(List.of(file)).get(0).name());
        assertEquals("Combined Rule", loader.loadRulesFromDirectory(tempDir).get(0).name());
        assertEquals("Combined Trace", loader.loadTraceRulesFromDirectory(tempDir).get(0).name());
    }

    @Test
    void rejectsInvalidDirectoriesAndMissingIndexedResources(@TempDir Path tempDir) throws Exception {
        Path notDirectory = tempDir.resolve("rules.ser");
        Files.writeString(notDirectory, minimalRule("Not Directory"));
        assertThrows(IllegalArgumentException.class, () -> new SerRuleLoader().loadRulesFromDirectory(notDirectory));

        write(tempDir.resolve("static-extract/rules/index.txt"), "missing.ser");
        try (URLClassLoader classLoader =
                new URLClassLoader(new java.net.URL[] {tempDir.toUri().toURL()}, getClass().getClassLoader())) {
            SerRuleLoader loader = new SerRuleLoader(classLoader, new com.poseidon.javastatic.extract.language.AntlrSerRuleParser());
            assertThrows(IllegalStateException.class, loader::loadApplicationRules);
        }
    }

    private String minimalRule(String name) {
        return """
                rule "%s"
                endpoint CUSTOM inbound
                find class

                build {
                  kind: "CUSTOM"
                }
                """
                .formatted(name);
    }

    private void write(Path file, String content) throws Exception {
        Files.createDirectories(file.getParent());
        Files.writeString(file, content);
    }
}
