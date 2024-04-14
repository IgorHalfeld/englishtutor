import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "WithEmoji",
  __ssrInlineRender: true,
  props: {
    emoji: { default: "\u{1F44B}" },
    title: { default: "title" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-full w-full flex items-start justify-start bg-sky-50" }, _attrs))}><div class="flex items-start justify-start h-full"><div class="flex flex-col justify-center items-center px-20 w-full h-full text-center"><p class="text-[120px] mx-auto text-center font-bold mb-0">${ssrInterpolate(_ctx.emoji)}</p><h1 class="text-[60px] font-bold">${ssrInterpolate(_ctx.title)}</h1></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt-og-image/dist/runtime/nuxt/components/Templates/Community/WithEmoji.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=WithEmoji-CdhPpvLx.mjs.map
