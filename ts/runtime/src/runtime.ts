import type { RuntimeRunRequest, RuntimeRunResult } from "./contracts";

export async function init(_request: { project: string }): Promise<Record<string, unknown>> {
  throw new Error("static-extract-ts runtime init is implemented in runtime.mjs.");
}

export async function tryRules(_request: RuntimeRunRequest): Promise<Record<string, unknown>> {
  throw new Error("static-extract-ts runtime try is implemented in runtime.mjs.");
}

export async function diagnose(_request: RuntimeRunRequest): Promise<Record<string, unknown>> {
  throw new Error("static-extract-ts runtime diagnose is implemented in runtime.mjs.");
}

export async function run(_request: RuntimeRunRequest): Promise<RuntimeRunResult> {
  throw new Error("static-extract-ts runtime extraction is implemented in runtime.mjs.");
}
