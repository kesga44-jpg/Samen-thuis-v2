const test = require('node:test'), assert = require('node:assert');
const fs = require('node:fs');
const N = require('./nav-core.js');
const OLD = ['today','planning','tasks','groceries','stock','offers','budget19','meals','chores','challenges','weather','programs','ideas','home','trips','auto24','extra19','imports243','settings'];
test('vijf hoofdsecties', () => assert.equal(N.SECTIONS.length, 5));
test('elke bestaande pagina is in precies één sectie bereikbaar', () => {
  const all = N.allPages();
  assert.equal(new Set(all).size, all.length, 'dubbele menu-items');
  for (const p of OLD) assert.ok(N.sectionOf(p), p + ' onbereikbaar');
  assert.equal(all.length, OLD.length);
});
test('standaardpagina en terugweg', () => {
  assert.equal(N.defaultPage('huishouden'), 'meals');
  assert.equal(N.defaultPage('huishouden', 'stock'), 'stock');
  assert.equal(N.defaultPage('huishouden', 'nope'), 'meals');
  assert.equal(N.breadcrumb('stock').parent, 'meals');
  assert.equal(N.breadcrumb('meals').isDefault, true);
  assert.equal(N.breadcrumb('zzz'), null);
});
test('index.html laadt nav-scripts', () => {
  const h = fs.readFileSync(__dirname + '/index.html', 'utf8');
  assert.match(h, /nav-core\.js/); assert.match(h, /nav-groups\.js/);
});
