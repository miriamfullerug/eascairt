module.exports = function (eleventyConfig) {
  const isProd = process.env.NODE_ENV === "production";
  // Local dev server typically runs at `/`, GitHub Pages uses `/eascairt/`.
  const pathPrefix = isProd ? "/eascairt/" : "/";

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

