package com.poseidon.javastatic.extract.cli;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import picocli.CommandLine;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

class JavaStaticExtractCliTest {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @TempDir
    Path tempDir;

    @Test
    void initCommandPrintsJson() throws Exception {
        CliOutput output = execute("init", "--project", tempDir.toString());

        assertEquals(0, output.exitCode());
        assertTrue(output.stdout().contains("\"generatedRulesDir\""));
        assertTrue(Files.isDirectory(tempDir.resolve(".ser/generated")));
    }

    @Test
    void tryCommandRunsRuleAndPrintsResultJson() throws Exception {
        Fixture fixture = fixture();

        CliOutput output = execute(
                "try",
                "--project", fixture.project().toString(),
                "--file", fixture.javaFile().toString(),
                "--rule", fixture.ruleFile().toString());

        assertEquals(0, output.exitCode());
        assertTrue(output.stdout().contains("\"resultCount\" : 1"));
        assertTrue(output.stdout().contains("/api/users"));
    }

    @Test
    void diagnoseCommandPrintsFactsWhenRuleDoesNotMatch() throws Exception {
        Fixture fixture = fixture();
        Path missingRule = tempDir.resolve("missing.ser");
        Files.writeString(missingRule, """
                rule "Missing"
                endpoint HTTP inbound

                find method with annotation @Missing

                let path =
                  from annotation on method @Missing take attr(value)

                build {
                  path: path
                }
                """);

        CliOutput output = execute(
                "diagnose",
                "--project", fixture.project().toString(),
                "--file", fixture.javaFile().toString(),
                "--rule", missingRule.toString());

        assertEquals(0, output.exitCode());
        assertTrue(output.stdout().contains("\"status\" : \"NO_MATCH\""));
        assertTrue(output.stdout().contains("RouteGet"));
    }

    @Test
    void runCommandWritesJsonLinesAndReadsExternalValues() throws Exception {
        Fixture fixture = fixture();
        Path externalValues = tempDir.resolve("external-values.json");
        Files.writeString(externalValues, """
                {
                  "config": {
                    "unused": ["value"]
                  }
                }
                """);
        Path outputFile = tempDir.resolve("out/results.jsonl");

        CliOutput output = execute(
                "run",
                "--project", fixture.project().toString(),
                "--rule", fixture.ruleFile().toString(),
                "--external-values", externalValues.toString(),
                "--out", outputFile.toString());

        assertEquals(0, output.exitCode());
        assertTrue(output.stdout().contains("\"resultCount\" : 1"));
        assertEquals(1, Files.readAllLines(outputFile).size());
        assertJsonLinesMatchExtractedFactSpec(outputFile);
    }

    @Test
    void commandPrintsStructuredError() throws Exception {
        Fixture fixture = fixture();

        CliOutput output = execute(
                "try",
                "--project", fixture.project().toString(),
                "--file", fixture.javaFile().toString());

        assertEquals(1, output.exitCode());
        assertTrue(output.stderr().contains("\"status\":\"ERROR\""));
        assertTrue(output.stderr().contains("Pass at least one SER rule"));
    }

    @Test
    void rootCommandPrintsUsage() throws Exception {
        CliOutput output = execute();

        assertEquals(0, output.exitCode());
        assertTrue(output.stdout().contains("Usage: static-extract-java"));
    }

    private CliOutput execute(String... args) throws Exception {
        PrintStream originalOut = System.out;
        PrintStream originalErr = System.err;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ByteArrayOutputStream err = new ByteArrayOutputStream();
        try {
            System.setOut(new PrintStream(out, true, StandardCharsets.UTF_8));
            System.setErr(new PrintStream(err, true, StandardCharsets.UTF_8));
            int exitCode = new CommandLine(new JavaStaticExtractCli()).execute(args);
            return new CliOutput(
                    exitCode,
                    out.toString(StandardCharsets.UTF_8),
                    err.toString(StandardCharsets.UTF_8));
        } finally {
            System.setOut(originalOut);
            System.setErr(originalErr);
        }
    }

    private record CliOutput(int exitCode, String stdout, String stderr) {}

    private static void assertJsonLinesMatchExtractedFactSpec(Path outputFile) throws Exception {
        JsonNode schema = OBJECT_MAPPER.readTree(Files.readString(findSpecSchema("extracted-fact.schema.json")));
        Set<String> required = OBJECT_MAPPER.convertValue(
                schema.get("required"),
                OBJECT_MAPPER.getTypeFactory().constructCollectionType(Set.class, String.class));
        Map<String, JsonNode> properties = OBJECT_MAPPER.convertValue(
                schema.get("properties"),
                OBJECT_MAPPER.getTypeFactory().constructMapType(Map.class, String.class, JsonNode.class));

        for (String line : Files.readAllLines(outputFile)) {
            JsonNode record = OBJECT_MAPPER.readTree(line);
            assertEquals("object", record.isObject() ? "object" : record.getNodeType().name().toLowerCase());
            for (String name : required) {
                assertTrue(record.has(name), "Missing required spec field: " + name);
            }
            Iterator<String> fieldNames = record.fieldNames();
            while (fieldNames.hasNext()) {
                String name = fieldNames.next();
                assertTrue(properties.containsKey(name), "Unexpected field not declared by spec: " + name);
                assertMatchesSpecType(name, record.get(name), properties.get(name).get("type"));
            }
        }
    }

    private static void assertMatchesSpecType(String name, JsonNode value, JsonNode typeSpec) {
        assertNotNull(typeSpec, "Missing schema type for field: " + name);
        if (typeSpec.isTextual()) {
            assertMatchesType(name, value, typeSpec.asText());
            return;
        }
        if (typeSpec.isArray()) {
            for (JsonNode allowedType : typeSpec) {
                if (matchesType(value, allowedType.asText())) {
                    return;
                }
            }
            fail("Field does not match any allowed spec type: " + name);
        }
    }

    private static void assertMatchesType(String name, JsonNode value, String type) {
        assertTrue(matchesType(value, type), "Field does not match spec type " + type + ": " + name);
    }

    private static boolean matchesType(JsonNode value, String type) {
        return switch (type) {
            case "string" -> value.isTextual();
            case "integer" -> value.isIntegralNumber();
            case "object" -> value.isObject();
            case "null" -> value.isNull();
            default -> false;
        };
    }

    private static Path findSpecSchema(String name) {
        Path current = Path.of(System.getProperty("user.dir")).toAbsolutePath().normalize();
        while (current != null) {
            Path candidate = current.resolve("spec/schema").resolve(name);
            if (Files.isRegularFile(candidate)) {
                return candidate;
            }
            current = current.getParent();
        }
        throw new IllegalStateException("Spec schema not found: " + name);
    }

    private Fixture fixture() throws Exception {
        Path project = tempDir.resolve("project-" + System.nanoTime());
        Path sourceDir = project.resolve("src/main/java/demo");
        Files.createDirectories(sourceDir);
        Path javaFile = sourceDir.resolve("Api.java");
        Files.writeString(javaFile, """
                package demo;

                @interface RouteGet {
                    String value();
                }

                class Api {
                    @RouteGet("/api/users")
                    String getUser() {
                        return "ok";
                    }
                }
                """);
        Path ruleFile = tempDir.resolve("route-" + System.nanoTime() + ".ser");
        Files.writeString(ruleFile, """
                rule "Custom HTTP Inbound"
                endpoint HTTP inbound

                find method with annotation @RouteGet

                let path =
                  from annotation on method @RouteGet take attr(value)

                build {
                  path: path
                }
                """);
        return new Fixture(project, javaFile, ruleFile);
    }

    private record Fixture(Path project, Path javaFile, Path ruleFile) {}
}
