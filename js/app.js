// לומדים בכיף — מסך פתיחה, מסך הבית של הילד, וסיום זמן המשחק
'use strict';

function profiles() {
  if (CUR && CUR.demo) { store.demo = {}; document.body.classList.remove('demo-mode'); }
  CUR = null; clock.stop(); applyTheme('pink');
  const kids = store.d.kids;
  show(`<div class="center" style="margin-top:12px">${mascot('lg')}</div>
    <h1 class="center nk" style="margin-top:6px">מִי מְשַׂחֵק <span class="hl">הַיּוֹם?</span> ${spk('מִי מְשַׂחֵק הַיּוֹם?')}</h1>
    <div class="stories">
      ${kids.map((k, i) => { const t = themeOf(k.theme); return `<button class="story" data-k="${k.id}" style="animation:pop .5s ${i * .08}s both"><div class="ring spin" style="--pg:linear-gradient(135deg,${t.t1},${t.t2});--glow:${t.t1}"><div>${avatarHTML(k)}</div></div>${esc(k.name)}</button>`; }).join('')}
      <button class="story" id="add"><div class="ring add"><div>➕</div></div>ילד חדש</button>
    </div>
    ${kids.length ? '' : `<div class="bubble center">הַי! אֲנִי נִיצוֹץ 👋<br><span style="font-weight:600;font-size:15px">כדי להתחיל, הורה מוסיף את הילד הראשון ב"➕ ילד חדש"</span></div>`}
    <div class="footer-links"><button class="btn ghost small" id="parent">👨‍👧 הורים</button><a class="btn ghost small" href="guide/" style="text-decoration:none">📖 מדריך</a><button class="btn ghost small" id="demo">🧪 ניסיון</button>${isStandalone() ? '' : '<button class="btn small" id="install">📲 התקנה</button>'}</div>`, a => {
    $('#install', a) && ($('#install', a).onclick = install);
    $$('[data-k]', a).forEach(b => b.onclick = () => { sfx.tap(); const k = store.kid(b.dataset.k); kidZoom(k, () => enterKid(k)); });
    $('#add', a).onclick = () => parentGate(() => kidForm(), 'הוספת ילד');
    $('#parent', a).onclick = () => parentGate(parentHome);
    $('#demo', a).onclick = () => parentGate(demoPick, 'לנסות כמו ילד');
  });
}

// לחיצה על הילד: התמונה שלו גדלה לכל המסך לכמה שניות, עם קונפטי וכוכבים, ואז נכנסים
function kidZoom(k, then) {
  const p = kidPhotos(k), t = themeOf(k.theme); let done = false;
  const ov = document.createElement('div'); ov.className = 'kzoom'; ov.style.setProperty('--t1', t.t1); ov.style.setProperty('--t2', t.t2);
  ov.innerHTML = `<div class="kz-rays"></div><div class="kz-pic">${p.length ? `<img src="${p[0]}" alt="">` : `<span>${k.gender === 'f' ? '👧' : '👦'}</span>`}</div><div class="kz-name">${esc(k.name)}</div>${'<i class="kz-star">⭐</i>'.repeat(10)}`;
  document.body.appendChild(ov); confetti(70); sfx.fanfare?.(); voice.say(`שָׁלוֹם!|@name`);
  $$('.kz-star', ov).forEach((s, i) => { s.style.setProperty('--a', (i * 36) + 'deg'); s.style.animationDelay = (i * .05) + 's'; });
  let j = 0; const im = $('.kz-pic img', ov), rot = p.length > 1 ? setInterval(() => { j = (j + 1) % p.length; im.src = p[j]; }, 900) : null;
  const go = () => { if (done) return; done = true; clearInterval(rot); ov.classList.add('out'); setTimeout(() => ov.remove(), 400); then(); };
  ov.onclick = go; setTimeout(go, 2600);
}

function enterKid(kid) {
  CUR = kid; applyTheme(kid.theme);
  if (limitLeft(kid) <= 0) return timeUp();
  clock.start(); home(true);
}

function home(greet) {
  const kid = CUR, s = store.st(kid.id);
  const lvl = Math.floor(s.stars / 60) + 1, inLvl = s.stars % 60;
  const hi = `שָׁלוֹם ${kid.name}! ${G('מוּכָן לְשַׂחֵק?', 'מוּכָנָה לְשַׂחֵק?')}`, hiSay = `שָׁלוֹם!|@name|${G('מוּכָן לְשַׂחֵק?', 'מוּכָנָה לְשַׂחֵק?')}`;
  const left = limitLeft(kid);
  const tiles = (+kid.age && +kid.age < 6)
    ? LITTLE_MENU.map(m => ({ e: m.e, n: m.n, bg: m.bg, go: m.id, soon: m.soon }))
    : [...['think', 'art', 'focus', 'calm', 'baby'].map(k => ({ e: FUN[k].e, n: FUN[k].n, bg: FUN[k].bg, go: 'f:' + k })),
      { e: '🧮', n: 'חשבון', bg: 'var(--g4)', go: 'math' }, { e: '🌱', n: 'טבע', bg: 'var(--g3)', go: 'nature' }, { e: '📜', n: 'תורה', bg: 'var(--g2)', soon: 1 }, { e: '📖', n: 'קריאה', bg: 'var(--g1)', soon: 1 }];
  show(`<div class="topbar" style="margin-bottom:8px">${backBtn()}<div class="title"></div><span style="width:46px"></span></div><div class="hello"><div class="avatar"><div>${avatarHTML(kid)}</div></div>
      <div class="grow"><h2 style="margin:0">שלום ${esc(kid.name)}!</h2><div class="mute small">רמה ${lvl} · עוד ${60 - inLvl} כוכבים לרמה הבאה</div><div class="xp"><i style="width:${inLvl / 60 * 100}%"></i></div></div>
      <span class="starpill">⭐ ${s.stars}</span></div>
    <div class="row" style="align-items:flex-end;margin-top:16px">${mascot('sm')}<div class="bubble grow">${hi} ${spk(hiSay)}</div></div>
    <button class="knews ${kidHasNews(kid) ? 'has' : ''}" id="knews">✨ מה חדש?</button>
    <div class="tiles">${tiles.map((t, i) => `<button class="tile ${t.soon ? 'soon' : ''}" ${t.go && !t.soon ? `data-go="${t.go}"` : 'data-soon'} style="background:${t.bg};animation-delay:${i * .08}s">${t.soon ? '<span class="badge">בקרוב</span>' : ''}<em>${t.e}</em>${t.n}</button>`).join('')}</div>
    ${left !== Infinity ? `<p class="timeleft">⏳ נשארו להיום ${Math.max(0, Math.round(left))} דקות</p>` : ''}
    <div class="footer-links"><button class="btn ghost small" id="switch">🔄 החלפת ילד</button></div>`, a => {
    if (greet) setTimeout(() => voice.say(hiSay), 350);
    $$('[data-go]', a).forEach(b => b.onclick = () => { sfx.tap(); const go = b.dataset.go; go.startsWith('f:') ? funHub(go.slice(2)) : go === 'math' ? mathHub() : go === 'nature' ? natureHub() : startGame(go); });
    $$('[data-soon]', a).forEach(b => b.onclick = () => { sfx.tap(); toast('🚧 בקרוב! ניצוץ עובד על זה'); voice.say('בְּקָרוֹב! נִיצוֹץ עוֹבֵד עַל זֶה'); });
    $('#knews', a).onclick = () => { sfx.tap(); openKidNews(); };
    $('#switch', a).onclick = profiles; $('#back', a).onclick = profiles;
  });
}

function timeUp() {
  const kid = CUR; clock.stop();
  const t = G('שִׂחַקְתָּ מְצֻיָּן הַיּוֹם! נִתְרָאֶה מָחָר 👋', 'שִׂחַקְתְּ מְצֻיָּן הַיּוֹם! נִתְרָאֶה מָחָר 👋');
  show(`<div class="topbar">${backBtn()}<div class="title"></div><span style="width:46px"></span></div><div class="result" style="margin-top:10px">${mascot('lg')}<h1 style="margin-top:10px">⏳ הזמן להיום נגמר</h1>
    <div class="bubble" style="margin:16px 0;text-align:center">${t}</div>
    <div class="stack"><button class="btn full" id="ok">👋 להתראות</button><button class="btn ghost full" id="more">👨‍👧 הורה: עוד 10 דקות</button></div></div>`, a => {
    setTimeout(() => voice.say(t), 300);
    $('#ok', a).onclick = profiles; $('#back', a).onclick = profiles;
    $('#more', a).onclick = () => parentGate(() => { kid.bonus = { [today()]: (kid.bonus?.[today()] || 0) + 10 }; store.save(); toast('➕ עוד 10 דקות'); enterKid(kid); }, 'עוד זמן משחק');
  });
}

// ---------- התקנה כאפליקציה ----------
let installEvt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; });
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
function install() {
  if (installEvt) { installEvt.prompt(); installEvt.userChoice.then(r => { if (r.outcome === 'accepted') toast('🎉 מותקן! תמצאו את ניצוץ במסך הבית'); installEvt = null; }); return; }
  const ios = /iPhone|iPad/.test(navigator.userAgent);
  openSheet(`<h2>📲 התקנה על הטלפון</h2>${ios
    ? '<p style="font-size:17px;line-height:1.9">1. פותחים את הדף ב<b>ספארי</b>.<br>2. לוחצים על כפתור השיתוף <b>⬆️</b> למטה.<br>3. בוחרים <b>"הוספה למסך הבית"</b>.</p>'
    : '<p style="font-size:17px;line-height:1.9">1. פותחים את <b>כרום</b> ומקלידים למעלה:<br><b dir="ltr">lomdimbekef.github.io</b><br>2. לוחצים <b>⋮</b> (שלוש נקודות למעלה).<br>3. בוחרים <b>"התקנת אפליקציה"</b> או <b>"הוספה למסך הבית"</b>.</p>'}
    <button class="btn full" style="margin-top:14px" id="ok">הבנתי</button>`, s => { $('#ok', s).onclick = closeSheet; });
}

// ---------- הפעלה ----------
wrapForNotes();
BDIKA ? bdikaStart() : authStart(profiles);
if (!BDIKA && 'serviceWorker' in navigator && location.protocol === 'https:') { // בעמדת הבדיקה: בלי מצב לא־מקוון
  // כשמגיעה גרסה חדשה, טוענים אותה מיד (בלי לבקש לפתוח פעמיים)
  const had = !!navigator.serviceWorker.controller; let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (had && !reloaded) { reloaded = true; location.reload(); } });
  navigator.serviceWorker.register('sw.js').catch(() => { });
}
