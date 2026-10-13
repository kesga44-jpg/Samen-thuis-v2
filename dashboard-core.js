(function (root, factory) {
  const core = factory();
  if (typeof module === 'object' && module.exports) module.exports = core;
  root.SamenThuisDashboard = core;
})(globalThis, function () {
  // [id, label, standaard zichtbaar]. Verborgen widgets blijven bestaan en zijn via Instellingen weer in te schakelen.
  const CATALOG = [
    ['weather', 'Weer en uurstrook', true],
    ['overview', 'Vandaagstatistieken en diner', true],
    ['agenda', 'Agenda · komende afspraken', true],
    ['outfit', 'Kledingadvies', true],
    ['air', 'Pollen en luchtkwaliteit', true],
    ['quote', 'Quote van de dag', true],
    ['chalkboard', 'Krijtbord · berichten voor elkaar', true],
    ['budget', 'Budgetoverzicht', false],
    ['savings', 'Spaardoelen en potjes', false],
    ['car', 'Auto-informatie', false],
    ['tasks', 'Taken', false],
    ['groceries', 'Boodschappen', false]
  ];

  function defaults(widgetIds) {
    const ids = [...new Set(widgetIds || [])];
    return { order: ids, visible: Object.fromEntries(ids.map(id => [id, true])) };
  }

  function normalize(saved, widgetIds, defaultVisibleIds) {
    const base = defaults(widgetIds);
    const valid = new Set(base.order);
    const defaultsVisible = defaultVisibleIds ? new Set(defaultVisibleIds) : valid;
    const order = Array.isArray(saved?.order) ? saved.order.filter(id => valid.has(id)) : [];
    return {
      order: [...new Set([...order, ...base.order])],
      visible: Object.fromEntries(base.order.map(id => [id, Object.hasOwn(saved?.visible || {}, id)
        ? saved.visible[id] !== false
        : defaultsVisible.has(id)]))
    };
  }

  function move(layout, id, direction, widgetIds, defaultVisibleIds) {
    const next = normalize(layout, widgetIds, defaultVisibleIds);
    const index = next.order.indexOf(id);
    const target = index + Number(direction);
    if (index < 0 || !Number.isInteger(target) || target < 0 || target >= next.order.length) return next;
    [next.order[index], next.order[target]] = [next.order[target], next.order[index]];
    return next;
  }

  function setVisible(layout, id, visible, widgetIds, defaultVisibleIds) {
    const next = normalize(layout, widgetIds, defaultVisibleIds);
    if (Object.hasOwn(next.visible, id)) next.visible[id] = Boolean(visible);
    return next;
  }

  return { CATALOG, defaults, normalize, move, setVisible };
});
