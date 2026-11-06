export default function DeleteNavItems({ navConfig, uiConfig, onChange, SDK }) {
  const { React } = SDK;
  const h = React.createElement;
  const texts = uiConfig.texts || {};
  const [confirmId, setConfirmId] = React.useState(null);

  const remove = (id) => {
    onChange((prev) => ({
      ...prev,
      items: (prev.items || []).filter((i) => i.id !== id),
    }));
    setConfirmId(null);
  };

  return h(
    "div",
    { className: "company-rules-delete-list" },
    (navConfig.items || []).map((item) =>
      h(
        "div",
        { key: item.id, className: "company-rules-delete-item" },
        h(
          "div",
          { className: "company-rules-delete-item__info" },
          h("div", { className: "company-rules-delete-item__name" }, item.name),
          h("div", { className: "company-rules-delete-item__id" }, item.id)
        ),
        confirmId === item.id
          ? h(
              "div",
              { className: "company-rules-delete-item__actions" },
              h(
                "button",
                {
                  type: "button",
                  className: "company-rules-btn company-rules-btn--danger",
                  onClick: () => remove(item.id),
                },
                texts.confirmDelete || "确认删除"
              ),
              h(
                "button",
                {
                  type: "button",
                  className: "company-rules-btn company-rules-btn--muted",
                  onClick: () => setConfirmId(null),
                },
                texts.cancel || "取消"
              )
            )
          : h(
              "button",
              {
                type: "button",
                className: "company-rules-btn company-rules-btn--ghost-danger",
                onClick: () => setConfirmId(item.id),
              },
              texts.delete || "删除"
            )
      )
    )
  );
}