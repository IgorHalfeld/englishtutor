import { version, ref, watchEffect, watch, getCurrentInstance, useSSRContext, unref, inject, defineComponent, mergeProps, computed, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, createApp, effectScope, reactive, hasInjectionContext, defineAsyncComponent, provide, onErrorCaptured, onServerPrefetch, resolveDynamicComponent, toRef, h, isReadonly, toValue, isRef, isShallow, isReactive, toRaw } from 'vue';
import { $ as $fetch$1, B as withQuery, L as hasProtocol, p as parseURL, M as isScriptProtocol, N as joinURL, h as createError$1, x as defu, O as sanitizeStatusCode, P as createHooks, Q as isEqual, t as toRouteMatcher, v as createRouter, y as withoutBase, w as withoutTrailingSlash, R as stringifyParsedURL, S as stringifyQuery, T as parseQuery, U as withLeadingSlash, V as withBase, F as withTrailingSlash } from '../runtime.mjs';
import { b as baseURL } from '../routes/renderer.mjs';
import { getActiveHead } from 'unhead';
import { defineHeadPlugin, composableNames, unpackMeta } from '@unhead/shared';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderSuspense, ssrRenderVNode, ssrRenderSlot } from 'vue/server-renderer';
import dayjs from 'dayjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';

function createContext$1(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als && currentInstance === void 0) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers$1.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers$1.delete(onLeave);
      }
    }
  };
}
function createNamespace$1(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext$1({ ...defaultOpts, ...opts });
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey$2 = "__unctx__";
const defaultNamespace = _globalThis$1[globalKey$2] || (_globalThis$1[globalKey$2] = createNamespace$1());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey$1 = "__unctx_async_handlers__";
const asyncHandlers$1 = _globalThis$1[asyncHandlersKey$1] || (_globalThis$1[asyncHandlersKey$1] = /* @__PURE__ */ new Set());

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
const nuxtAppCtx = /* @__PURE__ */ getContext("nuxt-app", {
  asyncContext: false
});
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.11.2";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: reactive({
      data: {},
      state: {},
      once: /* @__PURE__ */ new Set(),
      _errors: {},
      ...{ serverRendered: true }
    }),
    static: {
      data: {}
    },
    runWithContext: (fn) => nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn)),
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    _payloadRevivers: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
      nuxtApp.ssrContext._payloadReducers = {};
      nuxtApp.payload.path = nuxtApp.ssrContext.url;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin) {
  if (plugin.hooks) {
    nuxtApp.hooks.addHooks(plugin.hooks);
  }
  if (typeof plugin === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  var _a, _b;
  const resolvedPlugins = [];
  const unresolvedPlugins = [];
  const parallels = [];
  const errors = [];
  let promiseDepth = 0;
  async function executePlugin(plugin) {
    var _a2;
    const unresolvedPluginsForThisPlugin = ((_a2 = plugin.dependsOn) == null ? void 0 : _a2.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.includes(name))) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin).then(async () => {
        if (plugin._name) {
          resolvedPlugins.push(plugin._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin._name)) {
              dependsOn.delete(plugin._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      });
      if (plugin.parallel) {
        parallels.push(promise.catch((e) => errors.push(e)));
      } else {
        await promise;
      }
    }
  }
  for (const plugin of plugins2) {
    if (((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext) && ((_b = plugin.env) == null ? void 0 : _b.islands) === false) {
      continue;
    }
    await executePlugin(plugin);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin) {
  if (typeof plugin === "function") {
    return plugin;
  }
  const _name = plugin._name || plugin.name;
  delete plugin.name;
  return Object.assign(plugin.setup || (() => {
  }), plugin, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
// @__NO_SIDE_EFFECTS__
function tryUseNuxtApp() {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance = nuxtAppInstance || nuxtAppCtx.tryUse();
  return nuxtAppInstance || null;
}
// @__NO_SIDE_EFFECTS__
function useNuxtApp() {
  const nuxtAppInstance = /* @__PURE__ */ tryUseNuxtApp();
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return (/* @__PURE__ */ useNuxtApp()).$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = /* @__PURE__ */ useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, (/* @__PURE__ */ useNuxtApp())._route);
  }
  return (/* @__PURE__ */ useNuxtApp())._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if ((/* @__PURE__ */ useNuxtApp())._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : withQuery(to.path || "/", to.query || {}) + (to.hash || "");
  const isExternal = (options == null ? void 0 : options.external) || hasProtocol(toPath, { acceptRelative: true });
  if (isExternal) {
    if (!(options == null ? void 0 : options.external)) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const protocol = parseURL(toPath).protocol;
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(/"/g, "%22");
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: location2 }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options == null ? void 0 : options.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef((/* @__PURE__ */ useNuxtApp()).payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const error2 = useError();
    if (false)
      ;
    error2.value = error2.value || nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
version.startsWith("3");
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref2, lastKey = "") {
  if (ref2 instanceof Promise)
    return ref2;
  const root = resolveUnref(ref2);
  if (!ref2 || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r) => resolveUnrefHeadInput(r, lastKey));
  if (typeof root === "object") {
    return Object.fromEntries(
      Object.entries(root).map(([k, v]) => {
        if (k === "titleTemplate" || k.startsWith("on"))
          return [k, unref(v)];
        return [k, resolveUnrefHeadInput(v, k)];
      })
    );
  }
  return root;
}
defineHeadPlugin({
  hooks: {
    "entries:resolve": function(ctx) {
      for (const entry2 of ctx.entries)
        entry2.resolvedInput = resolveUnrefHeadInput(entry2.input);
    }
  }
});
const headSymbol = "usehead";
const _global = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey$1 = "__unhead_injection_handler__";
function setHeadInjectionHandler(handler) {
  _global[globalKey$1] = handler;
}
function injectHead() {
  if (globalKey$1 in _global) {
    return _global[globalKey$1]();
  }
  const head = inject(headSymbol);
  if (!head && "production" !== "production")
    console.warn("Unhead is missing Vue context, falling back to shared context. This may have unexpected results.");
  return head || getActiveHead();
}
function useHead(input, options = {}) {
  const head = options.head || injectHead();
  if (head) {
    if (!head.ssr)
      return clientUseHead(head, input, options);
    return head.push(input, options);
  }
}
function clientUseHead(head, input, options = {}) {
  const deactivated = ref(false);
  const resolvedInput = ref({});
  watchEffect(() => {
    resolvedInput.value = deactivated.value ? {} : resolveUnrefHeadInput(input);
  });
  const entry2 = head.push(resolvedInput.value, options);
  watch(resolvedInput, (e) => {
    entry2.patch(e);
  });
  getCurrentInstance();
  return entry2;
}
const coreComposableNames = [
  "injectHead"
];
({
  "@unhead/vue": [...coreComposableNames, ...composableNames]
});
function useSeoMeta(input, options) {
  const { title, titleTemplate, ...meta } = input;
  return useHead({
    title,
    titleTemplate,
    // @ts-expect-error runtime type
    _flatMeta: meta
  }, {
    ...options,
    transform(t) {
      const meta2 = unpackMeta({ ...t._flatMeta });
      delete t._flatMeta;
      return {
        // @ts-expect-error runtime type
        ...t,
        meta: meta2
      };
    }
  });
}
function useServerHead(input, options = {}) {
  const head = options.head || injectHead();
  delete options.head;
  if (head)
    return head.push(input, { ...options, mode: "server" });
}
const unhead_KgADcZ0jPj = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    setHeadInjectionHandler(
      // need a fresh instance of the nuxt app to avoid parallel requests interfering with each other
      () => (/* @__PURE__ */ useNuxtApp()).vueApp._context.provides.usehead
    );
    nuxtApp.vueApp.use(head);
  }
});
async function getRouteRules(url) {
  {
    const _routeRulesMatcher = toRouteMatcher(
      createRouter({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(url).reverse());
  }
}
function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als && currentInstance === void 0) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
_globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  manifest_45route_45rule
];
function getRouteFromPath(fullPath) {
  if (typeof fullPath === "object") {
    fullPath = stringifyParsedURL({
      pathname: fullPath.path || "",
      search: stringifyQuery(fullPath.query || {}),
      hash: fullPath.hash || ""
    });
  }
  const url = parseURL(fullPath.toString());
  return {
    path: url.pathname,
    fullPath,
    query: parseQuery(url.search),
    hash: url.hash,
    // stub properties for compat with vue-router
    params: {},
    name: void 0,
    matched: [],
    redirectedFrom: void 0,
    meta: {},
    href: fullPath
  };
}
const router_CaKIoANnI2 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  setup(nuxtApp) {
    const initialURL = nuxtApp.ssrContext.url;
    const routes = [];
    const hooks = {
      "navigate:before": [],
      "resolve:before": [],
      "navigate:after": [],
      error: []
    };
    const registerHook = (hook, guard) => {
      hooks[hook].push(guard);
      return () => hooks[hook].splice(hooks[hook].indexOf(guard), 1);
    };
    (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const route = reactive(getRouteFromPath(initialURL));
    async function handleNavigation(url, replace) {
      try {
        const to = getRouteFromPath(url);
        for (const middleware of hooks["navigate:before"]) {
          const result = await middleware(to, route);
          if (result === false || result instanceof Error) {
            return;
          }
          if (typeof result === "string" && result.length) {
            return handleNavigation(result, true);
          }
        }
        for (const handler of hooks["resolve:before"]) {
          await handler(to, route);
        }
        Object.assign(route, to);
        if (false)
          ;
        for (const middleware of hooks["navigate:after"]) {
          await middleware(to, route);
        }
      } catch (err) {
        for (const handler of hooks.error) {
          await handler(err);
        }
      }
    }
    const currentRoute = computed(() => route);
    const router = {
      currentRoute,
      isReady: () => Promise.resolve(),
      // These options provide a similar API to vue-router but have no effect
      options: {},
      install: () => Promise.resolve(),
      // Navigation
      push: (url) => handleNavigation(url),
      replace: (url) => handleNavigation(url),
      back: () => (void 0).history.go(-1),
      go: (delta) => (void 0).history.go(delta),
      forward: () => (void 0).history.go(1),
      // Guards
      beforeResolve: (guard) => registerHook("resolve:before", guard),
      beforeEach: (guard) => registerHook("navigate:before", guard),
      afterEach: (guard) => registerHook("navigate:after", guard),
      onError: (handler) => registerHook("error", handler),
      // Routes
      resolve: getRouteFromPath,
      addRoute: (parentName, route2) => {
        routes.push(route2);
      },
      getRoutes: () => routes,
      hasRoute: (name) => routes.some((route2) => route2.name === name),
      removeRoute: (name) => {
        const index = routes.findIndex((route2) => route2.name === name);
        if (index !== -1) {
          routes.splice(index, 1);
        }
      }
    };
    nuxtApp.vueApp.component("RouterLink", defineComponent({
      functional: true,
      props: {
        to: {
          type: String,
          required: true
        },
        custom: Boolean,
        replace: Boolean,
        // Not implemented
        activeClass: String,
        exactActiveClass: String,
        ariaCurrentValue: String
      },
      setup: (props, { slots }) => {
        const navigate = () => handleNavigation(props.to, props.replace);
        return () => {
          var _a;
          const route2 = router.resolve(props.to);
          return props.custom ? (_a = slots.default) == null ? void 0 : _a.call(slots, { href: props.to, navigate, route: route2 }) : h("a", { href: props.to, onClick: (e) => {
            e.preventDefault();
            return navigate();
          } }, slots);
        };
      }
    }));
    nuxtApp._route = route;
    nuxtApp._middleware = nuxtApp._middleware || {
      global: [],
      named: {}
    };
    const initialLayout = nuxtApp.payload.state._layout;
    nuxtApp.hooks.hookOnce("app:created", async () => {
      router.beforeEach(async (to, from) => {
        var _a;
        to.meta = reactive(to.meta || {});
        if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
          to.meta.layout = initialLayout;
        }
        nuxtApp._processingMiddleware = true;
        if (!((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext)) {
          const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
          {
            const routeRules = await nuxtApp.runWithContext(() => getRouteRules(to.path));
            if (routeRules.appMiddleware) {
              for (const key in routeRules.appMiddleware) {
                const guard = nuxtApp._middleware.named[key];
                if (!guard) {
                  return;
                }
                if (routeRules.appMiddleware[key]) {
                  middlewareEntries.add(guard);
                } else {
                  middlewareEntries.delete(guard);
                }
              }
            }
          }
          for (const middleware of middlewareEntries) {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            {
              if (result === false || result instanceof Error) {
                const error = result || createError$1({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`,
                  data: {
                    path: initialURL
                  }
                });
                delete nuxtApp._processingMiddleware;
                return nuxtApp.runWithContext(() => showError(error));
              }
            }
            if (result === true) {
              continue;
            }
            if (result || result === false) {
              return result;
            }
          }
        }
      });
      router.afterEach(() => {
        delete nuxtApp._processingMiddleware;
      });
      await router.replace(initialURL);
      if (!isEqual(route.fullPath, initialURL)) {
        await nuxtApp.runWithContext(() => navigateTo(route.fullPath));
      }
    });
    return {
      provide: {
        route,
        router
      }
    };
  }
});
function useRequestEvent(nuxtApp = /* @__PURE__ */ useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const _0_siteConfig_7pzUtwM1Zj = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-site-config:init",
  enforce: "pre",
  async setup(nuxtApp) {
    const state = useState("site-config");
    {
      const { context } = useRequestEvent();
      nuxtApp.hooks.hook("app:rendered", () => {
        state.value = context.siteConfig.get({
          debug: (/* @__PURE__ */ useRuntimeConfig())["nuxt-site-config"].debug,
          resolveRefs: true
        });
      });
    }
    let stack = {};
    return {
      provide: {
        nuxtSiteConfig: stack
      }
    };
  }
});
function definePayloadReducer(name, reduce) {
  {
    (/* @__PURE__ */ useNuxtApp()).ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = {
  NuxtError: (data) => isNuxtError(data) && data.toJSON(),
  EmptyShallowRef: (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  EmptyRef: (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  ShallowRef: (data) => isRef(data) && isShallow(data) && data.value,
  ShallowReactive: (data) => isReactive(data) && isShallow(data) && toRaw(data),
  Ref: (data) => isRef(data) && data.value,
  Reactive: (data) => isReactive(data) && toRaw(data)
};
{
  reducers.Island = (data) => data && (data == null ? void 0 : data.__nuxt_island);
}
const revive_payload_server_eJ33V7gbc6 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const reducer in reducers) {
      definePayloadReducer(reducer, reducers[reducer]);
    }
  }
});
const components_plugin_KR1HBZs4kY = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
function useNitroOrigin(e) {
  {
    e = e || useRequestEvent();
    return e.context.siteConfigNitroOrigin;
  }
}
function useSiteConfig(options) {
  let stack;
  stack = useRequestEvent().context.siteConfig.get(defu({ resolveRefs: true }, options));
  return stack || {};
}
function resolveSitePath(pathOrUrl, options) {
  let path = pathOrUrl;
  if (hasProtocol(pathOrUrl, { strict: false, acceptRelative: true })) {
    const parsed = parseURL(pathOrUrl);
    path = parsed.pathname;
  }
  const base = withLeadingSlash(options.base || "/");
  if (base !== "/" && path.startsWith(base)) {
    path = path.slice(base.length);
  }
  const origin = options.absolute ? options.siteUrl : "";
  const baseWithOrigin = options.withBase ? withBase(base, origin || "/") : origin;
  const resolvedUrl = withBase(path, baseWithOrigin);
  return path === "/" && !options.withBase ? withTrailingSlash(resolvedUrl) : fixSlashes(options.trailingSlash, resolvedUrl);
}
function fixSlashes(trailingSlash, pathOrUrl) {
  const $url = parseURL(pathOrUrl);
  const isFileUrl = $url.pathname.includes(".");
  if (isFileUrl)
    return pathOrUrl;
  const fixedPath = trailingSlash ? withTrailingSlash($url.pathname) : withoutTrailingSlash($url.pathname);
  return `${$url.protocol ? `${$url.protocol}//` : ""}${$url.host || ""}${fixedPath}${$url.search || ""}${$url.hash || ""}`;
}
function withSiteUrl(path, options = {}) {
  const siteConfig = useSiteConfig();
  const nitroOrigin = useNitroOrigin();
  const base = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL || "/";
  return computed(() => {
    return resolveSitePath(unref(path), {
      absolute: true,
      siteUrl: unref(options.canonical) !== false || false ? siteConfig.url : nitroOrigin,
      trailingSlash: siteConfig.trailingSlash,
      base,
      withBase: unref(options.withBase)
    });
  });
}
function isInternalRoute(path) {
  return path.startsWith("/_") || path.startsWith("@");
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
function withoutQuery$1(path) {
  return path.split("?")[0];
}
function getExtension(path) {
  path = withoutQuery$1(path);
  const lastSegment = path.split("/").pop() || path;
  return lastSegment.split(".").pop() || lastSegment;
}
const og_image_canonical_urls_server_3MRa0uZwqs = /* @__PURE__ */ defineNuxtPlugin({
  setup(nuxtApp) {
    nuxtApp.hooks.hook("app:rendered", async (ctx) => {
      const { ssrContext } = ctx;
      const e = useRequestEvent();
      const path = parseURL(e.path).pathname;
      if (isInternalRoute(path))
        return;
      ssrContext == null ? void 0 : ssrContext.head.use({
        key: "nuxt-og-image:overrides-and-canonical-urls",
        hooks: {
          "tags:resolve": async (ctx2) => {
            const hasPrimaryPayload = ctx2.tags.some((tag) => tag.tag === "script" && tag.props.id === "nuxt-og-image-options");
            let overrides;
            for (const tag of ctx2.tags) {
              if (tag.tag === "script" && tag.props.id === "nuxt-og-image-overrides") {
                if (hasPrimaryPayload) {
                  overrides = separateProps(JSON.parse(tag.innerHTML || "{}"));
                  delete ctx2.tags[ctx2.tags.indexOf(tag)];
                } else {
                  tag.props.id = "nuxt-og-image-options";
                  tag.innerHTML = JSON.stringify(separateProps(JSON.parse(tag.innerHTML || "{}")));
                  tag._d = "script:id:nuxt-og-image-options";
                }
                break;
              }
            }
            ctx2.tags = ctx2.tags.filter(Boolean);
            for (const tag of ctx2.tags) {
              if (tag.tag === "meta" && (tag.props.property === "og:image" || ["twitter:image:src", "twitter:image"].includes(tag.props.name))) {
                if (!tag.props.content.startsWith("https")) {
                  await nuxtApp.runWithContext(() => {
                    tag.props.content = toValue(withSiteUrl(tag.props.content, {
                      withBase: true
                    }));
                  });
                }
              } else if (overrides && tag.tag === "script" && tag.props.id === "nuxt-og-image-options") {
                tag.innerHTML = JSON.stringify(defu(overrides, JSON.parse(tag.innerHTML)));
              }
            }
          }
        }
      });
    });
  }
});
function getOgImagePath(pagePath, _options) {
  const baseURL2 = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
  const options = defu(_options, useOgImageRuntimeConfig().defaults);
  return joinURL("/", baseURL2, "__og-image__/image", pagePath, `og.${options.extension}`);
}
function useOgImageRuntimeConfig() {
  return (/* @__PURE__ */ useRuntimeConfig())["nuxt-og-image"];
}
const componentNames = [{ "hash": "i0Vxmj8bqg", "pascalName": "BrandedLogo", "kebabName": "branded-logo", "category": "community", "credits": "Full Stack Heroes <https://fullstackheroes.com/>" }, { "hash": "tBHg51xiAt", "pascalName": "Frame", "kebabName": "frame", "category": "community", "credits": "@arashsheyda <https://github.com/arashsheyda>" }, { "hash": "EtP6PjHVxf", "pascalName": "Nuxt", "kebabName": "nuxt", "category": "community", "credits": "NuxtLabs <https://nuxtlabs.com/>" }, { "hash": "LZkuSUuPEa", "pascalName": "NuxtSeo", "kebabName": "nuxt-seo", "category": "community", "credits": "Nuxt SEO <https://nuxtseo.com/>" }, { "hash": "KfQI8hATPp", "pascalName": "Pergel", "kebabName": "pergel", "category": "community", "credits": "Pergel <https://nuxtlabs.com/>" }, { "hash": "YDrRRvPRVl", "pascalName": "SimpleBlog", "kebabName": "simple-blog", "category": "community", "credits": "Full Stack Heroes <https://fullstackheroes.com/>" }, { "hash": "wt558K6QyQ", "pascalName": "UnJs", "kebabName": "un-js", "category": "community", "credits": "UnJS <https://unjs.io/>" }, { "hash": "6RdQZcuwZZ", "pascalName": "Wave", "kebabName": "wave", "category": "community", "credits": "Full Stack Heroes <https://fullstackheroes.com/>" }, { "hash": "gaB1TrbtTl", "pascalName": "WithEmoji", "kebabName": "with-emoji", "category": "community", "credits": "Full Stack Heroes <https://fullstackheroes.com/>" }];
function createOgImageMeta(src, input, resolvedOptions, ssrContext) {
  const _input = separateProps(defu(input, ssrContext._ogImagePayload));
  let url = src || input.url || resolvedOptions.url;
  if (!url)
    return;
  if (input._query && Object.keys(input._query).length && url)
    url = withQuery(url, { _query: input._query });
  let urlExtension = getExtension(url) || resolvedOptions.extension;
  if (urlExtension === "jpg")
    urlExtension = "jpeg";
  const meta = [
    { property: "og:image", content: url },
    { property: "og:image:type", content: `image/${urlExtension}` },
    { name: "twitter:card", content: "summary_large_image" },
    // we don't need this but avoids issue when using useSeoMeta({ twitterImage })
    { name: "twitter:image", content: url },
    { name: "twitter:image:src", content: url }
  ];
  if (resolvedOptions.width) {
    meta.push({ property: "og:image:width", content: resolvedOptions.width });
    meta.push({ name: "twitter:image:width", content: resolvedOptions.width });
  }
  if (resolvedOptions.height) {
    meta.push({ property: "og:image:height", content: resolvedOptions.height });
    meta.push({ name: "twitter:image:height", content: resolvedOptions.height });
  }
  if (resolvedOptions.alt) {
    meta.push({ property: "og:image:alt", content: resolvedOptions.alt });
    meta.push({ name: "twitter:image:alt", content: resolvedOptions.alt });
  }
  ssrContext._ogImageInstances = ssrContext._ogImageInstances || [];
  const script = [];
  if (src) {
    script.push({
      id: "nuxt-og-image-options",
      type: "application/json",
      processTemplateParams: true,
      innerHTML: () => {
        if (!_input.props.title)
          _input.props.title = "%s";
        delete _input.url;
        return _input;
      },
      // we want this to be last in our head
      tagPosition: "bodyClose"
    });
  }
  const instance = useServerHead({
    script,
    meta
  }, {
    tagPriority: 35
  });
  ssrContext._ogImagePayload = _input;
  ssrContext._ogImageInstances.push(instance);
}
function normaliseOptions(_options) {
  const options = { ...unref(_options) };
  if (!options)
    return options;
  if (options.component && componentNames) {
    const originalName = options.component;
    for (const component of componentNames) {
      if (component.pascalName.endsWith(originalName) || component.kebabName.endsWith(originalName)) {
        options.component = component.pascalName;
        break;
      }
    }
  }
  return options;
}
const route_rule_og_image_server_OQYH1Ux5Eu = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hook("app:rendered", async (ctx) => {
    var _a, _b, _c, _d, _e, _f;
    const { ssrContext } = ctx;
    const e = useRequestEvent();
    const path = parseURL(e.path).pathname;
    if (isInternalRoute(path))
      return;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter({ routes: (_b = (_a = ssrContext == null ? void 0 : ssrContext.runtimeConfig) == null ? void 0 : _a.nitro) == null ? void 0 : _b.routeRules })
    );
    let routeRules = defu({}, ..._routeRulesMatcher.matchAll(
      withoutBase(path.split("?")[0], (_c = ssrContext == null ? void 0 : ssrContext.runtimeConfig) == null ? void 0 : _c.app.baseURL)
    ).reverse()).ogImage;
    if (typeof routeRules === "undefined")
      return;
    const ogImageInstances = nuxtApp.ssrContext._ogImageInstances || [];
    if (routeRules === false) {
      ogImageInstances == null ? void 0 : ogImageInstances.forEach((e2) => {
        e2.dispose();
      });
      nuxtApp.ssrContext._ogImagePayload = void 0;
      nuxtApp.ssrContext._ogImageInstances = void 0;
      return;
    }
    routeRules = defu((_f = (_e = (_d = nuxtApp.ssrContext) == null ? void 0 : _d.event.context._nitro) == null ? void 0 : _e.routeRules) == null ? void 0 : _f.ogImage, routeRules);
    const { defaults } = useOgImageRuntimeConfig();
    const resolvedOptions = normaliseOptions(defu(routeRules, defaults));
    const src = getOgImagePath(ssrContext.url, resolvedOptions);
    createOgImageMeta(src, routeRules, resolvedOptions, nuxtApp.ssrContext);
  });
});
const plugins = [
  unhead_KgADcZ0jPj,
  router_CaKIoANnI2,
  _0_siteConfig_7pzUtwM1Zj,
  revive_payload_server_eJ33V7gbc6,
  components_plugin_KR1HBZs4kY,
  og_image_canonical_urls_server_3MRa0uZwqs,
  route_rule_og_image_server_OQYH1Ux5Eu
];
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$8 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full h-full flex flex-col" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "header", { class: "flex-1" }, null, _push, _parent);
  _push(`<div class="bg-gray-50 w-full h-max flex-1"><div class="w-full h-full p-5 mx-auto max-w-screen-xl">`);
  ssrRenderSlot(_ctx.$slots, "content", {}, null, _push, _parent);
  _push(`</div></div></div>`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MainContent.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$7 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-5 font-bold flex justify-center items-center" }, _attrs))}>🍕English tutor</div>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$6 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-4" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</section>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ChatGroup.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ChatAssistant",
  __ssrInlineRender: true,
  props: {
    time: {},
    message: {},
    loading: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "chat chat-start" }, _attrs))}><div class="chat-image avatar"><div class="w-10 rounded-full text-4xl">🧠</div></div><div class="chat-header"> English Tutor <time class="text-xs opacity-50">${ssrInterpolate(unref(dayjs)(props.time).format("hh:mm a"))}</time></div>`);
      if (!_ctx.loading) {
        _push(`<div class="chat-bubble">${ssrInterpolate(props.message)}</div>`);
      } else {
        _push(`<div class="chat-bubble"><span class="animate-pulse">Thinking...</span></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ChatAssistant.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "ChatStudent",
  __ssrInlineRender: true,
  props: {
    time: {},
    message: {},
    loading: { type: Boolean },
    correction: {}
  },
  setup(__props) {
    const props = __props;
    const hasCorrection = computed(() => props.correction && props.correction !== "");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "chat chat-end" }, _attrs))}><div class="chat-image avatar"><div class="w-10 rounded-full text-4xl">🤓</div></div><div class="chat-header"> You <time class="text-xs opacity-50">${ssrInterpolate(unref(dayjs)(props.time).format("hh:mm a"))}</time></div>`);
      if (!_ctx.loading) {
        _push(`<div class="chat-bubble">${ssrInterpolate(props.message)}</div>`);
      } else {
        _push(`<div class="chat-bubble"><span class="animate-pulse">Thinking...</span></div>`);
      }
      if (unref(hasCorrection)) {
        _push(`<div class="chat-footer opacity-50 text-right max-w-lg"> Correction: ${ssrInterpolate(props.correction)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ChatStudent.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Toolbar",
  __ssrInlineRender: true,
  props: {
    speaking: { type: Boolean, default: false }
  },
  emits: ["start-speak", "stop-speak"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const label = computed(() => {
      return props.speaking ? "🔇 Stop" : "🎤 Speak";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed flex justify-center items-center bottom-0 left-0 w-full p-5" }, _attrs))}><button class="${ssrRenderClass([{
        "animate-pulse bg-red-100": props.speaking
      }, "rounded-full text-xl font-bold flex justify-center items-center bg-gray-100 p-5"])}">${ssrInterpolate(unref(label))}</button></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Toolbar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
function useServices() {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const corrections = async (wav) => {
    const response = await $fetch(`${config.public.workerUrl}/api/corrections`, {
      method: "POST",
      body: wav
    });
    return response;
  };
  const completions = async (messages) => {
    const response = await $fetch(`${config.public.workerUrl}/api/completions`, {
      method: "POST",
      body: { messages }
    });
    return response;
  };
  return {
    corrections,
    completions
  };
}
var MessageRole = /* @__PURE__ */ ((MessageRole2) => {
  MessageRole2["User"] = "user";
  MessageRole2["Assistant"] = "assistant";
  return MessageRole2;
})(MessageRole || {});
const randomId = () => {
  return Math.random().toString(36).slice(2, 9);
};
function useMessage() {
  const messages = ref([
    {
      id: randomId(),
      role: MessageRole.Assistant,
      text: "Tell me something in English, and I'll help with your vocabulary",
      createdAt: /* @__PURE__ */ new Date(),
      loading: false
    }
  ]);
  const transformToAiMessages = () => {
    const messagesWithoutGreetings = messages.value.slice(1);
    const messagesCompleted = messagesWithoutGreetings.filter((message) => !message.loading);
    const aiMessages = messagesCompleted.map((message) => {
      return {
        role: message.role,
        content: message.text
      };
    });
    return aiMessages;
  };
  const createNewUserMessage = () => {
    const id = randomId();
    messages.value.push({
      id,
      role: MessageRole.User,
      text: "",
      createdAt: /* @__PURE__ */ new Date(),
      loading: true
    });
    return id;
  };
  const createNewAssistantMessage = () => {
    const id = randomId();
    messages.value.push({
      id,
      role: MessageRole.Assistant,
      text: "",
      createdAt: /* @__PURE__ */ new Date(),
      loading: true
    });
    return id;
  };
  const replaceMessageTextAndLoading = ({ id, text, correction }) => {
    messages.value = messages.value.map((message) => {
      if (message.id === id) {
        const withText = { ...message, loading: false, text, correction };
        return withText;
      }
      return message;
    });
  };
  return {
    messages,
    transformToAiMessages,
    createNewUserMessage,
    createNewAssistantMessage,
    replaceMessageTextAndLoading
  };
}
function useAudioRecorder() {
  const audioChunks = ref([]);
  const audioWav = ref();
  const speaking = ref(false);
  const mediaRecorder = ref();
  const record = async () => {
    speaking.value = true;
    const stream = await (void 0).mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream);
    mediaRecorder.value.start(1);
    mediaRecorder.value.addEventListener("dataavailable", (event) => {
      audioChunks.value.push(event.data);
    });
  };
  const stop = () => {
    var _a;
    (_a = mediaRecorder.value) == null ? void 0 : _a.stop();
    speaking.value = false;
  };
  const transformToWav = () => {
    const blob = new Blob(audioChunks.value, {
      type: "audio/wav"
    });
    audioWav.value = blob;
  };
  return {
    audioChunks,
    speaking,
    audioWav,
    mediaRecorder,
    transformToWav,
    record,
    stop
  };
}
function withoutQuery(path) {
  return path.split("?")[0];
}
function createNitroRouteRuleMatcher() {
  const { nitro, app } = /* @__PURE__ */ useRuntimeConfig();
  const _routeRulesMatcher = toRouteMatcher(
    createRouter({
      routes: Object.fromEntries(
        Object.entries((nitro == null ? void 0 : nitro.routeRules) || {}).map(([path, rules]) => [withoutTrailingSlash(path), rules])
      )
    })
  );
  return (path) => {
    return defu({}, ..._routeRulesMatcher.matchAll(
      // radix3 does not support trailing slashes
      withoutBase(withoutTrailingSlash(withoutQuery(path)), app.baseURL)
    ).reverse());
  };
}
function defineOgImage(_options = {}) {
  var _a, _b, _c;
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  const ogImageInstances = nuxtApp.ssrContext._ogImageInstances || [];
  const route = useRoute();
  const basePath = route.path || "/";
  const routeRuleMatcher = createNitroRouteRuleMatcher();
  const routeRules = routeRuleMatcher(basePath).ogImage;
  if (!_options || ((_c = (_b = (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event.context._nitro) == null ? void 0 : _b.routeRules) == null ? void 0 : _c.ogImage) === false || typeof routeRules !== "undefined" && routeRules === false) {
    ogImageInstances.forEach((e) => {
      e.dispose();
    });
    nuxtApp.ssrContext._ogImageInstances = void 0;
    return;
  }
  const options = normaliseOptions({
    ..._options
  });
  if (route.query)
    options._query = route.query;
  const { defaults } = useOgImageRuntimeConfig();
  const resolvedOptions = normaliseOptions(defu(separateProps(_options), separateProps(routeRules), defaults));
  if (_options.url) {
    createOgImageMeta(null, options, resolvedOptions, nuxtApp.ssrContext);
  } else {
    const path = getOgImagePath(basePath, resolvedOptions);
    createOgImageMeta(path, options, resolvedOptions, nuxtApp.ssrContext);
  }
}
function defineOgImageComponent(component, props = {}, options = {}) {
  return defineOgImage({
    ...options,
    component,
    props
  });
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const { corrections, completions } = useServices();
    const {
      messages,
      transformToAiMessages,
      createNewUserMessage,
      createNewAssistantMessage,
      replaceMessageTextAndLoading
    } = useMessage();
    const { audioWav, speaking, record, stop, transformToWav } = useAudioRecorder();
    const handleStartSpeak = () => {
      record();
    };
    const handleStopSpeak = async () => {
      stop();
      transformToWav();
      const userMessageId = createNewUserMessage();
      const { transcript, correction } = await corrections(audioWav.value);
      replaceMessageTextAndLoading({
        id: userMessageId,
        text: transcript,
        correction
      });
      const assistnatMessageId = createNewAssistantMessage();
      const currentMessages = transformToAiMessages();
      const response = await completions(currentMessages);
      replaceMessageTextAndLoading({
        id: assistnatMessageId,
        text: response.answer
      });
    };
    useHead({
      title: "English tutor 🍕"
    });
    useSeoMeta({
      title: "English tutor 🍕",
      ogTitle: "English tutor 🍕",
      description: "Speak and receive instant feedback about your vocabulary",
      ogDescription: "Speak and receive instant feedback about your vocabulary"
    });
    defineOgImageComponent("Pergel", {
      headline: true,
      title: "English tutor 🍕",
      description: "Speak and receive instant feedback about your vocabulary"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_MainContent = __nuxt_component_0;
      const _component_Header = __nuxt_component_1;
      const _component_ChatGroup = __nuxt_component_2;
      const _component_ChatAssistant = _sfc_main$5;
      const _component_ChatStudent = _sfc_main$4;
      const _component_Toolbar = _sfc_main$3;
      _push(ssrRenderComponent(_component_MainContent, _attrs, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Header, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Header)
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_ChatGroup, { class: "pb-20" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(unref(messages), (message) => {
                    _push3(`<!--[-->`);
                    if (message.role === unref(MessageRole).Assistant) {
                      _push3(ssrRenderComponent(_component_ChatAssistant, {
                        key: message.id,
                        message: message.text,
                        time: message.createdAt,
                        loading: message.loading
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    if (message.role === unref(MessageRole).User) {
                      _push3(ssrRenderComponent(_component_ChatStudent, {
                        key: message.id,
                        message: message.text,
                        correction: message.correction,
                        time: message.createdAt,
                        loading: message.loading
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<!--]-->`);
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(messages), (message) => {
                      return openBlock(), createBlock(Fragment, null, [
                        message.role === unref(MessageRole).Assistant ? (openBlock(), createBlock(_component_ChatAssistant, {
                          key: message.id,
                          message: message.text,
                          time: message.createdAt,
                          loading: message.loading
                        }, null, 8, ["message", "time", "loading"])) : createCommentVNode("", true),
                        message.role === unref(MessageRole).User ? (openBlock(), createBlock(_component_ChatStudent, {
                          key: message.id,
                          message: message.text,
                          correction: message.correction,
                          time: message.createdAt,
                          loading: message.loading
                        }, null, 8, ["message", "correction", "time", "loading"])) : createCommentVNode("", true)
                      ], 64);
                    }), 256))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Toolbar, {
              speaking: unref(speaking),
              onStartSpeak: handleStartSpeak,
              onStopSpeak: handleStopSpeak
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_ChatGroup, { class: "pb-20" }, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(messages), (message) => {
                    return openBlock(), createBlock(Fragment, null, [
                      message.role === unref(MessageRole).Assistant ? (openBlock(), createBlock(_component_ChatAssistant, {
                        key: message.id,
                        message: message.text,
                        time: message.createdAt,
                        loading: message.loading
                      }, null, 8, ["message", "time", "loading"])) : createCommentVNode("", true),
                      message.role === unref(MessageRole).User ? (openBlock(), createBlock(_component_ChatStudent, {
                        key: message.id,
                        message: message.text,
                        correction: message.correction,
                        time: message.createdAt,
                        loading: message.loading
                      }, null, 8, ["message", "correction", "time", "loading"])) : createCommentVNode("", true)
                    ], 64);
                  }), 256))
                ]),
                _: 1
              }),
              createVNode(_component_Toolbar, {
                speaking: unref(speaking),
                onStartSpeak: handleStartSpeak,
                onStopSpeak: handleStopSpeak
              }, null, 8, ["speaking"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-D-EfYE-5.mjs').then((r) => r.default || r));
    const _Error = defineAsyncComponent(() => import('./error-500-A8LWEJtJ.mjs').then((r) => r.default || r));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ErrorComponent = _sfc_main$1;
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = defineAsyncComponent(() => import('./island-renderer-VWY9JTAX.mjs').then((r) => r.default || r));
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RootComponent = _sfc_main;
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(RootComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error = nuxt.payload.error || createError(error);
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { _export_sfc as _, useRuntimeConfig as a, useHead as b, createError as c, useOgImageRuntimeConfig as d, entry$1 as default, useSiteConfig as e, navigateTo as n, useRouter as u };
//# sourceMappingURL=server.mjs.map
