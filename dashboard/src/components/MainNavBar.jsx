import DynamicIcon from "./DynamicIcon";

export default function MainNavBar(props) {
  const { SDK, items = [], uiConfig = {}, appearance = {}, activeNavId, onSelect, onOpenSettings } = props;
  const React = SDK.React;
  const h = React.createElement;
  const texts = uiConfig.texts || {};

  const size =
    (uiConfig.navButtonSizes || []).find((s) => s.key === appearance.size) ||
    (uiConfig.navButtonSizes || [])[0] || {};
  const variant =
    (uiConfig.navButtonVariants || []).find((v) => v.key === appearance.variant) ||
    (uiConfig.navButtonVariants || [])[0] || {};
  const activeStyle =
    (uiConfig.navActiveStyles || []).find((a) => a.key === appearance.activeStyle) ||
    (uiConfig.navActiveStyles || [])[0] || {};

  const buildClass = (isActive) =>
    [
      "company-rules-mainnav__item",
      size.className || "",
      variant.className || "",
      isActive ? (activeStyle.className || "") : "",
    ]
      .filter(Boolean)
      .join(" ");

  const settingsLabel = texts.settingsButton || "设置";

  return h(
    "div",
    { className: "company-rules-mainnav" },
    h(
      "div",
      { className: "company-rules-mainnav__items" },
      items.map((item) =>
        h(
          "button",
          {
            type: "button",
            key: item.id,
            className: buildClass(activeNavId === item.id),
            onClick: () => onSelect(item.id),
            title: item.description || item.name,
          },
          item.name
        )
      )
    ),
    h(
      "button",
      {
        type: "button",
        className: "company-rules-mainnav__settings",
        onClick: onOpenSettings,
        title: settingsLabel,
        "aria-label": settingsLabel,
      },
      h(DynamicIcon, { name: "Settings", size: 16, uiConfig, SDK }),
      h("span", { className: "company-rules-mainnav__settings-label" }, settingsLabel)
    )
  );
}