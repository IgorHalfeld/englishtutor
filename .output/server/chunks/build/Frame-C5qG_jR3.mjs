import { defineComponent, resolveComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Frame",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    bg: { default: "linear-gradient(to bottom right, #171717, #131313)" },
    icon: {},
    logo: {},
    image: {},
    username: {},
    socials: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = resolveComponent("Icon");
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative h-full w-full flex items-center justify-center bg-neutral-900 text-white border-2 border-white",
        style: { backgroundImage: _ctx.bg }
      }, _attrs))}>`);
      if (_ctx.image) {
        _push(`<div class="absolute inset-0 w-full h-full bg-center opacity-10" style="${ssrRenderStyle({ backgroundImage: `url(${_ctx.image})` })}"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col items-center text-center"><h1 class="flex gap-4 text-7xl font-bold">`);
      if (_ctx.icon) {
        _push(ssrRenderComponent(_component_Icon, { name: _ctx.icon }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(_ctx.title)}</h1><p class="text-2xl max-w-3xl">${ssrInterpolate(_ctx.description)}</p></div>`);
      if (_ctx.logo) {
        _push(`<img${ssrRenderAttr("src", _ctx.logo)} class="absolute bottom-0 left-0 p-5" style="${ssrRenderStyle({ "height": "125px", "width": "153px" })}">`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="absolute bottom-5 right-5 flex gap-4">`);
      if (_ctx.username) {
        _push(`<div class="absolute bottom-12 right-8 font-bold">${ssrInterpolate(_ctx.username)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(_ctx.socials, (social) => {
        _push(ssrRenderComponent(_component_Icon, {
          key: social.name,
          name: social.icon,
          class: "w-7 h-7"
        }, null, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt-og-image/dist/runtime/nuxt/components/Templates/Community/Frame.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=Frame-C5qG_jR3.mjs.map
