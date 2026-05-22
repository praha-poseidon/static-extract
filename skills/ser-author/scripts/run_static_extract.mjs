#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateSer } from "./generate_ser.mjs";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

async function main(argv) {
  const options = parseArgs(argv);
  if (!options.project || !options.mode || !options.outDir) {
    throw new Error("Usage: run_static_extract.mjs --project <dir> --mode <generate|extract|generate-and-extract> --request <file> --out-dir <dir>");
  }

  const project = resolve(options.project);
  const outDir = resolve(options.outDir);
  await mkdir(outDir, { recursive: true });

  const runtime = options.runtime ?? await detectRuntime(project);
  const generatedRule = options.rule ? resolve(options.rule) : join(outDir, "generated.ser");
  const factsFile = options.out ?? join(outDir, "facts.jsonl");

  if (options.mode === "generate" || options.mode === "generate-and-extract") {
    if (!options.request) {
      throw new Error("--request is required when mode generates SER.");
    }
    const request = readFileSync(resolve(options.request), "utf8");
    await writeFile(generatedRule, generateSer(runtime, request), "utf8");
  }

  let extractReport = null;
  if (options.mode === "extract" || options.mode === "generate-and-extract") {
    const rule = options.rule ? resolve(options.rule) : generatedRule;
    extractReport = runExtract(runtime, project, rule, factsFile);
  }

  const result = {
    runtime,
    mode: options.mode,
    serFile: generatedRule,
    factsFile: extractReport ? factsFile : null,
    extractReport
  };
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

async function detectRuntime(project) {
  const files = await scanFiles(project, [".tsx", ".jsx", ".ts", ".js", ".java"]);
  if (files.some((file) => [".tsx", ".jsx"].includes(extname(file)))) {
    return "react";
  }
  if (files.some((file) => extname(file) === ".java")) {
    return "java-jdt";
  }
  throw new Error("Unable to detect runtime from project files.");
}

function runExtract(runtime, project, rule, factsFile) {
  if (runtime === "react") {
    const stdout = execFileSync("node", [
      resolve(repo, "static-extract-runtime-ts/bin/static-extract-ts.mjs"),
      "run",
      "--project", project,
      "--source", project,
      "--rule", rule,
      "--out", factsFile
    ], { encoding: "utf8" });
    return JSON.parse(stdout);
  }
  if (runtime === "java-jdt") {
    throw new Error("java-jdt orchestration is not implemented in this skill helper yet.");
  }
  throw new Error(`Unsupported runtime: ${runtime}`);
}

async function scanFiles(root, extensions) {
  if (!existsSync(root)) {
    return [];
  }
  if (!statSync(root).isDirectory()) {
    return extensions.includes(extname(root)) ? [root] : [];
  }
  const files = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "target" || entry.name === ".git") {
      continue;
    }
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...await scanFiles(path, extensions));
    } else if (entry.isFile() && extensions.includes(extname(entry.name))) {
      files.push(path);
    }
  }
  return files;
}

function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "--project":
        options.project = requireValue(argv, ++i, arg);
        break;
      case "--mode":
        options.mode = requireValue(argv, ++i, arg);
        break;
      case "--request":
        options.request = requireValue(argv, ++i, arg);
        break;
      case "--rule":
        options.rule = requireValue(argv, ++i, arg);
        break;
      case "--runtime":
        options.runtime = requireValue(argv, ++i, arg);
        break;
      case "--out":
        options.out = requireValue(argv, ++i, arg);
        break;
      case "--out-dir":
        options.outDir = requireValue(argv, ++i, arg);
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }
  return options;
}

function requireValue(argv, index, option) {
  const value = argv[index];
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${option}`);
  }
  return value;
}

main(process.argv.slice(2)).catch((error) => {
  process.stderr.write(JSON.stringify({
    status: "ERROR",
    message: error.message
  }) + "\n");
  process.exitCode = 1;
});

