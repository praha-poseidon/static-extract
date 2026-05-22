#!/usr/bin/env node

import { run } from "../src/runtime.mjs";

const USAGE = `Usage: static-extract-ts <command> [options]

Commands:
  run       Run SER rules against TypeScript-family source.
  --help    Show this help.

Run options:
  --project <dir>      Project root.
  --source <path>      Source file or directory. Can be repeated.
  --rule <file>        SER rule file. Can be repeated.
  --rules <dir>        Directory containing .ser rule files. Can be repeated.
  --builtin            Load rules owned by this TypeScript runtime.
  --out <file>         Optional JSONL output file.
`;

async function main(argv) {
  const command = argv[0];
  if (!command || command === "--help" || command === "-h") {
    process.stdout.write(USAGE);
    return 0;
  }
  if (command !== "run") {
    writeError(`Unknown command: ${command}`);
    return 1;
  }
  try {
    const report = await run(parseRunOptions(argv.slice(1)));
    process.stdout.write(JSON.stringify({
      resultCount: report.resultCount,
      outputFile: report.outputFile
    }, null, 2) + "\n");
    return 0;
  } catch (error) {
    writeError(error.message ?? String(error));
    return 1;
  }
}

function parseRunOptions(argv) {
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
        options.sources.push(requireValue(argv, ++i, arg));
        break;
      case "--rule":
        options.ruleFiles.push(requireValue(argv, ++i, arg));
        break;
      case "--rules":
        options.ruleDirectories.push(requireValue(argv, ++i, arg));
        break;
      case "--builtin":
        options.builtinRules = true;
        break;
      case "--out":
        options.outputFile = requireValue(argv, ++i, arg);
        break;
      default:
        throw new Error(`Unknown run option: ${arg}`);
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
  process.stderr.write(JSON.stringify({
    status: "ERROR",
    message
  }) + "\n");
}

process.exitCode = await main(process.argv.slice(2));
