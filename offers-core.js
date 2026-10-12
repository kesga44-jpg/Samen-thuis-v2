(function (root, factory) {
  const core = factory();
  if (typeof module === 'object' && module.exports) module.exports = core;
  root.SamenThuisOffers = core;
})(globalThis, function () {
  const TZ = 'Europe/Amsterdam';
  const dayInTz = (now, tz = TZ) => new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const isDate = s => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''));

  // Date-only validity is inclusive: an offer ending on 2026-10-12 is active the whole of that day (Amsterdam time).
  // Offers without a validTo are treated as "unknown end" and stay active; no deadline is invented.
  function isActive(offer, now = new Date(), tz = TZ) {
    const today = dayInTz(now, tz);
    if (isDate(offer.validFrom) && offer.validFrom > today) return false;
    if (isDate(offer.validTo) && offer.validTo < today) return false;
    return true;
  }
  function partition(offers, now, tz) {
    const active = [], archive = [];
    (offers || []).forEach(o => (isActive(o, now, tz) ? active : archive).push(o));
    return { active, archive };
  }
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  function key(o) {
    const id = o.ean ? `ean:${o.ean}` : `n:${norm(o.brand)}|${norm(o.name)}|${norm(o.size)}`;
    return `${id}|${norm(o.store)}|${o.price ?? ''}|${o.validTo || ''}`;
  }
  // Keep one offer per key; prefer verified, then most recently checked.
  function dedupe(offers) {
    const map = new Map();
    (offers || []).forEach(o => {
      const k = key(o), prev = map.get(k);
      if (!prev || (!!o.verified > !!prev.verified) || (!!o.verified === !!prev.verified && String(o.checkedAt || '') > String(prev.checkedAt || ''))) map.set(k, o);
    });
    return [...map.values()];
  }
  return { isActive, partition, dedupe, key, dayInTz };
});
