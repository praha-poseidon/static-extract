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
