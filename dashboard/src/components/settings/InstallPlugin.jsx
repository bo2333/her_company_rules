export default function InstallPlugin({ navConfig, uiConfig, constants, SDK }) {
  const { React } = SDK;
  const h = React.createElement;
  const texts = uiConfig.texts || {};
  const labels = texts.labels || {};
  const placeholders = texts.placeholders || {};

  const [url, setUrl] = React.useState("");
  const [navId, setNavId] = React.useState((navConfig.items[0] || {}).id || "");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState(null);

  const handleInstall = async () => {
    if (!url.trim() || !navId) {
      setMessage({ type: "error", text: "请填写完整信息" });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const apiPrefix = constants?.apiPrefix || "/api/plugins/company_rules";
      const res = await SDK.fetchJSON(`${apiPrefix}/install`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), navId }),
      });
      setMessage({ type: "success", text: res.message || "安装成功" });
      setUrl("");
    } catch (err) {
      setMessage({ type: "error", text: err.message || "安装失败" });
    } finally {
      setLoading(false);
    }
  };

  return h(
    "div",
    null,
    h(
      "div",
      { className: "company-rules-field" },
      h("label", { className: "company-rules-field__label" }, labels.url || "URL"),
      h("input", {
        className: "company-rules-input",
        value: url,
        onChange: (e) => setUrl(e.target.value),
        placeholder: placeholders.url || "",
        disabled: loading,
      })
    ),
    h(
      "div",
      { className: "company-rules-field" },
      h("label", { className: "company-rules-field__label" }, labels.navSelect || "主导航"),
      h(
        "select",
        {
          className: "company-rules-select company-rules-select--full",
          value: navId,
          onChange: (e) => setNavId(e.target.value),
          disabled: loading || !navConfig.items?.length,
        },
        (navConfig.items || []).map((n) => h("option", { key: n.id, value: n.id }, n.name))
      )
    ),

    message && h(
      "div",
      { className: `company-rules-message company-rules-message--${message.type}` },
      message.text
    ),

    h(
      "button",
      {
        type: "button",
        className: "company-rules-btn company-rules-btn--primary",
        onClick: handleInstall,
        disabled: loading,
      },
      loading ? "安装中..." : (texts.install || "执行安装")
    )
  );
}