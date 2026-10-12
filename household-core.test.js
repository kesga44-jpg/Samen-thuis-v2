const test = require('node:test');
const assert = require('node:assert/strict');
const H = require('./household-core.js');

test('accent colours always get readable derived variants', () => {
  ['#ffff00', '#000000', '#7057d9', '#d56e38', 'nonsense'].forEach(c => {
    const a = H.deriveAccent(c);
    assert.ok(H.contrast(a.base, '#ffffff') >= 4.5, c);
    assert.ok(H.contrast(a.darkText, '#0d273e') >= 4.5, c);
    assert.ok(H.contrast(a.base, a.onAccent) >= 4.5, c);
  });
  assert.equal(H.deriveAccent('bad').base, H.deriveAccent(H.DEFAULT_ACCENT).base);
});

const goal = { id: 'g1', title: 'Vakantie', target: 1200, openingBalance: 0, startDate: '2026-01-01', deadline: '2026-12-31', frequency: 'monthly', priority: 1 };

test('required contribution = remaining / remaining moments, with backlog', () => {
  const deps = [{ goalId: 'g1', date: '2026-03-10', amount: 220 }];
  const p = H.planGoal(goal, deps, '2026-04-15');
  assert.equal(p.balance, 220);
  assert.equal(p.remainingMoments, 9); // apr..dec
  assert.equal(p.requiredPerPeriod, Math.ceil(98000 / 9) / 100);
  assert.equal(p.plannedPerPeriod, 100);
  assert.equal(p.plannedBalance, 400); // 4 van 12 maanden verstreken
  assert.equal(p.backlog, 180);
  assert.equal(p.status, 'behind');
});

test('planned 300 vs actual 220 gives backlog 80', () => {
  const g = { ...goal, target: 1200, startDate: '2026-01-01' };
  const p = H.planGoal(g, [{ goalId: 'g1', date: '2026-02-01', amount: 220 }], '2026-03-05');
  assert.equal(p.plannedBalance, 300);
  assert.equal(p.backlog, 80);
});

test('reached, paused and overdue goals', () => {
  assert.equal(H.planGoal(goal, [{ goalId: 'g1', date: '2026-02-01', amount: 1200 }], '2026-03-01').status, 'reached');
  assert.equal(H.planGoal({ ...goal, paused: true }, [], '2026-03-01').status, 'paused');
  const o = H.planGoal(goal, [], '2027-01-02');
  assert.equal(o.status, 'overdue');
  assert.equal(o.backlog, 1200);
});

test('withdrawals reduce balance, future deposits ignored', () => {
  const deps = [{ goalId: 'g1', date: '2026-02-01', amount: 500 }, { goalId: 'g1', date: '2026-02-10', amount: -100 }, { goalId: 'g1', date: '2026-09-01', amount: 999 }];
  assert.equal(H.planGoal(goal, deps, '2026-03-01').balance, 400);
});

test('weekly frequency counts calendar weeks', () => {
  const g = { id: 'w', title: 'x', target: 100, frequency: 'weekly', deadline: '2026-01-31', startDate: '2026-01-01' };
  const p = H.planGoal(g, [], '2026-01-05'); // maandag
  assert.equal(p.remainingMoments, 4);
  assert.equal(p.requiredPerPeriod, 25);
});

test('duplicate deposits are rejected, invalid input is validated', () => {
  const d = { goalId: 'g1', date: '2026-03-01', amount: 50, note: 'Salaris' };
  const a = H.addDeposit([], d);
  assert.ok(a.added);
  const b = H.addDeposit(a.list, { ...d });
  assert.ok(b.duplicate && !b.added && b.list.length === 1);
  assert.ok(H.addDeposit([], { goalId: 'g1', date: '2026-02-30', amount: 5 }).errors.length);
  assert.ok(H.addDeposit([], { goalId: 'g1', date: '2026-02-01', amount: 0 }).errors.length);
  assert.ok(H.validateGoal({ title: '', target: -1 }).length >= 2);
});

test('bank negative is separate from goal backlog', () => {
  const p = H.planGoal(goal, [], '2026-04-15', { accountBalance: -20 });
  assert.equal(p.bankNegative, true);
  assert.ok(p.backlog > 0);
  assert.equal(H.planGoal(goal, [], '2026-04-15', { accountBalance: 50 }).bankNegative, false);
});

test('budget allocation honours priority and explains shortage', () => {
  const a = H.planGoal({ ...goal, id: 'a', priority: 2, target: 1200 }, [], '2026-01-01');
  const b = H.planGoal({ ...goal, id: 'b', priority: 1, target: 1200 }, [], '2026-01-01');
  const r = H.allocateBudget([a, b], 150);
  assert.equal(r.overBudget, true);
  assert.equal(r.items[0].goalId, 'b');
  assert.equal(r.items[0].proposedPerMonth, 100);
  assert.equal(r.items[1].proposedPerMonth, 50);
  assert.match(r.items[1].reason, /Gedeeltelijk/);
  assert.equal(r.shortagePerMonth, 50);
});

test('offers expire at end of day Europe/Amsterdam, unknown validity is not invented', () => {
  const o = { name: 'Melk', retailer: 'jumbo', price: 1, validUntil: '2026-06-10', lastChecked: '2026-06-10T08:00:00Z' };
  assert.equal(H.offerStatus(o, new Date('2026-06-10T21:30:00Z')), 'active'); // 23:30 NL
  assert.equal(H.offerStatus(o, new Date('2026-06-10T22:30:00Z')), 'expired'); // 00:30 NL
  const u = { name: 'x', retailer: 'a', price: 1, validUntil: null, lastChecked: '2026-06-10T08:00:00Z' };
  assert.equal(H.offerStatus(u, new Date('2026-06-11T08:00:00Z')), 'unknown');
  assert.equal(H.offerStatus(u, new Date('2026-07-11T08:00:00Z')), 'expired');
  assert.equal(H.offerStatus({ ...o, validFrom: '2026-06-12' }, new Date('2026-06-10T12:00:00Z')), 'upcoming');
});

test('PrijsProfeet normalisation only shows savings when original price is reliable', () => {
  const a = H.normalizePrijsProfeet({ product_id: '1', name: 'Pasta', price: 1.5, original_price: 2, retailer: 'jumbo', ean: '123' }, '2026-06-01T00:00:00Z');
  assert.equal(a.discountPercentage, 25);
  assert.equal(a.savings, 0.5);
  const b = H.normalizePrijsProfeet({ product_id: '2', name: 'Pasta', price: 1.5, original_price: null, retailer: 'jumbo' });
  assert.equal(b.originalPrice, null);
  assert.equal(b.discountPercentage, null);
  const c = H.normalizePrijsProfeet({ product_id: '3', name: 'x', price: 3, original_price: 2, retailer: 'a' });
  assert.equal(c.originalPrice, null);
});

test('merge dedupes across sources and archives expired offers', () => {
  const now = new Date('2026-06-10T10:00:00Z');
  const a = { source: 'prijsprofeet', name: 'Pasta', ean: '123', retailer: 'jumbo', price: 1.5, validUntil: '2026-06-14', lastChecked: '2026-06-09T00:00:00Z' };
  const b = { source: 'import', name: 'Pasta 500g', ean: '123', retailer: 'jumbo', price: 1.5, validUntil: null, lastChecked: '2026-06-10T00:00:00Z' };
  const old = { source: 'prijsprofeet', name: 'Oud', ean: '9', retailer: 'jumbo', price: 1, validUntil: '2026-06-01', lastChecked: '2026-05-30T00:00:00Z' };
  const r = H.mergeOffers([a, old], [b], now);
  assert.equal(r.active.length, 1);
  assert.deepEqual(r.active[0].sources.sort(), ['import', 'prijsprofeet']);
  assert.equal(r.active[0].validUntil, '2026-06-14');
  assert.equal(r.archive.length, 1);
});

test('price comparison per unit flags non-identical packaging', () => {
  const offers = [
    { name: 'Cola', brand: 'X', ean: '1', retailer: 'a', price: 2, quantity: '1,5 l' },
    { name: 'Cola', brand: 'X', ean: '1', retailer: 'b', price: 1.2, quantity: '1 l' },
    { name: 'Thee', brand: 'Y', retailer: 'a', price: 1, quantity: '20 stuks' }
  ];
  const [c] = H.comparePrices(offers);
  assert.equal(H.comparePrices(offers).length, 1);
  assert.equal(c.lowest.offer.retailer, 'b');
  assert.equal(c.sameSize, false);
  assert.match(c.note, /andere inhoud/);
  assert.deepEqual(H.parseQuantity('500 g'), { amount: 0.5, base: 'kg' });
});

test('quote rotation is slow and stable', () => {
  assert.equal(H.quoteIndex(0, 5, 60000), H.quoteIndex(59999, 5, 60000));
  assert.notEqual(H.quoteIndex(0, 5, 60000), H.quoteIndex(60000, 5, 60000));
  assert.equal(H.quoteIndex(1, 0, 60000), -1);
});
