const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./dashboard-core.js');

const widgets = ['weather', 'overview', 'agenda'];

test('dashboard layout restores valid settings and fills newly available widgets', () => {
  assert.deepEqual(D.normalize({ order: ['agenda', 'unknown', 'agenda'], visible: { agenda: false } }, widgets), {
    order: ['agenda', 'weather', 'overview'],
    visible: { weather: true, overview: true, agenda: false }
  });
});

test('dashboard widgets can be hidden, restored, and reordered without invalid ids', () => {
  const initial = D.defaults(widgets);
  const hidden = D.setVisible(initial, 'agenda', false, widgets);
  const moved = D.move(D.move(hidden, 'agenda', -1, widgets), 'agenda', -1, widgets);
  assert.equal(hidden.visible.agenda, false);
  assert.deepEqual(moved.order, ['agenda', 'weather', 'overview']);
  assert.deepEqual(D.move(moved, 'agenda', -1, widgets).order, moved.order);
  assert.deepEqual(D.setVisible(moved, 'missing', true, widgets), moved);
});

test('new optional dashboard widgets stay hidden until selected', () => {
  const initial = D.normalize({ order: ['agenda'], visible: { agenda: false } },
    ['weather', 'agenda', 'tab-budget'], ['weather', 'agenda']);
  assert.deepEqual(initial.visible, { weather: true, agenda: false, 'tab-budget': false });
  const selected = D.setVisible(initial, 'tab-budget', true,
    ['weather', 'agenda', 'tab-budget'], ['weather', 'agenda']);
  assert.equal(selected.visible['tab-budget'], true);
});
