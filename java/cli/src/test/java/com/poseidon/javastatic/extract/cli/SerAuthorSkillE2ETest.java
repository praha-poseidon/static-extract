package com.poseidon.javastatic.extract.cli;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SerAuthorSkillE2ETest {

    @TempDir
    Path tempDir;

    @Test
    void serAuthorHelperGeneratesAndRunsJavaAnnotationRule() throws Exception {
        Path repo = SpecAssertions.findProjectRoot();
        Path sourceExample = repo.resolve("spec/examples/java/annotation-fact");
        Path example = tempDir.resolve("annotation-fact-project");
        copyDirectory(sourceExample, example);
        Path request = repo.resolve("ts/runtime/test/fixtures/ser-author-java-annotation/request.txt");
        Path outDir = tempDir.resolve("java-annotation");

        ProcessResult result = runNode(repo,
                "skills/ser-author/scripts/run_static_extract.mjs",
                "--project", example.toString(),
                "--runtime", "java-jdt",
                "--mode", "generate-and-extract",
                "--request", request.toString(),
                "--out-dir", outDir.toString());

        assertEquals(0, result.exitCode(), result.stderr());
        JsonNode report = SpecAssertions.OBJECT_MAPPER.readTree(result.stdout());
        assertEquals("java-jdt", report.get("runtime").asText());
        assertEquals(1, report.at("/extractReport/resultCount").asInt());
        assertEquals("OK", report.at("/extractReport/tryReport/status").asText());

        assertTrue(Files.exists(outDir.resolve("generated.ser")));
        assertTrue(Files.exists(outDir.resolve("facts.jsonl")));
        assertTrue(Files.exists(outDir.resolve("report.json")));
        assertJsonLinesEqual(example.resolve("expected.jsonl"), outDir.resolve("facts.jsonl"), example);
    }

    private ProcessResult runNode(Path repo, String script, String... args) throws Exception {
        ProcessBuilder builder = new ProcessBuilder(command(repo, script, args));
        builder.directory(repo.toFile());
        Map<String, String> environment = builder.environment();
        environment.put("STATIC_EXTRACT_JAVA_CLASSPATH", System.getProperty("java.class.path"));
        Process process = builder.start();
        String stdout = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        String stderr = new String(process.getErrorStream().readAllBytes(), StandardCharsets.UTF_8);
        return new ProcessResult(process.waitFor(), stdout, stderr);
    }

    private List<String> command(Path repo, String script, String... args) {
        List<String> command = new java.util.ArrayList<>();
        command.add("node");
        command.add(repo.resolve(script).toString());
        command.addAll(List.of(args));
        return command;
    }

    private void assertJsonLinesEqual(Path expectedFile, Path actualFile, Path example) throws Exception {
        List<String> expectedLines = Files.readAllLines(expectedFile);
        List<String> actualLines = Files.readAllLines(actualFile);

        assertEquals(expectedLines.size(), actualLines.size(), "Line count mismatch for " + example.getFileName());
        for (int i = 0; i < expectedLines.size(); i++) {
            String expectedLine = expectedLines.get(i).replace(
                    "${EXAMPLE_DIR}",
                    example.toAbsolutePath().normalize().toString().replace("\\", "\\\\"));
            JsonNode expected = SpecAssertions.OBJECT_MAPPER.readTree(expectedLine);
            JsonNode actual = SpecAssertions.OBJECT_MAPPER.readTree(actualLines.get(i));
            assertEquals(expected, actual, "JSONL mismatch for " + example.getFileName() + " line " + (i + 1));
        }
    }

    private void copyDirectory(Path source, Path target) throws Exception {
        try (var stream = Files.walk(source)) {
            for (Path path : stream.toList()) {
                Path relative = source.relativize(path);
                Path destination = target.resolve(relative);
                if (Files.isDirectory(path)) {
                    Files.createDirectories(destination);
                } else {
                    Files.createDirectories(destination.getParent());
                    Files.copy(path, destination, StandardCopyOption.REPLACE_EXISTING);
                }
            }
        }
    }

    private record ProcessResult(int exitCode, String stdout, String stderr) {}
}
