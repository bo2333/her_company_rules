import { useNavConfig } from "./hooks/useNavConfig";
import MainNavBar from "./components/MainNavBar";
import SettingsPanel from "./components/SettingsPanel";

export function App(props) {
  const SDK = window.__HERMES_PLUGIN_SDK__;
  const { React } = SDK;
  const { PluginSlot } = SDK.components;
  const { registry } = props;
  const { navConfig, uiConfig, activeNavId, setActiveNavId, setNavConfig, loading } =
    useNavConfig(SDK);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const texts = uiConfig.texts || {};

  if (loading) {
    return React.createElement(
      "div",
      { className: "company-rules-content__empty" },
      texts.loading || "加载中…"
    );
  }

  const activeNav =
    (navConfig.items || []).find((n) => n.id === activeNavId) || (navConfig.items || [])[0];

  return React.createElement(
    "div",
    { className: "company-rules-app" },

    React.createElement(MainNavBar, {
      items: navConfig.items || [],
      appearance: navConfig.appearance || {},
      uiConfig,
      activeNavId: activeNav?.id,
      onSelect: setActiveNavId,
      onOpenSettings: () => setSettingsOpen(true),
      SDK,
    }),

    React.createElement(
      "div",
      { className: "company-rules-subnavbar" },
      activeNav && PluginSlot
        ? React.createElement(PluginSlot, { name: `${activeNav.id}:subnavbar` })
        : null
    ),

    React.createElement(
      "div",
      { className: "company-rules-content" },
      activeNav && PluginSlot
        ? React.createElement(PluginSlot, { name: `${activeNav.id}:content` })
        : React.createElement(
            "div",
            { className: "company-rules-content__empty" },
            texts.emptyNav || "请先添加一个主导航"
          )
    ),

    settingsOpen &&
      React.createElement(SettingsPanel, {
        navConfig,
        uiConfig,
        registry,
        activeNavId: activeNav?.id,
        onClose: () => setSettingsOpen(false),
        onChange: setNavConfig,
        SDK,
      })
  );
}