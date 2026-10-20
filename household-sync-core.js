(function (root, factory) {
  const core = factory();
  if (typeof module === 'object' && module.exports) module.exports = core;
  root.SamenThuisHouseholdSync = core;
})(globalThis, function () {
  // Lokale-only sleutels: apparaatinstellingen en meta worden nooit per onderdeel gesynchroniseerd.
  const SKIP_KEYS = ['settings', 'meta'];
  const LEGACY_SECTION = 'legacy_full';

  function stable(v) {
    if (Array.isArray(v)) return '[' + v.map(stable).join(',') + ']';
    if (v && typeof v === 'object') return '{' + Object.keys(v).sort().filter(k => v[k] !== undefined).map(k => JSON.stringify(k) + ':' + stable(v[k])).join(',') + '}';
    return JSON.stringify(v === undefined ? null : v);
  }
  function hashValue(v) {
    const s = stable(v); let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0') + ':' + s.length;
  }
  function isEmptyValue(v) {
    if (v == null || v === '' || v === false) return true;
    if (Array.isArray(v)) return v.length === 0;
    if (typeof v === 'object') return Object.keys(v).length === 0;
    return false;
  }
  function sectionsOf(data) {
    const out = {};
    Object.keys(data || {}).forEach(k => { if (!SKIP_KEYS.includes(k) && /^[\w.-]{1,60}$/.test(k)) out[k] = data[k]; });
    return out;
  }

  // remote: {section:{version, value}} ; base: {section:{version, hash}} ; resolutions: {section:'local'|'remote'}
  function planSections({ local, remote, base = {}, hold = false, resolutions = {} }) {
    const L = sectionsOf(local), actions = [];
    const allLocalEmpty = Object.values(L).every(isEmptyValue);
    const names = [...new Set([...Object.keys(L), ...Object.keys(remote)])].sort();
    for (const s of names) {
      const hasL = s in L, r = remote[s], b = base[s];
      const lh = hasL ? hashValue(L[s]) : null, rh = r ? hashValue(r.value) : null;
      const res = resolutions[s];
      let act;
      if (r && !hasL) act = 'pull';
      else if (hasL && !r) act = isEmptyValue(L[s]) ? 'none' : 'push';
      else if (lh === rh) act = 'adopt';
      else if (res === 'remote') act = 'pull';
      else if (res === 'local') act = 'push';
      else if (allLocalEmpty && !isEmptyValue(r.value)) act = 'pull';
      else if (b) {
        const lc = lh !== b.hash, rc = r.version !== b.version;
        act = !lc && !rc ? 'none' : lc && !rc ? (hold ? 'conflict' : 'push') : !lc && rc ? 'pull' : 'conflict';
      } else if (isEmptyValue(L[s])) act = 'pull';
      else if (isEmptyValue(r.value)) act = hold ? 'conflict' : 'push';
      else act = 'conflict';
      actions.push({ section: s, action: act, expectedVersion: r ? r.version : 0, localHash: lh, remoteHash: rh });
    }
    return actions;
  }

  function classifyError(err) {
    const status = err?.status || 0, code = String(err?.code || ''), msg = String(err?.message || '');
    if (code === '40001' || /Versieconflict/i.test(msg)) return { kind: 'conflict', message: 'De andere versie is ondertussen bijgewerkt; synchroniseer opnieuw om te vergelijken.' };
    if (status === 401 || status === 403 || code === '42501' || code === 'PGRST301') return { kind: 'auth', message: 'Geen toegang: meld je opnieuw aan of controleer je huishoudlidmaatschap.' };
    if (code === 'PGRST202' || code === '42P01' || code === 'PGRST205' || status === 404) return { kind: 'migration', message: 'De Supabase-migratie 20261014000000 is nog niet handmatig toegepast; accountsynchronisatie is niet beschikbaar.' };
    if (err instanceof TypeError || /failed to fetch|network/i.test(msg)) return { kind: 'network', message: 'Geen verbinding; wijzigingen blijven lokaal bewaard en worden later gesynchroniseerd.' };
    if (err?.name === 'OperationError' || /huishoudcode/i.test(msg)) return { kind: 'key', message: 'De huishoudcode past niet bij de versleutelde cloudgegevens.' };
    return { kind: 'other', message: msg || 'Synchronisatie mislukt' };
  }

  class CloudError extends Error { constructor(status, body) { super((body && (body.message || body.msg)) || ('Supabase ' + status)); this.status = status; this.code = body && body.code; } }

  // Dunne REST-client; token wordt per aanroep opgehaald (gebruikers-JWT, nooit een service-role key).
  function createCloud({ url, anonKey, getToken, fetchImpl }) {
    const f = fetchImpl || ((...a) => globalThis.fetch(...a)), base = String(url).replace(/\/+$/, '');
    async function call(path, opts = {}) {
      const token = await getToken();
      if (!token) throw new CloudError(401, { message: 'Niet aangemeld' });
      const res = await f(base + path, { ...opts, headers: { 'Content-Type': 'application/json', apikey: anonKey, Authorization: 'Bearer ' + token, ...(opts.headers || {}) } });
      const body = res.status === 204 ? null : await res.json().catch(() => null);
      if (!res.ok) throw new CloudError(res.status, body);
      return body;
    }
    const rpc = (name, args) => call('/rest/v1/rpc/' + name, { method: 'POST', body: JSON.stringify(args) });
    return {
      async membership() {
        const rows = await call('/rest/v1/household_members?select=role,households(id,name,join_code)&order=joined_at.asc&limit=1');
        return rows && rows[0] && rows[0].households ? { role: rows[0].role, ...rows[0].households } : null;
      },
      createHousehold: name => rpc('create_household', { p_name: name }),
      joinHousehold: code => rpc('join_household', { p_code: code }),
      readState: hid => call('/rest/v1/household_state?select=section,payload,version,updated_at&household_id=eq.' + encodeURIComponent(hid)),
      putState: (hid, section, payload, expected) => rpc('put_household_state', { p_household: hid, p_section: section, p_payload: payload, p_expected_version: expected }),
      importLegacy: (hid, legacyId) => rpc('import_legacy_household_data', { p_household: hid, p_legacy_id: legacyId })
    };
  }

  // Volledige synchronisatieronde. Schrijft nooit lokaal; geeft pulls/base terug zodat de app veilig kan opslaan.
  async function runAccountSync({ cloud, householdId, local, base = {}, hold = false, resolutions = {}, encrypt, decrypt }) {
    const rows = await cloud.readState(householdId);
    const remote = {}; let legacy = null;
    for (const row of rows || []) {
      const value = await decrypt(row.payload); // sleutelfout stopt vóór enig schrijven
      if (row.section === LEGACY_SECTION) legacy = value;
      else remote[row.section] = { version: Number(row.version), value };
    }
    if (legacy && typeof legacy === 'object') {
      for (const [k, v] of Object.entries(sectionsOf(legacy))) if (!(k in remote)) remote[k] = { version: 0, value: v };
    }
    const actions = planSections({ local, remote, base, hold, resolutions });
    const L = sectionsOf(local), newBase = { ...base }, pulls = {}, conflicts = [], pushed = [], failed = [];
    for (const a of actions) {
      const s = a.section;
      if (a.action === 'adopt') newBase[s] = { version: a.expectedVersion, hash: a.localHash };
      else if (a.action === 'pull') { pulls[s] = remote[s].value; newBase[s] = { version: remote[s].version, hash: a.remoteHash }; }
      else if (a.action === 'conflict') conflicts.push({ section: s, local: L[s], remote: remote[s].value, remoteVersion: remote[s].version });
      else if (a.action === 'push') {
        try {
          const version = await cloud.putState(householdId, s, await encrypt(L[s]), a.expectedVersion);
          newBase[s] = { version: Number(version), hash: a.localHash }; pushed.push(s);
        } catch (e) {
          const c = classifyError(e);
          if (c.kind === 'conflict') conflicts.push({ section: s, local: L[s], remote: remote[s] ? remote[s].value : undefined, remoteVersion: a.expectedVersion, raced: true });
          else { failed.push({ section: s, error: c }); }
        }
      }
    }
    return { status: failed.length ? 'partial' : conflicts.length ? 'conflict' : 'ok', pulls, base: newBase, pushed, conflicts, failed, hadLegacy: !!legacy };
  }

  return { SKIP_KEYS, LEGACY_SECTION, hashValue, isEmptyValue, sectionsOf, planSections, classifyError, createCloud, runAccountSync, CloudError };
});
