const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('./offers-core.js');

const api = core.KNOWN_CATEGORIES.map((c, i) => ({ ...c, count: 10 + i }));

test('25 known categories are grouped into five groups from the API group field', () => {
  assert.equal(api.length, 25);
  const groups = core.buildCategoryGroups(api);
  assert.deepEqual(groups.map(g => g.id), ['vers', 'houdbaar', 'dranken', 'verzorging', 'overig']);
  assert.deepEqual(groups.map(g => g.categories.length), [7, 4, 3, 7, 4]);
  assert.equal(core.categoryBySlug(groups, 'kaas').name, 'Kaas & Vleeswaren');
  assert.equal(core.categoryBySlug(groups, 'kaas').count, 13);
});

test('new, unknown-group and duplicate categories are kept without crashing', () => {
  const groups = core.buildCategoryGroups([...api, { slug: 'nieuw', name: 'Nieuw', group: 'vers' }, { slug: 'x', name: 'X', group: 'extra' }, { slug: 'kaas', name: 'dup', group: 'vers' }, { slug: 'nogroup', name: 'Zonder' }]);
  assert.equal(groups.find(g => g.id === 'vers').categories.at(-1).slug, 'nieuw');
  assert.equal(groups.find(g => g.id === 'vers').categories.filter(c => c.slug === 'kaas').length, 1);
  assert.ok(groups.find(g => g.id === 'extra'));
  assert.ok(groups.find(g => g.id === 'overig').categories.some(c => c.slug === 'nogroup'));
  assert.deepEqual(core.buildCategoryGroups(null), []);
});

test('offers are linked via the official slug, not product name', () => {
  const groups = core.buildCategoryGroups(api);
  const choc = core.applyOfficialCategory({ name: 'Melk chocolade', unifiedCategory: 'snoep-koek-chips' }, groups);
  assert.equal(choc.category, 'Snoep, Koek & Chips');
  assert.equal(choc.categoryGroup, 'houdbaar');
  const unknown = core.applyOfficialCategory({ name: 'Melk', unifiedCategory: 'bestaat-niet' }, groups);
  assert.equal(unknown.categoryGroup, 'overig');
  assert.equal(core.applyOfficialCategory({ name: 'Melk' }, groups).category, 'Onbekend');
});

test('category selection and store filters combine', () => {
  const groups = core.buildCategoryGroups(api);
  const offers = [
    { name: 'a', store: 'Jumbo', unifiedCategory: 'zuivel-eieren' },
    { name: 'b', store: 'Lidl', unifiedCategory: 'zuivel-eieren' },
    { name: 'c', store: 'Jumbo', unifiedCategory: 'snoep-koek-chips' }
  ].map(o => core.applyOfficialCategory(o, groups));
  const out = offers.filter(o => core.matchesOfferFilters(o, { stores: ['Jumbo'] }) && core.matchesCategorySelection(o, { categorySlug: 'zuivel-eieren' }));
  assert.deepEqual(out.map(o => o.name), ['a']);
  assert.equal(offers.filter(o => core.matchesCategorySelection(o, { group: 'vers' })).length, 2);
});

test('fetchOffers sends the slug as category and categories request is parsed', async () => {
  let body;
  const ok = payload => async (url, init) => { body = JSON.parse(init.body); return { ok: true, json: async () => payload }; };
  const r = await core.fetchOffers({ query: 'melk', category: 'zuivel-eieren', page: 2, url: 'x', fetchImpl: ok({ offers: [{ name: 'M', price: 1, unifiedCategory: 'zuivel-eieren' }], hasMore: true }) });
  assert.deepEqual(body, { search: 'melk', category: 'zuivel-eieren', page: 2 });
  assert.equal(r.hasMore, true);
  assert.equal(r.offers[0].categorySlug, 'zuivel-eieren');
  const c = await core.fetchCategories({ url: 'x', fetchImpl: ok({ categories: api }) });
  assert.deepEqual(body, { categories: true });
  assert.equal(c.categories.length, 25);
  await assert.rejects(core.fetchCategories({ url: 'x', fetchImpl: ok({ categories: [] }) }));
  await assert.rejects(core.fetchCategories({ url: 'x', fetchImpl: async () => ({ ok: false, status: 503, json: async () => ({}) }) }));
});

test('merging pages does not create duplicates', () => {
  const o = { name: 'M', brand: 'B', size: '1l', store: 'Jumbo', price: 1 };
  assert.equal(core.mergeOffers([o], [{ ...o }, { ...o, name: 'N' }]).length, 2);
});
