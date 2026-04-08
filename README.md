# eascairt
Suíomh idirlíne don iris nua Ollscoil na Gaillimhe, Eascairt

---

# Eascairt (11ty)

Static Irish-language student magazine site built with [Eleventy (11ty)](https://www.11ty.dev/) and deployed on GitHub Pages.

This repo contains the magazine issues and articles as Markdown files under `src/issues/`, and the Eleventy templates that render them into a static site.

## Development

```bash
npm install
npm run dev
```

## Common scripts

- **Dev server**: `npm run dev`
- **Build**: `npm run build`
- **Create a new article file**: `npm run new:article -- --issue <issueSlug> --slug <articleSlug> --title "<title>" [--subtitle "<subtitle>"] --author "<author>" --dialect <connacht|munster|ulster> --order <number> [--poem]`

Example:

```bash
npm run new:article -- --issue 2026-mean-fomhair --slug reamhra --title "Réamhrá" --subtitle "Seo alt a scríobh Caoimhe" --author "Le Caoimhe Ní Bhradáin" --dialect ulster --order 1
```

## Content structure

- **Issues**: `src/issues/<issueSlug>/index.md`
- **Articles**: `src/issues/<issueSlug>/articles/<articleSlug>.md`

Each issue lives in its own folder (for example `src/issues/2026-mean-fomhair/`). Articles are Markdown files inside that issue’s `articles/` directory.

## Article frontmatter

Articles use the `layouts/article.njk` layout and typically include frontmatter like:

- **layout**: `layouts/article.njk`
- **title**: Article title
- **subtitle**: Optional subtitle
- **author**: Display name for the author line
- **issueSlug**: Must match the parent issue folder name
- **dialect**: `connacht`, `munster`, or `ulster` (not currently used for anything)
- **order**: Number used to order articles within an issue
- **permalink**: Output path, e.g. `issues/<issueSlug>/<articleSlug>/index.html`
- **poem**: Optional boolean flag for poem formatting (when present)

Article pages embed the ABAIR web reader widget client-side.

