import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { Project, ScriptKind, ScriptTarget } from "ts-morph";

export function createAstModel(filePath, sourceText) {
  const project = new Project({
    compilerOptions: {
      allowJs: true,
      jsx: 4,
      target: ScriptTarget.Latest
    },
    skipAddingFilesFromTsConfig: true
  });
  const sourceFile = project.createSourceFile(filePath, sourceText, {
    overwrite: true,
    scriptKind: scriptKind(filePath)
  });
  return { project, sourceFile, sourceText };
}

export function createAstProject(projectRoot, filePaths) {
  const root = projectRoot ? resolve(projectRoot) : commonRoot(filePaths);
  const tsConfigFilePath = findTsConfig(root);
  return {
    root,
    models: new LazyAstModelStore(root, tsConfigFilePath, filePaths)
  };
}

class LazyAstModelStore {
  constructor(projectRoot, tsConfigFilePath, filePaths, maxEntries = Number(process.env.STATIC_EXTRACT_TS_AST_CACHE_SIZE ?? 12)) {
    this.projectRoot = projectRoot;
    this.tsConfigFilePath = tsConfigFilePath;
    this.filePaths = new Set(filePaths.map((filePath) => resolve(filePath)));
    this.maxEntries = Number.isFinite(maxEntries) && maxEntries > 0 ? maxEntries : 12;
    this.cache = new Map();
  }

  has(filePath) {
    return this.filePaths.has(resolve(filePath));
  }

  get(filePath) {
    const absolutePath = resolve(filePath);
    if (!this.filePaths.has(absolutePath)) {
      return undefined;
    }
    const cached = this.cache.get(absolutePath);
    if (cached) {
      this.cache.delete(absolutePath);
      this.cache.set(absolutePath, cached);
      return cached.model;
    }
    const project = this.createProject();
    const sourceFile = project.addSourceFileAtPathIfExists(absolutePath);
    if (!sourceFile) {
      return undefined;
    }
    const entry = {
      project,
      sourceFile,
      model: {
        project,
        sourceFile,
        sourceText: sourceFile.getFullText(),
        projectRoot: this.projectRoot
      }
    };
    this.cache.set(absolutePath, entry);
    this.evict();
    return entry.model;
  }

  clear() {
    for (const entry of this.cache.values()) {
      disposeEntry(entry);
    }
    this.cache.clear();
  }

  createProject() {
    return new Project({
      ...(this.tsConfigFilePath ? { tsConfigFilePath: this.tsConfigFilePath } : {}),
      compilerOptions: {
        allowJs: true,
        jsx: 4,
        target: ScriptTarget.Latest
      },
      skipAddingFilesFromTsConfig: true
    });
  }

  evict() {
    while (this.cache.size > this.maxEntries) {
      const oldestKey = this.cache.keys().next().value;
      const oldest = this.cache.get(oldestKey);
      this.cache.delete(oldestKey);
      disposeEntry(oldest);
    }
  }
}

function disposeEntry(entry) {
  try {
    entry?.sourceFile?.forget?.();
  } catch {
    // Best-effort release of ts-morph nodes.
  }
}

function scriptKind(filePath) {
  if (filePath.endsWith(".tsx")) {
    return ScriptKind.TSX;
  }
  if (filePath.endsWith(".jsx")) {
    return ScriptKind.JSX;
  }
  if (filePath.endsWith(".js")) {
    return ScriptKind.JS;
  }
  return ScriptKind.TS;
}

function findTsConfig(projectRoot) {
  if (!projectRoot) {
    return null;
  }
  const candidate = join(projectRoot, "tsconfig.json");
  return existsSync(candidate) ? candidate : null;
}

function commonRoot(filePaths) {
  if (!filePaths.length) {
    return process.cwd();
  }
  let root = dirname(resolve(filePaths[0]));
  for (const filePath of filePaths.slice(1)) {
    const absolute = resolve(filePath);
    while (!absolute.startsWith(root)) {
      const parent = dirname(root);
      if (parent === root) {
        return root;
      }
      root = parent;
    }
  }
  return root;
}
