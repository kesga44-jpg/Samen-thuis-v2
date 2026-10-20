const test = require('node:test'), assert = require('node:assert');
const fs = require('node:fs');
const d = __dirname + '/supabase/';
const up = fs.readFileSync(d + 'migrations/20261014000000_household_state_sync.sql', 'utf8').replace(/--.*$/gm, '');
test('household_state: RLS aan, geen anon, geen directe schrijfrechten', () => {
  assert.match(up, /enable row level security/);
  assert.match(up, /revoke all on public\.household_state from anon, authenticated/);
  assert.match(up, /grant select on public\.household_state to authenticated/);
  assert.doesNotMatch(up, /grant[^;]*(insert|update|delete)[^;]*household_state/i);
  assert.doesNotMatch(up, /to anon/);
});
test('migratie is niet destructief en raakt household_data/coach_data niet aan', () => {
  assert.doesNotMatch(up, /\b(truncate|delete from)\b/i);
  assert.doesNotMatch(up, /drop table/i);
  assert.doesNotMatch(up, /coach_data/);
  assert.doesNotMatch(up, /(insert into|update|alter table) public\.household_data/i);
});
test('schrijffunctie controleert lidmaatschap en versie', () => {
  assert.match(up, /is_household_member\(p_household\)/);
  assert.match(up, /40001/);
});
test('anon-revoke staat buiten migrations (handmatige fase 3)', () => {
  assert.ok(fs.existsSync(d + 'manual/phase3_revoke_anon_household_data.sql'));
  for (const f of fs.readdirSync(d + 'migrations').filter(n => !n.includes('rollback'))) assert.doesNotMatch(fs.readFileSync(d + 'migrations/' + f, 'utf8').replace(/--.*$/gm, ''), /revoke[^;]*public\.household_data\b/i, f);
  assert.ok(fs.existsSync(d + 'migrations/20261014000000_household_state_sync.rollback.sql'));
});
