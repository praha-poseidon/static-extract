export function parseRule(source, file) {
  const ruleName = matchRequired(source, /^rule\s+"([^"]+)"/m, "rule name", file);
  const factType = matchRequired(source, /^fact\s+([A-Za-z_][\w$-]*)/m, "fact type", file);
  const find = matchRequired(source, /^find\s+([A-Za-z_][\w$-]*)\s+([^\s]+)/m, "find", file);
  const buildSource = matchRequired(source, /build\s*\{([\s\S]*?)\}/m, "build block", file);
  return {
    name: ruleName,
    factType,
    find: { kind: find[1], name: find[2] },
    lets: parseLets(source),
    build: parseBuild(buildSource)
  };
}

function parseLets(source) {
  const lets = {};
  const letPattern = /^let\s+([A-Za-z_][\w$-]*)\s*=\s*\n([\s\S]*?)(?=^let\s+|^build\s*\{|$)/gm;
  let match;
  while ((match = letPattern.exec(source)) !== null) {
    const sources = [];
    for (const line of match[2].split(/\r?\n/)) {
      const sourceMatch = line.trim().match(/^from\s+(.+?)\s+take\s+(.+)$/);
      if (sourceMatch) {
        sources.push(parseSourceSpec(sourceMatch[1].trim(), sourceMatch[2].trim()));
      }
    }
    lets[match[1]] = sources;
  }
  return lets;
}

function parseSourceSpec(source, take) {
  const argument = source.match(/^argument\[(\d+)]$/);
  if (argument) {
    return { element: "argument", index: Number(argument[1]), take };
  }
  const prop = source.match(/^prop\s+([A-Za-z_$][\w$-]*)$/);
  if (prop) {
    return { element: "prop", name: prop[1], take };
  }
  const jsx = source.match(/^jsx\s+([A-Za-z_$][\w$.-]*)$/);
  if (jsx) {
    return { element: "jsx", name: jsx[1], take };
  }
  return { element: source, take };
}

function parseBuild(buildSource) {
  const fields = {};
  for (const line of buildSource.split(/\r?\n/)) {
    const match = line.trim().match(/^([A-Za-z_][\w$-]*)\s*:\s*(.+)$/);
    if (!match) {
      continue;
    }
    const [, name, rawValue] = match;
    const quoted = rawValue.match(/^"((?:\\"|[^"])*)"$/);
    fields[name] = quoted ? quoted[1].replace(/\\"/g, "\"") : { ref: rawValue.trim() };
  }
  return fields;
}

function matchRequired(source, regex, label, file) {
  const match = source.match(regex);
  if (!match) {
    throw new Error(`Failed to parse ${label} in SER rule: ${file}`);
  }
  return match.length === 2 ? match[1] : match;
}
