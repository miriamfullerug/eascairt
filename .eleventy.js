module.exports = function (eleventyConfig) {
  const isProd = process.env.NODE_ENV === "production";
  // Site is served at the apex domain (no path prefix).
  const pathPrefix = "/";

  const slugifyName = (input) => {
    const s = String(input || "").trim();
    if (!s) return "";
    return s
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Static assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Basic helpers for Nunjucks templates
  eleventyConfig.addFilter("where", (arr, key, value) => {
    if (!Array.isArray(arr)) return [];
    return arr.filter((item) => item?.data?.[key] === value);
  });

  eleventyConfig.addFilter("sortByOrder", (arr) => {
    if (!Array.isArray(arr)) return [];
    return [...arr].sort((a, b) => {
      const ao = Number(a?.data?.order ?? 0);
      const bo = Number(b?.data?.order ?? 0);
      if (ao !== bo) return ao - bo;
      return String(a?.data?.title ?? "").localeCompare(String(b?.data?.title ?? ""), "ga");
    });
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    return new Intl.DateTimeFormat("ga-IE", { year: "numeric", month: "long", day: "numeric" }).format(d);
  });

  eleventyConfig.addFilter("year", (dateObj) => {
    const d = dateObj instanceof Date ? dateObj : dateObj ? new Date(dateObj) : new Date();
    return String(d.getFullYear());
  });

  // Build URLs that work under GitHub Pages project pathPrefix
  eleventyConfig.addFilter("url", (path, explicitPrefix) => {
    const effectivePrefix = (explicitPrefix || pathPrefix || "/").replace(/\/?$/, "/");
    const p = String(path || "");
    const cleaned = p.replace(/^\/+/, "");
    return effectivePrefix + cleaned;
  });

  eleventyConfig.addFilter("slugifyName", (name) => slugifyName(name));

  eleventyConfig.addFilter("authorByline", (name) => {
    const n = String(name || "").trim();
    if (!n) return "";
    const first = n.normalize("NFKD").charAt(0).toUpperCase();
    const vowels = new Set(["A", "E", "I", "O", "U"]);
    const needsH = vowels.has(first);
    return needsH ? `Le h${n}` : `Le ${n}`;
  });

  eleventyConfig.addFilter("authorBylineList", (names) => {
    const list = Array.isArray(names) ? names : [names];
    const cleaned = list.map((x) => String(x || "").trim()).filter(Boolean);
    if (cleaned.length === 0) return "";

    const firstName = cleaned[0];
    const first = firstName.normalize("NFKD").charAt(0).toUpperCase();
    const vowels = new Set(["A", "E", "I", "O", "U"]);
    const needsH = vowels.has(first);
    const prefix = needsH ? "Le h" : "Le ";

    const formatted =
      cleaned.length === 1
        ? firstName
        : cleaned.length === 2
          ? `${cleaned[0]} agus ${cleaned[1]}`
          : `${cleaned.slice(0, -1).join(", ")}, agus ${cleaned[cleaned.length - 1]}`;

    return prefix + formatted;
  });

  // Compute prev/next within the same issue
  eleventyConfig.addFilter("prevNextInIssue", (articlesInIssue, currentUrl) => {
    if (!Array.isArray(articlesInIssue)) return { prev: null, next: null };
    const idx = articlesInIssue.findIndex((a) => a?.url === currentUrl);
    return {
      prev: idx > 0 ? articlesInIssue[idx - 1] : null,
      next: idx >= 0 && idx < articlesInIssue.length - 1 ? articlesInIssue[idx + 1] : null
    };
  });

  // Collections
  eleventyConfig.addCollection("issues", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/issues/**/index.md")
      .sort((a, b) => (b.date || 0) - (a.date || 0));
  });

  eleventyConfig.addCollection("articles", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/issues/**/articles/*.md");
  });

  eleventyConfig.addCollection("people", (collectionApi) => {
    const articles = collectionApi.getFilteredByGlob("src/issues/**/articles/*.md");
    const profiles = collectionApi.getFilteredByGlob("src/daoine/*.md");
    const profileBySlug = new Map();

    for (const p of profiles) {
      const explicitSlug = String(p?.data?.personSlug || p?.data?.slug || "").trim();
      const fallbackSlug = slugifyName(p?.data?.title || p?.data?.name || "");
      const slug = explicitSlug || fallbackSlug;
      if (!slug) continue;
      profileBySlug.set(slug, p);
    }
    const map = new Map();

    for (const a of articles) {
      const authorsRaw = a?.data?.authors ?? a?.data?.author ?? [];
      const authorList = Array.isArray(authorsRaw) ? authorsRaw : [authorsRaw];
      const names = authorList.map((x) => String(x || "").trim()).filter(Boolean);
      for (const name of names) {
        const key = name;
        if (!map.has(key)) {
          const slug = slugifyName(name);
          const profile = profileBySlug.get(slug);
          map.set(key, {
            name,
            slug,
            profile,
            articles: []
          });
        }
        map.get(key).articles.push(a);
      }
    }

    const people = Array.from(map.values());

    for (const p of people) {
      p.articles.sort((x, y) => {
        const ix = String(x?.data?.issueSlug ?? "");
        const iy = String(y?.data?.issueSlug ?? "");
        if (ix !== iy) return ix.localeCompare(iy, "ga");
        const ox = Number(x?.data?.order ?? 0);
        const oy = Number(y?.data?.order ?? 0);
        if (ox !== oy) return ox - oy;
        const tx = String(x?.data?.title ?? "");
        const ty = String(y?.data?.title ?? "");
        return tx.localeCompare(ty, "ga");
      });
    }

    people.sort((a, b) => a.name.localeCompare(b.name, "ga"));
    return people;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix
  };
};

