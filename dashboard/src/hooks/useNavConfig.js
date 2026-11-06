import { loadConstants, loadNavConfig, loadUIConfig, saveNavConfig } from "../config/loader";

export function useNavConfig(SDK) {
  const { React } = SDK;
  const [state, setState] = React.useState({
    navConfig: { items: [], appearance: {} },
    uiConfig: {},
    constants: null,
    activeNavId: null,
    loading: true,
  });

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const constants = await loadConstants(SDK);
      const [nav, ui] = await Promise.all([
        loadNavConfig(SDK, constants),
        loadUIConfig(SDK, constants),
      ]);
      if (cancelled) return;
      setState({
        navConfig: nav,
        uiConfig: ui,
        constants,
        activeNavId: (nav.items || [])[0]?.id || null,
        loading: false,
      });
    })().catch((err) => {
      console.error("[company_rules] 初始化失败", err);
      if (!cancelled) setState((prev) => ({ ...prev, loading: false }));
    });
    return () => { cancelled = true; };
  }, [SDK]);

  const setActiveNavId = React.useCallback((id) => {
    setState((prev) => ({ ...prev, activeNavId: id }));
  }, []);

  const setNavConfig = React.useCallback(
    (updater) => {
      setState((prev) => {
        const next = typeof updater === "function" ? updater(prev.navConfig) : updater;
        const prevSnapshot = prev.navConfig;
        saveNavConfig(SDK, next, prev.constants).catch((err) => {
          console.error("[company_rules] 保存失败，回滚", err);
          setState((s) => (s.navConfig === next ? { ...s, navConfig: prevSnapshot } : s));
        });
        return { ...prev, navConfig: next };
      });
    },
    [SDK]
  );

  return {
    navConfig: state.navConfig,
    uiConfig: state.uiConfig,
    constants: state.constants,
    activeNavId: state.activeNavId,
    setActiveNavId,
    setNavConfig,
    loading: state.loading,
  };
}