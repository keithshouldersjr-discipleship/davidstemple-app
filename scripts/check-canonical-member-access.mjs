import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const sourceRoots = ["app", "components", "lib"];
const sourceExtensions = new Set([".js", ".jsx", ".ts", ".tsx"]);
const forbiddenPatterns = [
  /\.from\(["']member_profiles["']\)/g,
  /\.from\(["']member_contact_logs["']\)/g,
];
const violations = [];

async function inspectDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await inspectDirectory(path);
      continue;
    }
    if (!sourceExtensions.has(extname(entry.name))) continue;

    const contents = await readFile(path, "utf8");
    for (const pattern of forbiddenPatterns) {
      pattern.lastIndex = 0;
      for (const match of contents.matchAll(pattern)) {
        const line = contents.slice(0, match.index).split("\n").length;
        violations.push(`${relative(process.cwd(), path)}:${line} uses ${match[0]}`);
      }
    }
  }
}

for (const root of sourceRoots) {
  await inspectDirectory(join(process.cwd(), root));
}

if (violations.length) {
  console.error("Direct legacy member-table access is not allowed:\n");
  console.error(violations.map((violation) => `- ${violation}`).join("\n"));
  console.error("\nUse lib/member-directory-repository.ts instead.");
  process.exit(1);
}

console.log("Canonical member access check passed.");
