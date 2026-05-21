package com.poseidon.javastatic.extract.language;

import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertEquals;

class SerGrammarSpecTest {

    @Test
    void javaGrammarMirrorsSpecGrammar() throws Exception {
        Path root = projectRoot();
        Path specGrammar = root.resolve("spec/ser/Ser.g4");
        Path javaGrammar = root.resolve(
                "static-extract-core-java/src/main/antlr4/com/poseidon/javastatic/extract/language/antlr/Ser.g4");

        assertEquals(
                Files.readString(specGrammar),
                Files.readString(javaGrammar),
                "Java parser grammar must mirror spec/ser/Ser.g4");
    }

    private Path projectRoot() {
        Path current = Path.of(System.getProperty("user.dir")).toAbsolutePath().normalize();
        while (current != null) {
            if (Files.isRegularFile(current.resolve("spec/ser/Ser.g4"))) {
                return current;
            }
            current = current.getParent();
        }
        throw new IllegalStateException("Project root with spec/ser/Ser.g4 was not found.");
    }
}
