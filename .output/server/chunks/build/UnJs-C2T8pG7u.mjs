import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "UnJs",
  __ssrInlineRender: true,
  props: {
    title: { default: "unjs/h3" },
    description: { default: "Minimal H(TTP) framework built for high performance and portability" },
    emoji: { default: "\u26A1" },
    downloads: { default: "2500000" },
    stars: { default: "2400" },
    contributors: { default: "30" }
  },
  setup(__props) {
    const props = __props;
    const org = computed(() => props.title.split("/")[0]);
    const repo = computed(() => props.title.split("/")[1]);
    const stars = computed(() => {
      return new Intl.NumberFormat("en-US", { notation: "compact", compactDisplay: "short" }).format(Number(props.stars || 0));
    });
    const downloads = computed(
      () => new Intl.NumberFormat("en-US", { notation: "compact", compactDisplay: "short" }).format(Number(props.downloads || 0))
    );
    const description = computed(() => (props.description || "").slice(0, 200));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full h-full flex flex-col bg-white" }, _attrs))}><div class="pt-[60px] pb-[70px] px-[6.75rem] h-full flex flex-col justify-between"><div class="flex flex-row justify-between"><div class="max-w-[700px]"><h1 class="mb-[30px] max-w-[700px] text-[60px] text-gray-900 font-normal flex flex-row"><span>${ssrInterpolate(unref(org))}</span>`);
      if (unref(repo)) {
        _push(`<span class="ml-2">/</span>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(repo)) {
        _push(`<span class="ml-2 font-bold">${ssrInterpolate(unref(repo))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</h1><p class="text-gray-500 max-w-[700px] text-[35px] leading-[60px]">${ssrInterpolate(unref(description))}</p></div><div class="text-[200px]">${ssrInterpolate(_ctx.emoji)}</div></div><div class="flex flex-row items-center justify-between"><div class="flex flex-row text-[40px]"><div class="flex flex-row pr-10"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="#888888" d="m4.67 28l6.39-12l7.3 6.49a2 2 0 0 0 1.7.47a2 2 0 0 0 1.42-1.07L27 10.9l-1.82-.9l-5.49 11l-7.3-6.49a2 2 0 0 0-1.68-.51a2 2 0 0 0-1.42 1L4 25V2H2v26a2 2 0 0 0 2 2h26v-2Z"></path></svg><div class="pl-2"><div>${ssrInterpolate(unref(downloads))}</div><div class="text-lg text-gray-600"> Monthly Downloads </div></div></div><div class="flex flex-row pr-10"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="#888888" d="m16 6.52l2.76 5.58l.46 1l1 .15l6.16.89l-4.38 4.3l-.75.73l.18 1l1.05 6.13l-5.51-2.89L16 23l-.93.49l-5.51 2.85l1-6.13l.18-1l-.74-.77l-4.42-4.35l6.16-.89l1-.15l.46-1L16 6.52M16 2l-4.55 9.22l-10.17 1.47l7.36 7.18L6.9 30l9.1-4.78L25.1 30l-1.74-10.13l7.36-7.17l-10.17-1.48Z"></path></svg><div class="pl-2"><div>${ssrInterpolate(unref(stars))}</div><div class="text-lg text-gray-600"> Stars </div></div></div><div class="flex flex-row pr-10"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="#888888" d="M22.45 6a5.47 5.47 0 0 1 3.91 1.64a5.7 5.7 0 0 1 0 8L16 26.13L5.64 15.64a5.7 5.7 0 0 1 0-8a5.48 5.48 0 0 1 7.82 0l2.54 2.6l2.53-2.58A5.44 5.44 0 0 1 22.45 6m0-2a7.47 7.47 0 0 0-5.34 2.24L16 7.36l-1.11-1.12a7.49 7.49 0 0 0-10.68 0a7.72 7.72 0 0 0 0 10.82L16 29l11.79-11.94a7.72 7.72 0 0 0 0-10.82A7.49 7.49 0 0 0 22.45 4Z"></path></svg><div class="pl-2"><div>${ssrInterpolate(_ctx.contributors)}</div><div class="text-lg text-gray-600"> Contributors </div></div></div></div><div class="flex flex-row"><svg width="100" height="100" class="rounded-[0.25rem] w-[100px] h-[100px]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_206_4645)"><mask id="mask0_206_4645" style="${ssrRenderStyle({ "mask-type": "luminance" })}" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32"><path d="M32 0H0V32H32V0Z" fill="white"></path></mask><g mask="url(#mask0_206_4645)"><path d="M31.9142 32.0223C21.2766 32.0223 10.6506 32.0223 0.0246745 32.0223C0.0238272 32.0194 0.0222373 32.0166 0.0222373 32.0137C0.0221323 21.3508 0.0221329 10.688 0.0221329 0.0236816C10.6877 0.0236816 21.3534 0.0236816 32.0206 0.0236816C32.0206 10.6878 32.0206 21.3533 32.0206 32.0223C31.9901 32.0223 31.958 32.0223 31.9142 32.0223ZM26.4121 20.9345C26.361 20.8762 26.3128 20.8153 26.2585 20.7601C25.6577 20.1492 24.9011 20.0218 24.0955 20.0946C23.3969 20.1577 22.7984 20.4652 22.2811 20.9345C22.2532 20.9598 22.2227 20.9823 22.1824 21.0151C22.1824 20.9497 22.185 20.902 22.182 20.8546C22.1669 20.6225 22.0579 20.4465 21.8514 20.3407C21.649 20.2371 21.4421 20.247 21.2512 20.3689C21.0389 20.5045 20.9665 20.713 20.9667 20.958C20.9682 22.7933 20.9675 24.6286 20.9675 26.4639C20.9675 26.5784 20.9652 26.693 20.968 26.8074C20.9751 27.102 21.1313 27.3354 21.3685 27.4101C21.7847 27.5411 22.1817 27.2525 22.1823 26.8136C22.1839 25.5543 22.1836 24.2951 22.1824 23.0359C22.1821 22.6812 22.2717 22.356 22.4979 22.0791C23.025 21.434 23.7075 21.1616 24.5332 21.2556C24.9353 21.3015 25.2602 21.4881 25.4831 21.8327C25.6923 22.1561 25.7639 22.5212 25.7668 22.8971C25.7747 23.9347 25.7716 24.9724 25.7727 26.01C25.7731 26.2943 25.7683 26.5788 25.7739 26.863C25.7826 27.3076 26.2605 27.5828 26.6518 27.3716C26.9007 27.2373 26.9891 27.0176 26.9888 26.7463C26.9873 25.5683 26.9907 24.3903 26.9862 23.2123C26.9852 22.9326 26.9757 22.6511 26.9432 22.3735C26.883 21.8589 26.7401 21.3697 26.4121 20.9345ZM18.7519 20.2768C18.6788 20.282 18.6027 20.2759 18.5331 20.2944C18.2433 20.3715 18.0835 20.6019 18.0833 20.9365C18.0826 22.1367 18.0851 23.337 18.081 24.5372C18.0803 24.7357 18.07 24.9372 18.035 25.1319C17.9425 25.6461 17.6668 26.0312 17.1721 26.2263C16.6902 26.4164 16.194 26.423 15.695 26.2875C15.3165 26.1848 15.0263 25.9676 14.8367 25.6226C14.7009 25.3752 14.6347 25.1055 14.6298 24.8266C14.6199 24.2617 14.6232 23.6966 14.6226 23.1316C14.6218 22.4004 14.6236 21.6691 14.6219 20.9379C14.6211 20.5778 14.3819 20.295 14.069 20.2767C13.6814 20.254 13.4081 20.518 13.4076 20.9221C13.4063 22.1556 13.4047 23.389 13.4085 24.6225C13.4099 25.0635 13.4572 25.4984 13.6251 25.9135C13.9436 26.701 14.5379 27.1764 15.3353 27.4077C15.8372 27.5533 16.3542 27.5622 16.8722 27.5012C17.2723 27.4541 17.6549 27.3449 18.0035 27.1424C18.8265 26.6641 19.2453 25.9203 19.2718 24.9916C19.3108 23.63 19.2949 22.2667 19.2963 20.9041C19.2968 20.5622 19.0957 20.3353 18.7519 20.2768Z" fill="#ECDC5A"></path><path d="M26.4164 20.9411C26.7401 21.3697 26.883 21.8589 26.9432 22.3735C26.9757 22.6511 26.9852 22.9326 26.9862 23.2123C26.9907 24.3903 26.9873 25.5683 26.9888 26.7463C26.9891 27.0176 26.9007 27.2373 26.6518 27.3716C26.2605 27.5828 25.7825 27.3076 25.7739 26.863C25.7683 26.5787 25.773 26.2943 25.7728 26.01C25.7716 24.9723 25.7746 23.9347 25.7668 22.8971C25.7639 22.5212 25.6923 22.1561 25.4831 21.8327C25.2603 21.488 24.9353 21.3014 24.5332 21.2556C23.7076 21.1616 23.025 21.434 22.4979 22.0791C22.2718 22.356 22.182 22.6812 22.1824 23.0358C22.1836 24.2951 22.1839 25.5543 22.1823 26.8136C22.1817 27.2525 21.7847 27.5411 21.3686 27.4101C21.1313 27.3354 20.9751 27.102 20.968 26.8074C20.9653 26.6929 20.9676 26.5784 20.9676 26.4639C20.9676 24.6286 20.9682 22.7933 20.9667 20.9579C20.9665 20.713 21.039 20.5045 21.2512 20.3689C21.4421 20.2469 21.649 20.2371 21.8513 20.3407C22.0578 20.4465 22.1669 20.6224 22.182 20.8546C22.185 20.9019 22.1824 20.9497 22.1824 21.015C22.2227 20.9823 22.2532 20.9598 22.2811 20.9344C22.7984 20.4652 23.3969 20.1577 24.0955 20.0946C24.901 20.0218 25.6577 20.1492 26.2585 20.7601C26.3127 20.8153 26.361 20.8762 26.4164 20.9411Z" fill="#111827"></path><path d="M18.7618 20.2773C19.0957 20.3354 19.2968 20.5622 19.2963 20.9041C19.2949 22.2667 19.3108 23.63 19.2718 24.9916C19.2453 25.9204 18.8265 26.6641 18.0035 27.1424C17.6549 27.345 17.2723 27.4542 16.8722 27.5012C16.3542 27.5622 15.8372 27.5534 15.3353 27.4078C14.5379 27.1764 13.9436 26.701 13.6251 25.9135C13.4572 25.4984 13.4099 25.0635 13.4085 24.6225C13.4047 23.3891 13.4063 22.1556 13.4076 20.9221C13.4081 20.518 13.6814 20.2541 14.069 20.2767C14.3819 20.2951 14.6211 20.5779 14.6219 20.938C14.6236 21.6692 14.6218 22.4004 14.6226 23.1316C14.6232 23.6966 14.6199 24.2618 14.6298 24.8266C14.6347 25.1055 14.7009 25.3753 14.8367 25.6226C15.0263 25.9677 15.3165 26.1848 15.695 26.2876C16.1939 26.423 16.6902 26.4164 17.1721 26.2263C17.6668 26.0313 17.9425 25.6461 18.035 25.132C18.07 24.9372 18.0803 24.7358 18.081 24.5373C18.0851 23.337 18.0826 22.1368 18.0833 20.9366C18.0835 20.602 18.2433 20.3715 18.5331 20.2944C18.6027 20.2759 18.6788 20.282 18.7618 20.2773Z" fill="#111827"></path></g></g><defs><clipPath id="clip0_206_4645"><rect width="32" height="32" rx="2" fill="white"></rect></clipPath></defs></svg></div></div></div><div class="absolute bottom-0 w-full h-8 bg-[#ECDC5A]"></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt-og-image/dist/runtime/nuxt/components/Templates/Community/UnJs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=UnJs-C2T8pG7u.mjs.map
