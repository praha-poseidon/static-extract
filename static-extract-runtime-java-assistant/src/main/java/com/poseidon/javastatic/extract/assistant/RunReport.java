package com.poseidon.javastatic.extract.assistant;

import java.util.List;

public record RunReport(
        String status,
        String projectRoot,
        List<String> ruleInputs,
        int resultCount,
        List<ExtractedRecord> results,
        String outputFile) {}
