import { d as useOgImageRuntimeConfig, e as useSiteConfig } from './server.mjs';
import { defineComponent, computed, resolveComponent, h, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderClass, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import '../runtime.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'dayjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "NuxtSeo",
  __ssrInlineRender: true,
  props: {
    colorMode: {},
    title: { default: "title" },
    description: {},
    icon: { type: [String, Boolean] },
    siteName: {},
    siteLogo: {},
    theme: { default: "#00dc82" }
  },
  setup(__props) {
    const props = __props;
    const HexRegex = /^#([0-9a-f]{3}){1,2}$/i;
    const runtimeConfig = useOgImageRuntimeConfig();
    const colorMode = computed(() => {
      return props.colorMode || runtimeConfig.colorPreference || "light";
    });
    const themeHex = computed(() => {
      if (HexRegex.test(props.theme))
        return props.theme;
      if (HexRegex.test(`#${props.theme}`))
        return `#${props.theme}`;
      if (props.theme.startsWith("rgb")) {
        const rgb = props.theme.replace("rgb(", "").replace("rgba(", "").replace(")", "").split(",").map((v) => Number.parseInt(v.trim(), 10));
        const hex = rgb.map((v) => {
          const hex2 = v.toString(16);
          return hex2.length === 1 ? `0${hex2}` : hex2;
        }).join("");
        return `#${hex}`;
      }
      return "#FFFFFF";
    });
    const themeRgb = computed(() => {
      var _a;
      return (_a = themeHex.value.replace("#", "").match(/.{1,2}/g)) == null ? void 0 : _a.map((v) => Number.parseInt(v, 16)).join(", ");
    });
    const siteConfig = useSiteConfig();
    const siteName = computed(() => {
      return props.siteName || siteConfig.name;
    });
    const siteLogo = computed(() => {
      return props.siteLogo || siteConfig.logo;
    });
    const IconComponent = runtimeConfig.hasNuxtIcon ? resolveComponent("Icon") : defineComponent({
      render() {
        return h("div", "missing nuxt-icon");
      }
    });
    if (typeof props.icon === "string" && !runtimeConfig.hasNuxtIcon && false) {
      console.warn("Please install `nuxt-icon` to use icons with the fallback OG Image component.");
      console.log("\nnpm add -D nuxt-icon\n");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["w-full h-full flex justify-between relative p-[60px]", [
          colorMode.value === "light" ? ["bg-white", "text-gray-900"] : ["bg-gray-900", "text-gray-50"]
        ]]
      }, _attrs))}><div class="flex absolute top-0 right-[-100%]" style="${ssrRenderStyle({
        width: "200%",
        height: "200%",
        backgroundImage: `radial-gradient(circle, rgba(${themeRgb.value}, 0.5) 0%,  ${colorMode.value === "dark" ? "rgba(5, 5, 5,0.3)" : "rgba(255, 255, 255, 0.7)"} 50%, ${props.colorMode === "dark" ? "rgba(5, 5, 5,0)" : "rgba(255, 255, 255, 0)"} 70%)`
      })}"></div><div class="h-full w-full justify-between relative"><div class="flex flex-row justify-between items-start"><div class="flex flex-col w-full max-w-[65%]"><h1 class="m-0 font-bold mb-[30px] text-[75px]">${ssrInterpolate(_ctx.title)}</h1>`);
      if (_ctx.description) {
        _push(`<p class="${ssrRenderClass([[
          colorMode.value === "light" ? ["text-gray-700"] : ["text-gray-300"]
        ], "text-[35px]"])}">${ssrInterpolate(_ctx.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (Boolean(_ctx.icon)) {
        _push(`<div style="${ssrRenderStyle({ "width": "30%" })}" class="flex justify-end">`);
        _push(ssrRenderComponent(unref(IconComponent), {
          name: _ctx.icon,
          size: "250px",
          style: { "margin": "0 auto", "opacity": "0.7" }
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex flex-row justify-center items-center text-left w-full">`);
      if (siteLogo.value) {
        _push(`<img${ssrRenderAttr("src", siteLogo.value)} height="30">`);
      } else {
        _push(`<!--[--><svg height="50" width="50" class="mr-3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path${ssrRenderAttr("fill", _ctx.theme.includes("#") ? _ctx.theme : `#${_ctx.theme}`)} d="M62.3,-53.9C74.4,-34.5,73.5,-9,67.1,13.8C60.6,36.5,48.7,56.5,30.7,66.1C12.7,75.7,-11.4,74.8,-31.6,65.2C-51.8,55.7,-67.9,37.4,-73.8,15.7C-79.6,-6,-75.1,-31.2,-61.1,-51C-47.1,-70.9,-23.6,-85.4,0.8,-86C25.1,-86.7,50.2,-73.4,62.3,-53.9Z" transform="translate(100 100)"></path></svg>`);
        if (siteName.value) {
          _push(`<p style="${ssrRenderStyle({ "font-size": "25px" })}" class="font-bold">${ssrInterpolate(siteName.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt-og-image/dist/runtime/nuxt/components/Templates/Community/NuxtSeo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=NuxtSeo-CrQ0NHw3.mjs.map
