export function createNavRegistry(registerSlot) {
  const subNavMap = new Map(); // navId -> Map(subNavId -> entry)
  let version = 0;
  const listeners = new Set();

  function bump() {
    version++;
    listeners.forEach((fn) => fn(version));
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function ensure(navId) {
    if (!subNavMap.has(navId)) subNavMap.set(navId, new Map());
    return subNavMap.get(navId);
  }

  function registerSubNav({ navId, subNavId, label, icon = "Puzzle", order = 0, button, content }) {
    if (!navId || !subNavId || !button || !content) {
      console.error("[her_company_rules] registerSubNav 缺少必填字段");
      return;
    }
    const nav = ensure(navId);
    nav.set(subNavId, { subNavId, label: label || subNavId, icon, order, navId });
    registerSlot("her_company_rules", `${navId}:subnavbar`, button);
    registerSlot("her_company_rules", `${navId}:content`, content);
    bump();
  }

  function listSubNavs(navId) {
    const m = subNavMap.get(navId);
    return m ? Array.from(m.values()).sort((a, b) => a.order - b.order) : [];
  }

  function removeSubNav(navId, subNavId) {
    const m = subNavMap.get(navId);
    if (!m) return;
    m.delete(subNavId);
    bump();
  }

  function reorderSubNavs(navId, orderedIds) {
    const m = subNavMap.get(navId);
    if (!m) return;
    orderedIds.forEach((id, i) => {
      const entry = m.get(id);
      if (entry) m.set(id, { ...entry, order: i });
    });
    bump();
  }

  function moveSubNav(fromNavId, toNavId, subNavId) {
    if (fromNavId === toNavId) return;
    const from = subNavMap.get(fromNavId);
    const entry = from?.get(subNavId);
    if (!entry) return;
    from.delete(subNavId);
    const to = ensure(toNavId);
    to.set(subNavId, { ...entry, navId: toNavId, order: to.size });
    bump();
  }

  return { registerSubNav, listSubNavs, removeSubNav, reorderSubNavs, moveSubNav, subscribe };
}