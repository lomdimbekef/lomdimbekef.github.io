// לומדים בכיף — חשבון: מנוע שאלות שמתאים את עצמו לילד, ו־4 משחקים
'use strict';
const OPS = { '+': 'חיבור', '-': 'חיסור', '×': 'כפל', '÷': 'חילוק' };
const SPEEDS = { slow: { s: 14, n: '🐢 איטי' }, normal: { s: 10, n: '🐇 רגיל' }, fast: { s: 7, n: '🚀 מהיר' }, auto: { s: 0, n: '🤖 אוטומטי' } };
const mathCfg = kid => ({ ...DEF_MATH, ...(kid.math || {}) });

// ---------- המנוע ----------
const engine = {
  opStat(kid, op) { const s = store.st(kid.id); return s.ops[op] ||= { n: 0, c: 0, recent: [] }; },
  level(kid, op) { return store.st(kid.id).level[op] || 2; },
  // בוחרים פעולה: מה שקשה יותר לילד מופיע יותר
  pickOp(kid) {
    const ops = mathCfg(kid).ops;
    const w = ops.map(op => { const r = this.opStat(kid, op).recent; const acc = r.length ? r.filter(Boolean).length / r.length : .7; return 1 + (1 - acc) * 2.5; });
    let x = Math.random() * w.reduce((a, b) => a + b, 0);
    for (let i = 0; i < ops.length; i++) { x -= w[i]; if (x <= 0) return ops[i]; }
    return ops[0];
  },
  make(kid, op = this.pickOp(kid)) {
    const max = mathCfg(kid).max, lvl = this.level(kid, op);
    const cap = Math.max(5, Math.round(max * lvl / 5));
    let a, b, ans;
    if (op === '+') { ans = 2 + R(cap - 1); a = 1 + R(ans - 1); b = ans - a; }
    else if (op === '-') { a = 2 + R(cap - 1); b = R(a + 1); ans = a - b; }
    else {
      const fmax = max <= 20 ? 5 : max <= 100 ? Math.min(10, 3 + lvl * 2) : Math.min(12, 4 + lvl * 2);
      do { a = 1 + R(fmax); b = 1 + R(fmax); } while (a * b > max);
      if (op === '×') ans = a * b; else { ans = a; a = a * b; }
    }
    return { op, a, b, ans, text: `${a} ${op} ${b}` };
  },
  options(q, n = 3) {
    const set = new Set([q.ans]);
    const near = [q.ans + 1, q.ans - 1, q.ans + 2, q.ans - 2, q.ans + 10, q.ans - 10, q.op === '-' ? q.a + q.b : q.ans + 3, q.op === '×' ? q.a + q.b : q.ans - 3];
    for (const v of shuffle(near)) { if (set.size >= n) break; if (v >= 0) set.add(v); }
    while (set.size < n) set.add(q.ans + 1 + R(9));
    return shuffle([...set]);
  },
  record(kid, game, q, ok, ms) {
    const s = store.st(kid.id), o = this.opStat(kid, q.op);
    o.n++; if (ok) o.c++; o.recent.push(ok ? 1 : 0); if (o.recent.length > 10) o.recent.shift();
    const gm = s.games[game] ||= { n: 0, c: 0, rounds: 0, ms: 0 }; gm.n++; if (ok) gm.c++; gm.ms += Math.min(ms, 30000);
    s.events.push({ t: Date.now(), g: game, op: q.op, ok: ok ? 1 : 0, ms: Math.round(ms) }); if (s.events.length > 600) s.events.splice(0, s.events.length - 600);
    // רמה: שומרים על הצלחה של בערך 8 מתוך 10
    const last = o.recent.slice(-6), lv = s.level[q.op] || 2;
    if (last.length >= 6 && last.filter(Boolean).length >= 5 && lv < 5) { s.level[q.op] = lv + 1; o.recent = []; }
    else if (last.length >= 4 && last.slice(-4).filter(Boolean).length <= 1 && lv > 1) { s.level[q.op] = lv - 1; o.recent = []; }
    if (ok) s.stars += 1;
    store.save();
  },
  avgMs(kid) { const ev = store.st(kid.id).events.filter(e => e.ok).slice(-15); return ev.length ? ev.reduce((a, e) => a + e.ms, 0) / ev.length : 6000; },
};
const eqHTML = (q, shown = '?') => `<span>${q.a}</span>&nbsp;${q.op}&nbsp;<span>${q.b}</span>&nbsp;=&nbsp;<span class="q">${shown}</span>`;
const dotsHTML = (res, i, n) => `<div class="dots">${Array.from({ length: n }, (_, k) => `<i class="${k < res.length ? (res[k] ? 'ok' : 'no') : k === i ? 'cur' : ''}"></i>`).join('')}</div>`;
const sayQ = q => voice.say(`כַּמָּה זֶה|#${q.a}|${OPW[q.op]}|#${q.b}`);

// ---------- מסך המשחקים ----------
const MATH_GAMES = [
  { id: 'balloons', n: 'בלונים', ic: '🎈', anim: 'a-fly', bg: 'var(--g1)', d: 'מפוצצים את התשובה' },
  { id: 'swipe', n: 'נכון או לא?', ic: '👆', anim: 'a-swipe', bg: 'var(--g2)', d: 'מחליקים ימינה או שמאלה' },
  { id: 'race', n: 'מרוץ', ic: '🏎️', anim: 'a-fly', bg: 'var(--g3)', d: 'כל תשובה דוחפת את המכונית' },
  { id: 'test', n: 'מבחן המלך', ic: '👑', anim: 'a-zoom', bg: 'var(--g4)', d: 'כותבים לבד את התשובה' },
];
let roundsThisSession = 0;
function mathHub() {
  const kid = CUR, s = store.st(kid.id), cfg = mathCfg(kid);
  show(`<div class="topbar">${backBtn()}<div class="title">🧮 חשבון</div><span class="starpill">⭐ ${s.stars}</span></div>
    <div class="row" style="align-items:flex-end;margin-bottom:12px">${mascot('sm')}<div class="bubble grow">${G('בְּמָה בָּא לְךָ לְשַׂחֵק?', 'בְּמָה בָּא לָךְ לְשַׂחֵק?')}</div></div>
    <div class="games">${MATH_GAMES.map((g, i) => `<button class="game" data-g="${g.id}" style="background:${g.bg};animation-delay:${i * .07}s"><span class="ic ${g.anim}">${g.ic}</span><b>${g.n}</b><small>${g.d}</small></button>`).join('')}</div>
    <p class="mute small center" style="margin-top:14px">תרגילים: ${cfg.ops.map(o => OPS[o]).join(', ')} · עד ${cfg.max}</p>`, a => {
    $('#back', a).onclick = home;
    voice.say(G('בְּמָה בָּא לְךָ לְשַׂחֵק?', 'בְּמָה בָּא לָךְ לְשַׂחֵק?'));
    $$('[data-g]', a).forEach(b => b.onclick = () => { sfx.tap(); startGame(b.dataset.g); });
  });
}
let CUR_GAME = null; // המשחק שרץ עכשיו (בשביל כפתור 🎬 הדגמה)
function startGame(id) {
  CUR_GAME = id;
  if (limitLeft(CUR) <= 0) return timeUp();
  if (LITTLE_GAMES.includes(id)) return startLittle(id);
  // 🎓 בפעם הראשונה: הסבר קצר עם הדגמה (ובמצאו את ההבדלים גם סיבוב ניסיון)
  if (typeof needHowto === 'function' && needHowto(id)) return howto(id, () => startGame(id), id === 'diff' ? () => fDiff([], true) : null);
  roundStart();
  if (NATURE_IDS.includes(id)) return NATURE_RUN[id]();
  if (FUN_GAME[id]) return FUN_GAME[id].g.run();
  ({ balloons: gameBalloons, swipe: gameSwipe, race: gameRace, test: gameTest, pairs: gamePairs, catch: gameCatch, shop: gameShop, islands: gameIslands })[id]();
}
function endRound(game, res, extra = '') {
  const kid = CUR, s = store.st(kid.id), ok = res.filter(Boolean).length, n = res.length;
  const gm = s.games[game] ||= { n: 0, c: 0, rounds: 0, ms: 0 }; gm.rounds++;
  const bonus = 3; s.stars += bonus; store.save();
  const lvUp = typeof levelAfterRound === 'function' ? levelAfterRound(game, res) : 0;
  if (lvUp > 0) setTimeout(() => toast(G('⬆️ עָלִיתָ רָמָה בַּמִּשְׂחָק הַזֶּה!', '⬆️ עָלִית רָמָה בַּמִּשְׂחָק הַזֶּה!')), 1200);
  const little = LITTLE_GAMES.includes(game), hub = little ? (isBig() ? () => funHub('baby') : () => home()) : FUN_GAME[game] ? () => funHub(FUN_GAME[game].sid) : NATURE_IDS.includes(game) ? natureHub : mathHub;
  const stars = little ? 3 : ok / n >= .9 ? 3 : ok / n >= .6 ? 2 : 1;
  const msg = little ? G('כָּל הַכָּבוֹד! סִיַּמְתָּ אֶת הַמִּשְׂחָק!', 'כָּל הַכָּבוֹד! סִיַּמְתְּ אֶת הַמִּשְׂחָק!') : stars === 3 ? G('אַתָּה אַלּוּף! כִּמְעַט הַכֹּל נָכוֹן!', 'אַתְּ אַלּוּפָה! כִּמְעַט הַכֹּל נָכוֹן!') : stars === 2 ? G('יָפֶה מְאֹד! רָאִיתִי שֶׁהִתְאַמַּצְתָּ!', 'יָפֶה מְאֹד! רָאִיתִי שֶׁהִתְאַמַּצְתְּ!') : G('אֵיזֶה יֹפִי שֶׁלֹּא וִתַּרְתָּ! בַּפַּעַם הַבָּאָה יִהְיֶה עוֹד יוֹתֵר טוֹב.', 'אֵיזֶה יֹפִי שֶׁלֹּא וִתַּרְתְּ! בַּפַּעַם הַבָּאָה יִהְיֶה עוֹד יוֹתֵר טוֹב.');
  roundsThisSession++;
  show(`<div class="topbar">${backBtn()}<div class="title"></div><span class="starpill">⭐ ${s.stars}</span></div><div class="result">${extra || mascot('lg')}
    <div class="bigstars">${[0, 1, 2].map(i => `<i style="animation-delay:${.2 + i * .25}s;${i < stars ? '' : 'filter:grayscale(1);opacity:.3'}">⭐</i>`).join('')}</div>
    ${little ? '' : `<h1>${ok} מתוך ${n}</h1>`}
    <div class="bubble" style="margin:14px 0;text-align:center">${msg}</div>
    <p class="mute">+${ok + bonus} כוכבים · סה״כ ⭐ ${s.stars}</p>
    <div class="stack" style="margin-top:18px"><button class="btn full" id="again">🔁 עוד סיבוב</button><button class="btn ghost full" id="other">🎮 משחק אחר</button></div></div>`, a => {
    sfx.fanfare(); if (stars >= 2) confetti(70); setTimeout(() => voice.say(msg), 400);
    const go = f => () => (!little && roundsThisSession % 2 === 0 ? surprise(f) : f());
    $('#again', a).onclick = go(() => startGame(game)); $('#other', a).onclick = go(hub);
    $('#back', a).onclick = hub;
  });
}
// כל משחק של הגדולים נמשך 5 דקות ברצף, עם פס זמן (כמו אצל הקטנים)
const ROUND_MIN = 5; let roundT0 = Date.now();
const roundStart = () => { roundT0 = Date.now(); };
const roundOver = () => Date.now() - roundT0 >= ROUND_MIN * 60e3;
const roundPct = () => Math.min(100, (Date.now() - roundT0) / (ROUND_MIN * 600));
const gameTop = (title, res) => `<div class="topbar">${backBtn().replace('id="back"', 'id="quit"')}<div class="title">${title}</div>${typeof HOWTO !== 'undefined' && HOWTO[CUR_GAME] ? '<button class="howbtn" data-how aria-label="הדגמה">🎬 הדגמה</button>' : ''}<span class="starpill">⭐ ${CUR ? store.st(CUR.id).stars : 0}</span></div><div class="trow"><div class="tbar"><i style="width:${roundPct()}%"></i></div><span class="okcount">✓ ${res ? res.filter(Boolean).length : 0}</span></div>`;

// ---------- 🎈 בלונים ----------
function gameBalloons() {
  const kid = CUR, N = 8, res = []; let q, t0, timer, streak = 0, tries = 0;
  const cfg = mathCfg(kid);
  const dur = () => cfg.speed === 'auto' ? Math.max(6, Math.min(14, engine.avgMs(kid) / 1000 * 1.8 + 3 - streak * .6)) : SPEEDS[cfg.speed].s;
  const next = () => {
    if (roundOver()) return endRound('balloons', res);
    q = engine.make(kid); tries = 0; draw();
  };
  const draw = () => {
    show(`${gameTop('🎈 בלונים', res, res.length, N)}
      <div class="eqbox" style="margin-top:12px">${eqHTML(q)}</div>
      <div class="sky" id="sky"><span class="cloud" style="top:12%;animation-delay:-8s">☁️</span><span class="cloud" style="top:48%;animation-delay:-20s;font-size:34px">☁️</span></div>
      <p class="center mute small" style="margin-top:8px">${G('פּוֹצֵץ', 'פּוֹצְצִי')} את הבלון עם התשובה הנכונה</p>`, a => {
      $('#quit', a).onclick = mathHub; onLeave(() => clearTimeout(timer)); sayQ(q); launch();
    });
  };
  const launch = () => {
    const sky = $('#sky'); if (!sky) return; $$('.balloon', sky).forEach(b => b.remove());
    const opts = engine.options(q, 4), w = sky.clientWidth, d = dur(), cols = ['#ff2d95', '#ff8a00', '#00c86e', '#2f8bff', '#8b3dff', '#ffb800'];
    t0 = performance.now();
    opts.forEach((v, i) => {
      const b = document.createElement('button'); b.className = 'balloon'; b.textContent = v;
      b.style.background = cols[(i + res.length) % cols.length]; b.style.left = (6 + i * (w - 90) / 3) + 'px';
      b.style.animationDelay = (i * .3) + 's'; b.style.animationDuration = (d + Math.random() * 1.2) + 's';
      b.onclick = () => {
        if (v === q.ans) {
          clearTimeout(timer); b.classList.add('popd'); sfx.pop(); streak++;
          engine.record(kid, 'balloons', q, tries === 0, performance.now() - t0); res.push(tries === 0);
          $$('.balloon', sky).forEach(x => x !== b && (x.style.opacity = .25, x.style.pointerEvents = 'none'));
          $('.eqbox .q').textContent = q.ans; good('', next);
        } else {
          tries++; streak = 0; b.style.filter = 'grayscale(1)'; b.style.opacity = .35; b.style.pointerEvents = 'none'; bad();
        }
      };
      sky.appendChild(b);
    });
    clearTimeout(timer);
    timer = setTimeout(() => { tries++; streak = 0; toast(G('הַבַּלּוֹנִים בָּרְחוּ! עוֹד פַּעַם, לְאַט יוֹתֵר', 'הַבַּלּוֹנִים בָּרְחוּ! עוֹד פַּעַם, לְאַט יוֹתֵר').replace(/[֑-ׇ]/g, '')); launch(); }, (d + 2.5) * 1000);
  };
  next();
}

// ---------- 👆 נכון או לא ----------
function gameSwipe() {
  const kid = CUR, N = 10, res = []; let card, t0, busy = false;
  const next = () => {
    if (roundOver()) return endRound('swipe', res);
    const q = engine.make(kid), truth = Math.random() < .5;
    const shown = truth ? q.ans : engine.options(q, 3).find(v => v !== q.ans);
    card = { q, truth, shown }; draw();
  };
  const draw = () => {
    busy = false;
    show(`${gameTop('👆 נכון או לא?', res, res.length, N)}
      <div class="deck" id="deck"><div class="sc back"></div><div class="sc" id="top"><span class="hint yes">נָכוֹן ✓</span><span class="hint no">לֹא ✗</span><div dir="ltr">${card.q.a} ${card.q.op} ${card.q.b} = ${card.shown}</div></div></div>
      <div class="swbtns"><button class="swb n" id="no">✗</button><button class="swb y" id="yes">✓</button></div>
      <p class="center mute small" style="margin-top:12px">ימינה = נכון · שמאלה = לא נכון</p>`, a => {
      $('#quit', a).onclick = mathHub; t0 = performance.now();
      const c = $('#top', a); let x0 = null, dx = 0;
      c.onpointerdown = e => { x0 = e.clientX; dx = 0; c.classList.add('drag'); try { c.setPointerCapture(e.pointerId); } catch { } };
      c.onpointermove = e => { if (x0 === null) return; dx = e.clientX - x0; c.style.transform = `translateX(${dx}px) rotate(${dx / 14}deg)`; $('.yes', c).style.opacity = Math.max(0, dx / 90); $('.no', c).style.opacity = Math.max(0, -dx / 90); };
      c.onpointerup = c.onpointercancel = () => { c.classList.remove('drag'); if (Math.abs(dx) > 80) answer(dx > 0); else c.style.transform = ''; x0 = null; dx = 0; };
      $('#yes', a).onclick = () => answer(true); $('#no', a).onclick = () => answer(false);
    });
  };
  const answer = yes => {
    if (busy) return; busy = true;
    const ok = yes === card.truth, c = $('#top');
    c.style.transform = `translateX(${yes ? 460 : -460}px) rotate(${yes ? 30 : -30}deg)`;
    engine.record(kid, 'swipe', card.q, ok, performance.now() - t0); res.push(ok);
    if (ok) good('', next); else { sfx.bad(); toast(`התשובה הנכונה: ${card.q.ans}`); sayThen(`#${card.q.a}|${OPW[card.q.op]}|#${card.q.b}|זֶה|#${card.q.ans}`, next); }
  };
  next();
}

// ---------- 🏎️ מרוץ ----------
function gameRace() {
  const kid = CUR, N = 8, res = []; let pos = 0, npos = 0, q, opts, t0, tries = 0, ntimer, over = false;
  const pace = Math.max(3500, Math.min(10000, engine.avgMs(kid) * 1.45 + 800));
  const track = () => `<div class="track"><div class="finish"></div>
      <div class="lane"><span class="car" id="kidCar" style="right:${3 + pos / N * 75}%">🏎️<span class="who">${esc(kid.name)}</span></span></div>
      <div class="lane"><span class="car" id="nCar" style="right:${3 + npos / N * 75}%">🚙<span class="who">ניצוץ</span></span></div></div>`;
  const next = () => {
    if (over) return;
    if (pos >= N) return finish(true);
    if (roundOver()) return finish(null);
    q = engine.make(kid); opts = engine.options(q, 3); tries = 0; draw();
  };
  const draw = () => {
    show(`${gameTop('🏎️ מרוץ', res, res.length, N)}${track()}
      <div class="eqbox" style="margin-top:14px">${eqHTML(q)}</div>
      <div class="answers">${opts.map(v => `<button class="ans" data-v="${v}">${v}</button>`).join('')}</div>`, a => {
      $('#quit', a).onclick = () => { over = true; mathHub(); };
      onLeave(() => clearInterval(ntimer)); t0 = performance.now(); sayQ(q);
      $$('.ans', a).forEach(b => b.onclick = () => {
        if (+b.dataset.v === q.ans) {
          b.classList.add('good'); engine.record(kid, 'race', q, tries === 0, performance.now() - t0); res.push(tries === 0);
          pos++; $('#kidCar').style.right = (3 + pos / N * 75) + '%'; $('.eqbox .q').textContent = q.ans; $$('.ans').forEach(x => x.disabled = true); good('', next);
        } else { tries++; b.disabled = true; b.style.opacity = .35; bad(b); }
      });
      clearInterval(ntimer);
      ntimer = setInterval(() => { if (over) return; npos++; const c = $('#nCar'); if (c) c.style.right = (3 + Math.min(npos, N) / N * 75) + '%'; tone(300, .1, 'square', 0, .04); if (npos >= N) finish(false); }, pace);
    });
  };
  // כל מרוץ הוא 8 תשובות. כשמישהו מגיע לסוף ונשאר זמן, מתחיל מרוץ חדש. בסוף 5 הדקות סופרים ניצחונות
  let wins = 0, races = 0;
  const finish = won => {
    if (over) return; clearInterval(ntimer);
    if (won !== null) { races++; if (won) wins++; }
    if (won !== null && !roundOver()) {
      toast(won ? '🏆 ' + strip(G('נִצַּחְתָּ!', 'נִצַּחְתְּ!')) + ' מרוץ חדש' : '🚙 ניצוץ ניצח הפעם. מרוץ חדש!'); if (won) { sfx.fanfare(); confetti(40); }
      pos = 0; npos = 0; return setTimeout(next, 1200);
    }
    over = true;
    const extra = `<div style="font-size:80px">🏆</div><h2 class="nk">${G('נִצַּחְתָּ', 'נִצַּחְתְּ')} ${wins} / ${races || 1}</h2>`;
    setTimeout(() => endRound('race', res, extra), 700);
  };
  next();
}

// ---------- 👑 מבחן המלך ----------
function gameTest() {
  const kid = CUR, N = 10, res = []; let q, typed = '', t0;
  const next = () => {
    if (roundOver()) {
      const ok = res.filter(Boolean).length / Math.max(1, res.length) >= .8;
      return endRound('test', res, `<div class="crown">${ok ? '👑' : '🎖️'}</div><h2 class="nk">${ok ? G('קִבַּלְתָּ אֶת הַכֶּתֶר!', 'קִבַּלְתְּ אֶת הַכֶּתֶר!') : G('קִבַּלְתָּ מֵדַלְיָה!', 'קִבַּלְתְּ מֵדַלְיָה!')}</h2>`);
    }
    q = engine.make(kid); typed = ''; draw();
  };
  const draw = () => {
    show(`${gameTop('👑 מבחן המלך', res, res.length, N)}
      <p class="center mute small nk" style="margin:10px 0 6px">אין שעון. ${G('חֲשֹׁב בְּנַחַת', 'חִשְׁבִי בְּנַחַת')} 🙂</p>
      <div class="eqbox">${eqHTML(q, `<span class="typed" id="typed">&nbsp;</span>`)}</div>
      <div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button class="key" data-k="${n}">${n}</button>`).join('')}<button class="key del" data-k="del">⌫</button><button class="key" data-k="0">0</button><button class="key ok" data-k="ok">✓</button></div>`, a => {
      $('#quit', a).onclick = mathHub; t0 = performance.now(); sayQ(q);
      $$('.key', a).forEach(b => b.onclick = () => {
        const k = b.dataset.k; sfx.tap();
        if (k === 'del') typed = typed.slice(0, -1);
        else if (k === 'ok') { if (typed) check(); return; }
        else if (typed.length < 4) typed += k;
        $('#typed').innerHTML = typed || '&nbsp;';
      });
    });
  };
  const check = () => {
    const ok = +typed === q.ans; engine.record(kid, 'test', q, ok, performance.now() - t0); res.push(ok);
    $$('.key').forEach(k => k.disabled = true);
    if (ok) { good('', next); }
    else {
      sfx.bad(); $('#typed').innerHTML = `<s style="opacity:.5">${typed}</s> ${q.ans}`;
      sayThen(`כִּמְעַט! הַתְּשׁוּבָה הִיא|#${q.ans}`, next);
    }
  };
  next();
}
// פס הזמן זז גם בלי שמחליפים מסך
setInterval(() => { const i = $('.trow .tbar i'); if (i) i.style.width = roundPct() + '%'; }, 3000);
