package com.poseidon.javastatic.extract.assistant;

import java.util.List;

public record TryReport(
        String status,
        String projectRoot,
        List<String> files,
        List<String> ruleInputs,
        int resultCount,
        List<ExtractedRecord> results) {}
