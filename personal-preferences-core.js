(function (root, factory) {
  const core = factory();
  if (typeof module === 'object' && module.exports) module.exports = core;
  root.SamenThuisPersonalPreferences = core;
})(globalThis, function () {
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  function storageKey(userId) {
    const id = String(userId || '');
    if (!UUID.test(id)) throw new Error('Een aangemelde Supabase-gebruikers-ID is vereist.');
    return `samenThuisPersonalPrefsV1:${id.toLowerCase()}`;
  }

  function normalize(value, widgetIds, dashboardCore = globalThis.SamenThuisDashboard) {
    const ui = value?.ui && typeof value.ui === 'object' ? value.ui : {};
    const accentColor = typeof ui.accentColor === 'string' && /^#[0-9a-f]{6}$/i.test(ui.accentColor) ? ui.accentColor : '';
    const preferences = {
      ui: {
        theme: ['system', 'light', 'dark'].includes(ui.theme) ? ui.theme : 'system',
        accent: ['bluePurple', 'blue', 'purple', 'orange'].includes(ui.accent) ? ui.accent : 'purple',
        density: ['comfortable', 'compact'].includes(ui.density) ? ui.density : 'comfortable',
        ...(accentColor ? { accentColor } : {})
      },
      dashboard: dashboardCore
        ? dashboardCore.normalize(value?.dashboard, widgetIds)
        : value?.dashboard
    };
    return preferences;
  }

  return { storageKey, normalize };
});
