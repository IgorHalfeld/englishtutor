import { E as prefixStorage, G as useStorage, W as useNitroOrigin, V as withBase, A as createStorage, x as defu } from '../runtime.mjs';
import { t as theme, d as decodeHtml, f as fetchIsland, h as htmlDecodeQuotes, a as applyEmojis, l as lruCacheDriver } from '../routes/__og-image__/image/image.mjs';
import { t as toBase64Image, u as useOgImageRuntimeConfig, n as normaliseFontInput } from './shared.mjs';
import { html } from 'satori-html';
import { inline } from '@css-inline/css-inline';
import { createGenerator } from '@unocss/core';
import presetWind from '@unocss/preset-wind';
import sizeOf from 'image-size';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'vue';
import 'node:fs';
import 'node:url';
import 'lru-cache';
import '@unhead/ssr';
import 'unhead';

const assets = prefixStorage(useStorage(), "/assets");
async function loadFont({ e }, font) {
  const { name, weight } = font;
  if (font.data)
    return font;
  if (font.key && await assets.hasItem(font.key)) {
    let fontData = await assets.getItem(font.key);
    if (fontData instanceof Uint8Array) {
      const decoder = new TextDecoder();
      fontData = decoder.decode(fontData);
    }
    font.data = Buffer.from(fontData, "base64");
    return font;
  }
  let data;
  if (font.path) {
    data = await e.$fetch(font.path, {
      baseURL: useNitroOrigin(e),
      responseType: "arrayBuffer"
    });
  } else {
    data = await e.$fetch(`/__og-image__/font/${name}/${weight}.ttf`, {
      responseType: "arrayBuffer",
      query: {
        font
      }
    });
  }
  font.data = data;
  return font;
}

const cssInlineInstance = { instance: void 0 };
const sharpInstance = { instance: void 0 };
const resvgInstance = { instance: void 0 };
const satoriInstance = { instance: void 0 };
async function useResvg() {
  resvgInstance.instance = resvgInstance.instance || await import('./node.mjs').then((m) => m.default);
  await resvgInstance.instance.initWasmPromise;
  return resvgInstance.instance.Resvg;
}
async function useSatori() {
  satoriInstance.instance = satoriInstance.instance || await import('./node2.mjs').then((m) => m.default);
  await satoriInstance.instance.initWasmPromise;
  return satoriInstance.instance.satori;
}
async function useSharp() {
  sharpInstance.instance = sharpInstance.instance || await import('./empty.mjs').then((m) => m.default);
  return sharpInstance.instance;
}
async function useCssInline() {
  cssInlineInstance.instance = cssInlineInstance.instance || await Promise.resolve().then(function () { return node; }).then((m) => m.default);
  await cssInlineInstance.instance.initWasmPromise;
  return cssInlineInstance.instance.cssInline;
}

const cssInline = {
  initWasmPromise: Promise.resolve(),
  cssInline: {
    inline
  }
};

const node = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: cssInline
});

async function applyInlineCss({ e }, island) {
  let html = island.html;
  if (!cssInline.__unenv__) {
    let css = island.head.style.map((s) => s.innerHTML).join("\n");
    island.head.link.filter((l) => l.href.startsWith("/_nuxt/components"));
    if (!css.trim().length)
      return false;
    const cssInline2 = await useCssInline();
    html = cssInline2.inline(island.html, {
      loadRemoteStylesheets: false,
      extraCss: css
    });
    const classes = css.match(/\.([a-zA-Z0-9-_]+)/g)?.map((c) => c.replace(".", ""));
    if (classes)
      html = html.replace(new RegExp(`class="(${classes.join("|")})"`, "g"), "");
    island.html = html;
    return true;
  }
  return false;
}

async function walkSatoriTree(e, node, plugins) {
  if (!node.props?.children || !Array.isArray(node.props.children))
    return;
  if (node.props.children.length === 0) {
    delete node.props.children;
    return;
  }
  for (const child of node.props.children || []) {
    if (child) {
      for (const plugin of plugins.flat()) {
        if (plugin.filter(child))
          await plugin.transform(child, e);
      }
      await walkSatoriTree(e, child, plugins);
    }
  }
}
function defineSatoriTransformer(transformer) {
  return transformer;
}

const uno = createGenerator({ theme }, {
  presets: [
    presetWind()
  ]
});
const unocss = defineSatoriTransformer({
  filter: (node) => !!node.props?.class,
  transform: async (node) => {
    const classes = node.props.class || "";
    const styles = node.props.style || {};
    const replacedClasses = /* @__PURE__ */ new Set();
    for (const token of classes.split(" ").filter((c) => c.trim())) {
      const parsedToken = await uno.parseToken(token);
      if (parsedToken) {
        const inlineStyles = parsedToken[0][2].split(";").filter((s) => !!s?.trim());
        const vars = {};
        inlineStyles.filter((s) => s.startsWith("--")).forEach((s) => {
          const [key, value] = s.split(":");
          vars[key] = value;
        });
        inlineStyles.filter((s) => !s.startsWith("--")).forEach((s) => {
          const [key, value] = s.split(":");
          const camelCasedKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
          if (!styles[camelCasedKey])
            styles[camelCasedKey] = value.replace(/var\((.*?)\)/g, (_, k) => vars[k.trim()]);
          if (styles[camelCasedKey] && styles[camelCasedKey].includes("/")) {
            const [rgb, opacity] = styles[camelCasedKey].split("/");
            if (opacity.trim() === "1)")
              styles[camelCasedKey] = rgb.replace(/(\d+) (\d+) (\d+).*/, (_, r, g, b) => `${r}, ${g}, ${b})`);
            else
              styles[camelCasedKey] = `${rgb.replace("rgb", "rgba").replaceAll(" ", ", ")}${opacity.trim()}`;
          }
        });
        replacedClasses.add(token);
      }
    }
    node.props.class = classes.split(" ").filter((c) => !replacedClasses.has(c)).join(" ");
    node.props.tw = classes.split(" ").filter((c) => !replacedClasses.has(c)).join(" ");
    node.props.style = styles;
  }
});

function isEmojiFilter(node) {
  return node.type === "svg" && typeof node.props?.["data-emoji"] !== "undefined";
}
const emojis = defineSatoriTransformer([
  // need to make sure parent div has flex for the emoji to render inline
  {
    filter: (node) => ["div", "p"].includes(node.type) && Array.isArray(node.props?.children) && node.props.children.some(isEmojiFilter),
    transform: async (node) => {
      node.props.style = node.props.style || {};
      node.props.style.display = "flex";
      node.props.style.alignItems = "center";
      node.props.children = node.props.children.map((child) => {
        if (typeof child === "string") {
          return {
            type: "div",
            props: {
              children: child
            }
          };
        }
        if (child.props.class?.includes("emoji"))
          delete child.props.class;
        return child;
      });
    }
  }
]);

const classes = defineSatoriTransformer([
  {
    filter: (node) => !!node.props?.class && !node.props?.tw,
    transform: async (node) => {
      node.props.tw = node.props.class;
      node.props.tw = node.props.tw.replace(/icon|inline-style/g, "");
    }
  },
  {
    filter: (node) => !!node.props?.style?.display,
    transform: async (node) => {
      if (["inline-block", "inline"].includes(node.props.style.display))
        delete node.props.style.display;
    }
  }
]);

const imageSrc = defineSatoriTransformer([
  // fix <img src="">
  {
    filter: (node) => node.type === "img" && node.props?.src,
    transform: async (node, { e }) => {
      const src = node.props.src;
      const isRelative = src.startsWith("/");
      let dimensions;
      let imageBuffer;
      if (isRelative) {
        {
          imageBuffer = await e.$fetch(src, {
            baseURL: useNitroOrigin(e),
            responseType: "arrayBuffer"
          }).catch(() => {
          });
        }
      } else {
        imageBuffer = await $fetch(src, {
          responseType: "arrayBuffer"
        }).catch(() => {
        });
      }
      if (imageBuffer)
        imageBuffer = Buffer.from(imageBuffer);
      if (imageBuffer) {
        node.props.src = toBase64Image(src, imageBuffer);
        try {
          const imageSize = sizeOf(imageBuffer);
          dimensions = { width: imageSize.width, height: imageSize.height };
        } catch (e2) {
        }
      }
      if (dimensions?.width && dimensions?.height) {
        const naturalAspectRatio = dimensions.width / dimensions.height;
        if (node.props.width && !node.props.height) {
          node.props.height = Math.round(node.props.width / naturalAspectRatio);
        } else if (node.props.height && !node.props.width) {
          node.props.width = Math.round(node.props.height * naturalAspectRatio);
        } else if (!node.props.width && !node.props.height) {
          node.props.width = dimensions.width;
          node.props.height = dimensions.height;
        }
      }
      if (node.props.src.startsWith("/")) {
        node.props.src = `${withBase(src, `${useNitroOrigin(e)}`)}?${Date.now()}`;
      }
    }
  },
  // fix style="background-image: url('')"
  {
    filter: (node) => node.props?.style?.backgroundImage?.includes("url("),
    transform: async (node, { e }) => {
      const backgroundImage = node.props.style.backgroundImage;
      const src = backgroundImage.replace(/^url\(['"]?/, "").replace(/['"]?\)$/, "");
      const isRelative = src?.startsWith("/");
      if (isRelative) {
        {
          node.props.style.backgroundImage = `url(${withBase(src, `${useNitroOrigin(e)}`)}?${Date.now()})`;
        }
      }
    }
  }
]);

const flex = defineSatoriTransformer({
  filter: (node) => node.type === "div" && (Array.isArray(node.props?.children) && node.props?.children.length >= 1) && (!node.props.style?.display && !node.props?.class?.includes("hidden")),
  transform: async (node) => {
    node.props.style = node.props.style || {};
    node.props.style.display = "flex";
    if (!node.props?.class?.includes("flex-"))
      node.props.style.flexDirection = "column";
  }
});

const encoding = defineSatoriTransformer([
  // clean up
  {
    filter: (node) => node.props?.["data-v-inspector"],
    transform: async (node) => {
      delete node.props["data-v-inspector"];
    }
  },
  {
    filter: (node) => typeof node.props?.children === "string",
    transform: async (node) => {
      node.props.children = decodeHtml(node.props.children);
    }
  }
]);

async function createVNodes(ctx) {
  let html$1 = ctx.options.html;
  if (!html$1) {
    const island = await fetchIsland(ctx.e, ctx.options.component, typeof ctx.options.props !== "undefined" ? ctx.options.props : ctx.options);
    island.html = htmlDecodeQuotes(island.html);
    await applyInlineCss(ctx, island);
    await applyEmojis(ctx, island);
    html$1 = island.html;
  }
  const template = `<div style="position: relative; display: flex; margin: 0 auto; width: ${ctx.options.width}px; height: ${ctx.options.height}px; overflow: hidden;">${html$1}</div>`;
  const satoriTree = html(template);
  await walkSatoriTree(ctx, satoriTree, [
    unocss,
    emojis,
    classes,
    imageSrc,
    flex,
    encoding
  ]);
  return satoriTree;
}

const fontPromises = {};
const fontCache = createStorage({
  driver: lruCacheDriver({ max: 10 })
});
async function resolveFonts(event) {
  const { fonts } = useOgImageRuntimeConfig();
  const normalisedFonts = normaliseFontInput([...event.options.fonts || [], ...fonts]);
  const localFontPromises = [];
  const preloadedFonts = [];
  for (const font of normalisedFonts) {
    if (await fontCache.hasItem(font.cacheKey)) {
      font.data = await fontCache.getItemRaw(font.cacheKey);
      preloadedFonts.push(font);
    } else {
      if (!fontPromises[font.cacheKey]) {
        fontPromises[font.cacheKey] = loadFont(event, font).then(async (_font) => {
          if (_font?.data)
            await fontCache.setItemRaw(_font.cacheKey, _font.data);
          return _font;
        });
      }
      localFontPromises.push(fontPromises[font.cacheKey]);
    }
  }
  const awaitedFonts = await Promise.all(localFontPromises);
  return [...preloadedFonts, ...awaitedFonts].map((_f) => {
    return { name: _f.name, data: _f.data, style: _f.style, weight: Number(_f.weight) };
  });
}
async function createSvg(event) {
  const { options } = event;
  const { satoriOptions: _satoriOptions } = useOgImageRuntimeConfig();
  const [satori, vnodes, fonts] = await Promise.all([
    useSatori(),
    createVNodes(event),
    resolveFonts(event)
  ]);
  await event._nitro.hooks.callHook("nuxt-og-image:satori:vnodes", vnodes, event);
  const satoriOptions = defu(options.satori, _satoriOptions, {
    fonts,
    tailwindConfig: { theme },
    embedFont: true,
    width: options.width,
    height: options.height
  });
  return satori(vnodes, satoriOptions);
}
async function createPng(event) {
  const { resvgOptions } = useOgImageRuntimeConfig();
  const svg = await createSvg(event);
  const Resvg = await useResvg();
  const resvg = new Resvg(svg, defu(
    event.options.resvg,
    resvgOptions
  ));
  const pngData = resvg.render();
  return pngData.asPng();
}
async function createJpeg(event) {
  const { sharpOptions } = useOgImageRuntimeConfig();
  const png = await createPng(event);
  const sharp = await useSharp();
  return sharp(png, defu(event.options.sharp, sharpOptions)).jpeg().toBuffer();
}
const SatoriRenderer = {
  name: "satori",
  supportedFormats: ["png", "jpeg", "jpg", "json"],
  async createImage(e) {
    switch (e.extension) {
      case "png":
        return createPng(e);
      case "jpeg":
      case "jpg":
        return createJpeg(e);
    }
  },
  async debug(e) {
    return {
      vnodes: await createVNodes(e),
      svg: await createSvg(e)
    };
  }
};

export { createSvg, SatoriRenderer as default };
//# sourceMappingURL=renderer.mjs.map
