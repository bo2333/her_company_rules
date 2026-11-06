export default function DynamicIcon({ name, size = 16, uiConfig = {}, SDK }) {
  const React = SDK.React;
  const resolved = (uiConfig.icons && uiConfig.icons[name]) || name;
  const IconComp = SDK.icons && SDK.icons[resolved];
  if (IconComp) return React.createElement(IconComp, { size });

  const letter = name ? name.charAt(0).toUpperCase() : "?";
  return React.createElement(
    "span",
    {
      className: "company-rules-icon-fallback",
      style: { width: size, height: size, fontSize: Math.round(size * 0.65) },
      "aria-hidden": "true",
    },
    letter
  );
}