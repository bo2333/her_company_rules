const overrides = { settingsTabs: [], icons: {} };

const FALLBACK_CONSTANTS = {
  apiPrefix: "/api/plugins/company_rules",
  pluginName: "company_rules",
  events: { setActiveSubNav: "company-rules:setActiveSubNav" },
};

export function setUIConfigOverride(patch) {
  if (patch.settingsTabs) {
    overrides.settingsTabs = overrides.settingsTabs.concat(patch.settingsTabs);
  }
  if (patch.icons) {
    overrides.icons = { ...overrides.icons, ...patch.icons };
  }
}

function applyOverrides(base) {
  const merged = { ...base };
  if (overrides.settingsTabs.length) {
    merged.settingsTabs = [...(base.settingsTabs || []), ...overrides.settingsTabs];
  }
  if (Object.keys(overrides.icons).length) {
    merged.icons = { ...base.icons, ...overrides.icons };
  }
  return merged;
}

export async function loadConstants(SDK) {
  try {
    return await SDK.fetchJSON(`${FALLBACK_CONSTANTS.apiPrefix}/constants`);
  } catch (err) {
    console.warn("[company_rules] constants 加载失败，使用内置 fallback", err);
    return FALLBACK_CONSTANTS;
  }
}

export async function loadUIConfig(SDK, constants) {
  const prefix = (constants && constants.apiPrefix) || FALLBACK_CONSTANTS.apiPrefix;
  try {
    const base = await SDK.fetchJSON(`${prefix}/ui-config`);
    return applyOverrides(base);
  } catch (err) {
    console.warn("[company_rules] ui-config 加载失败", err);
    return applyOverrides({});
  }
}

export async function loadNavConfig(SDK, constants) {
  const prefix = (constants && constants.apiPrefix) || FALLBACK_CONSTANTS.apiPrefix;
  try {
    return await SDK.fetchJSON(`${prefix}/nav-config`);
  } catch (err) {
    console.warn("[company_rules] nav-config 加载失败", err);
    return { items: [], appearance: {} };
  }
}

export async function saveNavConfig(SDK, config, constants) {
  const prefix = (constants && constants.apiPrefix) || FALLBACK_CONSTANTS.apiPrefix;
  return SDK.fetchJSON(`${prefix}/nav-config`, {
    method: "PUT",
    body: JSON.stringify(config),
    headers: { "Content-Type": "application/json" },
  });
}