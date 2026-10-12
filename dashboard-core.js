(function (root, factory) {
  const core = factory();
  if (typeof module === 'object' && module.exports) module.exports = core;
  root.SamenThuisDashboard = core;
})(globalThis, function () {
  function defaults(widgetIds) {
    const ids = [...new Set(widgetIds || [])];
    return { order: ids, visible: Object.fromEntries(ids.map(id => [id, true])) };
  }

  function normalize(saved, widgetIds) {
    const base = defaults(widgetIds);
    const valid = new Set(base.order);
    const order = Array.isArray(saved?.order) ? saved.order.filter(id => valid.has(id)) : [];
    return {
      order: [...new Set([...order, ...base.order])],
      visible: Object.fromEntries(base.order.map(id => [id, saved?.visible?.[id] !== false]))
    };
  }

  function move(layout, id, direction, widgetIds) {
    const next = normalize(layout, widgetIds);
    const index = next.order.indexOf(id);
    const target = index + Number(direction);
    if (index < 0 || !Number.isInteger(target) || target < 0 || target >= next.order.length) return next;
    [next.order[index], next.order[target]] = [next.order[target], next.order[index]];
    return next;
  }

  function setVisible(layout, id, visible, widgetIds) {
    const next = normalize(layout, widgetIds);
    if (Object.hasOwn(next.visible, id)) next.visible[id] = Boolean(visible);
    return next;
  }

  return { defaults, normalize, move, setVisible };
});
