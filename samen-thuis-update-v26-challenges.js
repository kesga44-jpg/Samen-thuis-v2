/* Samen Thuis v26 — Universele Challenges, Streaks, Punten & Beloningen
   Add-on voor de bestaande Samen Thuis-app.
   Ontworpen als losse uitbreiding: bestaande app.js, v16-huishoudlogica,
   bestaande localStorage-data en bestaande styling worden niet overschreven.
*/
(() => {
  'use strict';
  if (window.__ST_V26_CHALLENGES__) return;
  window.__ST_V26_CHALLENGES__ = true;

  const KEY = 'samenThuisChallengesV26';
  const PEOPLE = ['Samen', 'Kees', 'Daphne'];
  const CATEGORIES = ['Sport & bewegen', 'Gezondheid', 'Lezen', 'Leren & vaardigheden', 'Huishouden', 'Samen doen', 'Mindfulness', 'Eigen challenge'];
  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };
  const uid = () => 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2,8);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeParse = () => {
    try {
      const x = JSON.parse(localStorage.getItem(KEY) || '{}');
      return {
        challenges: Array.isArray(x.challenges) ? x.challenges : [],
        rewards: Array.isArray(x.rewards) ? x.rewards : defaultRewards(),
        ledger: Array.isArray(x.ledger) ? x.ledger : [],
        balance: Number.isFinite(Number(x.balance)) ? Number(x.balance) : 0
      };
    } catch (_) {
      return {challenges:[], rewards:defaultRewards(), ledger:[], balance:0};
    }
  };
  function defaultRewards() {
    return [
      {id:uid(), title:'Massage geven of krijgen', cost:120, note:'Plan samen een rustig moment.'},
      {id:uid(), title:'Date-avond kiezen', cost:180, note:'De winnaar kiest de activiteit.'},
      {id:uid(), title:'Ontbijt op bed', cost:150, note:'Inclusief favoriete ontbijt.'},
      {id:uid(), title:'Uurtje helemaal vrij', cost:100, note:'De ander neemt even iets uit handen.'},
      {id:uid(), title:'Kleine verrassing', cost:200, note:'Binnen het afgesproken budget.'}
    ];
  }
  let state = safeParse();
  let activeFilter = 'Alles';
  let draftEditing = null;
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  function balance() { return state.balance; }

  function dateDiff(a,b) {
    const x = new Date(a+'T12:00:00'), y = new Date(b+'T12:00:00');
    return Math.round((y-x)/86400000);
  }
  function streakFor(challenge) {
    const dates = [...new Set((challenge.checkins || []).map(x => x.date))].sort();
    if (!dates.length) return 0;
    let cursor = dates.includes(today()) ? today() : dates[dates.length-1];
    if (dateDiff(cursor, today()) > 1) return 0;
    let count = 0;
    while (dates.includes(cursor)) { count++; const d = new Date(cursor+'T12:00:00'); d.setDate(d.getDate()-1); cursor = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
    return count;
  }
  function earnedFor(challenge) {
    return (challenge.checkins || []).reduce((n,x)=>n+Number(x.points||0),0);
  }
  function log(kind, title, points) {
    state.ledger.unshift({id:uid(), date:today(), kind, title, points:Number(points)||0});
    state.ledger = state.ledger.slice(0,300);
  }
  function addChallenge(form) {
    const title = form.querySelector('[name="title"]').value.trim();
    if (!title) { alert('Geef je challenge een naam.'); return; }
    const points = Math.max(1, Math.min(500, Number(form.querySelector('[name="points"]').value)||10));
    const target = Math.max(1, Math.min(365, Number(form.querySelector('[name="target"]').value)||1));
    const obj = {
      id: draftEditing || uid(), title,
      category: form.querySelector('[name="category"]').value,
      person: form.querySelector('[name="person"]').value,
      frequency: form.querySelector('[name="frequency"]').value,
      points, target,
      description: form.querySelector('[name="description"]').value.trim(),
      startDate: today(), active: true, checkins: draftEditing ? (state.challenges.find(x=>x.id===draftEditing)?.checkins||[]) : []
    };
    if (draftEditing) state.challenges = state.challenges.map(x=>x.id===draftEditing?obj:x);
    else state.challenges.unshift(obj);
    draftEditing = null; save(); renderPage();
  }
  function checkIn(id) {
    const c = state.challenges.find(x=>x.id===id);
    if (!c || !c.active) return;
    c.checkins ||= [];
    if (c.checkins.some(x=>x.date===today())) { alert('Deze challenge is vandaag al afgevinkt. Zo tellen punten niet dubbel.'); return; }
    c.checkins.push({date:today(), points:c.points});
    state.balance += c.points;
    log('verdiend', c.title, c.points);
    save(); renderPage();
  }
  function deleteChallenge(id) {
    const c = state.challenges.find(x=>x.id===id);
    if (!c || !confirm(`Challenge “${c.title}” verwijderen? De eerder verdiende punten blijven staan.`)) return;
    state.challenges = state.challenges.filter(x=>x.id!==id); save(); renderPage();
  }
  function addReward(form) {
    const title = form.querySelector('[name="rewardTitle"]').value.trim();
    const cost = Math.max(1, Math.min(100000, Number(form.querySelector('[name="rewardCost"]').value)||1));
    if (!title) { alert('Geef de beloning een naam.'); return; }
    state.rewards.push({id:uid(), title, cost, note:form.querySelector('[name="rewardNote"]').value.trim()});
    save(); renderPage();
  }
  function redeem(id) {
    const r = state.rewards.find(x=>x.id===id);
    if (!r) return;
    if (balance() < r.cost) { alert(`Je hebt nog ${r.cost-balance()} punten nodig.`); return; }
    if (!confirm(`Beloning inwisselen: ${r.title} voor ${r.cost} punten?`)) return;
    state.balance -= r.cost;
    log('ingewisseld', r.title, -r.cost);
    save(); renderPage();
  }
  function deleteReward(id) {
    if (!confirm('Deze beloning verwijderen?')) return;
    state.rewards = state.rewards.filter(x=>x.id!==id); save(); renderPage();
  }
  function addNav() {
    const navs = document.querySelectorAll('.sidebar nav,.side-nav,.nav-list,.mobile-nav,.bottom-nav');
    navs.forEach(nav => {
      if (nav.querySelector('[data-st26-nav]')) return;
      const b = document.createElement('button');
      b.type = 'button'; b.dataset.st26Nav = '';
      b.className = nav.querySelector('button')?.className || '';
      b.innerHTML = '<span aria-hidden="true">✦</span> <span>Challenges</span>';
      b.style.cssText = 'cursor:pointer;';
      nav.appendChild(b);
    });
  }
  function card(c) {
    const done = (c.checkins||[]).some(x=>x.date===today());
    const streak = streakFor(c);
    const total = earnedFor(c);
    const pct = Math.min(100, Math.round((c.checkins||[]).length / c.target * 100));
    return `<article class="st26-card">
      <div class="st26-cardhead"><div><span class="st26-tag">${esc(c.category)}</span><h3>${esc(c.title)}</h3><p>${esc(c.person)} · ${esc(c.frequency)} · ${c.points} punten per keer</p></div><button type="button" data-st26-edit="${esc(c.id)}" aria-label="Challenge bewerken">Bewerk</button></div>
      ${c.description?`<p>${esc(c.description)}</p>`:''}
      <div class="st26-stats"><span>🔥 ${streak} ${streak===1?'dag':'dagen'} streak</span><span>✓ ${(c.checkins||[]).length}/${c.target} keer</span><span>★ ${total} punten verdiend</span></div>
      <div class="st26-progress"><span style="width:${pct}%"></span></div>
      <div class="st26-actions"><button type="button" class="st26-primary" data-st26-check="${esc(c.id)}" ${done?'disabled':''}>${done?'Vandaag afgevinkt':'✓ Challenge afvinken'} ${done?'':'(+'+c.points+')'}</button><button type="button" data-st26-delete="${esc(c.id)}">Verwijderen</button></div>
    </article>`;
  }
  function renderPage() {
    const view = document.querySelector('#view');
    if (!view) return;
    const filters = ['Alles', ...CATEGORIES];
    const shown = state.challenges.filter(c=>activeFilter==='Alles'||c.category===activeFilter);
    const earned = state.ledger.filter(x=>x.kind==='verdiend').reduce((n,x)=>n+x.points,0);
    const spent = Math.abs(state.ledger.filter(x=>x.kind==='ingewisseld').reduce((n,x)=>n+x.points,0));
    view.innerHTML = `<section class="st26-page">
      <header class="st26-hero"><div><p class="st26-eyebrow">SAMEN THUIS · SPELEN & GROEIEN</p><h1>Challenges & beloningen</h1><p>Niet alleen het huishouden: sporten, wandelen, lezen, leren, gezonde gewoontes en challenges voor elkaar.</p></div><div class="st26-balance"><small>JULLIE PUNTENPOT</small><strong>${balance()} ★</strong><span>Verdiend ${earned} · Ingewisseld ${spent}</span></div></header>
      <div class="st26-tabs"><button type="button" data-st26-tab="challenges" class="is-active">Challenges & streaks</button><button type="button" data-st26-tab="rewards">Beloningen</button><button type="button" data-st26-tab="history">Puntenhistorie</button></div>
      <div data-st26-panel="challenges">
        <form class="st26-form" data-st26-challenge-form>
          <h2>${draftEditing?'Challenge bewerken':'Nieuwe challenge maken'}</h2>
          <label>Naam<input name="title" required maxlength="90" placeholder="Bijv. 20 minuten wandelen"></label>
          <div class="st26-grid">
            <label>Categorie<select name="category">${CATEGORIES.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label>
            <label>Voor wie?<select name="person">${PEOPLE.map(x=>`<option>${x}</option>`).join('')}</select></label>
            <label>Frequentie<select name="frequency"><option>Dagelijks</option><option>Wekelijks</option><option>Eenmalig</option><option>Eigen ritme</option></select></label>
            <label>Punten per keer<input name="points" type="number" min="1" max="500" value="10" required></label>
            <label>Doel aantal keer<input name="target" type="number" min="1" max="365" value="7" required></label>
          </div>
          <label>Omschrijving (optioneel)<textarea name="description" rows="2" placeholder="Wat telt als voltooid?"></textarea></label>
          <div class="st26-actions"><button class="st26-primary" type="submit">${draftEditing?'Wijzigingen opslaan':'Challenge toevoegen'}</button>${draftEditing?'<button type="button" data-st26-cancel-edit>Annuleren</button>':''}</div>
        </form>
        <div class="st26-filter">${filters.map(f=>`<button type="button" data-st26-filter="${esc(f)}" class="${activeFilter===f?'is-active':''}">${esc(f)}</button>`).join('')}</div>
        <div class="st26-list">${shown.length?shown.map(card).join(''):'<div class="st26-empty"><strong>Nog geen challenges</strong><p>Voeg er één toe of begin met wandelen, sporten, lezen of iets leuks samen.</p></div>'}</div>
      </div>
      <div data-st26-panel="rewards" hidden>
        <form class="st26-form" data-st26-reward-form><h2>Eigen beloning toevoegen</h2>
          <label>Beloning<input name="rewardTitle" required placeholder="Bijv. zelf een date kiezen"></label>
          <div class="st26-grid"><label>Kosten in punten<input name="rewardCost" type="number" min="1" value="100" required></label><label>Notitie (optioneel)<input name="rewardNote" placeholder="Afspraken of budget"></label></div>
          <button class="st26-primary" type="submit">Beloning toevoegen</button>
        </form>
        <div class="st26-rewards">${state.rewards.map(r=>`<article class="st26-card st26-reward"><div><span class="st26-tag">BELONING</span><h3>${esc(r.title)}</h3><p>${esc(r.note||'Een beloning die jullie zelf afspreken.')}</p><strong>★ ${r.cost} punten</strong></div><div class="st26-actions"><button type="button" class="st26-primary" data-st26-redeem="${esc(r.id)}" ${balance()<r.cost?'disabled':''}>Inwisselen</button><button type="button" data-st26-delreward="${esc(r.id)}">Verwijderen</button></div></article>`).join('')}</div>
        <p class="st26-note">Tip: spreek samen af wat een beloning betekent en houd eventuele kosten binnen jullie eigen budget.</p>
      </div>
      <div data-st26-panel="history" hidden>
        <div class="st26-card"><h2>Puntenhistorie</h2>${state.ledger.length?`<div class="st26-history">${state.ledger.map(x=>`<div><span><b>${esc(x.title)}</b><small>${esc(x.date)} · ${x.kind==='verdiend'?'Punten verdiend':'Beloning ingewisseld'}</small></span><strong class="${x.points<0?'st26-negative':'st26-positive'}">${x.points>0?'+':''}${x.points} ★</strong></div>`).join('')}</div>`:'<p>Nog geen puntenbewegingen.</p>'}</div>
      </div>
      <p class="st26-note">Punten en streaks gelden voor alle soorten challenges. Per challenge kan je maar één keer per dag punten verdienen. Deze uitbreiding bewaart haar gegevens apart en verandert bestaande huishoudtaken en hun historie niet.</p>
    </section>`;
    view.querySelectorAll('[data-st26-tab]').forEach(b=>b.addEventListener('click',()=>{
      view.querySelectorAll('[data-st26-tab]').forEach(x=>x.classList.toggle('is-active',x===b));
      view.querySelectorAll('[data-st26-panel]').forEach(x=>x.hidden=x.dataset.st26Panel!==b.dataset.st26Tab);
    }));
    view.querySelector('[data-st26-challenge-form]')?.addEventListener('submit',e=>{e.preventDefault();addChallenge(e.currentTarget);});
    view.querySelector('[data-st26-reward-form]')?.addEventListener('submit',e=>{e.preventDefault();addReward(e.currentTarget);});
    view.querySelectorAll('[data-st26-check]').forEach(b=>b.addEventListener('click',()=>checkIn(b.dataset.st26Check)));
    view.querySelectorAll('[data-st26-delete]').forEach(b=>b.addEventListener('click',()=>deleteChallenge(b.dataset.st26Delete)));
    view.querySelectorAll('[data-st26-redeem]').forEach(b=>b.addEventListener('click',()=>redeem(b.dataset.st26Redeem)));
    view.querySelectorAll('[data-st26-delreward]').forEach(b=>b.addEventListener('click',()=>deleteReward(b.dataset.st26Delreward)));
    view.querySelectorAll('[data-st26-filter]').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.st26Filter;renderPage();}));
    view.querySelectorAll('[data-st26-edit]').forEach(b=>b.addEventListener('click',()=>{
      const c=state.challenges.find(x=>x.id===b.dataset.st26Edit); if(!c)return;
      draftEditing=c.id; renderPage();
      const f=view.querySelector('[data-st26-challenge-form]');
      ['title','category','person','frequency','points','target','description'].forEach(k=>{if(f.elements[k])f.elements[k].value=c[k]??'';});
      f.scrollIntoView({behavior:'smooth',block:'start'});
    }));
    view.querySelector('[data-st26-cancel-edit]')?.addEventListener('click',()=>{draftEditing=null;renderPage();});
  }
  function style() {
    if (document.getElementById('st26-css')) return;
    const s=document.createElement('style'); s.id='st26-css'; s.textContent=`
      .st26-page{max-width:1050px;margin:0 auto;padding:8px 0 36px;color:var(--text,#172b42)}
      .st26-hero{display:flex;gap:20px;align-items:stretch;justify-content:space-between;flex-wrap:wrap;padding:22px;border-radius:24px;background:linear-gradient(135deg,rgba(71,117,174,.13),rgba(133,105,188,.13));border:1px solid rgba(82,111,154,.18)}
      .st26-hero h1{font-size:clamp(1.6rem,4vw,2.3rem);margin:5px 0 8px}.st26-hero p{max-width:640px;margin:0;line-height:1.55}
      .st26-eyebrow,.st26-tag{font-size:.72rem;letter-spacing:.08em;font-weight:800;opacity:.72}.st26-balance{min-width:180px;padding:16px;border-radius:18px;background:rgba(255,255,255,.72);display:flex;flex-direction:column;gap:5px;justify-content:center}
      .st26-balance strong{font-size:2rem}.st26-balance span,.st26-note{font-size:.85rem;opacity:.72}
      .st26-tabs,.st26-filter{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}.st26-page button{border:1px solid rgba(72,104,145,.22);border-radius:12px;padding:9px 13px;background:rgba(255,255,255,.7);color:inherit;font:inherit;cursor:pointer}
      .st26-page button.is-active,.st26-page .st26-primary{background:#244d77;color:white;border-color:#244d77}.st26-page button:disabled{opacity:.45;cursor:not-allowed}
      .st26-form,.st26-card{border:1px solid rgba(72,104,145,.18);border-radius:18px;padding:16px;margin:12px 0;background:rgba(255,255,255,.66);box-shadow:0 4px 18px rgba(23,43,66,.04)}
      .st26-form h2,.st26-card h3{margin:4px 0 12px}.st26-form label{display:flex;flex-direction:column;gap:6px;font-size:.9rem;margin:10px 0}
      .st26-form input,.st26-form select,.st26-form textarea{width:100%;box-sizing:border-box;border:1px solid rgba(72,104,145,.25);border-radius:10px;padding:10px;background:rgba(255,255,255,.9);color:#172b42;font:inherit}
      .st26-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 12px}.st26-cardhead{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.st26-card p{margin:5px 0 12px;opacity:.75}
      .st26-stats{display:flex;gap:10px;flex-wrap:wrap;font-size:.86rem;margin:12px 0}.st26-progress{height:7px;border-radius:99px;background:rgba(90,112,145,.15);overflow:hidden}.st26-progress span{display:block;height:100%;background:linear-gradient(90deg,#477bb5,#8b72bd)}
      .st26-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.st26-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px 12px}.st26-reward{display:flex;justify-content:space-between;gap:12px;align-items:center}
      .st26-history>div{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid rgba(72,104,145,.12)}.st26-history small{display:block;opacity:.65;margin-top:4px}.st26-positive{color:#28785e}.st26-negative{color:#a64b53}
      .st26-empty{padding:24px;text-align:center;border:1px dashed rgba(72,104,145,.3);border-radius:18px}.st26-note{line-height:1.55;margin:16px 2px}
      @media(max-width:650px){.st26-grid,.st26-list{grid-template-columns:1fr}.st26-hero{padding:16px}.st26-reward{align-items:flex-start;flex-direction:column}.st26-balance{width:100%;box-sizing:border-box}.st26-page{padding-bottom:24px}}
    `;
    document.head.appendChild(s);
  }
  const baseRender = typeof render === 'function' ? render : null;
  if (baseRender) {
    render = function(...args) {
      const result = baseRender.apply(this,args);
      requestAnimationFrame(() => {
        style(); addNav();
        if (window.__ST_V26_OPEN__) renderPage();
      });
      return result;
    };
  }
  document.addEventListener('click', e => {
    if (e.target.closest('[data-st26-nav]')) {
      e.preventDefault();
      window.__ST_V26_OPEN__ = true;
      if (typeof current !== 'undefined') current = 'challenges';
      renderPage();
      return;
    }
    const nav = e.target.closest('[data-view]');
    if (nav && window.__ST_V26_OPEN__) {
      window.__ST_V26_OPEN__ = false;
    }
  }, true);
  // Add a standalone entry point without altering the app's existing page list.
  document.addEventListener('DOMContentLoaded', () => { style(); addNav(); });
  save();
  console.info('Samen Thuis v26 Challenges geladen');
})();
