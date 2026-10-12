(function (root, factory) {
  const core = factory();
  if (typeof module === 'object' && module.exports) module.exports = core;
  root.SamenThuisHousehold = core;
})(globalThis, function () {
  /* ---------- Accentkleur ---------- */
  const HEX = /^#[0-9a-f]{6}$/i;
  const DEFAULT_ACCENT = '#5f63d8';
  const isHex = v => typeof v === 'string' && HEX.test(v.trim());
  const toRgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const toHex = rgb => '#' + rgb.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  function luminance(rgb) {
    const [r, g, b] = rgb.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function contrast(a, b) {
    const la = luminance(toRgb(a)), lb = luminance(toRgb(b));
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }
  // Leidt een complete, leesbare set accentvariabelen af uit één gekozen kleur.
  function deriveAccent(input) {
    const hex = isHex(input) ? input.trim().toLowerCase() : DEFAULT_ACCENT;
    let base = toRgb(hex);
    // Basiskleur moet minimaal 4,5:1 halen tegen witte knoptekst/lichte achtergrond.
    for (let i = 0; i < 40 && contrast(toHex(base), '#ffffff') < 4.5; i++) base = mix(base, [0, 0, 0], 0.06);
    let light = toRgb(hex);
    // Tekst op de donkere achtergrond (#0d273e) moet eveneens 4,5:1 halen.
    for (let i = 0; i < 40 && contrast(toHex(light), '#0d273e') < 4.5; i++) light = mix(light, [255, 255, 255], 0.08);
    const baseHex = toHex(base);
    return {
      base: baseHex,
      hover: toHex(mix(base, [0, 0, 0], 0.15)),
      soft: toHex(mix(base, [255, 255, 255], 0.88)),
      darkText: toHex(light),
      onAccent: contrast(baseHex, '#ffffff') >= contrast(baseHex, '#111111') ? '#ffffff' : '#111111',
      ring: `rgba(${base.map(Math.round).join(',')},.35)`
    };
  }

  /* ---------- Datumhulpen (alleen kalenderdata, YYYY-MM-DD) ---------- */
  const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;
  function parseISO(s) {
    const m = ISO.exec(String(s || ''));
    if (!m) return null;
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3] ? d : null;
  }
  const fmt = d => d.toISOString().slice(0, 10);
  const addDays = (d, n) => new Date(d.getTime() + n * 86400000);
  const cents = v => Math.round(Number(v) * 100);
  const euros = c => Math.round(c) / 100;
  const FREQUENCIES = ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'];
  const MONTH_STEP = { monthly: 1, quarterly: 3, yearly: 12 };

  // Begin van de periode waarin `d` valt: maandag (week) of 1e van de maand/kwartaal/jaar-cyclus.
  function periodStart(d, frequency, anchor) {
    if (frequency === 'weekly' || frequency === 'biweekly') {
      const a = anchor || d;
      const monday = x => addDays(x, -((x.getUTCDay() + 6) % 7));
      if (frequency === 'weekly') return monday(d);
      const base = monday(a);
      const weeks = Math.floor((monday(d) - base) / (14 * 86400000));
      return addDays(base, weeks * 14);
    }
    const step = MONTH_STEP[frequency];
    const a = anchor || d;
    const total = (d.getUTCFullYear() - a.getUTCFullYear()) * 12 + d.getUTCMonth() - a.getUTCMonth();
    const k = Math.floor(total / step) * step;
    return new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth() + k, 1));
  }
  function nextPeriod(d, frequency) {
    if (frequency === 'weekly') return addDays(d, 7);
    if (frequency === 'biweekly') return addDays(d, 14);
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + MONTH_STEP[frequency], 1));
  }
  // Inlegmomenten = periodestarts in [from, to] (inclusief de lopende periode).
  function momentsBetween(from, to, frequency, anchor) {
    const out = [];
    let p = periodStart(from, frequency, anchor);
    for (let i = 0; p <= to && i < 5000; i++) { out.push(p); p = nextPeriod(p, frequency); }
    return out;
  }

  /* ---------- Spaardoelen ---------- */
  function validateGoal(g) {
    const errors = [];
    if (!g || !String(g.title || '').trim()) errors.push('Naam is verplicht.');
    if (!(Number(g?.target) > 0)) errors.push('Doelbedrag moet groter dan 0 zijn.');
    if (g?.deadline && !parseISO(g.deadline)) errors.push('Einddatum is ongeldig.');
    if (g?.frequency && !FREQUENCIES.includes(g.frequency)) errors.push('Inlegfrequentie wordt niet ondersteund.');
    if (g?.openingBalance != null && !Number.isFinite(Number(g.openingBalance))) errors.push('Beginsaldo is ongeldig.');
    return errors;
  }
  function validateDeposit(dep) {
    const errors = [];
    if (!dep?.goalId) errors.push('Potje is verplicht.');
    if (!Number.isFinite(Number(dep?.amount)) || Number(dep.amount) === 0) errors.push('Bedrag moet een getal zijn en mag niet 0 zijn.');
    if (!parseISO(dep?.date)) errors.push('Datum is ongeldig.');
    return errors;
  }
  const depositKey = d => d.externalId ? `ext|${d.goalId}|${d.externalId}` : `${d.goalId}|${d.date}|${cents(d.amount)}|${String(d.note || '').trim().toLowerCase()}`;
  // Voegt een storting toe, tenzij dezelfde transactie al bestaat. Negatief bedrag = opname.
  function addDeposit(list, dep) {
    const errors = validateDeposit(dep);
    if (errors.length) return { list, added: false, duplicate: false, errors };
    if (list.some(x => depositKey(x) === depositKey(dep))) return { list, added: false, duplicate: true, errors: [] };
    return { list: [...list, { ...dep, amount: euros(cents(dep.amount)) }], added: true, duplicate: false, errors: [] };
  }

  // Alle bedragen worden intern in centen gerekend.
  function planGoal(goal, deposits, todayISO, opts = {}) {
    const today = parseISO(todayISO);
    const own = (deposits || []).filter(d => d.goalId === goal.id && parseISO(d.date) && parseISO(d.date) <= today);
    const frequency = FREQUENCIES.includes(goal.frequency) ? goal.frequency : 'monthly';
    const target = cents(goal.target);
    const opening = cents(goal.openingBalance || 0);
    const balance = opening + own.reduce((s, d) => s + cents(d.amount), 0);
    const remaining = Math.max(0, target - balance);
    const deadline = parseISO(goal.deadline);
    const start = parseISO(goal.startDate) || today;
    const startBalance = cents(goal.startBalance ?? goal.openingBalance ?? 0);
    const res = {
      goalId: goal.id, title: goal.title, frequency, priority: Number(goal.priority) || 3,
      target: euros(target), balance: euros(balance), remaining: euros(remaining),
      progress: target > 0 ? Math.min(1, Math.max(0, balance / target)) : 0,
      requiredPerPeriod: null, plannedPerPeriod: null, plannedBalance: null, backlog: 0,
      actualThisPeriod: 0, plannedVsActual: null, expectedEnd: null, remainingMoments: 0,
      status: 'ontrack', feasible: true, newAmountNeeded: null, bankNegative: false
    };
    if (opts.accountBalance != null && Number(opts.accountBalance) < 0) res.bankNegative = true;
    const pStart = periodStart(today, frequency, start);
    res.actualThisPeriod = euros(own.filter(d => parseISO(d.date) >= pStart).reduce((s, d) => s + cents(d.amount), 0));
    if (remaining === 0) { res.status = 'reached'; return res; }
    if (goal.paused) { res.status = 'paused'; return res; }
    if (!deadline) {
      res.status = 'nodeadline';
      if (goal.periodicDeposit > 0) res.expectedEnd = projectEnd(today, remaining, cents(goal.periodicDeposit), frequency, start);
      return res;
    }
    if (deadline < today) { res.status = 'overdue'; res.backlog = euros(remaining); return res; }

    const future = momentsBetween(today, deadline, frequency, start);
    res.remainingMoments = Math.max(1, future.length);
    res.requiredPerPeriod = euros(Math.ceil(remaining / res.remainingMoments));
    const all = momentsBetween(start, deadline, frequency, start);
    const elapsed = all.filter(p => p <= today).length;
    const total = Math.max(1, all.length);
    const planned = Math.min(target, Math.round(startBalance + (target - startBalance) * elapsed / total));
    res.plannedBalance = euros(planned);
    res.plannedPerPeriod = euros(Math.ceil((target - startBalance) / total));
    res.backlog = euros(Math.max(0, planned - balance));
    res.plannedVsActual = euros(cents(res.actualThisPeriod) - cents(res.plannedPerPeriod));

    const rhythm = goal.periodicDeposit > 0 ? cents(goal.periodicDeposit) : averageRhythm(own, frequency, start, today);
    if (rhythm > 0) {
      res.expectedEnd = projectEnd(today, remaining, rhythm, frequency, start);
      res.feasible = rhythm * res.remainingMoments >= remaining;
    } else res.feasible = false;
    if (!res.feasible) res.newAmountNeeded = res.requiredPerPeriod;
    res.status = res.backlog > 0 || !res.feasible ? 'behind' : 'ontrack';
    return res;
  }
  function projectEnd(today, remainingCents, rhythmCents, frequency, anchor) {
    let p = periodStart(today, frequency, anchor);
    const n = Math.ceil(remainingCents / rhythmCents);
    for (let i = 1; i < n; i++) p = nextPeriod(p, frequency);
    return fmt(p);
  }
  function averageRhythm(deps, frequency, start, today) {
    const positive = deps.filter(d => Number(d.amount) > 0);
    if (!positive.length) return 0;
    const first = parseISO(positive.map(d => d.date).sort()[0]);
    const periods = Math.max(1, momentsBetween(first, today, frequency, start).length);
    return Math.round(positive.reduce((s, d) => s + cents(d.amount), 0) / periods);
  }

  // Verdeelt een spaarbudget per periode: prioriteit (1 = hoogste), daarna vroegste einddatum.
  // Alleen frequenties die gelijk zijn aan `budgetFrequency` zijn vergelijkbaar; de rest wordt omgerekend naar maanden.
  function allocateBudget(plans, budget) {
    const perMonth = { weekly: 52 / 12, biweekly: 26 / 12, monthly: 1, quarterly: 1 / 3, yearly: 1 / 12 };
    const active = plans.filter(p => p.requiredPerPeriod != null && !['paused', 'reached'].includes(p.status))
      .map(p => ({ plan: p, need: cents(p.requiredPerPeriod * perMonth[p.frequency]) }));
    const totalNeed = active.reduce((s, a) => s + a.need, 0);
    let left = cents(budget);
    const sorted = [...active].sort((a, b) => a.plan.priority - b.plan.priority || String(a.plan.deadline || '9999').localeCompare(String(b.plan.deadline || '9999')));
    const items = sorted.map(({ plan, need }) => {
      const give = Math.max(0, Math.min(need, left));
      left -= give;
      const reason = give >= need
        ? `Volledig gedekt (prioriteit ${plan.priority}).`
        : give > 0 ? `Gedeeltelijk gedekt: budget raakte op bij prioriteit ${plan.priority}; ${euros(need - give)} per maand ontbreekt.`
          : `Niet gedekt: budget is verdeeld over doelen met hogere prioriteit of eerdere einddatum.`;
      return { goalId: plan.goalId, title: plan.title, neededPerMonth: euros(need), proposedPerMonth: euros(give), behind: plan.status === 'behind', reason };
    });
    return { budgetPerMonth: euros(cents(budget)), totalNeededPerMonth: euros(totalNeed), shortagePerMonth: euros(Math.max(0, totalNeed - cents(budget))), overBudget: totalNeed > cents(budget), items };
  }

  /* ---------- Aanbiedingen ---------- */
  const TZ = 'Europe/Amsterdam';
  function dateInZone(instant, tz = TZ) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(instant);
  }
  const hasTime = s => /T\d{2}:\d{2}/.test(String(s));
  // Eindigt een aanbieding? Datum zonder tijd geldt tot en met het einde van die dag in Amsterdam.
  function isPast(end, now) {
    if (!end) return false;
    if (hasTime(end)) { const t = Date.parse(end); return Number.isFinite(t) && now.getTime() > t; }
    return parseISO(end) ? dateInZone(now) > String(end).slice(0, 10) : false;
  }
  function hasStarted(start, now) {
    if (!start) return true;
    if (hasTime(start)) { const t = Date.parse(start); return !Number.isFinite(t) || now.getTime() >= t; }
    return !parseISO(start) || dateInZone(now) >= String(start).slice(0, 10);
  }
  const STALE_UNKNOWN_DAYS = 8;
  const VERIFY_HOURS = 36;
  function offerStatus(o, now = new Date()) {
    if (isPast(o.validUntil, now)) return 'expired';
    if (!hasStarted(o.validFrom, now)) return 'upcoming';
    const checked = Date.parse(o.lastChecked || '');
    const ageH = Number.isFinite(checked) ? (now.getTime() - checked) / 3600000 : Infinity;
    if (!o.validUntil || o.validUntilEstimated) return ageH > STALE_UNKNOWN_DAYS * 24 ? 'expired' : 'unknown';
    return 'active';
  }
  const isVerified = (o, now = new Date()) => {
    const checked = Date.parse(o.lastChecked || '');
    return Number.isFinite(checked) && Number.isFinite(o.price) && (now.getTime() - checked) / 3600000 <= VERIFY_HOURS && !o.validUntilEstimated;
  };
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  function dedupeKey(o) {
    return o.ean ? `ean|${o.ean}|${norm(o.retailer)}` : `name|${norm(o.brand)}|${norm(o.name)}|${norm(o.quantity)}|${norm(o.retailer)}`;
  }
  const num = v => (v === null || v === undefined || v === '' || !Number.isFinite(Number(v)) ? null : Number(v));
  // Zet een PrijsProfeet-product (velden volgens hun openapi.json) om. Ontbrekende gegevens blijven null.
  function normalizePrijsProfeet(p, checkedAtISO) {
    const price = num(p.price);
    const original = num(p.original_price);
    const reliableOriginal = original !== null && price !== null && original > price ? original : null;
    return {
      source: 'prijsprofeet', sourceId: p.product_id || null, name: p.name || p.title || '', brand: p.brand || null,
      ean: p.ean || null, retailer: p.retailer || '', category: p.unified_category || null,
      price, originalPrice: reliableOriginal,
      savings: reliableOriginal !== null ? Math.round((reliableOriginal - price) * 100) / 100 : null,
      discountPercentage: reliableOriginal !== null ? Math.round((1 - price / reliableOriginal) * 100) : null,
      quantity: p.quantity || null, unit: p.unit || null, unitPrice: num(p.unit_price),
      validFrom: p.valid_from || null, validUntil: p.valid_until || null, validUntilEstimated: p.valid_until_estimated === true,
      promotionType: p.promotion_type || null, url: p.product_url || null, imageUrl: p.image_url || null,
      lastChecked: checkedAtISO || p.extracted_at || null
    };
  }
  // Samenvoegen van een nieuwe synchronisatie: dedupliceren over bronnen, verlopen aanbiedingen naar archief.
  function mergeOffers(existing, incoming, now = new Date()) {
    const map = new Map();
    const put = (o, fresh) => {
      const key = dedupeKey(o), prev = map.get(key);
      if (!prev) { map.set(key, { ...o, sources: [o.source] }); return; }
      const sources = [...new Set([...(prev.sources || [prev.source]), o.source])];
      const newer = fresh && Date.parse(o.lastChecked || 0) >= Date.parse(prev.lastChecked || 0);
      map.set(key, { ...(newer ? { ...prev, ...stripNull(o) } : { ...o, ...stripNull(prev) }), sources });
    };
    (existing || []).forEach(o => put(o, false));
    (incoming || []).forEach(o => put(o, true));
    const active = [], archive = [];
    map.forEach(o => (offerStatus(o, now) === 'expired' ? archive : active).push(o));
    return { active, archive };
  }
  const stripNull = o => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined));

  /* ---------- Prijsvergelijking ---------- */
  function parseQuantity(text) {
    const m = /^\s*(\d+(?:[.,]\d+)?)\s*(kg|kilo|g|gr|gram|l|liter|ltr|ml|cl|stuks?|st|x)\b/i.exec(String(text || ''));
    if (!m) return null;
    const n = parseFloat(m[1].replace(',', '.')), u = m[2].toLowerCase();
    if (['kg', 'kilo'].includes(u)) return { amount: n, base: 'kg' };
    if (['g', 'gr', 'gram'].includes(u)) return { amount: n / 1000, base: 'kg' };
    if (['l', 'liter', 'ltr'].includes(u)) return { amount: n, base: 'l' };
    if (u === 'ml') return { amount: n / 1000, base: 'l' };
    if (u === 'cl') return { amount: n / 100, base: 'l' };
    return { amount: n, base: 'stuk' };
  }
  function unitPrice(o) {
    const q = parseQuantity(o.quantity);
    return q && q.amount > 0 && Number.isFinite(o.price) ? { value: Math.round((o.price / q.amount) * 100) / 100, base: q.base } : null;
  }
  // Groepeert op EAN (exact) of anders merk + eenheid (indicatief) en toont de laagste prijs per eenheid.
  function comparePrices(offers) {
    const groups = new Map();
    offers.forEach(o => {
      const up = unitPrice(o);
      if (!up) return;
      const exact = Boolean(o.ean);
      const key = exact ? `ean|${o.ean}` : `fuzzy|${norm(o.brand)}|${norm(o.name)}|${up.base}`;
      if (!groups.has(key)) groups.set(key, { key, exact, base: up.base, rows: [] });
      groups.get(key).rows.push({ offer: o, unitPrice: up.value });
    });
    return [...groups.values()].filter(g => new Set(g.rows.map(r => r.offer.retailer)).size > 1).map(g => {
      const rows = g.rows.sort((a, b) => a.unitPrice - b.unitPrice);
      const sizes = new Set(rows.map(r => norm(r.offer.quantity)));
      const lowest = rows[0], highest = rows[rows.length - 1];
      return {
        key: g.key, exactMatch: g.exact, base: g.base, rows, lowest,
        sameSize: sizes.size === 1,
        note: g.exact ? (sizes.size === 1 ? 'Zelfde EAN en inhoud.' : 'Zelfde EAN, maar andere inhoud: vergelijk per eenheid.')
          : 'Geen EAN: indicatieve match op merk en naam; controleer verpakking en variant.',
        // Besparing is alleen een verschil tussen gevonden prijzen, geen beweerde korting.
        maxDifferencePerUnit: Math.round((highest.unitPrice - lowest.unitPrice) * 100) / 100
      };
    });
  }

  /* ---------- Quotes ---------- */
  // Kiest deterministisch een quote op basis van tijd, zodat rotatie niet te snel verloopt.
  function quoteIndex(now, count, intervalMs) {
    return count > 0 ? Math.floor(now / intervalMs) % count : -1;
  }

  return {
    isHex, deriveAccent, contrast, DEFAULT_ACCENT,
    parseISO, periodStart, momentsBetween, FREQUENCIES,
    validateGoal, validateDeposit, addDeposit, planGoal, allocateBudget,
    offerStatus, isVerified, dedupeKey, normalizePrijsProfeet, mergeOffers, dateInZone,
    parseQuantity, unitPrice, comparePrices, quoteIndex
  };
});
