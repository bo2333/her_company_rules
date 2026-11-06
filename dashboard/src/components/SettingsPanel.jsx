import { resolveComponent } from "../registry/componentRegistry";

export default function SettingsPanel(props) {
  const { navConfig, uiConfig = {}, registry, activeNavId, onClose, onChange, SDK } = props;
  const { React } = SDK;
  const h = React.createElement;
  const texts = uiConfig.texts || {};
  const tabs = uiConfig.settingsTabs || [];
  const [tab, setTab] = React.useState(tabs[0]?.key);

  React.useEffect(() => {
    if (tabs.length && !tabs.some((t) => t.key === tab)) setTab(tabs[0].key);
  }, [tabs.length]);

  if (!tabs.length) {
    return h("div", { className: "company-rules-settings-body" }, "无可用设置 tab");
  }

  const activeTab = tabs.find((t) => t.key === tab) || tabs[0];
  const Body = resolveComponent(activeTab.component, React);

  return h(
    "div",
    { className: "company-rules-settings-overlay", onClick: onClose },
    h(
      "div",
      {
        className: "company-rules-settings-panel",
        onClick: (e) => e.stopPropagation(),
      },
      h(
        "div",
        { className: "company-rules-settings-header" },
        h("h2", { className: "company-rules-settings-title" }, texts.settingsTitle || "设置"),
        h(
          "button",
          {
            type: "button",
            className: "company-rules-settings-close",
            onClick: onClose,
            "aria-label": texts.closeButton || "关闭",
          },
          texts.closeButton || "✕"
        )
      ),
      h(
        "div",
        { className: "company-rules-settings-tabs" },
        tabs.map((t) =>
          h(
            "button",
            {
              type: "button",
              key: t.key,
              className: `company-rules-settings-tab ${
                tab === t.key ? "company-rules-settings-tab--active" : ""
              }`,
              onClick: () => setTab(t.key),
            },
            t.label
          )
        )
      ),
      h(
        "div",
        { className: "company-rules-settings-body" },
        h(Body, { navConfig, uiConfig, registry, activeNavId, onChange, onClose, SDK })
      )
    )
  );
}