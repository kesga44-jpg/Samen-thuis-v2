const test = require('node:test'), assert = require('node:assert');
const F = require('./freezer-core.js');
const T = '2026-10-19';
test('add merges identical batches and validates', () => {
  const l = [];
  assert.equal(F.add(l, { title: '', portions: 2 }, T).ok, false);
  F.add(l, { title: 'Chili', portions: 2, frozen: T }, T);
  assert.ok(F.add(l, { title: 'chili', portions: 3, frozen: T }, T).merged);
  assert.equal(l.length, 1); assert.equal(l[0].portions, 5);
});
test('consume is idempotent per ref and bounded', () => {
  const l = []; const i = F.add(l, { title: 'Soep', portions: 3 }, T).item;
  assert.ok(F.consume(i, 'eaten', 1, 'meal:1').ok); assert.ok(F.consume(i, 'eaten', 1, 'meal:1').skipped);
  assert.equal(i.portions, 2); assert.equal(F.consume(i, 'discarded', 5).ok, false);
});
test('move splits batch', () => {
  const l = []; const i = F.add(l, { title: 'Soep', portions: 4 }, T).item;
  F.move(l, i, 'Koelkast', 1); assert.equal(i.portions, 3); assert.equal(l.length, 2);
});
test('sort first-to-use and summary', () => {
  const l = []; F.add(l, { title: 'B', portions: 1, bestBefore: '2026-12-01' }, T); F.add(l, { title: 'A', portions: 1, bestBefore: '2026-10-25' }, T);
  assert.equal(F.sortFilter(l, {}, T)[0].title, 'A'); assert.equal(F.summary(l, T).urgent, 1);
});
test('missing ingredients', () => {
  assert.deepEqual(F.missingIngredients('250 g rijst, ui, ui', [{ title: 'Rijst', amount: 1 }], []), ['ui']);
});
