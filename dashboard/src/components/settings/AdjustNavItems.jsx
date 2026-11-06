export default function AdjustNavItems({ navConfig, registry, activeNavId, uiConfig, SDK, onChange }) {
  const { React } = SDK;
  const h = React.createElement;
  const texts = uiConfig.texts || {};
  const firstNavId = (navConfig.items[0] || {}).id;
  const [selectedNavId, setSelectedNavId] = React.useState(activeNavId || firstNavId);
  const [editingId, setEditingId] = React.useState(null);
  const [editValue, setEditValue] = React.useState("");
  const [, force] = React.useState(0);

  React.useEffect(() => registry.subscribe(() => force((v) => v + 1)), [registry]);

  const subNavs = registry.listSubNavs(selectedNavId);

  const move = (index, dir) => {
    const ids = subNavs.map((s) => s.subNavId);
    const target = index + dir;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    registry.reorderSubNavs(selectedNavId, ids);
  };

  const transfer = (subNavId, toNavId) => registry.moveSubNav(selectedNavId, toNavId, subNavId);
  const remove = (subNavId) => registry.removeSubNav(selectedNavId, subNavId);

  // 重命名逻辑
  const startEdit = (e, item) => {
    e.stopPropagation();
    setEditingId(item.id);
    setEditValue(item.name);
  };

  const saveEdit = () => {
    if (!editValue.trim() || !editingId) {
      setEditingId(null);
      return;
    }
    onChange((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === editingId ? { ...i, name: editValue.trim() } : i)),
    }));
    setEditingId(null);
  };

  return h(
    "div",
    { className: "company-rules-adjust" },
    // 左栏：主导航列表
    h(
      "div",
      { className: "company-rules-adjust__col" },
      (navConfig.items || []).map((item) =>
        h(
          "div",
          {
            key: item.id,
            className: `company-rules-adjust__item ${
              selectedNavId === item.id ? "company-rules-adjust__item--active" : ""
            }`,
            onClick: () => setSelectedNavId(item.id),
          },
          h(
            "div",
            { className: "company-rules-adjust__item-header" },
            editingId === item.id
              ? h("input", {
                  className: "company-rules-input company-rules-adjust__edit-input",
                  value: editValue,
                  onChange: (e) => setEditValue(e.target.value),
                  onBlur: saveEdit,
                  onKeyDown: (e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") setEditingId(null);
                  },
                  autoFocus: true,
                  onClick: (e) => e.stopPropagation(),
                })
              : h("div", { className: "company-rules-adjust__item-name" }, item.name),

            // 编辑按钮
            editingId !== item.id && h(
              "button",
              {
                type: "button",
                className: "company-rules-icon-btn company-rules-icon-btn--ghost",
                onClick: (e) => startEdit(e, item),
                title: "重命名",
              },
              "✎"
            )
          ),
          h("div", { className: "company-rules-adjust__item-id" }, item.id)
        )
      )
    ),
    // 右栏：子导航列表
    h(
      "div",
      { className: "company-rules-adjust__col" },
      subNavs.length === 0
        ? h(
            "div",
            { className: "company-rules-adjust__empty" },
            texts.emptySubNavs || "此主导航下暂无子导航"
          )
        : subNavs.map((s, i) =>
            h(
              "div",
              { key: s.subNavId, className: "company-rules-adjust__subitem" },
              h("span", { className: "company-rules-adjust__subitem-label" }, s.label),
              h(
                "button",
                {
                  type: "button",
                  className: "company-rules-icon-btn",
                  onClick: () => move(i, -1),
                  disabled: i === 0,
                  title: "上移",
                },
                "↑"
              ),
              h(
                "button",
                {
                  type: "button",
                  className: "company-rules-icon-btn",
                  onClick: () => move(i, 1),
                  disabled: i === subNavs.length - 1,
                  title: "下移",
                },
                "↓"
              ),
              h(
                "select",
                {
                  className: "company-rules-select",
                  defaultValue: "",
                  onChange: (e) => {
                    if (e.target.value) {
                      transfer(s.subNavId, e.target.value);
                      e.target.value = "";
                    }
                  },
                },
                h("option", { value: "" }, texts.transferPlaceholder || "转移…"),
                (navConfig.items || [])
                  .filter((n) => n.id !== selectedNavId)
                  .map((n) => h("option", { key: n.id, value: n.id }, n.name))
              ),
              h(
                "button",
                {
                  type: "button",
                  className: "company-rules-icon-btn company-rules-icon-btn--danger",
                  onClick: () => remove(s.subNavId),
                  title: texts.delete || "删除",
                },
                "✕"
              )
            )
          )
    )
  );
}