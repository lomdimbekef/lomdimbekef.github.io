// לומדים בכיף — כלים משותפים: שמירה, קריין, צלילים, חלונות ומעבר בין מסכים
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
// ⚠️ משתמש נתקע (בלי קריסה): נרשם בלוח הבקרה. בלי שמות ובלי תוכן, רק סוג ופרט טכני
const failNote = (kind, details) => { try { window.lbkTrack?.fail(kind, details); } catch { } };
const R = n => Math.floor(Math.random() * n), pick = a => a[R(a.length)];
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const strip = s => String(s).replace(/[֑-ׇ]/g, '');
const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 9);

// ---------- ערכות צבעים לכל ילד ----------
const THEMES = [
  { id: 'pink', t1: '#ff2d95', t2: '#ff8a00', name: 'ורוד־כתום' },
  { id: 'purple', t1: '#8b3dff', t2: '#ff2d95', name: 'סגול־ורוד' },
  { id: 'blue', t1: '#2f6bff', t2: '#00d4ff', name: 'כחול' },
  { id: 'green', t1: '#00c86e', t2: '#00b3ff', name: 'ירוק־טורקיז' },
  { id: 'sun', t1: '#ffb800', t2: '#ff5e3a', name: 'שמש' },
  { id: 'red', t1: '#ff3b4e', t2: '#8b3dff', name: 'אדום־סגול' },
];
const themeOf = id => THEMES.find(t => t.id === id) || THEMES[0];
function applyTheme(id) {
  const t = themeOf(id), r = document.documentElement.style;
  r.setProperty('--t1', t.t1); r.setProperty('--t2', t.t2);
}

// ---------- שמירה על המכשיר ----------
const KEY = 'lbk-v1';
const DEF_MATH = { ops: ['+', '-'], max: 20, speed: 'auto' };
const store = {
  d: null,
  load() {
    try { this.d = JSON.parse(localStorage.getItem(KEY)) || null; } catch { this.d = null; }
    if (!this.d) this.d = { kids: [], stats: {}, v: 1 };
    return this.d;
  },
  save() { try { localStorage.setItem(KEY, JSON.stringify(this.d)); } catch (e) { toast('⚠️ אין מקום לשמור. נסו תמונה קטנה יותר'); failNote('save', e.name + ' · ' + Math.round((JSON.stringify(this.d) || '').length / 1024) + 'KB'); } },
  kid(id) { return this.d.kids.find(k => k.id === id); },
  demo: {},   // מצב ניסיון: התקדמות שנשמרת רק בזיכרון, ונמחקת ביציאה
  st(id) {
    const bag = String(id).startsWith('demo') ? this.demo : this.d.stats;
    const s = bag[id] ||= { stars: 0, events: [], days: {}, ops: {}, games: {}, level: {} };
    s.ops ||= {}; s.games ||= {}; s.level ||= {}; s.days ||= {}; s.events ||= [];
    return s;
  },
};
store.load();

// ---------- לשון זכר / נקבה ----------
let CUR = null; // הילד שמשחק עכשיו
const isF = (kid = CUR) => kid?.gender === 'f';
const G = (m, f, kid = CUR) => isF(kid) ? f : m;

// ---------- קריין ----------
// הקריינים: הקלטות טבעיות (ElevenLabs). בחודש הבא יתווספו עוד
const NARRATORS = { lily: { n: 'לילי', e: '👩', dir: 'audio/lily', nmax: 100 }, computer: { n: 'קול מחשב', e: '🤖', dir: '', nmax: 0 } };
const DEF_NARR = 'lily';
const voice = {
  on: true, he: null, all: [], list: [], log: [],
  isHe: v => /^(he|iw)([-_]|$)/i.test(v.lang) || /hebrew|עברית|ivrit/i.test(v.name),
  note(m) { this.log.push(new Date().toTimeString().slice(0, 8) + ' ' + m); if (this.log.length > 12) this.log.shift(); },
  // באנדרואיד רשימת הקולות מגיעה באיחור. לכן בודקים שוב לפני כל משפט
  pick() {
    try {
      this.all = speechSynthesis.getVoices() || [];
      const vs = this.all.filter(this.isHe);
      const saved = store.d.voiceName && vs.find(v => v.name === store.d.voiceName);
      // קודם קול שמותקן בטלפון (עובד גם בלי אינטרנט), אחר כך השאר
      this.list = [...new Set([saved, ...vs.filter(v => v.localService), ...vs].filter(Boolean))];
      this.he = this.list[0] || null;
    } catch { this.list = []; this.he = null; }
    return this.he;
  },
  init() { this.pick(); try { speechSynthesis.onvoiceschanged = () => this.pick(); } catch { } },
  // גיבוי: הקול של הטלפון. מדברים מיד, ואם קול לא עובד עוברים לבא
  tts(t, cb) {
    if (!this.on) { cb && cb(); return; }
    this.pick();
    const tries = [...this.list, null];
    let done = false; const fin = () => { if (!done) { done = true; cb && cb(); } };
    const go = i => {
      if (i >= tries.length) { this.note('❌ אף קול לא עבד'); return fin(); }
      const v = tries[i]; let started = false;
      const u = new SpeechSynthesisUtterance(t); u.lang = v ? v.lang : 'he-IL'; if (v) u.voice = v; u.rate = .92; u.pitch = 1.1;
      u.onstart = () => { started = true; this.note('▶ ' + (v ? v.name : 'he-IL')); };
      u.onend = fin;
      u.onerror = e => { this.note('⚠️ ' + (v ? v.name : 'he-IL') + ': ' + e.error); if (!started && e.error !== 'interrupted' && e.error !== 'canceled') go(i + 1); else fin(); };
      setTimeout(() => { if (!started && !done && u._cur === this._cur) { this.note('⏱ ' + (v ? v.name : 'he-IL') + ' לא התחיל'); try { speechSynthesis.cancel(); } catch { } go(i + 1); } }, 2500);
      u._cur = this._cur = (this._cur || 0) + 1;
      try { speechSynthesis.resume(); speechSynthesis.speak(u); } catch (e) { this.note('❌ ' + e.message); go(i + 1); }
    };
    try {
      if (speechSynthesis.speaking || speechSynthesis.pending) { speechSynthesis.cancel(); setTimeout(() => go(0), 60); }
      else go(0);
    } catch { fin(); }
    setTimeout(fin, 9000);
  },
  // ---- הקלטות מוכנות: עובדות בכל טלפון, בלי קול מותקן ----
  // משפט אחד או כמה חלקים מופרדים ב־| . מספר נכתב כ־#7
  map: null, maps: {}, names: {}, el: null, q: [], seq: 0,
  key: t => { let h = 5381; const n = String(t).replace(/[^\u0590-\u05FF0-9?!., ]/g, '').replace(/\s+/g, ' ').trim(); for (let i = 0; i < n.length; i++) h = ((h << 5) + h + n.charCodeAt(i)) | 0; return (h >>> 0).toString(36); },
  loadMap() {
    fetch('audio/map.json').then(r => r.json()).then(m => { this.map = new Set(m); }).catch(() => { this.map = new Set(); });
    Object.entries(NARRATORS).forEach(([id, n]) => n.dir && fetch(n.dir + '/map.json').then(r => r.json()).then(m => { this.maps[id] = new Set(m); }).catch(() => { }));
    Object.entries(NARRATORS).forEach(([id, n]) => n.dir && fetch(n.dir + '/names/map.json').then(r => r.json()).then(m => { this.names[id] = new Set(m); }).catch(() => { }));
  },
  // קובץ לחלק אחד: קודם הקריין של הילד, ואם חסר אז ההקלטה הבסיסית
  file(p) {
    const n = NARRATORS[(CUR && CUR.narrator) || store.d.narrator || DEF_NARR];
    if (p === '@name') {                 // השם של הילד, אם הוקלט. אם לא, פשוט מדלגים
      const id = (CUR && CUR.narrator) || store.d.narrator || DEF_NARR, k = CUR && this.key(strip(CUR.name));
      return n && n.dir && k && this.names[id]?.has(k) ? `${n.dir}/names/${k}.mp3` : '';
    }
    if (/^#\d+$/.test(p)) { const x = +p.slice(1); if (n && n.dir && x <= n.nmax) return `${n.dir}/n/${x}.mp3`; return x <= 1000 ? `audio/n/${x}.m4a` : null; }
    const k = this.key(p);
    if (n && n.dir && this.maps[CUR && CUR.narrator || store.d.narrator || DEF_NARR]?.has(k)) return `${n.dir}/p/${k}.mp3`;
    return this.map && this.map.has(k) ? `audio/p/${k}.m4a` : null;
  },
  say(t, cb, onPart) {
    if (!this.on) { cb && cb(); return; }
    const parts = String(t).split('|').map(x => x.trim()).filter(Boolean);
    const files = parts.map(p => this.file(p)).filter(f => f !== '');
    if (!files.length || files.includes(null)) { this.note('🔁 אין הקלטה: ' + strip(parts.join(' ')).slice(0, 30)); return this.tts(parts.map(p => p.replace(/^#/, '')).join(' '), cb); }
    this.stop(); const my = ++this.seq;
    this.el ||= new Audio();
    const el = this.el; let i = 0;
    const done = () => { if (my === this.seq) { document.body.classList.remove('talking'); cb && cb(); } };
    const next = () => {
      if (my !== this.seq) return;
      if (i >= files.length) return done();
      onPart && onPart(i); el.src = files[i++]; el.onended = next;
      el.onerror = () => { this.note('⚠️ ' + el.src.split('/').pop()); failNote('audio', 'clip ' + el.src.split('/').slice(-2).join('/')); if (my === this.seq) { this.seq++; this.tts(parts.map(p => p.replace(/^#/, '')).join(' '), cb); } };
      const pr = el.play(); if (pr && pr.catch) pr.catch(e => { this.note('⚠️ ' + e.name); done(); });
    };
    document.body.classList.add('talking'); next();
  },
  stop() { this.seq++; try { if (this.el) this.el.pause(); } catch { } document.body.classList.remove('talking'); try { if (speechSynthesis.speaking || speechSynthesis.pending) speechSynthesis.cancel(); } catch { } },
};
voice.init(); voice.loadMap();
// מילים שהקריין מרכיב מהן משפטים (נאספות להקלטה)
const OPW = { '+': 'פְּלוּס', '-': 'מִינוּס', '×': 'כָּפוּל', '÷': 'חֲלָקִי' };
const SPOKEN = ['כַּמָּה זֶה', 'זֶה', 'שָׁלוֹם!', 'מוּכָן לְשַׂחֵק?', 'מוּכָנָה לְשַׂחֵק?', 'כִּמְעַט! הַתְּשׁוּבָה הִיא'];
const PRAISE = {
  m: ['כָּל הַכָּבוֹד!', 'אַתָּה אַלּוּף!', 'יֵשׁ! הִצְלַחְתָּ!', 'וָאוּ, אֵיזֶה יֹפִי!', 'מְעֻלֶּה!', 'מַדְהִים!', 'אַלּוּף אַלּוּפִים!'],
  f: ['כָּל הַכָּבוֹד!', 'אַתְּ אַלּוּפָה!', 'יֵשׁ! הִצְלַחְתְּ!', 'וָאוּ, אֵיזֶה יֹפִי!', 'מְעֻלֶּה!', 'מַדְהִים!', 'אַלּוּפַת אַלּוּפוֹת!'],
};
const RETRY = { m: ['כִּמְעַט! נַסֵּה שׁוּב', 'לֹא נוֹרָא, נַסֵּה עוֹד פַּעַם', 'אַתָּה קָרוֹב!'], f: ['כִּמְעַט! נַסִּי שׁוּב', 'לֹא נוֹרָא, נַסִּי עוֹד פַּעַם', 'אַתְּ קְרוֹבָה!'] };
const gk = () => isF() ? 'f' : 'm';

// ---------- צלילים ----------
let AC = null, sfxOn = true;
function tone(f, d, type = 'sine', t0 = 0, vol = .16) {
  if (!sfxOn) return;
  try {
    AC ||= new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
    const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(vol, AC.currentTime + t0); g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + t0 + d);
    o.connect(g).connect(AC.destination); o.start(AC.currentTime + t0); o.stop(AC.currentTime + t0 + d);
  } catch { }
}
const sfx = {
  win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, .18, 'triangle', i * .07)); },
  bad() { tone(240, .2, 'sawtooth', 0, .06); tone(190, .28, 'sawtooth', .1, .06); },
  pop() { tone(880, .07, 'square', 0, .06); },
  tap() { tone(600, .05, 'sine', 0, .08); },
  fanfare() { [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, .22, 'triangle', i * .12, .18)); },
};

// ---------- חגיגות, הודעות, חלון תחתון ----------
function confetti(n = 40) {
  const cs = ['#ff2d95', '#ff8a00', '#ffd23f', '#00e08a', '#00d4ff', '#8b3dff'];
  for (let i = 0; i < n; i++) {
    const d = document.createElement('div'); d.className = 'confetti';
    d.style.left = Math.random() * 100 + 'vw'; d.style.background = cs[i % cs.length];
    d.style.animationDuration = (1.4 + Math.random() * 1.6) + 's'; d.style.animationDelay = Math.random() * .3 + 's';
    document.body.appendChild(d); setTimeout(() => d.remove(), 3500);
  }
}
function toast(t, ms = 1900) { const e = $('#toast'); e.textContent = t; e.classList.add('show'); clearTimeout(e._t); e._t = setTimeout(() => e.classList.remove('show'), ms); }
function openSheet(html, init) {
  const s = $('#sheet'); s.innerHTML = html; s.classList.toggle('full', html.startsWith('<!--full-->')); s.classList.add('on'); $('#sheetBg').classList.add('on');
  init && init(s);
}
function closeSheet() { const s = $('#sheet'); s.classList.remove('on'); $('#sheetBg').classList.remove('on'); setTimeout(() => { if (!s.classList.contains('on')) s.classList.remove('full'); }, 420); }
$('#sheetBg').onclick = closeSheet;
// משיכה למטה (כשהחלון גלול לראש): החלון יורד עם האצבע ונסגר. אותה שיטה כמו בכסף בכיף
(() => {
  const sh = $('#sheet'); let y0 = null, dy = 0, drag = false;
  sh.addEventListener('touchstart', e => {
    y0 = sh.scrollTop <= 0 && e.touches.length === 1 && !sh.classList.contains('full') ? e.touches[0].clientY : null;
    dy = 0; drag = false;
  }, { passive: true });
  sh.addEventListener('touchmove', e => {
    if (y0 == null) return;
    dy = e.touches[0].clientY - y0;
    if (!drag && dy > 8 && sh.scrollTop <= 0) { drag = true; sh.style.transition = 'none'; }
    if (drag) { e.preventDefault(); sh.style.transform = `translateY(${Math.max(0, dy)}px)`; }
    else if (dy < -4) y0 = null;
  }, { passive: false });
  const end = () => {
    if (drag) { sh.style.transition = ''; if (dy > 90) closeSheet(); sh.style.transform = ''; }
    y0 = null; drag = false;
  };
  sh.addEventListener('touchend', end); sh.addEventListener('touchcancel', end);
  $('#sheetBg').addEventListener('touchmove', e => e.preventDefault(), { passive: false });
})();
// משיכה למטה בראש המסך לא מרעננת את האפליקציה (בכרום של אנדרואיד)
(() => {
  let y0 = 0, x0 = 0;
  document.addEventListener('touchstart', e => { y0 = e.touches[0].clientY; x0 = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchmove', e => {
    const dy = e.touches[0].clientY - y0, dx = e.touches[0].clientX - x0;
    if (dy <= 0 || Math.abs(dx) > dy) return;               // רק משיכה כלפי מטה (לא החלקה הצידה)
    let el = e.target;
    while (el && el !== document.body) { if (el.scrollHeight > el.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(el).overflowY)) break; el = el.parentElement; }
    const top = el && el !== document.body ? el.scrollTop <= 0 : (document.scrollingElement.scrollTop <= 0 && document.body.scrollTop <= 0);
    if (top && e.cancelable) e.preventDefault();
  }, { passive: false });
})();

const mascot = (cls = '') => `<svg class="mascot ${cls}" viewBox="0 0 120 130"><use href="#nitzotz"/></svg>`;
const kidPhotos = k => (k.photos && k.photos.length ? k.photos : k.photo ? [k.photo] : []);
const avatarHTML = k => { const p = kidPhotos(k); return p.length ? `<img src="${p[0]}" alt="" ${p.length > 1 ? `class="kav" data-kav="${k.id}" data-i="0"` : ''}>` : (k.gender === 'f' ? '👧' : '👦'); };
// כמה תמונות לילד: מתחלפות כל 2 שניות בכל מקום שמופיע העיגול שלו
setInterval(() => $$('img.kav').forEach(im => { const k = store.kid(im.dataset.kav); const p = k ? kidPhotos(k) : []; if (p.length < 2) return; const i = (+im.dataset.i + 1) % p.length; im.dataset.i = i; im.src = p[i]; }), 2000);
const spk = t => `<button class="spk" data-say="${esc(t)}" aria-label="השמעה">🔊</button>`;
document.addEventListener('click', e => { const b = e.target.closest('[data-say]'); if (b) { e.stopPropagation(); voice.say(b.dataset.say); } }, true);

// שבח. after (לא חובה) רץ רק כשניצוץ סיים לדבר, כדי שהשאלה הבאה לא תקטע אותו באמצע מילה
let goodN = 0;
function good(extra = '', after) {
  const p = pick(PRAISE[gk()]); sfx.win(); confetti(26); toast('🎉 ' + strip(p));
  const withName = ++goodN % 3 === 0;   // השם של הילד: בערך בכל שבח שלישי
  // scr: אם בינתיים עברו למסך אחר (יצאו מהמשחק), לא ממשיכים את המשחק הישן
  const scr = SCREEN_N; let fired = false; const go = () => { if (!fired && after) { fired = true; if (scr === SCREEN_N) after(); } };
  voice.say([p, withName ? '@name' : '', extra].filter(Boolean).join('|'), after ? () => setTimeout(go, 350) : undefined);
  if (after) setTimeout(go, 7000);      // ביטחון: גם אם הקול נתקע, ממשיכים
}
// אומרים משהו ואז ממשיכים, בלי לקטוע
function sayThen(t, after) { const scr = SCREEN_N; let fired = false; const go = () => { if (!fired) { fired = true; if (scr === SCREEN_N) after(); } }; voice.say(t, () => setTimeout(go, 350)); setTimeout(go, 7000); }
function bad(el) { sfx.bad(); if (el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); } voice.say(pick(RETRY[gk()])); }

// ---------- מעבר בין מסכים ----------
let leaveHook = null;
// כל מסך שיש בו כפתור חזרה (#back או #quit): גם כפתור "אחורה" של הטלפון עושה אותו דבר
let backFn = null;
const backBtn = () => `<button class="backbtn" id="back" aria-label="חזרה"><svg viewBox="0 0 24 24" width="26" height="26"><path d="M9 5l7 7-7 7" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
let SCREEN_N = 0; // עולה בכל מעבר מסך
function show(html, init) {
  SCREEN_N++;
  if (leaveHook) { try { leaveHook(); } catch { } leaveHook = null; }
  voice.stop(); closeSheet();
  const app = $('#app'); app.innerHTML = `<div class="screen">${html}</div>`; window.scrollTo(0, 0);
  init && init(app);
  const b = $('#back', app) || $('#quit', app) || $('#goOn', app);
  backFn = b ? () => b.click() : null;
  if (backFn && !(history.state && history.state.lbk)) try { history.pushState({ lbk: 1 }, ''); } catch { }
  if (typeof afterShow === 'function') afterShow();
}
// כפתור "אחורה" של אנדרואיד (או החלקה באייפון): שלב אחד אחורה, ולא יציאה מהמשחק
window.addEventListener('popstate', () => {
  if ($('#sheet').classList.contains('on')) { closeSheet(); }
  else if (backFn) { backFn(); }
  else if (CUR) { home(); }         // מסך בלי כפתור (למשל חגיגה): חוזרים למסך של הילד
  else return;                      // במסך הראשי: יוצאים כרגיל
  try { history.pushState({ lbk: 1 }, ''); } catch { }
});
const onLeave = f => { leaveHook = f; };

// ---------- שער הורים: שאלה שרק מבוגר פותר מהר ----------
function parentGate(then, why = 'כניסה להורים') {
  if (typeof BDIKA !== 'undefined' && BDIKA) return then(); // עמדת בדיקה: אזור ההורה פתוח
  if (typeof lock !== 'undefined' && lock.get()) return pinGate(then, why); // יש קוד הורה: קוד או טביעת אצבע
  const a = 12 + R(8), b = 6 + R(4), ans = a * b;
  openSheet(`<h2>🔒 ${esc(why)}</h2>
    <p class="mute small">כדי שהילדים לא ישנו הגדרות בטעות, צריך לפתור תרגיל:</p>
    <div class="gate-q">${a} × ${b} = ?</div>
    <label class="field"><input id="gAns" inputmode="numeric" pattern="[0-9]*" placeholder="התשובה" style="text-align:center;font-size:22px"></label>
    <div class="err" id="gErr"></div>
    <button class="btn full" id="gGo">כניסה</button>`, s => {
    const inp = $('#gAns', s); setTimeout(() => inp.focus(), 350);
    const go = () => { if (+inp.value === ans) { closeSheet(); then(); } else { $('#gErr', s).textContent = 'לא נכון, נסו שוב'; inp.value = ''; } };
    $('#gGo', s).onclick = go; inp.onkeydown = e => { if (e.key === 'Enter') go(); };
  });
}

// ---------- זמן משחק יומי ----------
const clock = {
  t0: null, timer: null,
  start() { this.stop(); this.t0 = Date.now(); this.timer = setInterval(() => this.tick(), 15000); },
  tick() {
    if (!CUR || !this.t0) return;
    const s = store.st(CUR.id), d = today(), add = (Date.now() - this.t0) / 1000; this.t0 = Date.now();
    s.days[d] = (s.days[d] || 0) + add; store.save();
    if (limitLeft(CUR) <= 0 && !document.hidden) timeUp();
  },
  stop() { if (this.t0) this.tick(); clearInterval(this.timer); this.timer = null; this.t0 = null; },
};
function usedToday(kid) { return (store.st(kid.id).days[today()] || 0) / 60; }
function limitLeft(kid) { const lim = kid.limit || 0; if (!lim) return Infinity; return lim + (kid.bonus?.[today()] || 0) - usedToday(kid); }
document.addEventListener('visibilitychange', () => { if (document.hidden) clock.stop(); else if (CUR) clock.start(); });

// ---------- הפתעות באמצע: מנוקדות ועם קריינות ----------
const SURPRISES = [
  { e: '🦒', bg: 'var(--g4)', c: '#2a0a00', m: 'הֲיָדַעְתָּ? לַגִּ׳ירָפָה יֵשׁ לָשׁוֹן אֲרֻכָּה מְאֹד, וְהִיא מְנַקָּה בָּהּ אֶת הָאָזְנַיִם!', f: 'הֲיָדַעַתְּ? לַגִּ׳ירָפָה יֵשׁ לָשׁוֹן אֲרֻכָּה מְאֹד, וְהִיא מְנַקָּה בָּהּ אֶת הָאָזְנַיִם!' },
  { e: '🤔', bg: 'var(--g2)', c: '#fff', m: 'חִידָה: מָה הוֹלֵךְ וְגָדֵל כְּכָל שֶׁלּוֹקְחִים מִמֶּנּוּ? ... בּוֹר!' },
  { e: '🏝️', bg: 'var(--g3)', c: '#04261a', m: 'מֻשָּׂג חָדָשׁ: אִי הוּא חֲתִיכַת אֶרֶץ שֶׁמַּיִם מַקִּיפִים אוֹתָהּ מִכָּל הַצְּדָדִים.' },
  { e: '🤸', bg: 'var(--g1)', c: '#fff', m: 'הַפְסָקַת תְּנוּעָה! קְפֹץ חָמֵשׁ פְּעָמִים, וְתַגִּיד בְּכָל קְפִיצָה מִסְפָּר!', f: 'הַפְסָקַת תְּנוּעָה! קִפְצִי חָמֵשׁ פְּעָמִים, וְתַגִּידִי בְּכָל קְפִיצָה מִסְפָּר!' },
  { e: '🐙', bg: 'var(--g5)', c: '#fff', m: 'הֲיָדַעְתָּ? לַתְּמָנוּן יֵשׁ שְׁלוֹשָׁה לְבָבוֹת!', f: 'הֲיָדַעַתְּ? לַתְּמָנוּן יֵשׁ שְׁלוֹשָׁה לְבָבוֹת!' },
  { e: '🧠', bg: 'var(--g2)', c: '#fff', m: 'חִידָה: מָה יֵשׁ לוֹ פָּנִים וּשְׁתֵּי יָדַיִם, אֲבָל אֵין לוֹ רַגְלַיִם? ... שָׁעוֹן!' },
  { e: '💧', bg: 'var(--g3)', c: '#04261a', m: 'הַפְסָקַת מַיִם! לֵךְ לִשְׁתּוֹת כּוֹס מַיִם, וְתַחֲזֹר אֵלַי. הַמֹּחַ אוֹהֵב מַיִם!', f: 'הַפְסָקַת מַיִם! לְכִי לִשְׁתּוֹת כּוֹס מַיִם, וְתַחְזְרִי אֵלַי. הַמֹּחַ אוֹהֵב מַיִם!' },
  { e: '🐝', bg: 'var(--g4)', c: '#2a0a00', m: 'הֲיָדַעְתָּ? דְּבוֹרִים רוֹקְדוֹת כְּדֵי לְסַפֵּר לַחֲבֵרוֹת שֶׁלָּהֶן אֵיפֹה יֵשׁ פְּרָחִים!', f: 'הֲיָדַעַתְּ? דְּבוֹרִים רוֹקְדוֹת כְּדֵי לְסַפֵּר לַחֲבֵרוֹת שֶׁלָּהֶן אֵיפֹה יֵשׁ פְּרָחִים!' },
  { e: '🌍', bg: 'var(--g1)', c: '#fff', m: 'מֻשָּׂג חָדָשׁ: יַבֶּשֶׁת הִיא חֲתִיכַת אֶרֶץ עֲנָקִית. יֵשׁ בָּעוֹלָם שֶׁבַע יַבָּשׁוֹת!' },
  { e: '🙆', bg: 'var(--g5)', c: '#fff', m: 'הַפְסָקַת מְתִיחָה! הָרֵם יָדַיִם גָּבוֹהַּ גָּבוֹהַּ, עַד הַתִּקְרָה!', f: 'הַפְסָקַת מְתִיחָה! הָרִימִי יָדַיִם גָּבוֹהַּ גָּבוֹהַּ, עַד הַתִּקְרָה!' },
];
function surprise(next) {
  const s = SURPRISES[(store.d.surpI = ((store.d.surpI ?? -1) + 1) % SURPRISES.length)]; store.save();
  const t = isF() && s.f ? s.f : s.m;
  show(`<div class="center" style="margin-top:16px">${mascot('lg')}</div>
    <h2 class="center nk" style="margin:8px 0 14px">🎁 הַפְתָּעָה!</h2>
    <div class="surp" style="background:${s.bg};color:${s.c}"><em>${s.e}</em>${t}</div>
    <div class="row" style="justify-content:center;margin-top:18px;gap:14px"><button class="btn ghost" data-say="${esc(t)}">🔊 לשמוע</button><button class="btn" id="goOn">ממשיכים ▶</button></div>`, a => {
    sfx.fanfare(); setTimeout(() => voice.say(t), 500); $('#goOn', a).onclick = next;
  });
}
