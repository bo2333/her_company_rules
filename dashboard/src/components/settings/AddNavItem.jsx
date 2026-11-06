export default function AddNavItem({ navConfig, uiConfig, onChange, SDK }) {
  const { React } = SDK;
  const h = React.createElement;
  const texts = uiConfig.texts || {};
  const labels = texts.labels || {};
  const placeholders = texts.placeholders || {};
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    onChange((prev) => {
      const used = new Set((prev.items || []).map((i) => i.id));
      let n = 1;
      while (used.has(`navbar_main_${n}`)) n++;
      return {
        ...prev,
        items: [
          ...(prev.items || []),
          { id: `navbar_main_${n}`, name: name.trim(), description: desc.trim() },
        ],
      };
    });
    setName("");
    setDesc("");
  };

  return h(
    "div",
    null,
    h(
      "div",
      { className: "company-rules-field" },
      h("label", { className: "company-rules-field__label" }, labels.name || "名字"),
      h("input", {
        className: "company-rules-input",
        value: name,
        onChange: (e) => setName(e.target.value),
        placeholder: placeholders.navName || "",
      })
    ),
    h(
      "div",
      { className: "company-rules-field" },
      h("label", { className: "company-rules-field__label" }, labels.description || "描述（可选）"),
      h("input", {
        className: "company-rules-input",
        value: desc,
        onChange: (e) => setDesc(e.target.value),
      })
    ),
    h(
      "button",
      {
        type: "button",
        className: "company-rules-btn company-rules-btn--primary",
        onClick: handleAdd,
      },
      texts.add || "添加"
    )
  );
}