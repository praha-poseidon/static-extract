package com.poseidon.javastatic.extract.assistant;

import java.util.Map;

public record ExtractedRecord(
        String rule,
        String factType,
        Map<String, String> classifiers,
        Map<String, String> fields,
        String projectFilePath,
        String absoluteFilePath,
        int startLine,
        int endLine,
        String enclosingMethod) {}
