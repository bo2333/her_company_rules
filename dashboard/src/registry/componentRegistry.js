const registry = new Map();

export function registerComponent(key, comp) {
  if (typeof comp !== "function" && typeof comp !== "object") {
    throw new Error(`[her_company_rules] 非法的组件: ${key}`);
  }
  registry.set(key, comp);
}

export function resolveComponent(key, React) {
  const C = registry.get(key);
  if (C) return C;
  return function Missing() {
    return React.createElement(
      "div",
      { className: "p-2 text-sm text-destructive" },
      `未注册组件: ${key}`
    );
  };
}