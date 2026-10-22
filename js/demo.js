// לומדים בכיף — 🎭 מצב הדגמה: משפחה מדומה, 🧭 סיור מודרך בכל המסכים, ו־💬 הערות לשליחה ביחד
// הנתונים האמיתיים לא נוגעים: בזמן ההדגמה עובדים על עותק בזיכרון, ושום דבר לא נשמר
'use strict';
const SHOW = { on: false, real: null };
const _save = store.save;
store.save = function () { if (SHOW.on) return; _save.call(this); };

// ---------- משפחה מדומה עם היסטוריה של כמה שבועות ----------
function fakeFamily() {
  const noa = { id: 'f-noa', name: 'נועה', age: '8', gender: 'f', cls: 'ב׳', theme: 'purple', photo: '', math: { ops: ['+', '-'], max: 20, speed: 'auto' }, limit: 40 };
  const itai = { id: 'f-itai', name: 'איתי', age: '3', gender: 'm', cls: 'גן', theme: 'green', photo: '', math: { ...DEF_MATH }, limit: 10 };
  const day = 864e5, now = Date.now(), dk = t => new Date(t).toISOString().slice(0, 10);
  const blank = () => ({ stars: 0, events: [], days: {}, ops: {}, games: {}, level: {} });
  const sN = blank(), sI = blank();
  const MG = ['balloons', 'swipe', 'race', 'test', 'pairs', 'catch', 'shop', 'islands'], NG = ['nfact', 'nriddle', 'nsort', 'norder'];
  for (let d = 13; d >= 0; d--) {
    const hour = [8, 16, 17, 19][d % 4], start = now - d * day - (new Date().getHours() - hour) * 36e5, n = d % 3 === 0 ? 20 : 11;
    for (let j = 0; j < n; j++) {
      const nat = j % 5 === 4, op = nat ? null : j % 3 === 0 ? '-' : '+', g = nat ? NG[j % 4] : MG[(d + j) % 8];
      let acc = nat ? .75 : op === '-' ? .62 : .9; if (j >= 12) acc -= .25; if (hour >= 19) acc -= .12;
      const ok = Math.random() < acc ? 1 : 0, t = Math.min(now - 6e4, start + j * 25e3), ms = 2500 + R(6000);
      sN.events.push({ t, g, op: op || g, ok, ms });
      const gm = sN.games[g] ||= { n: 0, c: 0, rounds: 0, ms: 0 }; gm.n++; gm.c += ok; gm.ms += ms;
      if (op) { const o = sN.ops[op] ||= { n: 0, c: 0, recent: [] }; o.n++; o.c += ok; o.recent.push(ok); if (o.recent.length > 10) o.recent.shift(); }
      if (ok) sN.stars++;
    }
    sN.days[dk(start)] = (sN.days[dk(start)] || 0) + n * 40;
    const lg = ['colors', 'homes', 'jobs', 'count', 'memory', 'needs'];
    for (let j = 0; j < 9; j++) {
      const g = lg[(d + j) % lg.length], ok = Math.random() < .85 ? 1 : 0, ms = 3000 + R(5000), t = now - d * day - 3 * 36e5 + j * 2e4;
      sI.events.push({ t, g, op: g, ok, ms }); const gm = sI.games[g] ||= { n: 0, c: 0, rounds: 0, ms: 0 }; gm.n++; gm.c += ok; gm.ms += ms; if (ok) sI.stars++;
    }
    sI.days[dk(now - d * day)] = 300;
  }
  Object.values(sN.games).forEach(g => g.rounds = 1 + Math.floor(g.n / 8)); Object.values(sI.games).forEach(g => g.rounds = 1 + Math.floor(g.n / 8));
  sN.days[today()] = 12 * 60; sI.days[today()] = 3 * 60; sN.level = { '+': 3, '-': 2 }; sN.stars += 120; sI.stars += 60;
  sN.nat = { fact: { p: 8, miss: [1, 2] }, riddle: { p: 6, miss: [9] }, sort: { p: 8, miss: [SORT_LIST.findIndex(x => x[0] === 'whale')] }, order: { p: 5, miss: [0] } };
  return { kids: [noa, itai], stats: { [noa.id]: sN, [itai.id]: sI }, v: 1 };
}
const noa = () => store.d.kids.find(k => k.id === 'f-noa') || store.d.kids[0];
const itai = () => store.d.kids.find(k => k.id === 'f-itai') || store.d.kids[1];
const as = k => { CUR = k; applyTheme(k.theme); };

function showcaseStart() {
  if (!SHOW.on) { SHOW.real = store.d; SHOW.on = true; store.d = fakeFamily(); }
  document.body.classList.add('showcase'); showcaseBar(); notesFab();
  profiles();
  openSheet(`<h2>🎭 מצב הדגמה</h2><p style="line-height:1.8">זו משפחה מדומה: <b>נועה</b> (8) ו<b>איתי</b> (3.5), עם נתונים של כמה שבועות. אפשר ללחוץ על הכל. <b>שום דבר לא נשמר</b>, והילדים האמיתיים לא משתנים.</p>
    <p class="mute small" style="margin-top:8px">ראית משהו לתקן? לוחצים על 💬 ורושמים. בסוף שולחים את כל ההערות ביחד.</p>
    <div class="stack" style="margin-top:16px"><button class="btn full" id="go">🧭 להתחיל סיור מודרך</button><button class="btn ghost full" id="alone">להסתובב לבד</button></div>`, s => {
    $('#go', s).onclick = () => { closeSheet(); tour.start(0); }; $('#alone', s).onclick = closeSheet;
  });
}
function showcaseEnd() {
  tour.stop(); if (SHOW.on) { store.d = SHOW.real; SHOW.real = null; SHOW.on = false; }
  document.body.classList.remove('showcase'); $('#showBar')?.remove();
  CUR = null; profiles(); toast('👋 יצאת ממצב הדגמה');
}
function showcaseBar() {
  if ($('#showBar')) return;
  document.body.insertAdjacentHTML('beforeend', `<div id="showBar"><span>🎭 מצב הדגמה · הנתונים לא אמיתיים</span><button id="sbTour">🧭 סיור</button><button class="rv-badge" id="sbRv" hidden></button><button id="sbExit">יציאה</button></div>`);
  $('#sbTour').onclick = () => tour.on && !tour.steps ? tour.list() : (tour.stop(), tour.start(0)); $('#sbExit').onclick = showcaseEnd;
  $('#sbRv').onclick = reviewStart; reviewBadge();
}

// ---------- 🧭 הסיור: כל הצעדים במערך אחד. כל פיצ'ר חדש מוסיף כאן צעד ----------
const mStep = (id, sel, d) => { const g = MATH_GAMES.find(x => x.id === id); return { e: g.ic, t: g.n, d, sel, go: () => { as(noa()); startGame(id); } }; };
const nStep = (id, sel, d) => { const g = NATURE_GAMES.find(x => x.id === id); return { e: g.ic, t: 'טבע: ' + g.n, d, sel, go: () => { as(noa()); startGame(id); } }; };
const fStep = (id, sel, d) => { const g = FUN_GAME[id].g; return { e: g.ic, t: FUN[FUN_GAME[id].sid].n + ': ' + g.n.replace('מרגיש/ה', 'מרגישה'), d, sel, go: () => { as(noa()); roundStart(); CUR_GAME = id; g.run(); } }; };
const hStep = (sid, d) => ({ e: FUN[sid].e, t: FUN[sid].n, d, sel: '.games', go: () => { as(noa()); funHub(sid); } });
const lStep = (id, sel, d) => { const m = LITTLE_MENU.find(x => x.id === id); return { e: m.e, t: 'איתי: ' + m.n, d, sel, go: () => { as(itai()); startGame(id); } }; };
const TOUR = [
  { e: '👋', t: 'מי משחק היום?', d: 'כל ילד בוחר את עצמו. כאן יש משפחה מדומה: נועה (8) ואיתי (3.5). בכל מסך יש כפתור חזרה, וגם "אחורה" של הטלפון חוזר שלב אחד.', go: () => profiles(), sel: '.stories' },
  { e: '➕', t: 'הוספת ילד', d: 'ההורה מוסיף ילד: שם, תמונה, גיל, מין וצבעים. קודם צריך לפתור תרגיל, כדי שהילדים לא ייכנסו בטעות.', go: () => profiles(), sel: '#add' },
  { e: '👨‍👧', t: 'האזור של ההורה', d: 'הילדים, ההגדרות, המדריך האישי, בדיקת המכשיר ושליחת משוב.', go: () => parentHome(), sel: '.plist' },
  { e: '🔐', t: 'החשבון וקוד ההורה', d: 'ההורה נרשם פעם אחת עם מייל וסיסמה, אותו חשבון כמו בכסף בכיף ובזמן בכיף. לאזור ההורה נכנסים עם קוד של 4 ספרות או טביעת אצבע, במקום תרגיל. הילדים נשארים רק בטלפון.', go: () => parentHome(), sel: '#accBtn' },
  { e: '↩️', t: 'שחזור הגדרות ההתחלה', d: 'בתחתית אזור ההורה: מחזיר את כל ההגדרות להתחלה (תרגילים, רמות, מהירות, קריין, זמן מסך), עם אישור כפול. הילדים, התמונות, הכוכבים וההתקדמות נשארים.', go: () => parentHome(), sel: '#resetBtn' },
  { e: '✏️', t: 'הפרופיל של הילד', d: 'לוחצים על ילד באזור ההורה ונפתח הדף שלו: עד 5 תמונות שמתחלפות כל 2 שניות, שם, גיל, כיתה, בן או בת, וצבע אהוב. כשהילד לוחץ על העיגול שלו, התמונה גדלה לכל המסך עם כוכבים וקונפטי.', go: () => kidForm(noa()), sel: '.screen' },
  { e: '⚙️', t: 'הגדרות של ילד', d: 'באותו דף, למטה: אילו תרגילים, עד איזה מספר (עם + ו־−), רמה בכל משחק, מהירות הבלונים, הקריין, וכמה דקות מסך ביום.', go: () => kidSettings(noa()), sel: '.screen' },
  { e: '🧭', t: 'המדריך האישי', d: 'מה מתחבר לילד, מתי הוא הכי מרוכז, מה הכי קשה לו, ודוגמה מהבית שמסבירה את זה. זו לא אבחנה.', go: () => parentGuide(noa()), sel: '.kv' },
  { e: '🌱', t: 'על מה לדבר בטבע', d: 'במה הילד טעה לאחרונה בטבע, ורעיון לשיחה או לטיול.', go: () => parentGuide(noa()), sel: '#natTalk' },
  { e: '🎤', t: 'בדיקת קריין', d: 'בודקים שהקריין והמיקרופון עובדים בטלפון הזה, ושולחים את התוצאה.', go: () => deviceTest(), sel: '.screen' },
  { e: '🧪', t: 'לנסות כמו ילד', d: 'ההורה משחק כמו ילד בלי לשמור כלום. מצב ההדגמה נמצא ממש מתחת.', go: () => parentHome(), sel: '#demoBtn' },
  { e: '✨', t: 'מה חדש', d: 'אחרי כל עדכון, בפתיחת האפליקציה, קופץ פעם אחת חלון קצר עם מה שהשתנה, עם "🔊 ניצוץ מספר" לילדים. הוא לא קופץ כשילד באמצע משחק. כל ההיסטוריה בכפתור הזה.', go: () => parentHome(), sel: '#newsBtn' },
  { e: '🏠', t: 'המסך של נועה', d: 'קודם משחקי כיף: חשיבה, יצירה, זיכרון ורגשות. אחריהם חשבון וטבע, ותורה וקריאה בדרך.', go: () => { as(noa()); home(); }, sel: '.tiles' },
  { e: '✨', t: 'מה חדש לילדים', d: 'כשיש משהו חדש, הכפתור מנצנץ עם נקודה אדומה. בפנים רק מה שמתאים לגיל של הילד, ניצוץ מקריא, ו"👀 תראו לי" לוקח ישר למשחק. החלון לא קופץ לבד, כדי לא לקטוע משחק.', go: () => { as(noa()); home(); }, sel: '#knews' },
  { e: '🎓', t: 'איך משחקים?', d: 'בפעם הראשונה בכל משחק מופיע הסבר קצר: אצבע מראה על מה לוחצים, וניצוץ מקריא. אפשר לדלג. ב"מצאו את ההבדלים" יש גם סיבוב ניסיון קטן.', go: () => { as(noa()); howto('train', () => funHub('think')); }, sel: '.ht-stage' },
  hStep('think', 'משחקי חשיבה בלי ציונים: מאמנים ריכוז והתמדה.'),
  fStep('puzzle', '#pf', 'במסגרת יש צל של התמונה. בוחרים חלק למטה, ונוגעים במקום שלו. מתחילים מ־4 חלקים ומגיעים ל־9.'),
  fStep('diff', '.dboards', 'שני לוחות, ומחפשים מה שונה בשני.'),
  fStep('train', '#train', 'הקרונות הולכים לפי דפוס, למשל 🔴🔵🔴🔵. בוחרים מה הקרון הבא, והרכבת נוסעת. הדפוסים נהיים מסובכים יותר.'),
  fStep('sudoku', '#sdk', 'סודוקו 4 על 4 עם חיות: כל חיה פעם אחת בכל שורה, טור וריבוע.'),
  hStep('focus', 'משחקים קצרים שמאמנים קשב, ומרגישים כמו משחק.'),
  fStep('simon', '.simon', 'ניצוץ מנגן רצף של צבעים וצלילים, וחוזרים עליו. הרצף גדל.'),
  fStep('cups', '#cups', 'הכדור מתחבא מתחת לכוס, הכוסות מתערבבות, ועוקבים בעיניים.'),
  fStep('changed', '#chg', 'מסתכלים על התמונות, הן מתכסות, ואחת מתחלפת. מה השתנה?'),
  hStep('calm', 'מילים לרגשות ודרך להירגע. במיוחד לימים של לחץ.'),
  fStep('mood', '.moods', 'הילד בוחר איך הוא מרגיש היום. ההורה רואה את זה במדריך האישי.'),
  fStep('breath', '.breath', 'הבועה גדלה בשאיפה וקטנה בנשיפה. 5 נשימות איטיות עם ניצוץ.'),
  fStep('feel', '.feels', 'סיפור קצר ובוחרים רגש. אחרי זה יש טיפ קטן מה עושים עם הרגש.'),
  fStep('kind', '.tale', 'מה כדאי לעשות עם חברים ובבית. מסבירים למה, בלי לנזוף.'),
  hStep('art', 'יצירה בלי נכון ולא נכון.'),
  fStep('color', '#cp', 'בוחרים צבע ונוגעים באזור. הצביעה נשמרת, וממשיכים מתי שרוצים.'),
  fStep('mandala', '#md', 'מה שמציירים בצד אחד מופיע מכל הצדדים.'),
  fStep('gallery', '.screen', 'הציורים שנשמרו. הם נשמרים רק בטלפון.'),
  hStep('baby', 'כל המשחקים של הקטנים, גם לגדולים. הכוכבים נשמרים אצל הגדול, וההתקדמות של הקטן לא משתנה.'),
  { e: '🧮', t: 'חשבון: 8 משחקים', d: 'כל משחק נמשך 5 דקות. התרגילים מתאימים את עצמם לילד: מה שקשה מופיע יותר, ברמה קלה יותר.', go: () => { as(noa()); mathHub(); }, sel: '.games' },
  mStep('balloons', '#sky', 'מפוצצים את הבלון עם התשובה. ההורה בוחר מהירות, או "אוטומטי".'),
  mStep('swipe', '#deck', 'מחליקים ימינה אם נכון ושמאלה אם לא, כמו בטיקטוק.'),
  mStep('race', '.track', 'כל תשובה נכונה דוחפת את המכונית. ניצוץ נוסע בקצב שמתאים לילד.'),
  mStep('test', '.pad', 'בלי שעון. כותבים לבד את התשובה. 8 מתוך 10 = כתר.'),
  mStep('pairs', '.mem', 'משחק זיכרון: לכל תרגיל (❓) מוצאים את התשובה שלו (⭐).'),
  mStep('catch', '#orch', 'פירות עם מספרים נופלים, ומזיזים את הסל לתשובה הנכונה.'),
  mStep('shop', '.coins', 'משלמים בדיוק במטבעות, ובהמשך גם מחשבים עודף.'),
  mStep('islands', '.seamap', 'בלי שעון. כל תשובה מקדמת את הסירה, ובכל אי מחכה אוצר.'),
  { e: '🎁', t: 'הפתעה', d: 'כל שני סבבים: עובדה, חידה או הפסקת תנועה, מנוקדת ועם קריינות.', go: () => { as(noa()); surprise(mathHub); }, sel: '.surp' },
  { e: '⭐', t: 'סוף סבב', d: 'כוכבים, כמה נכון, ומילה טובה על המאמץ.', go: () => { as(noa()); endRound('balloons', [1, 1, 1, 0, 1, 1, 1, 1].map(Boolean)); }, sel: '.bigstars' },
  { e: '🌱', t: 'טבע: 4 משחקים', d: 'עשרות שאלות בכל משחק, תמונות אמיתיות וטקסט מנוקד. מה שטועים בו חוזר אחרי כמה שאלות.', go: () => { as(noa()); natureHub(); }, sel: '.games' },
  nStep('nfact', '.ndeck', 'משפט עם תמונה. אחרי התשובה מופיע הסבר קצר, ולוחצים "הבא" רק אחרי שקוראים.'),
  nStep('nriddle', '.clues', 'רמז אחרי רמז, ובוחרים את התמונה הנכונה.'),
  nStep('nsort', '.classes', 'יונק, עוף, דג, זוחל, חרק או דו־חי. הכלל כתוב מתחת לכל כפתור.'),
  nStep('norder', '.ocards', 'מסדרים שלבים: זחל, גולם, פרפר. או חיטה, קמח, בצק, לחם.'),
  { e: '⏳', t: 'נגמר הזמן להיום', d: 'כשזמן המסך נגמר, ניצוץ נפרד יפה. ההורה יכול לתת עוד 10 דקות.', go: () => { as(noa()); timeUp(); }, sel: '.stack' },
  { e: '🧸', t: 'העולם של איתי', d: 'לילדים עד גיל 5: בלי קריאה, הכל בקול ובתמונות אמיתיות. כל משחק הוא 5 דקות.', go: () => { as(itai()); home(); }, sel: '.tiles' },
  lStep('colors', '.palette', 'צובעים את התמונה בצבע הנכון, והיא נצבעת בבת אחת.'),
  lStep('homes', '.opts', 'מי גר בכל בית: מלונה, קן, כוורת ועוד.'),
  lStep('needs', '.opts', 'מה צריך? יורד גשם, אז צריך מטרייה.'),
  lStep('jobs', '.opts', 'כבאית, אמבולנס, משטרה ואוטובוס של אגד מופיעים כל יום.'),
  lStep('mothers', '.opts', 'מי התינוק של כל אמא?'),
  lStep('food', '.opts', 'מה כל חיה אוכלת?'),
  lStep('count', '.countbox', 'סופרים יחד, וכל תמונה נדלקת כשניצוץ סופר אותה.'),
  lStep('odd', '.grid4', 'מה לא שייך מתוך ארבע תמונות?'),
  lStep('balloons2', '.lsky', 'מפוצצים רק בלונים בצבע אחד.'),
  lStep('memory', '.mem', 'זוגות עם תמונות אמיתיות.'),
  { e: '🎉', t: 'חגיגה', d: 'כל 5 תשובות ניצוץ רוקד, ויש כוכבים וקונפטי.', go: () => { as(itai()); party(() => home()); }, sel: '.dance' },
  { e: '🔁', t: 'סיור תיקונים', d: 'אחרי שמתקנים הערות שלך, מופיע למעלה כפתור ירוק "🔁 תיקונים". הוא עובר רק על המסכים שתוקנו: ההערה שלך, מה שינינו, ואיך זה היה לפני. מאשרים ✅ או מוסיפים הערה.', go: () => profiles(), sel: '#sbRv' },
  { e: '💬', t: 'זהו! עכשיו ההערות', d: 'ראית משהו לתקן? לוחצים על 💬 בכל שלב. בסוף: "📤 שלח את כל ההערות".', go: () => profiles(), sel: '#tNotes' },
];
const tour = {
  on: false, i: 0, steps: null, // steps = שלבים של סיור התיקונים. בלי זה: TOUR
  get S() { return this.steps || TOUR; },
  start(i) { this.on = true; document.body.classList.add('touring'); this.go(i); },
  stop() { this.on = false; this.steps = null; document.body.classList.remove('touring'); $('#tour')?.remove(); $$('.tour-hl').forEach(x => x.classList.remove('tour-hl')); },
  go(i) {
    this.i = Math.max(0, Math.min(this.S.length - 1, i)); const st = this.S[this.i];
    try { st.go(); } catch (e) { console.warn(e); }
    voice.stop();
    this.card(); setTimeout(() => this.mark(st.sel), 350);
  },
  mark(sel) {
    $$('.tour-hl').forEach(x => x.classList.remove('tour-hl'));
    const el = sel && $(sel); if (!el) return;
    el.classList.add('tour-hl'); el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },
  card() {
    const st = this.S[this.i], n = this.S.length; $('#tour')?.remove();
    if (st.review) return reviewCard(this.i, n);
    document.body.insertAdjacentHTML('beforeend', `<div id="tour"><div class="tprog"><i style="width:${(this.i + 1) / n * 100}%"></i></div>
      <div class="thead"><span>שלב ${this.i + 1} מתוך ${n}</span><button id="tList">☰ כל השלבים</button><button id="tX" aria-label="סגירת הסיור">✕</button></div>
      <div class="tbody"><em>${st.e}</em><div><b>${esc(st.t)}</b><p>${esc(st.d)}</p></div></div>
      <div class="tnav"><button id="tPrev" ${this.i ? '' : 'disabled'}>→ הקודם</button><button id="tNotes">💬 הערה${notes.count() ? ` <i>${notes.count()}</i>` : ''}</button><button id="tNext">${this.i < n - 1 ? 'הבא ←' : 'סיום ✓'}</button></div></div>`);
    $('#tPrev').onclick = () => this.go(this.i - 1);
    $('#tNext').onclick = () => this.i < n - 1 ? this.go(this.i + 1) : (this.stop(), notes.open());
    $('#tList').onclick = () => this.list(); $('#tX').onclick = () => this.stop(); $('#tNotes').onclick = () => notes.open();
  },
  list() {
    openSheet(`<h2>🧭 כל השלבים</h2><div class="menu">${this.S.map((s, i) => `<button class="mitem ${i === this.i ? 'cur' : ''}" data-ti="${i}"><span class="ic" style="background:var(--g${i % 5 + 1})">${s.e}</span><span class="grow">${i + 1}. ${esc(s.t)}</span>‹</button>`).join('')}</div>`, s => {
      $$('[data-ti]', s).forEach(b => b.onclick = () => { closeSheet(); this.on ? this.go(+b.dataset.ti) : this.start(+b.dataset.ti); });
      $('.mitem.cur', s)?.scrollIntoView({ block: 'center' });
    });
  },
};

// ---------- 💬 הערות: נשמרות בטלפון עד שליחה, ונשלחות ביחד ----------
const NOTES_KEY = 'lbk-notes';
const notes = {
  all() { try { return JSON.parse(localStorage.getItem(NOTES_KEY)) || []; } catch { return []; } },
  put(a) { try { localStorage.setItem(NOTES_KEY, JSON.stringify(a)); } catch { } this.badge(); },
  count() { return this.all().length; },
  sent() { try { return JSON.parse(localStorage.getItem(NOTES_KEY + '-sent')) || []; } catch { return []; } },
  archive(a) { if (!a.length) return; try { localStorage.setItem(NOTES_KEY + '-sent', JSON.stringify([...this.sent(), ...a.map(x => ({ ...x, sentAt: Date.now() }))].slice(-300))); } catch { } },
  // מחזיר את כל ההערות שכבר נשלחו לרשימה, כדי לשלוח אותן שוב
  resend() { const back = this.sent().map(({ sentAt, ...x }) => x); try { localStorage.removeItem(NOTES_KEY + '-sent'); } catch { } this.put([...back, ...this.all()]); },
  where() {
    if (tour.on) return tour.steps ? `🔁 סיור תיקונים: ${tour.S[tour.i].t}` : `שלב ${tour.i + 1}: ${TOUR[tour.i].t}`;
    const t = $('#app .title')?.textContent.trim() || $('#app h1, #app h2')?.textContent.trim() || 'מסך';
    return (CUR ? CUR.name + ' · ' : '') + t;
  },
  text() { return this.all().map((x, i) => `${i + 1}. [${x.ctx}] ${x.txt}`).join('\n'); },
  badge() {
    const c = this.count(); const f = $('#notesFab'); if (f) f.innerHTML = `💬${c ? `<i>${c}</i>` : ''}`;
    const t = $('#tNotes'); if (t) t.innerHTML = `💬 הערה${c ? ` <i>${c}</i>` : ''}`;
  },
  open() {
    const ctx = this.where(), list = this.all();
    openSheet(`<h2>💬 מה לתקן או לשפר כאן?</h2><p class="mute small">📍 ${esc(ctx)}</p>
      <label class="field" style="margin-top:8px"><textarea id="nTxt" rows="3" placeholder="למשל: הכפתור קטן מדי, המילה לא ברורה..."></textarea></label>
      <button class="btn full" id="nAdd">➕ להוסיף הערה</button>
      <div id="nList" style="margin-top:14px"></div>`, s => {
      const draw = () => {
        const a = this.all();
        $('#nList', s).innerHTML = a.length ? `<h3 style="margin-bottom:6px">📝 ${a.length} הערות</h3><div class="nlist">${a.map((x, i) => `<div class="nrow"><div class="grow"><small>${esc(x.ctx)}</small><div>${esc(x.txt)}</div></div><button data-del="${i}" aria-label="מחיקה">✕</button></div>`).join('')}</div>
          <div class="row" style="gap:10px;margin-top:12px"><button class="btn grow" id="nSend">📤 שלח את כל ההערות</button><button class="btn ghost" id="nCopy">📋 העתק</button></div><div class="err" id="nErr"></div>` : '<p class="mute small center">עוד אין הערות.</p>';
        const old = this.sent().length;
        if (old) $('#nList', s).insertAdjacentHTML('beforeend', `<button class="btn ghost full small" id="nAgain" style="margin-top:12px">🔁 שליחה מחדש של ${old} הערות שכבר נשלחו</button>`);
        $('#nAgain', s) && ($('#nAgain', s).onclick = () => { this.resend(); draw(); toast('🔁 ההערות חזרו לרשימה. עכשיו לוחצים "📤 שלח"'); });
        $$('[data-del]', s).forEach(b => b.onclick = () => { const x = this.all(); x.splice(+b.dataset.del, 1); this.put(x); draw(); });
        $('#nSend', s) && ($('#nSend', s).onclick = e => this.send(e.target, s, draw));
        $('#nCopy', s) && ($('#nCopy', s).onclick = () => this.copy());
      };
      $('#nAdd', s).onclick = () => {
        const txt = $('#nTxt', s).value.trim(); if (txt.length < 2) return $('#nTxt', s).focus();
        this.put([...this.all(), { at: Date.now(), ctx, txt }]); $('#nTxt', s).value = ''; sfx.tap(); toast('📝 ההערה נשמרה'); draw();
      };
      draw(); setTimeout(() => $('#nTxt', s).focus(), 350);
    });
  },
  async send(btn, s, draw) {
    const body = this.text(); btn.disabled = true; btn.textContent = 'שולח...'; let ok = false;
    const db = saveFeedbackDb('tour-notes', `הערות מצב הדגמה (${this.count()})\n` + body);
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${FEEDBACK_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ _subject: `🎭 הערות מצב הדגמה — לומדים בכיף (${this.count()})`, _template: 'table', _captcha: 'false', 'סוג': 'הערות מצב הדגמה', 'הערות': body,
          'מכשיר': `${navigator.userAgent.match(/iPhone|iPad|Android[^;)]*|Mac|Windows/)?.[0] || '?'} · ${screen.width}×${screen.height}` }) });
      ok = await mailOk(r);
    } catch { }
    ok = (await db) || ok;
    // גם אחרי שליחה מוצלחת ההערות נשמרות בטלפון, כדי שאפשר יהיה לשלוח מחדש
    if (ok) { this.archive(this.all()); this.put([]); closeSheet(); confetti(); toast('📤 כל ההערות נשלחו. תודה!'); return; }
    btn.disabled = false; btn.textContent = '📤 שלח את כל ההערות'; failNote('feedback', 'tour-notes: mail+db failed');
    $('#nErr', s).innerHTML = `לא הצלחתי לשלוח (אין אינטרנט?). אפשר ללחוץ "📋 העתק", או <a href="mailto:${FEEDBACK_TO}?subject=${encodeURIComponent('הערות מצב הדגמה — לומדים בכיף')}&body=${encodeURIComponent(body)}" style="color:#F9A8D4">לשלוח במייל רגיל</a>`;
  },
  async copy() {
    const t = 'הערות מצב הדגמה — לומדים בכיף\n' + this.text();
    try { await navigator.clipboard.writeText(t); }
    catch { const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch { } a.remove(); }
    toast('📋 ההערות הועתקו. אפשר להדביק בצ׳אט');
  },
};
function notesFab() {
  if ($('#notesFab')) return;
  document.body.insertAdjacentHTML('beforeend', '<button id="notesFab" aria-label="הערות"></button>');
  $('#notesFab').onclick = () => notes.open(); notes.badge();
}
// 💬 מופיע רק למבוגרים: באזור ההורה, במצב ניסיון (🧪) ובמצב הדגמה (🎭). כשילד אמיתי משחק, הוא לא מופיע
let inParent = false;
// נקרא מ־app.js לפני הפתיחה, כשכל המסכים כבר מוגדרים
function wrapForNotes() {
  ['parentHome', 'kidForm', 'kidSettings', 'parentGuide', 'deviceTest'].forEach(n => {
    const f = window[n]; window[n] = function (...a) { inParent = true; return f.apply(this, a); };
  });
  ['profiles', 'enterKid', 'home'].forEach(n => {
    const f = window[n]; window[n] = function (...a) { inParent = false; return f.apply(this, a); };
  });
}
function afterShow() {
  const want = SHOW.on || inParent || !!(CUR && CUR.demo);
  if (want) notesFab(); else $('#notesFab')?.remove();
  if (typeof newsFabSync === 'function') newsFabSync();
}
