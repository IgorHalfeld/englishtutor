const empty = Object.freeze(
  Object.create(null, {
    __unenv__: { get: () => true }
  })
);

export { empty as default };
//# sourceMappingURL=empty.mjs.map
