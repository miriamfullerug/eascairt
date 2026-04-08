module.exports = function () {
  const isProd = process.env.NODE_ENV === "production";
  return {
    title: "Eascairt",
    description: "Iris nua Ollscoil na Gailliṁe",
    pathPrefix: isProd ? "/eascairt/" : "/"
  };
};

