const STORAGE_KEY = 'samenThuisDataV2';
const LEGACY_STORAGE_KEY = 'samenThuisDataV1';
const SYNC_KEY = 'samenThuisSyncV1';
const QUOTE_KEY = 'samenThuisQuoteCacheV1';
const DEFAULT_PROJECT_URL = 'https://vwfuetxgapzfivydzhxc.supabase.co';
const DEFAULT_PUBLISHABLE_KEY = 'sb_publishable_Xa1oLeM64F-jog1vVjJbkQ_BE3UV6mR';
const PDFJS_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs';
const PDFJS_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';

const pad = value => String(value).padStart(2, '0');
const toLocalISO = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const todayISO = () => toLocalISO(new Date());
const parseDate = value => new Date(`${value}T12:00:00`);
const addDays = (value, amount) => {
  const date = typeof value === 'string' ? parseDate(value) : new Date(value);
  date.setDate(date.getDate() + amount);
  return toLocalISO(date);
};
const startOfWeek = value => {
  const date = typeof value === 'string' ? parseDate(value) : new Date(value);
  const offset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - offset);
  return toLocalISO(date);
};
const weekDates = start => Array.from({ length: 7 }, (_, index) => addDays(start, index));
const weekdayIndex = value => (parseDate(value).getDay() + 6) % 7;
const daysBetween = (from, to) => Math.round((parseDate(to) - parseDate(from)) / 86400000);

const CALENDAR_COLORS = ['#315f86', '#e98248', '#2e7d67', '#9b59b6', '#b84f58', '#8a6f3e'];
const GROCERY_CATEGORIES = ['Groente', 'Fruit', 'Brood & wraps', 'Zuivel & vega', 'Vlees & vis', 'Diepvries', 'Voorraadkast', 'Kruiden & sauzen', 'Drinken', 'Schoonmaak', 'Overig'];
const WEEKDAY_NAMES = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
const QUESTIONS = [
  'Wat gaf je vandaag onverwacht veel energie?',
  'Welke kleine gewoonte van ons waardeer je het meest?',
  'Waar kijk je deze week samen het meest naar uit?',
  'Wat zou je graag vaker samen doen zonder dat het veel hoeft te kosten?',
  'Wanneer voelde jij je deze week echt gezien?',
  'Wat kunnen we morgen doen om de dag fijner te maken?',
  'Welke herinnering aan ons maakt je direct aan het lachen?',
  'Wat is iets kleins waar je op dit moment trots op bent?',
  'Welke plek zouden we samen nog eens willen ontdekken?',
  'Wat heb je vandaag nodig: rust, hulp, aandacht of iets anders?',
  'Welke maaltijd zouden we binnenkort samen willen maken?',
  'Wat vind je fijn aan hoe we ons huis samen maken?',
  'Welke taak zou deze week eerlijker of slimmer verdeeld kunnen worden?',
  'Wat was het mooiste moment van je dag?',
  'Welke droom wil je de komende tijd meer ruimte geven?',
  'Wat zou een perfecte vrije ochtend voor ons zijn?',
  'Waarvoor ben je vandaag dankbaar in onze relatie?',
  'Wat wil je dat ik deze week niet vergeet?',
  'Wat is iets nieuws dat we samen zouden kunnen proberen?',
  'Welke eigenschap van de ander bewonder je?',
  'Wat helpt jou om na een drukke dag thuis te landen?',
  'Welke traditie zouden we samen willen beginnen?',
  'Wat betekent een gezellig huis voor jou?',
  'Waar kunnen we deze maand bewust tijd voor maken?',
  'Welke muziek past vandaag bij jouw stemming?',
  'Wat zou je graag leren van de ander?',
  'Welke dag uit het afgelopen jaar zou je opnieuw willen beleven?',
  'Wat kunnen we vandaag voor elkaar makkelijker maken?',
  'Waar hoop je over een jaar met ons te staan?',
  'Wat is een compliment dat je de ander vandaag wilt geven?',
  'Welke kleine verrassing zou je blij maken?'
];

const defaultCalendars = () => [
  { id: 'persoonlijk', name: 'Persoonlijk', color: '#315f86', visible: true, person: '' },
  { id: 'vitestro', name: 'Vitestro', color: '#e98248', visible: true, person: 'Kees' },
  { id: 'coach-o23', name: 'Coach O23', color: '#2e7d67', visible: true, person: 'Kees' },
  { id: 'daphne-werk', name: 'Daphne werk', color: '#9b59b6', visible: true, person: 'Daphne' }
];

const initialData = {
  meta: { version: 2, updatedAt: new Date().toISOString() },
  planning: [{ id: 'p1', title: 'Samen koken', date: todayISO(), time: '18:30', endTime: '', person: 'Samen', calendarId: 'persoonlijk' }],
  calendars: defaultCalendars(),
  excludedCalendars: [],
  meals: [{ id: 'm1', date: todayISO(), type: 'Avondeten', title: 'Tomaten-arancini met basilicummayonaise' }],
  groceries: [
    { id: 'g1', title: 'Tomaten', category: 'Groente', done: false },
    { id: 'g2', title: 'Basilicum', category: 'Groente', done: false },
    { id: 'g3', title: 'Havermelk', category: 'Zuivel & vega', done: true }
  ],
  chores: [
    { id: 'c1', title: 'Keuken opruimen', person: 'Samen', due: todayISO(), repeat: 'Dagelijks', secondWeekday: '', notes: '', completedDates: [] },
    { id: 'c2', title: 'Bed verschonen', person: 'Kees', due: addDays(todayISO(), 2), repeat: 'Wekelijks', secondWeekday: '', notes: '', completedDates: [] },
    { id: 'c3', title: 'Badkamer schoonmaken', person: 'Daphne', due: addDays(todayISO(), 1), repeat: 'Wekelijks', secondWeekday: '', notes: '', completedDates: [] }
  ],
  stock: [
    { id: 's1', title: 'Toiletpapier', category: 'Badkamer', amount: 5, min: 3, unit: 'rollen' },
    { id: 's2', title: 'Pasta', category: 'Voorraadkast', amount: 2, min: 2, unit: 'pakken' },
    { id: 's3', title: 'Afwasmiddel', category: 'Schoonmaak', amount: 1, min: 2, unit: 'flessen' }
  ],
  ideas: [
    { id: 'i1', title: 'Zelf pizza maken', category: 'Thuis', note: 'Allebei een eigen pizza beleggen', icon: '🍕' },
    { id: 'i2', title: 'Avondwandeling', category: 'Gratis', note: 'Telefoons thuislaten', icon: '🌙' },
    { id: 'i3', title: 'Nieuw restaurant proberen', category: 'Uit', note: 'Een vegetarisch restaurant kiezen', icon: '🍽️' }
  ],
  home: [
    { id: 'h1', title: 'Rookmelder testen', category: 'Onderhoud', due: addDays(todayISO(), 14), note: 'Testknop indrukken' },
    { id: 'h2', title: 'Afmetingen woonkamer', category: 'Woninginfo', due: '', note: 'Nog toevoegen' }
  ],
  tripFolders: [
    { id: 'trip-vietnam', name: 'Vietnam', startDate: '2027-01-08', endDate: '2027-01-31', note: 'Bruiloft in Nha Trang op 29 januari' }
  ],
  tripSections: [
    { id: 'trip-vietnam-voorbereiding', tripFolderId: 'trip-vietnam', name: 'Voor vertrek' },
    { id: 'trip-vietnam-boekingen', tripFolderId: 'trip-vietnam', name: 'Boekingen' },
    { id: 'trip-vietnam-paklijst', tripFolderId: 'trip-vietnam', name: 'Paklijst' }
  ],
  trips: [
    { id: 'r2', tripFolderId: 'trip-vietnam', tripSectionId: 'trip-vietnam-voorbereiding', title: 'Paspoorten controleren', date: addDays(todayISO(), 7), type: 'Voorbereiding', note: 'Controleer geldigheid', checkable: true, done: false }
  ],
  dailyAnswers: {}
};

const clone = value => structuredClone(value);
const id = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = (value = '') => String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
const fmtDate = (value, options = { weekday: 'short', day: 'numeric', month: 'short' }) => value ? new Intl.DateTimeFormat('nl-NL', options).format(parseDate(value)) : 'Geen datum';
const groupBy = (items, keyFn) => items.reduce((groups, item) => {
  const key = keyFn(item);
  (groups[key] ||= []).push(item);
  return groups;
}, {});

function migrateData(raw) {
  if (!raw || typeof raw !== 'object') return clone(initialData);
  const migrated = clone(initialData);
  ['planning', 'meals', 'groceries', 'chores', 'stock', 'ideas', 'home', 'trips'].forEach(key => {
    if (Array.isArray(raw[key])) migrated[key] = raw[key];
  });
  if (Array.isArray(raw.tripFolders)) {
    migrated.tripFolders = raw.tripFolders.filter(folder => folder && folder.id && folder.name).map(folder => ({ endDate: '', note: '', ...folder }));
  } else {
    const oldTrips = Array.isArray(raw.trips) ? raw.trips : [];
    const oldJourneys = oldTrips.filter(item => item.type === 'Reis');
    migrated.tripFolders = oldJourneys.map(item => ({
      id: `folder-${item.id}`,
      name: item.title,
      startDate: item.date || '',
      endDate: '',
      note: item.note || ''
    }));
    if (!migrated.tripFolders.length && oldTrips.length) {
      migrated.tripFolders = [{ id: 'folder-algemeen', name: 'Reisplannen', startDate: '', endDate: '', note: '' }];
    }
    const fallbackFolderId = migrated.tripFolders[0]?.id || '';
    migrated.trips = oldTrips.filter(item => item.type !== 'Reis').map(item => ({ ...item, tripFolderId: item.tripFolderId || fallbackFolderId }));
  }
  const validFolderIds = new Set(migrated.tripFolders.map(folder => folder.id));
  if (Array.isArray(raw.tripSections)) {
    migrated.tripSections = raw.tripSections.filter(section => section && section.id && section.name && validFolderIds.has(section.tripFolderId)).map(section => ({ ...section }));
  } else {
    migrated.tripSections = migrated.tripFolders.map(folder => ({ id: `section-${folder.id}-algemeen`, tripFolderId: folder.id, name: 'Algemeen' }));
  }
  const sectionById = new Map(migrated.tripSections.map(section => [section.id, section]));
  migrated.trips = migrated.trips.map(item => {
    const tripFolderId = validFolderIds.has(item.tripFolderId) ? item.tripFolderId : (migrated.tripFolders[0]?.id || '');
    const selectedSection = sectionById.get(item.tripSectionId);
    const tripSectionId = selectedSection?.tripFolderId === tripFolderId
      ? selectedSection.id
      : (migrated.tripSections.find(section => section.tripFolderId === tripFolderId)?.id || '');
    const checkable = typeof item.checkable === 'boolean' ? item.checkable : ['Voorbereiding', 'Paklijst'].includes(item.type);
    return { ...item, tripFolderId, tripSectionId, checkable, done: checkable ? Boolean(item.done) : false };
  });
  migrated.excludedCalendars = Array.isArray(raw.excludedCalendars)
    ? raw.excludedCalendars.filter(item => item && typeof item.name === 'string').map(item => ({ ...item }))
    : [];
  const excludedNames = new Set(migrated.excludedCalendars.map(item => calendarNameKey(item.name)));
  migrated.calendars = (Array.isArray(raw.calendars) ? raw.calendars : defaultCalendars())
    .filter(item => item && typeof item.name === 'string' && !excludedNames.has(calendarNameKey(item.name)))
    .map(item => ({ ...item, person: validCalendarPerson(item.person) || inferCalendarPerson(item.name) }));
  migrated.dailyAnswers = raw.dailyAnswers && typeof raw.dailyAnswers === 'object' ? raw.dailyAnswers : {};
  migrated.planning = migrated.planning.map(item => ({
    endTime: '',
    calendarId: 'persoonlijk',
    person: 'Samen',
    ...item
  }));
  migrated.chores = migrated.chores.map(item => {
    const completedDates = Array.isArray(item.completedDates) ? item.completedDates : (item.done ? [item.due || todayISO()] : []);
    return { secondWeekday: '', notes: '', ...item, completedDates };
  });
  migrated.meta = {
    version: 2,
    updatedAt: raw.meta?.updatedAt || new Date().toISOString()
  };
  return migrated;
}

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    return stored ? migrateData(JSON.parse(stored)) : clone(initialData);
  } catch {
    return clone(initialData);
  }
}

function loadSyncConfig() {
  try {
    const stored = JSON.parse(localStorage.getItem(SYNC_KEY) || '{}');
    return {
      projectUrl: DEFAULT_PROJECT_URL,
      anonKey: DEFAULT_PUBLISHABLE_KEY,
      householdCode: String(stored.householdCode || ''),
      lastSyncedAt: String(stored.lastSyncedAt || '')
    };
  } catch {
    return { projectUrl: DEFAULT_PROJECT_URL, anonKey: DEFAULT_PUBLISHABLE_KEY, householdCode: '', lastSyncedAt: '' };
  }
}

let data = loadData();
let syncConfig = loadSyncConfig();
let current = 'today';
let householdWeekStart = startOfWeek(todayISO());
let agendaWeekStart = startOfWeek(todayISO());
let syncTimer;
let syncing = false;
let syncError = '';
let calendarOperation = null;
let addMode = 'item';

const sections = {
  today: { label: 'Vandaag', icon: '⌂' },
  planning: { label: 'Agenda', icon: '▦' },
  meals: { label: 'Weekmenu', icon: '♨' },
  groceries: { label: 'Boodschappen', icon: '✓' },
  chores: { label: 'Huishouden', icon: '⌁' },
  stock: { label: 'Voorraad', icon: '▤' },
  ideas: { label: 'Samen doen', icon: '♡' },
  home: { label: 'Woning', icon: '⌂' },
  trips: { label: 'Reizen', icon: '✈' },
  settings: { label: 'Instellingen', icon: '⚙' }
};

function formConfig(view) {
  const configs = {
    planning: {
      title: 'Afspraak toevoegen',
      fields: [
        ['title', 'Wat?', 'text'], ['date', 'Datum', 'date'], ['time', 'Begintijd', 'time'], ['endTime', 'Eindtijd (optioneel)', 'time'],
        ['calendarId', 'Agenda', 'select', data.calendars.map(calendar => [calendar.id, calendar.name])],
        ['person', 'Voor wie?', 'select', ['Samen', 'Kees', 'Daphne']]
      ]
    },
    meals: { title: 'Gerecht toevoegen', fields: [['title', 'Gerecht', 'text'], ['date', 'Datum', 'date'], ['type', 'Moment', 'select', ['Ontbijt', 'Lunch', 'Avondeten', 'Snack']]] },
    groceries: { title: 'Boodschap toevoegen', fields: [['title', 'Product', 'text'], ['category', 'Categorie', 'select', GROCERY_CATEGORIES]] },
    chores: {
      title: 'Huishoudtaak toevoegen',
      fields: [
        ['title', 'Taak', 'text'], ['person', 'Voor wie?', 'select', ['Samen', 'Kees', 'Daphne']], ['due', 'Eerste keer', 'date'],
        ['repeat', 'Herhaling', 'select', ['Eenmalig', 'Dagelijks', 'Wekelijks', '2× per week', ['Elke 2 weken', 'Elke 2 weken (om de week)'], 'Maandelijks']],
        ['secondWeekday', 'Tweede dag van de week', 'select', WEEKDAY_NAMES.map((name, index) => [String(index), name]), 'second-weekday'],
        ['notes', 'Notitie (optioneel)', 'textarea']
      ]
    },
    stock: { title: 'Voorraad toevoegen', fields: [['title', 'Product', 'text'], ['category', 'Plek', 'select', ['Voorraadkast', 'Koelkast', 'Vriezer', 'Badkamer', 'Schoonmaak', 'Overig']], ['amount', 'Aantal', 'number'], ['min', 'Minimum', 'number'], ['unit', 'Eenheid', 'text']] },
    ideas: { title: 'Idee toevoegen', fields: [['title', 'Idee', 'text'], ['category', 'Categorie', 'select', ['Thuis', 'Uit', 'Actief', 'Gratis', 'Eten']], ['note', 'Notitie', 'textarea'], ['icon', 'Emoji', 'text']] },
    home: { title: 'Woningitem toevoegen', fields: [['title', 'Onderwerp', 'text'], ['category', 'Categorie', 'select', ['Onderhoud', 'Klus', 'Garantie', 'Woninginfo', 'Handleiding']], ['due', 'Datum (optioneel)', 'date'], ['note', 'Notitie', 'textarea']] },
    trips: { title: 'Onderdeel aan reis toevoegen', fields: [['tripFolderId', 'Reis', 'select', data.tripFolders.map(folder => [folder.id, folder.name])], ['tripSectionId', 'Map binnen de reis', 'select', data.tripSections.map(section => [section.id, section.name])], ['title', 'Onderwerp', 'text'], ['date', 'Deadline / datum (optioneel)', 'date'], ['type', 'Soort', 'select', ['Voorbereiding', 'Reservering', 'Vervoer', 'Verblijf', 'Activiteit', 'Eten', 'Budget', 'Documenten', 'Paklijst', 'Notitie']], ['note', 'Notitie', 'textarea'], ['checkable', 'Dit moet afgevinkt worden', 'checkbox']] }
  };
  return configs[view];
}

function save({ touch = true, sync = true } = {}) {
  if (touch) data.meta.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  const saveState = document.querySelector('#saveState');
  if (saveState) {
    saveState.textContent = 'Zojuist bewaard';
    setTimeout(() => { saveState.textContent = 'Lokaal bewaard'; }, 1200);
  }
  if (sync && syncConfigured()) scheduleSync();
}

function toast(message) {
  const element = document.querySelector('#toast');
  element.textContent = message;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 2200);
}

function setupNav() {
  document.querySelector('#nav').innerHTML = Object.entries(sections).map(([key, section]) =>
    `<button class="nav-item ${key === current ? 'active' : ''}" data-view="${key}"><span>${section.icon}</span>${section.label}</button>`
  ).join('');
}

function navigate(view) {
  if (!sections[view]) return;
  current = view;
  setupNav();
  document.querySelector('#pageTitle').textContent = sections[view].label;
  document.querySelector('#addBtn').style.display = ['today', 'settings'].includes(view) ? 'none' : '';
  render();
}

function render() {
  const renders = {
    today: renderToday, planning: renderPlanning, meals: renderMeals, groceries: renderGroceries,
    chores: renderChores, stock: renderStock, ideas: renderIdeas, home: renderHome,
    trips: renderTrips, settings: renderSettings
  };
  document.querySelector('#view').innerHTML = renders[current]();
  updateSyncBadge();
}

const empty = message => `<div class="empty">${esc(message)}</div>`;
function calendarById(calendarId) {
  const active = data.calendars.find(calendar => calendar.id === calendarId);
  if (active) return active;
  const removed = data.excludedCalendars.find(calendar => calendar.id === calendarId);
  if (removed) return { ...removed, name: removed.name + ' (bewaard)', visible: Boolean(removed.keepEvents) };
  return { id: calendarId || '', name: 'Zonder agenda', color: '#315f86', visible: true };
}

function questionForDate(date) {
  const dayNumber = Math.floor(parseDate(date).getTime() / 86400000);
  return QUESTIONS[Math.abs(dayNumber) % QUESTIONS.length];
}

function renderDailyQuestion() {
  const answers = data.dailyAnswers[todayISO()] || {};
  const bothAnswered = Boolean(answers.Kees && answers.Daphne);
  const personButton = person => answers[person]
    ? `<button class="secondary" disabled>${bothAnswered ? `${person}: antwoord staat vast` : `${person} heeft geantwoord`}</button>`
    : `<button class="primary" data-answer-person="${person}">${person} beantwoordt</button>`;
  return `<section class="card daily-question">
    <div class="card-head"><div><p class="eyebrow">Vraag van vandaag</p><h2>${esc(questionForDate(todayISO()))}</h2></div><span class="daily-icon">?</span></div>
    ${bothAnswered ? `<div class="answer-grid"><article><span>Kees</span><p>${esc(answers.Kees.answer)}</p></article><article><span>Daphne</span><p>${esc(answers.Daphne.answer)}</p></article></div>` : `<p class="question-hint">Antwoorden blijven verborgen tot jullie allebei hebben geantwoord. ${answers.Kees || answers.Daphne ? 'Eén antwoord is binnen.' : ''}</p>`}
    <div class="button-row">${personButton('Kees')}${personButton('Daphne')}</div>${bothAnswered ? '<p class="answer-locked">Beide antwoorden zijn definitief en kunnen niet meer worden gewijzigd.</p>' : ''}
  </section>`;
}

function captureBrainyQuote() {
  const source = document.querySelector('#brainyQuoteSource');
  if (!source) return;
  const copy = source.cloneNode(true);
  copy.querySelectorAll('script').forEach(script => script.remove());
  copy.querySelectorAll('a').forEach(link => {
    if (link.textContent.trim().toLowerCase() === 'more quotes') link.remove();
  });
  const quoteText = copy.textContent.replace(/\s+/g, ' ').trim();
  const markup = `<blockquote>${esc(quoteText)}</blockquote>`;
  if (quoteText.length > 12) {
    localStorage.setItem(QUOTE_KEY, JSON.stringify({ date: todayISO(), markup }));
    if (current === 'today') render();
  }
}

async function refreshBrainyQuoteRSS() {
  try {
    const response = await fetch('https://www.brainyquote.com/link/quotebr.rss', { cache: 'no-store' });
    if (!response.ok) return;
    const xml = new DOMParser().parseFromString(await response.text(), 'application/xml');
    const item = xml.querySelector('item');
    if (!item) return;
    const title = item.querySelector('title')?.textContent?.trim() || '';
    const descriptionHtml = item.querySelector('description')?.textContent || '';
    const description = new DOMParser().parseFromString(descriptionHtml, 'text/html').body.textContent.trim();
    if (!title && !description) return;
    const genericTitle = /^(today'?s )?quote/i.test(title);
    const quote = genericTitle ? description : title;
    const author = genericTitle || description === title ? '' : description;
    const markup = `<blockquote>${esc(quote)}</blockquote>${author ? `<p>${esc(author)}</p>` : ''}`;
    localStorage.setItem(QUOTE_KEY, JSON.stringify({ date: todayISO(), markup }));
    if (current === 'today') render();
  } catch {
    // De officiële Javascript-feed en de laatst bewaarde quote blijven als fallback werken.
  }
}

function renderQuote() {
  let cache;
  try { cache = JSON.parse(localStorage.getItem(QUOTE_KEY) || 'null'); } catch { cache = null; }
  const quote = cache?.markup
    ? `<div class="quote-content">${cache.markup}</div>`
    : '<p class="quote-offline">De quote wordt opgehaald zodra er verbinding is.</p>';
  return `<section class="card quote-card"><div><p class="eyebrow">Quote of the day</p>${quote}</div><a href="https://www.brainyquote.com/link/quotebr.rss" target="_blank" rel="noopener">Bron: BrainyQuote RSS</a></section>`;
}

function tripFolderById(folderId) {
  return data.tripFolders.find(folder => folder.id === folderId);
}

function tripSectionById(sectionId) {
  return data.tripSections.find(section => section.id === sectionId);
}

function openTravelActions() {
  return data.trips.filter(item => item.checkable && !item.done).sort((a, b) => {
    const dateOrder = (a.date || '9999-12-31').localeCompare(b.date || '9999-12-31');
    return dateOrder || a.title.localeCompare(b.title, 'nl');
  });
}

function renderTravelActions() {
  const actions = openTravelActions().slice(0, 10);
  return `<section class="card travel-actions"><div class="card-head"><div><p class="eyebrow">Belangrijkste reisacties</p><h2>Nog te doen</h2></div><button class="text-btn" data-view="trips">Alle reizen</button></div><div class="list">${actions.length ? actions.map(item => {
    const folder = tripFolderById(item.tripFolderId);
    const section = tripSectionById(item.tripSectionId);
    const overdue = item.date && item.date < todayISO();
    const timing = item.date ? `${overdue ? 'Te laat · ' : ''}${fmtDate(item.date)}` : 'Geen deadline';
    return `<div class="list-item travel-action ${overdue ? 'overdue' : ''}"><button class="check" data-toggle="trips:${item.id}" aria-label="${esc(item.title)} afronden"></button><div class="item-main"><strong>${esc(item.title)}</strong><small>${esc(folder?.name || 'Reis')}${section ? ` · ${esc(section.name)}` : ''} · ${esc(timing)}</small></div></div>`;
  }).join('') : empty('Geen openstaande reisacties')}</div>${openTravelActions().length > 10 ? `<p class="muted travel-more">Nog ${openTravelActions().length - 10} acties staan onder Reizen.</p>` : ''}</section>`;
}

function renderToday() {
  const todayChores = occurrencesForDate(todayISO());
  const pending = todayChores.filter(({ chore }) => !isChoreDone(chore, todayISO()));
  const low = data.stock.filter(item => Number(item.amount) <= Number(item.min));
  const unbought = data.groceries.filter(item => !item.done);
  const meal = data.meals.find(item => item.date === todayISO() && item.type === 'Avondeten');
  const todayPlanning = data.planning.filter(item => item.date === todayISO() && calendarById(item.calendarId).visible !== false);
  return `<section class="card welcome"><div><p class="eyebrow welcome-eyebrow">Jullie thuis, in één oogopslag</p><h2>Fijn dat jullie er zijn.</h2><p>${meal ? `Vanavond staat <strong>${esc(meal.title)}</strong> op het menu.` : 'Plan samen wat er vanavond op tafel komt.'}</p></div><div class="date-chip">${fmtDate(todayISO(), { weekday: 'long', day: 'numeric', month: 'long' })}</div></section>
    ${renderTravelActions()}
    <div class="today-dailies">${renderDailyQuestion()}${renderQuote()}</div>
    <div class="stat-row"><div class="stat"><strong>${pending.length}</strong><span>huishoudtaken vandaag</span></div><div class="stat"><strong>${unbought.length}</strong><span>boodschappen open</span></div><div class="stat"><strong>${low.length}</strong><span>producten bijna op</span></div><div class="stat"><strong>${todayPlanning.length}</strong><span>agenda-items vandaag</span></div></div>
    <div class="grid two">
      <section class="card"><div class="card-head"><h2>Vandaag in huis</h2><button class="text-btn" data-view="chores">Hele week</button></div><div class="list">${todayChores.length ? todayChores.map(({ chore }) => choreOccurrenceRow(chore, todayISO())).join('') : empty('Vandaag geen huishoudtaken')}</div></section>
      <section class="card"><div class="card-head"><h2>Op de agenda</h2><button class="text-btn" data-view="planning">Week bekijken</button></div><div class="list">${data.planning.filter(item => item.date >= todayISO() && calendarById(item.calendarId).visible !== false).sort(sortPlanning).slice(0, 5).map(item => basicRow(item.title, `${fmtDate(item.date)} · ${item.time || 'Hele dag'}`, calendarById(item.calendarId).name)).join('') || empty('Nog niets gepland')}</div></section>
      <section class="card"><div class="card-head"><h2>Boodschappen</h2><button class="text-btn" data-view="groceries">Open lijst</button></div><div class="list">${unbought.slice(0, 5).map(groceryRow).join('') || empty('De lijst is leeg')}</div></section>
      <section class="card"><div class="card-head"><h2>Bijna op</h2><button class="text-btn" data-view="stock">Voorraad bekijken</button></div><div class="list">${low.slice(0, 5).map(item => basicRow(item.title, `${item.amount} ${esc(item.unit)} in huis`, 'Aanvullen', 'red')).join('') || empty('Voorraad is op peil')}</div></section>
    </div>`;
}

function sortPlanning(a, b) {
  return `${a.date}${a.time || ''}`.localeCompare(`${b.date}${b.time || ''}`);
}

function renderWeekControls(start, type) {
  const end = addDays(start, 6);
  return `<div class="week-controls"><button class="secondary icon-control" data-week="${type}:-1" aria-label="Vorige week">←</button><button class="secondary" data-week="${type}:0">Deze week</button><strong>${fmtDate(start, { day: 'numeric', month: 'short' })} – ${fmtDate(end, { day: 'numeric', month: 'short', year: 'numeric' })}</strong><button class="secondary icon-control" data-week="${type}:1" aria-label="Volgende week">→</button></div>`;
}

function renderPlanning() {
  const days = weekDates(agendaWeekStart);
  return `<div class="calendar-toolbar">
      ${renderWeekControls(agendaWeekStart, 'agenda')}
      <div class="calendar-filters" aria-label="Agenda's tonen">${data.calendars.map(calendar => `<button class="calendar-filter ${calendar.visible !== false ? 'active' : ''}" data-calendar-toggle="${calendar.id}"><i style="background:${esc(calendar.color)}"></i>${esc(calendar.name)}</button>`).join('')}</div>
    </div>
    <div class="week calendar-week">${days.map(day => {
      const events = data.planning.filter(item => item.date === day && calendarById(item.calendarId).visible !== false).sort(sortPlanning);
      return `<section class="day ${day === todayISO() ? 'today' : ''}"><div class="day-name">${fmtDate(day, { weekday: 'long' })}</div><div class="day-date">${parseDate(day).getDate()}</div>${events.map(calendarEvent).join('') || '<p class="day-empty">Vrij</p>'}</section>`;
    }).join('')}</div>
    <section class="card import-card"><div><p class="eyebrow">Apple Agenda via Opdrachten</p><h2>Agenda-items invoeren</h2><p>Vier velden zijn genoeg: agenda, datum, tijd en titel. De app onthoudt wie bij iedere agenda hoort. Nieuwe agenda’s worden toegevoegd; uitgesloten agenda’s worden overgeslagen.</p></div><textarea id="calendarImportText" placeholder="Vitestro | 2026-09-04 | 09:00 | Overleg"></textarea><div class="button-row"><button class="primary" data-import-calendar>Importeren</button><button class="secondary" data-pick-file="calendarImportFile">Bestand kiezen</button><button class="secondary" data-view="settings">Agenda’s beheren</button></div></section>`;
}

function calendarEvent(item) {
  const calendar = calendarById(item.calendarId);
  return `<div class="calendar-event" style="--event-color:${esc(calendar.color)}"><small>${esc(item.time || 'Hele dag')}${item.endTime ? `–${esc(item.endTime)}` : ''}</small><strong>${esc(item.title)}</strong><span>${esc(calendar.name)}${item.person ? ` · ${esc(item.person)}` : ''}</span><button class="delete" data-delete="planning:${item.id}" aria-label="Verwijderen">×</button></div>`;
}

function renderMeals() {
  const start = startOfWeek(todayISO());
  const days = weekDates(start);
  return `<div class="week">${days.map(day => `<section class="day ${day === todayISO() ? 'today' : ''}"><div class="day-name">${fmtDate(day, { weekday: 'long' })}</div><div class="day-date">${parseDate(day).getDate()}</div>${data.meals.filter(item => item.date === day).map(item => `<div class="meal"><small>${esc(item.type)}</small><strong>${esc(item.title)}</strong><button class="delete" data-delete="meals:${item.id}" aria-label="Verwijderen">×</button></div>`).join('') || '<p class="day-empty">Nog open</p>'}</section>`).join('')}</div>
    <section class="card import-card"><div><p class="eyebrow">Osta</p><h2>Schema snel overnemen</h2><p>Plak het schema uit Osta. Regels zoals <strong>Maandag: Pasta</strong> vullen het weekmenu. Een blok met <strong># Grocery List</strong> gaat direct naar Boodschappen.</p></div><textarea id="ostaImportText" placeholder="Maandag: curry\nDinsdag: risotto\n\n# Grocery List\n250 g spinazie"></textarea><div class="button-row"><button class="primary" data-import-osta>Osta importeren</button><button class="secondary" data-pick-file="ostaImportFile">Bestand kiezen</button></div></section>`;
}

function renderGroceries() {
  const groups = groupBy(data.groceries, item => item.category || 'Overig');
  return `<section class="card import-card grocery-import"><div><p class="eyebrow">Lijst verdelen</p><h2>Plakken of uploaden</h2><p>Hoeveelheden blijven staan. De app deelt producten automatisch in; regels met ✓ worden als gekocht gemarkeerd.</p></div><textarea id="groceryImportText" placeholder="250 g spinazie\n1 teentje knoflook\n✓ Zout"></textarea><div class="button-row"><button class="primary" data-import-groceries>Verdelen over categorieën</button><button class="secondary" data-pick-file="groceryImportFile">TXT, CSV of JSON kiezen</button></div></section>
    <div class="grid three grocery-groups">${GROCERY_CATEGORIES.map(category => {
      const items = groups[category] || [];
      if (!items.length) return '';
      return `<section class="card"><div class="card-head"><h2>${esc(category)}</h2><span class="tag">${items.filter(item => !item.done).length} open</span></div><div class="list">${items.map(groceryRow).join('')}</div></section>`;
    }).join('') || empty('Voeg jullie eerste boodschap toe')}</div>`;
}

function occursOn(chore, date) {
  if (!chore.due || date < chore.due) return false;
  const difference = daysBetween(chore.due, date);
  switch (chore.repeat) {
    case 'Dagelijks': return difference >= 0;
    case 'Wekelijks': return difference % 7 === 0;
    case 'Elke 2 weken':
    case 'Om de week': return difference % 14 === 0;
    case '2× per week': {
      const firstDay = weekdayIndex(chore.due);
      const secondDay = chore.secondWeekday === '' || chore.secondWeekday === undefined ? (firstDay + 3) % 7 : Number(chore.secondWeekday);
      return [firstDay, secondDay].includes(weekdayIndex(date));
    }
    case 'Maandelijks': return parseDate(date).getDate() === parseDate(chore.due).getDate();
    default: return difference === 0;
  }
}

function occurrencesForDate(date) {
  return data.chores.filter(chore => occursOn(chore, date)).map(chore => ({ chore, date }));
}

function isChoreDone(chore, date) {
  return Array.isArray(chore.completedDates) && chore.completedDates.includes(date);
}

function toggleChoreOccurrence(choreId, date) {
  const chore = data.chores.find(item => item.id === choreId);
  if (!chore) return;
  chore.completedDates ||= [];
  chore.completedDates = chore.completedDates.includes(date) ? chore.completedDates.filter(item => item !== date) : [...chore.completedDates, date];
  save();
  render();
}

function repeatLabel(chore) {
  if (chore.repeat !== '2× per week') return chore.repeat;
  const first = WEEKDAY_NAMES[weekdayIndex(chore.due)];
  const second = WEEKDAY_NAMES[Number(chore.secondWeekday === '' ? (weekdayIndex(chore.due) + 3) % 7 : chore.secondWeekday)];
  return `2× per week · ${first} & ${second}`;
}

function choreOccurrenceRow(chore, date, compact = false) {
  const done = isChoreDone(chore, date);
  return `<div class="${compact ? 'chore-chip' : 'list-item'} ${done ? 'is-done' : ''}">
    <button class="check ${done ? 'done' : ''}" data-chore-date="${chore.id}:${date}" aria-label="${done ? 'Opnieuw openen' : 'Afronden'}">${done ? '✓' : ''}</button>
    <div class="item-main"><strong class="${done ? 'done-text' : ''}">${esc(chore.title)}</strong>${compact ? `<small>${esc(chore.person)} · ${esc(chore.repeat)}</small>` : `<small>${esc(chore.person)} · ${esc(repeatLabel(chore))}</small>`}</div>
  </div>`;
}

function renderChores() {
  const days = weekDates(householdWeekStart);
  const occurrences = days.flatMap(date => occurrencesForDate(date));
  const completed = occurrences.filter(({ chore, date }) => isChoreDone(chore, date)).length;
  const percentage = occurrences.length ? Math.round(completed / occurrences.length * 100) : 0;
  return `<section class="household-board">
      <div class="household-board-head"><div><p class="eyebrow">Hele weekschema</p><h2>Alle huishoudactiviteiten</h2><p>${completed} van ${occurrences.length} activiteiten afgerond</p></div>${renderWeekControls(householdWeekStart, 'household')}</div>
      <div class="progress"><span style="width:${percentage}%"></span></div>
      <div class="household-week">${days.map(date => {
        const dayOccurrences = occurrencesForDate(date);
        return `<section class="household-day ${date === todayISO() ? 'today' : ''}"><div class="household-day-title"><span>${fmtDate(date, { weekday: 'long' })}</span><strong>${parseDate(date).getDate()}</strong></div><div class="household-items">${dayOccurrences.length ? dayOccurrences.map(({ chore }) => choreOccurrenceRow(chore, date, true)).join('') : '<p>Geen taken</p>'}</div></section>`;
      }).join('')}</div>
    </section>
    <div class="templates-head"><div><p class="eyebrow">Taakregels</p><h2>Herhalingen beheren</h2></div><button class="primary" data-open-add>＋ Taak toevoegen</button></div>
    <div class="grid three">${['Kees', 'Daphne', 'Samen'].map(person => `<section class="card"><div class="card-head"><h2>${person}</h2><span class="tag ${person === 'Samen' ? 'green' : ''}">${data.chores.filter(chore => chore.person === person).length}</span></div><div class="list">${data.chores.filter(chore => chore.person === person).sort((a, b) => a.due.localeCompare(b.due)).map(choreTemplateRow).join('') || empty('Geen taakregels')}</div></section>`).join('')}</div>`;
}

function choreTemplateRow(chore) {
  return `<div class="list-item"><div class="item-main"><strong>${esc(chore.title)}</strong><small>Vanaf ${fmtDate(chore.due)} · ${esc(repeatLabel(chore))}${chore.notes ? ` · ${esc(chore.notes)}` : ''}</small></div><button class="delete" data-delete="chores:${chore.id}" aria-label="Verwijderen">×</button></div>`;
}

function renderStock() {
  const sorted = [...data.stock].sort((a, b) => Number(a.amount <= a.min) - Number(b.amount <= b.min));
  return `<div class="grid three">${sorted.map(item => {
    const low = Number(item.amount) <= Number(item.min);
    return `<section class="card"><div class="card-head"><span class="tag ${low ? 'red' : 'green'}">${low ? 'Aanvullen' : 'Op peil'}</span><button class="delete" data-delete="stock:${item.id}">×</button></div><h2>${esc(item.title)}</h2><p class="muted">${esc(item.category)}</p><div class="stock-controls"><button class="secondary" data-stock="${item.id}:-1">−</button><strong>${item.amount} <small>${esc(item.unit)}</small></strong><button class="secondary" data-stock="${item.id}:1">＋</button></div><small class="stock-min">Minimum: ${item.min}</small></section>`;
  }).join('') || empty('Voeg producten toe die jullie willen bijhouden')}</div>`;
}

function renderIdeas() {
  return `<section class="card big-choice"><p class="eyebrow">Wat zullen we doen?</p><div id="choice" class="choice">Laat het toeval kiezen</div><button class="primary" data-random>🎲 Kies een idee</button></section><h2 class="section-title">Jullie ideeën</h2><div class="idea-grid">${data.ideas.map(item => `<article class="idea"><button class="delete float-delete" data-delete="ideas:${item.id}">×</button><div class="icon">${esc(item.icon || '♡')}</div><span class="tag orange">${esc(item.category)}</span><h3>${esc(item.title)}</h3><p>${esc(item.note)}</p></article>`).join('') || empty('Bewaar hier leuke ideeën voor samen')}</div>`;
}

function renderHome() {
  return `<div class="grid two">${['Onderhoud', 'Klus', 'Garantie', 'Woninginfo', 'Handleiding'].map(category => {
    const items = data.home.filter(item => item.category === category);
    if (!items.length) return '';
    return `<section class="card"><div class="card-head"><h2>${category}</h2><span class="tag">${items.length}</span></div><div class="list">${items.map(item => `<div class="list-item"><div class="item-main"><strong>${esc(item.title)}</strong><small>${esc(item.note)}${item.due ? ` · ${fmtDate(item.due)}` : ''}</small></div><button class="delete" data-delete="home:${item.id}">×</button></div>`).join('')}</div></section>`;
  }).join('') || empty('Bewaar onderhoud, garanties en woninginformatie')}</div>`;
}

function renderTrips() {
  const folders = [...data.tripFolders].sort((a, b) => (a.startDate || '9999').localeCompare(b.startDate || '9999'));
  return `<div class="trips-toolbar"><div><p class="eyebrow">Jullie reizen</p><h2>Reismappen</h2></div><div class="button-row"><button class="secondary" data-add-trip-folder>＋ Nieuwe reis</button>${folders.length ? '<button class="primary" data-open-add>＋ Onderdeel toevoegen</button>' : ''}</div></div>
    ${folders.length ? `<section class="card import-card travel-import"><div><p class="eyebrow">Reisplan importeren</p><h2>PDF lezen of tekst plakken</h2><p>Kies de reis. De app verdeelt route, vervoer, verblijf, activiteiten, budget, documenten en acties automatisch over mappen. De PDF blijft op dit apparaat; alleen de herkende onderdelen worden opgeslagen.</p></div><div class="travel-import-fields"><label for="travelImportFolder">Toevoegen aan reis</label><select id="travelImportFolder">${folders.map(folder => `<option value="${folder.id}">${esc(folder.name)}</option>`).join('')}</select><label for="travelImportText">Tekst uit reisplan</label><textarea id="travelImportText" placeholder="Plak hier de tekst uit jullie reisplan…"></textarea></div><div class="button-row"><button class="primary" data-import-travel-text>Tekst verdelen</button><button class="secondary" data-pick-file="travelImportFile">PDF of tekstbestand kiezen</button></div></section>` : ''}
    <div class="trip-folder-grid">${folders.map(folder => {
      const sections = data.tripSections.filter(section => section.tripFolderId === folder.id);
      const period = folder.startDate ? `${fmtDate(folder.startDate, { day: 'numeric', month: 'short', year: 'numeric' })}${folder.endDate ? ` – ${fmtDate(folder.endDate, { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}` : 'Datum nog niet bepaald';
      return `<section class="card trip-folder"><div class="trip-folder-head"><div><p class="eyebrow">${esc(period)}</p><h2>📁 ${esc(folder.name)}</h2>${folder.note ? `<p>${esc(folder.note)}</p>` : ''}</div><button class="delete" data-delete-trip-folder="${folder.id}" aria-label="Reismap ${esc(folder.name)} verwijderen">×</button></div>
        <div class="trip-subfolder-grid">${sections.map(section => {
          const items = data.trips.filter(item => item.tripSectionId === section.id).sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
          return `<section class="trip-subfolder"><div class="trip-subfolder-head"><h3>📂 ${esc(section.name)}</h3><button class="delete" data-delete-trip-section="${section.id}" aria-label="Map ${esc(section.name)} verwijderen">×</button></div><div class="list">${items.map(tripItemRow).join('') || '<p class="muted trip-section-empty">Deze map is leeg</p>'}</div><button class="text-btn trip-add-item" data-add-to-trip-section="${section.id}">＋ Onderdeel</button></section>`;
        }).join('') || empty('Maak een map binnen deze reis')}</div>
        <div class="button-row trip-folder-actions"><button class="secondary" data-add-trip-section="${folder.id}">＋ Map in ${esc(folder.name)}</button>${sections.length ? `<button class="secondary" data-add-to-trip="${folder.id}">＋ Onderdeel toevoegen</button>` : ''}</div>
      </section>`;
    }).join('') || `<section class="card trip-empty">${empty('Maak eerst een reismap, bijvoorbeeld Vietnam')}<button class="primary" data-add-trip-folder>＋ Eerste reismap maken</button></section>`}</div>`;
}

function tripItemRow(item) {
  const hasDate = Boolean(item.date);
  return `<div class="list-item ${item.done ? 'is-done' : ''}">${item.checkable ? `<button class="check ${item.done ? 'done' : ''}" data-toggle="trips:${item.id}" aria-label="${item.done ? 'Opnieuw openen' : 'Afronden'}">${item.done ? '✓' : ''}</button>` : ''}<div class="trip-date">${hasDate ? `<strong>${parseDate(item.date).getDate()}</strong><small>${fmtDate(item.date, { month: 'short' })}</small>` : '<strong>–</strong><small>datum</small>'}</div><div class="item-main"><strong class="${item.done ? 'done-text' : ''}">${esc(item.title)}</strong><small>${esc(item.type)}${item.checkable ? ' · Afvinken' : ''}${item.note ? ` · ${esc(item.note)}` : ''}</small></div><button class="delete" data-delete="trips:${item.id}" aria-label="${esc(item.title)} verwijderen">×</button></div>`;
}

function renderSettings() {
  const configured = syncConfigured();
  return `<div class="settings-grid">
    <section class="card settings-card"><div class="card-head"><div><p class="eyebrow">Apparaten</p><h2>Versleutelde synchronisatie</h2></div><span class="tag ${configured ? 'green' : ''}">${configured ? 'Verbonden' : 'Code invullen'}</span></div><p>Vul op elk apparaat dezelfde geheime huishoudcode in. De overige verbindingsgegevens zijn al ingesteld.</p>
      <form id="syncForm" class="form-grid compact-form"><div class="field"><label for="syncHouseholdCode">Geheime huishoudcode (minimaal 12 tekens)</label><input id="syncHouseholdCode" name="householdCode" type="password" value="${esc(syncConfig.householdCode)}" minlength="12" autocomplete="off" placeholder="Jullie gedeelde geheime code"></div><div class="button-row"><button class="primary" type="submit">Bewaren en verbinden</button>${configured ? '<button class="secondary" type="button" data-sync-now>Nu synchroniseren</button>' : ''}</div></form>
    </section>
    ${renderCalendarSettings()}
    <section class="card settings-card"><div class="card-head"><div><p class="eyebrow">Gegevens</p><h2>Back-up</h2></div></div><p>Maak een los JSON-bestand of laad een eerdere back-up. De synchronisatiecode en sleutel worden niet in de back-up gezet.</p><div class="button-row"><button class="secondary" data-action="backup">Back-up maken</button><button class="secondary" data-action="restore">Back-up laden</button></div></section>
    <section class="card settings-card"><div class="card-head"><div><p class="eyebrow">Apple Opdracht</p><h2>Eenvoudig tekstformaat</h2></div></div><p>Laat de Opdracht per afspraak één regel maken:</p><pre><code>Agendanaam | 2026-09-04 | 09:00 | Titel</code></pre><p>De persoon volgt uit de agenda. Een vijfde veld met Kees, Daphne of Samen is optioneel en gaat voor de agendakeuze. Een zesde veld mag de eindtijd bevatten. Bij onbekende namen kies je de persoon één keer.</p><p>Dit is een import, geen tweerichtingskoppeling. Verplaatsen of verwijderen in Apple Agenda wordt niet automatisch overgenomen.</p></section>
  </div>`;
}

function basicRow(title, subtitle, tag, color = '') {
  return `<div class="list-item"><div class="item-main"><strong>${esc(title)}</strong><small>${esc(subtitle)}</small></div>${tag ? `<span class="tag ${color}">${esc(tag)}</span>` : ''}</div>`;
}

function groceryRow(item) {
  return `<div class="list-item"><button class="check ${item.done ? 'done' : ''}" data-toggle="groceries:${item.id}" aria-label="Afvinken">${item.done ? '✓' : ''}</button><div class="item-main"><strong class="${item.done ? 'done-text' : ''}">${esc(item.title)}</strong></div><button class="delete" data-delete="groceries:${item.id}" aria-label="Verwijderen">×</button></div>`;
}

function openAdd(preselectedTripFolderId = '', preselectedTripSectionId = '') {
  if (current === 'planning' && !data.calendars.length) {
    navigate('settings');
    toast('Voeg eerst een agenda toe of herstel een uitgesloten agenda');
    return;
  }
  if (current === 'trips' && !data.tripFolders.length) {
    openTripFolderForm();
    toast('Maak eerst een reismap');
    return;
  }
  if (current === 'trips') {
    const preferredFolder = preselectedTripFolderId || data.tripFolders.find(folder => data.tripSections.some(section => section.tripFolderId === folder.id))?.id || data.tripFolders[0].id;
    if (!data.tripSections.some(section => section.tripFolderId === preferredFolder)) {
      openTripSectionForm(preferredFolder);
      toast('Maak eerst een map binnen deze reis');
      return;
    }
    preselectedTripFolderId = preferredFolder;
  }
  addMode = 'item';
  const config = formConfig(current);
  if (!config) return;
  document.querySelector('#dialogTitle').textContent = config.title;
  document.querySelector('#formFields').innerHTML = config.fields.map(([name, label, type, options, conditionalClass]) => {
    const choices = (options || []).map(option => Array.isArray(option) ? option : [option, option]);
    if (type === 'checkbox') return `<label class="checkbox-field"><input id="f-${name}" name="${name}" type="checkbox"><span>${label}</span></label>`;
    const control = type === 'select'
      ? `<select id="f-${name}" name="${name}">${choices.map(([value, text]) => `<option value="${esc(value)}">${esc(text)}</option>`).join('')}</select>`
      : type === 'textarea'
        ? `<textarea id="f-${name}" name="${name}"></textarea>`
        : `<input id="f-${name}" name="${name}" type="${type}" ${name === 'title' || name === 'due' || (name === 'date' && current !== 'trips') ? 'required' : ''} ${name === 'due' || (name === 'date' && current !== 'trips') ? `value="${todayISO()}"` : ''}>`;
    return `<div class="field ${conditionalClass || ''}"><label for="f-${name}">${label}</label>${control}</div>`;
  }).join('');
  document.querySelector('#itemDialog').showModal();
  if (preselectedTripFolderId && document.querySelector('#f-tripFolderId')) document.querySelector('#f-tripFolderId').value = preselectedTripFolderId;
  if (current === 'trips') refreshTripSectionSelect(preselectedTripFolderId, preselectedTripSectionId);
  toggleSecondWeekdayField();
}

function refreshTripSectionSelect(folderId, selectedSectionId = '') {
  const select = document.querySelector('#f-tripSectionId');
  if (!select) return;
  const sections = data.tripSections.filter(section => section.tripFolderId === folderId);
  select.innerHTML = sections.map(section => `<option value="${esc(section.id)}">${esc(section.name)}</option>`).join('');
  if (selectedSectionId && sections.some(section => section.id === selectedSectionId)) select.value = selectedSectionId;
}

function openTripFolderForm() {
  addMode = 'trip-folder';
  document.querySelector('#dialogTitle').textContent = 'Reismap toevoegen';
  document.querySelector('#formFields').innerHTML = `
    <div class="field"><label for="f-title">Naam van de reis</label><input id="f-title" name="title" type="text" required placeholder="Bijvoorbeeld Vietnam"></div>
    <div class="field"><label for="f-startDate">Vertrekdatum (optioneel)</label><input id="f-startDate" name="startDate" type="date"></div>
    <div class="field"><label for="f-endDate">Terugkomstdatum (optioneel)</label><input id="f-endDate" name="endDate" type="date"></div>
    <div class="field"><label for="f-note">Algemene notitie (optioneel)</label><textarea id="f-note" name="note" placeholder="Bijvoorbeeld bruiloft, route of reisgezelschap"></textarea></div>`;
  document.querySelector('#itemDialog').showModal();
}

function openTripSectionForm(tripFolderId) {
  const folder = tripFolderById(tripFolderId);
  if (!folder) return;
  addMode = 'trip-section';
  document.querySelector('#dialogTitle').textContent = `Map in ${folder.name}`;
  document.querySelector('#formFields').innerHTML = `
    <input name="tripFolderId" type="hidden" value="${esc(folder.id)}">
    <div class="field"><label for="f-title">Naam van de map</label><input id="f-title" name="title" type="text" required placeholder="Bijvoorbeeld Hotels, Vluchten of Paklijst"></div>`;
  document.querySelector('#itemDialog').showModal();
}

function toggleSecondWeekdayField() {
  const repeat = document.querySelector('#f-repeat');
  const field = document.querySelector('.second-weekday');
  if (!field) return;
  field.hidden = repeat?.value !== '2× per week';
  if (!field.hidden && document.querySelector('#f-secondWeekday')) {
    const firstDate = document.querySelector('#f-due')?.value || todayISO();
    document.querySelector('#f-secondWeekday').value = String((weekdayIndex(firstDate) + 3) % 7);
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(event.target));
  if (!formData.title) return;
  if (addMode === 'trip-folder') {
    const folderId = id();
    data.tripFolders.push({ id: folderId, name: formData.title.trim(), startDate: formData.startDate || '', endDate: formData.endDate || '', note: formData.note?.trim() || '' });
    data.tripSections.push({ id: id(), tripFolderId: folderId, name: 'Algemeen' });
    save();
    document.querySelector('#itemDialog').close();
    render();
    toast('Reismap toegevoegd');
    return;
  }
  if (addMode === 'trip-section') {
    if (!tripFolderById(formData.tripFolderId)) return toast('Reis niet gevonden');
    data.tripSections.push({ id: id(), tripFolderId: formData.tripFolderId, name: formData.title.trim() });
    save();
    document.querySelector('#itemDialog').close();
    render();
    toast('Map toegevoegd');
    return;
  }
  ['amount', 'min'].forEach(key => { if (key in formData) formData[key] = Number(formData[key]); });
  if (current === 'groceries') formData.done = false;
  if (current === 'chores') formData.completedDates = [];
  if (current === 'planning') formData.personSource = 'manual';
  if (current === 'trips') {
    const section = tripSectionById(formData.tripSectionId);
    if (!section || section.tripFolderId !== formData.tripFolderId) return toast('Kies een geldige map binnen de reis');
    formData.checkable = formData.checkable === 'on';
    formData.done = false;
    if (formData.checkable && !formData.date) return toast('Kies een deadline voor een onderdeel dat afgevinkt moet worden');
  }
  data[current].push({ id: id(), ...formData });
  save();
  document.querySelector('#itemDialog').close();
  render();
  toast('Toegevoegd');
}

function openQuestion(person) {
  const answers = data.dailyAnswers[todayISO()] || {};
  if (answers.Kees && answers.Daphne) {
    toast('Beide antwoorden staan vast');
    return;
  }
  if (answers[person]) {
    toast(`${person} heeft vandaag al geantwoord`);
    return;
  }
  const answer = data.dailyAnswers[todayISO()]?.[person]?.answer || '';
  document.querySelector('#questionTitle').textContent = `${person}, jouw antwoord`;
  document.querySelector('#questionText').textContent = questionForDate(todayISO());
  document.querySelector('#questionPerson').value = person;
  document.querySelector('#questionAnswer').value = answer;
  document.querySelector('#questionDialog').showModal();
  document.querySelector('#questionAnswer').focus();
}

function handleQuestionSubmit(event) {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(event.target));
  const existing = data.dailyAnswers[todayISO()] || {};
  if ((existing.Kees && existing.Daphne) || existing[formData.person]) {
    document.querySelector('#questionDialog').close();
    render();
    toast('Dit antwoord staat al vast');
    return;
  }
  const answer = formData.answer.trim();
  if (!answer) return;
  data.dailyAnswers[todayISO()] ||= {};
  data.dailyAnswers[todayISO()][formData.person] = { answer, answeredAt: new Date().toISOString() };
  save();
  document.querySelector('#questionDialog').close();
  render();
  toast('Antwoord bewaard');
}

function normalizeProductKey(title) {
  return title.toLowerCase().replace(/^✓\s*/, '').replace(/\s+/g, ' ').trim();
}

function categorizeProduct(title) {
  const value = title.toLowerCase();
  const hasKeyword = keyword => keyword.trim().length <= 3
    ? new RegExp(`(^|[^a-zà-ÿ])${keyword.trim()}([^a-zà-ÿ]|$)`, 'i').test(value)
    : value.includes(keyword);
  const rules = [
    ['Schoonmaak', ['afwasmiddel', 'wasmiddel', 'vaatwastablet', 'schoonmaak', 'allesreiniger', 'bleek', 'spons', 'vuilniszak']],
    ['Drinken', ['koffie', 'thee', 'sap', 'frisdrank', 'water', 'bier', 'wijn', 'drinken']],
    ['Diepvries', ['diepvries', 'frozen', 'gyoza', 'ijs', 'doperwten']],
    ['Vlees & vis', ['kipfilet', 'kippen', 'kip', 'chicken', 'rund', 'gehakt', 'vlees', 'vis', 'zalm', 'tonijn', 'worst']],
    ['Zuivel & vega', ['melk', 'kaas', 'parmezaan', 'boter', 'yoghurt', 'room', 'eieren', 'ei', 'vegan ranch', 'vega', 'tofu', 'tempeh']],
    ['Brood & wraps', ['brood', 'lavash', 'tortilla', 'wrap', 'bolletje', 'stokbrood', 'cracker']],
    ['Kruiden & sauzen', ['zout', 'salt', 'peper', 'pepper', 'olie', 'oil', 'saus', 'sauce', 'sojasaus', 'gochujang', 'tomatenpuree', 'pindakaas', 'seasoning', 'kruid', 'bouillon', 'maple syrup']],
    ['Fruit', ['limoen', 'citroen', 'appel', 'peer', 'banaan', 'sinaasappel', 'mango', 'fruit', 'aardbei', 'druif']],
    ['Groente', ['spinazie', 'paksoi', 'courgette', 'ui', 'onion', 'knoflook', 'garlic', 'champignon', 'gember', 'bosui', 'tomaat', 'tomato', 'lettuce', 'sla', 'paprika', 'komkommer', 'wortel', 'groente', 'prei', 'kool', 'broccoli']],
    ['Voorraadkast', ['rijst', 'risotto', 'pasta', 'noedel', 'udon', 'meel', 'suiker', 'pinda', 'noten', 'kokosmelk', 'kikkererwt', 'chickpea', 'blik', 'can ']]
  ];
  return rules.find(([, keywords]) => keywords.some(hasKeyword))?.[0] || 'Overig';
}

function parseGroceryText(text) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (/^[\[{]/.test(trimmed)) {
    try {
      const parsed = JSON.parse(trimmed);
      const items = Array.isArray(parsed) ? parsed : parsed.groceries;
      if (Array.isArray(items)) return items.map(item => typeof item === 'string' ? { title: item } : item).filter(item => item.title).map(item => ({ title: String(item.title).trim(), done: Boolean(item.done), category: item.category || categorizeProduct(item.title) }));
    } catch { /* fall through to lines */ }
  }
  return trimmed.split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith('#') && !/^grocery list$/i.test(line)).map(line => {
    const done = /^[✓✔]\s*/.test(line);
    const title = line.replace(/^[✓✔]\s*/, '').replace(/^[-•]\s*/, '').trim();
    return { title, done, category: categorizeProduct(title) };
  }).filter(item => item.title);
}

function addGroceries(items) {
  let added = 0;
  let updated = 0;
  items.forEach(item => {
    const existing = data.groceries.find(candidate => normalizeProductKey(candidate.title) === normalizeProductKey(item.title));
    if (existing) {
      if (item.done && !existing.done) { existing.done = true; updated += 1; }
      if (!existing.category || existing.category === 'Overig') existing.category = item.category;
      return;
    }
    data.groceries.push({ id: id(), title: item.title, category: item.category || categorizeProduct(item.title), done: Boolean(item.done) });
    added += 1;
  });
  if (added || updated) save();
  return { added, updated };
}

function importGroceries(text) {
  const items = parseGroceryText(text);
  if (!items.length) return toast('Geen boodschappen gevonden');
  const { added, updated } = addGroceries(items);
  render();
  toast(`${added} boodschappen toegevoegd${updated ? `, ${updated} bijgewerkt` : ''}`);
}

function parseInputDate(value) {
  const clean = String(value || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;
  const match = clean.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  return match ? `${match[3]}-${pad(match[2])}-${pad(match[1])}` : '';
}

function cleanCalendarName(name) {
  return String(name || 'Persoonlijk').normalize('NFKC').replace(/\s+/g, ' ').trim() || 'Persoonlijk';
}

function calendarNameKey(name) {
  return cleanCalendarName(name).toLowerCase();
}

function validCalendarPerson(value) {
  return ['Kees', 'Daphne', 'Samen'].find(person => person.toLowerCase() === String(value || '').trim().toLowerCase()) || '';
}

function inferCalendarPerson(name) {
  const key = calendarNameKey(name);
  const kees = /\bkees\b/.test(key);
  const daphne = /\bdaphne\b/.test(key);
  if ((kees && daphne) || /\bsamen\b/.test(key) || key === 'gezamenlijk') return 'Samen';
  if (daphne) return 'Daphne';
  if (kees || key === 'vitestro' || /^coach[\s-]+o23$/.test(key)) return 'Kees';
  return '';
}

function isCalendarExcluded(name) {
  return data.excludedCalendars.some(item => calendarNameKey(item.name) === calendarNameKey(name));
}

function calendarPersonOptions(selected = '') {
  return '<option value="">Kies persoon…</option>' + ['Kees', 'Daphne', 'Samen'].map(person =>
    '<option value="' + person + '"' + (person === selected ? ' selected' : '') + '>' + person + '</option>'
  ).join('');
}

function setCalendarPerson(calendarId, value) {
  const person = validCalendarPerson(value);
  const calendar = data.calendars.find(item => item.id === calendarId);
  if (!calendar || !person) return false;
  calendar.person = person;
  data.planning.forEach(item => {
    if (item.calendarId === calendar.id && item.personSource !== 'explicit' && item.personSource !== 'manual') {
      item.person = person;
      item.personSource = 'calendar';
    }
  });
  return true;
}

function renderCalendarSettings() {
  const active = data.calendars.map(calendar =>
    '<article class="card" style="padding:12px">' +
      '<div class="button-row"><label><input type="checkbox" data-calendar-visible="' + esc(calendar.id) + '"' + (calendar.visible !== false ? ' checked' : '') + '> ' + esc(calendar.name) + '</label>' +
      '<input type="color" value="' + esc(calendar.color) + '" data-calendar-color="' + esc(calendar.id) + '" aria-label="Kleur voor ' + esc(calendar.name) + '">' +
      '<button type="button" class="text-btn" data-remove-calendar="' + esc(calendar.id) + '">Verwijderen</button></div>' +
      '<div class="field" style="margin-top:10px"><label for="owner-' + esc(calendar.id) + '">Voor wie?</label>' +
      '<select id="owner-' + esc(calendar.id) + '" data-calendar-person="' + esc(calendar.id) + '">' + calendarPersonOptions(calendar.person) + '</select></div></article>'
  ).join('');
  const excluded = data.excludedCalendars.map(calendar =>
    '<div class="list-item"><div class="item-main"><strong>' + esc(calendar.name) + '</strong><small>Wordt bij import overgeslagen' +
    (calendar.keepEvents ? ' · eerdere afspraken bewaard' : '') + '</small></div>' +
    '<button type="button" class="secondary" data-restore-calendar="' + esc(calendar.id) + '">Herstellen</button></div>'
  ).join('');
  return '<section class="card settings-card"><div class="card-head"><div><p class="eyebrow">Apple Agenda</p><h2>Agenda’s beheren</h2></div><span class="tag">' + data.calendars.length + '</span></div>' +
    '<p>Het vinkje bepaalt de zichtbaarheid. Kies per agenda Kees, Daphne of Samen. Deze keuze geldt ook voor bestaande afspraken zonder handmatig gekozen persoon. Een persoon in de importregel gaat voor.</p>' +
    '<div class="calendar-settings">' + (active || empty('Geen actieve agenda’s')) + '</div>' +
    '<form id="calendarForm" class="form-grid"><div class="field"><label for="new-calendar-name">Nieuwe agenda</label><input id="new-calendar-name" name="name" required placeholder="Agendanaam"></div>' +
    '<div class="field"><label for="new-calendar-person">Voor wie? (optioneel)</label><select id="new-calendar-person" name="person">' + calendarPersonOptions() + '</select></div>' +
    '<button class="secondary" type="submit">Toevoegen</button></form>' +
    (excluded ? '<h3>Uitgesloten agenda’s</h3><p>Herstel een agenda om nieuwe imports weer toe te laten. Gewiste afspraken komen pas terug als je ze opnieuw importeert.</p><div class="list">' + excluded + '</div>' : '') +
    '<p>Verwijderen of herstellen verandert niets in Apple Agenda.</p></section>';
}

function getCalendarDialog() {
  let dialog = document.querySelector('#calendarManagementDialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'calendarManagementDialog';
    dialog.setAttribute('aria-labelledby', 'calendarManagementTitle');
    dialog.addEventListener('close', () => { calendarOperation = null; });
    document.body.appendChild(dialog);
  }
  return dialog;
}

function showCalendarDialog(title, body, submitLabel) {
  const dialog = getCalendarDialog();
  dialog.innerHTML = '<form><div class="dialog-head"><h2 id="calendarManagementTitle">' + esc(title) + '</h2>' +
    '<button class="icon-btn" type="button" data-cancel-calendar aria-label="Sluiten">×</button></div>' +
    '<div class="form-grid">' + body + '</div><div class="dialog-actions">' +
    '<button class="secondary" type="button" data-cancel-calendar>Annuleren</button>' +
    '<button class="primary" type="submit">' + esc(submitLabel) + '</button></div></form>';
  dialog.querySelectorAll('[data-cancel-calendar]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const operation = calendarOperation;
    if (!operation || !event.target.reportValidity()) return;
    const fields = new FormData(event.target);
    if (operation.type === 'import') {
      const choices = new Map(operation.unknown.map(([key], index) => [key, fields.get('owner_' + index)]));
      if ([...choices.values()].some(value => !validCalendarPerson(value))) return;
      dialog.close();
      finishCalendarImport(operation.events, choices);
    } else if (operation.type === 'remove') {
      const deleteEvents = fields.get('deleteEvents') === 'on';
      dialog.close();
      const removed = removeCalendar(operation.calendarId, deleteEvents);
      if (!removed) return;
      save();
      render();
      toast(deleteEvents ? 'Agenda uitgesloten; afspraken gewist. Opnieuw importeren kan na herstellen.' : 'Agenda uitgesloten; afspraken bewaard');
    }
  });
  dialog.showModal();
}

function openCalendarMapping(events, unknown) {
  if (calendarOperation) return toast('Rond eerst het geopende agendavenster af');
  calendarOperation = { type: 'import', events, unknown };
  const fields = unknown.map(([key, name], index) =>
    '<div class="field"><label for="import-owner-' + index + '">' + esc(name) + '</label>' +
    '<select id="import-owner-' + index + '" name="owner_' + index + '" required>' + calendarPersonOptions() + '</select></div>'
  ).join('');
  showCalendarDialog('Van wie zijn deze agenda’s?', '<p>Kies één keer per agenda. De app onthoudt dit voor volgende imports. Annuleren voegt niets toe.</p>' + fields, 'Bewaren en importeren');
}

function openRemoveCalendar(calendarId) {
  if (calendarOperation) return toast('Rond eerst het geopende agendavenster af');
  const calendar = data.calendars.find(item => item.id === calendarId);
  if (!calendar) return;
  const count = data.planning.filter(item => item.calendarId === calendarId).length;
  calendarOperation = { type: 'remove', calendarId };
  showCalendarDialog('Agenda verwijderen', '<p><strong>' + esc(calendar.name) + '</strong> wordt verwijderd uit je actieve lijst en voortaan overgeslagen bij import. Je kunt dit later herstellen.</p>' +
    '<label><input type="checkbox" name="deleteEvents"> Ook de ' + count + ' afspraken uit Samen Thuis wissen</label>' +
    '<p>Niet aangevinkt? De afspraken blijven zichtbaar met “bewaard” bij de agendanaam. Apple Agenda blijft altijd ongewijzigd.</p>', 'Verwijderen en uitsluiten');
}

function removeCalendar(calendarId, deleteEvents = false) {
  const calendar = data.calendars.find(item => item.id === calendarId);
  if (!calendar) return false;
  data.excludedCalendars.push({ ...calendar, keepEvents: !deleteEvents, removedAt: new Date().toISOString() });
  data.calendars = data.calendars.filter(item => item.id !== calendarId);
  if (deleteEvents) data.planning = data.planning.filter(item => item.calendarId !== calendarId);
  return true;
}

function restoreCalendar(calendarId) {
  const calendar = data.excludedCalendars.find(item => item.id === calendarId);
  if (!calendar) return false;
  const { keepEvents, removedAt, ...restored } = calendar;
  restored.visible = true;
  restored.person = validCalendarPerson(restored.person) || inferCalendarPerson(restored.name);
  data.excludedCalendars = data.excludedCalendars.filter(item => item.id !== calendarId);
  data.calendars.push(restored);
  return true;
}

function ensureCalendar(name) {
  const clean = cleanCalendarName(name);
  if (isCalendarExcluded(clean)) return null;
  let calendar = data.calendars.find(item => calendarNameKey(item.name) === calendarNameKey(clean));
  if (!calendar) {
    calendar = { id: `cal-${id()}`, name: clean, color: CALENDAR_COLORS[data.calendars.length % CALENDAR_COLORS.length], visible: true, person: inferCalendarPerson(clean) };
    data.calendars.push(calendar);
  }
  return calendar;
}

function parseCalendarText(text) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (/^[\[{]/.test(trimmed)) {
    try {
      const parsed = JSON.parse(trimmed);
      const items = Array.isArray(parsed) ? parsed : parsed.events || parsed.planning;
      if (Array.isArray(items)) return items.map(item => ({
        calendar: cleanCalendarName(item.calendar || item.calendarName), date: parseInputDate(item.date), time: String(item.time || '').trim(), endTime: String(item.endTime || '').trim(), title: String(item.title || item.name || '').trim(), person: validCalendarPerson(item.person)
      })).filter(item => item.date && item.title);
    } catch { /* fall through to lines */ }
  }
  return trimmed.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
    const parts = line.split(/\s*[|;\t]\s*/);
    if (parts.length < 4) return null;
    return { calendar: cleanCalendarName(parts[0]), date: parseInputDate(parts[1]), time: parts[2] || '', title: parts[3] || '', person: validCalendarPerson(parts[4]), endTime: parts[5] || '' };
  }).filter(item => item?.date && item.title);
}

function importCalendar(text) {
  const events = parseCalendarText(text);
  if (!events.length) return toast('Geen agenda-items gevonden');
  const unknown = new Map();
  events.forEach(event => {
    if (isCalendarExcluded(event.calendar)) return;
    const key = calendarNameKey(event.calendar);
    const calendar = data.calendars.find(item => calendarNameKey(item.name) === key);
    if (!validCalendarPerson(calendar?.person) && !inferCalendarPerson(event.calendar)) unknown.set(key, event.calendar);
  });
  if (unknown.size) {
    openCalendarMapping(events, [...unknown.entries()]);
    return;
  }
  finishCalendarImport(events);
}

function finishCalendarImport(events, choices = new Map()) {
  let added = 0;
  let updated = 0;
  let skipped = 0;
  let newCalendars = 0;
  let mappingChanged = false;
  events.forEach(event => {
    const previousCount = data.calendars.length;
    const calendar = ensureCalendar(event.calendar);
    if (!calendar) { skipped += 1; return; }
    newCalendars += data.calendars.length - previousCount;
    const selected = validCalendarPerson(choices.get(calendarNameKey(event.calendar)));
    if (selected && calendar.person !== selected) {
      setCalendarPerson(calendar.id, selected);
      mappingChanged = true;
    }
    const person = validCalendarPerson(event.person) || calendar.person || inferCalendarPerson(calendar.name) || 'Samen';
    const personSource = validCalendarPerson(event.person) ? 'explicit' : 'calendar';
    const duplicate = data.planning.find(item => item.date === event.date && item.time === event.time && item.title.toLowerCase() === event.title.toLowerCase() && item.calendarId === calendar.id);
    if (duplicate) {
      // Een handmatig gemaakte afspraak wordt nooit door een import overschreven.
      if (duplicate.personSource !== 'manual' && (duplicate.person !== person || duplicate.endTime !== event.endTime || duplicate.personSource !== personSource)) {
        Object.assign(duplicate, { person, personSource, endTime: event.endTime });
        updated += 1;
      }
      return;
    }
    data.planning.push({ id: id(), title: event.title, date: event.date, time: event.time, endTime: event.endTime, person, personSource, calendarId: calendar.id });
    added += 1;
  });
  if (added || updated || newCalendars || mappingChanged) save();
  render();
  toast(`${added} toegevoegd · ${updated} bijgewerkt · ${skipped} uitgesloten`);
  return { added, updated, skipped, newCalendars };
}

function importOsta(text) {
  const lines = text.split(/\r?\n/);
  const groceryHeading = lines.findIndex(line => /^\s*#?\s*grocery list\s*$/i.test(line));
  let groceryItems = [];
  let mealLines = lines;
  if (groceryHeading >= 0) {
    groceryItems = parseGroceryText(lines.slice(groceryHeading + 1).join('\n'));
    mealLines = lines.slice(0, groceryHeading);
  }
  const dayMap = new Map(WEEKDAY_NAMES.map((name, index) => [name.toLowerCase(), index]));
  const start = startOfWeek(todayISO());
  let mealCount = 0;
  const plainMeals = [];
  mealLines.map(line => line.trim()).filter(line => line && !line.startsWith('#')).forEach(line => {
    const match = line.match(/^(maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag)\s*[:|-]\s*(.+)$/i);
    if (!match) { plainMeals.push(line.replace(/^[-•]\s*/, '')); return; }
    const date = addDays(start, dayMap.get(match[1].toLowerCase()));
    if (!data.meals.some(item => item.date === date && item.title.toLowerCase() === match[2].trim().toLowerCase())) {
      data.meals.push({ id: id(), date, type: 'Avondeten', title: match[2].trim() });
      mealCount += 1;
    }
  });
  if (!mealCount && groceryHeading < 0 && plainMeals.length > 0 && plainMeals.length <= 7) {
    plainMeals.forEach((title, index) => {
      data.meals.push({ id: id(), date: addDays(start, index), type: 'Avondeten', title });
      mealCount += 1;
    });
  }
  const groceryResult = addGroceries(groceryItems);
  if (mealCount && !groceryResult.added && !groceryResult.updated) save();
  render();
  toast(`${mealCount} maaltijden en ${groceryResult.added} boodschappen toegevoegd`);
}

const TRAVEL_IMPORT_CATEGORIES = [
  { name: 'Documenten & gezondheid', type: 'Documenten', match: /paspoort|visum|visa\b|verzekering|vaccin|medic|gezondheid|dokter|recept|astma/i },
  { name: 'Paklijst', type: 'Paklijst', match: /paklijst|inpakken|meenemen|bagage|koffer|rugzak|handbagage/i },
  { name: 'Vervoer', type: 'Vervoer', match: /vlucht|flight|vliegtuig|trein|bus\b|transfer|taxi|grab\b|veerboot|ferry|cruise|vervoer/i },
  { name: 'Verblijf', type: 'Verblijf', match: /hotel|hostel|resort|homestay|appartement|verblijf|overnacht|accommodat|check-in|check-out/i },
  { name: 'Eten & drinken', type: 'Eten', match: /restaurant|ontbijt|lunch|diner|avondeten|eten|drinken|vegetari|food/i },
  { name: 'Budget', type: 'Budget', match: /budget|kosten|prijs|prijzen|totaal|betaalmiddel|contant|valuta|\bvnd\b|\busd\b|\beur\b|€/i },
  { name: 'Activiteiten', type: 'Activiteit', match: /activiteit|excursie|tour\b|bezoek|museum|strand|hike|wandeling|massage|spa\b|skincare|kleermaker|tailor|ring|workshop/i },
  { name: 'Boekingen & acties', type: 'Voorbereiding', match: /boeken|reserveren|regelen|controleren|aanvragen|bevestigen|betalen|kopen|bestellen|afspraak maken|to-do|todo|actiepunt|deadline/i },
  { name: 'Route & planning', type: 'Notitie', match: /route|reisplan|planning|programma|reisschema|itinerary|dagindeling|dag\s+\d+/i }
];

const DUTCH_MONTHS = {
  januari: 1, jan: 1, februari: 2, feb: 2, maart: 3, mrt: 3, april: 4, apr: 4, mei: 5, juni: 6, jun: 6,
  juli: 7, jul: 7, augustus: 8, aug: 8, september: 9, sep: 9, oktober: 10, okt: 10, november: 11, nov: 11, december: 12, dec: 12
};

function travelImportCategory(line) {
  return TRAVEL_IMPORT_CATEGORIES.find(category => category.match.test(line));
}

function travelImportHeading(line) {
  const clean = line.replace(/^#{1,6}\s*/, '').replace(/[:：]\s*$/, '').trim();
  if (clean.length < 3 || clean.length > 70) return '';
  const knownCategory = travelImportCategory(clean);
  if (knownCategory && (/^#{1,6}\s*/.test(line) || /[:：]\s*$/.test(line) || clean.toUpperCase() === clean)) return knownCategory.name;
  const looksLikeHeading = /^#{1,6}\s*/.test(line) || /[:：]\s*$/.test(line) || /^[A-ZÀ-Ÿ0-9][A-ZÀ-Ÿ0-9 &/+-]{3,}$/.test(clean) || /^(deel|week|hoofdstuk)\s+\d+\b/i.test(clean);
  return looksLikeHeading ? clean.replace(/^\d+[.)]\s*/, '').slice(0, 60) : '';
}

function validTravelDate(year, month, day) {
  const date = new Date(Number(year), Number(month) - 1, Number(day), 12);
  return date.getFullYear() === Number(year) && date.getMonth() === Number(month) - 1 && date.getDate() === Number(day) ? toLocalISO(date) : '';
}

function travelDateFromLine(line, folder) {
  const iso = line.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/);
  if (iso) return validTravelDate(iso[1], iso[2], iso[3]);
  const numeric = line.match(/\b(\d{1,2})[-/.](\d{1,2})(?:[-/.](20\d{2}))?\b/);
  const fallbackYear = folder?.startDate ? parseDate(folder.startDate).getFullYear() : new Date().getFullYear();
  if (numeric) return validTravelDate(numeric[3] || fallbackYear, numeric[2], numeric[1]);
  const written = line.match(/\b(\d{1,2})\s+(januari|jan|februari|feb|maart|mrt|april|apr|mei|juni|jun|juli|jul|augustus|aug|september|sep|oktober|okt|november|nov|december|dec)(?:\s+(20\d{2}))?\b/i);
  return written ? validTravelDate(written[3] || fallbackYear, DUTCH_MONTHS[written[2].toLowerCase()], written[1]) : '';
}

function ensureTripSection(folderId, name) {
  const clean = String(name || 'Algemeen').trim().slice(0, 60) || 'Algemeen';
  let section = data.tripSections.find(item => item.tripFolderId === folderId && item.name.toLowerCase() === clean.toLowerCase());
  if (!section) {
    section = { id: id(), tripFolderId: folderId, name: clean };
    data.tripSections.push(section);
  }
  return section;
}

function importTravelPlan(text, folderId) {
  const folder = data.tripFolders.find(item => item.id === folderId);
  if (!folder) return toast('Kies eerst een reismap');
  const seenLines = new Set();
  let sectionName = 'Algemeen';
  let added = 0;
  let checkableCount = 0;
  let skipped = 0;
  const rawLines = String(text || '').replace(/\u00ad/g, '').split(/\r?\n/);
  rawLines.forEach(rawLine => {
    if (added >= 300) { skipped += 1; return; }
    const source = rawLine.replace(/\s+/g, ' ').trim();
    if (!source || /^pagina\s+\d+(?:\s+van\s+\d+)?$/i.test(source) || /^\d+$/.test(source)) return;
    const heading = travelImportHeading(source);
    if (heading) { sectionName = heading; return; }
    const done = /^(?:✓|✔|☑|\[x\])\s*/i.test(source);
    const explicitAction = /^(?:☐|□|\[\s?\]|todo:|to-do:|actie:)/i.test(source);
    const clean = source.replace(/^(?:[-•▪◦‣–—]|✓|✔|☑|☐|□|\[x\]|\[\s?\])\s*/i, '').trim();
    if (clean.length < 3) return;
    const lineKey = clean.toLowerCase().replace(/[^a-z0-9à-ÿ]+/g, ' ').trim();
    if (!lineKey || seenLines.has(lineKey)) return;
    seenLines.add(lineKey);
    const detected = travelImportCategory(clean);
    const targetSection = ensureTripSection(folder.id, detected?.name || sectionName);
    const type = detected?.type || travelImportCategory(targetSection.name)?.type || 'Notitie';
    const checkable = done || explicitAction || /\b(boeken|reserveren|regelen|controleren|aanvragen|bevestigen|betalen|kopen|bestellen|inpakken|meenemen|afspreken|downloaden|printen)\b/i.test(clean);
    const duplicate = data.trips.some(item => item.tripFolderId === folder.id && item.title.toLowerCase() === clean.toLowerCase());
    if (duplicate) { skipped += 1; return; }
    const title = clean.length <= 170 ? clean : `${clean.slice(0, 167).trim()}…`;
    const note = clean.length > 170 ? clean.slice(167).trim() : '';
    data.trips.push({ id: id(), tripFolderId: folder.id, tripSectionId: targetSection.id, title, date: travelDateFromLine(clean, folder), type, note, checkable, done: checkable ? done : false });
    added += 1;
    if (checkable) checkableCount += 1;
  });
  if (!added) return toast('Geen nieuwe reisonderdelen gevonden');
  save();
  render();
  toast(`${added} onderdelen verdeeld · ${checkableCount} om af te vinken${skipped ? ` · ${skipped} overgeslagen` : ''}`);
}

async function extractPdfText(file) {
  const pdfjs = await import(PDFJS_URL);
  pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  const pdf = await loadingTask.promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const lines = [];
    let currentLine = [];
    let previousY = null;
    content.items.forEach(item => {
      const value = String(item.str || '').trim();
      if (!value) return;
      const y = Math.round(item.transform?.[5] || 0);
      if (previousY !== null && Math.abs(y - previousY) > 2 && currentLine.length) {
        lines.push(currentLine.join(' '));
        currentLine = [];
      }
      currentLine.push(value);
      previousY = y;
      if (item.hasEOL && currentLine.length) {
        lines.push(currentLine.join(' '));
        currentLine = [];
        previousY = null;
      }
    });
    if (currentLine.length) lines.push(currentLine.join(' '));
    pages.push(lines.join('\n'));
  }
  return pages.join('\n\n');
}

async function readTravelImportFile(file) {
  const folderId = document.querySelector('#travelImportFolder')?.value;
  if (!folderId) return toast('Kies eerst een reismap');
  try {
    toast(file.type === 'application/pdf' || /\.pdf$/i.test(file.name) ? 'PDF wordt gelezen…' : 'Bestand wordt gelezen…');
    const text = file.type === 'application/pdf' || /\.pdf$/i.test(file.name) ? await extractPdfText(file) : await file.text();
    if (!text.trim()) return toast('In dit bestand is geen leesbare tekst gevonden');
    importTravelPlan(text, folderId);
  } catch (error) {
    console.error('Reisbestand lezen mislukt', error);
    toast('PDF lezen lukte niet. Kopieer de tekst en plak die hier.');
  }
}

async function readImportFile(file, type) {
  try {
    const text = await file.text();
    if (type === 'groceries') importGroceries(text);
    if (type === 'osta') importOsta(text);
    if (type === 'calendar') importCalendar(text);
  } catch {
    toast('Dit bestand kon niet worden gelezen');
  }
}

function downloadBackup(file) {
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(file);
  anchor.download = file.name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
  toast('Back-up opgeslagen');
}

async function exportBackup() {
  const file = new File([JSON.stringify(data, null, 2)], `samen-thuis-backup-${todayISO()}.json`, { type: 'application/json' });
  const isAppleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (isAppleMobile && navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Samen Thuis back-up', text: 'Bewaar deze back-up in Bestanden.' });
      toast('Back-up gedeeld');
      return;
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
  }
  downloadBackup(file);
}

async function importBackup(file) {
  try {
    const parsed = JSON.parse(await file.text());
    data = migrateData(parsed);
    save();
    render();
    toast('Back-up hersteld');
  } catch {
    toast('Dit bestand is geen geldige back-up');
  }
}

function syncConfigured() {
  return Boolean(syncConfig.projectUrl && syncConfig.anonKey && syncConfig.householdCode?.length >= 12);
}

function updateSyncBadge(message) {
  const badge = document.querySelector('#syncState');
  if (!badge) return;
  if (message) badge.textContent = message;
  else if (!syncConfigured()) badge.textContent = 'Alleen dit apparaat';
  else if (!navigator.onLine) badge.textContent = 'Offline · later synchroniseren';
  else if (syncing) badge.textContent = 'Synchroniseren…';
  else if (syncError) badge.textContent = 'Sync controleren';
  else badge.textContent = syncConfig.lastSyncedAt ? 'Apparaten gelijk' : 'Sync gereed';
  badge.classList.toggle('connected', syncConfigured() && !syncing && !syncError);
}

function bytesToBase64(bytes) {
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), character => character.charCodeAt(0));
}

async function sha256(value) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function deriveKey(code, salt) {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(code), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 250000 }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

async function encryptData(value, code) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(code, salt);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(value)));
  return { version: 1, salt: bytesToBase64(salt), iv: bytesToBase64(iv), ciphertext: bytesToBase64(new Uint8Array(encrypted)) };
}

async function decryptData(payload, code) {
  const salt = base64ToBytes(payload.salt);
  const iv = base64ToBytes(payload.iv);
  const key = await deriveKey(code, salt);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, base64ToBytes(payload.ciphertext));
  return JSON.parse(new TextDecoder().decode(decrypted));
}

function supabaseHeaders() {
  const headers = { apikey: syncConfig.anonKey, 'Content-Type': 'application/json' };
  // Nieuwe publishable keys zijn geen JWT; alleen de legacy anon-key gaat ook in Bearer.
  if (!syncConfig.anonKey.startsWith('sb_publishable_')) headers.Authorization = `Bearer ${syncConfig.anonKey}`;
  return headers;
}

async function syncNow({ manual = false } = {}) {
  if (!syncConfigured() || syncing || !navigator.onLine) {
    if (manual && !navigator.onLine) toast('Geen internetverbinding');
    return;
  }
  syncing = true;
  syncError = '';
  updateSyncBadge();
  try {
    if (!window.crypto?.subtle) throw new Error('Versleuteling vereist HTTPS');
    const householdId = await sha256(syncConfig.householdCode.trim());
    const baseUrl = syncConfig.projectUrl.replace(/\/+$/, '');
    const response = await fetch(`${baseUrl}/rest/v1/household_data?id=eq.${householdId}&select=payload,updated_at`, { headers: supabaseHeaders() });
    if (!response.ok) throw new Error(`Supabase gaf ${response.status}`);
    const rows = await response.json();
    let remoteData = null;
    if (rows[0]?.payload) remoteData = migrateData(await decryptData(rows[0].payload, syncConfig.householdCode));
    const isFirstConnection = !syncConfig.lastSyncedAt;
    const remoteIsNewer = remoteData && new Date(remoteData.meta.updatedAt) > new Date(data.meta.updatedAt);
    if (remoteData && (isFirstConnection || remoteIsNewer)) {
      data = remoteData;
      save({ touch: false, sync: false });
    } else if (!remoteData || new Date(data.meta.updatedAt) >= new Date(remoteData.meta.updatedAt)) {
      const payload = await encryptData(data, syncConfig.householdCode);
      const upload = await fetch(`${baseUrl}/rest/v1/household_data?on_conflict=id`, {
        method: 'POST', headers: { ...supabaseHeaders(), Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify({ id: householdId, payload, updated_at: data.meta.updatedAt })
      });
      if (!upload.ok) throw new Error(`Opslaan gaf ${upload.status}`);
    }
    syncConfig.lastSyncedAt = new Date().toISOString();
    syncError = '';
    localStorage.setItem(SYNC_KEY, JSON.stringify(syncConfig));
    if (current === 'settings' || remoteData) render();
    if (manual) toast('Apparaten zijn bijgewerkt');
  } catch (error) {
    console.error('Synchronisatie mislukt', error);
    syncError = error.message || 'Synchronisatie mislukt';
    if (manual) toast('Synchronisatie lukt nog niet. Controleer de instellingen.');
  } finally {
    syncing = false;
    updateSyncBadge();
  }
}

function scheduleSync() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => syncNow(), 1200);
}

function handleSyncForm(event) {
  event.preventDefault();
  const fields = Object.fromEntries(new FormData(event.target));
  const next = { projectUrl: DEFAULT_PROJECT_URL, anonKey: DEFAULT_PUBLISHABLE_KEY, householdCode: String(fields.householdCode || '').trim() };
  if (next.householdCode.length < 12) return toast('Kies een huishoudcode van minimaal 12 tekens');
  const changedHousehold = next.projectUrl !== syncConfig.projectUrl || next.anonKey !== syncConfig.anonKey || next.householdCode !== syncConfig.householdCode;
  syncConfig = { ...syncConfig, ...next, lastSyncedAt: changedHousehold ? '' : syncConfig.lastSyncedAt };
  localStorage.setItem(SYNC_KEY, JSON.stringify(syncConfig));
  render();
  syncNow({ manual: true });
}

function handleInitialAgendaImport() {
  const params = new URLSearchParams(location.search);
  const agendaText = params.get('agenda');
  if (!agendaText) return;
  importCalendar(agendaText);
  params.delete('agenda');
  const query = params.toString();
  history.replaceState({}, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
}

document.addEventListener('click', event => {
  if (event.target.closest('[data-close-dialog]')) { document.querySelector('#itemDialog').close(); return; }
  if (event.target.closest('[data-close-question]')) { document.querySelector('#questionDialog').close(); return; }
  const view = event.target.closest('[data-view]');
  if (view) { navigate(view.dataset.view); return; }
  if (event.target.closest('[data-open-add]')) { openAdd(); return; }
  if (event.target.closest('[data-add-trip-folder]')) { openTripFolderForm(); return; }
  const addTripSection = event.target.closest('[data-add-trip-section]');
  if (addTripSection) { openTripSectionForm(addTripSection.dataset.addTripSection); return; }
  const addToTripSection = event.target.closest('[data-add-to-trip-section]');
  if (addToTripSection) {
    const section = tripSectionById(addToTripSection.dataset.addToTripSection);
    if (section) openAdd(section.tripFolderId, section.id);
    return;
  }
  const addToTrip = event.target.closest('[data-add-to-trip]');
  if (addToTrip) { openAdd(addToTrip.dataset.addToTrip); return; }
  const answer = event.target.closest('[data-answer-person]');
  if (answer) { openQuestion(answer.dataset.answerPerson); return; }
  const removeCalendarButton = event.target.closest('[data-remove-calendar]');
  if (removeCalendarButton) { openRemoveCalendar(removeCalendarButton.dataset.removeCalendar); return; }
  const restoreCalendarButton = event.target.closest('[data-restore-calendar]');
  if (restoreCalendarButton) {
    if (restoreCalendar(restoreCalendarButton.dataset.restoreCalendar)) {
      save(); render(); toast('Agenda hersteld; nieuwe imports zijn weer toegestaan');
    }
    return;
  }
  const deleteTripFolderButton = event.target.closest('[data-delete-trip-folder]');
  if (deleteTripFolderButton) {
    const folderId = deleteTripFolderButton.dataset.deleteTripFolder;
    const folder = data.tripFolders.find(item => item.id === folderId);
    if (!folder) return;
    const childCount = data.trips.filter(item => item.tripFolderId === folderId).length;
    const warning = childCount ? `Ook de ${childCount} onderdelen in deze map worden verwijderd.` : 'Deze map is leeg.';
    if (!confirm(`Reismap “${folder.name}” verwijderen?\n\n${warning}`)) return;
    data.tripFolders = data.tripFolders.filter(item => item.id !== folderId);
    data.tripSections = data.tripSections.filter(item => item.tripFolderId !== folderId);
    data.trips = data.trips.filter(item => item.tripFolderId !== folderId);
    save(); render(); toast('Reismap verwijderd'); return;
  }
  const deleteTripSectionButton = event.target.closest('[data-delete-trip-section]');
  if (deleteTripSectionButton) {
    const sectionId = deleteTripSectionButton.dataset.deleteTripSection;
    const section = tripSectionById(sectionId);
    if (!section) return;
    const childCount = data.trips.filter(item => item.tripSectionId === sectionId).length;
    const warning = childCount ? `Ook de ${childCount} onderdelen in deze map worden verwijderd.` : 'Deze map is leeg.';
    if (!confirm(`Map “${section.name}” verwijderen?\n\n${warning}`)) return;
    data.tripSections = data.tripSections.filter(item => item.id !== sectionId);
    data.trips = data.trips.filter(item => item.tripSectionId !== sectionId);
    save(); render(); toast('Map verwijderd'); return;
  }
  const deleteButton = event.target.closest('[data-delete]');
  if (deleteButton) {
    const [type, itemId] = deleteButton.dataset.delete.split(':');
    data[type] = data[type].filter(item => item.id !== itemId);
    save(); render(); return;
  }
  const toggle = event.target.closest('[data-toggle]');
  if (toggle) {
    const [type, itemId] = toggle.dataset.toggle.split(':');
    const item = data[type].find(candidate => candidate.id === itemId);
    if (item) item.done = !item.done;
    save(); render(); return;
  }
  const choreDate = event.target.closest('[data-chore-date]');
  if (choreDate) {
    const [choreId, date] = choreDate.dataset.choreDate.split(':');
    toggleChoreOccurrence(choreId, date); return;
  }
  const stock = event.target.closest('[data-stock]');
  if (stock) {
    const [itemId, amount] = stock.dataset.stock.split(':');
    const item = data.stock.find(candidate => candidate.id === itemId);
    if (item) item.amount = Math.max(0, Number(item.amount) + Number(amount));
    save(); render(); return;
  }
  const week = event.target.closest('[data-week]');
  if (week) {
    const [type, direction] = week.dataset.week.split(':');
    const nextStart = direction === '0' ? startOfWeek(todayISO()) : addDays(type === 'agenda' ? agendaWeekStart : householdWeekStart, Number(direction) * 7);
    if (type === 'agenda') agendaWeekStart = nextStart; else householdWeekStart = nextStart;
    render(); return;
  }
  const calendarToggle = event.target.closest('[data-calendar-toggle]');
  if (calendarToggle) {
    const calendar = calendarById(calendarToggle.dataset.calendarToggle);
    calendar.visible = calendar.visible === false;
    save(); render(); return;
  }
  if (event.target.closest('[data-random]')) {
    if (!data.ideas.length) return;
    const item = data.ideas[Math.floor(Math.random() * data.ideas.length)];
    document.querySelector('#choice').textContent = `${item.icon || '♡'} ${item.title}`;
    return;
  }
  if (event.target.closest('[data-import-groceries]')) { importGroceries(document.querySelector('#groceryImportText').value); return; }
  if (event.target.closest('[data-import-osta]')) { importOsta(document.querySelector('#ostaImportText').value); return; }
  if (event.target.closest('[data-import-calendar]')) { importCalendar(document.querySelector('#calendarImportText').value); return; }
  if (event.target.closest('[data-import-travel-text]')) {
    importTravelPlan(document.querySelector('#travelImportText').value, document.querySelector('#travelImportFolder').value);
    return;
  }
  const picker = event.target.closest('[data-pick-file]');
  if (picker) { document.querySelector(`#${picker.dataset.pickFile}`).click(); return; }
  if (event.target.closest('[data-sync-now]')) { syncNow({ manual: true }); return; }
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'backup') exportBackup();
  if (action === 'restore') document.querySelector('#restoreInput').click();
});

document.addEventListener('change', event => {
  if (event.target.id === 'f-repeat' || event.target.id === 'f-due') toggleSecondWeekdayField();
  if (event.target.id === 'f-tripFolderId') refreshTripSectionSelect(event.target.value);
  const calendarPerson = event.target.closest('[data-calendar-person]');
  if (calendarPerson) {
    if (setCalendarPerson(calendarPerson.dataset.calendarPerson, calendarPerson.value)) {
      save(); render(); toast('Persoon voor deze agenda bewaard');
    } else {
      calendarPerson.value = calendarById(calendarPerson.dataset.calendarPerson).person || '';
    }
    return;
  }
  const calendarVisible = event.target.closest('[data-calendar-visible]');
  if (calendarVisible) {
    calendarById(calendarVisible.dataset.calendarVisible).visible = calendarVisible.checked;
    save(); updateSyncBadge(); return;
  }
  const calendarColor = event.target.closest('[data-calendar-color]');
  if (calendarColor) {
    calendarById(calendarColor.dataset.calendarColor).color = calendarColor.value;
    save(); return;
  }
});

document.addEventListener('submit', event => {
  if (event.target.id === 'syncForm') { handleSyncForm(event); return; }
  if (event.target.id === 'calendarForm') {
    event.preventDefault();
    const fields = new FormData(event.target);
    const name = fields.get('name')?.trim();
    if (!name) return;
    const calendar = ensureCalendar(name);
    if (!calendar) { toast('Deze agenda is uitgesloten. Kies hieronder Herstellen.'); return; }
    const person = validCalendarPerson(fields.get('person'));
    if (person) setCalendarPerson(calendar.id, person);
    save(); render(); toast('Agenda bewaard'); return;
  }
});

document.querySelector('#addBtn').addEventListener('click', openAdd);
document.querySelector('#laptopSaveBtn').addEventListener('click', exportBackup);
document.querySelector('#itemForm').addEventListener('submit', handleSubmit);
document.querySelector('#questionForm').addEventListener('submit', handleQuestionSubmit);
document.querySelector('#restoreInput').addEventListener('change', event => event.target.files[0] && importBackup(event.target.files[0]));
document.querySelector('#groceryImportFile').addEventListener('change', event => event.target.files[0] && readImportFile(event.target.files[0], 'groceries'));
document.querySelector('#ostaImportFile').addEventListener('change', event => event.target.files[0] && readImportFile(event.target.files[0], 'osta'));
document.querySelector('#calendarImportFile').addEventListener('change', event => event.target.files[0] && readImportFile(event.target.files[0], 'calendar'));
document.querySelector('#travelImportFile').addEventListener('change', event => {
  if (event.target.files[0]) readTravelImportFile(event.target.files[0]);
  event.target.value = '';
});
document.querySelector('#eyebrow').textContent = new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
window.addEventListener('online', () => { updateSyncBadge(); syncNow(); });
window.addEventListener('offline', () => updateSyncBadge());

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
setupNav();
render();
handleInitialAgendaImport();
setTimeout(captureBrainyQuote, 600);
refreshBrainyQuoteRSS();
if (syncConfigured()) syncNow();

/* ================================================================ */

/* Samen Thuis v17 — reisbeheer, prioriteiten en automatische synchronisatie */
(() => {
  if (window.__SAMEN_THUIS_V17_TRAVEL_SYNC__) return;
  window.__SAMEN_THUIS_V17_TRAVEL_SYNC__ = true;

  const AUTO_SYNC_INTERVAL_MS = 30000;
  const PRIORITIES = ['low', 'medium', 'high'];
  const PRIORITY_LABELS = { low: 'Laag', medium: 'Gemiddeld', high: 'Hoog' };
  const PRIORITY_RANK = { high: 0, medium: 1, low: 2, '': 3 };
  const TRAVEL_TYPES = ['Voorbereiding', 'Reservering', 'Vervoer', 'Verblijf', 'Activiteit', 'Eten', 'Budget', 'Documenten', 'Paklijst', 'Notitie'];

  let autoSyncInterval = null;
  let travelDraft = [];
  let travelDraftFolderId = '';

  const baseFormConfig = formConfig;
  const baseOpenAdd = openAdd;
  const baseRenderTrips = renderTrips;
  const baseRenderSettings = renderSettings;
  const baseUpdateSyncBadge = updateSyncBadge;

  const nowIso = () => new Date().toISOString();

  function isImportant(value) {
    return value === true || value === 'true' || value === 'on' || value === 1;
  }

  function normalisePriority(item) {
    item.important = isImportant(item.important);
    item.priority = item.important && PRIORITIES.includes(item.priority) ? item.priority : (item.important ? 'medium' : '');
    if (!item.updatedAt) item.updatedAt = data.meta?.updatedAt || nowIso();
    return item;
  }

  function normaliseTravelData({ persist = false } = {}) {
    (data.tripFolders || []).forEach(folder => {
      folder.createdAt ||= data.meta?.updatedAt || nowIso();
      folder.updatedAt ||= folder.createdAt;
    });
    (data.tripSections || []).forEach(section => {
      section.createdAt ||= data.meta?.updatedAt || nowIso();
      section.updatedAt ||= section.createdAt;
    });
    (data.trips || []).forEach(normalisePriority);
    if (persist) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function syncTimeLabel(value) {
    if (!value) return 'Nog niet gesynchroniseerd';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Nog niet gesynchroniseerd';
    const today = new Date();
    const sameDay = date.toDateString() === today.toDateString();
    return `${sameDay ? 'Vandaag' : date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })} om ${date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`;
  }

  function priorityBadge(item) {
    if (!item.important) return '';
    const priority = PRIORITIES.includes(item.priority) ? item.priority : 'medium';
    return `<span class="priority-badge ${priority}">${PRIORITY_LABELS[priority]}</span>`;
  }

  function markUpdated(item) {
    item.updatedAt = nowIso();
  }

  formConfig = function formConfigV11(view) {
    const config = baseFormConfig(view);
    if (view !== 'trips' || !config) return config;
    config.fields = config.fields.map(field => [...field]);
    if (!config.fields.some(([name]) => name === 'important')) {
      config.fields.push(['important', 'Belangrijk / prioriteit', 'checkbox']);
      config.fields.push(['priority', 'Prioriteit', 'select', [['low', 'Laag'], ['medium', 'Gemiddeld'], ['high', 'Hoog']], 'trip-priority-field']);
    }
    return config;
  };

  function updateAddPriorityVisibility() {
    const important = document.querySelector('#f-important');
    const priority = document.querySelector('#f-priority');
    const field = priority?.closest('.trip-priority-field');
    if (!important || !priority || !field) return;
    if (!priority.dataset.initialised) {
      priority.value = 'medium';
      priority.dataset.initialised = '1';
    }
    field.hidden = !important.checked;
    priority.disabled = !important.checked;
  }

  openAdd = function openAddV11(...args) {
    baseOpenAdd(...args);
    if (current === 'trips') setTimeout(updateAddPriorityVisibility, 0);
  };

  openTravelActions = function openTravelActionsV11() {
    normaliseTravelData();
    return data.trips.filter(item => item.checkable && !item.done).sort((a, b) => {
      const importantOrder = Number(Boolean(b.important)) - Number(Boolean(a.important));
      if (importantOrder) return importantOrder;
      const priorityOrder = PRIORITY_RANK[a.priority || ''] - PRIORITY_RANK[b.priority || ''];
      if (priorityOrder) return priorityOrder;
      const dateOrder = (a.date || '9999-12-31').localeCompare(b.date || '9999-12-31');
      return dateOrder || a.title.localeCompare(b.title, 'nl');
    });
  };

  renderTravelActions = function renderTravelActionsV11() {
    const actions = openTravelActions().slice(0, 10);
    return `<section class="card travel-actions"><div class="card-head"><div><p class="eyebrow">Belangrijkste reisacties</p><h2>Prioriteiten & deadlines</h2></div><button class="text-btn" data-view="trips">Alle reizen</button></div><div class="list">${actions.length ? actions.map(item => {
      const folder = tripFolderById(item.tripFolderId);
      const section = tripSectionById(item.tripSectionId);
      const overdue = item.date && item.date < todayISO();
      const timing = item.date ? `${overdue ? 'Te laat · ' : ''}${fmtDate(item.date)}` : 'Geen deadline';
      return `<div class="list-item travel-action ${overdue ? 'overdue' : ''}"><button class="check" data-toggle="trips:${item.id}" aria-label="${esc(item.title)} afronden"></button><div class="item-main"><div class="travel-title-row"><strong>${esc(item.title)}</strong>${priorityBadge(item)}</div><small>${esc(folder?.name || 'Reis')}${section ? ` · ${esc(section.name)}` : ''} · ${esc(timing)}</small></div></div>`;
    }).join('') : '<p class="muted">Geen open reisacties.</p>'}</div>${openTravelActions().length > 10 ? `<p class="muted travel-more">Nog ${openTravelActions().length - 10} acties staan bij Reizen.</p>` : ''}</section>`;
  };

  tripItemRow = function tripItemRowV11(item) {
    normalisePriority(item);
    const hasDate = Boolean(item.date);
    return `<div class="list-item ${item.done ? 'is-done' : ''}">${item.checkable ? `<button class="check ${item.done ? 'done' : ''}" data-toggle="trips:${item.id}" aria-label="${item.done ? 'Opnieuw openen' : 'Afronden'}">${item.done ? '✓' : ''}</button>` : ''}<div class="trip-date">${hasDate ? `<strong>${parseDate(item.date).getDate()}</strong><small>${fmtDate(item.date, { month: 'short' })}</small>` : '<strong>–</strong><small>datum</small>'}</div><div class="item-main"><div class="travel-title-row"><strong class="${item.done ? 'done-text' : ''}">${esc(item.title)}</strong>${priorityBadge(item)}</div><small>${esc(item.type)}${item.checkable ? ' · Afvinken' : ''}${item.note ? ` · ${esc(item.note)}` : ''}</small></div><div class="travel-row-actions"><button class="text-btn" data-edit-trip-item="${item.id}" aria-label="${esc(item.title)} bewerken">✎</button><button class="delete" data-delete="trips:${item.id}" aria-label="${esc(item.title)} verwijderen">×</button></div></div>`;
  };

  renderTrips = function renderTripsV11() {
    let html = baseRenderTrips();
    html = html.replace(/(<button class="delete" data-delete-trip-folder="([^"]+)"[^>]*>×<\/button>)/g, '<div class="travel-edit-actions"><button class="text-btn" data-edit-trip-folder="$2" aria-label="Reismap bewerken">✎</button>$1</div>');
    html = html.replace(/(<button class="delete" data-delete-trip-section="([^"]+)"[^>]*>×<\/button>)/g, '<div class="travel-edit-actions"><button class="text-btn" data-edit-trip-section="$2" aria-label="Map bewerken">✎</button>$1</div>');
    return html;
  };

  renderSettings = function renderSettingsV11() {
    let html = baseRenderSettings();
    const detail = `<div class="sync-detail"><strong>Automatische synchronisatie</strong><p>Wijzigingen worden na ongeveer 1,2 seconde verzonden. Als de app open is, controleert hij daarnaast elke 30 seconden op nieuwere gegevens van je andere apparaten.</p><p><strong>Laatst gesynchroniseerd:</strong> ${esc(syncTimeLabel(syncConfig.lastSyncedAt))}</p><p class="muted small">De knop “Nu synchroniseren” blijft alleen als noodknop; normaal hoef je die niet te gebruiken.</p></div>`;
    html = html.replace('</form>\n    </section>', `</form>${detail}\n    </section>`);
    return html;
  };

  updateSyncBadge = function updateSyncBadgeV11(message) {
    baseUpdateSyncBadge(message);
    const badge = document.querySelector('#syncState');
    if (!badge || message) return;
    if (syncConfigured() && navigator.onLine && !syncing && !syncError && syncConfig.lastSyncedAt) {
      const date = new Date(syncConfig.lastSyncedAt);
      badge.textContent = `✓ ${date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`;
      badge.title = `Laatst gesynchroniseerd: ${syncTimeLabel(syncConfig.lastSyncedAt)}`;
    }
  };

  function ensureTravelEditDialog() {
    if (document.querySelector('#travelEditDialog')) return;
    const dialog = document.createElement('dialog');
    dialog.id = 'travelEditDialog';
    dialog.innerHTML = `<form id="travelEditForm" method="dialog"><div class="dialog-head"><div><p class="eyebrow">Reizen</p><h2 id="travelEditTitle">Bewerken</h2></div><button type="button" class="icon-btn" data-close-travel-edit aria-label="Sluiten">×</button></div><div id="travelEditFields" class="form-grid"></div><div class="dialog-actions"><button type="button" class="secondary" data-close-travel-edit>Annuleren</button><button type="submit" class="primary">Wijzigingen opslaan</button></div></form>`;
    document.body.appendChild(dialog);
  }

  function folderOptions(selected) {
    return data.tripFolders.map(folder => `<option value="${esc(folder.id)}" ${folder.id === selected ? 'selected' : ''}>${esc(folder.name)}</option>`).join('');
  }

  function sectionOptions(folderId, selected) {
    return data.tripSections.filter(section => section.tripFolderId === folderId).map(section => `<option value="${esc(section.id)}" ${section.id === selected ? 'selected' : ''}>${esc(section.name)}</option>`).join('');
  }

  function typeOptions(selected) {
    return TRAVEL_TYPES.map(type => `<option ${type === selected ? 'selected' : ''}>${esc(type)}</option>`).join('');
  }

  function priorityOptions(selected = 'medium') {
    return PRIORITIES.map(value => `<option value="${value}" ${value === selected ? 'selected' : ''}>${PRIORITY_LABELS[value]}</option>`).join('');
  }

  function openTravelItemEdit(itemId) {
    ensureTravelEditDialog();
    const item = data.trips.find(candidate => candidate.id === itemId);
    if (!item) return;
    normalisePriority(item);
    const dialog = document.querySelector('#travelEditDialog');
    dialog.dataset.mode = 'item';
    dialog.dataset.id = item.id;
    document.querySelector('#travelEditTitle').textContent = 'Reisonderdeel bewerken';
    document.querySelector('#travelEditFields').innerHTML = `
      <div class="field"><label>Titel</label><input name="title" required value="${esc(item.title)}"></div>
      <div class="field"><label>Reis</label><select name="tripFolderId" id="editTripFolder">${folderOptions(item.tripFolderId)}</select></div>
      <div class="field"><label>Map binnen de reis</label><select name="tripSectionId" id="editTripSection">${sectionOptions(item.tripFolderId, item.tripSectionId)}</select></div>
      <div class="field"><label>Deadline / datum</label><input name="date" type="date" value="${esc(item.date || '')}"></div>
      <div class="field"><label>Soort</label><select name="type">${typeOptions(item.type)}</select></div>
      <div class="field"><label>Notitie</label><textarea name="note">${esc(item.note || '')}</textarea></div>
      <label class="checkbox-field"><input name="checkable" type="checkbox" ${item.checkable ? 'checked' : ''}><span>Dit moet afgevinkt worden</span></label>
      <label class="checkbox-field"><input name="important" id="editTripImportant" type="checkbox" ${item.important ? 'checked' : ''}><span>Belangrijk / prioriteit</span></label>
      <div class="field trip-priority-field" id="editTripPriorityField" ${item.important ? '' : 'hidden'}><label>Prioriteit</label><select name="priority" id="editTripPriority" ${item.important ? '' : 'disabled'}>${priorityOptions(item.priority || 'medium')}</select></div>`;
    dialog.showModal();
  }

  function openTravelFolderEdit(folderId) {
    ensureTravelEditDialog();
    const folder = tripFolderById(folderId);
    if (!folder) return;
    const dialog = document.querySelector('#travelEditDialog');
    dialog.dataset.mode = 'folder';
    dialog.dataset.id = folder.id;
    document.querySelector('#travelEditTitle').textContent = 'Reismap bewerken';
    document.querySelector('#travelEditFields').innerHTML = `
      <div class="field"><label>Naam van de reis</label><input name="name" required value="${esc(folder.name)}"></div>
      <div class="field"><label>Vertrekdatum</label><input name="startDate" type="date" value="${esc(folder.startDate || '')}"></div>
      <div class="field"><label>Terugkomstdatum</label><input name="endDate" type="date" value="${esc(folder.endDate || '')}"></div>
      <div class="field"><label>Notitie</label><textarea name="note">${esc(folder.note || '')}</textarea></div>`;
    dialog.showModal();
  }

  function openTravelSectionEdit(sectionId) {
    ensureTravelEditDialog();
    const section = tripSectionById(sectionId);
    if (!section) return;
    const dialog = document.querySelector('#travelEditDialog');
    dialog.dataset.mode = 'section';
    dialog.dataset.id = section.id;
    document.querySelector('#travelEditTitle').textContent = 'Map bewerken';
    document.querySelector('#travelEditFields').innerHTML = `<div class="field"><label>Naam van de map</label><input name="name" required value="${esc(section.name)}"></div>`;
    dialog.showModal();
  }

  function updateEditPriorityVisibility() {
    const important = document.querySelector('#editTripImportant');
    const priority = document.querySelector('#editTripPriority');
    const field = document.querySelector('#editTripPriorityField');
    if (!important || !priority || !field) return;
    field.hidden = !important.checked;
    priority.disabled = !important.checked;
  }

  function updateEditSectionOptions() {
    const folder = document.querySelector('#editTripFolder');
    const section = document.querySelector('#editTripSection');
    if (!folder || !section) return;
    section.innerHTML = sectionOptions(folder.value, '');
  }

  function handleTravelEditSubmit(event) {
    event.preventDefault();
    const dialog = document.querySelector('#travelEditDialog');
    const values = Object.fromEntries(new FormData(event.target));
    const mode = dialog.dataset.mode;
    const targetId = dialog.dataset.id;

    if (mode === 'item') {
      const item = data.trips.find(candidate => candidate.id === targetId);
      if (!item) return;
      const targetSection = tripSectionById(values.tripSectionId);
      if (!targetSection || targetSection.tripFolderId !== values.tripFolderId) return toast('Kies een geldige map binnen de reis');
      const checkable = values.checkable === 'on';
      if (checkable && !values.date) return toast('Kies een deadline voor een onderdeel dat afgevinkt moet worden');
      const important = values.important === 'on';
      Object.assign(item, {
        title: String(values.title || '').trim(),
        tripFolderId: values.tripFolderId,
        tripSectionId: values.tripSectionId,
        date: values.date || '',
        type: values.type || 'Notitie',
        note: String(values.note || '').trim(),
        checkable,
        done: checkable ? Boolean(item.done) : false,
        important,
        priority: important && PRIORITIES.includes(values.priority) ? values.priority : (important ? 'medium' : '')
      });
      markUpdated(item);
    } else if (mode === 'folder') {
      const folder = tripFolderById(targetId);
      if (!folder) return;
      Object.assign(folder, { name: String(values.name || '').trim(), startDate: values.startDate || '', endDate: values.endDate || '', note: String(values.note || '').trim() });
      markUpdated(folder);
    } else if (mode === 'section') {
      const section = tripSectionById(targetId);
      if (!section) return;
      section.name = String(values.name || '').trim();
      markUpdated(section);
    }

    save();
    dialog.close();
    render();
    toast('Wijzigingen opgeslagen');
  }

  function hasDateLead(line) {
    return /^(?:dag\s+\d+\b|\d{1,2}\s+(?:januari|jan|februari|feb|maart|mrt|april|apr|mei|juni|jun|juli|jul|augustus|aug|september|sep|oktober|okt|november|nov|december|dec)\b|20\d{2}-\d{1,2}-\d{1,2}\b|\d{1,2}[-/.]\d{1,2}(?:[-/.]20\d{2})?\b)/i.test(line);
  }

  function candidateTitleAndNote(text) {
    const clean = text.trim();
    if (clean.length <= 170) return { title: clean, note: '' };
    const boundary = clean.slice(70, 175).search(/[.!?;](?:\s|$)/);
    const cut = boundary >= 0 ? 70 + boundary + 1 : 167;
    return { title: `${clean.slice(0, cut).trim()}${cut < clean.length ? '…' : ''}`, note: clean.slice(cut).trim() };
  }

  function parseTravelCandidates(text, folderId) {
    const folder = tripFolderById(folderId);
    if (!folder) return [];
    const blocks = [];
    let sectionName = 'Algemeen';
    let currentBlock = null;

    const pushBlock = () => {
      if (currentBlock?.text?.trim()) blocks.push(currentBlock);
      currentBlock = null;
    };

    String(text || '').replace(/\u00ad/g, '').split(/\r?\n/).forEach(rawLine => {
      const source = rawLine.replace(/\s+/g, ' ').trim();
      if (!source || /^pagina\s+\d+(?:\s+van\s+\d+)?$/i.test(source) || /^\d+$/.test(source)) return;
      const heading = travelImportHeading(source);
      if (heading) {
        pushBlock();
        sectionName = heading;
        return;
      }
      const bullet = /^(?:[-•▪◦‣–—]|✓|✔|☑|☐|□|\[x\]|\[\s?\])\s*/i.test(source);
      const startsNew = bullet || hasDateLead(source) || !currentBlock;
      if (startsNew) {
        pushBlock();
        currentBlock = { sectionName, text: source };
      } else if ((currentBlock.text.length + source.length) < 900) {
        currentBlock.text += ` ${source}`;
      } else {
        pushBlock();
        currentBlock = { sectionName, text: source };
      }
    });
    pushBlock();

    const seen = new Set();
    return blocks.slice(0, 180).map(block => {
      const source = block.text;
      const done = /^(?:✓|✔|☑|\[x\])\s*/i.test(source);
      const explicitAction = /^(?:☐|□|\[\s?\]|todo:|to-do:|actie:)/i.test(source);
      const clean = source.replace(/^(?:[-•▪◦‣–—]|✓|✔|☑|☐|□|\[x\]|\[\s?\])\s*/i, '').trim();
      if (clean.length < 3) return null;
      const key = clean.toLowerCase().replace(/[^a-z0-9à-ÿ]+/g, ' ').trim();
      if (!key || seen.has(key)) return null;
      seen.add(key);
      const detected = travelImportCategory(clean);
      const section = detected?.name || block.sectionName || 'Algemeen';
      const type = detected?.type || travelImportCategory(section)?.type || 'Notitie';
      const checkable = done || explicitAction || /\b(boeken|reserveren|regelen|controleren|aanvragen|bevestigen|betalen|kopen|bestellen|inpakken|meenemen|afspreken|downloaden|printen)\b/i.test(clean);
      const split = candidateTitleAndNote(clean);
      return {
        selected: true,
        title: split.title,
        note: split.note,
        section,
        type,
        date: travelDateFromLine(clean, folder),
        checkable,
        done: checkable ? done : false,
        important: false,
        priority: ''
      };
    }).filter(Boolean).filter(candidate => !data.trips.some(item => item.tripFolderId === folderId && item.title.toLowerCase() === candidate.title.toLowerCase()));
  }

  function renderTravelDraft() {
    document.querySelector('#travelImportPreview')?.remove();
    const importCard = document.querySelector('.travel-import');
    if (!importCard || !travelDraft.length) return;
    const section = document.createElement('section');
    section.id = 'travelImportPreview';
    section.className = 'card travel-import-preview';
    section.innerHTML = `<div class="card-head"><div><p class="eyebrow">Controle vóór import</p><h2>${travelDraft.length} mogelijke onderdelen gevonden</h2><p class="muted small">Pas tekst, map, type, datum, afvinken en prioriteit eerst aan. Pas na “Geselecteerde importeren” worden ze opgeslagen.</p></div><div class="button-row"><button class="secondary" data-preview-select-all>Alles selecteren</button><button class="secondary" data-preview-select-none>Niets selecteren</button></div></div><div class="travel-preview-list">${travelDraft.map((candidate, index) => `<article class="travel-preview-card" data-preview-index="${index}"><label class="preview-select"><input type="checkbox" data-preview-selected ${candidate.selected ? 'checked' : ''}> Importeren</label><div class="preview-grid"><div class="field preview-title"><label>Titel</label><input data-preview-title value="${esc(candidate.title)}"></div><div class="field"><label>Map</label><input data-preview-section value="${esc(candidate.section)}"></div><div class="field"><label>Soort</label><select data-preview-type>${typeOptions(candidate.type)}</select></div><div class="field"><label>Datum / deadline</label><input type="date" data-preview-date value="${esc(candidate.date || '')}"></div><label class="checkbox-field compact"><input type="checkbox" data-preview-checkable ${candidate.checkable ? 'checked' : ''}><span>Afvinken</span></label><label class="checkbox-field compact"><input type="checkbox" data-preview-important><span>Belangrijk</span></label><div class="field preview-priority" hidden><label>Prioriteit</label><select data-preview-priority disabled>${priorityOptions('medium')}</select></div><div class="field preview-note"><label>Notitie</label><textarea data-preview-note>${esc(candidate.note || '')}</textarea></div></div></article>`).join('')}</div><div class="button-row preview-actions"><button class="secondary" data-preview-cancel>Annuleren</button><button class="primary" data-preview-import>Geselecteerde importeren</button></div>`;
    importCard.insertAdjacentElement('afterend', section);
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function beginTravelPreview(text, folderId) {
    const candidates = parseTravelCandidates(text, folderId);
    if (!candidates.length) return toast('Geen nieuwe reisonderdelen gevonden');
    travelDraft = candidates;
    travelDraftFolderId = folderId;
    renderTravelDraft();
    toast(`${candidates.length} onderdelen gevonden · controleer ze eerst`);
  }

  async function readTravelFileToPreview(file) {
    const folderId = document.querySelector('#travelImportFolder')?.value;
    if (!folderId) return toast('Kies eerst een reismap');
    try {
      toast(file.type === 'application/pdf' || /\.pdf$/i.test(file.name) ? 'PDF wordt gelezen…' : 'Bestand wordt gelezen…');
      const text = file.type === 'application/pdf' || /\.pdf$/i.test(file.name) ? await extractPdfText(file) : await file.text();
      if (!text.trim()) return toast('In dit bestand is geen leesbare tekst gevonden');
      const textarea = document.querySelector('#travelImportText');
      if (textarea) textarea.value = text;
      beginTravelPreview(text, folderId);
    } catch (error) {
      console.error('Reisbestand lezen mislukt', error);
      toast('PDF lezen lukte niet. Kopieer de tekst en plak die hier.');
    }
  }

  function importPreviewCandidates() {
    const cards = [...document.querySelectorAll('.travel-preview-card')];
    let added = 0;
    let skipped = 0;
    cards.forEach(card => {
      if (!card.querySelector('[data-preview-selected]')?.checked) return;
      const title = card.querySelector('[data-preview-title]')?.value.trim();
      if (!title) { skipped += 1; return; }
      const sectionName = card.querySelector('[data-preview-section]')?.value.trim() || 'Algemeen';
      const duplicate = data.trips.some(item => item.tripFolderId === travelDraftFolderId && item.title.toLowerCase() === title.toLowerCase());
      if (duplicate) { skipped += 1; return; }
      const targetSection = ensureTripSection(travelDraftFolderId, sectionName);
      const important = Boolean(card.querySelector('[data-preview-important]')?.checked);
      const priority = important ? (card.querySelector('[data-preview-priority]')?.value || 'medium') : '';
      const checkable = Boolean(card.querySelector('[data-preview-checkable]')?.checked);
      data.trips.push({
        id: id(),
        tripFolderId: travelDraftFolderId,
        tripSectionId: targetSection.id,
        title,
        date: card.querySelector('[data-preview-date]')?.value || '',
        type: card.querySelector('[data-preview-type]')?.value || 'Notitie',
        note: card.querySelector('[data-preview-note]')?.value.trim() || '',
        checkable,
        done: false,
        important,
        priority,
        createdAt: nowIso(),
        updatedAt: nowIso()
      });
      added += 1;
    });
    if (!added) return toast('Selecteer minimaal één geldig onderdeel');
    save();
    travelDraft = [];
    travelDraftFolderId = '';
    render();
    toast(`${added} onderdelen geïmporteerd${skipped ? ` · ${skipped} overgeslagen` : ''}`);
  }

  function replaceTravelFileInput() {
    const oldInput = document.querySelector('#travelImportFile');
    if (!oldInput || oldInput.dataset.v11 === '1') return;
    const fresh = oldInput.cloneNode(true);
    fresh.dataset.v11 = '1';
    oldInput.replaceWith(fresh);
    fresh.addEventListener('change', event => {
      if (event.target.files[0]) readTravelFileToPreview(event.target.files[0]);
      event.target.value = '';
    });
  }

  syncNow = async function syncNowV11({ manual = false } = {}) {
    if (!syncConfigured() || syncing || !navigator.onLine) {
      if (manual && !navigator.onLine) toast('Geen internetverbinding');
      return;
    }
    syncing = true;
    syncError = '';
    updateSyncBadge();
    try {
      if (!window.crypto?.subtle) throw new Error('Versleuteling vereist HTTPS');
      const householdId = await sha256(syncConfig.householdCode.trim());
      const baseUrl = syncConfig.projectUrl.replace(/\/+$/, '');
      const response = await fetch(`${baseUrl}/rest/v1/household_data?id=eq.${householdId}&select=payload,updated_at`, { headers: supabaseHeaders() });
      if (!response.ok) throw new Error(`Supabase gaf ${response.status}`);
      const rows = await response.json();
      let remoteData = null;
      if (rows[0]?.payload) remoteData = migrateData(await decryptData(rows[0].payload, syncConfig.householdCode));

      const localTime = new Date(data.meta?.updatedAt || 0).getTime();
      const remoteTime = new Date(remoteData?.meta?.updatedAt || 0).getTime();
      let remoteLoaded = false;

      if (!remoteData) {
        const payload = await encryptData(data, syncConfig.householdCode);
        const upload = await fetch(`${baseUrl}/rest/v1/household_data?on_conflict=id`, {
          method: 'POST', headers: { ...supabaseHeaders(), Prefer: 'resolution=merge-duplicates,return=minimal' },
          body: JSON.stringify({ id: householdId, payload, updated_at: data.meta.updatedAt })
        });
        if (!upload.ok) throw new Error(`Opslaan gaf ${upload.status}`);
      } else if (remoteTime > localTime) {
        data = remoteData;
        normaliseTravelData();
        save({ touch: false, sync: false });
        remoteLoaded = true;
      } else if (localTime > remoteTime) {
        const payload = await encryptData(data, syncConfig.householdCode);
        const upload = await fetch(`${baseUrl}/rest/v1/household_data?on_conflict=id`, {
          method: 'POST', headers: { ...supabaseHeaders(), Prefer: 'resolution=merge-duplicates,return=minimal' },
          body: JSON.stringify({ id: householdId, payload, updated_at: data.meta.updatedAt })
        });
        if (!upload.ok) throw new Error(`Opslaan gaf ${upload.status}`);
      }

      syncConfig.lastSyncedAt = nowIso();
      localStorage.setItem(SYNC_KEY, JSON.stringify(syncConfig));
      syncError = '';
      if (current === 'settings' || remoteLoaded) render();
      if (manual) toast('Apparaten zijn bijgewerkt');
    } catch (error) {
      console.error('Synchronisatie mislukt', error);
      syncError = error.message || 'Synchronisatie mislukt';
      if (manual) toast('Synchronisatie lukt nog niet. Controleer de instellingen.');
    } finally {
      syncing = false;
      updateSyncBadge();
    }
  };

  function startAutomaticSync() {
    if (autoSyncInterval) clearInterval(autoSyncInterval);
    autoSyncInterval = setInterval(() => {
      if (document.visibilityState === 'visible') syncNow();
    }, AUTO_SYNC_INTERVAL_MS);
  }

  document.addEventListener('click', event => {
    const importText = event.target.closest('[data-import-travel-text]');
    if (importText) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const folderId = document.querySelector('#travelImportFolder')?.value;
      const text = document.querySelector('#travelImportText')?.value || '';
      if (!folderId) return toast('Kies eerst een reismap');
      if (!text.trim()) return toast('Plak eerst de tekst uit het reisplan');
      beginTravelPreview(text, folderId);
      return;
    }

    const editItem = event.target.closest('[data-edit-trip-item]');
    if (editItem) { event.preventDefault(); openTravelItemEdit(editItem.dataset.editTripItem); return; }
    const editFolder = event.target.closest('[data-edit-trip-folder]');
    if (editFolder) { event.preventDefault(); openTravelFolderEdit(editFolder.dataset.editTripFolder); return; }
    const editSection = event.target.closest('[data-edit-trip-section]');
    if (editSection) { event.preventDefault(); openTravelSectionEdit(editSection.dataset.editTripSection); return; }
    if (event.target.closest('[data-close-travel-edit]')) { document.querySelector('#travelEditDialog')?.close(); return; }
    if (event.target.closest('[data-preview-select-all]')) { document.querySelectorAll('[data-preview-selected]').forEach(input => { input.checked = true; }); return; }
    if (event.target.closest('[data-preview-select-none]')) { document.querySelectorAll('[data-preview-selected]').forEach(input => { input.checked = false; }); return; }
    if (event.target.closest('[data-preview-cancel]')) { travelDraft = []; travelDraftFolderId = ''; document.querySelector('#travelImportPreview')?.remove(); return; }
    if (event.target.closest('[data-preview-import]')) { importPreviewCandidates(); return; }
  }, true);

  document.addEventListener('change', event => {
    if (event.target.matches('#f-important')) updateAddPriorityVisibility();
    if (event.target.matches('#editTripImportant')) updateEditPriorityVisibility();
    if (event.target.matches('#editTripFolder')) updateEditSectionOptions();
    if (event.target.matches('[data-preview-important]')) {
      const card = event.target.closest('.travel-preview-card');
      const field = card?.querySelector('.preview-priority');
      const select = card?.querySelector('[data-preview-priority]');
      if (field && select) {
        field.hidden = !event.target.checked;
        select.disabled = !event.target.checked;
      }
    }
  });

  document.querySelector('#itemForm')?.addEventListener('submit', () => {
    if (current !== 'trips') return;
    setTimeout(() => {
      normaliseTravelData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (syncConfigured()) scheduleSync();
    }, 0);
  });

  ensureTravelEditDialog();
  document.querySelector('#travelEditForm')?.addEventListener('submit', handleTravelEditSubmit);
  replaceTravelFileInput();

  window.addEventListener('focus', () => syncNow());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') syncNow();
  });

  normaliseTravelData({ persist: true });
  startAutomaticSync();
  render();
  updateSyncBadge();
  syncNow();
})();

/* ================================================================ */

/* Samen Thuis v17 — enige centrale importer en editor.
   Combineert de bewerkbare controle van v13 met de flexibele invoer van v14.
*/
console.info('Samen Thuis v17 importer geladen');

(() => {
  'use strict';
  if (window.__SAMEN_THUIS_V17_IMPORTER__) return;
  window.__SAMEN_THUIS_V17_IMPORTER__ = true;

  const TARGETS = {
    planning:'Agenda', meals:'Weekmenu', groceries:'Boodschappen',
    chores:'Huishouden', stock:'Voorraad', ideas:'Samen doen',
    home:'Woning', trips:'Reizen'
  };

  const SUBTYPES = {
    chores:['Reguliere schoonmaak','Periodieke schoonmaak','Was & textiel','Overig'],
    stock:['Huishoudvoorraad','Persoonlijke verzorging','Keuken basisvoorraad','Koelkast & vriezer','Overig'],
    home:['Onderhoud','Veiligheid','Organisatie','Seizoen','Garantie','Woninginfo'],
    trips:['Route & planning','Vervoer','Verblijf','Activiteiten','Boekingen & acties','Budget','Documenten','Paklijst','Overig']
  };

  const REPEATS = [
    'Eenmalig','Dagelijks','Om de dag','2× per week','3× per week','Wekelijks',
    'Elke 2 weken','Elke 4 weken','Maandelijks','Elke 2 maanden','Elke 3 maanden',
    'Elke 6 maanden','Jaarlijks','Na elke was','Wanneer nodig'
  ];

  const ALIASES = {
    agenda:'planning', planning:'planning', kalender:'planning', afspraak:'planning', afspraken:'planning',
    weekmenu:'meals', menu:'meals', maaltijd:'meals', maaltijden:'meals', eten:'meals',
    boodschappen:'groceries', boodschap:'groceries', grocery:'groceries', groceries:'groceries',
    huishouden:'chores', huishoudelijk:'chores', schoonmaak:'chores', taak:'chores', taken:'chores',
    voorraad:'stock', stock:'stock', inventaris:'stock',
    idee:'ideas', ideeen:'ideas', ideeenlijst:'ideas', samen_doen:'ideas',
    woning:'home', huis:'home', onderhoud:'home',
    reizen:'trips', reis:'trips', vakantie:'trips', travel:'trips'
  };

  const SCHEMAS = {
    planning:['type','title','startDate','startTime','endDate','endTime','allDay','location','description','repeat'],
    meals:['type','date','mealType','title','persons','ingredients','note'],
    groceries:['type','title','amount','unit','category','store','forMeal','done','note'],
    chores:['type','title','category','repeat','person','startDate','nextDate','priority','done','notes'],
    stock:['type','title','category','amount','unit','minimum','bestBefore','location','note'],
    ideas:['type','title','category','description','person','priority','status','date','note'],
    home:['type','title','category','description','kind','priority','startDate','deadline','status','cost','done','note'],
    trips:['type','trip','section','title','kind','description','startDate','endDate','deadline','location','cost','priority','checkable','done','note']
  };

  sections.imports = { label:'Importeren', icon:'↥' };

  const state13 = {
    target:'planning',
    subtype:'',
    method:'manual',
    text:'',
    filename:'',
    preview:[],
    tripFolderId:data.tripFolders?.[0]?.id || '',
    tripSectionId:'',
    detectedTripName:'',
    detectedTripStart:'',
    detectedTripEnd:''
  };

  const baseRender13 = render;
  const baseFormConfig13 = formConfig;

  function norm(s='') {
    return String(s).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/&/g,' en ')
      .replace(/[^a-z0-9]+/g,' ')
      .trim();
  }

  function cleanBullet(s='') {
    return String(s)
      .replace(/^\s*(?:[-•▪◦‣–—]|☐|□|☑|✓|✔|\[[ xX]?\])\s*/,'')
      .trim();
  }

  function num(v, fallback=0) {
    const m=String(v??'').replace(',','.').match(/-?\d+(?:\.\d+)?/);
    return m?Number(m[0]):fallback;
  }

  function boolWord(v) {
    return /^(1|ja|yes|true|aan|x|✓)$/i.test(String(v||'').trim());
  }

  function falseWord(v) {
    return /^(0|nee|no|false|uit)$/i.test(String(v||'').trim());
  }

  function cleanField17(value='') {
    return String(value).trim().replace(/^\[(.*)\]$/,'$1').trim();
  }

  function splitFlexible17(line='') {
    const raw=cleanBullet(line);
    let parts;
    if(raw.includes('|')) parts=raw.split('|');
    else if(raw.includes(';')) parts=raw.split(';');
    else if(raw.includes('\t')) parts=raw.split(/\t+/);
    else if(/\s\/\s/.test(raw)) parts=raw.split(/\s+\/\s+/);
    else if(/\s[-–—]\s/.test(raw)) parts=raw.split(/\s+[-–—]\s+/);
    else if(/\s{2,}/.test(raw)) parts=raw.split(/\s{2,}/);
    else return [raw];
    return parts.map(cleanField17);
  }

  function targetFromToken17(value='') {
    const key=norm(value).replace(/\s/g,'_');
    return ALIASES[key] || ALIASES[norm(value)] || '';
  }

  function isHeader17(line,parts,target) {
    const whole=norm(cleanBullet(line));
    if(!whole || /^#/.test(String(line).trim())) return true;
    const single=parts.length===1;
    const subtypeNames=Object.values(SUBTYPES).flat().map(norm);
    if(single && (targetFromToken17(parts[0]) || subtypeNames.includes(norm(parts[0])))) return true;
    if(/^(aanbevolen uploadvolgorde|belangrijk|importregels|beperkingen|uitgangspunt woning|controle voor import|vaste volgorde)/.test(whole)) return true;

    const p=parts.map(norm);
    const headerWords=new Set([
      'titel','taak','product','onderwerp','categorie','frequentie','herhaling','persoon',
      'toegewezen aan','startdatum','einddatum','volgende datum','prioriteit','afgevinkt',
      'omschrijving','notitie','hoeveelheid','eenheid','minimumvoorraad','minimum','gewenst',
      'datum','begindatum','begintijd','eindtijd','maaltijdmoment','gerecht','reis','map onderdeel'
    ]);
    const headerCount=p.filter(x=>headerWords.has(x) || /^\[.+\]$/.test(x)).length;
    if(parts.length>1 && headerCount>=Math.min(2,parts.length-1)) return true;
    if(parts.some(x=>/^\[.+\]$/.test(String(x).trim()))) return true;
    return false;
  }

  function priority17(value='') {
    const v=norm(value);
    if(/urgent|belangrijk|high|hoog/.test(v)) return 'high';
    if(/low|laag/.test(v)) return 'low';
    if(/normaal|normal|medium|midden/.test(v)) return 'medium';
    return '';
  }

  function universalRecord17(line,fallbackTarget) {
    const parts=splitFlexible17(line);
    if(parts.length<2 || isHeader17(line,parts,fallbackTarget)) return null;

    // Regels met "Veld: waarde" horen bij de documentparser hieronder.
    if(parts.slice(1).some(x=>/^[^:]{2,35}:\s*.+/.test(x))) return null;

    const explicitTarget=targetFromToken17(parts[0]);
    const target=explicitTarget || fallbackTarget;
    const schema=SCHEMAS[target];
    if(!schema) return null;
    const values=explicitTarget ? parts : [TARGETS[target],...parts];
    const record={target};
    schema.forEach((key,index)=>{record[key]=cleanField17(values[index]??'');});
    return record;
  }

  function universalItem17(record) {
    const t=record.target;
    if(t==='planning') return {
      id:id(),title:record.title||'Afspraak',date:isoDateFromText(record.startDate)||record.startDate||todayISO(),
      time:record.startTime||'',endDate:isoDateFromText(record.endDate)||record.endDate||'',endTime:record.endTime||'',
      allDay:boolWord(record.allDay),location:record.location||'',note:record.description||'',
      repeat:record.repeat?normaliseRepeat(record.repeat):'',person:'Samen',personSource:'manual',
      calendarId:data.calendars?.[0]?.id||'persoonlijk'
    };
    if(t==='meals') return {
      id:id(),title:record.title||'Maaltijd',date:isoDateFromText(record.date)||record.date||todayISO(),
      type:record.mealType||'Avondeten',persons:record.persons||'',ingredients:record.ingredients||'',note:record.note||''
    };
    if(t==='groceries') return {
      id:id(),title:record.title||'Product',amount:num(record.amount,record.amount?0:1),unit:record.unit||'',
      category:record.category||'Overig',store:record.store||'',forMeal:record.forMeal||'',
      done:boolWord(record.done),note:record.note||''
    };
    if(t==='chores') return {
      id:id(),title:record.title||'Taak',category:record.category||state13.subtype||'Schoonmaak',
      repeat:normaliseRepeat(record.repeat||'Wekelijks'),person:record.person||'Samen',
      due:isoDateFromText(record.nextDate||record.startDate)||record.nextDate||record.startDate||todayISO(),
      priority:priority17(record.priority),done:boolWord(record.done),notes:record.notes||'',
      secondWeekday:'',completedDates:[]
    };
    if(t==='stock') {
      const amount=num(record.amount,0),minimum=num(record.minimum,0);
      return {
        id:id(),title:record.title||'Product',category:record.category||stockCategory('',state13.subtype),
        amount,unit:record.unit||'stuks',min:minimum,
        desired:num(record.desired,Math.max(amount,minimum)),bestBefore:isoDateFromText(record.bestBefore)||record.bestBefore||'',
        location:record.location||'',note:record.note||''
      };
    }
    if(t==='ideas') return {
      id:id(),title:record.title||'Idee',category:record.category||'Thuis',
      note:[record.description,record.note].filter(Boolean).join('\n'),person:record.person||'',
      priority:priority17(record.priority),status:record.status||'',date:isoDateFromText(record.date)||record.date||'',icon:'♡'
    };
    if(t==='home') return {
      id:id(),title:record.title||'Woningitem',category:record.category||state13.subtype||'Onderhoud',
      note:[record.description,record.note].filter(Boolean).join('\n'),kind:record.kind||'',
      priority:priority17(record.priority),startDate:isoDateFromText(record.startDate)||record.startDate||'',
      due:isoDateFromText(record.deadline||record.startDate)||record.deadline||record.startDate||'',
      status:record.status||'',cost:num(record.cost,0),done:boolWord(record.done),repeat:''
    };
    if(t==='trips') {
      const folderName=record.trip||selectedTripFolder()?.name||'Nieuwe reis';
      const folder=findTripFolderByName(folderName);
      const sectionName=record.section||state13.subtype||'Algemeen';
      const section=folder?findTripSectionByName(folder.id,sectionName):null;
      const start=isoDateFromText(record.startDate||record.deadline)||record.startDate||record.deadline||'';
      const end=isoDateFromText(record.endDate)||record.endDate||start;
      const notes=[];
      if(record.location) notes.push(`Locatie: ${record.location}`);
      if(record.cost) notes.push(`Kosten: ${record.cost}`);
      if(record.description) notes.push(record.description);
      if(record.note) notes.push(record.note);
      return {
        id:id(),tripFolderId:folder?.id||'',tripSectionId:section?.id||'',
        _pendingFolderName:folderName,_pendingSectionName:sectionName,
        title:record.title||'Reisitem',date:start,startDate:start,endDate:end,
        type:record.kind||'Notitie',note:notes.join('\n'),checkable:boolWord(record.checkable),
        important:['high','hoog'].includes(priority17(record.priority)||norm(record.priority)),done:boolWord(record.done)
      };
    }
    return null;
  }

  function parseUniversal17(text,target) {
    const entries=String(text||'').replace(/\r/g,'').split(/\n+/)
      .map(x=>x.trim()).filter(Boolean).slice(0,500)
      .map(line=>universalRecord17(line,target)).filter(Boolean)
      .map(record=>universalItem17(record)).filter(Boolean)
      .filter(item=>item.title && !isHeader17(item.title,[item.title],target))
      .map(item=>{
        const duplicate=duplicateOf(target,item);
        return {selected:!duplicate,item,duplicate:duplicate?.id||''};
      });
    return entries;
  }

  function isoDateFromText(s='') {
    let m=String(s).match(/\b(20\d{2})[-/](\d{1,2})[-/](\d{1,2})\b/);
    if(m) return `${m[1]}-${String(m[2]).padStart(2,'0')}-${String(m[3]).padStart(2,'0')}`;
    m=String(s).match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](20\d{2})\b/);
    if(m) return `${m[3]}-${String(m[2]).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
    return '';
  }

  function normaliseRepeat(raw='') {
    const v=norm(String(raw).replace(/^frequentie\s*:\s*/i,''));
    const map=[
      [/^dagelijks$/,'Dagelijks'],[/^(om de dag|elke 2 dagen)$/,'Om de dag'],
      [/^(2x per week|2 per week|twee keer per week)$/,'2× per week'],
      [/^(3x per week|3 per week|drie keer per week)$/,'3× per week'],
      [/^wekelijks$/,'Wekelijks'],[/^(elke 2 weken|2 wekelijks|tweewekelijks)$/,'Elke 2 weken'],
      [/^(elke 4 weken|4 wekelijks)$/,'Elke 4 weken'],[/^maandelijks$/,'Maandelijks'],
      [/^(elke 2 maanden|2 maandelijks)$/,'Elke 2 maanden'],
      [/^(elke 3 maanden|kwartaal|kwartaallijks)$/,'Elke 3 maanden'],
      [/^(elke 6 maanden|halfjaarlijks)$/,'Elke 6 maanden'],
      [/^(jaarlijks|elk jaar|1x per jaar)$/,'Jaarlijks'],
      [/^(na elke was|na iedere was)$/,'Na elke was'],
      [/^(wanneer nodig|indien nodig|naar behoefte)$/,'Wanneer nodig'],
      [/^eenmalig$/,'Eenmalig']
    ];
    for(const [rx,label] of map) if(rx.test(v)) return label;
    return REPEATS.includes(raw)?raw:'Wekelijks';
  }

  function defaultSubtype(target) { return SUBTYPES[target]?.[0] || ''; }

  function keyValueLine(line='') {
    const m=cleanBullet(line).match(/^([^:]{2,40}):\s*(.*)$/);
    if(!m) return null;
    return {key:norm(m[1]), value:m[2].trim()};
  }

  function keyValueParts(line='') {
    const chunks=splitFlexible17(line).map(x=>x.trim()).filter(Boolean);
    const title=chunks.shift()||'';
    const meta={}, loose=[];
    chunks.forEach(chunk=>{
      const m=chunk.match(/^([^:]{2,35}):\s*(.*)$/);
      if(m) meta[norm(m[1])]=m[2].trim();
      else loose.push(chunk);
    });
    return {title,meta,loose};
  }

  function stockCategory(raw, subtype) {
    if(raw) return raw;
    if(subtype==='Persoonlijke verzorging') return 'Badkamer';
    if(subtype==='Keuken basisvoorraad') return 'Voorraadkast';
    if(subtype==='Koelkast & vriezer') return 'Koelkast';
    return 'Overig';
  }

  function duplicateOf(target,item) {
    const arr=data[target]||[];
    return arr.find(existing=>{
      if(norm(existing.title||existing.name)!==norm(item.title||item.name)) return false;
      if(target==='planning') return existing.date===item.date && (existing.time||'')===(item.time||'');
      if(target==='meals') return existing.date===item.date && (existing.type||'')===(item.type||'');
      if(target==='trips' && item.tripFolderId && existing.tripFolderId) {
        return existing.tripFolderId===item.tripFolderId;
      }
      return true;
    });
  }

  function parseChore(line) {
    const {title,meta,loose}=keyValueParts(line);
    if(!title || /^(huishouden|was & textiel)/i.test(title)) return null;
    return {
      id:id(), title,
      person:meta['voor wie']||meta.persoon||'Samen',
      due:meta.datum||meta['eerste keer']||todayISO(),
      repeat:normaliseRepeat(meta.frequentie||meta.herhaling||loose[0]||'Wekelijks'),
      secondWeekday:'',
      notes:meta.notitie||meta.notes||meta.omschrijving||loose.slice(1).join(' · '),
      completedDates:[],
      category:meta.categorie||state13.subtype,
      importSubtype:state13.subtype
    };
  }

  function parseStock(line) {
    const {title,meta}=keyValueParts(line);
    if(!title || /^(huishoudvoorraad|persoonlijke verzorging|keuken basisvoorraad|koelkast)/i.test(title)) return null;
    const desired=num(meta.gewenst??meta.doel??meta.streefvoorraad,0);
    const minimum=num(meta.minimum??meta.min,0);
    const given=meta.aantal??meta['in huis']??meta.huidig;
    const amount=given!==undefined?num(given,0):0;
    return {
      id:id(), title,
      category:stockCategory(meta.categorie||meta.plek,state13.subtype),
      amount,min:minimum,desired:desired||Math.max(minimum,amount),
      unit:meta.eenheid||'stuks',importSubtype:state13.subtype
    };
  }

  function parseHome(line) {
    const {title,meta,loose}=keyValueParts(line);
    if(!title || /^(woningonderhoud|veiligheid|woningorganisatie|seizoenstaken)/i.test(title)) return null;
    const repeatRaw=meta.frequentie||meta.herhaling||'';
    return {
      id:id(),title,
      category:meta.categorie||state13.subtype||'Onderhoud',
      due:meta.datum||'',
      repeat:repeatRaw?normaliseRepeat(repeatRaw):'',
      note:meta.notitie||meta.omschrijving||loose.join(' · '),
      importSubtype:state13.subtype
    };
  }

  function findTripFolderByName(name='') {
    return (data.tripFolders||[]).find(f=>norm(f.name)===norm(name));
  }

  function findTripSectionByName(folderId,name='') {
    return (data.tripSections||[]).find(s=>s.tripFolderId===folderId && norm(s.name)===norm(name));
  }

  function selectedTripFolder() {
    return (data.tripFolders||[]).find(f=>f.id===state13.tripFolderId) || data.tripFolders?.[0] || null;
  }

  function selectedTripSection(folderId) {
    const selected=(data.tripSections||[]).find(s=>s.id===state13.tripSectionId && s.tripFolderId===folderId);
    return selected || (data.tripSections||[]).find(s=>s.tripFolderId===folderId) || null;
  }

  function travelSection(type='',title='') {
    const s=norm(`${type} ${title}`);
    if(/paklijst|reisapotheek|meenemen|kleding|schoenen|outdoor|elektronica/.test(s)) return 'Paklijst';
    if(/verblijf|hotel|homestay|overnachting/.test(s)) return 'Verblijf';
    if(/budget|dagbudget|spaardoel|budgetsamenvatting|budgetnotitie/.test(s)) return 'Budget';
    if(/taak|voorbereiding|gezondheidstaak|boeking|reserver/.test(s)) return 'Boekingen & acties';
    if(/document|visum|paspoort|verzekering/.test(s)) return 'Documenten';
    if(/planning|route/.test(s)) return 'Route & planning';
    if(/vervoer|vlucht|transfer|limousine|trein|bus/.test(s)) return 'Vervoer';
    if(/activiteit|wellness|tip|eten|food|massage|spa|manicure|facial|head spa|canyoning|rafting|workshop/.test(s)) return 'Activiteiten';
    return state13.subtype || 'Overig';
  }

  function travelType(line, subtype='') {
    const s=norm(`${line} ${subtype}`);
    if(/paklijst|meenemen|inpakken|reisapotheek/.test(s)) return 'Paklijst';
    if(/hotel|homestay|verblijf|overnacht/.test(s)) return 'Verblijf';
    if(/vlucht|trein|bus|transfer|taxi|grab|vervoer|ferry|cruise|limousine/.test(s)) return 'Vervoer';
    if(/budget|prijs|kosten|spaardoel|euro|vnd/.test(s)) return 'Budget';
    if(/paspoort|visum|verzekering|document|gezondheid|vaccin/.test(s)) return 'Documenten';
    if(/boeken|vastleggen|reserveren|regelen|controleren|afspraak|taak/.test(s)) return 'Voorbereiding';
    if(/restaurant|eten|food|coffee|koffie/.test(s)) return 'Eten';
    if(/activiteit|tour|cave|rafting|canyoning|massage|spa|tailor|workshop|strand|museum|wellness/.test(s)) return 'Activiteit';
    return 'Notitie';
  }

  function detectTripMeta(lines) {
    state13.detectedTripName='';
    state13.detectedTripStart='';
    state13.detectedTripEnd='';

    for(const line of lines.slice(0,40)) {
      let m=line.match(/^Reis:\s*(.+)$/i);
      if(m) state13.detectedTripName=m[1].trim();
      m=line.match(/^(.+?\b20\d{2})\s*-\s*\d+\b/i);
      if(m && !state13.detectedTripName) state13.detectedTripName=m[1].trim();
    }

    // Record "Reis: X" is followed by metadata in our importdocument.
    const reisIndex=lines.findIndex(x=>/^Reis:\s*/i.test(x));
    if(reisIndex>=0) {
      for(let i=reisIndex+1;i<Math.min(lines.length,reisIndex+12);i++) {
        const kv=keyValueLine(lines[i]);
        if(!kv) break;
        if(kv.key==='startdatum') state13.detectedTripStart=isoDateFromText(kv.value)||kv.value;
        if(kv.key==='einddatum') state13.detectedTripEnd=isoDateFromText(kv.value)||kv.value;
      }
    }

    // Fallback: document title "Vietnam 2027 - 01 Reisplanning"
    if(!state13.detectedTripName && state13.filename) {
      const m=state13.filename.replace(/\.[^.]+$/,'').match(/^(.+?20\d{2})[_ -]/);
      if(m) state13.detectedTripName=m[1].replace(/_/g,' ').trim();
    }

    state13.detectedTripName ||= selectedTripFolder()?.name || 'Nieuwe reis';
  }

  const META_KEYS=new Set([
    'type','locatie','startdatum','einddatum','datum','deadline','afvinken','afvinkbaar',
    'belangrijk','personen','route','details','notitie','notes','categorie','prijs','bedrag',
    'status','plaats','person','voor wie','frequentie','herhaling','eenheid'
  ]);

  function isDocumentNoise(line='') {
    const s=String(line).trim();
    return !s ||
      /^Samen Thuis importdocument\b/i.test(s) ||
      /^IMPORTINSTRUCTIE:/i.test(s) ||
      /^Vietnam 20\d{2}\s*-\s*\d+/i.test(s) ||
      /^Reis:\s*/i.test(s) ||
      /^(Type|Startdatum|Einddatum|Afvinken|Belangrijk|Personen|Route):\s*/i.test(s) && false;
  }

  function structuredTravelBlocks(text) {
    const rawLines=String(text||'').replace(/\r/g,'').split(/\n+/).map(x=>x.trim()).filter(Boolean);
    detectTripMeta(rawLines);

    const skipIndexes=new Set();
    const reisIndex=rawLines.findIndex(x=>/^Reis:\s*/i.test(x));
    if(reisIndex>=0) {
      skipIndexes.add(reisIndex);
      for(let i=reisIndex+1;i<Math.min(rawLines.length,reisIndex+15);i++) {
        const kv=keyValueLine(rawLines[i]);
        if(!kv || !META_KEYS.has(kv.key)) break;
        skipIndexes.add(i);
      }
    }

    const blocks=[];
    let current=null;

    function pushCurrent() {
      if(!current) return;
      if(current.title && !isDocumentNoise(current.title)) blocks.push(current);
      current=null;
    }

    rawLines.forEach((line,idx)=>{
      if(skipIndexes.has(idx)) return;
      if(/^Samen Thuis importdocument\b/i.test(line) || /^IMPORTINSTRUCTIE:/i.test(line)) return;
      if(/^Vietnam 20\d{2}\s*-\s*\d+/i.test(line)) return;

      const kv=keyValueLine(line);
      if(kv && META_KEYS.has(kv.key)) {
        if(!current) return; // metadata zonder hoofdonderwerp negeren
        current.meta[kv.key]=kv.value;
        return;
      }

      // Een gewone regel is een nieuw hoofditem.
      pushCurrent();
      current={title:cleanBullet(line),meta:{}};
    });

    pushCurrent();
    return blocks;
  }

  function blockToTrip(block) {
    const m=block.meta||{};
    const title=block.title?.trim();
    if(!title) return null;

    const type=m.type || travelType(title,'');
    const sectionName=travelSection(type,title);
    const startDate=isoDateFromText(m.startdatum||m.datum||m.deadline||'');
    const endDate=isoDateFromText(m.einddatum||'') || startDate;
    let checkable=false;
    if(m.afvinken!==undefined) checkable=boolWord(m.afvinken);
    else if(m.afvinkbaar!==undefined) checkable=boolWord(m.afvinkbaar);
    else checkable=/\b(boek|boeken|vastleggen|reserveer|reserveren|regel|regelen|controleer|controleren|download|meenemen|inpakken)\b/i.test(title);

    const important=m.belangrijk!==undefined ? boolWord(m.belangrijk) : false;

    const notes=[];
    if(m.details) notes.push(m.details);
    if(m.notitie) notes.push(m.notitie);
    if(m.notes) notes.push(m.notes);
    if(m.locatie) notes.push(`Locatie: ${m.locatie}`);
    if(m.prijs) notes.push(`Prijs: ${m.prijs}`);
    if(m.bedrag) notes.push(`Bedrag: ${m.bedrag}`);
    if(m.status) notes.push(`Status: ${m.status}`);
    if(m.categorie) notes.push(`Categorie: ${m.categorie}`);

    const folder=findTripFolderByName(state13.detectedTripName);
    const section=folder?findTripSectionByName(folder.id,sectionName):null;

    return {
      id:id(),
      tripFolderId:folder?.id||'',
      tripSectionId:section?.id||'',
      title,
      date:startDate || endDate || '',
      startDate:startDate||'',
      endDate:endDate||'',
      type,
      note:notes.join('\n'),
      checkable,
      important,
      done:false,
      _pendingFolderName:folder?'':state13.detectedTripName,
      _pendingSectionName:section?'':sectionName
    };
  }

  function parseTripLegacy(line) {
    const source=cleanBullet(line);
    if(!source) return null;
    const {title,meta}=keyValueParts(source);
    const itemTitle=title||source;
    if(!itemTitle || /^[A-ZÀ-Ÿ &/-]{3,}:?$/.test(itemTitle)) return null;
    const folder=selectedTripFolder();
    const section=folder?selectedTripSection(folder.id):null;
    return {
      id:id(),tripFolderId:folder?.id||'',tripSectionId:section?.id||'',
      title:itemTitle,
      date:meta.datum||meta.deadline||isoDateFromText(source),
      startDate:meta.startdatum||'',
      endDate:meta.einddatum||'',
      type:meta.type||meta.soort||travelType(itemTitle,state13.subtype),
      note:meta.notitie||meta.notes||'',
      checkable:boolWord(meta.afvinkbaar||meta.afvinken) || /\b(boeken|vastleggen|reserveren|regelen|controleren|afspraak|downloaden|meenemen|inpakken)\b/i.test(itemTitle),
      important:boolWord(meta.belangrijk),
      done:false
    };
  }

  function parseGeneric(line,target) {
    const clean=cleanBullet(line);
    if(!clean) return null;
    if(target==='ideas') return {id:id(),title:clean,category:'Thuis',note:'',icon:'♡'};
    return null;
  }

  function parseLines13(text,target) {
    if(target==='planning'||target==='meals'||target==='groceries') return null;

    if(target==='trips') {
      const structured=structuredTravelBlocks(text);
      let items=structured.map(blockToTrip).filter(Boolean);

      // Als er geen blokstructuur is, val terug op de oude regelparser.
      if(!items.length) {
        items=String(text||'').replace(/\r/g,'').split(/\n+/)
          .map(x=>x.trim()).filter(Boolean)
          .filter(line=>!isHeader17(line,splitFlexible17(line),target)).slice(0,350)
          .map(parseTripLegacy).filter(Boolean);
      }

      return items.map(item=>{
        const dup=duplicateOf(target,item);
        return {selected:!dup,item,duplicate:dup?dup.id:''};
      });
    }

    const lines=String(text||'').replace(/\r/g,'').split(/\n+/).map(x=>x.trim()).filter(Boolean)
      .filter(x=>!/^#\s*(pagina|werkblad)\b/i.test(x))
      .filter(x=>!/^(aanbevolen uploadvolgorde|belangrijk|importregels|beperkingen|uitgangspunt woning)$/i.test(x))
      .filter(line=>!isHeader17(line,splitFlexible17(line),target));

    const parser=target==='chores'?parseChore:
      target==='stock'?parseStock:
      target==='home'?parseHome:
      line=>parseGeneric(line,target);

    return lines.slice(0,350).map(parser).filter(Boolean).map(item=>{
      const dup=duplicateOf(target,item);
      return {selected:!dup,item,duplicate:dup?dup.id:''};
    });
  }

  function field(label,html,cls='') {
    return `<div class="field ${cls}"><label>${esc(label)}</label>${html}</div>`;
  }

  function optionList(values,selected) {
    return values.map(v=>`<option value="${esc(v)}" ${v===selected?'selected':''}>${esc(v)}</option>`).join('');
  }

  function previewMeta(item,target) {
    if(target==='planning') return `${item.date||'geen datum'}${item.time?' · '+item.time:''}${item.person?' · '+item.person:''}`;
    if(target==='meals') return `${item.date||'geen datum'} · ${item.type||'Avondeten'}`;
    if(target==='groceries') return `${item.category||'Overig'}${item.amount?` · ${item.amount} ${item.unit||''}`:''}`;
    if(target==='ideas') return `${item.category||'Thuis'}${item.date?' · '+item.date:''}`;
    if(target==='stock') return `${item.category} · huidig ${item.amount} · minimum ${item.min} · gewenst ${item.desired} ${item.unit}`;
    if(target==='chores') return `${item.repeat} · ${item.person}${item.category?' · '+item.category:''}`;
    if(target==='home') return `${item.category}${item.repeat?' · '+item.repeat:''}${item.due?' · '+item.due:''}`;
    if(target==='trips') {
      const folder=(data.tripFolders||[]).find(f=>f.id===item.tripFolderId)?.name || item._pendingFolderName || state13.detectedTripName || 'Nieuwe/gekozen reis';
      const section=(data.tripSections||[]).find(s=>s.id===item.tripSectionId)?.name || item._pendingSectionName || state13.subtype || 'Algemeen';
      const dates=item.startDate&&item.endDate&&item.startDate!==item.endDate?`${item.startDate} → ${item.endDate}`:(item.date||item.startDate||'');
      return `${folder} › ${section} · ${item.type}${dates?' · '+dates:''}${item.checkable?' · afvinken':''}${item.important?' · ★ belangrijk':''}`;
    }
    return item.category||TARGETS[target]||'';
  }

  function previewEditor(entry) {
    const x=entry.item,t=state13.target;
    if(t==='planning') return `
      ${field('Wat?',`<input data-v13-field="title" value="${esc(x.title)}">`,'full')}
      ${field('Datum',`<input type="date" data-v13-field="date" value="${esc(x.date||'')}">`)}
      ${field('Begintijd',`<input type="time" data-v13-field="time" value="${esc(x.time||'')}">`)}
      ${field('Eindtijd',`<input type="time" data-v13-field="endTime" value="${esc(x.endTime||'')}">`)}
      ${field('Voor wie',`<select data-v13-field="person">${optionList(['Samen','Kees','Daphne'],x.person||'Samen')}</select>`)}
      ${field('Locatie',`<input data-v13-field="location" value="${esc(x.location||'')}">`)}
      ${field('Notitie',`<textarea data-v13-field="note">${esc(x.note||'')}</textarea>`,'full')}`;
    if(t==='meals') return `
      ${field('Gerecht',`<input data-v13-field="title" value="${esc(x.title)}">`,'full')}
      ${field('Datum',`<input type="date" data-v13-field="date" value="${esc(x.date||'')}">`)}
      ${field('Moment',`<select data-v13-field="type">${optionList(['Ontbijt','Lunch','Avondeten','Snack'],x.type||'Avondeten')}</select>`)}
      ${field('Personen',`<input data-v13-field="persons" value="${esc(x.persons||'')}">`)}
      ${field('Ingrediënten',`<textarea data-v13-field="ingredients">${esc(x.ingredients||'')}</textarea>`,'full')}
      ${field('Notitie',`<textarea data-v13-field="note">${esc(x.note||'')}</textarea>`,'full')}`;
    if(t==='groceries') return `
      ${field('Product',`<input data-v13-field="title" value="${esc(x.title)}">`,'full')}
      ${field('Aantal',`<input type="number" step="0.01" data-v13-field="amount" value="${Number(x.amount||0)}">`)}
      ${field('Eenheid',`<input data-v13-field="unit" value="${esc(x.unit||'')}">`)}
      ${field('Categorie',`<select data-v13-field="category">${optionList(GROCERY_CATEGORIES,x.category||'Overig')}</select>`)}
      ${field('Winkel',`<input data-v13-field="store" value="${esc(x.store||'')}">`)}
      <label class="checkbox-field"><input type="checkbox" data-v13-field="done" ${x.done?'checked':''}><span>Al gekocht</span></label>
      ${field('Notitie',`<textarea data-v13-field="note">${esc(x.note||'')}</textarea>`,'full')}`;
    if(t==='stock') return `
      ${field('Product',`<input data-v13-field="title" value="${esc(x.title)}">`,'full')}
      ${field('Categorie',`<input data-v13-field="category" value="${esc(x.category)}">`)}
      ${field('Huidig',`<input type="number" step="0.01" data-v13-field="amount" value="${x.amount}">`)}
      ${field('Minimum',`<input type="number" step="0.01" data-v13-field="min" value="${x.min}">`)}
      ${field('Gewenst',`<input type="number" step="0.01" data-v13-field="desired" value="${x.desired}">`)}
      ${field('Eenheid',`<input data-v13-field="unit" value="${esc(x.unit)}">`)}`;
    if(t==='chores') return `
      ${field('Taak',`<input data-v13-field="title" value="${esc(x.title)}">`,'full')}
      ${field('Frequentie',`<select data-v13-field="repeat">${optionList(REPEATS,x.repeat)}</select>`)}
      ${field('Voor wie',`<select data-v13-field="person">${optionList(['Samen','Kees','Daphne'],x.person)}</select>`)}
      ${field('Categorie',`<input data-v13-field="category" value="${esc(x.category||'')}">`)}
      ${field('Eerste keer',`<input type="date" data-v13-field="due" value="${esc(x.due||'')}">`)}
      ${field('Notitie',`<textarea data-v13-field="notes">${esc(x.notes||'')}</textarea>`,'full')}`;
    if(t==='home') return `
      ${field('Onderwerp',`<input data-v13-field="title" value="${esc(x.title)}">`,'full')}
      ${field('Categorie',`<input data-v13-field="category" value="${esc(x.category)}">`)}
      ${field('Frequentie',`<select data-v13-field="repeat"><option value="">Geen herhaling</option>${optionList(REPEATS,x.repeat)}</select>`)}
      ${field('Datum',`<input type="date" data-v13-field="due" value="${esc(x.due||'')}">`)}
      ${field('Notitie',`<textarea data-v13-field="note">${esc(x.note||'')}</textarea>`,'full')}`;
    if(t==='trips') return `
      ${field('Onderwerp',`<input data-v13-field="title" value="${esc(x.title)}">`,'full')}
      ${field('Startdatum',`<input type="date" data-v13-field="startDate" value="${esc(x.startDate||x.date||'')}">`)}
      ${field('Einddatum',`<input type="date" data-v13-field="endDate" value="${esc(x.endDate||x.startDate||x.date||'')}">`)}
      ${field('Soort',`<input data-v13-field="type" value="${esc(x.type||'Notitie')}">`)}
      <label class="checkbox-field"><input type="checkbox" data-v13-field="checkable" ${x.checkable?'checked':''}><span>Afvinkbaar</span></label>
      <label class="checkbox-field"><input type="checkbox" data-v13-field="important" ${x.important?'checked':''}><span>Belangrijk ★</span></label>
      ${field('Notitie',`<textarea data-v13-field="note">${esc(x.note||'')}</textarea>`,'full')}`;
    if(t==='ideas') return `
      ${field('Idee',`<input data-v13-field="title" value="${esc(x.title)}">`,'full')}
      ${field('Categorie',`<input data-v13-field="category" value="${esc(x.category||'Thuis')}">`)}
      ${field('Datum',`<input type="date" data-v13-field="date" value="${esc(x.date||'')}">`)}
      ${field('Emoji',`<input data-v13-field="icon" value="${esc(x.icon||'♡')}">`)}
      ${field('Notitie',`<textarea data-v13-field="note">${esc(x.note||'')}</textarea>`,'full')}`;
    return field('Titel',`<input data-v13-field="title" value="${esc(x.title||'')}">`,'full');
  }

  function manualForm13() {
    const t=state13.target;
    const calendars=data.calendars||[];
    const tripFolders=data.tripFolders||[];
    const folder=selectedTripFolder();
    const sections=(data.tripSections||[]).filter(s=>s.tripFolderId===folder?.id);

    if(t==='planning') return `
      ${field('Wat?',`<input data-v14-manual="title" required>`,'full')}
      ${field('Datum',`<input type="date" data-v14-manual="date" value="${todayISO()}">`)}
      ${field('Begintijd',`<input type="time" data-v14-manual="time">`)}
      ${field('Eindtijd',`<input type="time" data-v14-manual="endTime">`)}
      ${field('Agenda',`<select data-v14-manual="calendarId">${calendars.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')}</select>`)}
      ${field('Voor wie?',`<select data-v14-manual="person">${optionList(['Samen','Kees','Daphne'],'Samen')}</select>`)}`;
    if(t==='meals') return `
      ${field('Gerecht',`<input data-v14-manual="title" required>`,'full')}
      ${field('Datum',`<input type="date" data-v14-manual="date" value="${todayISO()}">`)}
      ${field('Moment',`<select data-v14-manual="type">${optionList(['Ontbijt','Lunch','Avondeten','Snack'],'Avondeten')}</select>`)}`;
    if(t==='groceries') return `
      ${field('Product',`<input data-v14-manual="title" required>`,'full')}
      ${field('Categorie',`<select data-v14-manual="category">${optionList(GROCERY_CATEGORIES,'Overig')}</select>`)}`;
    if(t==='chores') return `
      ${field('Taak',`<input data-v14-manual="title" required>`,'full')}
      ${field('Voor wie?',`<select data-v14-manual="person">${optionList(['Samen','Kees','Daphne'],'Samen')}</select>`)}
      ${field('Eerste keer',`<input type="date" data-v14-manual="due" value="${todayISO()}">`)}
      ${field('Frequentie',`<select data-v14-manual="repeat">${optionList(REPEATS,'Wekelijks')}</select>`)}
      ${field('Categorie',`<input data-v14-manual="category" value="${esc(state13.subtype||'Reguliere schoonmaak')}">`)}
      ${field('Notitie',`<textarea data-v14-manual="notes"></textarea>`,'full')}`;
    if(t==='stock') return `
      ${field('Product',`<input data-v14-manual="title" required>`,'full')}
      ${field('Categorie',`<input data-v14-manual="category" value="${esc(stockCategory('',state13.subtype))}">`)}
      ${field('Huidig',`<input type="number" step="0.01" data-v14-manual="amount" value="0">`)}
      ${field('Minimum',`<input type="number" step="0.01" data-v14-manual="min" value="0">`)}
      ${field('Gewenst',`<input type="number" step="0.01" data-v14-manual="desired" value="0">`)}
      ${field('Eenheid',`<input data-v14-manual="unit" value="stuks">`)}`;
    if(t==='ideas') return `
      ${field('Idee',`<input data-v14-manual="title" required>`,'full')}
      ${field('Categorie',`<select data-v14-manual="category">${optionList(['Thuis','Uit','Actief','Gratis','Eten'],'Thuis')}</select>`)}
      ${field('Emoji',`<input data-v14-manual="icon" value="♡">`)}
      ${field('Notitie',`<textarea data-v14-manual="note"></textarea>`,'full')}`;
    if(t==='home') return `
      ${field('Onderwerp',`<input data-v14-manual="title" required>`,'full')}
      ${field('Categorie',`<input data-v14-manual="category" value="${esc(state13.subtype||'Onderhoud')}">`)}
      ${field('Datum',`<input type="date" data-v14-manual="due">`)}
      ${field('Herhaling',`<select data-v14-manual="repeat"><option value="">Geen herhaling</option>${optionList(REPEATS,'')}</select>`)}
      ${field('Notitie',`<textarea data-v14-manual="note"></textarea>`,'full')}`;
    if(t==='trips') return `
      ${field('Reis',`<select id="v14TripFolder" data-v14-manual="tripFolderId">${tripFolders.map(f=>`<option value="${esc(f.id)}" ${f.id===folder?.id?'selected':''}>${esc(f.name)}</option>`).join('')}</select>`)}
      ${field('Map binnen de reis',`<select data-v14-manual="tripSectionId">${sections.map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('')}</select>`)}
      ${field('Onderwerp',`<input data-v14-manual="title" required>`,'full')}
      ${field('Startdatum',`<input type="date" data-v14-manual="startDate">`)}
      ${field('Einddatum',`<input type="date" data-v14-manual="endDate">`)}
      ${field('Soort',`<select data-v14-manual="type">${optionList(['Voorbereiding','Reservering','Vervoer','Verblijf','Activiteit','Eten','Budget','Documenten','Paklijst','Notitie'],'Notitie')}</select>`)}
      ${field('Notitie',`<textarea data-v14-manual="note"></textarea>`,'full')}
      <label class="checkbox-field"><input type="checkbox" data-v14-manual="checkable"><span>Dit moet afgevinkt worden</span></label>
      <label class="checkbox-field"><input type="checkbox" data-v14-manual="important"><span>Belangrijk ★</span></label>`;
    return '';
  }

  function destinationFields13() {
    if(state13.target==='trips') {
      const detected=state13.detectedTripName?`<div class="field full"><small class="muted">Automatisch herkende reis: <strong>${esc(state13.detectedTripName)}</strong>. De documentstructuur heeft voorrang op de standaardkeuze.</small></div>`:'';
      const folder=selectedTripFolder();
      const sections=(data.tripSections||[]).filter(s=>s.tripFolderId===folder?.id);
      return `
        ${field('Standaard reis',`<select id="v14ImportTripFolder">${(data.tripFolders||[]).map(f=>`<option value="${esc(f.id)}" ${f.id===folder?.id?'selected':''}>${esc(f.name)}</option>`).join('')}</select>`)}
        ${field('Standaard map',`<select id="v14ImportTripSection">${sections.map(s=>`<option value="${esc(s.id)}" ${s.id===state13.tripSectionId?'selected':''}>${esc(s.name)}</option>`).join('')}</select>`)}
        ${detected}`;
    }
    const subtypes=SUBTYPES[state13.target]||[];
    return subtypes.length?field('Standaard categorie/map',`<select id="v13Subtype">${subtypes.map(v=>`<option ${v===state13.subtype?'selected':''}>${esc(v)}</option>`).join('')}</select>`):'';
  }

  function renderImports13() {
    const methodLabel=state13.method==='manual'?'Handmatig invoeren':state13.method==='file'?'Bestand uploaden':'Tekst plakken';
    return `<div class="import-v13">
      <section class="card">
        <div class="card-head"><div><p class="eyebrow">SAMEN THUIS · CENTRALE INVOER</p><h2>Toevoegen & importeren</h2></div><span class="tag green">${esc(methodLabel)}</span></div>
        <p>Kies waar het hoort en daarna hoe je het wilt toevoegen. Bij lijsten herkent de app <strong>|</strong>, <strong>;</strong>, tabs, <strong> / </strong>, <strong> - </strong> en meerdere spaties als scheidingsteken.</p>
        <div class="form-grid">
          ${field('Waar hoort dit bij?',`<select id="v13Target">${Object.entries(TARGETS).map(([k,v])=>`<option value="${k}" ${k===state13.target?'selected':''}>${esc(v)}</option>`).join('')}</select>`)}
          ${state13.method!=='manual'?destinationFields13():''}
        </div>
        <div class="v14-methods">
          <button class="${state13.method==='manual'?'primary':'secondary'}" data-v14-method="manual">✏️ Handmatig</button>
          <button class="${state13.method==='file'?'primary':'secondary'}" data-v14-method="file">📄 Bestand uploaden</button>
          <button class="${state13.method==='text'?'primary':'secondary'}" data-v14-method="text">📋 Tekst plakken</button>
        </div>
        ${state13.method==='manual'?`
          <div class="form-grid v14-manual-form">${manualForm13()}</div>
          <div class="button-row"><button class="primary" data-v14-manual-save>Opslaan</button></div>
        `:state13.method==='file'?`
          <div class="form-grid">${field('Bestand',`<input id="v13File" type="file" accept=".pdf,.docx,.xlsx,.xlsm,.xls,.csv,.txt,.md,application/pdf,text/plain">`,'full')}</div>
          ${state13.filename?`<p class="muted">Bron: <strong>${esc(state13.filename)}</strong></p>`:''}
          <p class="muted">Na kiezen wordt het bestand automatisch gelezen en geanalyseerd.</p>
        `:`
          <div class="form-grid">${field('Tekst/lijst plakken',`<textarea id="v13Text">${esc(state13.text)}</textarea>`,'full')}</div>
          <div class="button-row"><button class="primary" data-v13-analyse>Analyseren</button><button class="secondary" data-v13-clear>Leegmaken</button></div>
        `}
      </section>

      ${state13.method!=='manual'?(state13.preview.length?`<section class="card v13-preview">
        <div class="card-head"><div><p class="eyebrow">CONTROLE</p><h2>${state13.preview.length} gevonden items</h2></div>
          <div class="button-row"><button class="secondary" data-v13-all>Alles selecteren</button><button class="secondary" data-v13-none>Niets</button><button class="primary" data-v13-commit>Geselecteerde toevoegen</button></div>
        </div>
        ${state13.target==='trips'&&state13.detectedTripName?`<p class="muted">Bestemming: <strong>Reizen → ${esc(state13.detectedTripName)}</strong>${state13.detectedTripStart?` · ${esc(state13.detectedTripStart)}`:''}${state13.detectedTripEnd?` t/m ${esc(state13.detectedTripEnd)}`:''}</p>`:''}
        ${['chores','stock','home'].includes(state13.target)?`<div class="v13-bulk">
          <strong>Bulk aanpassen</strong>
          ${state13.target==='chores'?`<select id="v13BulkRepeat"><option value="">Frequentie behouden</option>${REPEATS.map(x=>`<option>${esc(x)}</option>`).join('')}</select>
          <select id="v13BulkPerson"><option value="">Persoon behouden</option><option>Samen</option><option>Kees</option><option>Daphne</option></select>`:''}
          <input id="v13BulkCategory" placeholder="Categorie (optioneel)">
          <button class="secondary" data-v13-bulk>Toepassen op geselecteerde</button>
        </div>`:''}
        <div class="v13-preview-list">${state13.preview.map((entry,i)=>`
          <article class="v13-card ${entry.duplicate?'duplicate':''}" data-v13-card="${i}">
            <div class="v13-card-head">
              <label><input type="checkbox" data-v13-selected ${entry.selected?'checked':''}> Importeren</label>
              ${entry.duplicate?'<span class="tag warning">Mogelijk al aanwezig · standaard overgeslagen</span>':''}
            </div>
            <div class="v13-fields">${previewEditor(entry)}</div>
            <small class="muted">${esc(previewMeta(entry.item,state13.target))}</small>
          </article>`).join('')}</div>
      </section>`:`<section class="card"><p class="muted">Nog niets geanalyseerd.</p></section>`):''}
    </div>`;
  }

  async function loadExternal13(src,test) {
    if(test()) return;
    await new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
    });
  }

  async function readFile13(file) {
    const ext=file.name.toLowerCase().split('.').pop();
    if(['txt','md','csv'].includes(ext)) return file.text();
    if(ext==='pdf') return extractPdfText(file);
    if(ext==='docx') {
      await loadExternal13('https://cdn.jsdelivr.net/npm/mammoth@1.12.2/mammoth.browser.min.js',()=>Boolean(window.mammoth));
      return (await window.mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()})).value||'';
    }
    if(['xlsx','xlsm','xls'].includes(ext)) {
      await loadExternal13('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',()=>Boolean(window.XLSX));
      const wb=window.XLSX.read(await file.arrayBuffer(),{type:'array',cellDates:true});
      return wb.SheetNames.map(n=>window.XLSX.utils.sheet_to_csv(wb.Sheets[n])).join('\n');
    }
    throw new Error('Bestandstype niet ondersteund');
  }

  function syncCardEdits() {
    document.querySelectorAll('[data-v13-card]').forEach(card=>{
      const entry=state13.preview[Number(card.dataset.v13Card)];
      if(!entry) return;
      entry.selected=Boolean(card.querySelector('[data-v13-selected]')?.checked);
      card.querySelectorAll('[data-v13-field]').forEach(input=>{
        const k=input.dataset.v13Field;
        let v=input.type==='checkbox'?input.checked:input.value;
        if(['amount','min','desired'].includes(k)) v=num(v,0);
        entry.item[k]=v;
      });
      if(entry.item.startDate) entry.item.date=entry.item.startDate;
    });
  }

  function analyse13() {
    const structuredTrip=state13.target==='trips' && (
      /\bReis:\s*.+/i.test(state13.text) ||
      /Samen Thuis importdocument/i.test(state13.text) ||
      /\b(Startdatum|Einddatum|Afvinken|Belangrijk):/i.test(state13.text)
    );
    const universal=structuredTrip?[]:parseUniversal17(state13.text,state13.target);
    if(universal.length) {
      state13.preview=universal;
      render();
      toast(`${state13.preview.length} items gevonden`);
      return;
    }

    const special=parseLines13(state13.text,state13.target);
    if(special!==null) {
      state13.preview=special;
      render();
      toast(`${state13.preview.length} items gevonden`);
      return;
    }

    const lines=String(state13.text||'').split(/\n+/).map(x=>x.trim()).filter(Boolean);
    if(state13.target==='groceries') {
      state13.preview=parseGroceryText(state13.text).slice(0,300).map(x=>({selected:true,item:{id:id(),...x}}));
    } else if(state13.target==='planning') {
      state13.preview=lines.filter(x=>isoDateFromText(x)).map(x=>({selected:true,item:{
        id:id(),title:x.replace(/\b20\d{2}[-/]\d{1,2}[-/]\d{1,2}\b/,'').trim()||'Afspraak',
        date:isoDateFromText(x),time:'',endTime:'',person:'Samen',calendarId:data.calendars[0]?.id||'persoonlijk'
      }}));
    } else if(state13.target==='meals') {
      const start=startOfWeek(todayISO());
      state13.preview=lines.slice(0,7).map((x,i)=>({selected:true,item:{id:id(),date:addDays(start,i),type:'Avondeten',title:cleanBullet(x)}}));
    }
    render();
    toast(`${state13.preview.length} items gevonden`);
  }

  function resolveTripDestination13(item) {
    data.tripFolders ||= [];
    data.tripSections ||= [];
    data.trips ||= [];

    const wantedFolder=item._pendingFolderName || state13.detectedTripName || '';
    let folder=(data.tripFolders||[]).find(f=>f.id===item.tripFolderId);

    if(!folder && wantedFolder) {
      folder=findTripFolderByName(wantedFolder);
      if(!folder) {
        folder={
          id:id(),name:wantedFolder,
          startDate:state13.detectedTripStart||'',
          endDate:state13.detectedTripEnd||'',
          note:'Aangemaakt via centrale invoer'
        };
        data.tripFolders.push(folder);
      }
    }
    if(!folder) folder=selectedTripFolder();
    if(!folder) return item;

    // Periode van de reis aanvullen wanneer die uit het document komt.
    if(state13.detectedTripStart && !folder.startDate) folder.startDate=state13.detectedTripStart;
    if(state13.detectedTripEnd && !folder.endDate) folder.endDate=state13.detectedTripEnd;

    const wantedSection=item._pendingSectionName || travelSection(item.type,item.title);
    let section=(data.tripSections||[]).find(s=>s.id===item.tripSectionId && s.tripFolderId===folder.id);
    if(!section) section=findTripSectionByName(folder.id,wantedSection);
    if(!section) {
      section={id:id(),tripFolderId:folder.id,name:wantedSection};
      data.tripSections.push(section);
    }

    const clean={...item,tripFolderId:folder.id,tripSectionId:section.id};
    delete clean._pendingFolderName;
    delete clean._pendingSectionName;
    clean.date=clean.startDate||clean.date||clean.endDate||'';
    return clean;
  }

  function commit13() {
    syncCardEdits();
    let selected=state13.preview.filter(x=>x.selected).map(x=>x.item);
    if(!selected.length) return toast('Selecteer minimaal één item');
    if(state13.target==='trips') selected=selected.map(resolveTripDestination13);

    data[state13.target] ||= [];
    data[state13.target].push(...selected);
    save();

    const count=selected.length;
    state13.preview=[];state13.text='';state13.filename='';
    render();
    toast(`${count} items toegevoegd aan ${TARGETS[state13.target]}`);
  }

  function manualValue13(name) {
    const el=document.querySelector(`[data-v14-manual="${name}"]`);
    if(!el) return '';
    return el.type==='checkbox'?el.checked:el.value;
  }

  function saveManual13() {
    const t=state13.target;
    const title=String(manualValue13('title')||'').trim();
    if(!title) return toast('Vul eerst een titel/onderwerp in');
    let item;

    if(t==='planning') item={id:id(),title,date:manualValue13('date')||todayISO(),time:manualValue13('time'),endTime:manualValue13('endTime'),calendarId:manualValue13('calendarId')||'persoonlijk',person:manualValue13('person')||'Samen',personSource:'manual'};
    else if(t==='meals') item={id:id(),title,date:manualValue13('date')||todayISO(),type:manualValue13('type')||'Avondeten'};
    else if(t==='groceries') item={id:id(),title,category:manualValue13('category')||'Overig',done:false};
    else if(t==='chores') item={id:id(),title,person:manualValue13('person')||'Samen',due:manualValue13('due')||todayISO(),repeat:manualValue13('repeat')||'Wekelijks',secondWeekday:'',notes:manualValue13('notes')||'',category:manualValue13('category')||'',completedDates:[]};
    else if(t==='stock') item={id:id(),title,category:manualValue13('category')||'Overig',amount:num(manualValue13('amount'),0),min:num(manualValue13('min'),0),desired:num(manualValue13('desired'),0),unit:manualValue13('unit')||'stuks'};
    else if(t==='ideas') item={id:id(),title,category:manualValue13('category')||'Thuis',note:manualValue13('note')||'',icon:manualValue13('icon')||'♡'};
    else if(t==='home') item={id:id(),title,category:manualValue13('category')||'Onderhoud',due:manualValue13('due')||'',repeat:manualValue13('repeat')||'',note:manualValue13('note')||''};
    else if(t==='trips') {
      const startDate=manualValue13('startDate')||'';
      item={id:id(),title,tripFolderId:manualValue13('tripFolderId'),tripSectionId:manualValue13('tripSectionId'),date:startDate,startDate,endDate:manualValue13('endDate')||startDate,type:manualValue13('type')||'Notitie',note:manualValue13('note')||'',checkable:Boolean(manualValue13('checkable')),important:Boolean(manualValue13('important')),done:false};
      item=resolveTripDestination13(item);
    }
    if(!item) return;
    data[t] ||= [];
    data[t].push(item);
    save();render();
    toast(`Toegevoegd aan ${TARGETS[t]}`);
  }

  function bind13() {
    const target=document.querySelector('#v13Target');
    if(target) target.onchange=()=>{
      state13.target=target.value;
      state13.subtype=defaultSubtype(state13.target);
      state13.preview=[];
      if(state13.target==='trips') {
        state13.tripFolderId=data.tripFolders?.[0]?.id||'';
        state13.tripSectionId=data.tripSections?.find(s=>s.tripFolderId===state13.tripFolderId)?.id||'';
      }
      render();
    };

    const subtype=document.querySelector('#v13Subtype');
    if(subtype) subtype.onchange=()=>{state13.subtype=subtype.value;};

    const text=document.querySelector('#v13Text');
    if(text) text.oninput=()=>{state13.text=text.value;};

    const importFolder=document.querySelector('#v14ImportTripFolder');
    if(importFolder) importFolder.onchange=()=>{
      state13.tripFolderId=importFolder.value;
      state13.tripSectionId=data.tripSections?.find(s=>s.tripFolderId===state13.tripFolderId)?.id||'';
      render();
    };

    const importSection=document.querySelector('#v14ImportTripSection');
    if(importSection) importSection.onchange=()=>{state13.tripSectionId=importSection.value;};

    const manualFolder=document.querySelector('#v14TripFolder');
    if(manualFolder) manualFolder.onchange=()=>{
      state13.tripFolderId=manualFolder.value;
      state13.tripSectionId=data.tripSections?.find(s=>s.tripFolderId===state13.tripFolderId)?.id||'';
      render();
    };

    const file=document.querySelector('#v13File');
    if(file) file.onchange=async()=>{
      const f=file.files?.[0];
      if(!f) return;
      try {
        toast('Bestand wordt gelezen…');
        state13.filename=f.name;
        state13.text=await readFile13(f);

        // Voor onze Samen Thuis-reisdocumenten automatisch naar Reizen.
        if(/\bReis:\s*.+20\d{2}\b/i.test(state13.text) || /Samen Thuis importdocument/i.test(state13.text) && /\b(Startdatum|Einddatum|Afvinken|Belangrijk):/i.test(state13.text)) {
          state13.target='trips';
          state13.subtype='Route & planning';
        }

        analyse13();
      } catch(e) {
        console.error(e);
        toast('Bestand lezen is mislukt');
      }
    };
  }

  function ensureEditor17() {
    if(document.querySelector('#editItemDialogV17')) return;
    const dialog=document.createElement('dialog');
    dialog.id='editItemDialogV17';
    dialog.innerHTML=`
      <form id="editItemFormV17">
        <div class="dialog-head">
          <div><p class="eyebrow">Bewerken</p><h2 id="editItemTitleV17">Item bewerken</h2></div>
          <button type="button" class="icon-btn" data-edit-close-v17 aria-label="Sluiten">×</button>
        </div>
        <div id="editItemFieldsV17" class="form-grid"></div>
        <div class="dialog-actions">
          <button type="button" class="secondary" data-edit-close-v17>Annuleren</button>
          <button type="submit" class="primary">Wijzigingen opslaan</button>
        </div>
      </form>`;
    document.body.appendChild(dialog);
    dialog.querySelectorAll('[data-edit-close-v17]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
  }

  function editableSpec17(type) {
    const specs={
      planning:[['title','Titel','text'],['date','Datum','date'],['time','Begintijd','time'],['endTime','Eindtijd','time'],['person','Voor wie','select',['Samen','Kees','Daphne']],['location','Locatie','text'],['note','Notitie','textarea']],
      meals:[['title','Gerecht','text'],['date','Datum','date'],['type','Moment','select',['Ontbijt','Lunch','Avondeten','Snack']],['persons','Personen','text'],['ingredients','Ingrediënten','textarea'],['note','Notitie','textarea']],
      groceries:[['title','Product','text'],['amount','Aantal','number'],['unit','Eenheid','text'],['category','Categorie','select',GROCERY_CATEGORIES],['store','Winkel','text'],['done','Gekocht','checkbox'],['note','Notitie','textarea']],
      chores:[['title','Taak','text'],['person','Voor wie','select',['Samen','Kees','Daphne']],['due','Eerste keer','date'],['repeat','Frequentie','select',REPEATS],['category','Categorie','text'],['notes','Notitie','textarea']],
      stock:[['title','Product','text'],['category','Categorie/plek','text'],['amount','Huidig aantal','number'],['min','Minimum','number'],['desired','Gewenst','number'],['unit','Eenheid','text'],['bestBefore','Houdbaar tot','date'],['note','Notitie','textarea']],
      ideas:[['title','Idee','text'],['category','Categorie','text'],['date','Datum','date'],['icon','Emoji','text'],['note','Notitie','textarea']],
      home:[['title','Onderwerp','text'],['category','Categorie','text'],['due','Datum','date'],['repeat','Herhaling','select',['',...REPEATS]],['status','Status','text'],['cost','Kosten','number'],['done','Afgerond','checkbox'],['note','Notitie','textarea']]
    };
    return specs[type]||[];
  }

  function editorOptions17(options,value) {
    const normal=(options||[]).map(option=>Array.isArray(option)?option:[option,option]);
    if(value!=='' && value!=null && !normal.some(([key])=>String(key)===String(value))) normal.unshift([value,value]);
    return normal.map(([key,label])=>`<option value="${esc(key)}" ${String(key)===String(value)?'selected':''}>${esc(label)}</option>`).join('');
  }

  function openExistingEditor17(type,item) {
    ensureEditor17();
    const dialog=document.querySelector('#editItemDialogV17');
    const fields=editableSpec17(type);
    document.querySelector('#editItemTitleV17').textContent=`${TARGETS[type]||'Item'} bewerken`;
    document.querySelector('#editItemFieldsV17').innerHTML=fields.map(([key,label,kind,options])=>{
      const value=item[key]??'';
      if(kind==='checkbox') return `<label class="checkbox-field"><input type="checkbox" data-edit-field-v17="${key}" ${value?'checked':''}><span>${esc(label)}</span></label>`;
      if(kind==='textarea') return `<div class="field full"><label>${esc(label)}</label><textarea data-edit-field-v17="${key}">${esc(value)}</textarea></div>`;
      if(kind==='select') return `<div class="field"><label>${esc(label)}</label><select data-edit-field-v17="${key}">${editorOptions17(options,value)}</select></div>`;
      const step=kind==='number'?' step="0.01"':'';
      return `<div class="field"><label>${esc(label)}</label><input type="${kind}"${step} data-edit-field-v17="${key}" value="${esc(value)}"></div>`;
    }).join('');

    const form=document.querySelector('#editItemFormV17');
    form.onsubmit=event=>{
      event.preventDefault();
      fields.forEach(([key,,kind])=>{
        const input=dialog.querySelector(`[data-edit-field-v17="${key}"]`);
        if(!input) return;
        if(kind==='checkbox') item[key]=input.checked;
        else if(kind==='number') item[key]=num(input.value,0);
        else item[key]=input.value;
      });
      if(type==='chores') {
        item.secondWeekday='';
        delete item.smartCycleCount;
        delete item.smartCycleStart;
      }
      save();
      dialog.close();
      render();
      toast('Wijzigingen opgeslagen');
    };
    dialog.showModal();
  }

  function addEditButtons17() {
    if(['today','settings','imports','trips'].includes(current)) return;
    document.querySelectorAll('[data-delete]').forEach(deleteButton=>{
      if(deleteButton.parentElement?.querySelector('[data-edit-existing-v17]')) return;
      const [type,itemId]=String(deleteButton.dataset.delete||'').split(':');
      if(!TARGETS[type]||!itemId||type==='trips') return;
      const edit=document.createElement('button');
      edit.type='button';
      edit.className='delete edit-pencil-v12';
      edit.dataset.editExistingV17=`${type}:${itemId}`;
      edit.setAttribute('aria-label','Bewerken');
      edit.textContent='✎';
      deleteButton.before(edit);
    });
  }

  render=function renderUnifiedImporterV17() {
    if(current==='imports') {
      document.querySelector('#view').innerHTML=renderImports13();
      updateSyncBadge();
      bind13();
      return;
    }
    baseRender13();
    requestAnimationFrame(addEditButtons17);
  };

  document.addEventListener('click',e=>{
    const topAdd=e.target.closest('#addBtn');
    if(topAdd) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if(current==='imports') {
        state13.method='manual';
        state13.preview=[];
        render();
      } else {
        openAdd();
      }
      return;
    }

    const existingEdit=e.target.closest('[data-edit-existing-v17]');
    if(existingEdit) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const [type,itemId]=existingEdit.dataset.editExistingV17.split(':');
      const item=data[type]?.find(candidate=>candidate.id===itemId);
      if(item) openExistingEditor17(type,item);
      return;
    }

    const method=e.target.closest('[data-v14-method]');
    if(method) {
      state13.method=method.dataset.v14Method;
      state13.preview=[];
      render();
      return;
    }
    if(e.target.closest('[data-v14-manual-save]')) {saveManual13();return;}

    const ctl=e.target.closest('[data-v13-analyse],[data-v13-clear],[data-v13-all],[data-v13-none],[data-v13-commit],[data-v13-bulk]');
    if(!ctl) return;

    if(e.target.closest('[data-v13-analyse]')) {analyse13();return;}
    if(e.target.closest('[data-v13-clear]')) {
      state13.text='';state13.filename='';state13.preview=[];state13.detectedTripName='';render();return;
    }
    if(e.target.closest('[data-v13-all]')) {
      document.querySelectorAll('[data-v13-selected]').forEach(x=>x.checked=true);return;
    }
    if(e.target.closest('[data-v13-none]')) {
      document.querySelectorAll('[data-v13-selected]').forEach(x=>x.checked=false);return;
    }
    if(e.target.closest('[data-v13-commit]')) {commit13();return;}
    if(e.target.closest('[data-v13-bulk]')) {
      syncCardEdits();
      const cat=document.querySelector('#v13BulkCategory')?.value.trim();
      const rep=document.querySelector('#v13BulkRepeat')?.value;
      const person=document.querySelector('#v13BulkPerson')?.value;
      state13.preview.filter(x=>x.selected).forEach(entry=>{
        if(cat) entry.item.category=cat;
        if(rep&&state13.target==='chores') entry.item.repeat=rep;
        if(person&&state13.target==='chores') entry.item.person=person;
      });
      render();return;
    }
  },true);

  formConfig=function formConfigV17(view) {
    const cfg=baseFormConfig13(view);
    if(!cfg) return cfg;
    cfg.fields=(cfg.fields||[]).map(f=>[...f]);

    if(view==='stock'&&!cfg.fields.some(f=>f[0]==='desired')) {
      const minIndex=cfg.fields.findIndex(f=>f[0]==='min');
      cfg.fields.splice(minIndex>=0?minIndex+1:cfg.fields.length,0,['desired','Gewenste voorraad','number']);
    }
    if(view==='chores') {
      cfg.fields=cfg.fields.filter(field=>field[0]!=='secondWeekday');
      const r=cfg.fields.find(f=>f[0]==='repeat');
      if(r) r[3]=REPEATS;
      if(!cfg.fields.some(f=>f[0]==='category')) cfg.fields.push(['category','Categorie','text']);
    }
    if(view==='home'&&!cfg.fields.some(f=>f[0]==='repeat')) {
      cfg.fields.push(['repeat','Herhaling','select',['',...REPEATS]]);
    }
    return cfg;
  };

  (data.stock||[]).forEach(item=>{
    if(item.desired==null) item.desired=Math.max(Number(item.amount||0),Number(item.min||0));
  });
  (data.chores||[]).forEach(item=>{item.category||='Schoonmaak';});
  (data.home||[]).forEach(item=>{item.repeat||='';});
  (data.trips||[]).forEach(item=>{
    if(item.startDate==null) item.startDate=item.date||'';
    if(item.endDate==null) item.endDate=item.startDate||item.date||'';
    if(item.important==null) item.important=false;
  });

  save({touch:false});
  ensureEditor17();
  setupNav();
  render();
})();

/* ================================================================ */

/* Samen Thuis v17 — bodemprijzen en huishoudverdeling
   - Bodemprijzen / goede-deal database
   - Gierige Gerda lijst 31-08-2026 als startdata
   - Nieuwere bodemprijzen-PDF direct importeerbaar
   - Prijsreferenties zichtbaar bij Boodschappen en Voorraad
   - Aanbevolen huishoudverdeling kan op bestaande taken worden toegepast
*/
console.info('Samen Thuis v17 prijzen en taakverdeling geladen');

(() => {
  'use strict';
  if (window.__SAMEN_THUIS_V17_PRICES__) return;
  window.__SAMEN_THUIS_V17_PRICES__ = true;

  const baseRender15 = render;
  const DEFAULT_PRICES = [{"category":"(Fris)drank","product":"Aanmaaklimonade","brand":"Karvam Cevitan","quantity":"liter","floorPrice":3.33,"goodDealPrice":4.15,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"(Fris)drank","product":"Aanmaaklimonade","brand":"Raak","quantity":"liter","floorPrice":1.86,"goodDealPrice":2.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"(Fris)drank","product":"Aanmaaklimonade","brand":"Teisseire","quantity":"liter","floorPrice":4.0,"goodDealPrice":4.15,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"(Fris)drank","product":"Cola","brand":"Coca-Cola","quantity":"liter","floorPrice":0.85,"goodDealPrice":1.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"(Fris)drank","product":"Cola","brand":"huismerk","quantity":"liter","floorPrice":0.33,"goodDealPrice":0.6,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"(Fris)drank","product":"Cola","brand":"Pepsi","quantity":"liter","floorPrice":0.67,"goodDealPrice":1.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"(Fris)drank","product":"Energiedrank","brand":"Red Bull","quantity":"250 ml","floorPrice":0.85,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"(Fris)drank","product":"Frisdrank overig","brand":"A-merk","quantity":"liter","floorPrice":1.0,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"(Fris)drank","product":"IJsthee","brand":"Lipton","quantity":"liter","floorPrice":0.8,"goodDealPrice":1.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"(Fris)drank","product":"Rivella","brand":"","quantity":"liter","floorPrice":0.83,"goodDealPrice":1.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Chips","product":"Popcorn","brand":"Jimmy's","quantity":"100 gram","floorPrice":0.89,"goodDealPrice":1.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Diepvries","product":"IJs","brand":"Ben & Jerry's","quantity":"500 ml","floorPrice":3.21,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Diepvries","product":"IJsstam","brand":"Viennetta","quantity":"600 gram","floorPrice":0.89,"goodDealPrice":1.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Conditioner","brand":"A-merk","quantity":"300 ml","floorPrice":1.99,"goodDealPrice":3.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Conditioner","brand":"huismerk","quantity":"500 ml","floorPrice":1.0,"goodDealPrice":1.25,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Damesscheermesjes","brand":"A-merk","quantity":"stuk","floorPrice":1.67,"goodDealPrice":2.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Deodorant roller","brand":"A-merk","quantity":"stuk","floorPrice":0.8,"goodDealPrice":1.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Deodorant roller","brand":"huismerk","quantity":"stuk","floorPrice":0.8,"goodDealPrice":1.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Deodorant spuitbus","brand":"A-merk","quantity":"stuk","floorPrice":0.8,"goodDealPrice":1.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Deodorant spuitbus","brand":"huismerk","quantity":"stuk","floorPrice":0.8,"goodDealPrice":1.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Douchegel","brand":"Fa","quantity":"250 ml","floorPrice":0.33,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Handzeep","brand":"A-merk","quantity":"liter","floorPrice":2.0,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Herenscheermesjes","brand":"A-merk","quantity":"stuk","floorPrice":1.92,"goodDealPrice":2.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Opzetborstel elektrisch","brand":"A-merk","quantity":"stuk","floorPrice":1.79,"goodDealPrice":2.5,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Opzetborstel elektrisch","brand":"huismerk","quantity":"stuk","floorPrice":0.31,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Shampoo","brand":"A-merk","quantity":"300 ml","floorPrice":1.99,"goodDealPrice":3.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Shampoo","brand":"huismerk","quantity":"500 ml","floorPrice":1.0,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Tandenborstel","brand":"A-merk","quantity":"stuk","floorPrice":0.33,"goodDealPrice":0.5,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Tandpasta","brand":"A-merk (doosje)","quantity":"75 ml","floorPrice":1.0,"goodDealPrice":2.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Tandpasta","brand":"A-merk (tube)","quantity":"75 ml","floorPrice":0.5,"goodDealPrice":1.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Tandpasta","brand":"huismerk","quantity":"75 ml","floorPrice":0.25,"goodDealPrice":0.41,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Tandpasta","brand":"Parodontax","quantity":"75 ml","floorPrice":1.67,"goodDealPrice":2.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Zonnebrandcrème","brand":"A-merk","quantity":"200 ml","floorPrice":5.99,"goodDealPrice":8.99,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Drogisterij","product":"Zonnebrandcrème","brand":"huismerk","quantity":"200 ml","floorPrice":3.2,"goodDealPrice":4.99,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Afwasmiddel","brand":"A-merk","quantity":"liter","floorPrice":2.85,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Allesreiniger","brand":"A-merk","quantity":"liter","floorPrice":0.9,"goodDealPrice":1.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Allesreiniger","brand":"huismerk","quantity":"liter","floorPrice":0.75,"goodDealPrice":1.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Allesreiniger doekjes","brand":"huismerk","quantity":"80 stuks","floorPrice":0.49,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Biotex","brand":"","quantity":"100 gram","floorPrice":0.42,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Keukenrol","brand":"2-laags","quantity":"100 vel","floorPrice":0.52,"goodDealPrice":0.75,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Keukenrol","brand":"3-laags","quantity":"100 vel","floorPrice":0.78,"goodDealPrice":1.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Oxi vlekverwijderaar","brand":"A-merk","quantity":"kilo","floorPrice":6.47,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Toiletblok","brand":"A-merk","quantity":"stuk","floorPrice":0.8,"goodDealPrice":1.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Toiletblok","brand":"huismerk","quantity":"stuk","floorPrice":0.5,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Toiletpapier","brand":"3-laags","quantity":"100 vel","floorPrice":0.13,"goodDealPrice":0.15,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Vaatwaspoeder","brand":"A-merk","quantity":"wasbeurt","floorPrice":0.05,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Vaatwaspoeder","brand":"huismerk","quantity":"wasbeurt","floorPrice":0.09,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Vaatwastablet","brand":"Dreft","quantity":"wasbeurt","floorPrice":0.17,"goodDealPrice":0.2,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Vaatwastablet","brand":"huismerk","quantity":"wasbeurt","floorPrice":0.04,"goodDealPrice":0.08,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Vaatwastablet","brand":"Sun","quantity":"wasbeurt","floorPrice":0.09,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Wasmiddel","brand":"Neutral","quantity":"wasbeurt","floorPrice":0.19,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Wasmiddel pods","brand":"huismerk","quantity":"wasbeurt","floorPrice":0.1,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Wasmiddel pods","brand":"Reus","quantity":"wasbeurt","floorPrice":0.14,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Wasmiddel poeder","brand":"Ariel","quantity":"wasbeurt","floorPrice":0.2,"goodDealPrice":0.23,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Wasmiddel poeder","brand":"Reus","quantity":"wasbeurt","floorPrice":0.14,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Wasmiddel quickwash","brand":"Robijn","quantity":"wasbeurt","floorPrice":0.22,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Wasmiddel vloeibaar","brand":"Ariel","quantity":"wasbeurt","floorPrice":0.2,"goodDealPrice":0.23,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Wasmiddel vloeibaar","brand":"Fleuril","quantity":"wasbeurt","floorPrice":0.13,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Wasmiddel vloeibaar","brand":"Omo","quantity":"wasbeurt","floorPrice":0.09,"goodDealPrice":0.11,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Wasmiddel vloeibaar","brand":"Reus","quantity":"wasbeurt","floorPrice":0.09,"goodDealPrice":0.11,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Wasmiddel vloeibaar","brand":"Robijn","quantity":"wasbeurt","floorPrice":0.13,"goodDealPrice":0.15,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Wasmiddeldoekje","brand":"A-merk","quantity":"wasbeurt","floorPrice":0.07,"goodDealPrice":0.15,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Wasmiddeldoekje","brand":"huismerk","quantity":"wasbeurt","floorPrice":0.1,"goodDealPrice":0.15,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Wasparfum","brand":"Robijn","quantity":"wasbeurt","floorPrice":0.16,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Wasverzachter","brand":"huismerk","quantity":"wasbeurt","floorPrice":0.02,"goodDealPrice":0.05,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Huishouden","product":"Zakdoekjes (4-laags)","brand":"huismerk","quantity":"pakje 10 zakdoekjes","floorPrice":0.07,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Koffie en thee","product":"Filterkoffie","brand":"A-merk","quantity":"500 gram","floorPrice":5.29,"goodDealPrice":6.5,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Koffie en thee","product":"Filterkoffie","brand":"huismerk","quantity":"500 gram","floorPrice":3.0,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Koffie en thee","product":"Koffiebonen","brand":"huismerk","quantity":"kilo","floorPrice":6.66,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Koffie en thee","product":"Koffiecup","brand":"A-merk","quantity":"stuk","floorPrice":0.25,"goodDealPrice":0.3,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Koffie en thee","product":"Koffiecup","brand":"huismerk","quantity":"stuk","floorPrice":0.09,"goodDealPrice":0.13,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Koffie en thee","product":"Koffiepads","brand":"A-merk","quantity":"per pad","floorPrice":0.07,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Koffie en thee","product":"Koffiepads","brand":"huismerk","quantity":"per pad","floorPrice":0.05,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Koffie en thee","product":"Thee","brand":"A-merk","quantity":"doosje 20 stuks","floorPrice":1.0,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Koffie en thee","product":"Thee","brand":"Clipper","quantity":"doosje 20 stuks","floorPrice":1.79,"goodDealPrice":1.99,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Olie","product":"Olijfolie extra vierge","brand":"A-merk","quantity":"liter","floorPrice":4.99,"goodDealPrice":7.99,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Ontbijt en lunch","product":"Duopasta","brand":"Duo Pennotti","quantity":"kilo","floorPrice":4.36,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Ontbijt en lunch","product":"Hazelnootpasta","brand":"A-merk","quantity":"kilo","floorPrice":5.3,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Ontbijt en lunch","product":"Hazelnootpasta","brand":"huismerk","quantity":"kilo","floorPrice":3.49,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Ontbijt en lunch","product":"Ontbijtgranen","brand":"A-merk","quantity":"kilo","floorPrice":6.5,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Ontbijt en lunch","product":"Pindakaas","brand":"A-merk","quantity":"kilo","floorPrice":3.06,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Ontbijt en lunch","product":"Pindakaas","brand":"huismerk","quantity":"kilo","floorPrice":2.54,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Ontbijt en lunch","product":"Pindakaas 100%","brand":"huismerk","quantity":"kilo","floorPrice":2.86,"goodDealPrice":3.99,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Pasta en rijst","product":"Farfalle","brand":"huismerk","quantity":"kilo","floorPrice":1.35,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Pasta en rijst","product":"Fusilli","brand":"huismerk","quantity":"kilo","floorPrice":1.39,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Pasta en rijst","product":"Macaroni","brand":"huismerk","quantity":"kilo","floorPrice":0.99,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Pasta en rijst","product":"Noodles","brand":"Indomie","quantity":"zakje","floorPrice":0.3,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Pasta en rijst","product":"Noodles","brand":"Unox","quantity":"pot","floorPrice":0.99,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Pasta en rijst","product":"Noodles","brand":"Unox","quantity":"zakje","floorPrice":0.58,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Pasta en rijst","product":"Penne","brand":"huismerk","quantity":"kilo","floorPrice":1.08,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Pasta en rijst","product":"Rijst","brand":"Lassie","quantity":"kilo","floorPrice":1.74,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Pasta en rijst","product":"Rijst basmati","brand":"huismerk","quantity":"kilo","floorPrice":1.79,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Pasta en rijst","product":"Rijst pandan","brand":"huismerk","quantity":"kilo","floorPrice":1.79,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Pasta en rijst","product":"Rijst zilvervlies","brand":"huismerk","quantity":"kilo","floorPrice":1.4,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Pasta en rijst","product":"Spaghetti","brand":"huismerk","quantity":"kilo","floorPrice":0.66,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Sauzen","product":"Mayonaise","brand":"A-merk","quantity":"liter","floorPrice":2.22,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Snoep","product":"Pepermunt","brand":"Wilhelmina","quantity":"per rol","floorPrice":0.29,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Vlees","product":"Rookworst","brand":"HEMA","quantity":"stuk","floorPrice":2.49,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Vlees","product":"Rookworst","brand":"huismerk","quantity":"stuk","floorPrice":0.99,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Wereldkeuken","product":"Pizza","brand":"Crosta & Mollica","quantity":"stuk","floorPrice":3.0,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Wereldkeuken","product":"Wereldgerechten burritos","brand":"Knorr","quantity":"pak 2-3 personen","floorPrice":1.0,"goodDealPrice":1.35,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Zuivel","product":"Chocolademelk","brand":"A-merk","quantity":"liter","floorPrice":0.75,"goodDealPrice":1.0,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Zuivel","product":"Houdbare melk","brand":"A-merk","quantity":"liter","floorPrice":0.79,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Zuivel","product":"Houdbare melk","brand":"huismerk","quantity":"liter","floorPrice":0.66,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Zuivel","product":"Kaas (jong belegen)","brand":"huismerk","quantity":"kilo","floorPrice":5.0,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Zuivel","product":"Roomboter","brand":"huismerk","quantity":"500 gram","floorPrice":2.0,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"},{"category":"Zuivel","product":"Smeerkaas","brand":"A-merk","quantity":"100 gram","floorPrice":0.75,"goodDealPrice":null,"source":"Gierige Gerda Media 2026","updatedAt":"2026-08-31"}];
  const ASSIGNMENTS = {"Keuken en woonkamer dagelijkse reset":"Samen","WC schoonmaken":"Kees","Badkamer schoonmaken":"Daphne","Vloeren hele huis":"Kees","Afstoffen hele huis":"Daphne","Keuken grondig schoonmaken":"Daphne","Slaapkamer opruimen en schoonmaken":"Samen","Bureau- en wasruimte opruimen":"Kees","Hal opruimen en schoonmaken":"Kees","Koelkast weekcontrole":"Daphne","Spiegels en glazen oppervlakken reinigen":"Daphne","Deurklinken en lichtknoppen reinigen":"Samen","Onder bed, bank en meubels stofzuigen":"Kees","Afvalbakken reinigen":"Kees","Beddengoed verschonen":"Samen","Handdoeken en keukentextiel vervangen":"Samen","Kledingwas verwerken":"Samen","Badmat en schoonmaakdoeken wassen":"Daphne","Koelkast volledig schoonmaken":"Daphne","Oven en afzuigkap grondig reinigen":"Kees","Badkamer dieptereiniging":"Daphne","Plinten, deuren en kozijnen reinigen":"Samen","Radiatoren en ventilatieroosters reinigen":"Kees","Ramen binnenzijde en kozijnen schoonmaken":"Kees","Bank en hoge oppervlakken grondig reinigen":"Daphne","Wasmachine onderhouden":"Kees","Voorraadkast en keukenkastjes nalopen":"Daphne","Kledingkast en opbergkast nalopen":"Samen"};

  const norm15 = (v='') => String(v).toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();

  const esc15 = (v='') => String(v)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');

  const euro15 = n => Number.isFinite(Number(n))
    ? new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(Number(n))
    : '—';

  data.priceReferences ||= [];
  if(!data.priceReferences.length) {
    data.priceReferences = DEFAULT_PRICES.map((x,i)=>({id:`price-${i+1}`,...x}));
    data.priceReferenceSource = 'Gierige Gerda Media 2026';
    data.priceReferenceUpdatedAt = '2026-08-31';
    save({touch:false});
  }

  let pricePreview15 = [];
  let priceFileName15 = '';

  function bestRefs15(title='') {
    const q=norm15(title);
    if(!q) return [];
    const exact=[], loose=[];
    for(const r of data.priceReferences||[]) {
      const p=norm15(r.product);
      if(!p) continue;
      if(q===p || q.includes(p) || p.includes(q)) exact.push(r);
      else {
        const words=p.split(' ').filter(w=>w.length>3);
        if(words.length && words.some(w=>q.includes(w))) loose.push(r);
      }
    }
    return (exact.length?exact:loose).sort((a,b)=>(a.floorPrice??999)-(b.floorPrice??999));
  }

  function priceBadge15(ref) {
    if(!ref) return '';
    return `<span class="tag green">Bodem ${euro15(ref.floorPrice)} / ${esc15(ref.quantity)}</span>`+
      (ref.goodDealPrice!=null?` <span class="tag">Goede deal ≤ ${euro15(ref.goodDealPrice)}</span>`:'');
  }

  function renderPriceReferenceCard15() {
    const items=current==='groceries'?(data.groceries||[]):(data.stock||[]);
    const matched=items.map(item=>({item,refs:bestRefs15(item.title||item.name||'')}))
      .filter(x=>x.refs.length);

    return `<section class="card" data-v15-price-card>
      <div class="card-head">
        <div>
          <p class="eyebrow">BODEMPRIJZEN</p>
          <h2>Prijsreferentie</h2>
        </div>
        <span class="tag green">${(data.priceReferences||[]).length} prijzen</span>
      </div>
      <p class="muted">Bron: ${esc15(data.priceReferenceSource||'Prijsreferenties')} · bijgewerkt ${esc15(data.priceReferenceUpdatedAt||'onbekend')}.</p>
      ${matched.length?`
        <div class="v13-preview-list">
          ${matched.slice(0,12).map(x=>`
            <article class="v13-card">
              <strong>${esc15(x.item.title||x.item.name)}</strong>
              <div style="margin-top:8px">${priceBadge15(x.refs[0])}</div>
              <small class="muted">${esc15(x.refs[0].brand||'')}${x.refs.length>1?` · ${x.refs.length} passende referenties`:''}</small>
            </article>`).join('')}
        </div>`:
        `<p class="muted">Er zijn nog geen producten op deze pagina die automatisch aan de bodemprijzenlijst gekoppeld zijn.</p>`}
    </section>`;
  }

  function injectPagePriceCard15() {
    if(!['groceries','stock'].includes(current)) return;
    const view=document.querySelector('#view');
    if(!view || view.querySelector('[data-v15-price-card]')) return;
    view.insertAdjacentHTML('afterbegin',renderPriceReferenceCard15());
  }

  function householdStats15() {
    const counts={Kees:0,Daphne:0,Samen:0};
    (data.chores||[]).forEach(x=>{ if(counts[x.person]!=null) counts[x.person]++; });
    return counts;
  }

  function injectHouseholdDistribution15() {
    if(current!=='chores') return;
    const view=document.querySelector('#view');
    if(!view || view.querySelector('[data-v15-household]')) return;
    const c=householdStats15();
    view.insertAdjacentHTML('afterbegin',`
      <section class="card" data-v15-household>
        <div class="card-head">
          <div><p class="eyebrow">VERDELING</p><h2>Huishoudtaken</h2></div>
          <button class="secondary" data-v15-distribute>⚖️ Aanbevolen verdeling toepassen</button>
        </div>
        <p class="muted">Samen betekent: gezamenlijke verantwoordelijkheid; één van jullie mag de taak afronden.</p>
        <div class="button-row">
          <span class="tag">Kees · ${c.Kees}</span>
          <span class="tag">Daphne · ${c.Daphne}</span>
          <span class="tag">Samen · ${c.Samen}</span>
        </div>
      </section>`);
  }

  function applyHouseholdDistribution15() {
    let changed=0;
    (data.chores||[]).forEach(task=>{
      const key=Object.keys(ASSIGNMENTS).find(k=>norm15(k)===norm15(task.title));
      if(key && ASSIGNMENTS[key] && task.person!==ASSIGNMENTS[key]) {
        task.person=ASSIGNMENTS[key];
        changed++;
      }
    });
    save(); render(); toast(`${changed} huishoudtaken opnieuw verdeeld`);
  }

  function parsePrice15(value) {
    const m=String(value||'').match(/(\d+[,.]\d+|\d+)/);
    return m?Number(m[1].replace(',','.')):null;
  }

  const CATS15=['(Fris)drank','Chips','Diepvries','Drogisterij','Huishouden','Koffie en thee','Olie','Ontbijt en lunch','Pasta en rijst','Sauzen','Snoep','Vlees','Wereldkeuken','Zuivel'];

  function parsePricePdfText15(text='') {
    const lines=String(text).replace(/\r/g,'').split(/\n+/).map(x=>x.trim()).filter(Boolean);
    const updated=(String(text).match(/Update datum:\s*(\d{1,2})\s+([A-Za-zé]+)\s+(20\d{2})/i)||[]);
    const months={januari:'01',februari:'02',maart:'03',april:'04',mei:'05',juni:'06',juli:'07',augustus:'08',september:'09',oktober:'10',november:'11',december:'12'};
    const updateISO=updated.length?`${updated[3]}-${months[norm15(updated[2])]||'01'}-${String(updated[1]).padStart(2,'0')}`:'';

    const result=[];
    for(const line of lines) {
      if(/^Categorie\s+Product/i.test(line) || /Copyright Gierige Gerda/i.test(line)) continue;
      const category=CATS15.find(c=>line.startsWith(c+' '));
      if(!category) continue;
      const priceMatch=line.match(/€\s*(\d+[,.]\d+)\s*(?:€\s*(\d+[,.]\d+)|[-x])?\s*$/i);
      if(!priceMatch) continue;

      const prefix=line.slice(category.length,priceMatch.index).trim();
      const qtyRx=/(pakje\s+10\s+zakdoekjes|doosje\s+20\s+stuks|pak\s+2-3\s+personen|100\s+vel|80\s+stuks|600\s+gram|500\s+gram|300\s+ml|250\s+ml|200\s+ml|100\s+gram|75\s+ml|500\s+ml|kilo|liter|stuk|wasbeurt|per\s+pad|per\s+rol|zakje|pot)$/i;
      const qm=prefix.match(qtyRx);
      if(!qm) continue;
      const quantity=qm[1];
      const left=prefix.slice(0,qm.index).trim();

      let product='',brand='';
      const known=DEFAULT_PRICES.find(r=>norm15(`${r.product} ${r.brand}`)===norm15(left))
        || DEFAULT_PRICES.find(r=>norm15(left).startsWith(norm15(r.product)) && (!r.brand || norm15(left).includes(norm15(r.brand))));
      if(known) {
        product=known.product; brand=known.brand;
      } else {
        const tokens=left.split(/\s+/);
        brand=tokens.pop()||'';
        product=tokens.join(' ');
      }

      result.push({
        id:`price-import-${Date.now()}-${result.length}`,
        category,product,brand:brand==='-'?'':brand,quantity,
        floorPrice:parsePrice15(priceMatch[1]),
        goodDealPrice:parsePrice15(priceMatch[2]),
        source:'Gierige Gerda Media',
        updatedAt:updateISO
      });
    }
    return {items:result,updatedAt:updateISO};
  }

  function priceImportCard15() {
    return `<section class="card" data-v15-price-import>
      <div class="card-head">
        <div><p class="eyebrow">BODEMPRIJZEN</p><h2>Bodemprijzenlijst importeren</h2></div>
        <span class="tag green">${(data.priceReferences||[]).length} actief</span>
      </div>
      <p>Upload hier rechtstreeks de <strong>Gierige Gerda bodemprijzenlijst</strong>. De lijst wordt apart bewaard en niet als voorraadproduct.</p>
      <div class="form-grid">
        <div class="field full">
          <label>PDF / TXT</label>
          <input type="file" id="v15PriceFile" accept=".pdf,.txt,text/plain,application/pdf">
        </div>
      </div>
      ${priceFileName15?`<p class="muted">Bronbestand: <strong>${esc15(priceFileName15)}</strong></p>`:''}
      ${pricePreview15.length?`
        <div class="card-head" style="margin-top:16px">
          <div><strong>${pricePreview15.length} prijzen gevonden</strong><br><small class="muted">Controleer het aantal en vervang daarna de huidige prijsreferenties.</small></div>
          <button class="primary" data-v15-price-commit>Huidige lijst vervangen</button>
        </div>
        <div class="v13-preview-list">
          ${pricePreview15.slice(0,8).map(r=>`
            <article class="v13-card">
              <strong>${esc15(r.product)}</strong><br>
              <small>${esc15(r.brand||'Geen merk')} · ${esc15(r.quantity)}</small>
              <div style="margin-top:6px">${priceBadge15(r)}</div>
            </article>`).join('')}
        </div>
        ${pricePreview15.length>8?`<p class="muted">+ ${pricePreview15.length-8} overige prijzen</p>`:''}
      `:''}
    </section>`;
  }

  function injectPriceImport15() {
    if(current!=='imports') return;
    const view=document.querySelector('#view');
    if(!view || view.querySelector('[data-v15-price-import]')) return;
    view.insertAdjacentHTML('afterbegin',priceImportCard15());
    bindPriceFile15();
  }

  function bindPriceFile15() {
    const input=document.querySelector('#v15PriceFile');
    if(!input || input.dataset.bound==='1') return;
    input.dataset.bound='1';
    input.addEventListener('change',async e=>{
      const file=e.target.files?.[0]; if(!file) return;
      try {
        priceFileName15=file.name;
        toast('Bodemprijzenlijst wordt gelezen…');
        const ext=file.name.toLowerCase().split('.').pop();
        const text=ext==='pdf'?await extractPdfText(file):await file.text();
        const parsed=parsePricePdfText15(text);
        pricePreview15=parsed.items;
        if(parsed.updatedAt) pricePreview15.forEach(x=>x.updatedAt=parsed.updatedAt);
        render();
        toast(`${pricePreview15.length} bodemprijzen gevonden`);
      } catch(err) {
        console.error(err);
        toast('Bodemprijzenlijst kon niet worden gelezen');
      }
    });
  }

  function commitPrices15() {
    if(!pricePreview15.length) return toast('Upload eerst een bodemprijzenlijst');
    data.priceReferences=pricePreview15.map(x=>({...x}));
    data.priceReferenceSource='Gierige Gerda Media';
    data.priceReferenceUpdatedAt=pricePreview15.find(x=>x.updatedAt)?.updatedAt || new Date().toISOString().slice(0,10);
    save();
    const n=pricePreview15.length;
    pricePreview15=[]; priceFileName15='';
    render(); toast(`${n} bodemprijzen opgeslagen`);
  }

  render=function renderFeaturesV17() {
    baseRender15();
    injectPriceImport15();
    injectPagePriceCard15();
    injectHouseholdDistribution15();
  };

  document.addEventListener('click',e=>{
    if(e.target.closest('[data-v15-distribute]')) {
      e.preventDefault(); applyHouseholdDistribution15(); return;
    }
    if(e.target.closest('[data-v15-price-commit]')) {
      e.preventDefault(); commitPrices15(); return;
    }
  },true);

  save({touch:false});
})();

/* ================================================================ */

/* Samen Thuis v17
   SMART HOUSEHOLD + SCROLL PRESERVATION
   - Geen vaste weekdagen meer voor huishoudtaken.
   - Planning wordt berekend vanaf de echte laatste uitvoering.
   - 2×/3× per week werkt met flexibele tussenpozen en cyclusstatus.
   - completedDates blijft de bronhistorie.
   - Wijzigen/afvinken houdt de scrollpositie vast.
*/
console.info('Samen Thuis v17 slimme huishoudplanning geladen');

(() => {
  'use strict';
  if (window.__SAMEN_THUIS_V17_SMART_HOUSEHOLD__) return;
  window.__SAMEN_THUIS_V17_SMART_HOUSEHOLD__ = true;

  const baseRender16 = render;
  const baseOccursOn16 = typeof occursOn === 'function' ? occursOn : null;
  const baseToggle16 = typeof toggleChoreOccurrence === 'function' ? toggleChoreOccurrence : null;
  const baseRepeatLabel16 = typeof repeatLabel === 'function' ? repeatLabel : null;

  const pad16 = n => String(n).padStart(2,'0');
  const iso16 = d => `${d.getFullYear()}-${pad16(d.getMonth()+1)}-${pad16(d.getDate())}`;
  const parse16 = s => new Date(`${s}T12:00:00`);
  const today16 = () => iso16(new Date());

  const esc16 = (v='') => String(v).replace(/[&<>'"]/g, c=>({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  }[c]));

  const norm16 = (v='') => String(v).toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9×]+/g,' ').trim();

  function addDays16(dateISO, amount) {
    const d=parse16(dateISO);
    d.setDate(d.getDate()+amount);
    return iso16(d);
  }

  function addMonths16(dateISO, amount) {
    const original=parse16(dateISO);
    const day=original.getDate();
    const d=new Date(original.getFullYear(), original.getMonth()+amount, 1, 12);
    const last=new Date(d.getFullYear(), d.getMonth()+1, 0, 12).getDate();
    d.setDate(Math.min(day,last));
    return iso16(d);
  }

  function daysBetween16(a,b) {
    return Math.round((parse16(b)-parse16(a))/86400000);
  }

  function fmt16(date) {
    if(!date) return '';
    return new Intl.DateTimeFormat('nl-NL',{day:'numeric',month:'short'}).format(parse16(date));
  }

  function uniqueSortedDates16(chore) {
    return [...new Set((Array.isArray(chore.completedDates)?chore.completedDates:[])
      .filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x)))]
      .sort();
  }

  function lastDone16(chore) {
    const dates=uniqueSortedDates16(chore);
    return chore.lastDoneDate || dates.at(-1) || '';
  }

  function frequency16(chore) {
    const r=norm16(chore.repeat);
    if(r==='dagelijks') return {kind:'interval', target:1, days:1, lead:0};
    if(r==='om de dag') return {kind:'interval', target:1, days:2, lead:1};
    if(r==='2× per week' || r==='2x per week' || r==='2 per week') return {kind:'multi',target:2,days:4,lead:2,cycleDays:7};
    if(r==='3× per week' || r==='3x per week' || r==='3 per week') return {kind:'multi',target:3,days:3,lead:1,cycleDays:7};
    if(r==='wekelijks') return {kind:'interval',target:1,days:7,lead:3};
    if(r==='elke 2 weken' || r==='om de week') return {kind:'interval',target:1,days:14,lead:4};
    if(r==='elke 4 weken') return {kind:'interval',target:1,days:28,lead:7};
    if(r==='maandelijks') return {kind:'month',target:1,months:1,lead:7};
    if(r==='elke 2 maanden') return {kind:'month',target:1,months:2,lead:10};
    if(r==='elke 3 maanden') return {kind:'month',target:1,months:3,lead:14};
    if(r==='elke 6 maanden' || r==='halfjaarlijks') return {kind:'month',target:1,months:6,lead:21};
    if(r==='jaarlijks') return {kind:'month',target:1,months:12,lead:30};
    if(r==='eenmalig') return {kind:'once',target:1,lead:3};
    if(r==='na elke was' || r==='wanneer nodig') return {kind:'manual',target:0,lead:0};
    return {kind:'interval',target:1,days:7,lead:3};
  }

  function cycleCount16(chore, cfg) {
    if(cfg.kind!=='multi') return 0;
    const persisted=Number(chore.smartCycleCount);
    if(Number.isFinite(persisted) && persisted>=0 && persisted<=cfg.target) return persisted;

    const dates=uniqueSortedDates16(chore);
    if(!dates.length) return 0;

    // Reconstruct a current flexible cycle from the most recent completions.
    const recent=[];
    for(let i=dates.length-1;i>=0;i--) {
      if(!recent.length || daysBetween16(dates[i],recent.at(-1))<=cfg.days) {
        recent.unshift(dates[i]);
        if(recent.length>=cfg.target) break;
      } else break;
    }
    return Math.min(cfg.target,recent.length);
  }

  function nextDue16(chore) {
    const cfg=frequency16(chore);
    const last=lastDone16(chore);

    if(cfg.kind==='manual') return '';
    if(cfg.kind==='once') {
      if(last) return '';
      return chore.due || today16();
    }

    // First ever run: due is only an initial hint, never a fixed recurring weekday.
    if(!last) return chore.due || today16();

    if(cfg.kind==='month') return addMonths16(last,cfg.months);
    return addDays16(last,cfg.days);
  }

  function smartStatus16(chore, date=today16()) {
    const cfg=frequency16(chore);
    const last=lastDone16(chore);
    const due=nextDue16(chore);

    if(cfg.kind==='manual') {
      return {
        due:'', last, count:0, target:0, level:'green',
        text:last?`Laatst gedaan ${fmt16(last)} · wanneer nodig`:'Wanneer nodig'
      };
    }

    if(cfg.kind==='once' && last) {
      return {due:'',last,count:1,target:1,level:'green',text:`Afgerond ${fmt16(last)}`};
    }

    const delta=due ? daysBetween16(date,due) : 999;
    let level='green';
    if(delta<0) level='red';
    else if(delta<=Math.min(2,cfg.lead||0)) level='orange';

    if(cfg.kind==='multi') {
      const count=cycleCount16(chore,cfg);
      if(count>=cfg.target) {
        const text = delta>0
          ? `${cfg.target}/${cfg.target} gedaan · nieuwe cyclus over ${delta} ${delta===1?'dag':'dagen'}`
          : delta===0
            ? `${cfg.target}/${cfg.target} gedaan · nieuwe cyclus kan vandaag starten`
            : `Nieuwe cyclus is ${Math.abs(delta)} ${Math.abs(delta)===1?'dag':'dagen'} aan de beurt`;
        return {due,last,count,target:cfg.target,level,text};
      }

      const remaining=cfg.target-count;
      const prefix=`${count}/${cfg.target} gedaan`;
      const text=delta>0
        ? `${prefix} · nog ${remaining}× · volgende binnen ${delta} ${delta===1?'dag':'dagen'}`
        : delta===0
          ? `${prefix} · nog ${remaining}× · volgende vandaag`
          : `${prefix} · nog ${remaining}× · ${Math.abs(delta)} ${Math.abs(delta)===1?'dag':'dagen'} te laat`;
      return {due,last,count,target:cfg.target,level,text};
    }

    const text = delta>0
      ? `Binnen ${delta} ${delta===1?'dag':'dagen'} weer doen`
      : delta===0
        ? 'Vandaag weer doen'
        : `${Math.abs(delta)} ${Math.abs(delta)===1?'dag':'dagen'} te laat`;

    return {due,last,count:last?1:0,target:1,level,text};
  }

  function shouldShowSoon16(chore,date=today16()) {
    const cfg=frequency16(chore);
    const st=smartStatus16(chore,date);
    if(cfg.kind==='manual') return false;
    if(cfg.kind==='once' && st.last) return false;
    if(!st.due) return false;
    const d=daysBetween16(date,st.due);
    return d<=Math.max(0,cfg.lead||0);
  }

  // Replace fixed-weekday scheduling. The calendar occurrence is now the calculated
  // next deadline only; "soon" tasks are surfaced separately in Today/Household.
  if(baseOccursOn16) {
    occursOn = function occursOnV17(chore,date) {
      const due=nextDue16(chore);
      return Boolean(due && date===due);
    };
  }

  // De oude interface toonde bij 2× per week nog vaste weekdagen. V17 plant
  // uitsluitend vanaf de echte laatste uitvoerdatum.
  if(baseRepeatLabel16) {
    repeatLabel = function repeatLabelV17(chore) {
      return chore.repeat || 'Wekelijks';
    };
  }

  // Completion is always an actual completion moment, not a recurring weekday.
  if(baseToggle16) {
    toggleChoreOccurrence = function toggleChoreOccurrenceV17(choreId,date) {
      const chore=(data.chores||[]).find(x=>x.id===choreId);
      if(!chore) return;

      const doneDate = (date && date<=today16()) ? date : today16();
      chore.completedDates ||= [];

      // Clicking an already-recorded date undoes that exact completion.
      if(chore.completedDates.includes(doneDate)) {
        chore.completedDates=chore.completedDates.filter(x=>x!==doneDate);
        const dates=uniqueSortedDates16(chore);
        chore.lastDoneDate=dates.at(-1)||'';
        delete chore.smartCycleCount;
        delete chore.smartCycleStart;
      } else {
        const cfg=frequency16(chore);
        const previousLast=lastDone16(chore);
        chore.completedDates=[...new Set([...chore.completedDates,doneDate])].sort();
        chore.lastDoneDate=doneDate;

        if(cfg.kind==='multi') {
          let current=cycleCount16(chore,cfg);
          if(current>=cfg.target || !previousLast || daysBetween16(previousLast,doneDate)>cfg.cycleDays) {
            current=1;
            chore.smartCycleStart=doneDate;
          } else {
            current=Math.min(cfg.target,current+1);
            chore.smartCycleStart ||= previousLast;
          }
          chore.smartCycleCount=current;
        } else {
          chore.smartCycleCount=1;
          chore.smartCycleStart=doneDate;
        }
      }

      save();
      render();
    };
  }

  function migrateSmartChores16() {
    (data.chores||[]).forEach(chore=>{
      chore.completedDates ||= [];
      if(!chore.lastDoneDate) {
        const dates=uniqueSortedDates16(chore);
        chore.lastDoneDate=dates.at(-1)||'';
      }
      // Old second weekday is intentionally ignored from v16 onward.
      chore.secondWeekday='';
      chore.smartSchedule=true;
    });
    save({touch:false});
  }

  function statusColor16(level) {
    if(level==='red') return '#b84f58';
    if(level==='orange') return '#b2762c';
    return '#2e7d67';
  }

  function smartTaskCard16(chore) {
    const s=smartStatus16(chore);
    const last=s.last?`Laatst: ${fmt16(s.last)}`:'Nog niet uitgevoerd';
    return `<article class="v16-smart-task" data-v16-chore="${esc16(chore.id)}"
      style="border:1px solid rgba(49,95,134,.18);border-left:5px solid ${statusColor16(s.level)};border-radius:16px;padding:14px;margin:10px 0;background:rgba(255,255,255,.7)">
      <div style="display:flex;gap:12px;justify-content:space-between;align-items:flex-start">
        <div>
          <strong>${esc16(chore.title)}</strong>
          <div class="muted" style="margin-top:4px">${esc16(chore.person||'Samen')} · ${esc16(chore.repeat||'')}</div>
        </div>
        <button class="primary" data-v16-done="${esc16(chore.id)}" style="white-space:nowrap">✓ Gedaan</button>
      </div>
      <div style="margin-top:10px;font-weight:700;color:${statusColor16(s.level)}">${esc16(s.text)}</div>
      <small class="muted">${esc16(last)}${s.due?` · uiterlijk ${esc16(fmt16(s.due))}`:''}</small>
    </article>`;
  }

  function injectSmartHousehold16() {
    if(current!=='chores') return;
    const view=document.querySelector('#view');
    if(!view || view.querySelector('[data-v16-smart-household]')) return;

    const chores=[...(data.chores||[])].sort((a,b)=>{
      const sa=smartStatus16(a), sb=smartStatus16(b);
      if(!sa.due&&!sb.due) return 0;
      if(!sa.due) return 1;
      if(!sb.due) return -1;
      return sa.due.localeCompare(sb.due);
    });

    const dueSoon=chores.filter(x=>shouldShowSoon16(x));
    const later=chores.filter(x=>!shouldShowSoon16(x));

    const html=`<section class="card" data-v16-smart-household>
      <div class="card-head">
        <div><p class="eyebrow">SLIMME PLANNING</p><h2>Wanneer moet wat weer?</h2></div>
        <span class="tag green">Geen vaste weekdagen</span>
      </div>
      <p class="muted">Na iedere afronding wordt de volgende termijn opnieuw berekend vanaf die echte datum.</p>
      ${dueSoon.length?`
        <h3 style="margin-top:18px">Nu / binnenkort</h3>
        ${dueSoon.map(smartTaskCard16).join('')}
      `:`<p class="muted">Er hoeft op dit moment niets binnenkort gedaan te worden.</p>`}
      ${later.length?`
        <details style="margin-top:14px">
          <summary>Later (${later.length})</summary>
          <div style="margin-top:10px">${later.map(smartTaskCard16).join('')}</div>
        </details>`:''}
    </section>`;

    const distribution=view.querySelector('[data-v15-household]');
    if(distribution) distribution.insertAdjacentHTML('afterend',html);
    else view.insertAdjacentHTML('afterbegin',html);
  }

  function injectTodaySoon16() {
    if(current!=='today') return;
    const view=document.querySelector('#view');
    if(!view || view.querySelector('[data-v16-today-chores]')) return;

    const soon=(data.chores||[])
      .filter(x=>shouldShowSoon16(x))
      .sort((a,b)=>(nextDue16(a)||'9999').localeCompare(nextDue16(b)||'9999'));

    if(!soon.length) return;

    const html=`<section class="card" data-v16-today-chores>
      <div class="card-head">
        <div><p class="eyebrow">HUISHOUDEN · BINNENKORT</p><h2>${soon.length} ${soon.length===1?'taak':'taken'} in beeld</h2></div>
        <span class="tag">Flexibel</span>
      </div>
      ${soon.slice(0,6).map(smartTaskCard16).join('')}
    </section>`;

    view.insertAdjacentHTML('beforeend',html);
  }

  // ---- SCROLL PRESERVATION ----
  let lastRenderedPage16=null;
  let savedPage16=null;
  let savedY16=0;
  let restoreToken16=0;

  function captureScroll16() {
    savedPage16=current;
    savedY16=window.scrollY || document.documentElement.scrollTop || 0;
  }

  function restoreScroll16(page,y) {
    const token=++restoreToken16;
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        if(token!==restoreToken16 || current!==page) return;
        window.scrollTo({top:y,left:0,behavior:'auto'});
      });
    });
  }

  render = function renderV17() {
    const page=current;
    const samePage=lastRenderedPage16===page;
    const captured=savedPage16===page;
    const y=captured?savedY16:(samePage?(window.scrollY||document.documentElement.scrollTop||0):0);

    baseRender16();
    injectSmartHousehold16();
    injectTodaySoon16();

    lastRenderedPage16=page;
    savedPage16=null;
    savedY16=0;
    if((captured||samePage) && y>0) restoreScroll16(page,y);
    else if(!samePage) restoreScroll16(page,0);
  };

  // Capture before interactions that commonly re-render the same page:
  // edit/delete/complete/import/save/bulk controls.
  document.addEventListener('pointerdown',e=>{
    const actionable=e.target.closest(
      'button, input[type="checkbox"], select, [data-edit], [data-delete], [data-action], [data-v13-card], [data-v14-card], [data-v15-distribute], [data-v15-price-commit], [data-v16-done]'
    );
    if(actionable) captureScroll16();
  },true);

  document.addEventListener('click',e=>{
    const done=e.target.closest('[data-v16-done]');
    if(done) {
      e.preventDefault();
      e.stopImmediatePropagation();
      captureScroll16();
      toggleChoreOccurrence(done.dataset.v16Done,today16());
      return;
    }
  },true);

  migrateSmartChores16();

  // One initial render is needed so existing screens immediately use the new logic.
  render();
  window.__SAMEN_THUIS_V17__=true;
  document.documentElement.dataset.appVersion='17';
})();
