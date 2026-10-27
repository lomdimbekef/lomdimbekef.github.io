// לומדים בכיף — העולם של הקטנים (גיל 3–5)
// עשרות שאלות בכל נושא, סט אחר בכל יום, תמונה אחרת בכל פעם, ומשחק של 5 דקות ברצף
'use strict';
const LITTLE_MIN = 5;                                   // דקות למשחק אחד
const FAV = ['fire', 'mda', 'police', 'bus'];           // מה שנתנאל הכי אוהב: מופיע כל יום
const img = id => pick(IMG[id] || ['']);                // תמונה אחרת בכל פעם
// גיבוי: אם תמונה לא נטענת, מחליפים אותה בתמונה אחרת של אותו דבר
document.addEventListener('error', e => {
  const im = e.target; if (!im || im.tagName !== 'IMG') return;
  const src = im.getAttribute('src'), k = Object.keys(IMG).find(x => IMG[x].includes(src)); if (!k) return;
  const tried = (im.dataset.tried || '') + '|' + src; im.dataset.tried = tried;
  const alt = IMG[k].find(u => !tried.includes(u)); if (alt) im.src = alt;
}, true);
const preload = ids => ids.forEach(id => (IMG[id] || []).forEach(u => { const i = new Image(); i.src = u; }));

// ---------- סט יומי: אותו סדר כל היום, סדר אחר מחר ----------
function seeded(seed) { let a = 0; for (const c of seed) a = (a * 31 + c.charCodeAt(0)) | 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function dailyOrder(list, topic, favFirst) {
  const rnd = seeded(today() + topic), arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  if (favFirst) { const f = arr.filter(favFirst), rest = arr.filter(x => !favFirst(x)); return [f[0], ...rest.slice(0, 3), ...f.slice(1), ...rest.slice(3)].filter(Boolean); }
  return arr;
}

// ---------- בלי חזרות: כל ילד עובר על כל השאלות בנושא, בסדר מעורבב משלו, וממשיך מאיפה שעצר ----------
// רק אחרי שכל השאלות הופיעו מתחיל סבב חדש בסדר אחר. שאלה שהילד טעה בה חוזרת אחרי 3 שאלות אחרות
function nextQ(topic, list, favFirst) {
  const st = CUR ? store.st(CUR.id) : {}, Q = (st.qcur ||= {}), q = Q[topic] ||= { c: 0, p: 0, n: 0, miss: [] };
  q.n++;
  const m = q.miss.findIndex(x => x.at <= q.n && x.k < list.length);
  if (m >= 0) { const k = q.miss.splice(m, 1)[0].k; return list[k]; }
  if (q.p >= list.length) { q.c++; q.p = 0; }
  const rnd = seeded((CUR ? CUR.id : '') + topic + q.c), ord = list.map((_, j) => j);
  for (let j = ord.length - 1; j > 0; j--) { const r = Math.floor(rnd() * (j + 1)); [ord[j], ord[r]] = [ord[r], ord[j]]; }
  if (favFirst) { const f = ord.findIndex(j => favFirst(list[j])); if (f > 0) ord.unshift(ord.splice(f, 1)[0]); }
  const k = ord[q.p++]; q.last = k; store.save(); return list[k];
}
function missQ(topic) { const q = CUR && store.st(CUR.id).qcur?.[topic]; if (q && q.last != null && q.miss.length < 5 && !q.miss.some(x => x.k === q.last)) { q.miss.push({ k: q.last, at: q.n + 3 }); store.save(); } }

// ---------- 🎨 צבעים ----------
const PAINTS = { red: ['#ff2340', 'אָדֹם!'], yellow: ['#ffd000', 'צָהֹב!'], green: ['#19c24a', 'יָרֹק!'], blue: ['#2f8bff', 'כָּחֹל!'], orange: ['#ff8a00', 'כָּתֹם!'] };
const COLOR_QS = [
  ['bus', 'אֵיזֶה צֶבַע הָאוֹטוֹבּוּס שֶׁל אֶגֶד?', 'green'], ['fire', 'אֵיזֶה צֶבַע הַכַּבָּאִית?', 'red'], ['mda', 'אֵיזֶה צֶבַע הָרֶכֶב שֶׁל מָגֵן דָּוִד אָדֹם?', 'yellow'],
  ['pom', 'אֵיזֶה צֶבַע הָרִמּוֹן?', 'red'], ['tomato', 'אֵיזֶה צֶבַע הָעַגְבָנִיָּה?', 'red'], ['cherries', 'אֵיזֶה צֶבַע הַדֻּבְדְּבָנִים?', 'red'],
  ['ladybug', 'אֵיזֶה צֶבַע פָּרַת מֹשֶׁה רַבֵּנוּ?', 'red'], ['redpepper', 'אֵיזֶה צֶבַע הַפִּלְפֵּל?', 'red'], ['straw', 'אֵיזֶה צֶבַע הַתּוּת?', 'red'],
  ['apple', 'אֵיזֶה צֶבַע הַתַּפּוּחַ?', 'red'], ['banana', 'אֵיזֶה צֶבַע הַבָּנָנָה?', 'yellow'], ['lemon', 'אֵיזֶה צֶבַע הַלִּימוֹן?', 'yellow'],
  ['corn', 'אֵיזֶה צֶבַע הַתִּירָס?', 'yellow'], ['sunflower', 'אֵיזֶה צֶבַע הַחַמָּנִית?', 'yellow'], ['leaf', 'אֵיזֶה צֶבַע הֶעָלֶה?', 'green'],
  ['cucumber', 'אֵיזֶה צֶבַע הַמְּלָפְפוֹן?', 'green'], ['frog', 'אֵיזֶה צֶבַע הַצְּפַרְדֵּעַ?', 'green'], ['grapes', 'אֵיזֶה צֶבַע הָעֲנָבִים?', 'green'],
  ['sea', 'אֵיזֶה צֶבַע הַיָּם?', 'blue'], ['sky', 'אֵיזֶה צֶבַע הַשָּׁמַיִם?', 'blue'], ['blueberries', 'אֵיזֶה צֶבַע הָאֻכְמָנִיּוֹת?', 'blue'],
  ['orange', 'אֵיזֶה צֶבַע הַתַּפּוּז?', 'orange'], ['carrot', 'אֵיזֶה צֶבַע הַגֶּזֶר?', 'orange'], ['pumpkin', 'אֵיזֶה צֶבַע הַדְּלַעַת?', 'orange'],
  ['goldfish', 'אֵיזֶה צֶבַע דַּג הַזָּהָב?', 'orange'],
];

// ---------- שאלות "תמונה ← בוחרים תמונה" (5 נושאים) ----------
// [סצנה, שאלה, תשובה, מה הקריין אומר בסוף]. סצנה: מזהה תמונה, 'rain', או אימוג'י
const PICK_TOPICS = {
  homes: { t: '🏠 איפה גרים?', qs: [
    ['kennel', 'מִי גָּר בַּמְּלוּנָה?', 'dog', 'כֶּלֶב!'], ['nest', 'מִי גָּר בַּקֵּן?', 'bird', 'צִפּוֹר!'], ['beehive', 'מִי גָּר בַּכַּוֶּרֶת?', 'bee', 'דְּבוֹרָה!'],
    ['coop', 'מִי גָּר בַּלּוּל?', 'hen', 'תַּרְנְגֹלֶת!'], ['stable', 'מִי גָּר בָּאֻרְוָה?', 'horse', 'סוּס!'], ['cave', 'מִי גָּר בַּמְּעָרָה?', 'bear', 'דֹּב!'],
    ['spiderweb', 'מִי גָּר בְּקוּרֵי הָעַכָּבִישׁ?', 'spider', 'עַכָּבִישׁ!'], ['sea', 'מִי גָּר בַּיָּם?', 'fish', 'דָּג!'], ['ice', 'מִי גָּר עַל הַקֶּרַח?', 'penguin', 'פִּינְגְּוִין!'],
    ['sea', 'מִי קוֹפֵץ בַּיָּם?', 'dolphin', 'דּוֹלְפִין!'],
  ] },
  needs: { t: '☂️ מה צריך?', qs: [
    ['rain', 'יוֹרֵד גֶּשֶׁם! מָה צָרִיךְ כְּדֵי לֹא לְהִתְרַטֵּב?', 'umb', 'מִטְרִיָּה!'], ['snow', 'קַר וְיֵשׁ שֶׁלֶג! מָה לוֹבְשִׁים?', 'coat', 'מְעִיל!'],
    ['night', 'חֹשֶׁךְ בַּלַּיְלָה! מָה צָרִיךְ כְּדֵי לִרְאוֹת?', 'flashlight', 'פָּנָס!'], ['😁', 'רוֹצִים לְצַחְצֵחַ שִׁנַּיִם. מָה צָרִיךְ?', 'toothbrush', 'מִבְרֶשֶׁת שִׁנַּיִם!'],
    ['💧', 'רוֹצִים לִשְׁתּוֹת מַיִם. מָה צָרִיךְ?', 'cupwater', 'כּוֹס מַיִם!'], ['📄', 'רוֹצִים לְצַיֵּר. מָה צָרִיךְ?', 'crayons', 'צְבָעִים!'],
    ['🌙', 'הוֹלְכִים לִישֹׁן. אֵיפֹה יְשֵׁנִים?', 'bed', 'בַּמִּטָּה!'], ['💇', 'רוֹצִים לְסָרֵק אֶת הַשֵּׂעָר. מָה צָרִיךְ?', 'comb', 'מַסְרֵק!'],
    ['🤲', 'הַיָּדַיִם מְלֻכְלָכוֹת! בַּמֶּה רוֹחֲצִים?', 'soap', 'סַבּוֹן!'], ['📃', 'רוֹצִים לִגְזֹר נְיָר. מָה צָרִיךְ?', 'scissors', 'מִסְפָּרַיִם!'],
    ['🔥', 'יֵשׁ שְׂרֵפָה! מִי בָּא לְכַבּוֹת?', 'fire', 'כַּבָּאִית!'], ['🤕', 'מִישֶׁהוּ נִפְצַע! מִי בָּא לַעֲזֹר?', 'mda', 'מָגֵן דָּוִד אָדֹם!'],
    ['🚦', 'מִי שׁוֹמֵר עָלֵינוּ בַּכְּבִישׁ?', 'police', 'נַיֶּדֶת מִשְׁטָרָה!'],
  ] },
  mothers: { t: '🐣 אמא ותינוק', qs: [
    ['cow', 'מִי הַתִּינוֹק שֶׁל הַפָּרָה?', 'calf', 'עֵגֶל!'], ['hen', 'מִי הַתִּינוֹק שֶׁל הַתַּרְנְגֹלֶת?', 'chick', 'אֶפְרוֹחַ!'],
    ['sheep', 'מִי הַתִּינוֹק שֶׁל הַכִּבְשָׂה?', 'lamb', 'טָלֶה!'], ['horse', 'מִי הַתִּינוֹק שֶׁל הַסּוּסָה?', 'foal', 'סְיָח!'],
    ['cat', 'מִי הַתִּינוֹק שֶׁל הֶחָתוּלָה?', 'kitten', 'גּוּר חֲתוּלִים!'], ['dog', 'מִי הַתִּינוֹק שֶׁל הַכַּלְבָּה?', 'puppy', 'גּוּר כְּלָבִים!'],
    ['elephant', 'מִי הַתִּינוֹק שֶׁל הַפִּילָה?', 'babyelephant', 'פִּילוֹן!'], ['lioness', 'מִי הַתִּינוֹק שֶׁל הַלְּבִיאָה?', 'lioncub', 'גּוּר אֲרָיוֹת!'],
    ['goat', 'מִי הַתִּינוֹק שֶׁל הָעֵז?', 'goatkid', 'גְּדִי!'], ['butterfly', 'מִמָּה הַפַּרְפַּר מַתְחִיל?', 'caterpillar', 'זַחַל!'],
  ] },
  jobs: { t: '🚒 מי נוסע? מי צריך?', qs: [
    ['firefighter', 'מָה צָרִיךְ הַכַּבַּאי?', 'fire', 'כַּבָּאִית!'], ['doctor', 'מָה צָרִיךְ הָרוֹפֵא?', 'stethoscope', 'סְטֶטוֹסְקוֹפּ!'],
    ['farmer', 'מָה צָרִיךְ הַחַקְלַאי?', 'tractor', 'טְרַקְטוֹר!'], ['pilot', 'מָה מַטִּיס הַטַּיָּס?', 'airplane', 'מָטוֹס!'],
    ['policeman', 'בַּמֶּה נוֹסֵעַ הַשּׁוֹטֵר?', 'police', 'נַיֶּדֶת!'], ['sky', 'מָה טָס בַּשָּׁמַיִם?', 'helicopter', 'מַסּוֹק!'],
    ['sea', 'מָה שָׁט בַּיָּם?', 'ship', 'אֳנִיָּה!'], ['sea', 'בַּמֶּה שׁוֹמֶרֶת הַמִּשְׁטָרָה עַל הַיָּם?', 'policeboat', 'סִירַת מִשְׁטָרָה!'],
    ['🛤️', 'מָה נוֹסֵעַ עַל מְסִלַּת בַּרְזֶל?', 'train', 'רַכֶּבֶת!'], ['🚏', 'אֶת מִי מְחַכִּים בַּתַּחֲנָה?', 'bus', 'אוֹטוֹבּוּס!'],
    ['🏥', 'מִי לוֹקֵחַ חוֹלִים לְבֵית הַחוֹלִים?', 'mda', 'אַמְבּוּלַנְס!'], ['🚨', 'מִי נוֹסֵעַ עִם סִירֵנָה אֲדֻמָּה?', 'fire', 'כַּבָּאִית!'],
  ] },
  food: { t: '🍌 מה אוכלים?', qs: [
    ['monkey', 'מָה אוֹכֵל הַקּוֹף?', 'banana', 'בָּנָנָה!'], ['rabbit', 'מָה אוֹכֵל הָאַרְנָב?', 'carrot', 'גֶּזֶר!'], ['mouse', 'מָה אוֹכֵל הָעַכְבָּר?', 'cheese', 'גְּבִינָה!'],
    ['cow', 'מָה אוֹכֶלֶת הַפָּרָה?', 'grass', 'עֵשֶׂב!'], ['dog', 'מָה אוֹהֵב הַכֶּלֶב?', 'bone', 'עֶצֶם!'], ['bird', 'מָה אוֹכֶלֶת הַצִּפּוֹר?', 'seeds', 'זְרָעִים!'],
    ['bee', 'עַל מָה יוֹשֶׁבֶת הַדְּבוֹרָה?', 'flower', 'פֶּרַח!'], ['panda', 'מָה אוֹכֶלֶת הַפַּנְדָּה?', 'bamboo', 'בַּמְבּוּק!'], ['squirrel', 'מָה אוֹכֵל הַסְּנָאִי?', 'nuts', 'אֱגוֹזִים!'],
    ['horse', 'מָה אוֹכֵל הַסּוּס?', 'carrot', 'גֶּזֶר!'],
  ] },
};
// סופרים: [תמונה, שאלה]
const COUNT_QS = [['fire', 'כַּמָּה כַּבָּאִיּוֹת יֵשׁ?'], ['bus', 'כַּמָּה אוֹטוֹבּוּסִים יֵשׁ?'], ['mda', 'כַּמָּה אַמְבּוּלַנְסִים יֵשׁ?'], ['police', 'כַּמָּה נַיָּדוֹת יֵשׁ?'],
  ['apple', 'כַּמָּה תַּפּוּחִים יֵשׁ?'], ['straw', 'כַּמָּה תּוּתִים יֵשׁ?'], ['pom', 'כַּמָּה רִמּוֹנִים יֵשׁ?'], ['duck', 'כַּמָּה בַּרְוָזִים יֵשׁ?'],
  ['ladybug', 'כַּמָּה פָּרוֹת מֹשֶׁה רַבֵּנוּ יֵשׁ?'], ['kitten', 'כַּמָּה חֲתַלְתּוּלִים יֵשׁ?'], ['butterfly', 'כַּמָּה פַּרְפָּרִים יֵשׁ?'], ['airplane', 'כַּמָּה מְטוֹסִים יֵשׁ?']];
// מה לא שייך: קבוצות
const GROUPS = {
  fruit: ['apple', 'banana', 'orange', 'straw', 'pom', 'lemon', 'grapes', 'watermelon', 'cherries'],
  car: ['fire', 'mda', 'police', 'bus', 'train', 'airplane', 'tractor', 'helicopter', 'ship', 'bicycle'],
  animal: ['dog', 'cat', 'cow', 'horse', 'lion', 'elephant', 'monkey', 'rabbit', 'duck', 'sheep', 'goat', 'bear', 'panda', 'penguin'],
  thing: ['coat', 'shoe', 'shirt', 'teddy', 'bed', 'scissors', 'comb', 'toothbrush'],
};
const BAL_COLORS = { red: ['#ff2340', 'פּוֹצֵץ אֶת כָּל הַבַּלּוֹנִים הָאֲדֻמִּים!', 'פּוֹצְצִי אֶת כָּל הַבַּלּוֹנִים הָאֲדֻמִּים!'], yellow: ['#ffd000', 'פּוֹצֵץ אֶת כָּל הַבַּלּוֹנִים הַצְּהֻבִּים!', 'פּוֹצְצִי אֶת כָּל הַבַּלּוֹנִים הַצְּהֻבִּים!'], green: ['#19c24a', 'פּוֹצֵץ אֶת כָּל הַבַּלּוֹנִים הַיְּרֻקִּים!', 'פּוֹצְצִי אֶת כָּל הַבַּלּוֹנִים הַיְּרֻקִּים!'], blue: ['#2f8bff', 'פּוֹצֵץ אֶת כָּל הַבַּלּוֹנִים הַכְּחֻלִּים!', 'פּוֹצְצִי אֶת כָּל הַבַּלּוֹנִים הַכְּחֻלִּים!'], orange: ['#ff8a00', 'פּוֹצֵץ אֶת כָּל הַבַּלּוֹנִים הַכְּתֻמִּים!', 'פּוֹצְצִי אֶת כָּל הַבַּלּוֹנִים הַכְּתֻמִּים!'] };

const LITTLE_MENU = [
  { id: 'colors', e: '🎨', n: 'צבעים', bg: 'var(--g1)' }, { id: 'homes', e: '🏠', n: 'איפה גרים?', bg: 'var(--g3)' },
  { id: 'needs', e: '☂️', n: 'מה צריך?', bg: 'var(--g2)' }, { id: 'jobs', e: '🚒', n: 'מי נוסע? מי צריך?', bg: 'var(--g4)' },
  { id: 'mothers', e: '🐣', n: 'אמא ותינוק', bg: 'var(--g5)' }, { id: 'food', e: '🍌', n: 'מה אוכלים?', bg: 'var(--g1)' },
  { id: 'count', e: '🍎', n: 'סופרים', bg: 'var(--g3)' }, { id: 'odd', e: '🧩', n: 'מה לא שייך?', bg: 'var(--g2)' },
  { id: 'balloons2', e: '🎈', n: 'בלונים בצבעים', bg: 'var(--g4)' }, { id: 'memory', e: '🃏', n: 'זיכרון', bg: 'var(--g5)' },
  { id: 'sounds', e: '🔊', n: 'מי עושה את הקול?', bg: 'var(--g1)', soon: 1 },
];
const LITTLE_GAMES = LITTLE_MENU.map(x => x.id);

// ---------- רשומה להתקדמות ----------
function recLittle(game, ok, ms) {
  const s = store.st(CUR.id), gm = s.games[game] ||= { n: 0, c: 0, rounds: 0, ms: 0 };
  gm.n++; if (ok) { gm.c++; s.stars++; } gm.ms += Math.min(ms, 30000);
  s.events.push({ t: Date.now(), g: game, op: game, ok: ok ? 1 : 0, ms: Math.round(ms) }); if (s.events.length > 600) s.events.splice(0, s.events.length - 600);
  store.save();
}
const qLine = q => `<div class="lq nk"><span>${strip(q)}</span><button class="spk big" data-say="${esc(q)}" aria-label="השמעה">🔊</button></div>`;
const photoHTML = (id, gray) => `<div class="photo ${gray ? 'gray' : ''}"><img src="${img(id)}" alt="" onload="this.style.opacity=1" style="opacity:0;transition:opacity .3s"><div class="burst"></div></div>`;
const sceneHTML = s => s === 'rain' ? `<div class="rainbox"><div class="cloud2">☁️</div>${Array.from({ length: 26 }, () => `<i class="drop" style="left:${R(100)}%;animation-delay:-${Math.random().toFixed(2)}s;animation-duration:${(.5 + Math.random() * .5).toFixed(2)}s"></i>`).join('')}</div>`
  : IMG[s] ? photoHTML(s) : `<div class="emojibox">${s}</div>`;

// ---------- משחק של 5 דקות: מנוע משותף ----------
// game(i, done) מציג שאלה אחת וקורא ל־done(ok) כשהילד מצליח
function littleSession(id, title, game) {
  const t0 = Date.now(), res = []; let i = 0;
  const step = () => {
    if (Date.now() - t0 >= LITTLE_MIN * 60e3) return endRound(id, res.length ? res : [true]);
    show(`<div class="topbar">${backBtn().replace('id="back"', 'id="quit"')}<div class="title">${title}</div><span class="starpill">⭐ ${store.st(CUR.id).stars}</span></div>
      <div class="tbar"><i style="width:${Math.min(100, (Date.now() - t0) / (LITTLE_MIN * 600))}%"></i></div><div id="gm"></div>`, a => {
      $('#quit', a).onclick = () => (isBig() ? funHub('baby') : home());
      game($('#gm', a), i, ok => { res.push(ok); i++; res.length % 5 === 0 ? party(step) : setTimeout(step, 400); });
    });
  };
  step();
}
// חגיגה קטנה כל 5 תשובות
function party(next) {
  const t = 'וָאוּ! עוֹד חֲמִשָּׁה כּוֹכָבִים!', ts = 'וָאוּ!|@name|עוֹד חֲמִשָּׁה כּוֹכָבִים!';
  show(`<div class="result" style="margin-top:40px"><div class="dance">${mascot('lg')}</div><div class="bigstars">${'<i>⭐</i>'.repeat(5)}</div><h1 class="nk">${strip(t)}</h1></div>`, () => {
    sfx.fanfare(); confetti(90); sayThen(ts, () => setTimeout(next, 600));
  });
}

// ---------- המשחקים ----------
function lColors(box, i, done) {
  const [id, q, ans] = nextQ('colors', COLOR_QS, x => FAV.includes(x[0]));
  let tries = 0; const t0 = performance.now();
  const opts = shuffle(Object.keys(PAINTS).filter(k => k !== ans)).slice(0, 2); opts.splice(R(3), 0, ans);
  box.innerHTML = `${qLine(q)}${photoHTML(id, true)}<div class="palette">${opts.map(k => `<button class="paint" data-c="${k}" style="background:${PAINTS[k][0]}" aria-label="${strip(PAINTS[k][1])}"></button>`).join('')}</div>`;
  setTimeout(() => voice.say(q), 250);
  $$('.paint', box).forEach(b => b.onclick = () => {
    if (b.dataset.c !== ans) { if (!tries) missQ('colors'); tries++; return bad(b); }
    $$('.paint', box).forEach(x => x.disabled = true); const ph = $('.photo', box); ph.classList.remove('gray'); ph.classList.add('win');
    recLittle('colors', !tries, performance.now() - t0); good(PAINTS[ans][1], () => done(!tries));
  });
}
function lPick(topic) {
  return (box, i, done) => {
    const T = PICK_TOPICS[topic], [scene, q, ans, name, wrong] = nextQ(topic, T.qs, x => FAV.includes(x[2]) || FAV.includes(x[0]));
    const pool = [...new Set((wrong || T.qs.map(x => x[2])).filter(x => x !== ans && IMG[x]))];
    const opts = shuffle([ans, ...shuffle(pool).slice(0, 2)]);
    let tries = 0; const t0 = performance.now();
    box.innerHTML = `${qLine(q)}${scene ? `<div class="scene">${sceneHTML(scene)}</div>` : ''}<div class="opts ${scene ? '' : 'big'}">${opts.map(o => `<button class="opt" data-k="${o}"><img src="${img(o)}" alt=""></button>`).join('')}</div>`;
    // "אותו דבר": בתשובה תמונה אחרת מזו שלמעלה
    if (scene === ans && (IMG[ans] || []).length > 1) { const top = $('.scene img', box)?.getAttribute('src'), o = $(`.opt[data-k="${ans}"] img`, box); if (o && top) o.src = pick(IMG[ans].filter(u => u !== top)); }
    setTimeout(() => voice.say(q), 250);
    $$('.opt', box).forEach(b => b.onclick = () => {
      if (b.dataset.k !== ans) { if (!tries) missQ(topic); tries++; return bad(b); }
      $$('.opt', box).forEach(x => x.disabled = true); b.classList.add('good'); const sc = $('.scene', box)?.firstElementChild; sc && sc.classList.add('win');
      recLittle(topic, !tries, performance.now() - t0); good(name, () => done(!tries));
    });
  };
}
function lCount(box, i, done) {
  const [id, q] = nextQ('count', COUNT_QS, x => FAV.includes(x[0]));
  const n = 1 + R(i < 4 ? 3 : 5), opts = shuffle([n, ...shuffle([1, 2, 3, 4, 5].filter(x => x !== n)).slice(0, 2)]);
  let tries = 0; const t0 = performance.now();
  box.innerHTML = `${qLine(q)}<div class="countbox">${Array.from({ length: n }, () => `<div class="citem"><img src="${img(id)}" alt=""></div>`).join('')}</div>
    <div class="answers">${opts.map(v => `<button class="ans num" data-v="${v}">${v}<small>${'●'.repeat(v)}</small></button>`).join('')}</div>`;
  setTimeout(() => voice.say(q), 250);
  $$('.ans', box).forEach(b => b.onclick = () => {
    if (+b.dataset.v !== n) { if (!tries) missQ('count'); tries++; return bad(b); }
    $$('.ans', box).forEach(x => x.disabled = true); b.classList.add('good'); recLittle('count', !tries, performance.now() - t0);
    const items = $$('.citem', box);
    voice.say(Array.from({ length: n }, (_, j) => '#' + (j + 1)).join('|'), () => good('', () => done(!tries)), k => items.forEach((x, j) => x.classList.toggle('lit', j <= k)));
  });
}
function lOdd(box, i, done) {
  const keys = Object.keys(GROUPS), main = Math.random() < .4 ? 'car' : pick(keys), other = pick(keys.filter(k => k !== main));
  const three = shuffle(GROUPS[main]).slice(0, 3), odd = pick(GROUPS[other]);
  if (main === 'car' && !three.some(x => FAV.includes(x))) three[0] = pick(FAV);
  const all = shuffle([...three, odd]), q = 'מָה לֹא שַׁיָּךְ?';
  let tries = 0; const t0 = performance.now();
  box.innerHTML = `${qLine(q)}<div class="grid4">${all.map(o => `<button class="opt big4" data-k="${o}"><img src="${img(o)}" alt=""></button>`).join('')}</div>`;
  setTimeout(() => voice.say(q), 250);
  $$('.opt', box).forEach(b => b.onclick = () => {
    if (b.dataset.k !== odd) { tries++; return bad(b); }
    $$('.opt', box).forEach(x => x.disabled = true); b.classList.add('good'); recLittle('odd', !tries, performance.now() - t0); good('', () => done(!tries));
  });
}
function lBalloons(box, i, done) {
  const keys = Object.keys(BAL_COLORS), target = keys[i % keys.length], [col, qm, qf] = BAL_COLORS[target], q = isF() ? qf : qm;
  const others = keys.filter(k => k !== target), list = shuffle([...Array(4).fill(target), ...Array.from({ length: 4 }, () => pick(others))]);
  let left = 4, tries = 0; const t0 = performance.now();
  box.innerHTML = `${qLine(q)}<div class="sky lsky">${list.map((k, j) => `<button class="balloon lb" data-c="${k}" style="background:${BAL_COLORS[k][0]};left:${4 + (j % 4) * 24}%;animation-duration:${11 + Math.random() * 4}s;animation-delay:${(j * .9).toFixed(1)}s"></button>`).join('')}</div>`;
  setTimeout(() => voice.say(q), 250);
  $$('.lb', box).forEach(b => {
    b.addEventListener('animationend', e => { if (e.animationName === 'rise' && !b.classList.contains('popd')) { b.style.animation = 'none'; void b.offsetWidth; b.style.animation = ''; } });
    b.onclick = () => {
      if (b.dataset.c !== target) { tries++; return bad(); }
      b.classList.add('popd'); sfx.pop(); left--;
      if (!left) { recLittle('balloons2', tries < 2, performance.now() - t0); good('', () => done(tries < 2)); }
    };
  });
}
function lMemory(box, i, done) {
  const pairs = i < 2 ? 3 : 4, ids = shuffle([...FAV.slice(0, 2), ...shuffle(['pom', 'apple', 'dog', 'cat', 'duck', 'lion', 'elephant', 'train', 'airplane', 'monkey', 'panda', 'penguin', 'banana', 'straw'])]).slice(0, pairs);
  const cards = shuffle(ids.flatMap(id => { const u = img(id); return [{ id, u }, { id, u }]; }));
  const q = 'מְצָא אֶת הַזּוּגוֹת!', qf = 'מִצְאִי אֶת הַזּוּגוֹת!';
  let open = [], found = 0, flips = 0; const t0 = performance.now();
  box.innerHTML = `${qLine(isF() ? qf : q)}<div class="mem m${pairs}">${cards.map((c, j) => `<button class="mcard" data-j="${j}"><div class="in"><div class="fr">⭐</div><div class="bk"><img src="${c.u}" alt=""></div></div></button>`).join('')}</div>`;
  setTimeout(() => voice.say(isF() ? qf : q), 250);
  $$('.mcard', box).forEach(b => b.onclick = () => {
    if (open.length >= 2 || b.classList.contains('on')) return;
    b.classList.add('on'); sfx.tap(); open.push(b); flips++;
    if (open.length < 2) return;
    const [a1, a2] = open;
    if (cards[a1.dataset.j].id === cards[a2.dataset.j].id) {
      found++; open = []; sfx.win(); confetti(15); [a1, a2].forEach(x => x.classList.add('got'));
      if (found === pairs) { recLittle('memory', flips <= pairs * 3, performance.now() - t0); good('', () => done(true)); }
      else voice.say(isF() ? 'מָצָאת זוּג!' : 'מָצָאתָ זוּג!');
    } else setTimeout(() => { a1.classList.remove('on'); a2.classList.remove('on'); open = []; }, 900);
  });
}
const LITTLE_RUN = {
  colors: lColors, count: lCount, odd: lOdd, balloons2: lBalloons, memory: lMemory,
  homes: lPick('homes'), needs: lPick('needs'), mothers: lPick('mothers'), jobs: lPick('jobs'), food: lPick('food'),
};
function startLittle(id) {
  const m = LITTLE_MENU.find(x => x.id === id);
  if (m.soon) { toast('🚧 בקרוב!'); return voice.say('בְּקָרוֹב! נִיצוֹץ עוֹבֵד עַל זֶה'); }
  preload(FAV);
  littleSession(id, `${m.e} ${m.n}`, LITTLE_RUN[id]);
}
