import { createNavRegistry } from "./registry/navRegistry";
import { registerComponent } from "./registry/componentRegistry";
import { setUIConfigOverride } from "./config/loader";
import { App } from "./App";
import GeneralSettings from "./components/settings/GeneralSettings";
import AddNavItem from "./components/settings/AddNavItem";
import AdjustNavItems from "./components/settings/AdjustNavItems";
import DeleteNavItems from "./components/settings/DeleteNavItems";
import InstallPlugin from "./components/settings/InstallPlugin"; // 新增

(function () {
  "use strict";
  const SDK = window.__HERMES_PLUGIN_SDK__;
  if (!SDK?.React) {
    console.error("[company_rules] 未找到 Hermes Plugin SDK");
    return;
  }

  registerComponent("GeneralSettings", GeneralSettings);
  registerComponent("AddNavItem", AddNavItem);
  registerComponent("AdjustNavItems", AdjustNavItems);
  registerComponent("DeleteNavItems", DeleteNavItems);
  registerComponent("InstallPlugin", InstallPlugin); // 注册新组件

  const registry = createNavRegistry(window.__HERMES_PLUGINS__.registerSlot);

  window.CompanyRules = window.CompanyRules || {};
  window.CompanyRules.registerSubNav = registry.registerSubNav;
  window.CompanyRules.registerSettingsTab = (tabConfig, component) => {
    registerComponent(tabConfig.component, component);
    setUIConfigOverride({ settingsTabs: [tabConfig] });
  };
  window.CompanyRules.registerIcon = (name, icon) => {
    if (typeof icon === "function") {
      SDK.icons = SDK.icons || {};
      SDK.icons[name] = icon;
    } else {
      setUIConfigOverride({ icons: { [name]: icon } });
    }
  };

  window.__HERMES_PLUGINS__.register("company_rules", (props) =>
    App({ ...props, registry })
  );
})();