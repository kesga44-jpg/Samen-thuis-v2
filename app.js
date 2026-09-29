/* Samen Thuis vNext
   Schone geïntegreerde uitbreidingsbuild.
   Behoudt STORAGE_KEY samenThuisDataV2 en onbekende bestaande velden.
*/
const STORAGE_KEY='samenThuisDataV2', LEGACY_STORAGE_KEY='samenThuisDataV1';
const pad=n=>String(n).padStart(2,'0');
const todayISO=()=>{const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
const addDays=(s,n)=>{const d=new Date(`${s}T12:00:00`);d.setDate(d.getDate()+n);return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const fmt=d=>d?new Intl.DateTimeFormat('nl-NL',{weekday:'short',day:'numeric',month:'short'}).format(new Date(`${d}T12:00:00`)):'Geen datum';
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));

const DEFAULT={
 meta:{version:3,updatedAt:new Date().toISOString()},
 planning:[],calendars:[],excludedCalendars:[],meals:[],groceries:[],chores:[],stock:[],ideas:[],home:[],tripFolders:[],tripSections:[],trips:[],dailyAnswers:{},
 tasks:[],
 challenges:[],
 challengeEntries:[],
 pointsLedger:[],
 rewards:[
  {id:'rw1',title:'Film kiezen',cost:100,active:true},
  {id:'rw2',title:'Eten kiezen',cost:150,active:true},
  {id:'rw3',title:'Date door de ander georganiseerd',cost:500,active:true}
 ],
 pointRules:[
  {id:'pr1',title:'Sporten',points:10,active:true},
  {id:'pr2',title:'Boek uitlezen',points:40,active:true},
  {id:'pr3',title:'Nieuwe skill leren',points:50,active:true},
  {id:'pr4',title:'Nieuw gerecht koken',points:10,active:true},
  {id:'pr5',title:'Date organiseren',points:20,active:true}
 ],
 settingsVNext:{theme:'system',accent:'purple',taskRotation:true,stockAutoGroceries:true}
};

function migrate(raw){
 const d=structuredClone(DEFAULT);
 if(raw&&typeof raw==='object') Object.keys(raw).forEach(k=>{try{d[k]=structuredClone(raw[k])}catch{d[k]=raw[k]}});
 for(const k of ['planning','meals','groceries','chores','stock','ideas','home','trips','tripFolders','tripSections','tasks','challenges','challengeEntries','pointsLedger','rewards','pointRules']) if(!Array.isArray(d[k])) d[k]=[];
 if(!d.dailyAnswers||typeof d.dailyAnswers!=='object') d.dailyAnswers={};
 d.settingsVNext={...DEFAULT.settingsVNext,...(d.settingsVNext||{})};
 d.meta={...(d.meta||{}),version:3,updatedAt:d.meta?.updatedAt||new Date().toISOString()};
 return d;
}
function load(){try{return migrate(JSON.parse(localStorage.getItem(STORAGE_KEY)||localStorage.getItem(LEGACY_STORAGE_KEY)||'{}'))}catch{return migrate({})}}
let data=load(), current='today', challengeTab='active';

const pages=[
 ['today','⌂','Today'],['planning','▦','Agenda'],['tasks','☑','Taken'],['meals','♨','Weekmenu'],['groceries','✓','Boodschappen'],
 ['chores','⌁','Huishouden'],['stock','▤','Voorraad'],['trips','✈','Reizen'],['ideas','♡','Date ideeën'],['home','⌂','Woning'],
 ['challenges','🏆','Uitdagingen'],['budget19','€','Budget'],['extra19','＋','Extra'],['settings','⚙','Instellingen']
];
const label=id=>pages.find(x=>x[0]===id)?.[2]||id;
function save(){data.meta.updatedAt=new Date().toISOString();localStorage.setItem(STORAGE_KEY,JSON.stringify(data));const s=document.querySelector('#saveState');if(s){s.textContent='Zojuist bewaard';setTimeout(()=>s.textContent='Lokaal bewaard',1000)}}
function toast(t){const e=document.querySelector('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1800)}
function applyTheme(){const s=data.settingsVNext;const dark=s.theme==='dark'||(s.theme==='system'&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.dataset.theme=dark?'dark':'light';document.documentElement.dataset.accent=s.accent||'purple'}
function nav(){
 document.querySelector('#nav').innerHTML=pages.map(p=>`<button class="nav-item ${current===p[0]?'active':''}" data-go="${p[0]}">${p[1]} ${p[2]}</button>`).join('');
 document.querySelector('#mobileNav').innerHTML=pages.map(p=>`<button class="${current===p[0]?'active':''}" data-go="${p[0]}"><span>${p[1]}</span><small>${p[2]}</small></button>`).join('');
}
function go(v){if(!pages.some(p=>p[0]===v))return;current=v;document.querySelector('#pageTitle').textContent=label(v);document.querySelector('#addBtn').style.display=['today','settings','budget19','extra19'].includes(v)?'none':'';nav();render()}
const progress=(v,max)=>`<div class="progress"><i style="width:${clamp(max?100*v/max:0,0,100)}%"></i></div>`;
const empty=t=>`<div class="empty">${esc(t)}</div>`;
const personBadge=p=>`<span class="tag">${esc(p||'Samen')}</span>`;

function upcomingTasks(){
 const t=todayISO();
 const generic=data.tasks.filter(x=>!x.done&&(!x.due||x.due<=addDays(t,7))).map(x=>({...x,source:'Taak'}));
 const chores=data.chores.filter(x=>!(x.completedDates||[]).includes(t)&&(!x.due||x.due<=t)).map(x=>({id:x.id,title:x.title,due:x.due,person:x.person,source:'Huishouden',kind:'chore'}));
 const home=data.home.filter(x=>x.due&&x.due<=addDays(t,7)).map(x=>({id:x.id,title:x.title,due:x.due,person:'Samen',source:'Woning',kind:'home'}));
 const trips=data.trips.filter(x=>x.checkable&&!x.done&&x.date&&x.date<=addDays(t,14)).map(x=>({id:x.id,title:x.title,due:x.date,person:'Samen',source:'Reizen',kind:'trip'}));
 return [...generic,...chores,...home,...trips].sort((a,b)=>(a.due||'9999').localeCompare(b.due||'9999'));
}
function lowStock(){return data.stock.filter(x=>Number(x.amount||0)<=Number(x.min??x.minimum??0))}
function syncLowStock(){
 if(!data.settingsVNext.stockAutoGroceries)return;
 let n=0;lowStock().forEach(s=>{if(!data.groceries.some(g=>!g.done&&g.title.toLowerCase()===String(s.title).toLowerCase())){data.groceries.push({id:uid(),title:s.title,category:s.category||'Overig',done:false,fromStock:true});n++}});
 if(n){save();toast(`${n} voorraaditem(s) op boodschappenlijst gezet`)}
}
function points(person){return data.pointsLedger.filter(x=>x.person===person).reduce((s,x)=>s+Number(x.points||0),0)}
function activeChallenges(){return data.challenges.filter(c=>c.status!=='done'&&(!c.deadline||c.deadline>=todayISO()))}
function challengeValue(c,person=''){
 return data.challengeEntries.filter(e=>e.challengeId===c.id&&(!person||e.person===person)).reduce((s,e)=>s+Number(e.value||0),0);
}

function renderToday(){
 const t=todayISO(), tasks=upcomingTasks(), events=data.planning.filter(x=>(x.date||x.startDate)===t), meal=data.meals.find(x=>x.date===t);
 const cs=activeChallenges().slice(0,3);
 return `<div class="grid">
 <section class="card dark-card span-12"><p class="eyebrow">VANDAAG</p><h2>${new Intl.DateTimeFormat('nl-NL',{weekday:'long',day:'numeric',month:'long'}).format(new Date())}</h2><p>${tasks.length} aandachtspunt(en) · ${events.length} afspraak/afspraken · ${lowStock().length} voorraaditem(s) laag</p><div class="quick-actions"><button class="primary" data-quick>＋ Snel toevoegen</button><button class="secondary" data-go="tasks">Taken bekijken</button><button class="secondary" data-go="challenges">Challenges</button></div></section>
 <section class="card span-8"><div class="card-head"><div><p class="eyebrow">FOCUS</p><h2>Wat vraagt aandacht?</h2></div><span class="tag">${tasks.length}</span></div>
 ${tasks.length?`<div class="list">${tasks.slice(0,7).map(x=>`<div class="list-item"><div class="item-main"><strong>${esc(x.title)}</strong><small>${esc(x.source)}${x.due?' · '+fmt(x.due):''}</small></div>${personBadge(x.person)}</div>`).join('')}</div>`:empty('Niets urgents.')}
 </section>
 <section class="card span-4"><p class="eyebrow">VANDAAG</p><h2>${meal?esc(meal.title):'Nog geen avondeten'}</h2><p class="muted">${meal?'Staat in het weekmenu.':'Voeg iets toe aan het weekmenu.'}</p><button class="secondary" data-go="meals">Weekmenu</button></section>
 <section class="card span-6"><div class="card-head"><div><p class="eyebrow">AGENDA</p><h2>Vandaag</h2></div></div>${events.length?events.map(e=>`<div class="list-item"><div><strong>${esc(e.title)}</strong><small>${esc(e.time||e.startTime||'Hele dag')}</small></div>${personBadge(e.person)}</div>`).join(''):empty('Geen afspraken vandaag.')}</section>
 <section class="card span-6"><div class="card-head"><div><p class="eyebrow">VOORRAAD</p><h2>Bijna op</h2></div><button class="text-btn" data-stock-sync>Naar boodschappen</button></div>${lowStock().length?lowStock().slice(0,5).map(s=>`<div class="list-item"><strong>${esc(s.title)}</strong><small>${esc(s.amount)} ${esc(s.unit||'')}</small></div>`).join(''):empty('Voorraad is op peil.')}</section>
 <section class="card span-12"><div class="card-head"><div><p class="eyebrow">UITDAGINGEN</p><h2>Jullie progressie</h2></div><span class="tag">Kees ${points('Kees')} XP · Daphne ${points('Daphne')} XP</span></div>
 ${cs.length?`<div class="grid">${cs.map(c=>`<article class="card span-4 challenge-card"><span class="challenge-type">${esc(c.mode||'Challenge')}</span><h3>${esc(c.title)}</h3>${progress(challengeValue(c),Number(c.target||1))}<small>${challengeValue(c)} / ${c.target} ${esc(c.unit||'')}</small></article>`).join('')}</div>`:empty('Nog geen actieve uitdagingen.')}</section>
 </div>`;
}

function genericPage(key,title,subtitle){
 const arr=data[key]||[];
 return `<section class="card"><div class="card-head"><div><p class="eyebrow">${esc(subtitle)}</p><h2>${esc(title)}</h2></div><span class="tag">${arr.length}</span></div>${arr.length?`<div class="list">${arr.map(x=>`<div class="list-item"><div class="item-main"><strong>${esc(x.title||x.name||'Item')}</strong><small>${esc(x.date||x.due||x.category||x.note||'')}</small></div><button class="text-btn" data-delete="${key}:${x.id}">×</button></div>`).join('')}</div>`:empty('Nog niets toegevoegd.')}</section>`;
}
function renderPlanning(){return genericPage('planning','Agenda','PLANNING')}
function renderMeals(){return genericPage('meals','Weekmenu','ETEN')}
function renderGroceries(){return `<section class="card"><div class="card-head"><div><p class="eyebrow">BOODSCHAPPEN</p><h2>Lijst</h2></div><button class="secondary" data-stock-sync>Voorraad aanvullen</button></div>${data.groceries.length?`<div class="list">${data.groceries.map(x=>`<label class="list-item"><div class="item-main"><strong>${esc(x.title)}</strong><small>${esc(x.category||'Overig')}</small></div><input class="check" type="checkbox" data-grocery="${x.id}" ${x.done?'checked':''}></label>`).join('')}</div>`:empty('Lijst is leeg.')}</section>`}
function renderChores(){return genericPage('chores','Huishouden','THUIS')}
function renderStock(){return `<section class="card"><div class="card-head"><div><p class="eyebrow">VOORRAAD</p><h2>In huis</h2></div><button class="secondary" data-stock-sync>Vul boodschappen aan</button></div>${data.stock.length?`<div class="list">${data.stock.map(x=>`<div class="list-item"><div class="item-main"><strong>${esc(x.title)}</strong><small>${esc(x.category||'')} · minimum ${esc(x.min??x.minimum??0)}</small></div><div class="button-row"><button class="secondary" data-stock-dec="${x.id}">−</button><b>${Number(x.amount||0)}</b><button class="secondary" data-stock-inc="${x.id}">+</button></div></div>`).join('')}</div>`:empty('Nog geen voorraad.')}</section>`}
function renderTrips(){return genericPage('trips','Reizen','PLANNEN')}
function renderIdeas(){return genericPage('ideas','Date ideeën','SAMEN')}
function renderHome(){return genericPage('home','Woning','ONDERHOUD & INFO')}

function renderTasks(){
 const open=data.tasks.filter(x=>!x.done), done=data.tasks.filter(x=>x.done);
 return `<div class="grid"><section class="card span-8"><div class="card-head"><div><p class="eyebrow">TAKEN</p><h2>Open</h2></div><span class="tag">${open.length}</span></div>${open.length?`<div class="list">${open.sort((a,b)=>(a.due||'9999').localeCompare(b.due||'9999')).map(x=>`<label class="list-item"><div class="item-main"><strong>${esc(x.title)}</strong><small>${x.due?fmt(x.due):'Geen deadline'} · ${esc(x.category||'Algemeen')}</small></div>${personBadge(x.person)}<input class="check" type="checkbox" data-task="${x.id}"></label>`).join('')}</div>`:empty('Geen open taken.')}</section>
 <section class="card span-4"><p class="eyebrow">VERDELING</p><h2>Wie heeft wat?</h2><div class="metric-grid"><div class="metric"><small>Kees</small><div class="stat">${open.filter(x=>x.person==='Kees').length}</div></div><div class="metric"><small>Daphne</small><div class="stat">${open.filter(x=>x.person==='Daphne').length}</div></div></div><p class="muted">Taken kunnen persoonlijk, gezamenlijk of terugkerend zijn.</p></section>
 ${done.length?`<section class="card span-12"><h3>Recent afgerond</h3>${done.slice(-5).reverse().map(x=>`<div class="list-item"><span>${esc(x.title)}</span><small>${esc(x.person||'Samen')}</small></div>`).join('')}</section>`:''}</div>`;
}
function renderChallenges(){
 const list=challengeTab==='done'?data.challenges.filter(c=>c.status==='done'):activeChallenges();
 return `<div class="grid"><section class="card span-12"><div class="card-head"><div><p class="eyebrow">GROEI & PLEZIER</p><h2>Uitdagingen</h2></div><div class="button-row"><button class="primary" data-new-challenge>＋ Challenge</button><button class="secondary" data-log-points>＋ Punten</button></div></div>
 <div class="metric-grid"><div class="metric"><small>Kees</small><div class="stat">${points('Kees')} XP</div></div><div class="metric"><small>Daphne</small><div class="stat">${points('Daphne')} XP</div></div><div class="metric"><small>Samen verdiend</small><div class="stat">${points('Samen')} XP</div></div></div></section>
 <section class="card span-8"><div class="tabs"><button class="${challengeTab==='active'?'primary':'secondary'}" data-ch-tab="active">Actief</button><button class="${challengeTab==='done'?'primary':'secondary'}" data-ch-tab="done">Voltooid</button></div>
 ${list.length?`<div class="list">${list.map(c=>{const v=challengeValue(c);return `<article class="list-item challenge-card"><div class="item-main"><span class="challenge-type">${esc(c.mode||'Persoonlijk')} · ${esc(c.person||'Samen')}</span><strong>${esc(c.title)}</strong>${progress(v,Number(c.target||1))}<small>${v} / ${c.target} ${esc(c.unit||'')} ${c.deadline?'· vóór '+fmt(c.deadline):''} · ${Number(c.rewardPoints||0)} XP</small></div><div class="button-row">${c.status!=='done'?`<button class="secondary" data-progress-ch="${c.id}">+ voortgang</button><button class="primary" data-finish-ch="${c.id}">✓</button>`:''}</div></article>`}).join('')}</div>`:empty('Geen challenges in deze lijst.')}</section>
 <section class="card span-4"><div class="card-head"><div><p class="eyebrow">BELONINGEN</p><h2>Punten gebruiken</h2></div></div>${data.rewards.filter(r=>r.active!==false).map(r=>`<div class="list-item reward"><div><strong>${esc(r.title)}</strong><small>${r.cost} punten</small></div><button class="secondary" data-redeem="${r.id}">Inwisselen</button></div>`).join('')||empty('Geen beloningen.')}</section>
 <section class="card span-12"><div class="card-head"><div><p class="eyebrow">PUNTENREGELS</p><h2>Waar verdien je XP mee?</h2></div></div><div class="list">${data.pointRules.filter(r=>r.active!==false).map(r=>`<div class="list-item"><strong>${esc(r.title)}</strong><span class="points">+${r.points} XP</span></div>`).join('')}</div></section></div>`;
}
function renderBudget(){return `<section class="card"><p class="eyebrow">BUDGET</p><h2>Bestaande budgetdata blijft behouden</h2><p>De financiële objecten uit eerdere versies blijven in <code>samenThuisDataV2</code> staan. Deze vNext-laag verwijdert of overschrijft ze niet.</p></section>`}
function renderExtra(){return `<section class="card"><p class="eyebrow">EXTRA</p><h2>Snelkoppelingen</h2><div class="quick-actions"><button class="secondary" data-go="challenges">🏆 Uitdagingen</button><button class="secondary" data-go="tasks">☑ Taken</button><button class="secondary" data-go="home">⌂ Woning</button></div></section>`}
function renderSettings(){
 const s=data.settingsVNext;
 return `<div class="grid"><section class="card span-6"><p class="eyebrow">WEERGAVE</p><h2>Op dit apparaat</h2><div class="form-grid"><label class="field">Thema<select data-setting="theme"><option value="system" ${s.theme==='system'?'selected':''}>Systeem</option><option value="light" ${s.theme==='light'?'selected':''}>Licht</option><option value="dark" ${s.theme==='dark'?'selected':''}>Donker</option></select></label><label class="field">Accent<select data-setting="accent"><option value="blue" ${s.accent==='blue'?'selected':''}>Blauw</option><option value="purple" ${s.accent==='purple'?'selected':''}>Paars</option><option value="orange" ${s.accent==='orange'?'selected':''}>Oranje</option></select></label></div></section>
 <section class="card span-6"><p class="eyebrow">AUTOMATISERING</p><h2>Slimme koppelingen</h2><label class="list-item"><span>Lage voorraad automatisch naar boodschappen</span><input type="checkbox" data-setting-check="stockAutoGroceries" ${s.stockAutoGroceries?'checked':''}></label><label class="list-item"><span>Taakroulatie gebruiken</span><input type="checkbox" data-setting-check="taskRotation" ${s.taskRotation?'checked':''}></label></section>
 <section class="card span-12"><p class="eyebrow">DATA</p><h2>Data-veilig</h2><p>De app blijft dezelfde lokale opslagkey gebruiken. Onbekende velden uit oudere versies worden bij migratie behouden. Gebruik daarnaast regelmatig de JSON-back-up.</p><div class="button-row"><button class="secondary" data-action="backup">Back-up maken</button><button class="secondary" data-action="restore">Back-up laden</button></div></section></div>`;
}
function render(){
 const f={today:renderToday,planning:renderPlanning,tasks:renderTasks,meals:renderMeals,groceries:renderGroceries,chores:renderChores,stock:renderStock,trips:renderTrips,ideas:renderIdeas,home:renderHome,challenges:renderChallenges,budget19:renderBudget,extra19:renderExtra,settings:renderSettings}[current]||renderToday;
 document.querySelector('#view').innerHTML=f();
}

const schemas={
 planning:[['title','Wat?','text'],['date','Datum','date'],['time','Tijd','time'],['person','Voor wie?','select',['Samen','Kees','Daphne']]],
 tasks:[['title','Taak','text'],['person','Voor wie?','select',['Samen','Kees','Daphne']],['due','Deadline','date'],['category','Categorie','select',['Algemeen','Woning','Administratie','Auto','Reis','Persoonlijk']],['repeat','Herhaling','select',['Eenmalig','Dagelijks','Wekelijks','Maandelijks']]],
 meals:[['title','Gerecht','text'],['date','Datum','date'],['type','Moment','select',['Ontbijt','Lunch','Avondeten','Snack']]],
 groceries:[['title','Product','text'],['category','Categorie','text']],
 chores:[['title','Taak','text'],['person','Voor wie?','select',['Samen','Kees','Daphne']],['due','Eerste keer','date'],['repeat','Herhaling','select',['Eenmalig','Dagelijks','Wekelijks','2× per week','Elke 2 weken','Maandelijks']]],
 stock:[['title','Product','text'],['category','Plek','text'],['amount','Aantal','number'],['min','Minimum','number'],['unit','Eenheid','text']],
 trips:[['title','Onderdeel','text'],['date','Deadline','date'],['type','Soort','text'],['note','Notitie','textarea']],
 ideas:[['title','Idee','text'],['category','Categorie','text'],['note','Notitie','textarea']],
 home:[['title','Onderwerp','text'],['category','Categorie','select',['Onderhoud','Klus','Garantie','Woninginfo','Handleiding']],['due','Datum','date'],['note','Notitie','textarea']]
};
function openAdd(){
 const s=schemas[current];if(!s)return;
 document.querySelector('#dialogTitle').textContent=`${label(current)} toevoegen`;
 document.querySelector('#formFields').innerHTML=s.map(([n,l,t,o])=>`<label class="field">${l}${t==='select'?`<select name="${n}">${o.map(v=>`<option>${esc(v)}</option>`).join('')}</select>`:t==='textarea'?`<textarea name="${n}"></textarea>`:`<input name="${n}" type="${t}" ${n==='title'?'required':''} ${['date','due'].includes(n)?`value="${todayISO()}"`:''}>`}</label>`).join('');
 document.querySelector('#itemDialog').showModal();
}
function openChallenge(){
 current='challenges';
 document.querySelector('#dialogTitle').textContent='Nieuwe uitdaging';
 document.querySelector('#formFields').innerHTML=`<label class="field">Titel<input name="title" required placeholder="Bijv. 30 km hardlopen"></label><label class="field">Soort<select name="mode"><option>Persoonlijk</option><option>Tegen elkaar</option><option>Samen</option></select></label><label class="field">Voor wie?<select name="person"><option>Kees</option><option>Daphne</option><option>Samen</option></select></label><label class="field">Meettype<select name="metric"><option value="count">Aantal</option><option value="distance">Afstand</option><option value="time">Tijd</option><option value="streak">Streak</option><option value="yesno">Ja/nee</option><option value="money">Bedrag</option></select></label><label class="field">Doel<input name="target" type="number" step="0.1" value="1" required></label><label class="field">Eenheid<input name="unit" placeholder="boeken, km, keer, uur..."></label><label class="field">Deadline<input name="deadline" type="date"></label><label class="field">Beloning XP<input name="rewardPoints" type="number" value="100"></label><input type="hidden" name="_challenge" value="1">`;
 document.querySelector('#itemDialog').showModal();
}
function addPointsDialog(){
 const who=prompt('Voor wie? Kees, Daphne of Samen','Kees');if(!['Kees','Daphne','Samen'].includes(who))return;
 const rule=data.pointRules.find(r=>r.title.toLowerCase()===String(prompt('Activiteit (bijv. Sporten)','Sporten')).toLowerCase());
 const p=rule?Number(rule.points):Number(prompt('Hoeveel punten?',10));if(!Number.isFinite(p))return;
 data.pointsLedger.push({id:uid(),person:who,points:p,reason:rule?.title||'Handmatig',date:todayISO()});save();render();toast(`+${p} XP voor ${who}`);
}
function backup(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download=`samen-thuis-backup-${todayISO()}.json`;a.click();URL.revokeObjectURL(a.href)}
function restoreFile(file){const r=new FileReader();r.onload=()=>{try{data=migrate(JSON.parse(r.result));save();render();toast('Back-up geladen')}catch{toast('Ongeldige back-up')}};r.readAsText(file)}

document.addEventListener('click',e=>{
 const goEl=e.target.closest('[data-go]');if(goEl)return go(goEl.dataset.go);
 if(e.target.closest('#addBtn'))return openAdd();
 if(e.target.closest('#quickAddBtn,[data-quick]'))return document.querySelector('#quickDialog').showModal();
 if(e.target.closest('[data-close]'))return e.target.closest('dialog').close();
 if(e.target.closest('[data-stock-sync]'))return syncLowStock();
 if(e.target.closest('[data-new-challenge]'))return openChallenge();
 if(e.target.closest('[data-log-points]'))return addPointsDialog();
 const tab=e.target.closest('[data-ch-tab]');if(tab){challengeTab=tab.dataset.chTab;return render()}
 const task=e.target.closest('[data-task]');if(task){const x=data.tasks.find(x=>x.id===task.dataset.task);if(x){x.done=true;x.completedAt=new Date().toISOString();save();render()}return}
 const g=e.target.closest('[data-grocery]');if(g){const x=data.groceries.find(x=>x.id===g.dataset.grocery);if(x){x.done=g.checked;save()}return}
 const inc=e.target.closest('[data-stock-inc],[data-stock-dec]');if(inc){const sid=inc.dataset.stockInc||inc.dataset.stockDec,x=data.stock.find(x=>x.id===sid);if(x){x.amount=Math.max(0,Number(x.amount||0)+(inc.dataset.stockInc?1:-1));save();render()}return}
 const del=e.target.closest('[data-delete]');if(del){const [k,id]=del.dataset.delete.split(':');data[k]=data[k].filter(x=>x.id!==id);save();render();return}
 const pr=e.target.closest('[data-progress-ch]');if(pr){const c=data.challenges.find(x=>x.id===pr.dataset.progressCh);if(!c)return;const v=Number(prompt(`Voortgang toevoegen (${c.unit||'eenheden'})`,1));if(v>0){data.challengeEntries.push({id:uid(),challengeId:c.id,person:c.person||'Samen',value:v,date:todayISO()});save();render()}return}
 const fin=e.target.closest('[data-finish-ch]');if(fin){const c=data.challenges.find(x=>x.id===fin.dataset.finishCh);if(c){c.status='done';c.completedAt=new Date().toISOString();data.pointsLedger.push({id:uid(),person:c.person||'Samen',points:Number(c.rewardPoints||0),reason:`Challenge: ${c.title}`,date:todayISO()});save();render();toast('Challenge voltooid!')}return}
 const rw=e.target.closest('[data-redeem]');if(rw){const r=data.rewards.find(x=>x.id===rw.dataset.redeem);const who=prompt('Wie wisselt deze beloning in?','Kees');if(!r||!['Kees','Daphne','Samen'].includes(who))return;if(points(who)<r.cost)return toast('Niet genoeg punten');data.pointsLedger.push({id:uid(),person:who,points:-r.cost,reason:`Beloning: ${r.title}`,date:todayISO()});save();render();toast('Beloning ingewisseld');return}
 const act=e.target.closest('[data-action]');if(act?.dataset.action==='backup')return backup();if(act?.dataset.action==='restore')return document.querySelector('#restoreInput').click();
});
document.addEventListener('change',e=>{
 if(e.target.matches('[data-setting]')){data.settingsVNext[e.target.dataset.setting]=e.target.value;save();applyTheme();render()}
 if(e.target.matches('[data-setting-check]')){data.settingsVNext[e.target.dataset.settingCheck]=e.target.checked;save()}
});
document.querySelector('#restoreInput').addEventListener('change',e=>e.target.files[0]&&restoreFile(e.target.files[0]));
document.querySelector('#itemForm').addEventListener('submit',e=>{
 e.preventDefault();const f=Object.fromEntries(new FormData(e.target));
 if(f._challenge){delete f._challenge;f.id=uid();f.target=Number(f.target);f.rewardPoints=Number(f.rewardPoints);f.status='active';data.challenges.push(f)}
 else{['amount','min'].forEach(k=>{if(k in f)f[k]=Number(f[k])});if(current==='groceries')f.done=false;if(current==='tasks')f.done=false;if(current==='chores')f.completedDates=[];data[current].push({id:uid(),...f})}
 save();document.querySelector('#itemDialog').close();render();toast('Toegevoegd');
});
document.querySelector('#quickForm').addEventListener('submit',e=>{
 e.preventDefault();const f=Object.fromEntries(new FormData(e.target)), target=f.target;let x={id:uid(),title:f.title,person:f.person};
 if(target==='tasks')x={...x,due:f.date,category:'Algemeen',repeat:'Eenmalig',done:false};
 if(target==='groceries')x={id:uid(),title:f.title,category:'Overig',done:false};
 if(target==='planning')x={...x,date:f.date||todayISO(),time:''};
 if(target==='ideas')x={id:uid(),title:f.title,category:'Samen',note:''};
 if(target==='home')x={id:uid(),title:f.title,category:'Klus',due:f.date,note:''};
 data[target].push(x);save();document.querySelector('#quickDialog').close();render();toast(`Toegevoegd aan ${label(target)}`);
});
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
applyTheme();nav();render();syncLowStock();