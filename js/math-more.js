// לומדים בכיף — עוד 4 משחקי חשבון לגדולים: זוגות, תופסים, חנות ומסע באיים
'use strict';
MATH_GAMES.push(
  { id: 'pairs', n: 'זוגות', ic: '🃏', anim: 'a-zoom', bg: 'var(--g5)', d: 'תרגיל ותשובה שלו' },
  { id: 'catch', n: 'תופסים', ic: '🧺', anim: 'a-fly', bg: 'var(--g1)', d: 'הסל תופס את התשובה' },
  { id: 'shop', n: 'חנות', ic: '🏪', anim: 'a-swipe', bg: 'var(--g3)', d: 'משלמים במטבעות' },
  { id: 'islands', n: 'מסע באיים', ic: '🏝️', anim: 'a-fly', bg: 'var(--g2)', d: 'בלי שעון, אוספים אוצרות' },
);
const sayEx = q => `#${q.a}|${OPW[q.op]}|#${q.b}`;

// ---------- 🃏 זוגות: מוצאים לכל תרגיל את התשובה שלו ----------
function gamePairs(res = []) {
  if (res.length && roundOver()) return endRound('pairs', res);
  const kid = CUR, gm = store.st(kid.id).games.pairs, pairs = Math.min(6, 4 + Math.floor((gm?.rounds || 0) / 2) + Math.floor(res.length / 8));
  const qs = [], used = new Set();
  for (let t = 0; qs.length < pairs && t < 200; t++) { const q = engine.make(kid); if (!used.has(q.ans)) { used.add(q.ans); qs.push(q); } }
  const cards = shuffle(qs.flatMap((q, j) => [{ j, ex: 1 }, { j, ex: 0 }]));
  const miss = qs.map(() => 0); let open = [], found = 0; const t0 = performance.now();
  const tx = (c, f) => isF() ? f : c;
  show(`${gameTop('🃏 זוגות', res)}
    <div class="lq nk" style="font-size:20px"><span>${strip(tx('מְצָא לְכָל תַּרְגִּיל אֶת הַתְּשׁוּבָה שֶׁלּוֹ', 'מִצְאִי לְכָל תַּרְגִּיל אֶת הַתְּשׁוּבָה שֶׁלּוֹ'))}</span></div>
    <div class="mem pmem p${pairs}">${cards.map((c, k) => `<button class="mcard" data-k="${k}"><div class="in"><div class="fr">${c.ex ? '❓' : '⭐'}</div><div class="bk ${c.ex ? 'ex' : 'an'}"><span dir="ltr">${c.ex ? `${qs[c.j].a} ${qs[c.j].op} ${qs[c.j].b}` : qs[c.j].ans}</span></div></div></button>`).join('')}</div>
    <p class="center mute small" style="margin-top:12px">❓ = תרגיל · ⭐ = תשובה</p>`, a => {
    $('#quit', a).onclick = mathHub;
    voice.say(tx('מְצָא לְכָל תַּרְגִּיל אֶת הַתְּשׁוּבָה שֶׁלּוֹ', 'מִצְאִי לְכָל תַּרְגִּיל אֶת הַתְּשׁוּבָה שֶׁלּוֹ'));
    $$('.mcard', a).forEach(b => b.onclick = () => {
      if (open.length >= 2 || b.classList.contains('on')) return;
      const c = cards[b.dataset.k]; b.classList.add('on'); sfx.tap(); open.push(b);
      voice.say(c.ex ? sayEx(qs[c.j]) : '#' + qs[c.j].ans);
      if (open.length < 2) return;
      const [c1, c2] = open.map(x => cards[x.dataset.k]);
      if (c1.j === c2.j && c1.ex !== c2.ex) {
        const q = qs[c1.j]; found++; open.forEach(x => x.classList.add('got')); open = [];
        engine.record(kid, 'pairs', q, miss[c1.j] <= 1, (performance.now() - t0) / pairs); res.push(miss[c1.j] <= 1);
        if (found === pairs) good('', () => gamePairs(res)); else { sfx.win(); confetti(14); }
      } else {
        if (c1.ex !== c2.ex) miss[(c1.ex ? c1 : c2).j]++;
        const pair = open; setTimeout(() => { pair.forEach(x => x.classList.remove('on')); open = []; }, 1100);
      }
    });
  });
}

// ---------- 🧺 תופסים: הפירות נופלים, והסל צריך לתפוס את התשובה ----------
function gameCatch() {
  const kid = CUR, N = 8, res = [], cfg = mathCfg(kid), FR = ['🍎', '🍊', '🍋', '🍐', '🍑', '🍓', '🥝', '🍇'];
  let q, opts, lane = 1, t0, timer, tries = 0, done = false;
  const fall = () => cfg.speed === 'auto' ? Math.max(5, Math.min(11, engine.avgMs(kid) / 1000 * 1.5 + 2.5)) : SPEEDS[cfg.speed].s * .8;
  const next = () => { if (roundOver()) return endRound('catch', res); q = engine.make(kid); tries = 0; draw(); };
  const draw = () => {
    show(`${gameTop('🧺 תופסים', res, res.length, N)}
      <div class="eqbox" style="margin-top:10px;min-height:76px">${eqHTML(q)}</div>
      <div class="orchard" id="orch">${[0, 1, 2].map(i => `<div class="olane" data-l="${i}"></div>`).join('')}<div class="basket" id="bsk">🧺</div></div>
      <p class="center mute small" style="margin-top:8px">${strip(G('לְחַץ', 'לַחֲצִי'))} על הטור כדי להזיז את הסל</p>`, a => {
      $('#quit', a).onclick = mathHub; onLeave(() => clearTimeout(timer));
      $$('.olane', a).forEach(l => l.onpointerdown = () => move(+l.dataset.l));
      move(lane, true); sayQ(q); drop();
    });
  };
  const move = (l, quiet) => { lane = l; const b = $('#bsk'); if (b) b.style.right = `calc(${l * 33.33 + 16.66}% - 34px)`; if (!quiet) sfx.tap(); };
  const drop = () => {
    const orch = $('#orch'); if (!orch) return; $$('.fruit', orch).forEach(f => f.remove());
    opts = engine.options(q, 3); const d = fall(), fr = shuffle(FR); done = false; t0 = performance.now();
    opts.forEach((v, i) => {
      const f = document.createElement('div'); f.className = 'fruit'; f.innerHTML = `<i>${fr[i]}</i><b>${v}</b>`;
      f.style.right = `calc(${i * 33.33 + 16.66}% - 36px)`; f.style.animationDuration = d + 's';
      f.onpointerdown = () => move(i); orch.appendChild(f);
    });
    clearTimeout(timer); timer = setTimeout(land, d * 1000);
  };
  const land = () => {
    if (done || !$('#orch')) return; done = true;
    const v = opts[lane], fruits = $$('.fruit');
    if (v === q.ans) {
      fruits[lane].classList.add('caught'); sfx.pop(); $('.eqbox .q').textContent = q.ans;
      engine.record(kid, 'catch', q, tries === 0, performance.now() - t0); res.push(tries === 0); good('', next);
    } else {
      tries++; fruits.forEach((f, i) => f.classList.add(opts[i] === q.ans ? 'right' : 'gone'));
      sfx.bad(); toast(`${G('תָּפַסְתָּ', 'תָּפַסְתְּ')} ${v}. התשובה: ${q.ans}`.replace(/[֑-ׇ]/g, ''));
      if (tries >= 2) { engine.record(kid, 'catch', q, false, performance.now() - t0); res.push(false); sayThen(`${sayEx(q)}|זֶה|#${q.ans}`, next); }
      else sayThen(pick(RETRY[gk()]), drop);
    }
  };
  next();
}

// ---------- 🏪 חנות: משלמים בדיוק, ובהמשך גם מחשבים עודף ----------
const SHOP = [['🍦', 'גְּלִידָה'], ['🧃', 'מִיץ'], ['🍫', 'שׁוֹקוֹלָד'], ['🥐', 'קְרוּאָסוֹן'], ['🎈', 'בַּלּוֹן'], ['✏️', 'עִפָּרוֹן'], ['📒', 'מַחְבֶּרֶת'], ['🧸', 'דֻּבִּי'],
  ['⚽', 'כַּדּוּר'], ['🍭', 'סֻכָּרִיָּה'], ['🪁', 'עֲפִיפוֹן'], ['🎨', 'צְבָעִים'], ['🍉', 'אֲבַטִּיחַ'], ['🧁', 'עוּגִיָּה'], ['🪀', 'יוֹ־יוֹ'], ['📚', 'סֵפֶר']];
const coinHTML = (v, k = '') => `<button class="coin c${v}" data-v="${v}" ${k}><b>${v}</b><small>₪</small></button>`;
function gameShop() {
  const kid = CUR, N = 6, res = [], cfg = mathCfg(kid); let item, price, paid, t0, tries, change;
  const next = () => {
    if (roundOver()) return endRound('shop', res, `<div style="font-size:84px">🛍️</div><h2 class="nk">${G('קָנִיתָ הַכֹּל!', 'קָנִית הַכֹּל!')}</h2>`);
    item = pick(SHOP); tries = 0; paid = [];
    const lvl = engine.level(kid, '+'), top = Math.max(5, Math.min(cfg.max, [9, 15, 20, 30, 50][lvl - 1]));
    price = 3 + R(top - 2);
    change = cfg.ops.includes('-') && engine.level(kid, '-') >= 2 && res.length % 2 === 1 && price < 50 ? [10, 20, 50].find(x => x > price) : 0;
    change ? drawChange() : drawPay();
  };
  const head = () => `${gameTop('🏪 חנות', res, res.length, N)}<div class="shopitem"><em>${item[0]}</em><div class="tag">${price} ₪</div></div>`;
  const drawPay = () => {
    show(`${head()}<p class="center nk" style="font-weight:800;font-size:19px;margin:6px 0">${strip(G('שַׁלֵּם בְּדִיּוּק', 'שַׁלְּמִי בְּדִיּוּק'))} 🙂</p>
      <div class="tray" id="tray"><span class="mute small">${strip(G('לְחַץ', 'לַחֲצִי'))} על מטבע כדי לשים אותו כאן</span></div>
      <div class="paid">שמת: <b id="sum">0</b> ₪</div>
      <div class="coins">${[10, 5, 2, 1].map(v => coinHTML(v)).join('')}</div>
      <button class="btn full" id="pay" style="margin-top:14px">✓ לשלם</button>`, a => {
      $('#quit', a).onclick = mathHub; t0 = performance.now();
      voice.say(`${item[1]}|#${price}|שְׁקָלִים|${G('שַׁלֵּם בְּדִיּוּק', 'שַׁלְּמִי בְּדִיּוּק')}`);
      $$('.coins .coin', a).forEach(b => b.onclick = () => { if (paid.length >= 12) return; paid.push(+b.dataset.v); sfx.tap(); tray(); });
      $('#pay', a).onclick = check;
    });
  };
  const tray = () => {
    const t = $('#tray'), sum = paid.reduce((x, y) => x + y, 0);
    t.innerHTML = paid.length ? paid.map((v, i) => coinHTML(v, `data-i="${i}"`)).join('') : `<span class="mute small">${strip(G('לְחַץ', 'לַחֲצִי'))} על מטבע כדי לשים אותו כאן</span>`;
    $$('.coin', t).forEach(b => b.onclick = () => { paid.splice(+b.dataset.i, 1); sfx.tap(); tray(); });
    $('#sum').textContent = sum;
  };
  const check = () => {
    const sum = paid.reduce((x, y) => x + y, 0), q = { op: '+', a: price, b: 0, ans: price };
    if (sum === price) {
      engine.record(kid, 'shop', q, tries === 0, performance.now() - t0); res.push(tries === 0);
      $('#pay').disabled = true; $('.shopitem').classList.add('win'); good(item[1] + '!', next);
    } else {
      tries++; bad($('#tray'));
      const d = Math.abs(price - sum);
      toast(sum > price ? `שמת ${d} ₪ יותר מדי` : `חסרים עוד ${d} ₪`);
      if (tries >= 3) { engine.record(kid, 'shop', q, false, performance.now() - t0); res.push(false); sayThen(`${item[1]}|#${price}|שְׁקָלִים`, next); }
    }
  };
  const drawChange = () => {
    const q = { op: '-', a: change, b: price, ans: change - price }, opts = engine.options(q, 3);
    show(`${head()}<div class="bubble nk" style="text-align:center;margin:8px 0">${strip(G('נָתַתָּ', 'נָתַתְּ'))} ${change} ₪ ${coinHTML(change >= 10 ? 10 : change).replace('<button', '<span').replace('</button>', '</span>')}<br>כמה עודף ${G('תְּקַבֵּל', 'תְּקַבְּלִי').replace(/[֑-ׇ]/g, '')}?</div>
      <div class="answers">${opts.map(v => `<button class="ans" data-v="${v}">${v} ₪</button>`).join('')}</div>`, a => {
      $('#quit', a).onclick = mathHub; t0 = performance.now();
      voice.say(`${G('נָתַתָּ', 'נָתַתְּ')}|#${change}|שְׁקָלִים|כַּמָּה עֹדֶף ${G('תְּקַבֵּל', 'תְּקַבְּלִי')}?`);
      $$('.ans', a).forEach(b => b.onclick = () => {
        if (+b.dataset.v === q.ans) {
          b.classList.add('good'); $$('.ans').forEach(x => x.disabled = true);
          engine.record(kid, 'shop', q, tries === 0, performance.now() - t0); res.push(tries === 0);
          good('', () => sayThen(`#${change}|מִינוּס|#${price}|זֶה|#${q.ans}`, next));
        } else { tries++; b.disabled = true; b.style.opacity = .35; bad(b); }
      });
    });
  };
  next();
}

// ---------- 🏝️ מסע באיים: בלי שעון. כל תשובה מקדמת את הסירה לאי הבא ----------
const ISLES = [[86, 78], [62, 66], [80, 42], [56, 24], [30, 36], [12, 60], [36, 80], [12, 16]];
const LOOT = ['💎', '🪙', '🐚', '⭐', '🦜', '🍍', '🧭', '👑'];
function gameIslands() {
  const kid = CUR, N = ISLES.length, res = []; let q, opts, t0, tries = 0;
  const pos = i => i < 0 ? [94, 94] : ISLES[i];
  const next = () => {
    if (roundOver()) return endRound('islands', res, `<div style="font-size:84px">🧰</div><h2 class="nk">${G('מָצָאתָ אֶת הָאוֹצָר!', 'מָצָאת אֶת הָאוֹצָר!')}</h2>`);
    q = engine.make(kid); opts = engine.options(q, 3); tries = 0; draw();
  };
  const draw = () => {
    const k = res.length % N, at = pos(k - 1);
    if (k === 0 && res.length) toast('🗺️ מפה חדשה! עוד אוצרות');
    show(`${gameTop('🏝️ מסע באיים', res, res.length, N)}
      <div class="seamap"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="94,94 ${ISLES.map(p => p.join(',')).join(' ')}" /></svg>
        ${ISLES.map((p, i) => `<span class="isle ${i < k ? 'done' : ''} ${i === N - 1 ? 'last' : ''}" style="left:${p[0]}%;top:${p[1]}%">${i === N - 1 ? '🏰' : '🏝️'}${i < k ? `<i>${LOOT[i]}</i>` : ''}</span>`).join('')}
        <span class="boat" id="boat" style="left:${at[0]}%;top:${at[1]}%">⛵</span></div>
      <div class="eqbox" style="margin-top:12px;min-height:76px">${eqHTML(q)}</div>
      <div class="answers">${opts.map(v => `<button class="ans" data-v="${v}">${v}</button>`).join('')}</div>
      <p class="center mute small nk" style="margin-top:8px">אין שעון. ${G('חֲשֹׁב בְּנַחַת', 'חִשְׁבִי בְּנַחַת')} 🙂</p>`, a => {
      $('#quit', a).onclick = mathHub; t0 = performance.now(); sayQ(q);
      $$('.ans', a).forEach(b => b.onclick = () => {
        if (+b.dataset.v === q.ans) {
          b.classList.add('good'); $$('.ans').forEach(x => x.disabled = true); $('.eqbox .q').textContent = q.ans;
          engine.record(kid, 'islands', q, tries === 0, performance.now() - t0); res.push(tries === 0);
          const j = (res.length - 1) % N, to = pos(j), bt = $('#boat'); bt.style.left = to[0] + '%'; bt.style.top = to[1] + '%';
          setTimeout(() => { const isle = $$('.isle')[j]; if (isle) { isle.classList.add('done'); isle.insertAdjacentHTML('beforeend', `<i>${LOOT[j]}</i>`); } }, 700);
          good('', next);
        } else { tries++; b.disabled = true; b.style.opacity = .35; bad(b); }
      });
    });
  };
  next();
}
