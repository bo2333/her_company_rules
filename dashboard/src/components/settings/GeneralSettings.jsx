export default function GeneralSettings({ navConfig, uiConfig, onChange, SDK }) {
  const { React } = SDK;
  const h = React.createElement;
  const texts = uiConfig.texts || {};
  const labels = texts.labels || {};
  const appearance = navConfig.appearance || {};

  const update = (patch) =>
    onChange((prev) => ({
      ...prev,
      appearance: { ...prev.appearance, ...patch },
    }));

  const renderSelect = (label, key, options) =>
    h(
      "div",
      { className: "company-rules-field" },
      h("span", { className: "company-rules-field__label" }, label),
      h(
        "div",
        { className: "company-rules-options" },
        (options || []).map((opt) =>
          h(
            "button",
            {
              type: "button",
              key: opt.key,
              className: `company-rules-option ${
                appearance[key] === opt.key ? "company-rules-option--active" : ""
              }`,
              onClick: () => update({ [key]: opt.key }),
            },
            opt.label
          )
        )
      )
    );

  return h(
    "div",
    null,
    renderSelect(labels.size || "按钮大小", "size", uiConfig.navButtonSizes),
    renderSelect(labels.variant || "按钮样式", "variant", uiConfig.navButtonVariants),
    renderSelect(labels.activeStyle || "选中样式", "activeStyle", uiConfig.navActiveStyles)
  );
}