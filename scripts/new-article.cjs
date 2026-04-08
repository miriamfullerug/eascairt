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
  npm run new:article -- --issue <issueSlug> --slug <articleSlug> --title "<title>" [--subtitle "<subtitle>"] --author "<author>" --dialect <connacht|munster|ulster> --order <number> [--poem]

Example:
  npm run new:article -- --issue 2026-mean-fomhair --slug reamhra --title "Réamhrá" --subtitle "Fo-theideal" --author "Le Caoimhe Ní Bhradáin" --dialect ulster --order 1

Poem example:
  npm run new:article -- --issue 2026-mean-fomhair --slug danta --title "Dán" --author "Le ..." --dialect connacht --order 9 --poem
`);
}

const issueSlug = getArg("issue");
const slug = getArg("slug");
const title = getArg("title");
const subtitle = getArg("subtitle");
const author = getArg("author");
const dialect = getArg("dialect") || "connacht";
const orderRaw = getArg("order") || "1";
const order = Number(orderRaw);
const isPoem = process.argv.includes("--poem");

if (!issueSlug || !slug || !title || !author || !Number.isFinite(order)) {
  usage();
  process.exit(1);
}

const repoRoot = process.cwd();
const issueDir = path.join(repoRoot, "src", "issues", issueSlug);
const articlesDir = path.join(issueDir, "articles");
const filePath = path.join(articlesDir, `${slug}.md`);

if (!fs.existsSync(issueDir)) {
  console.error(`Issue folder not found: ${issueDir}`);
  console.error(`Create it first at src/issues/${issueSlug}/ (and add index.md).`);
  process.exit(1);
}

fs.mkdirSync(articlesDir, { recursive: true });

if (fs.existsSync(filePath)) {
  console.error(`File already exists: ${filePath}`);
  process.exit(1);
}

const contents = `---\n` +
  `layout: layouts/article.njk\n` +
  `title: "${title.replaceAll('"', '\\"')}"\n` +
  (subtitle ? `subtitle: "${subtitle.replaceAll('"', '\\"')}"\n` : "") +
  `author: "${author.replaceAll('"', '\\"')}"\n` +
  `issueSlug: "${issueSlug}"\n` +
  `dialect: "${dialect}"\n` +
  `order: ${order}\n` +
  `permalink: "issues/${issueSlug}/${slug}/index.html"\n` +
  (isPoem ? `poem: true\n` : "") +
  `---\n\n` +
  `\n`;

fs.writeFileSync(filePath, contents, "utf8");
console.log(`Created ${path.relative(repoRoot, filePath)}`);

