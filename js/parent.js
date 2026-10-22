// לומדים בכיף — האזור של ההורה: ילדים, הגדרות, המדריך האישי, בדיקת מכשיר ומשוב
'use strict';

function parentHome() {
  CUR = null; clock.stop(); applyTheme(store.d.parentTheme || 'purple');
  const kids = store.d.kids;
  show(`<div class="topbar">${backBtn()}<div class="title">👨‍👧 האזור של ההורה</div><span style="width:46px"></span></div>
    <div class="sect" style="margin-top:4px"><h2>👧👦 הילדים</h2>
      <div class="plist">${kids.map(k => `<div class="prow tap" data-open="${k.id}"><div class="avatar" style="background:linear-gradient(135deg,${themeOf(k.theme).t1},${themeOf(k.theme).t2})"><div>${avatarHTML(k)}</div></div>
        <div class="grow"><b>${esc(k.name)}</b><div class="mute small">${k.age ? 'גיל ' + esc(k.age) : ''}${k.cls ? ' · ' + esc(k.cls) : ''} · ⭐ ${store.st(k.id).stars}</div></div>
        <button class="btn small ghost" data-edit="${k.id}">⚙️ הגדרות</button><button class="btn small" data-guide="${k.id}">🧭 מדריך</button></div>`).join('') || '<p class="mute">עוד אין ילדים. בואו נוסיף את הראשון!</p>'}
      <button class="btn ghost full" id="addKid">➕ ילד חדש</button></div></div>
    <div class="sect"><h2>⚙️ הגדרות</h2><div class="menu">
      <button class="mitem" id="demoBtn"><span class="ic" style="background:var(--g4)">🧪</span><span class="grow">לנסות כמו ילד<small>משחקים בלי לשמור כלום ובלי לגעת בפרופילים של הילדים</small></span>‹</button>
      <button class="mitem" id="showBtn"><span class="ic" style="background:var(--g5)">🎭</span><span class="grow">מצב הדגמה וסיור מודרך<small>משפחה מדומה, סיור בכל המסכים, והערות לשליחה ביחד</small></span>‹</button>
      <button class="mitem rv-badge-item" id="rvBtn" ${rvPending().length || rvUnsent().length ? '' : 'hidden'}><span class="ic" style="background:linear-gradient(135deg,#22C55E,#14B8A6)">🔁</span><span class="grow">סיור תיקונים<small>רואים מה תוקן מההערות שלך, ומאשרים</small></span>‹</button>
      <button class="mitem" id="accBtn"><span class="ic" style="background:var(--g2)">👤</span><span class="grow">החשבון וקוד ההורה<small>${typeof auth !== 'undefined' && auth.user ? esc(auth.user.email) : 'לא מחובר'} · קוד וטביעת אצבע</small></span>‹</button>
      <button class="mitem" id="devTest"><span class="ic" style="background:var(--g2)">🎤</span><span class="grow">בדיקת קריין וזיהוי קול<small>בודקים מה עובד בטלפון הזה</small></span>‹</button>
      <button class="mitem news-btn" id="newsBtn"><span class="ic" style="background:var(--g4)">✨</span><span class="grow">מה חדש<small>כל העדכונים במשחק, החדש למעלה</small></span>‹</button>
      <button class="mitem" id="guideBtn"><span class="ic" style="background:var(--g3)">📖</span><span class="grow">מדריך לאפליקציה<small>איך משתמשים בכל דבר</small></span>‹</button>
      <button class="mitem" id="fbBtn"><span class="ic" style="background:var(--g1)">💌</span><span class="grow">שליחת משוב<small>רעיון, תקלה או מחמאה, ישר למוישי</small></span>‹</button>
    </div></div>
    <button class="btn ghost full" id="resetBtn" style="margin-top:18px">↩️ שחזור הגדרות ההתחלה</button>
    <p class="mute small center" style="margin-top:22px">🔒 המידע על הילדים נשמר רק בטלפון הזה, בלי פרסומות. נשלח רק מידע טכני בלי שמות, כדי לתקן תקלות.</p>`, a => {
    $('#back', a).onclick = profiles; $('#addKid', a).onclick = () => kidForm();
    $$('[data-edit]', a).forEach(b => b.onclick = () => kidForm(store.kid(b.dataset.edit), true));
    $$('[data-open]', a).forEach(r => r.onclick = e => { if (e.target.closest('[data-guide],[data-edit]')) return; kidForm(store.kid(r.dataset.open)); });
    $$('[data-guide]', a).forEach(b => b.onclick = () => parentGuide(store.kid(b.dataset.guide)));
    $('#devTest', a).onclick = deviceTest; $('#demoBtn', a).onclick = demoPick; $('#guideBtn', a).onclick = () => location.href = 'guide/';
    $('#fbBtn', a).onclick = () => openFeedback(); $('#showBtn', a).onclick = showcaseStart; $('#newsBtn', a).onclick = () => openNews(true); $('#resetBtn', a).onclick = resetSettings; $('#rvBtn', a).onclick = reviewStart; $('#accBtn', a).onclick = () => auth.user ? accountSheet() : showAuthGate(parentHome);
  });
  maybeNews();
}

// ---------- הדף של כל ילד: פרטים, תמונות, וכל ההגדרות במקום אחד ----------
const MAX_PHOTOS = 5;
function kidForm(kid, toSettings) {
  const k = kid ? { ...kid, photos: [...kidPhotos(kid)] } : { id: uid(), name: '', age: '', gender: 'f', cls: '', theme: 'pink', photo: '', photos: [], math: { ...DEF_MATH }, limit: 0 };
  applyTheme(k.theme);
  const ring = () => `<div class="ring" style="background:linear-gradient(135deg,${themeOf(k.theme).t1},${themeOf(k.theme).t2})"><div>${avatarHTML(k)}</div></div>`;
  const thumbs = () => k.photos.map((ph, i) => `<div class="pthumb"><img src="${ph}" alt=""><button data-rm="${i}" aria-label="הסרה">✕</button></div>`).join('');
  show(`<div class="topbar">${backBtn()}<div class="title">${kid ? `👤 ${esc(kid.name)}` : '✨ ילד חדש'}</div><span style="width:46px"></span></div>
    <div class="card">
      <div class="photo-pick field"><span id="ringBox">${ring()}</span><div class="grow">
        <label class="btn small ghost" style="cursor:pointer">📷 להוסיף תמונות (עד ${MAX_PHOTOS})<input type="file" accept="image/*" multiple id="pic" hidden></label>
        <p class="mute small" style="margin-top:6px">אפשר להעלות כמה תמונות. הן מתחלפות כל 2 שניות, וכשהילד לוחץ על העיגול שלו התמונה גדלה לכל המסך 🎉</p></div></div>
      <div class="pthumbs" id="thumbs">${thumbs()}</div>
      <label class="field"><span>שם</span><input id="fName" value="${esc(k.name)}" maxlength="20" placeholder="שם הילד"></label>
      <div class="row" style="gap:12px"><label class="field grow"><span>גיל</span><input id="fAge" value="${esc(k.age)}" inputmode="decimal" maxlength="4" placeholder="8"></label>
        <label class="field grow"><span>כיתה (לא חובה)</span><input id="fCls" value="${esc(k.cls)}" maxlength="12" placeholder="ב׳ / גן"></label></div>
      <div class="field"><span>בן או בת? (הקריין פונה בהתאם)</span><div class="seg" id="fG"><button data-v="f" class="${k.gender === 'f' ? 'on' : ''}">👧 בת</button><button data-v="m" class="${k.gender === 'm' ? 'on' : ''}">👦 בן</button></div></div>
      <div class="field"><span>הצבעים של ${esc(k.name) || 'הילד'}</span><div class="themes">${THEMES.map(t => `<button class="th ${t.id === k.theme ? 'on' : ''}" data-t="${t.id}" style="background:linear-gradient(135deg,${t.t1},${t.t2})" aria-label="${t.name}"></button>`).join('')}</div></div>
      <div class="err" id="fErr"></div>
      <button class="btn full" id="save">${kid ? '💾 שמירת הפרטים' : 'יוצרים! 🚀'}</button>
    </div>
    ${kid ? `<h2 id="setH" style="margin:22px 4px 10px">⚙️ ההגדרות של ${esc(kid.name)}</h2><div class="stack">${settingsCards(kid)}</div>
      <button class="btn ghost full" id="guideK" style="margin-top:14px">🧭 המדריך האישי של ${esc(kid.name)}</button>
      <button class="btn ghost full" id="del" style="margin-top:10px">🗑️ מחיקת הילד</button>` : ''}`, a => {
    $('#back', a).onclick = parentHome;
    const refresh = () => { k.photo = k.photos[0] || ''; $('#ringBox', a).innerHTML = ring(); $('#thumbs', a).innerHTML = thumbs(); bindRm(); };
    const bindRm = () => $$('[data-rm]', a).forEach(b => b.onclick = () => { k.photos.splice(+b.dataset.rm, 1); refresh(); });
    bindRm();
    $('#pic', a).onchange = async e => {
      const files = [...e.target.files].slice(0, MAX_PHOTOS - k.photos.length);
      if (!files.length) return toast(`אפשר עד ${MAX_PHOTOS} תמונות`);
      for (const f of files) { try { k.photos.push(await shrinkPhoto(f)); } catch { toast('לא הצלחתי לקרוא תמונה אחת'); } }
      e.target.value = ''; refresh(); toast(`📷 ${k.photos.length} תמונות. לא לשכוח לשמור`);
    };
    $$('#fG button', a).forEach(b => b.onclick = () => { k.gender = b.dataset.v; $$('#fG button', a).forEach(x => x.classList.toggle('on', x === b)); refresh(); });
    $$('.th', a).forEach(b => b.onclick = () => { k.theme = b.dataset.t; applyTheme(k.theme); $$('.th', a).forEach(x => x.classList.toggle('on', x === b)); refresh(); });
    $('#save', a).onclick = () => {
      k.name = $('#fName', a).value.trim(); k.age = $('#fAge', a).value.trim(); k.cls = $('#fCls', a).value.trim(); k.photo = k.photos[0] || '';
      if (!k.name) { $('#fErr', a).textContent = 'צריך לכתוב שם 🙂'; return; }
      const { math, limit, narrator, ...info } = k;   // ההגדרות נשמרות לבד למטה, כאן רק הפרטים
      if (kid) Object.assign(kid, info); else store.d.kids.push(k);
      store.save(); confetti(50); sfx.fanfare(); toast(kid ? '💾 נשמר' : `🎉 ${k.name} ${k.gender === 'f' ? 'הצטרפה' : 'הצטרף'}!`); kid ? kidForm(kid) : parentHome();
    };
    if (kid) {
      bindSettings(kid, a);
      $('#guideK', a).onclick = () => parentGuide(kid);
      $('#del', a).onclick = () => openSheet(`<h2>🗑️ למחוק את ${esc(k.name)}?</h2><p class="mute">כל הכוכבים וההתקדמות שלו יימחקו מהטלפון הזה.</p>
        <div class="row" style="margin-top:16px"><button class="btn ghost grow" id="no">ביטול</button><button class="btn danger grow" id="yes">כן, למחוק</button></div>`, s2 => {
        $('#no', s2).onclick = closeSheet;
        $('#yes', s2).onclick = () => { store.d.kids = store.d.kids.filter(x => x.id !== k.id); delete store.d.stats[k.id]; store.save(); closeSheet(); toast('נמחק'); parentHome(); };
      });
      if (toSettings) setTimeout(() => $('#setH', a)?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 250);
    }
  });
}
function shrinkPhoto(file) {
  return new Promise((ok, no) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const S = 320, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d');
      const m = Math.min(img.width, img.height); x.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, S, S);
      URL.revokeObjectURL(url); ok(c.toDataURL('image/jpeg', .8));
    };
    img.onerror = no; img.src = url;
  });
}

// ---------- ההגדרות של ילד (בתוך הדף שלו) ----------
const MAX_STEPS = n => n < 20 ? 1 : n < 100 ? 5 : 50;
function settingsCards(kid) {
  kid.math = mathCfg(kid); const m = kid.math;
  const chipRow = (id, items, isOn) => `<div class="chips" id="${id}">${items.map(([v, n]) => `<button class="chip ${isOn(v) ? 'on' : ''}" data-v="${v}">${n}</button>`).join('')}</div>`;
  return `<div class="card"><h3>🧮 סוגי תרגילים</h3><p class="mute small" style="margin-bottom:10px">אפשר לבחור כמה ביחד. המשחק נותן יותר ממה שקשה ${G('לו', 'לה', kid)}.</p>
        ${chipRow('ops', Object.entries(OPS).map(([o, n]) => [o, `${n} ${o}`]), v => m.ops.includes(v))}</div>
      <div class="card"><h3>🔢 עד איזה מספר</h3><p class="mute small" style="margin-bottom:10px">לוחצים + או −. לחיצה ארוכה רצה מהר.</p>
        <div class="stepper" id="maxStep"><button data-d="-1" aria-label="פחות">−</button><b id="maxV">${m.max}</b><button data-d="1" aria-label="יותר">+</button></div></div>
      <div class="card"><h3>📈 רמה בכל משחק</h3><p class="mute small" style="margin-bottom:10px">מתחילה לפי הגיל, עולה לבד אחרי סבב טוב ויורדת אחרי סבב קשה. אפשר לשנות כאן. (בחשבון הרמה נקבעת לבד לפי כל סוג תרגיל.)</p>
        <div class="lvls">${LVL_GAMES.map(id => { const g = FUN_GAME[id].g, v = gameLevel(kid, id); return `<div class="lvrow"><span>${g.ic} ${g.n}</span><div class="lvdots" data-lv="${id}">${[1, 2, 3, 4, 5].map(n => `<button class="${n <= v ? 'on' : ''}" data-n="${n}" aria-label="רמה ${n}">${n}</button>`).join('')}</div></div>`; }).join('')}</div></div>
      <div class="card"><h3>🎈 מהירות הבלונים</h3><p class="mute small" style="margin-bottom:10px">ב"אוטומטי" המשחק מאיץ כשהולך טוב ומאט כשקשה.</p>
        ${chipRow('spd', Object.entries(SPEEDS).map(([k, s]) => [k, s.n]), v => v === m.speed)}</div>
      <div class="card"><h3>🎙️ הקריין</h3><p class="mute small" style="margin-bottom:10px">איזה קול ידבר עם ${esc(kid.name)}. בקרוב יתווספו עוד קריינים.</p>
        ${chipRow('narr', Object.entries(NARRATORS).map(([k, v]) => [k, v.e + ' ' + v.n]), v => v === (kid.narrator || DEF_NARR))}</div>
      <div class="card"><h3>⏳ זמן משחק ביום</h3><p class="mute small" style="margin-bottom:10px">כשהזמן נגמר, המשחק נסגר יפה עם "נתראה מחר!". היום ${G('שיחק', 'שיחקה', kid)} ${Math.round(usedToday(kid))} דקות.</p>
        ${chipRow('lim', [[0, 'בלי הגבלה'], [10, '10 דק׳'], [15, '15 דק׳'], [20, '20 דק׳'], [30, '30 דק׳'], [45, '45 דק׳']], v => +v === (kid.limit || 0))}</div>`;
}
function bindSettings(kid, a) {
  const m = kid.math;
  $$('#ops .chip', a).forEach(b => b.onclick = () => { b.classList.toggle('on'); const on = $$('#ops .chip.on', a).map(x => x.dataset.v); if (!on.length) { b.classList.add('on'); return toast('צריך לפחות סוג אחד'); } m.ops = on; store.save(); });
  const single = (id, f) => $$(`#${id} .chip`, a).forEach(b => b.onclick = () => { $$(`#${id} .chip`, a).forEach(x => x.classList.toggle('on', x === b)); f(b.dataset.v); store.save(); toast('💾 נשמר', 900); });
  $$('.lvdots button', a).forEach(b => b.onclick = () => { const box = b.parentElement, n = +b.dataset.n; setGameLevel(kid, box.dataset.lv, n); $$('button', box).forEach(x => x.classList.toggle('on', +x.dataset.n <= n)); toast(`💾 רמה ${n}`, 900); });
  single('narr', v => { kid.narrator = v; const keep = CUR; CUR = kid; voice.say('שָׁלוֹם!'); CUR = keep; }); single('spd', v => m.speed = v); single('lim', v => kid.limit = +v);
  // ➕➖ עד איזה מספר: 1 עד 20, 5 עד 100, 50 עד 1000. לחיצה ארוכה ממשיכה לבד
  let hold = null, saveT = null;
  const step = d => { const v = m.max, s = d > 0 ? MAX_STEPS(v) : MAX_STEPS(v - 1); m.max = Math.max(5, Math.min(1000, v + d * s)); $('#maxV', a).textContent = m.max; sfx.tap(); clearTimeout(saveT); saveT = setTimeout(() => { store.save(); toast('💾 נשמר', 900); }, 600); };
  $$('#maxStep button', a).forEach(b => {
    const d = +b.dataset.d, stop = () => { clearInterval(hold); clearTimeout(hold); hold = null; };
    b.onpointerdown = e => { e.preventDefault(); step(d); hold = setTimeout(() => { hold = setInterval(() => step(d), 110); }, 450); };
    b.onpointerup = b.onpointerleave = b.onpointercancel = stop;
  });
}
// נשאר לתאימות (הסיור והמדריך): פותח את הדף של הילד ישר בהגדרות
function kidSettings(kid) { kidForm(kid, true); }

// ---------- 🧭 המדריך האישי להורה ----------
const TIPS = {
  '+': k => `<b>חיבור:</b> ${G('קחו', 'קחו', k)} 7 ענבים ועוד 5 ענבים, ו${G('ספרו יחד איתו', 'ספרו יחד איתה', k)} מהמספר הגדול: "שבע... שמונה, תשע...". ככה לא צריך לספור הכל מההתחלה.`,
  '-': k => `<b>חיסור:</b> שימו 12 שקדים על השולחן ותגידו: "${G('אכול', 'אכלי', k)} 5. כמה נשארו?" אפשר גם לצייר קו מספרים על הרצפה ולקפוץ עליו אחורה.`,
  '×': k => `<b>כפל:</b> "3 צלחות, ובכל צלחת 4 עוגיות." ציירו את זה יחד, ואז ספרו בקפיצות: 4, 8, 12. בלי לשנן.`,
  '÷': k => `<b>חילוק:</b> ${G('תנו לו', 'תנו לה', k)} לחלק 12 סוכריות שווה בשווה ל־3 בובות. חילוק הוא "כמה כל אחד מקבל".`,
};
const GAME_N = { balloons: '🎈 בלונים', swipe: '👆 נכון או לא', race: '🏎️ מרוץ', test: '👑 מבחן המלך', pairs: '🃏 זוגות', catch: '🧺 תופסים', shop: '🏪 חנות', islands: '🏝️ מסע באיים',
  puzzle: '🧩 פאזל', diff: '🔍 מצאו את ההבדלים', maze: '🌀 מבוך', train: '🚂 רכבת הדפוסים', sudoku: '🐶 סודוקו', simon: '🔴 סיימון', cups: '🥤 איפה הכדור', changed: '👀 מה השתנה',
  feel: '😊 איך הוא מרגיש', kind: '🤝 מה כדאי לעשות', breath: '🫧 בועת נשימה', mood: '🌈 מצב רוח', color: '🖍️ צביעה', mandala: '🌸 מנדלה',
  nfact: '🦉 טבע: נכון או לא', nriddle: '🕵️ טבע: מי אני', nsort: '🗂️ טבע: לאיזו קבוצה', norder: '🦋 טבע: מה בא קודם', colors: '🎨 צובעים', homes: '🏠 מי גר פה', count: '🍎 סופרים' };
// 💛 מצב הרוח שהילד בחר בשבוע האחרון
function moodTalk(kid) {
  const m = store.st(kid.id).mood || {}, days = Object.keys(m).sort().slice(-7);
  if (!days.length) return '';
  const low = days.filter(d => ['sad', 'angry', 'tired'].includes(m[d])).length;
  return `<div class="card stack" id="moodTalk"><h3>💛 איך ${G('הוא הרגיש', 'היא הרגישה', kid)} השבוע</h3>
    <div class="moodrow">${days.map(d => `<div><em>${MOODS[m[d]]?.[0] || '❔'}</em><small>${new Date(d).toLocaleDateString('he-IL', { weekday: 'short' })}</small></div>`).join('')}</div>
    ${low >= 2 ? `<div class="insight"><span class="ic">🤗</span><div>השבוע היו כמה ימים לא קלים. כדאי למצוא זמן שקט ${G('איתו', 'איתה', kid)}, בלי שיעורים, ולשאול: "מה היה הכי קשה היום? ומה היה הכי טוב?"</div></div>` : `<div class="insight"><span class="ic">🌈</span><div>אפשר לשאול ${G('אותו', 'אותה', kid)} בערב: "מה היה הדבר הכי טוב היום?". זה בונה הרגל של לראות את הטוב.</div></div>`}</div>`;
}
// 🌱 טבע: מה עוד לא יושב טוב, ונושאים לשיחה בבית
function natTalk(kid) {
  const n = store.st(kid.id).nat || {}, names = [];
  (n.fact?.miss || []).forEach(i => FACTS[i] && names.push(strip(FACTS[i][1]).replace(/\.$/, '') + (FACTS[i][2] ? ' (נכון)' : ' (לא נכון)')));
  (n.riddle?.miss || []).forEach(i => RIDDLES[i] && names.push('מי אני: ' + strip(NAT_N[RIDDLES[i][0]])));
  (n.sort?.miss || []).forEach(i => SORT_LIST[i] && names.push(`${strip(NAT_N[SORT_LIST[i][0]])} הוא ${strip(CLASSES[SORT_LIST[i][1]][1])}`));
  (n.order?.miss || []).forEach(i => ORDERS[i] && names.push(strip(ORDERS[i][0])));
  if (!names.length) return '';
  return `<div class="card stack" id="natTalk"><h3>🌱 על מה לדבר ${G('איתו', 'איתה', kid)} בטבע</h3><p class="mute small">אלה דברים ש${G('טעה', 'טעתה', kid)} בהם לאחרונה. הם יחזרו במשחק עד ש${G('ידע', 'תדע', kid)}:</p>
    <ul class="talk">${names.slice(0, 6).map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    <div class="insight"><span class="ic">🔎</span><div>${G('תנו לו', 'תנו לה', kid)} להיות ${G('החוקר', 'החוקרת', kid)}: חפשו יחד תמונה או סרטון קצר על אחד מהם, ${G('ובקשו ממנו', 'ובקשו ממנה', kid)} לספר לכם מה ${G('גילה', 'גילתה', kid)}. בטיול או בגינה, ${G('שאלו אותו', 'שאלו אותה', kid)}: "זה יונק או עוף? איך ${G('אתה יודע', 'את יודעת', kid)}?"</div></div></div>`;
}
function parentGuide(kid) {
  applyTheme(kid.theme);
  const s = store.st(kid.id), ev = s.events, he = G('הוא', 'היא', kid), him = G('לו', 'לה', kid);
  const pct = (c, n) => n ? Math.round(c / n * 100) : 0;
  const week = Object.entries(s.days).filter(([d]) => (Date.now() - new Date(d)) / 864e5 < 7).reduce((a, [, v]) => a + v, 0) / 60;
  let body;
  if (ev.length < 12) {
    body = `<div class="card center">${mascot()}<h3 style="margin-top:8px">עוד אין מספיק נתונים</h3><p class="mute">אחרי כמה סבבים של משחק יופיעו כאן המלצות: מה עובד ${G('אצלו', 'אצלה', kid)}, מתי ${he} ${G('מרוכז', 'מרוכזת', kid)} ואיך להסביר ${him}.</p><p class="mute small" style="margin-top:8px">עד עכשיו: ${ev.length} תשובות</p></div>`;
  } else {
    const games = Object.entries(s.games).filter(([, g]) => g.n >= 3).map(([id, g]) => ({ id, acc: pct(g.c, g.n), rounds: g.rounds, ms: g.ms / g.n, score: pct(g.c, g.n) + g.rounds * 6 })).sort((a, b) => b.score - a.score);
    const ops = Object.entries(s.ops).filter(([op, o]) => o.n >= 3 && OPS[op]).map(([op, o]) => ({ op, acc: pct(o.c, o.n), n: o.n })).sort((a, b) => a.acc - b.acc);
    const buckets = { 'בבוקר': [], 'בצהריים': [], 'אחר הצהריים': [], 'בערב': [] };
    ev.forEach(e => { const h = new Date(e.t).getHours(); buckets[h < 12 ? 'בבוקר' : h < 15 ? 'בצהריים' : h < 19 ? 'אחר הצהריים' : 'בערב'].push(e.ok); });
    const tb = Object.entries(buckets).filter(([, v]) => v.length >= 6).map(([k, v]) => ({ k, acc: pct(v.filter(Boolean).length, v.length) })).sort((a, b) => b.acc - a.acc);
    // ריכוז: האם ההצלחה יורדת בסוף סבב ארוך?
    const sess = []; let curS = [];
    ev.forEach((e, i) => { if (i && e.t - ev[i - 1].t > 5 * 60e3) { sess.push(curS); curS = []; } curS.push(e); }); sess.push(curS);
    const long = sess.filter(x => x.length >= 16);
    let focus = '';
    if (long.length) {
      const first = long.flatMap(x => x.slice(0, 8)), late = long.flatMap(x => x.slice(12));
      const a1 = pct(first.filter(e => e.ok).length, first.length), a2 = pct(late.filter(e => e.ok).length, late.length);
      const mins = Math.round(long.map(x => (x[11].t - x[0].t) / 60e3).reduce((a, b) => a + b, 0) / long.length);
      focus = a1 - a2 >= 12 ? `ההצלחה יורדת מ־${a1}% ל־${a2}% אחרי בערך ${Math.max(3, mins)} דקות. כדאי לעשות הפסקה קצרה בשלב הזה.` : `${he} ${G('שומר', 'שומרת', kid)} על ריכוז גם בסבבים ארוכים. ${G('יפה מאוד', 'יפה מאוד', kid)}!`;
    }
    const total = ev.length, accAll = pct(ev.filter(e => e.ok).length, total);
    body = `<div class="kv"><div><b>${accAll}%</b><small>הצלחה</small></div><div><b>${Math.round(week)}</b><small>דקות השבוע</small></div><div><b>⭐ ${s.stars}</b><small>כוכבים</small></div></div>
      <div class="card"><h3>📊 מה ${G('מתחבר אליו', 'מתחבר אליה', kid)}</h3><p class="mute small" style="margin-bottom:10px">הצלחה + כמה פעמים ${he} ${G('חזר', 'חזרה', kid)} למשחק</p>
        <div class="bars">${games.map(g => `<div class="bar"><label><span>${GAME_N[g.id] || g.id}</span><span>${g.acc}% · ${g.rounds} סבבים</span></label><div class="t"><i style="width:${Math.min(100, g.score)}%"></i></div></div>`).join('')}</div></div>
      <div class="card stack"><h3>🧑‍🏫 איך ללמוד ${G('איתו', 'איתה', kid)}</h3>
        ${games[0] ? `<div class="insight"><span class="ic">🎮</span><div>${he} הכי ${G('מתחבר', 'מתחברת', kid)} ל<b>${GAME_N[games[0].id] || games[0].id}</b>. כש${he} ${G('עייף', 'עייפה', kid)} או לא ${G('רוצה', 'רוצה', kid)}, תתחילו דווקא משם.</div></div>` : ''}
        ${tb.length >= 2 ? `<div class="insight"><span class="ic">⏰</span><div>הזמן הכי טוב ${him}: <b>${tb[0].k}</b> (${tb[0].acc}% הצלחה). הכי פחות טוב: ${tb[tb.length - 1].k} (${tb[tb.length - 1].acc}%). כדאי להעביר שיעורי בית לשעה הטובה.</div></div>` : ''}
        ${focus ? `<div class="insight"><span class="ic">⏱️</span><div>${focus}</div></div>` : `<div class="insight"><span class="ic">⏱️</span><div>כלל אצבע לילדים: 6 דקות עבודה, ואחריהן 2 דקות הפסקת תנועה.</div></div>`}
        <div class="insight"><span class="ic">💪</span><div>${G('שבחו אותו', 'שבחו אותה', kid)} על המאמץ: "ראיתי ש${G('התאמצת', 'התאמצת', kid)} בתרגיל הזה", במקום "${G('אתה חכם', 'את חכמה', kid)}".</div></div></div>
      ${ops.length ? `<div class="card stack"><h3>💬 איך להסביר ${him}</h3>
        <div class="bars">${ops.map(o => `<div class="bar"><label><span>${OPS[o.op]} ${o.op}</span><span>${o.acc}%</span></label><div class="t"><i style="width:${o.acc}%"></i></div></div>`).join('')}</div>
        <div class="insight"><span class="ic">🎯</span><div>הכי קשה ${him} עכשיו: <b>${OPS[ops[0].op]}</b> (${ops[0].acc}%). המשחק כבר נותן ${him} יותר מזה, ברמה קלה יותר.</div></div>
        <div class="insight"><span class="ic">🏠</span><div>${TIPS[ops[0].op](kid)}</div></div>
        <div class="insight"><span class="ic">👩‍🏫</span><div>טריק שעובד: ${G('בקשו ממנו', 'בקשו ממנה', kid)} ללמד <i>אתכם</i> תרגיל. כשילד מלמד, הוא זוכר יותר.</div></div></div>` : ''}
      ${moodTalk(kid)}${natTalk(kid)}`;
  }
  show(`<div class="topbar">${backBtn()}<div class="title">🧭 המדריך של ${esc(kid.name)}</div><span style="width:46px"></span></div>
    <div class="stack">${body}</div>
    <p class="mute small center" style="margin-top:16px">ההמלצות מתעדכנות אחרי כל משחק. יש כאן תמונה של מה שעובד, לא אבחון.</p>`, a => { $('#back', a).onclick = parentHome; });
}

// ---------- 🎤 בדיקת קריין וזיהוי קול ----------
function deviceTest() {
  voice.pick(); const voices = voice.all.filter(voice.isHe);
  if (!voice.all.length && !deviceTest._retry) { deviceTest._retry = 1; setTimeout(() => { deviceTest._retry = 0; deviceTest(); }, 900); }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  show(`<div class="topbar">${backBtn()}<div class="title">🎤 בדיקת מכשיר</div><span style="width:46px"></span></div>
    <div class="stack">
      <div class="card"><h3>🗣️ הקריין</h3><p class="mute small" style="margin-bottom:10px">${voices.length ? `נמצאו ${voices.length} קולות בעברית. לוחצים על קול כדי לשמוע אותו, והוא נבחר.` : 'לא נמצא קול עברי בטלפון הזה. אפשר להוסיף אותו בהגדרות הטלפון (נגישות ← תוכן מדובר ← קולות ← עברית).'}</p>
        <div class="stack">${voices.map((v, i) => `<button class="btn ghost full" data-v="${i}">${voice.he && voice.he.name === v.name ? '✅ ' : ''}${esc(v.name)}</button>`).join('')}</div>
        <button class="btn full" id="sample" style="margin-top:10px">▶️ להשמיע משפט לדוגמה</button></div>
      <div class="card"><h3>🎤 זיהוי קול (לקריאה בקול)</h3>
        <p class="mute small" style="margin-bottom:10px">${SR ? 'לוחצים "התחל", ואומרים בקול: "דנה הלכה לגן". מה שהטלפון שמע יופיע למטה.' : '❌ הדפדפן הזה לא תומך בזיהוי קול. נשתמש בדרכים האחרות לתרגל קריאה.'}</p>
        ${SR ? '<button class="btn full" id="mic">🎤 התחל</button>' : ''}
        <div class="log" id="log" style="margin-top:10px"></div></div>
      <div class="card"><h3>📋 מה לספר למוישי</h3><div class="log" id="sum"></div><button class="btn ghost full" id="send" style="margin-top:10px">💌 לשלוח את התוצאות</button></div>
    </div>`, a => {
    $('#back', a).onclick = parentHome;
    const result = { voices: voices.map(v => v.name).join(', ') || 'אין', sr: SR ? 'יש' : 'אין', heard: '' };
    const sum = () => $('#sum', a).textContent = `מכשיר: ${navigator.userAgent.match(/iPhone|iPad|Android[^;)]*|Mac|Windows/)?.[0] || '?'}\nקולות עבריים: ${result.voices}\nהקול שנבחר: ${voice.he ? voice.he.name + ' (' + voice.he.lang + ')' : 'אין'}\nכל הקולות: ${voice.all.length} (${[...new Set(voice.all.map(v => v.lang))].slice(0, 12).join(', ')})\nזיהוי קול: ${result.sr}\nמה נשמע: ${result.heard || '—'}\nיומן קריין:\n${voice.log.join('\n') || '—'}`;
    sum();
    $$('[data-v]', a).forEach(b => b.onclick = () => { voice.he = voices[+b.dataset.v]; store.d.voiceName = voice.he.name; store.save(); voice.say('שָׁלוֹם! אֲנִי נִיצוֹץ. כַּמָּה זֶה שֶׁבַע פְּלוּס חָמֵשׁ?'); $$('[data-v]', a).forEach(x => x.textContent = x.textContent.replace('✅ ', '')); b.textContent = '✅ ' + b.textContent; });
    $('#sample', a).onclick = () => { setTimeout(sum, 3000); voice.say('שָׁלוֹם! אֲנִי נִיצוֹץ. כָּל הַכָּבוֹד, אַתְּ אַלּוּפָה! דָּנָה הָלְכָה לַגַּן וְרָאֲתָה פַּרְפַּר צִבְעוֹנִי.'); };
    if (SR) $('#mic', a).onclick = () => {
      const r = new SR(); r.lang = 'he-IL'; r.interimResults = true; r.continuous = false; const log = $('#log', a);
      log.textContent = '🎤 מקשיב...';
      r.onresult = e => { const t = [...e.results].map(x => x[0].transcript).join(' '); log.textContent = '👂 ' + t; result.heard = t; sum(); };
      r.onerror = e => { log.textContent = '❌ שגיאה: ' + e.error + (e.error === 'not-allowed' ? ' (צריך לאשר מיקרופון)' : ''); result.heard = 'שגיאה ' + e.error; sum(); };
      r.onend = () => { if (log.textContent.startsWith('🎤')) log.textContent = 'לא נשמע כלום. נסו שוב קרוב יותר לטלפון.'; };
      try { r.start(); } catch (e) { log.textContent = '❌ ' + e.message; }
    };
    $('#send', a).onclick = () => openFeedback('בדיקת מכשיר:\n' + $('#sum', a).textContent, 'bug');
  });
}

// ---------- 💌 משוב ----------
const FEEDBACK_TO = 'mvindish@gmail.com', FEEDBACK_KEY = 'afe845b5ff6d0c2cd899d08390663e7c';
// גם שומרים את ההערה בטבלת ההערות של לוח הניהול (רק הוספה, בלי שמות של הילדים מעבר למה שנכתב)
const SB_URL = 'https://dmhxovlepdoobkoiyjhj.supabase.co', SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtaHhvdmxlcGRvb2Jrb2l5amhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNDUxNDIsImV4cCI6MjEwNzkyMTE0Mn0.qao1CRL1QWJhMnWsAaPXKt-WxbgySqIlH68iIdCYH1o';
const devName = () => `${navigator.userAgent.match(/iPhone|iPad|Android[^;)]*|Mac|Windows/)?.[0] || '?'} · ${screen.width}×${screen.height}`;
// FormSubmit מחזיר 200 גם כשהטופס עוד לא הופעל, לכן בודקים את התשובה עצמה
async function mailOk(r) { if (!r.ok) return false; try { const j = await r.json(); return j.success === true || j.success === 'true'; } catch { return false; } }
async function saveFeedbackDb(kind, message) {
  if (/^(localhost|127\.0\.0\.1|\[::1\])$|\.localhost$/.test(location.hostname)) return false; // בדיקות במחשב לא נשלחות לשרת
  try {
    const r = await fetch(SB_URL + '/rest/v1/rpc/feedback_anon', { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_app: 'lomdim', p_kind: kind, p_message: String(message).slice(0, 5000), p_device: devName() }) });
    return r.ok && (await r.json()) === true;
  } catch { return false; }
}
const KINDS = { idea: '💡 רעיון', bug: '🐞 משהו לא עובד', love: '❤️ מחמאה', other: '💬 אחר' };
function openFeedback(text = '', kind = 'other') {
  openSheet(`<h2>💌 שליחת משוב</h2><p class="mute small" style="margin-bottom:12px">כל הערה, רעיון או תקלה מגיעים ישר למוישי, ועוזרים לשפר את המשחק 🙏</p>
    <div class="chips" style="margin-bottom:12px">${Object.entries(KINDS).map(([k, n]) => `<button class="chip ${k === kind ? 'on' : ''}" data-fk="${k}">${n}</button>`).join('')}</div>
    <label class="field"><textarea id="fMsg" rows="5" placeholder="מה תרצו לספר?">${esc(text)}</textarea></label>
    <div class="err" id="fErr"></div><button class="btn full" id="fSend">📨 שליחה</button>`, s => {
    $$('[data-fk]', s).forEach(b => b.onclick = () => { kind = b.dataset.fk; $$('[data-fk]', s).forEach(x => x.classList.toggle('on', x === b)); });
    $('#fSend', s).onclick = async e => {
      const message = $('#fMsg', s).value.trim(); if (message.length < 2) { $('#fErr', s).textContent = 'צריך לכתוב משהו 🙂'; return; }
      e.target.disabled = true; e.target.textContent = 'שולח...';
      let ok = false; const db = saveFeedbackDb(kind, message);
      try {
        const r = await fetch(`https://formsubmit.co/ajax/${FEEDBACK_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ _subject: `💌 משוב חדש — לומדים בכיף (${KINDS[kind]})`, _template: 'table', _captcha: 'false', 'סוג': KINDS[kind], 'משוב': message,
            'מכשיר': `${navigator.userAgent.match(/iPhone|iPad|Android[^;)]*|Mac|Windows/)?.[0] || '?'} · ${screen.width}×${screen.height}` }) });
        ok = await mailOk(r);
      } catch { }
      ok = (await db) || ok;
      if (ok) { closeSheet(); confetti(); toast('💌 תודה! המשוב נשלח'); return; }
      e.target.disabled = false; e.target.textContent = '📨 שליחה'; failNote('feedback', 'feedback: mail+db failed');
      $('#fErr', s).innerHTML = `לא הצלחתי לשלוח (אין אינטרנט?). אפשר <a href="mailto:${FEEDBACK_TO}?subject=${encodeURIComponent('משוב — לומדים בכיף')}&body=${encodeURIComponent(message)}" style="color:#F9A8D4">לשלוח במייל רגיל</a>`;
    };
  });
}

// ---------- 🧪 מצב ניסיון: שום דבר לא נשמר ----------
function demoPick() {
  const opts = [
    { age: '3', gender: 'm', name: 'ניסיון', e: '👦', t: 'העולם של הקטנים', d: 'בן, גיל 3', theme: 'green' },
    { age: '3', gender: 'f', name: 'ניסיון', e: '👧', t: 'העולם של הקטנים', d: 'בת, גיל 3', theme: 'pink' },
    { age: '8', gender: 'f', name: 'ניסיון', e: '👧', t: 'העולם של הגדולים', d: 'בת, גיל 8 (חשבון וטבע)', theme: 'purple' },
    { age: '8', gender: 'm', name: 'ניסיון', e: '👦', t: 'העולם של הגדולים', d: 'בן, גיל 8 (חשבון וטבע)', theme: 'blue' },
  ];
  openSheet(`<h2>🧪 לנסות כמו ילד</h2><p class="mute small" style="margin-bottom:12px">בוחרים גיל ומין, ומשחקים. שום דבר לא נשמר, והפרופילים של הילדים לא משתנים.</p>
    <div class="menu">${opts.map((o, i) => `<button class="mitem" data-o="${i}"><span class="ic" style="background:var(--g${i + 1})">${o.e}</span><span class="grow">${o.t}<small>${o.d}</small></span>‹</button>`).join('')}</div>`, sh => {
    $$('[data-o]', sh).forEach(b => b.onclick = () => {
      const o = opts[+b.dataset.o]; closeSheet(); store.demo = {};
      const kid = { id: 'demo-' + uid(), name: o.name, age: o.age, gender: o.gender, cls: '', theme: o.theme, photo: '', math: { ...DEF_MATH }, limit: 0, demo: true };
      document.body.classList.add('demo-mode'); enterKid(kid);
    });
  });
}

// ---------- ↩️ שחזור הגדרות ההתחלה: רק הגדרות. ילדים, תמונות, כוכבים והתקדמות נשארים ----------
function resetSettings() {
  openSheet(`<h2>↩️ שחזור הגדרות ההתחלה</h2>
    <p style="margin:8px 0 6px"><b>מה חוזר להתחלה, לכל הילדים:</b></p>
    <ul class="rs-list"><li>🧮 סוגי תרגילים ועד איזה מספר</li><li>📈 הרמה בכל משחק (חוזרת להתאים לגיל)</li><li>🎈 מהירות הבלונים</li><li>🎙️ הקריין</li><li>⏳ זמן משחק ביום (בלי הגבלה)</li><li>🎓 ההסבר "איך משחקים?" יופיע שוב בפעם הבאה</li></ul>
    <p style="margin:12px 0 6px"><b>מה נשאר בדיוק כמו שהוא:</b></p>
    <ul class="rs-list keep"><li>👧👦 הילדים, השמות והתמונות</li><li>⭐ הכוכבים, ההתקדמות והמדריך האישי</li><li>🔐 החשבון וקוד ההורה</li></ul>
    <div class="stack" style="margin-top:14px"><button class="btn full" id="rs1">המשך</button><button class="btn ghost full" id="rsNo">ביטול</button></div>`, s => {
    $('#rsNo', s).onclick = closeSheet;
    $('#rs1', s).onclick = () => openSheet(`<h2>בטוח?</h2><p>ההגדרות של כל הילדים יחזרו להתחלה. אי אפשר לבטל את זה, אבל אפשר לשנות שוב בדף של כל ילד.</p>
      <div class="row" style="margin-top:16px;gap:10px"><button class="btn ghost grow" id="rsBack">לא</button><button class="btn danger grow" id="rsYes">כן, לשחזר</button></div>`, s2 => {
      $('#rsBack', s2).onclick = closeSheet;
      $('#rsYes', s2).onclick = () => {
        store.d.kids.forEach(k => {
          k.math = { ...DEF_MATH }; k.limit = 0; delete k.narrator;
          const st = store.st(k.id); delete st.lvl; delete st.howto;
        });
        delete store.d.parentTheme;
        store.save(); closeSheet(); toast('↩️ ההגדרות חזרו להתחלה. הילדים וההתקדמות נשארו'); parentHome();
      };
    });
  });
}
