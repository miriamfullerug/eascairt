module.exports = function () {
  const isProd = process.env.NODE_ENV === "production";
  return {
    title: "Eascairt",
    description: "Iris nua Ollscoil na Gaillimhe",
    // Jekyll-equivalents:
    // - baseurl: "" (no path prefix)
    // - url: "https://eascairt.ie"
    baseurl: "",
    url: "https://eascairt.ie",
    pathPrefix: "/"
  };
};

