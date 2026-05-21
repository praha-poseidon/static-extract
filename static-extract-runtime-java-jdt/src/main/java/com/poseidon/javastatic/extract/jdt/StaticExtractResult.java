package com.poseidon.javastatic.extract.jdt;

import com.poseidon.javastatic.extract.rule.StaticExtractRule;
import org.eclipse.jdt.core.dom.ASTNode;

import java.util.Map;

public record StaticExtractResult(
        StaticExtractRule rule,
        Map<String, String> fields,
        int startLine,
        int endLine,
        String projectFilePath,
        String absoluteFilePath,
        String enclosingMethodSignatureHint,
        ASTNode anchorNode) {}
