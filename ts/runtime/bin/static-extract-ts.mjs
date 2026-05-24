#!/usr/bin/env node

import { diagnose, init, run, tryRules } from "../src/runtime.mjs";

const USAGE = `Usage: static-extract-ts <command> [options]

Commands:
  init      Create the local .ser workspace directories.
  try       Run SER rules against selected TypeScript-family files.
  diagnose  Run rules and return source facts when no result is emitted.
  run       Run SER rules against TypeScript-family source.
  --help    Show this help.

Shared extraction options:
  --project <dir>      Project root.
  --source <path>      Source file or directory. Can be repeated.
  --file <path>        Source file. Alias for --source; can be repeated.
  --rule <file>        SER rule file. Can be repeated.
  --rule-dir <dir>     Directory containing .ser rule files. Can be repeated.
  --rules <dir>        Alias for --rule-dir.
  --builtin            Load rules owned by this TypeScript runtime.

Run options:
  --out <file>         Optional JSONL output file.
`;

async function main(argv) {
  const command = argv[0];
  if (!command || command === "--help" || command === "-h") {
    process.stdout.write(USAGE);
    return 0;
  }
  try {
    if (command === "init") {
      return await printReport(init(parseInitOptions(argv.slice(1))));
    }
    if (command === "try") {
      return await printReport(tryRules(parseExtractionOptions(argv.slice(1))));
    }
    if (command === "diagnose") {
      return await printReport(diagnose(parseExtractionOptions(argv.slice(1))));
    }
    if (command === "run") {
      return await printReport(run(parseExtractionOptions(argv.slice(1), true)));
    }
  } catch (error) {
    writeError(error.message ?? String(error));
    return 1;
  }
  writeError(`Unknown command: ${command}`);
  return 1;
}

async function printReport(promise) {
  try {
    const report = await promise;
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
    return 0;
  } catch (error) {
    writeError(error.message ?? String(error));
    return 1;
  }
}

function parseInitOptions(argv) {
  const options = { project: undefined };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--project") {
      options.project = requireValue(argv, ++i, arg);
    } else {
      throw new Error(`Unknown init option: ${arg}`);
    }
  }
  if (!options.project) {
    throw new Error("Missing required option: --project");
  }
  return options;
}

function parseExtractionOptions(argv, allowOutput = false) {
  const options = {
    project: undefined,
    sources: [],
    ruleFiles: [],
    ruleDirectories: [],
    builtinRules: false,
    outputFile: undefined
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "--project":
        options.project = requireValue(argv, ++i, arg);
        break;
      case "--source":
      case "--file":
        options.sources.push(requireValue(argv, ++i, arg));
        break;
      case "--rule":
        options.ruleFiles.push(requireValue(argv, ++i, arg));
        break;
      case "--rules":
      case "--rule-dir":
        options.ruleDirectories.push(requireValue(argv, ++i, arg));
        break;
      case "--builtin":
        options.builtinRules = true;
        break;
      case "--out":
        if (!allowOutput) {
          throw new Error(`Unknown extraction option: ${arg}`);
        }
        options.outputFile = requireValue(argv, ++i, arg);
        break;
      default:
        throw new Error(`Unknown extraction option: ${arg}`);
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

function writeError(message) {
  process.stderr.write(JSON.stringify({ status: "ERROR", message }) + "\n");
}

process.exitCode = await main(process.argv.slice(2));
