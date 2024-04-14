import { x as defu, d as useRuntimeConfig } from '../runtime.mjs';

function toBase64Image(fileName, data) {
  const base64 = typeof data === "string" ? data : Buffer.from(data).toString("base64");
  let type = "image/jpeg";
  const ext = fileName.split(".").pop();
  if (ext === "svg")
    type = "image/svg+xml";
  else if (ext === "png")
    type = "image/png";
  return `data:${type};base64,${base64}`;
}
function filterIsOgImageOption(key) {
  const keys = [
    "url",
    "extension",
    "width",
    "height",
    "fonts",
    "alt",
    "props",
    "renderer",
    "html",
    "component",
    "renderer",
    "emojis",
    "_query",
    "satori",
    "resvg",
    "sharp",
    "screenshot",
    "cacheMaxAgeSeconds"
  ];
  return keys.includes(key);
}
function separateProps(options, ignoreKeys = []) {
  options = options || {};
  const _props = defu(options.props, Object.fromEntries(
    Object.entries({ ...options }).filter(([k]) => !filterIsOgImageOption(k) && !ignoreKeys.includes(k))
  ));
  const props = {};
  Object.entries(_props).forEach(([key, val]) => {
    props[key.replace(/-([a-z])/g, (g) => g[1].toUpperCase())] = val;
  });
  return {
    ...Object.fromEntries(
      Object.entries({ ...options }).filter(([k]) => filterIsOgImageOption(k) || ignoreKeys.includes(k))
    ),
    props
  };
}
function normaliseFontInput(fonts) {
  return fonts.map((f) => {
    if (typeof f === "string") {
      const [name, weight] = f.split(":");
      return {
        cacheKey: f,
        name,
        weight: weight || 400,
        style: "normal",
        path: void 0
      };
    }
    return {
      cacheKey: f.key || `${f.name}:${f.weight}`,
      style: "normal",
      weight: 400,
      ...f
    };
  });
}

function useOgImageRuntimeConfig() {
  return useRuntimeConfig()["nuxt-og-image"];
}

export { normaliseFontInput as n, separateProps as s, toBase64Image as t, useOgImageRuntimeConfig as u };
//# sourceMappingURL=shared.mjs.map
