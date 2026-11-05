// לומדים בכיף — משחקים שהם לא "לימודים" לגדולים: 🧩 חשיבה, 🧠 זיכרון וקשב, 💛 רגשות ורוגע, 🎨 יצירה, 🧸 משחקי הקטנים
// המטרה: שהילד ירגיש שהוא מצליח ונהנה. אין ציונים, וטעות היא רק עוד ניסיון
'use strict';
const isBig = () => !!CUR && +CUR.age >= 6;
const T = (m, f) => G(m, f);   // לשון זכר או נקבה לפי הילד
const say = t => voice.say(t);

// ---------- הקטגוריות והמשחקים ----------
const FUN = {
  think: { e: '🧩', n: 'חשיבה', bg: 'var(--g2)', hi: ['אֵיזֶה אֶתְגָּר בָּא לְךָ?', 'אֵיזֶה אֶתְגָּר בָּא לָךְ?'], games: [
    { id: 'puzzle', n: 'פאזל תמונה', ic: '🧩', bg: 'var(--g2)', d: 'שמים כל חלק במקום שלו', run: () => fPuzzle() },
    { id: 'diff', n: 'מצאו את ההבדלים', ic: '🔍', bg: 'var(--g1)', d: 'מה שונה בין הלוחות?', run: () => fDiff() },
    { id: 'train', n: 'רכבת הדפוסים', ic: '🚂', bg: 'var(--g3)', d: 'מה הקרון הבא?', run: () => fTrain() },
    { id: 'sudoku', n: 'סודוקו של חיות', ic: '🐶', bg: 'var(--g4)', d: 'כל חיה פעם אחת בשורה', run: () => fSudoku() },
  ] },
  focus: { e: '🧠', n: 'זיכרון וקשב', bg: 'var(--g5)', hi: ['בּוֹא נְאַמֵּן אֶת הַזִּכָּרוֹן!', 'בּוֹאִי נְאַמֵּן אֶת הַזִּכָּרוֹן!'], games: [
    { id: 'simon', n: 'סיימון', ic: '🔴', bg: 'var(--g1)', d: 'חוזרים על הצבעים והצלילים', run: () => fSimon() },
    { id: 'cups', n: 'איפה הכדור?', ic: '🥤', bg: 'var(--g3)', d: 'עוקבים אחרי הכוס', run: () => fCups() },
    { id: 'changed', n: 'מה השתנה?', ic: '👀', bg: 'var(--g2)', d: 'זוכרים את התמונות', run: () => fChanged() },
  ] },
  calm: { e: '💛', n: 'רגשות ורוגע', bg: 'var(--g3)', hi: ['אֵיךְ אַתָּה מַרְגִּישׁ הַיּוֹם?', 'אֵיךְ אַתְּ מַרְגִּישָׁה הַיּוֹם?'], games: [
    { id: 'mood', n: 'איך אני מרגיש/ה?', ic: '🌈', bg: 'var(--g4)', d: 'בוחרים פרצוף להיום', run: () => fMood() },
    { id: 'breath', n: 'בועת נשימה', ic: '🫧', bg: 'var(--g2)', d: 'נושמים יחד עם ניצוץ', run: () => fBreath() },
    { id: 'feel', n: 'איך הוא מרגיש?', ic: '😊', bg: 'var(--g1)', d: 'מה מרגישים בכל מצב', run: () => fFeel() },
    { id: 'kind', n: 'מה כדאי לעשות?', ic: '🤝', bg: 'var(--g5)', d: 'סיפורים קטנים על חברים', run: () => fKind() },
  ] },
  art: { e: '🎨', n: 'יצירה', bg: 'var(--g1)', hi: ['מָה נִצְבַּע הַיּוֹם?', 'מָה נִצְבַּע הַיּוֹם?'], games: [
    { id: 'color', n: 'דפי צביעה', ic: '🖍️', bg: 'var(--g1)', d: 'נוגעים וצובעים', run: () => fColor() },
    { id: 'mandala', n: 'מנדלה קסומה', ic: '🌸', bg: 'var(--g5)', d: 'מציירים, וזה מופיע מכל הצדדים', run: () => fMandala() },
    { id: 'gallery', n: 'הגלריה שלי', ic: '🖼️', bg: 'var(--g2)', d: 'כל מה שציירתי', run: () => fGallery() },
  ] },
  baby: { e: '🧸', n: 'משחקי הקטנים', bg: 'var(--g4)', hi: ['בְּמָה בָּא לְךָ לְשַׂחֵק?', 'בְּמָה בָּא לָךְ לְשַׂחֵק?'], games: [] },
};
FUN.baby.games = LITTLE_MENU.filter(m => !m.soon).map(m => ({ id: m.id, n: m.n, ic: m.e, bg: m.bg, d: '', run: () => startLittle(m.id) }));
const FUN_GAME = {};
Object.entries(FUN).forEach(([sid, s]) => sid !== 'baby' && s.games.forEach(g => FUN_GAME[g.id] = { sid, g }));

function funHub(sid) {
  const S = FUN[sid], st = store.st(CUR.id), hi = T(...S.hi);
  show(`<div class="topbar">${backBtn()}<div class="title">${S.e} ${S.n}</div><span class="starpill">⭐ ${st.stars}</span></div>
    <div class="row" style="align-items:flex-end;margin-bottom:12px">${mascot('sm')}<div class="bubble grow nk">${hi}</div></div>
    <div class="games">${S.games.map((g, i) => `<button class="game" data-g="${g.id}" style="background:${g.bg};animation-delay:${i * .06}s"><span class="ic a-zoom">${g.ic}</span><b>${g.n.replace('מרגיש/ה', T('מרגיש', 'מרגישה'))}</b>${g.d ? `<small>${g.d}</small>` : ''}</button>`).join('')}</div>`, a => {
    $('#back', a).onclick = () => home(); say(hi);
    $$('[data-g]', a).forEach(b => b.onclick = () => { sfx.tap(); const g = S.games.find(x => x.id === b.dataset.g); if (limitLeft(CUR) <= 0) return timeUp(); startGame(g.id); });
  });
}
const funTop = (id, res) => {
  const t = `${FUN_GAME[id].g.ic} ${FUN_GAME[id].g.n}`.replace('מרגיש/ה', T('מרגיש', 'מרגישה'));
  return res ? gameTop(t, res) : `<div class="topbar">${backBtn().replace('id="back"', 'id="quit"')}<div class="title">${t}</div><span class="starpill">⭐ ${CUR ? store.st(CUR.id).stars : 0}</span></div>`;
};
const back = id => () => funHub(FUN_GAME[id].sid);
const funRec = (id, ok, t0) => recLittle(id, ok, performance.now() - t0);
// 📈 רמה לכל משחק (1 עד 5): מתחילה לפי הגיל, עולה אחרי סבב טוב ויורדת אחרי סבב קשה. ההורה יכול לשנות בדף של הילד
const LVL_GAMES = ['puzzle', 'diff', 'train', 'simon', 'cups', 'changed'];
const ageLevel = k => { const a = +k.age || 8; return a < 7 ? 1 : a < 10 ? 2 : 3; };
function gameLevel(k, id) { const s = store.st(k.id); return (s.lvl && s.lvl[id]) || ageLevel(k); }
function setGameLevel(k, id, v) { const s = store.st(k.id); (s.lvl ||= {})[id] = Math.max(1, Math.min(5, v)); store.save(); }
const lvB = id => CUR ? gameLevel(CUR, id) - 1 : 0;   // כמה "צעדים" מתחילים קדימה
// בסוף סבב: מעדכנים את הרמה. מחזיר +1 / -1 / 0
function levelAfterRound(id, res) {
  if (!CUR || !LVL_GAMES.includes(id) || res.length < 4) return 0;
  const r = res.filter(Boolean).length / res.length, cur = gameLevel(CUR, id);
  const d = r >= .85 && cur < 5 ? 1 : r <= .5 && cur > 1 ? -1 : 0;
  if (d) setGameLevel(CUR, id, cur + d); return d;
}
const PHOTO_KEYS = () => Object.keys(IMG).filter(k => !['night', 'sky', 'sea', 'snow', 'ice', 'desert', 'cloud', 'stars', 'grass', 'seeds', 'flour', 'dough', 'bone', 'cheese'].includes(k));

// ================= 🧩 חשיבה =================
// ---------- פאזל תמונה: מסגרת עם צל של התמונה, ולמטה חלקים. נוגעים בחלק ואז במקום שלו ----------
function fPuzzle(res = []) {
  if (res.length && roundOver()) return endRound('puzzle', res);
  const ok = res.filter(Boolean).length + lvB('puzzle') * 2, [cols, rows] = ok < 2 ? [2, 2] : ok < 4 ? [3, 2] : [3, 3], N = cols * rows;
  const pool = PHOTO_KEYS().filter(x => NAT_N[x]), k = pick(pool.length ? pool : PHOTO_KEYS()), src = img(k), t0 = performance.now(); let sel = null, miss = 0, placed = 0; // תמונות ברורות של חיות
  const pos = v => `${cols > 1 ? (v % cols) / (cols - 1) * 100 : 0}% ${rows > 1 ? Math.floor(v / cols) / (rows - 1) * 100 : 0}%`;
  const piece = v => `background-image:url('${src}');background-size:${cols * 100}% ${rows * 100}%;background-position:${pos(v)}`;
  show(`${funTop('puzzle', res)}
    <div class="lq nk" style="font-size:19px"><span id="pzmsg">${strip(T('בְּחַר חֵלֶק, וְשִׂים אוֹתוֹ בַּמָּקוֹם שֶׁלּוֹ', 'בַּחֲרִי חֵלֶק, וְשִׂימִי אוֹתוֹ בַּמָּקוֹם שֶׁלּוֹ'))}</span></div>
    <div class="pf" id="pf" style="grid-template-columns:repeat(${cols},1fr);aspect-ratio:${cols}/${rows}"><i class="pfg" style="background-image:url('${src}')"></i>${[...Array(N).keys()].map(i => `<button class="pfs" data-s="${i}"></button>`).join('')}</div>
    <div class="ptray" id="ptray">${shuffle([...Array(N).keys()]).map(v => `<button class="pp" data-v="${v}" style="${piece(v)};aspect-ratio:${rows === cols ? 1 : 1}"></button>`).join('')}</div>`, a => {
    $('#quit', a).onclick = back('puzzle'); let alive = true; onLeave(() => { alive = false; });
    say(T('בְּחַר חֵלֶק, וְשִׂים אוֹתוֹ בַּמָּקוֹם שֶׁלּוֹ!', 'בַּחֲרִי חֵלֶק, וְשִׂימִי אוֹתוֹ בַּמָּקוֹם שֶׁלּוֹ!'));
    $$('.pp', a).forEach(b => b.onclick = () => { sfx.tap(); $$('.pp', a).forEach(x => x.classList.toggle('sel', x === b && sel !== b)); sel = sel === b ? null : b; });
    $$('.pfs', a).forEach(slot => slot.onclick = () => {
      if (!sel || slot.classList.contains('full')) return;
      const v = +sel.dataset.v, i = +slot.dataset.s;
      if (v !== i) { miss++; sfx.bad(); slot.classList.remove('shake'); void slot.offsetWidth; slot.classList.add('shake'); return; }
      slot.style.cssText = piece(v); slot.classList.add('full'); sel.remove(); sel = null; sfx.pop(); placed++;
      if (placed === N) {
        $('#pf').classList.add('done'); funRec('puzzle', miss <= N, t0); res.push(true);
        good(NAT_N[k] || '', () => alive && setTimeout(() => fPuzzle(res), 500));
      }
    });
  });
}

// ---------- מצאו את ההבדלים: שני לוחות של אימוג'י, בשני יש 3 הבדלים ----------
const DIFF_SETS = [['🍎', '🍌', '🍇', '🍓', '🍒', '🍐', '🍊', '🥝', '🍉', '🍋'], ['🐶', '🐱', '🐰', '🐻', '🐼', '🦊', '🐸', '🐵', '🐷', '🐮'],
  ['🚒', '🚑', '🚓', '🚌', '🚗', '🚲', '✈️', '🚂', '🚁', '⛵'], ['⚽', '🏀', '🎈', '🎁', '⭐', '🌈', '🌙', '☀️', '❄️', '🌸'], ['🦋', '🐝', '🐞', '🐌', '🐢', '🐟', '🐬', '🦀', '🐙', '🦉']];
// practice = סיבוב ניסיון: שורה אחת בכל לוח והבדל אחד, ולא נספר
function fDiff(res = [], practice = false) {
  if (!practice && res.length && roundOver()) return endRound('diff', res);
  const lv = res.length + lvB('diff') * 2, cols = 4, rows = practice ? 1 : lv < 3 ? 4 : 5, D = practice ? 1 : lv < 2 ? 3 : lv < 6 ? 4 : 5, set = pick(DIFF_SETS), cells = rows * cols;
  const a1 = Array.from({ length: cells }, () => pick(set)), a2 = [...a1], diffs = shuffle([...Array(cells).keys()]).slice(0, D);
  diffs.forEach(i => { a2[i] = pick(set.filter(x => x !== a1[i])); });
  const found = new Set(); let miss = 0; const t0 = performance.now();
  const grid = (arr, id) => `<div class="dgrid" id="${id}" style="grid-template-columns:repeat(${cols},1fr)">${arr.map((x, i) => `<button class="dcell" data-i="${i}">${x}</button>`).join('')}</div>`;
  show(`${funTop('diff', res)}
    <div class="lq nk" style="font-size:19px;margin:8px 0"><span>${practice ? '🎯 ניסיון: ' : ''}${strip(T('מְצָא', 'מִצְאִי'))} ${D === 1 ? 'הבדל אחד' : D + ' הבדלים'}</span><span class="dleft" id="left">${'⚪'.repeat(D)}</span></div>
    <div class="dboards">${grid(a1, 'g1')}${grid(a2, 'g2')}</div>`, a => {
    $('#quit', a).onclick = back('diff'); say(T(`מְצָא אֶת הַהֲבָדִלִים!`, `מִצְאִי אֶת הַהֲבָדִלִים!`));
    $$('.dcell', a).forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      if (!diffs.includes(i)) { miss++; b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); return sfx.tap(); }
      if (found.has(i)) return;
      found.add(i); sfx.pop(); $$(`.dcell[data-i="${i}"]`, a).forEach(x => x.classList.add('found'));
      $('#left').textContent = '🟢'.repeat(found.size) + '⚪'.repeat(D - found.size);
      if (found.size === D) {
        if (practice) { good('', () => { toast(T('מְצֻיָּן! עַכְשָׁו הַלּוּחַ הָאֲמִתִּי', 'מְצֻיָּן! עַכְשָׁו הַלּוּחַ הָאֲמִתִּי')); startGame('diff'); }); return; }
        funRec('diff', miss <= 2, t0); res.push(true); good('', () => fDiff(res));
      }
    });
  });
}

// ---------- רכבת הדפוסים: הקרונות הולכים לפי דפוס, ומה הקרון הבא? ----------
const TRAIN_SETS = [['🔴', '🔵', '🟢', '🟡', '🟣'], ['🐶', '🐱', '🐰', '🐸', '🐵'], ['🍎', '🍌', '🍇', '🍓', '🍊'], ['⭐', '🌙', '☀️', '☁️', '🌈'], ['⚽', '🏀', '🎈', '🎁', '🧸']];
const TRAIN_PAT = ['AB', 'AB', 'ABC', 'AAB', 'ABB', 'ABC', 'AABB', 'ABCD', 'AABC', 'ABBC'];
function fTrain(res = []) {
  if (res.length && roundOver()) return endRound('train', res);
  const ok = res.filter(Boolean).length + lvB('train') * 2, pat = TRAIN_PAT[Math.min(TRAIN_PAT.length - 1, ok + R(2))];
  const set = shuffle(pick(TRAIN_SETS)), sym = c => set[c.charCodeAt(0) - 65];
  const len = Math.max(pat.length * 2, 5) + (pat.length > 2 ? 0 : 1), seq = [...Array(len + 1).keys()].map(i => sym(pat[i % pat.length]));
  const ans = seq[len], used = [...new Set(pat)].map(sym), opts = shuffle([ans, ...shuffle([...used, ...set].filter((x, i, a) => x !== ans && a.indexOf(x) === i)).slice(0, 2)]);
  const t0 = performance.now(); let busy = false;
  show(`${funTop('train', res)}
    <div class="lq nk" style="font-size:19px"><span>${strip(T('מָה הַקָּרוֹן הַבָּא?', 'מָה הַקָּרוֹן הַבָּא?'))}</span>${spk('מָה הַקָּרוֹן הַבָּא?')}</div>
    <div class="trainwrap"><div class="train" id="train" style="--cw:${Math.floor(Math.min(56, (Math.min(innerWidth, 560) - 32 - 50) / (len + 1) - 5))}px"><span class="loco">🚂</span>${seq.slice(0, len).map((x, i) => `<span class="car" style="animation-delay:${i * .08}s">${x}</span>`).join('')}<span class="car q" id="tq">❓</span></div></div>
    <div class="topts">${opts.map(o => `<button class="topt" data-o="${o}">${o}</button>`).join('')}</div>`, a => {
    $('#quit', a).onclick = back('train'); let alive = true; onLeave(() => { alive = false; });
    say('מָה הַקָּרוֹן הַבָּא?');
    $$('.topt', a).forEach(b => b.onclick = () => {
      if (busy) return; const right = b.dataset.o === ans;
      if (!right) { sfx.bad(); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); b.disabled = true; funRec('train', false, t0); res.push(false); return; }
      busy = true; funRec('train', true, t0); res.push(true);
      const q = $('#tq'); q.textContent = ans; q.classList.remove('q'); q.classList.add('got'); tone(523, .1, 'triangle', 0, .15); tone(659, .12, 'triangle', .1, .15);
      setTimeout(() => alive && $('#train')?.classList.add('go'), 500);
      good('', () => alive && fTrain(res));
    });
  });
}

// ---------- סודוקו 4×4 עם חיות: כל חיה פעם אחת בכל שורה, טור וריבוע ----------
const SUDO_SETS = [['🐶', '🐱', '🐰', '🐻'], ['🍎', '🍌', '🍇', '🍓'], ['🚒', '🚑', '🚓', '🚌'], ['⭐', '🌙', '☀️', '🌈']];
function fSudoku(res = []) {
  if (res.length && roundOver()) return endRound('sudoku', res);
  let s = [[0, 1, 2, 3], [2, 3, 0, 1], [1, 0, 3, 2], [3, 2, 1, 0]];
  const perm = shuffle([0, 1, 2, 3]); s = s.map(r => r.map(v => perm[v]));
  if (Math.random() < .5) s = s[0].map((_, c) => s.map(r => r[c]));                // היפוך אלכסוני
  if (Math.random() < .5) [s[0], s[1]] = [s[1], s[0]]; if (Math.random() < .5) [s[2], s[3]] = [s[3], s[2]];
  if (Math.random() < .5) [s[0], s[1], s[2], s[3]] = [s[2], s[3], s[0], s[1]];
  const set = pick(SUDO_SETS), holes = new Set(shuffle([...Array(16).keys()]).slice(0, Math.min(11, 5 + res.length)));
  const board = s.flat().map((v, i) => holes.has(i) ? null : v); let selI = null, miss = 0; const t0 = performance.now();
  show(`${funTop('sudoku', res)}
    <p class="center nk" style="margin:8px 0 10px;font-weight:700;line-height:1.6">${strip(T('בְּכָל שׁוּרָה, בְּכָל טוּר וּבְכָל רִבּוּעַ: כָּל אֶחָד פַּעַם אַחַת', 'בְּכָל שׁוּרָה, בְּכָל טוּר וּבְכָל רִבּוּעַ: כָּל אֶחָד פַּעַם אַחַת'))}</p>
    <div class="sdk" id="sdk"></div><div class="sdkpal">${set.map((x, v) => `<button data-v="${v}">${x}</button>`).join('')}</div>
    <p class="center mute small" style="margin-top:8px">${strip(T('לְחַץ', 'לַחֲצִי'))} על משבצת ריקה, ואז על מה שמתאים</p>`, a => {
    $('#quit', a).onclick = back('sudoku'); say(T('בְּכָל שׁוּרָה, בְּכָל טוּר וּבְכָל רִבּוּעַ: כָּל אֶחָד פַּעַם אַחַת', 'בְּכָל שׁוּרָה, בְּכָל טוּר וּבְכָל רִבּוּעַ: כָּל אֶחָד פַּעַם אַחַת'));
    const draw = () => {
      $('#sdk').innerHTML = board.map((v, i) => `<button class="sc4 ${v === null ? 'empty' : holes.has(i) ? 'mine' : 'given'} ${selI === i ? 'sel' : ''} ${i % 4 === 1 ? 'br' : ''} ${Math.floor(i / 4) === 1 ? 'bb' : ''}" data-i="${i}">${v === null ? '' : set[v]}</button>`).join('');
      $$('.sc4.empty').forEach(b => b.onclick = () => { selI = +b.dataset.i; sfx.tap(); draw(); });
    };
    $$('.sdkpal button', a).forEach(b => b.onclick = () => {
      if (selI === null) { const e = board.findIndex(v => v === null); if (e < 0) return; selI = e; }
      const v = +b.dataset.v;
      if (s.flat()[selI] !== v) { miss++; bad($(`.sc4[data-i="${selI}"]`)); return; }
      board[selI] = v; selI = null; sfx.pop(); draw();
      if (board.every(x => x !== null)) { $('#sdk').classList.add('done'); funRec('sudoku', miss <= 1, t0); res.push(miss <= 1); good('', () => fSudoku(res)); }
    });
    draw();
  });
}

// ================= 🧠 זיכרון וקשב =================
// ---------- סיימון: ניצוץ מנגן רצף, וחוזרים עליו ----------
const SIMON = [['#ff3b4e', 330], ['#2f8bff', 392], ['#19c24a', 494], ['#ffc400', 587]];
function fSimon() {
  const res = []; let seq = Array.from({ length: 2 + lvB('simon') }, () => pick([0, 1, 2, 3])), at = 0, busy = true, t0;
  show(`${funTop('simon', res)}
    <div class="lq nk" style="font-size:19px"><span id="smsg">${strip(T('הַקְשֵׁב וְתִסְתַּכֵּל...', 'הַקְשִׁיבִי וְתִסְתַּכְּלִי...'))}</span></div>
    <div class="simon">${SIMON.map(([c], i) => `<button class="sp" data-i="${i}" style="--c:${c}"></button>`).join('')}<div class="smid" id="slen">${seq.length}</div></div>
    <div class="sres" id="sres"></div>`, a => {
    $('#quit', a).onclick = back('simon'); let alive = true; onLeave(() => { alive = false; });
    const flash = (i, d = .32) => { const b = $(`.sp[data-i="${i}"]`); if (!b) return; b.classList.add('lit'); tone(SIMON[i][1], d, 'triangle', 0, .2); setTimeout(() => b.classList.remove('lit'), d * 1000); };
    const play = () => {
      if (!alive) return; busy = true; at = 0; $('#smsg').textContent = strip(T('הַקְשֵׁב וְתִסְתַּכֵּל...', 'הַקְשִׁיבִי וְתִסְתַּכְּלִי...')); $('#slen').textContent = seq.length;
      const gap = Math.max(380, 700 - seq.length * 30);
      seq.forEach((v, k) => setTimeout(() => flash(v), 700 + k * gap));
      setTimeout(() => { if (!alive) return; busy = false; t0 = performance.now(); $('#smsg').textContent = strip(T('עַכְשָׁו אַתָּה!', 'עַכְשָׁו אַתְּ!')); }, 700 + seq.length * gap);
    };
    // אחרי כל סיבוב: סימן גדול וברור אם הצליח
    const verdict = ok => { const r = $('#sres'); if (!r) return; r.className = 'sres show ' + (ok ? 'ok' : 'no'); r.innerHTML = ok ? `✅ <b>${strip(T('יָפֶה! עוֹד צֶבַע', 'יָפֶה! עוֹד צֶבַע'))}</b>` : `🙈 <b>${strip(T('כִּמְעַט! נְנַסֶּה שׁוּב', 'כִּמְעַט! נְנַסֶּה שׁוּב'))}</b>`; $('.simon')?.classList.add(ok ? 'good' : 'oops'); setTimeout(() => { r.className = 'sres'; $('.simon')?.classList.remove('good', 'oops'); }, 1100); };
    $$('.sp', a).forEach(b => b.onpointerdown = () => {
      if (busy) return; const i = +b.dataset.i; flash(i, .22);
      if (i !== seq[at]) {
        busy = true; funRec('simon', false, t0); res.push(false); sfx.bad(); verdict(false);
        if (roundOver()) return setTimeout(() => endRound('simon', res), 800);
        if (seq.length > 2) seq.pop(); return setTimeout(play, 1500);
      }
      if (++at === seq.length) {
        busy = true; funRec('simon', true, t0); res.push(true); verdict(true);
        if (roundOver()) return good('', () => endRound('simon', res));
        seq.push(pick([0, 1, 2, 3])); seq.length % 3 === 0 ? good('', play) : (sfx.win(), setTimeout(play, 1300));
      }
    });
    setTimeout(play, 400);
  });
}

// ---------- איפה הכדור: הכוסות מתערבבות, ועוקבים בעיניים ----------
function fCups(res = []) {
  if (res.length && roundOver()) return endRound('cups', res);
  const ok = res.filter(Boolean).length + lvB('cups') * 2, swaps = Math.min(12, 3 + ok), speed = Math.max(.22, .55 - ok * .03);
  const slot = [0, 1, 2], ball = R(3); let busy = true; const t0 = performance.now();
  show(`${funTop('cups', res)}
    <div class="lq nk" style="font-size:19px"><span id="cmsg">${strip(T('תִּסְתַּכֵּל אֵיפֹה הַכַּדּוּר...', 'תִּסְתַּכְּלִי אֵיפֹה הַכַּדּוּר...'))}</span></div>
    <div class="cups" id="cups">${[0, 1, 2].map(c => `<button class="cup up" data-c="${c}" style="--x:${c};transition-duration:${speed}s"><span class="cb">🟡</span><i></i></button>`).join('')}</div>`, a => {
    $('#quit', a).onclick = back('cups'); let alive = true; onLeave(() => { alive = false; });
    $$('.cup .cb', a).forEach((x, c) => x.style.visibility = c === ball ? 'visible' : 'hidden');
    const place = () => $$('.cup', a).forEach(b => b.style.setProperty('--x', slot[+b.dataset.c]));
    say(T('תִּסְתַּכֵּל טוֹב עַל הַכַּדּוּר!', 'תִּסְתַּכְּלִי טוֹב עַל הַכַּדּוּר!'));
    setTimeout(() => {
      if (!alive) return; $$('.cup', a).forEach(b => b.classList.remove('up'));
      setTimeout(() => $$('.cup .cb', a).forEach(x => x.style.visibility = 'hidden'), 380); // הכדור נעלם כשהכוסות למטה
      let k = 0; const mix = () => {
        if (!alive) return;
        if (k++ >= swaps) { busy = false; $('#cmsg').textContent = strip(T('אֵיפֹה הַכַּדּוּר?', 'אֵיפֹה הַכַּדּוּר?')); return say('אֵיפֹה הַכַּדּוּר?'); }
        const p = shuffle([0, 1, 2]).slice(0, 2), c1 = slot.indexOf(p[0]), c2 = slot.indexOf(p[1]);
        [slot[c1], slot[c2]] = [slot[c2], slot[c1]]; place(); tone(300 + R(200), .06, 'sine', 0, .05);
        setTimeout(mix, speed * 1000 + 80);
      };
      setTimeout(mix, 700);
    }, 1500);
    $$('.cup', a).forEach(b => b.onclick = () => {
      if (busy) return; busy = true; const c = +b.dataset.c, right = c === ball;
      $$('.cup .cb', a)[ball].style.visibility = 'visible';
      $$('.cup', a).forEach(x => { if (+x.dataset.c === c || +x.dataset.c === ball) x.classList.add('up'); });
      funRec('cups', right, t0); res.push(right);
      // alive: אם יצאו מהמשחק בינתיים, לא חוזרים אליו
      if (right) good('', () => alive && fCups(res)); else { sfx.bad(); sayThen(T('הַכַּדּוּר הָיָה כָּאן. עוֹד פַּעַם!', 'הַכַּדּוּר הָיָה כָּאן. עוֹד פַּעַם!'), () => alive && fCups(res)); }
    });
  });
}

// ---------- מה השתנה: מסתכלים, מכסים, ומחפשים את התמונה שהתחלפה ----------
// אימוג'י גדולים וברורים (ולא תמונות): קל לזכור, ומופיעים מיד, כך שלא רואים מה מתחלף
const CHG_EMO = ['🍎', '🍌', '🍇', '🍓', '🍉', '🍦', '🚗', '🚌', '🚲', '✈️', '🚀', '⚽', '🏀', '🎈', '🎁', '🐶', '🐱', '🐸', '🐵', '🦁', '🐘', '🐟', '🌞', '🌙', '⭐', '🌈', '☂️', '🏠', '🌳', '🎵'];
function fChanged(res = []) {
  if (res.length && roundOver()) return endRound('changed', res);
  const n = [4, 4, 6, 6, 9][Math.min(4, res.filter(Boolean).length + lvB('changed'))], keys = shuffle(CHG_EMO), items = keys.slice(0, n), ch = R(n), newK = keys[n];
  const look = Math.max(3, 6 - Math.floor(res.length / 2)), t0 = performance.now();
  show(`${funTop('changed', res)}
    <div class="lq nk" style="font-size:19px"><span id="chmsg">${strip(T('תִּזְכֹּר אֶת הַתְּמוּנוֹת!', 'תִּזְכְּרִי אֶת הַתְּמוּנוֹת!'))}</span></div>
    <div class="tbar" style="margin:0 0 10px"><i id="look" style="width:100%;transition:width ${look}s linear"></i></div>
    <div class="chg n${n}" id="chg">${items.map((e, i) => `<button class="chc emo" data-i="${i}"><b>${e}</b></button>`).join('')}</div>`, a => {
    $('#quit', a).onclick = back('changed'); let alive = true; onLeave(() => { alive = false; }); say(T('תִּזְכֹּר אֶת הַתְּמוּנוֹת!', 'תִּזְכְּרִי אֶת הַתְּמוּנוֹת!'));
    let busy = true; requestAnimationFrame(() => $('#look').style.width = '0%');
    setTimeout(() => {
      if (!alive) return; $('#chg').classList.add('hide'); sfx.tap();
      setTimeout(() => { if (alive) $$('.chc b', a)[ch].textContent = newK; }, 400); // מחליפים רק כשכל הכרטיסים הפוכים
      setTimeout(() => {
        if (!alive) return; $('#chg').classList.remove('hide'); busy = false;
        $('#chmsg').textContent = strip(T('מָה הִשְׁתַּנָּה?', 'מָה הִשְׁתַּנָּה?')); say('מָה הִשְׁתַּנָּה?');
      }, 900);
    }, look * 1000);
    $$('.chc', a).forEach(b => b.onclick = () => {
      if (busy) return; busy = true; const i = +b.dataset.i, right = i === ch;
      $$('.chc', a)[ch].classList.add('good'); funRec('changed', right, t0); res.push(right);
      if (right) good('', () => alive && fChanged(res)); else { b.classList.add('shake'); sfx.bad(); sayThen(T('זֹאת הַתְּמוּנָה שֶׁהִשְׁתַּנְּתָה. עוֹד פַּעַם!', 'זֹאת הַתְּמוּנָה שֶׁהִשְׁתַּנְּתָה. עוֹד פַּעַם!'), () => alive && fChanged(res)); }
    });
  });
}

// ================= 💛 רגשות ורוגע =================
// ---------- איך אני מרגיש היום: נשמר להורה במדריך האישי ----------
const MOODS = { great: ['😄', 'מְצֻיָּן', 'מְצֻיֶּנֶת'], good: ['🙂', 'טוֹב', 'טוֹבָה'], meh: ['😐', 'כָּכָה כָּכָה', 'כָּכָה כָּכָה'], sad: ['😢', 'עָצוּב', 'עֲצוּבָה'], angry: ['😠', 'כּוֹעֵס', 'כּוֹעֶסֶת'], tired: ['😴', 'עָיֵף', 'עֲיֵפָה'] };
const MOOD_SAY = {
  great: ['אֵיזֶה כֵּיף! אֲנִי שָׂמֵחַ בִּשְׁבִילְךָ!', 'אֵיזֶה כֵּיף! אֲנִי שָׂמֵחַ בִּשְׁבִילֵךְ!'], good: ['יוֹפִי! יוֹם טוֹב מַתְחִיל בְּחִיּוּךְ.', 'יוֹפִי! יוֹם טוֹב מַתְחִיל בְּחִיּוּךְ.'],
  meh: ['זֶה בְּסֵדֶר. אוּלַי מִשְׂחָק קָטָן יְשַׂמֵּחַ אוֹתְךָ?', 'זֶה בְּסֵדֶר. אוּלַי מִשְׂחָק קָטָן יְשַׂמֵּחַ אוֹתָךְ?'],
  sad: ['אֲנִי פֹּה אִתְּךָ. רוֹצֶה לִנְשֹׁם יַחַד אִתִּי? וְאוּלַי לְסַפֵּר לְאַבָּא אוֹ לְאִמָּא?', 'אֲנִי פֹּה אִתָּךְ. רוֹצָה לִנְשֹׁם יַחַד אִתִּי? וְאוּלַי לְסַפֵּר לְאַבָּא אוֹ לְאִמָּא?'],
  angry: ['מֻתָּר לִכְעֹס. בּוֹא נִנְשֹׁם עָמֹק יַחַד, וְזֶה יַעֲבֹר.', 'מֻתָּר לִכְעֹס. בּוֹאִי נִנְשֹׁם עָמֹק יַחַד, וְזֶה יַעֲבֹר.'],
  tired: ['אוּלַי כְּדַאי לָנוּחַ קְצָת. נְשִׁימָה אִטִּית עוֹזֶרֶת.', 'אוּלַי כְּדַאי לָנוּחַ קְצָת. נְשִׁימָה אִטִּית עוֹזֶרֶת.'],
};
function fMood() {
  const q = T('אֵיךְ אַתָּה מַרְגִּישׁ הַיּוֹם?', 'אֵיךְ אַתְּ מַרְגִּישָׁה הַיּוֹם?');
  show(`${funTop('mood')}<div class="lq nk"><span>${q}</span>${spk(q)}</div>
    <div class="moods">${Object.entries(MOODS).map(([k, [e, m, f]]) => `<button class="moodb" data-m="${k}"><em>${e}</em><span class="nk">${T(m, f)}</span></button>`).join('')}</div><div id="mres"></div>`, a => {
    $('#quit', a).onclick = back('mood'); say(q);
    $$('.moodb', a).forEach(b => b.onclick = () => {
      const k = b.dataset.m, s = store.st(CUR.id); (s.mood ||= {})[today()] = k; store.save(); recLittle('mood', true, 0);
      $$('.moodb', a).forEach(x => x.classList.toggle('on', x === b)); sfx.win();
      const t = T(...MOOD_SAY[k]), calmDown = ['sad', 'angry', 'tired', 'meh'].includes(k);
      $('#mres', a).innerHTML = `<div class="explain ok"><p class="nk">${t}</p><div class="row" style="gap:10px">${calmDown ? '<button class="btn grow" id="toBreath">🫧 לנשום יחד</button>' : ''}<button class="btn ${calmDown ? 'ghost' : ''} grow" id="toPlay">🎮 לשחק</button></div></div>`;
      say(t); $('#toPlay', a).onclick = () => home(); $('#toBreath', a) && ($('#toBreath', a).onclick = () => fBreath());
    });
  });
}

// ---------- בועת נשימה: 5 נשימות איטיות. הבועה גדלה בשאיפה וקטנה בנשיפה ----------
function fBreath() {
  const N = 5; let k = 0, alive = true, timer;
  show(`${funTop('breath')}<div class="lq nk"><span id="bmsg">${strip(T('נְשֹׁם יַחַד עִם הַבּוּעָה', 'נִשְׁמִי יַחַד עִם הַבּוּעָה'))}</span></div>
    <div class="breath"><div class="bub" id="bub">${mascot('sm')}</div></div><div class="bdots" id="bdots">${'<i></i>'.repeat(N)}</div>`, a => {
    $('#quit', a).onclick = back('breath'); onLeave(() => { alive = false; clearTimeout(timer); });
    const bub = $('#bub', a), msg = $('#bmsg', a);
    const phase = (txt, cls, ms, next) => { if (!alive) return; msg.textContent = strip(txt); bub.className = 'bub ' + cls; say(txt); timer = setTimeout(next, ms); };
    const cycle = () => {
      if (k >= N) {
        recLittle('breath', true, 0); msg.textContent = strip(T('כָּל הַכָּבוֹד! אֵיךְ אַתָּה מַרְגִּישׁ עַכְשָׁו?', 'כָּל הַכָּבוֹד! אֵיךְ אַתְּ מַרְגִּישָׁה עַכְשָׁו?'));
        say(T('כָּל הַכָּבוֹד! אֵיךְ אַתָּה מַרְגִּישׁ עַכְשָׁו?', 'כָּל הַכָּבוֹד! אֵיךְ אַתְּ מַרְגִּישָׁה עַכְשָׁו?')); confetti(30);
        $('.breath', a).insertAdjacentHTML('afterend', '<div class="row" style="gap:10px;margin-top:14px"><button class="btn grow" id="again">🫧 עוד פעם</button><button class="btn ghost grow" id="howNow">🌈 איך אני מרגיש/ה</button></div>'.replace('מרגיש/ה', T('מרגיש', 'מרגישה')));
        $('#again', a).onclick = () => fBreath(); $('#howNow', a).onclick = () => fMood(); return;
      }
      phase('שְׁאִיפָה...', 'in', 4000, () => phase('לְהַחֲזִיק...', 'hold', 1500, () => phase('נְשִׁיפָה...', 'out', 4500, () => { $$('#bdots i', a)[k++].classList.add('on'); tone(523, .3, 'sine', 0, .06); cycle(); })));
    };
    timer = setTimeout(cycle, 1200);
  });
}

// ---------- איך הוא מרגיש: סיפור קצר ובוחרים רגש. אין תשובה "אסורה", רק רגש שמתאים יותר ----------
const FEELS = { happy: ['😄', 'שָׂמֵחַ', 'שְׂמֵחָה'], sad: ['😢', 'עָצוּב', 'עֲצוּבָה'], angry: ['😠', 'כּוֹעֵס', 'כּוֹעֶסֶת'], scared: ['😨', 'מְפַחֵד', 'מְפַחֶדֶת'],
  surprised: ['😲', 'מֻפְתָּע', 'מֻפְתַּעַת'], proud: ['😊', 'גֵּאֶה', 'גֵּאָה'], shy: ['😳', 'מִתְבַּיֵּשׁ', 'מִתְבַּיֶּשֶׁת'], excited: ['🤩', 'מִתְרַגֵּשׁ', 'מִתְרַגֶּשֶׁת'] };
const FEEL_QS = [
  ['לְנוֹעָה יֵשׁ יוֹם הֻלֶּדֶת, וְכָל הַחֲבֵרוֹת בָּאוּ לַמְּסִבָּה.', 'happy|excited', 'f', 'כְּשֶׁשְּׂמֵחִים, נָעִים לְשַׁתֵּף אֶת הַשִּׂמְחָה עִם מִי שֶׁאוֹהֲבִים.'],
  ['הַכֶּלֶב שֶׁל אִיתַי הָלַךְ לְאִבּוּד.', 'sad|scared', 'm', 'כְּשֶׁעֲצוּבִים, עוֹזֵר לְסַפֵּר לְמִישֶׁהוּ וּלְקַבֵּל חִבּוּק.'],
  ['מִישֶׁהוּ לָקַח לְרוֹנִי אֶת הַכַּדּוּר בְּלִי לְבַקֵּשׁ.', 'angry', 'm', 'כְּשֶׁכּוֹעֲסִים, אֶפְשָׁר לִנְשֹׁם עָמֹק וּלְהַגִּיד בְּמִלִּים מָה מַפְרִיעַ.'],
  ['בַּלַּיְלָה הָיָה רַעַם חָזָק, וּמִיכַל הִתְעוֹרְרָה.', 'scared', 'f', 'כְּשֶׁמְּפַחֲדִים, אֶפְשָׁר לָלֶכֶת לְאַבָּא אוֹ לְאִמָּא, וְהַפַּחַד עוֹבֵר מַהֵר יוֹתֵר.'],
  ['תָּמָר פָּתְחָה אֶת הַדֶּלֶת, וְכָל הַמִּשְׁפָּחָה צָעֲקָה: הַפְתָּעָה!', 'surprised|happy', 'f', 'הַפְתָּעוֹת יְכוֹלוֹת לְשַׂמֵּחַ מְאֹד, גַּם אִם בָּרֶגַע הָרִאשׁוֹן נִבְהָלִים.'],
  ['אוֹרִי הִתְאַמֵּן הַרְבֵּה, וְסוֹף סוֹף הִצְלִיחַ לִרְכֹּב עַל אוֹפַנַּיִם.', 'proud|happy', 'm', 'כְּשֶׁמִּתְאַמְּצִים וּמַצְלִיחִים, מַגִּיעַ לָנוּ לִהְיוֹת גֵּאִים.'],
  ['הַמּוֹרָה בִּקְּשָׁה מִשִּׁירָה לָשִׁיר לִפְנֵי כָּל הַכִּתָּה.', 'shy|excited|scared', 'f', 'זֶה בְּסֵדֶר לְהִתְבַּיֵּשׁ. כָּל פַּעַם זֶה נַעֲשֶׂה קַל יוֹתֵר.'],
  ['מָחָר יוֹסִי נוֹסֵעַ לַיָּם עִם כָּל הַמִּשְׁפָּחָה.', 'excited|happy', 'm', 'כְּשֶׁמְּחַכִּים לְמַשֶּׁהוּ טוֹב, קָשֶׁה לְהֵרָדֵם. זֶה טִבְעִי.'],
  ['הַמִּגְדָּל שֶׁבָּנְתָה הִילָה נָפַל, אַחֲרֵי שֶׁעָבְדָה עָלָיו הַרְבֵּה.', 'sad|angry', 'f', 'אֶפְשָׁר לִהְיוֹת עֲצוּבִים, וְאַחַר כָּךְ לִבְנוֹת מִגְדָּל חָדָשׁ, אוּלַי עוֹד יוֹתֵר יָפֶה.'],
  ['הָאָח הַקָּטָן שֶׁל עִידוֹ קָרַע לוֹ אֶת הַצִּיּוּר.', 'angry|sad', 'm', 'מֻתָּר לִכְעֹס, אֲבָל לֹא מַרְבִּיצִים. מְסַפְּרִים לִמְבֻגָּר וּמְדַבְּרִים.'],
  ['רוֹמִי קִבְּלָה מַדְבֵּקָה שֶׁל כָּל הַכָּבוֹד עַל הַשִּׁעוּרִים.', 'proud|happy', 'f', 'כְּדַאי לִזְכֹּר אֶת הָרֶגַע הַזֶּה, כְּשֶׁמַּשֶּׁהוּ מַרְגִּישׁ קָשֶׁה.'],
  ['נִיר רוֹאֶה כֶּלֶב גָּדוֹל שֶׁנּוֹבֵחַ חָזָק.', 'scared', 'm', 'זֶה בְּסֵדֶר לְפַחֵד. אֶפְשָׁר לְהִתְרַחֵק וּלְהַחֲזִיק יָד שֶׁל מְבֻגָּר.'],
  ['לְיָאִיר נוֹלְדָה אָחוֹת קְטַנָּה.', 'excited|happy|surprised', 'm', 'תִּינוֹק חָדָשׁ זֶה מְרַגֵּשׁ. לִפְעָמִים גַּם מְבַלְבֵּל, וְזֶה בְּסֵדֶר.'],
  ['הַחֲבֵרָה שֶׁל אֲדֵל עָבְרָה לָגוּר בְּעִיר אַחֶרֶת.', 'sad', 'f', 'אֶפְשָׁר לִכְתֹּב לָהּ מִכְתָּב, אוֹ לְדַבֵּר אִתָּהּ בַּטֶּלֶפוֹן.'],
  ['בַּגִּנָּה מָצָא עוֹמֶר צָב קָטָן בֵּין הֶעָלִים.', 'surprised|happy|excited', 'm', 'הַטֶּבַע מָלֵא הַפְתָּעוֹת. כְּדַאי לְהִסְתַּכֵּל מִסָּבִיב.'],
  ['לִפְנֵי הַהוֹפָעָה, הַבֶּטֶן שֶׁל אֶלָּה מְקַרְקֶרֶת.', 'excited|scared|shy', 'f', 'זוֹ הִתְרַגְּשׁוּת. נְשִׁימָה אִטִּית עוֹזֶרֶת לְהֵרָגַע.'],
  ['בַּמִּשְׂחָק, הַקְּבוּצָה שֶׁל אֵיתָן הִפְסִידָה.', 'sad|angry', 'm', 'לֹא תָּמִיד מְנַצְּחִים. הָעִקָּר שֶׁנֶּהֱנִים וּמִשְׁתַּפְּרִים.'],
  ['סָבְתָא בָּאָה לְבַקֵּר אֶת לִיאוֹרָה בְּלִי לְהוֹדִיעַ.', 'surprised|happy|excited', 'f', 'כְּשֶׁאוֹהֲבִים מִישֶׁהוּ, כָּל פְּגִישָׁה מְשַׂמַּחַת.'],
  ['בַּיּוֹם הָרִאשׁוֹן בַּכִּתָּה הַחֲדָשָׁה, עֲמִית לֹא מַכִּיר אַף אֶחָד.', 'shy|scared', 'm', 'אֶפְשָׁר לְחַיֵּךְ לְמִישֶׁהוּ וּלְהַגִּיד שָׁלוֹם. כָּךְ מַתְחִילָה חֲבֵרוּת.'],
  ['הִלָּה סִדְּרָה לְבַד אֶת כָּל הַחֶדֶר, וְאִמָּא הִתְפַּלְּאָה.', 'proud|happy', 'f', 'כְּשֶׁעוֹשִׂים מַשֶּׁהוּ לְבַד, זֶה מַרְגִּישׁ טוֹב בַּלֵּב.'],
];
function fFeel(res = [], seen = []) {
  if (res.length && roundOver()) return endRound('feel', res);
  const i = natNext('feel', FEEL_QS, seen), [story, ok, gen, tip] = FEEL_QS[i], okSet = ok.split('|');
  const opts = shuffle([okSet[0], ...shuffle(Object.keys(FEELS).filter(x => !okSet.includes(x))).slice(0, 2)]); const t0 = performance.now();
  show(`${funTop('feel', res)}<div id="nb"><div class="tale nk"><span>${story}</span>${spk(story)}</div>
    <p class="center nk" style="font-weight:800;margin:12px 0 8px">${gen === 'f' ? 'אֵיךְ הִיא מַרְגִּישָׁה?' : 'אֵיךְ הוּא מַרְגִּישׁ?'}</p>
    <div class="feels">${opts.map(k => `<button class="feelb" data-k="${k}"><em>${FEELS[k][0]}</em><span class="nk">${FEELS[k][gen === 'f' ? 2 : 1]}</span></button>`).join('')}</div></div>`, a => {
    $('#quit', a).onclick = back('feel'); voice.say(story + '|' + (gen === 'f' ? 'אֵיךְ הִיא מַרְגִּישָׁה?' : 'אֵיךְ הוּא מַרְגִּישׁ?'));
    $$('.feelb', a).forEach(b => b.onclick = () => {
      const right = okSet.includes(b.dataset.k); $$('.feelb', a).forEach(x => { x.disabled = true; if (okSet.includes(x.dataset.k)) x.classList.add('good'); });
      recLittle('feel', right, performance.now() - t0); natMark('feel', i, right); res.push(right);
      right ? (sfx.win(), confetti(16)) : sfx.tap();
      explain($('#nb'), right, (right ? '' : (gen === 'f' ? 'אוּלַי. אֲבָל רֹב הַיְּלָדִים הָיוּ מַרְגִּישִׁים|' : 'אוּלַי. אֲבָל רֹב הַיְּלָדִים הָיוּ מַרְגִּישִׁים|') + FEELS[okSet[0]][gen === 'f' ? 2 : 1] + '.|') + tip, () => fFeel(res, seen));
    });
  });
}

// ---------- מה כדאי לעשות: מצבים עם חברים ובבית. מסבירים למה, בלי לנזוף ----------
const KIND_QS = [
  ['יֶלֶד חָדָשׁ בַּכִּתָּה יוֹשֵׁב לְבַד בַּהַפְסָקָה.', ['לְהַזְמִין אוֹתוֹ לְשַׂחֵק', 'לְהִתְעַלֵּם מִמֶּנּוּ', 'לִצְחֹק עָלָיו'], 'כְּשֶׁמַּזְמִינִים מִישֶׁהוּ לְשַׂחֵק, הוּא מַרְגִּישׁ שֶׁרוֹצִים אוֹתוֹ.'],
  ['חָבֵר נָפַל וְנִפְצַע בָּרֶגֶל.', ['לַעֲזֹר לוֹ וְלִקְרֹא לִמְבֻגָּר', 'לְהַמְשִׁיךְ לָרוּץ', 'לִצְחֹק'], 'עוֹזְרִים לְחָבֵר, וּמְבֻגָּר יוֹדֵעַ מָה לַעֲשׂוֹת.'],
  ['כּוֹס נִשְׁבְּרָה בְּטָעוּת בַּמִּטְבָּח.', ['לְסַפֵּר לְאַבָּא אוֹ לְאִמָּא', 'לְהַסְתִּיר אֶת הַשְּׁבָרִים', 'לְהַגִּיד שֶׁהָאָח שָׁבַר'], 'אוֹמְרִים אֶת הָאֱמֶת, וְלֹא נוֹגְעִים בִּזְכוּכִית שְׁבוּרָה.'],
  ['שְׁנֵי יְלָדִים רוֹצִים אֶת אוֹתוֹ הַצַּעֲצוּעַ.', ['לְשַׂחֵק בְּתוֹרוֹת', 'לָרִיב עָלָיו', 'לִבְכּוֹת'], 'בְּתוֹרוֹת כֻּלָּם נֶהֱנִים, וְאַף אֶחָד לֹא כּוֹעֵס.'],
  ['חֲבֵרָה עֲצוּבָה כִּי הִיא לֹא הִצְלִיחָה בַּמִּבְחָן.', ['לְעוֹדֵד אוֹתָהּ', 'לְהַגִּיד לָהּ שֶׁהִיא לֹא חֲכָמָה', 'לָלֶכֶת מִמֶּנָּה'], 'מִלָּה טוֹבָה עוֹזֶרֶת: בַּפַּעַם הַבָּאָה תַּצְלִיחִי!'],
  ['יֶלֶד בַּכִּתָּה אָמַר מִלָּה לֹא יָפָה.', ['לְהַגִּיד לוֹ שֶׁזֶּה לֹא נָעִים, אוֹ לְסַפֵּר לַמּוֹרָה', 'לְהַרְבִּיץ לוֹ', 'לְהַגִּיד לוֹ מִלָּה עוֹד יוֹתֵר רָעָה'], 'מְדַבְּרִים בְּמִלִּים, וּמְבַקְּשִׁים עֶזְרָה מִמְּבֻגָּר.'],
  ['סָבָא סוֹחֵב שַׂקִּיּוֹת כְּבֵדוֹת מֵהַסּוּפֶּר.', ['לַעֲזֹר לוֹ לְהַחֲזִיק', 'לְהַמְשִׁיךְ לְשַׂחֵק', 'לְחַכּוֹת שֶׁיְּסַיֵּם'], 'עֶזְרָה לְמִי שֶׁצָּרִיךְ הִיא מִצְוָה גְּדוֹלָה.'],
  ['עַל הַסַּפְסָל בַּגִּנָּה יֵשׁ אַרְנָק שֶׁמִּישֶׁהוּ שָׁכַח.', ['לָתֵת לִמְבֻגָּר, כְּדֵי לְהַחֲזִיר לַבְּעָלִים', 'לָקַחַת אוֹתוֹ הַבַּיְתָה', 'לִזְרֹק לַפַּח'], 'זוֹ הֲשָׁבַת אֲבֵדָה: מַחֲזִירִים לְמִי שֶׁאִבֵּד.'],
  ['הָאָח הַקָּטָן רוֹצֶה לְהִצְטָרֵף לַמִּשְׂחָק.', ['לְהַרְאוֹת לוֹ אֵיךְ מְשַׂחֲקִים', 'לְגָרֵשׁ אוֹתוֹ', 'לְהִתְעַלֵּם מִמֶּנּוּ'], 'כְּשֶׁמְּלַמְּדִים אֶת הַקָּטָן, הוּא לוֹמֵד מֵהַגָּדוֹל, וְאוֹהֵב אוֹתוֹ עוֹד יוֹתֵר.'],
  ['הַחֶדֶר מְבֻלְגָּן, וְאִמָּא מְבַקֶּשֶׁת לְסַדֵּר.', ['לְסַדֵּר, אוּלַי עִם שִׁיר', 'לְהַגִּיד אַחַר כָּךְ כָּל הַזְּמַן', 'לְהַחְבִּיא הַכֹּל מִתַּחַת לַמִּטָּה'], 'כְּשֶׁעוֹשִׂים מִשְׂחָק מֵהַסִּדּוּר, הוּא נִגְמָר מַהֵר.'],
  ['חָבֵר שָׁכַח אֹכֶל לְבֵית הַסֵּפֶר.', ['לְהִתְחַלֵּק אִתּוֹ', 'לֶאֱכֹל לְבַד', 'לְהַגִּיד שֶׁזֹּאת לֹא הַבְּעָיָה שֶׁלִּי'], 'כְּשֶׁמִּתְחַלְּקִים, שְׁנֵי הַחֲבֵרִים שְׂמֵחִים.'],
  ['בַּמִּשְׂחָק, הַקְּבוּצָה הַשְּׁנִיָּה נִצְּחָה.', ['לְהַגִּיד לָהֶם כָּל הַכָּבוֹד', 'לִכְעֹס וְלָלֶכֶת', 'לְהַגִּיד שֶׁהֵם רִמּוּ'], 'מְפַרְגְּנִים לַמְּנַצְּחִים, וּבַפַּעַם הַבָּאָה אוּלַי נְנַצֵּחַ אֲנַחְנוּ.'],
  ['הַשִּׁעוּרִים קָשִׁים, וְלֹא מַצְלִיחִים לְבַד.', ['לְבַקֵּשׁ עֶזְרָה', 'לִזְרֹק אֶת הַמַּחְבֶּרֶת', 'לְוַתֵּר'], 'לְבַקֵּשׁ עֶזְרָה זֶה חָכָם. גַּם גְּדוֹלִים מְבַקְּשִׁים עֶזְרָה.'],
  ['מִישֶׁהוּ מְדַבֵּר, וְרוֹצִים לְהַגִּיד מַשֶּׁהוּ.', ['לְחַכּוֹת שֶׁהוּא יְסַיֵּם', 'לְהַפְרִיעַ לוֹ בְּאֶמְצַע', 'לִצְעֹק חָזָק'], 'כְּשֶׁמְּחַכִּים בְּסַבְלָנוּת, כֻּלָּם שׁוֹמְעִים אֶת כֻּלָּם.'],
  ['טָעִיתִי, וְהֶעֱלַבְתִּי חֲבֵרָה.', ['לְבַקֵּשׁ סְלִיחָה', 'לְהַגִּיד שֶׁזֶּה לֹא הָיָה', 'לֹא לְדַבֵּר אִתָּהּ'], 'כֻּלָּם טוֹעִים לִפְעָמִים. סְלִיחָה מְתַקֶּנֶת הַרְבֵּה.'],
  ['אַבָּא עָיֵף אַחֲרֵי יוֹם עֲבוֹדָה אָרֹךְ.', ['לְהָבִיא לוֹ כּוֹס מַיִם וּלְשַׂחֵק בְּשֶׁקֶט', 'לִקְפֹּץ עָלָיו', 'לִצְעֹק בַּבַּיִת'], 'כְּשֶׁשָּׂמִים לֵב לְאֲחֵרִים, כֻּלָּם מַרְגִּישִׁים טוֹב יוֹתֵר.'],
];
function fKind(res = [], seen = []) {
  if (res.length && roundOver()) return endRound('kind', res);
  const i = natNext('kind', KIND_QS, seen), [story, opts0, why] = KIND_QS[i], opts = shuffle(opts0.map((t, j) => ({ t, best: j === 0 }))); const t0 = performance.now();
  show(`${funTop('kind', res)}<div id="nb"><div class="tale nk"><span>${story}</span>${spk(story + '|מָה כְּדַאי לַעֲשׂוֹת?')}</div>
    <p class="center nk" style="font-weight:800;margin:12px 0 8px">מָה כְּדַאי לַעֲשׂוֹת?</p>
    <div class="stack">${opts.map((o, j) => `<button class="kindb nk" data-j="${j}">${o.t}</button>`).join('')}</div></div>`, a => {
    $('#quit', a).onclick = back('kind'); voice.say(story + '|מָה כְּדַאי לַעֲשׂוֹת?');
    $$('.kindb', a).forEach(b => b.onclick = () => {
      const right = opts[+b.dataset.j].best; $$('.kindb', a).forEach(x => { x.disabled = true; if (opts[+x.dataset.j].best) x.classList.add('good'); });
      recLittle('kind', right, performance.now() - t0); natMark('kind', i, right); res.push(right);
      right ? (sfx.win(), confetti(16)) : sfx.tap();
      explain($('#nb'), right, (right ? '' : 'בּוֹאוּ נַחְשֹׁב יַחַד.|') + why, () => fKind(res, seen));
    });
  });
}

// ================= 🎨 יצירה =================
// ---------- דפי צביעה: נוגעים באזור והוא נצבע. נשמר אצל הילד, וממשיכים אחר כך ----------
const PAL = ['#ff3b4e', '#ff8a00', '#ffd000', '#19c24a', '#00b3a4', '#2f8bff', '#8b3dff', '#ff5fb7', '#8b5a2b', '#9aa1aa', '#111111', '#ffffff'];
const PAGES = {
  fish: ['🐟', `<rect class="rg" x="0" y="0" width="300" height="300"/><path class="rg" d="M0 270 Q75 255 150 270 Q225 285 300 268 L300 300 L0 300 Z"/>
    <path class="rg" d="M30 300 Q10 240 40 200 Q60 160 35 120 Q70 160 55 210 Q45 250 60 300 Z"/><path class="rg" d="M250 300 Q235 250 255 215 Q275 180 260 150 Q290 190 275 230 Q265 265 280 300 Z"/>
    <polygon class="rg" points="200,150 262,108 256,192"/><ellipse class="rg" cx="140" cy="150" rx="75" ry="50"/><path class="rg" d="M150 102 Q166 150 150 198 Q134 150 150 102 Z"/>
    <path class="rg" d="M110 104 Q140 60 175 108 Z"/><path class="rg" d="M130 196 Q146 232 166 194 Z"/><circle class="rg" cx="95" cy="138" r="14"/><circle class="rg" cx="92" cy="138" r="6"/>
    <circle class="rg" cx="70" cy="72" r="10"/><circle class="rg" cx="55" cy="42" r="7"/><circle class="rg" cx="84" cy="28" r="5"/>`],
  house: ['🏠', `<rect class="rg" x="0" y="0" width="300" height="210"/><circle class="rg" cx="250" cy="50" r="28"/><ellipse class="rg" cx="70" cy="55" rx="35" ry="18"/><ellipse class="rg" cx="102" cy="45" rx="28" ry="20"/>
    <rect class="rg" x="0" y="210" width="300" height="90"/><rect class="rg" x="236" y="170" width="20" height="65"/><circle class="rg" cx="246" cy="150" r="38"/>
    <rect class="rg" x="160" y="82" width="18" height="40"/><rect class="rg" x="50" y="130" width="140" height="110"/><polygon class="rg" points="40,135 120,70 200,135"/>
    <rect class="rg" x="104" y="180" width="34" height="60"/><rect class="rg" x="62" y="150" width="30" height="28"/><rect class="rg" x="150" y="150" width="30" height="28"/>
    <polygon class="rg" points="104,240 138,240 162,300 82,300"/>`],
  flower: ['🌸', `<rect class="rg" x="0" y="0" width="300" height="300"/>${[0, 60, 120, 180, 240, 300].map(r => `<ellipse class="rg" cx="150" cy="68" rx="22" ry="36" transform="rotate(${r} 150 110)"/>`).join('')}
    <circle class="rg" cx="150" cy="110" r="24"/><rect class="rg" x="145" y="140" width="10" height="90"/><ellipse class="rg" cx="120" cy="185" rx="26" ry="12" transform="rotate(-30 120 185)"/>
    <ellipse class="rg" cx="180" cy="200" rx="26" ry="12" transform="rotate(30 180 200)"/><polygon class="rg" points="100,232 200,232 185,295 115,295"/><rect class="rg" x="92" y="222" width="116" height="16"/>`],
  butterfly: ['🦋', `<rect class="rg" x="0" y="0" width="300" height="300"/><ellipse class="rg" cx="105" cy="112" rx="55" ry="45" transform="rotate(-20 105 112)"/><ellipse class="rg" cx="195" cy="112" rx="55" ry="45" transform="rotate(20 195 112)"/>
    <ellipse class="rg" cx="115" cy="188" rx="40" ry="34" transform="rotate(20 115 188)"/><ellipse class="rg" cx="185" cy="188" rx="40" ry="34" transform="rotate(-20 185 188)"/>
    <circle class="rg" cx="95" cy="105" r="15"/><circle class="rg" cx="205" cy="105" r="15"/><circle class="rg" cx="115" cy="192" r="10"/><circle class="rg" cx="185" cy="192" r="10"/>
    <ellipse class="rg" cx="150" cy="150" rx="12" ry="60"/><circle class="rg" cx="150" cy="86" r="14"/><path class="ln" d="M145 76 Q130 46 120 40"/><path class="ln" d="M155 76 Q170 46 180 40"/>
    <circle class="rg" cx="120" cy="40" r="6"/><circle class="rg" cx="180" cy="40" r="6"/>`],
  truck: ['🚒', `<rect class="rg" x="0" y="0" width="300" height="232"/><rect class="rg" x="0" y="232" width="300" height="68"/><rect class="rg" x="236" y="138" width="22" height="16"/>
    <rect class="rg" x="40" y="140" width="172" height="72"/><rect class="rg" x="210" y="152" width="62" height="60"/><rect class="rg" x="224" y="162" width="32" height="24"/>
    <rect class="rg" x="52" y="118" width="148" height="14"/><rect class="rg" x="56" y="154" width="42" height="34"/><rect class="rg" x="106" y="154" width="42" height="34"/><rect class="rg" x="156" y="154" width="42" height="34"/>
    <circle class="rg" cx="86" cy="214" r="22"/><circle class="rg" cx="236" cy="214" r="22"/><circle class="rg" cx="86" cy="214" r="8"/><circle class="rg" cx="236" cy="214" r="8"/>`],
  balloons: ['🎈', `<rect class="rg" x="0" y="0" width="300" height="300"/><ellipse class="rg" cx="232" cy="58" rx="40" ry="20"/><ellipse class="rg" cx="200" cy="70" rx="30" ry="17"/><rect class="rg" x="0" y="262" width="300" height="38"/>
    <path class="ln" d="M100 152 Q120 210 150 262"/><path class="ln" d="M160 130 Q150 200 150 262"/><path class="ln" d="M210 178 Q185 220 150 262"/>
    <ellipse class="rg" cx="100" cy="100" rx="40" ry="50"/><ellipse class="rg" cx="160" cy="80" rx="38" ry="48"/><ellipse class="rg" cx="210" cy="130" rx="36" ry="46"/>
    <polygon class="rg" points="94,150 106,150 100,158"/><polygon class="rg" points="154,128 166,128 160,136"/><polygon class="rg" points="204,176 216,176 210,184"/>`],
};
function fColor(page) {
  const s = store.st(CUR.id); s.art ||= {}; page ||= s.artLast || 'fish'; s.artLast = page;
  let col = PAL[0]; const fills = s.art[page] ||= [];
  show(`${funTop('color')}
    <div class="pages">${Object.entries(PAGES).map(([k, [e]]) => `<button class="pgb ${k === page ? 'on' : ''}" data-p="${k}">${e}</button>`).join('')}</div>
    <svg class="cpage" id="cp" viewBox="0 0 300 300">${PAGES[page][1]}</svg>
    <div class="pal">${PAL.map((c, i) => `<button class="pc ${i ? '' : 'on'}" data-c="${c}" style="background:${c}"></button>`).join('')}</div>
    <div class="row" style="gap:10px;margin-top:12px"><button class="btn ghost grow" id="clr">🗑️ לנקות</button><button class="btn grow" id="done">📸 לשמור בגלריה</button></div>`, a => {
    $('#quit', a).onclick = back('color'); say(T('בְּחַר צֶבַע, וְגַע בַּצִּיּוּר!', 'בַּחֲרִי צֶבַע, וְגְעִי בַּצִּיּוּר!'));
    const rg = $$('#cp .rg', a); rg.forEach((r, i) => { r.style.fill = fills[i] || '#fff'; r.onclick = () => { r.style.fill = col; fills[i] = col; store.save(); tone(700, .05, 'sine', 0, .06); r.classList.remove('popc'); void r.getBBox(); r.classList.add('popc'); }; });
    $$('.pc', a).forEach(b => b.onclick = () => { col = b.dataset.c; $$('.pc', a).forEach(x => x.classList.toggle('on', x === b)); sfx.tap(); });
    $$('.pgb', a).forEach(b => b.onclick = () => fColor(b.dataset.p));
    $('#clr', a).onclick = () => { s.art[page] = []; store.save(); fColor(page); };
    $('#done', a).onclick = () => { const svg = $('#cp', a).outerHTML.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"'); svgToJpg(svg, d => saveArt(d)); recLittle('color', true, 0); };
  });
}
function svgToJpg(svg, cb) {
  const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = c.height = 360; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 360, 360); x.drawImage(im, 0, 0, 360, 360); cb(c.toDataURL('image/jpeg', .72)); };
  im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/class="rg"/g, 'stroke="#222" stroke-width="3"').replace(/class="ln"/g, 'stroke="#222" stroke-width="3" fill="none"'));
}

// ---------- מנדלה: מה שמציירים בצד אחד מופיע ב־8 כיוונים ----------
function fMandala() {
  let col = PAL[6], wid = 4, last = null;
  show(`${funTop('mandala')}<div class="lq nk" style="font-size:18px;margin:6px 0"><span>${strip(T('צַיֵּר בָּאֶצְבַּע, וְתִרְאֶה קֶסֶם', 'צַיְּרִי בָּאֶצְבַּע, וְתִרְאִי קֶסֶם'))} ✨</span></div>
    <canvas id="md" class="mandala" width="640" height="640"></canvas>
    <div class="pal">${PAL.filter(c => c !== '#ffffff').map((c, i) => `<button class="pc ${c === col ? 'on' : ''}" data-c="${c}" style="background:${c}"></button>`).join('')}</div>
    <div class="row" style="gap:8px;margin-top:10px"><button class="btn ghost small" data-w="3">דק</button><button class="btn ghost small" data-w="8">בינוני</button><button class="btn ghost small" data-w="16">עבה</button></div>
    <div class="row" style="gap:10px;margin-top:10px"><button class="btn ghost grow" id="clr">🗑️ לנקות</button><button class="btn grow" id="save">📸 לשמור בגלריה</button></div>`, a => {
    $('#quit', a).onclick = back('mandala'); say(T('צַיֵּר בָּאֶצְבַּע, וְתִרְאֶה קֶסֶם!', 'צַיְּרִי בָּאֶצְבַּע, וְתִרְאִי קֶסֶם!'));
    const cv = $('#md', a), x = cv.getContext('2d'), C = 320;
    const bg = () => { x.fillStyle = '#fff'; x.fillRect(0, 0, 640, 640); x.strokeStyle = 'rgba(139,61,255,.12)'; x.lineWidth = 1; for (let k = 0; k < 8; k++) { x.beginPath(); x.moveTo(C, C); x.lineTo(C + 320 * Math.cos(k * Math.PI / 4), C + 320 * Math.sin(k * Math.PI / 4)); x.stroke(); } };
    bg();
    const pt = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 640 - C, (e.clientY - r.top) / r.height * 640 - C]; };
    const seg = (p, q) => {
      x.strokeStyle = col; x.lineWidth = wid; x.lineCap = 'round';
      for (let k = 0; k < 8; k++) for (const m of [1, -1]) {
        x.save(); x.translate(C, C); x.rotate(k * Math.PI / 4); x.scale(1, m); x.beginPath(); x.moveTo(p[0], p[1]); x.lineTo(q[0], q[1]); x.stroke(); x.restore();
      }
    };
    cv.onpointerdown = e => { last = pt(e); try { cv.setPointerCapture(e.pointerId); } catch { } seg(last, last); };
    cv.onpointermove = e => { if (!last) return; const p = pt(e); seg(last, p); last = p; };
    cv.onpointerup = cv.onpointercancel = () => { last = null; };
    $$('.pc', a).forEach(b => b.onclick = () => { col = b.dataset.c; $$('.pc', a).forEach(y => y.classList.toggle('on', y === b)); sfx.tap(); });
    $$('[data-w]', a).forEach(b => b.onclick = () => { wid = +b.dataset.w; sfx.tap(); });
    $('#clr', a).onclick = () => { bg(); sfx.tap(); };
    $('#save', a).onclick = () => { const c = document.createElement('canvas'); c.width = c.height = 360; c.getContext('2d').drawImage(cv, 0, 0, 360, 360); saveArt(c.toDataURL('image/jpeg', .72)); recLittle('mandala', true, 0); };
  });
}

// ---------- 🖼️ הגלריה: נשמרת רק בטלפון, אצל כל ילד בנפרד ----------
const artKey = () => 'lbk-art-' + CUR.id;
const artList = () => { try { return JSON.parse(localStorage.getItem(artKey())) || []; } catch { return []; } };
function saveArt(d) {
  if (CUR.demo || (typeof SHOW !== 'undefined' && SHOW.on)) { confetti(40); return toast('🧪 במצב ניסיון לא שומרים בגלריה'); }
  const l = [{ t: Date.now(), d }, ...artList()].slice(0, 12);
  try { localStorage.setItem(artKey(), JSON.stringify(l)); sfx.fanfare(); confetti(60); toast('🖼️ נשמר בגלריה!'); say(T('אֵיזוֹ יְצִירָה יָפָה!', 'אֵיזוֹ יְצִירָה יָפָה!')); }
  catch { toast('⚠️ אין מקום. כדאי למחוק ציור ישן מהגלריה'); }
}
function fGallery() {
  const l = artList();
  show(`${funTop('gallery')}${l.length ? `<div class="gal">${l.map((x, i) => `<button class="galc" data-i="${i}"><img src="${x.d}" alt=""></button>`).join('')}</div>` : `<div class="card center" style="margin-top:20px">${mascot()}<p class="nk" style="margin-top:10px">${T('עוֹד אֵין צִיּוּרִים. צַיֵּר מַשֶּׁהוּ, וְלַחַץ "לִשְׁמֹר בַּגָּלֶרְיָה"', 'עוֹד אֵין צִיּוּרִים. צַיְּרִי מַשֶּׁהוּ, וְלַחֲצִי "לִשְׁמֹר בַּגָּלֶרְיָה"')}</p></div>`}
    <p class="mute small center" style="margin-top:12px">🔒 הציורים נשמרים רק בטלפון הזה (עד 12)</p>`, a => {
    $('#quit', a).onclick = back('gallery');
    $$('.galc', a).forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      openSheet(`<img src="${l[i].d}" alt="" style="width:100%;border-radius:20px"><div class="row" style="gap:10px;margin-top:12px"><button class="btn ghost grow" id="del">🗑️ למחוק</button><button class="btn grow" id="ok">סגירה</button></div>`, s => {
        $('#ok', s).onclick = closeSheet;
        $('#del', s).onclick = () => { const x = artList(); x.splice(i, 1); try { localStorage.setItem(artKey(), JSON.stringify(x)); } catch { } closeSheet(); fGallery(); };
      });
    });
  });
}
