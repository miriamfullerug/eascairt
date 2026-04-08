const fs = require("node:fs");
const path = require("node:path");

function getArg(name) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return null;
  const val = process.argv[idx + 1];
  if (!val || val.startsWith("--")) return "";
  return val;
}

function usage() {
  console.log(`
Usage:
  npm run new:issue -- --issue <issueSlug> --title "<title>" --date YYYY-MM-DD [--cover "/assets/img/covers/<file>"] [--description "<optional>"]

Example:
  npm run new:issue -- --issue 2026-mean-fomhair --title "Eagrán 1 - Meán Fómhair 2026" --date 2026-09-01

Notes:
  - If you omit --cover, coverImage defaults to "/assets/img/covers/cover.jpg"
`);
}

const issueSlug = getArg("issue");
const title = getArg("title");
const date = getArg("date");
const cover = getArg("cover") || "/assets/img/covers/cover.jpg";
const description = getArg("description") || "";

if (!issueSlug || !title || !date) {
  usage();
  process.exit(1);
}

const repoRoot = process.cwd();
const issueDir = path.join(repoRoot, "src", "issues", issueSlug);
const indexPath = path.join(issueDir, "index.md");
const articlesDir = path.join(issueDir, "articles");

if (fs.existsSync(indexPath)) {
  console.error(`Issue index already exists: ${indexPath}`);
  process.exit(1);
}

fs.mkdirSync(issueDir, { recursive: true });
fs.mkdirSync(articlesDir, { recursive: true });

const fmLines = [
  "---",
  "layout: layouts/issue.njk",
  `title: "${title.replaceAll('"', '\\"')}"`,
  `issueSlug: "${issueSlug}"`,
  `date: ${date}`
];

if (cover) fmLines.push(`coverImage: "${cover.replaceAll('"', '\\"')}"`);
if (description) fmLines.push(`description: "${description.replaceAll('"', '\\"')}"`);

fmLines.push(`permalink: "issues/${issueSlug}/index.html"`);
fmLines.push("---", "", "");

fs.writeFileSync(indexPath, fmLines.join("\n"), "utf8");
console.log(`Created ${path.relative(repoRoot, indexPath)}`);
console.log(`Ensured ${path.relative(repoRoot, articlesDir)}/ exists`);

