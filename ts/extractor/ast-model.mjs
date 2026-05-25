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
  const project = new Project({
    ...(tsConfigFilePath ? { tsConfigFilePath } : {}),
    compilerOptions: {
      allowJs: true,
      jsx: 4,
      target: ScriptTarget.Latest
    },
    skipAddingFilesFromTsConfig: true
  });
  const models = new Map();
  for (const filePath of filePaths) {
    const absolutePath = resolve(filePath);
    const sourceFile = project.addSourceFileAtPathIfExists(absolutePath);
    if (!sourceFile) {
      continue;
    }
    models.set(absolutePath, {
      project,
      sourceFile,
      sourceText: sourceFile.getFullText()
    });
  }
  return { project, root, models };
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
