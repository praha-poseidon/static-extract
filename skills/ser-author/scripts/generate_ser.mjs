#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

export const REACT_BUTTON_SER = `rule "React Button Text"
fact ui_text

find jsx button

let label =
  from jsx button take text

build {
  component: "react"
  kind: "button"
  text: label
}
`;

async function main(argv) {
  const options = parseArgs(argv);
  if (!options.runtime || !options.request || !options.out) {
    throw new Error("Usage: generate_ser.mjs --runtime <runtime> --request <file> --out <file>");
  }
  const request = await readFile(options.request, "utf8");
  const ser = generateSer(options.runtime, request);
  await mkdir(dirname(resolve(options.out)), { recursive: true });
  await writeFile(options.out, ser, "utf8");
}

export function generateSer(runtime, request) {
  const normalized = request.toLowerCase();
  if (runtime === "react" && hasAny(normalized, ["button", "按钮"]) && hasAny(normalized, ["text", "文案", "中文"])) {
    return REACT_BUTTON_SER;
  }
  throw new Error(`Unsupported SER authoring request for runtime ${runtime}: ${request.trim()}`);
}

function hasAny(value, words) {
  return words.some((word) => value.includes(word.toLowerCase()));
}

function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "--runtime":
        options.runtime = requireValue(argv, ++i, arg);
        break;
      case "--request":
        options.request = requireValue(argv, ++i, arg);
        break;
      case "--out":
        options.out = requireValue(argv, ++i, arg);
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

if (import.meta.url === `file://${process.argv[1]}`) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(JSON.stringify({
      status: "ERROR",
      message: error.message
    }) + "\n");
    process.exitCode = 1;
  });
}
