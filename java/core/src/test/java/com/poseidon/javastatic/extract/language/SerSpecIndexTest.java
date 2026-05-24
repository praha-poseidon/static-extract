package com.poseidon.javastatic.extract.language;

import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertTrue;

class SerSpecIndexTest {

    @Test
    void specReadmeIndexesSerSpecAndMachineContracts() throws Exception {
        Path root = projectRoot();
        String readme = Files.readString(root.resolve("spec/README.md"));

        assertTrue(readme.contains("ser/Ser.g4"));
        assertTrue(readme.contains("ser/SER_SPEC.md"));
        assertTrue(readme.contains("schema/extracted-fact.schema.json"));
        assertTrue(readme.contains("cli/runtime-cli.md"));
    }

    private Path projectRoot() {
        Path current = Path.of(System.getProperty("user.dir")).toAbsolutePath().normalize();
        while (current != null) {
            if (Files.isRegularFile(current.resolve("spec/README.md"))) {
                return current;
            }
            current = current.getParent();
        }
        throw new IllegalStateException("Project root with spec/README.md was not found.");
    }
}
