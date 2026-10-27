// לומדים בכיף — ✨ מה חדש. בכל פרסום מוסיפים כאן שורה (החדש למעלה).
// v = תאריך העדכון (YYYY-MM-DD). כמה פרסומים באותו יום → אותה רשומה.
// כל שורה: e = אימוג'י, t = כותרת קצרה, d = משפט אחד, go = לאן "תראו לי" לוקח (לא חובה),
// ok = 'YYYY-MM-DD' כשאושר בעמדת הבדיקה (לא מוצג יותר). את הכותרת t לא משנים אחרי פרסום (היא חלק מהמפתח בעמדה).
// phone = מה לבדוק בטלפון ואיך (חובה כשאי אפשר לבדוק במחשב: קול, מגע והחלקה, טביעת אצבע, גלריה, התקנה...).
// החלון קופץ בפתיחת האפליקציה אחרי עדכון, אף פעם לא כשילד באמצע משחק. עמדת הבדיקה קוראת את NEWS מכאן.
'use strict';

const NEWS = [
  { v: '2026-10-25', items: [
    { e: '📦', t: 'התקנה גם מתוך וואטסאפ', d: 'מי שפתח את הקישור מתוך אפליקציה אחרת מקבל כפתור "🌐 לפתוח ב־Chrome", ומשם מתקינים.', phone: 'בטלפון אנדרואיד: לשלוח לעצמך את הקישור בוואטסאפ, לפתוח אותו משם, ללחוץ 📲 התקנה, ולראות שמופיע "לפתוח ב־Chrome" ושזה נפתח בכרום.' },
    { e: '🍎', t: 'מאות שאלות לקטנים', d: 'בכל נושא של הקטנים יש עכשיו עשרות שאלות, עד 100, עם תמונות אמיתיות. ושני נושאים חדשים: 🍎 פירות וירקות ו־🦒 איפה החיה?', go: 'fruits' },
    { e: '🌱', t: 'מעל 100 שאלות בטבע', d: 'במשחקי הטבע של הגדולים: 111 משפטים, 104 חידות, 106 חיות למיון ו־101 סדרות. חדש: החגים, ימי השבוע וחודשי השנה.', go: 'nature' },
    { e: '🔀', t: 'בלי חזרות', d: 'שאלה לא חוזרת עד שכל השאלות בנושא הופיעו. כל ילד ממשיך מאיפה שעצר, ומה שהוא טעה בו חוזר אחרי 3 שאלות.', go: 'animals' },
  ] },
  { v: '2026-10-22', items: [
    { e: '↩️', t: 'שחזור הגדרות ההתחלה', d: 'בתחתית אזור ההורה: כל ההגדרות חוזרות להתחלה, עם אישור כפול. הילדים, התמונות והכוכבים נשארים.', go: 'reset' },
    { e: '👇', t: 'משיכה למטה סוגרת חלונות', d: 'מושכים חלון למטה מלמעלה, והוא יורד עם האצבע ונסגר. בדיוק כמו בכסף בכיף.', go: 'notes', phone: 'בטלפון: לפתוח 💬 הערות, ולמשוך את החלון למטה מהחלק העליון שלו. משיכה קצרה מחזירה, משיכה ארוכה סוגרת.', ok: '2026-10-22' },
  ] },
  { v: '2026-10-21.2', items: [
    { e: '🎬', t: 'כפתור הדגמה בכל משחק', d: 'רוצים לראות שוב איך משחקים? לוחצים למעלה על "🎬 הדגמה".', go: 'train' },
    { e: '🌟', t: 'מסך "מה חדש" חדש', d: 'מסך מלא ונוצץ, כרטיס לכל חידוש. מחליקים או נוגעים בצד, ו"🔊 ניצוץ מספר" מקריא לילדים.', go: 'news', phone: 'בטלפון: לפתוח את המשחק אחרי עדכון, להחליק באצבע בין הכרטיסים, וללחוץ "🔊 ניצוץ מספר" ולשמוע שהוא מקריא.' },
    { e: '📈', t: 'רמה בכל משחק', d: 'כל משחק מתחיל לפי הגיל ועולה או יורד לבד. רואים ומשנים בדף של הילד.', go: 'kidSettings' },
    { e: '🎓', t: 'איך משחקים?', d: 'בפעם הראשונה בכל משחק: הדגמה קטנה וניצוץ מסביר. ב"מצאו את ההבדלים" גם סיבוב ניסיון.', go: 'howto', phone: 'בטלפון: להיכנס למשחק חדש ולשמוע שניצוץ מקריא את ההסבר בקול.' },
    { e: '📷', t: 'כמה תמונות לכל ילד', d: 'עד 5 תמונות שמתחלפות. לחיצה על הילד מגדילה את התמונה לכל המסך. וכל ההגדרות שלו בתוך הדף שלו, עם ➕ ו־➖.', go: 'kidPage', phone: 'בטלפון: בדף של הילד ללחוץ \"📷 להוסיף תמונות\", לבחור 2 או 3 תמונות מהגלריה ולשמור. אחר כך במסך הפתיחה לגעת בעיגול של הילד ולראות שהתמונה גדלה לכל המסך.' },
    { e: '🚂', t: 'רכבת הדפוסים ופאזל תמונה', d: 'במקום המבוך: מה הקרון הבא? והפאזל החדש: שמים כל חלק במקום שלו.', go: 'train' },
    { e: '🔐', t: 'הרשמה, קוד הורה וטביעת אצבע', d: 'הורה נרשם פעם אחת, עם אותו חשבון כמו בכסף בכיף. לאזור ההורה נכנסים עם קוד או טביעת אצבע, בלי תרגיל.', go: 'account', phone: 'בטלפון: באזור ההורה ← "החשבון וקוד ההורה" ← להוסיף טביעת אצבע. אחר כך לצאת ולהיכנס שוב לאזור ההורה, ולראות שהוא מבקש אצבע.' },
    { e: '🔁', t: 'סיור תיקונים', d: 'עובר רק על המסכים שתוקנו מההערות שלך: ההערה, מה שינינו, ואיך זה היה לפני. בכל מסך ✅ מאשר או 🔧 עוד לא טוב, עם מקום להערה.', go: 'review' },
    { e: '🛠️', t: '4 תיקונים מההערות', d: 'המבוך, "איפה הכדור?", סיימון, וחלון ההערות שהתרענן במשיכה למטה.', go: 'review', phone: 'בטלפון: בחלון ההערות (💬) למשוך למטה מראש החלון. החלון יורד ונסגר, והאפליקציה לא מתרעננת.' },
    { e: '🧒', t: '"מה חדש" גם לילדים', d: 'במסך של כל ילד יש כפתור "✨ מה חדש?" שמנצנץ כשיש חידוש. רק מה שמתאים לגיל שלו, וניצוץ מקריא.', go: 'kidHome', phone: 'בטלפון: במסך של ילד ללחוץ \"✨ מה חדש?\" ולשמוע את ניצוץ מקריא.' },
  ] },
  { v: '2026-10-21', items: [
    { e: '✨', t: 'חלון "מה חדש"', d: 'אחרי כל עדכון מופיע כאן מה השתנה, פעם אחת, רק באזור ההורה. כל ההיסטוריה בתפריט ← "✨ מה חדש".', go: 'news' },
    { e: '👀', t: '"תראו לי" ליד כל שורה', d: 'כל חידוש לוקח ישר למקום שלו. אחר כך הכפתור הצף "✨ חזרה למה חדש" מחזיר לרשימה, וליד מה שכבר ראיתם יש ✓ ירוק.', go: 'kidguide' },
    { e: '🚀', t: 'כניסה מהירה מהמדריך', d: 'במדריך יש עכשיו כפתור כניסה גדול בכמה מקומות, וכפתור קטן שצף בתחתית.', go: 'guide', phone: 'בטלפון: לפתוח את המדריך ולגלול למטה, ולראות שהכפתור הצף "🚀 כניסה לאפליקציה" מופיע בתחתית.' },
  ] },
  { v: '2026-10-20', items: [
    { e: '🎉', t: '5 עולמות חדשים, לא לימודים', d: 'לילדים הגדולים: 🧩 חשיבה, 🧠 זיכרון וקשב, 💛 רגשות ורוגע, 🎨 יצירה, ו־🧸 משחקי הקטנים.' },
    { e: '⏱️', t: 'משחקים של 5 דקות', d: 'כל משחק של הגדולים נמשך 5 דקות, עם עשרות שאלות ותמונות שמתחלפות.' },
    { e: '🌱', t: 'עולם הטבע', d: '4 משחקים עם תמונות אמיתיות. במדריך האישי יש רעיון לשיחה או לטיול לפי מה שהילד טעה בו.', go: 'kidguide' },
    { e: '🎭', t: 'מצב הדגמה וסיור מודרך', d: 'משפחה מדומה, סיור בכל המסכים עם "הבא", והערות שנשלחות ביחד.', go: 'show' },
    { e: '🖼️', t: 'כל התמונות בתוך האפליקציה', d: 'בערך 500 תמונות נטענות מהר, וגם בלי אינטרנט.', phone: 'בטלפון: אחרי שפתחו פעם אחת עם אינטרנט, לכבות אינטרנט, לפתוח משחק, ולראות שהתמונות מופיעות.' },
  ] },
];

const NEWS_KEY = 'lbk-news';
// ✅ מה שכבר אושר בעמדת הבדיקה: לא מראים שוב. ok בקובץ (לכולם), ולמנהל המחובר גם מה שאושר ועוד לא פורסם
let NEWS_APPROVED = new Set((() => { try { return JSON.parse(localStorage.getItem('lbk-news-ok')) || []; } catch { return []; } })());
const newsKey = (v, it) => `lomdim|${v}|${it.t}`;
const newsShown = (v, it) => !it.ok && !NEWS_APPROVED.has(newsKey(v, it));
async function loadApproved() {
  try {
    const c = await auth.client(); const { data, error } = await c.rpc('bdika_approved', { p_app: 'lomdim' });
    if (error || !Array.isArray(data)) return;
    const keys = data.map(x => typeof x === 'string' ? x : x.item_key || x.bdika_approved).filter(Boolean);
    NEWS_APPROVED = new Set(keys); try { localStorage.setItem('lbk-news-ok', JSON.stringify(keys)); } catch { }
  } catch { }
}
// אם החלון נפתח מחוץ לאזור ההורה (בפתיחת האפליקציה), מה ששייך להורה עובר קודם את שער ההורה
const viaGate = f => () => (typeof inParent !== 'undefined' && inParent) || (typeof SHOW !== 'undefined' && SHOW.on) ? f() : parentGate(f);
const NEWS_GO = {
  news: () => openNews(true),
  review: viaGate(() => reviewStart()),
  account: viaGate(() => accountSheet()),
  guide: () => { location.href = 'guide/'; },
  show: viaGate(() => showcaseStart()),
  train: () => { const k = store.d.kids.find(x => +x.age >= 6) || store.d.kids[0]; if (!k) return; CUR = k; applyTheme(k.theme); startGame('train'); },
  howto: () => { const k = store.d.kids.find(x => +x.age >= 6) || store.d.kids[0]; if (!k) return; CUR = k; applyTheme(k.theme); howto('train', () => startGame('train')); },
  kidHome: () => { const k = store.d.kids[0]; if (k) { CUR = k; applyTheme(k.theme); home(); } },
  kidPage: viaGate(() => { const k = store.d.kids[0]; k ? kidForm(k) : parentHome(); }),
  kidSettings: viaGate(() => { const k = store.d.kids[0]; k ? kidForm(k, true) : parentHome(); }),
  notes: () => notes.open(),
  nature: () => { const k = store.d.kids.find(x => +x.age >= 6) || store.d.kids[0]; if (!k) return; CUR = k; applyTheme(k.theme); natureHub(); },
  fruits: () => { const k = store.d.kids.find(x => +x.age < 6) || store.d.kids[0]; if (!k) return; CUR = k; applyTheme(k.theme); startGame('fruits'); },
  animals: () => { const k = store.d.kids.find(x => +x.age < 6) || store.d.kids[0]; if (!k) return; CUR = k; applyTheme(k.theme); startGame('animals'); },
  reset: viaGate(() => { parentHome(); setTimeout(() => $('#resetBtn')?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300); }),
  kidguide: viaGate(() => { const k = store.d.kids[0]; k ? parentGuide(k) : parentHome(); }),
};
const lsNews = { get() { try { return localStorage.getItem(NEWS_KEY); } catch { return null; } }, set(v) { try { localStorage.setItem(NEWS_KEY, v); } catch { } } };

// נקרא כשנכנסים לאזור ההורה
function maybeNews() {
  if (typeof BDIKA !== 'undefined' && BDIKA) return;
  if (!NEWS.length || (typeof SHOW !== 'undefined' && SHOW.on)) return;
  const last = NEWS[0].v, seen = lsNews.get();
  if (seen === last) return;
  // אין סימון: הורה בלי ילדים הוא חדש, יש לו את המדריך. הורה ותיק רואה רק את העדכון האחרון
  if (!seen && !store.d.kids.length) { lsNews.set(last); return; }
  const items = NEWS.filter(n => !seen ? n.v === last : n.v > seen).flatMap(n => n.items.filter(it => newsShown(n.v, it)).map(it => ({ ...it, v: n.v })));
  if (!items.length) { lsNews.set(last); return; }
  // קופץ במסך הפתיחה או באזור ההורה, אף פעם לא כשילד באמצע משחק
  setTimeout(() => { if ($('#sheet').classList.contains('on') || $('#gate.on') || CUR) return; openNews(false, items); }, 700);
}

// מה שניצוץ מקריא לילדים: השורות של הילדים מהעדכון האחרון
const kidSays = () => (KID_NEWS[0]?.items || []).map(i => i.s).filter(Boolean).slice(0, 4);
// newsBack = איפה עצרנו ברשימה, כדי לחזור אליה אחרי "👀 תראו לי"
let newsBack = null;
// ✨ מה חדש: מסך מלא נוצץ בסגנון סטוריז (עיצוב משותף עם כסף בכיף, בצבעים של לומדים בכיף).
// כרטיס לכל חידוש, פסים למעלה, ובסוף "🎉 זהו!". בלי מעבר אוטומטי, כי ילד קורא לאט.
// הכותרת והטקסט לא זזים (ילד קורא אותם). זזים רק האימוג'י והנצנצים שמסביב.
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function openNews(all = false, items = null, restore = false) {
  lsNews.set(NEWS[0]?.v || '');
  $('.news-fab')?.remove();
  const seen = newsBack?.seen || [];
  const dLabel = v => new Date(v.slice(0, 10) + 'T12:00:00').toLocaleDateString('he-IL', { day: 'numeric', month: 'long' });
  const list = all ? NEWS.flatMap(n => n.items.map(it => ({ ...it, v: n.v }))) : (items || NEWS[0].items.filter(it => newsShown(NEWS[0].v, it))).map(it => ({ ...it, v: it.v || NEWS[0].v }));
  const n = list.length, many = n > 20, kid = kidSays().length > 0;
  const stars = Array.from({ length: 16 }, (_, k) => `<i style="--x:${(k * 37) % 100}%;--y:${(k * 53) % 100}%;--s:${.6 + (k % 4) * .25};--t:${2 + (k % 5) * .6}s;--dl:${(k % 7) * .4}s">${k % 3 ? '✦' : '✧'}</i>`).join('');
  const card = (it, k) => `<section class="nx-card" data-k="${k}">
      <div class="nx-emo">${it.e}</div><h2>${esc(it.t)}</h2><p>${esc(it.d)}</p>
      ${it.go && it.go !== 'news' ? `<button class="nx-go ${seen.includes(it.go) ? 'seen' : ''}" data-ng="${it.go}">${seen.includes(it.go) ? '✓ ' : ''}👀 תראו לי</button>` : ''}
      <small class="nx-day">${all ? '📅 ' + dLabel(it.v) : `${k + 1} מתוך ${n}`}</small></section>`;
  const end = `<section class="nx-card nx-end" data-k="${n}"><div class="nx-emo">🎉</div><h2>זהו! תיהנו</h2><p>${all ? 'זו כל ההיסטוריה.' : 'אפשר לראות הכל שוב באזור ההורה ← "✨ מה חדש".'}</p>
      <button class="nx-done" id="nxDone">יאללה, לשחק ✨</button></section>`;
  openSheet(`<!--full--><div class="nx ${reducedMotion() ? 'calm' : ''}">
    <div class="nx-bg">${stars}</div>
    ${many ? `<div class="nx-count"><span id="nxCnt">1</span> / ${n + 1}</div>` : `<div class="nx-bars">${[...list, 0].map(() => '<i><b></b></i>').join('')}</div>`}
    <div class="nx-top"><div><b class="nx-title">✨ ${all ? 'כל מה שחדש' : 'יש חדש!'}</b><small>${all ? `${n} חידושים` : `${dLabel(NEWS[0].v)} · <span class="nx-pill">${n} חידושים</span>`}</small></div>
      ${kid ? '<button class="nx-say" id="nxSay" aria-label="ניצוץ מספר">🔊 ניצוץ מספר</button>' : ''}<button class="nx-x" id="nxX" aria-label="סגירה">✕</button></div>
    <div class="nx-track" id="nxTrack">${list.map(card).join('')}${end}</div>
    <div class="nx-hint">מחליקים או נוגעים בצד ←</div></div>`, sh => {
    const track = $('#nxTrack', sh), cards = [...track.children], bars = $$('.nx-bars i', sh);
    let idx = -1;
    const go = k => { k = Math.max(0, Math.min(cards.length - 1, k)); cards[k].scrollIntoView({ inline: 'start', block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' }); };
    const setIdx = k => {
      if (k === idx) return; idx = k;
      cards.forEach((c, j) => c.classList.toggle('on', j === k));
      bars.forEach((b, j) => { b.className = j <= k ? 'done' : ''; });
      const cnt = $('#nxCnt', sh); if (cnt) cnt.textContent = k + 1;
      if (newsBack) newsBack.idx = k;
      if (k === cards.length - 1 && !all && !reducedMotion()) confetti();
    };
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && e.intersectionRatio > .6) setIdx(+e.target.dataset.k); }), { root: track, threshold: [.6] });
    cards.forEach(c => io.observe(c));
    // נגיעה בצד: שמאל = הבא, ימין = הקודם (בעברית)
    track.addEventListener('click', e => { if (e.target.closest('button')) return; const r = track.getBoundingClientRect(); go(idx + (e.clientX < r.left + r.width / 2 ? 1 : -1)); });
    const goTo = key => {
      const f = NEWS_GO[key]; if (!f) return;
      newsBack = { all, items, idx, seen: [...new Set([...seen, key])] };
      closeSheet(); setTimeout(() => { f(); newsFab(); }, 250);
    };
    $$('[data-ng]', sh).forEach(b => b.onclick = e => { e.stopPropagation(); goTo(b.dataset.ng); });
    const done = () => { newsBack = null; voice.stop?.(); closeSheet(); };
    $('#nxX', sh).onclick = done; $('#nxDone', sh).onclick = done;
    $('#nxSay', sh)?.addEventListener('click', () => voice.say(kidSays().join('|')));
    const start = restore && newsBack?.idx != null ? newsBack.idx : 0;
    setTimeout(() => { if (start) cards[start].scrollIntoView({ inline: 'start', block: 'nearest' }); setIdx(start); }, 30);
    if (!restore && !all && !reducedMotion()) setTimeout(() => confetti(), 250);
  });
}

// ✨ כפתור צף: חזרה לרשימה אחרי שניסו משהו. נשאר עד "הבנתי ✓" או ✕.
// מופיע רק באזור ההורה, בניסיון או בהדגמה. אף פעם לא כשילד משחק.
function newsFab() {
  $('.news-fab')?.remove();
  if (!newsBack || !newsFabAllowed()) return;
  const d = document.createElement('div'); d.className = 'news-fab';
  d.innerHTML = '<button class="nf-go">✨ חזרה למה חדש</button><button class="nf-x" aria-label="סגירה">✕</button>';
  d.querySelector('.nf-go').onclick = () => { const b = newsBack; if (!b) return; b.kid ? openKidNews(true) : openNews(b.all, b.items, true); };
  d.querySelector('.nf-x').onclick = () => { newsBack = null; d.remove(); };
  document.body.appendChild(d); // אחרי #sheet, כדי ש־#sheet.on ~ .news-fab יעבוד
}
// אצל ילד: רק במסך הבית או ברשימת משחקים, לא בתוך משחק
const newsFabAllowed = () => newsBack?.kid ? !!(CUR && CUR.id === newsBack.kid && $('#app .tiles, #app .games')) : ((typeof SHOW !== 'undefined' && SHOW.on) || (typeof inParent !== 'undefined' && inParent) || !!(CUR && CUR.demo));
// נקרא אחרי כל מעבר מסך
function newsFabSync() { if (!newsBack) return; if (newsFabAllowed()) { if (!$('.news-fab')) newsFab(); } else $('.news-fab')?.remove(); }

// ---------- ✨ מה חדש לילדים ----------
// ניסוח של ילדים. for: 'big' = גיל 6 ומעלה, 'little' = עד 5, 'all' = כולם.
// s = מה שניצוץ מקריא (עם ניקוד). go = לאן "תראו לי" לוקח: 'f:think', 'math', 'nature' או מזהה משחק.
const KID_NEWS = [
  { v: '2026-10-25', items: [
    { for: 'big', e: '🌱', t: 'הרבה שאלות חדשות בטבע', d: 'חידות, משפטים, חיות חדשות, וסדרות של החגים וימי השבוע.', s: 'יֵשׁ הַרְבֵּה שְׁאֵלוֹת חֲדָשׁוֹת בַּטֶּבַע! חִידוֹת, חַיּוֹת חֲדָשׁוֹת, וְהַחַגִּים.', go: 'nature' },
    { for: 'little', e: '🍎', t: 'פירות וירקות', d: 'איפה הגזר? איפה הבננה? משחק חדש!', s: 'מִשְׂחָק חָדָשׁ! פֵּרוֹת וִירָקוֹת. אֵיפֹה הַגֶּזֶר?', go: 'fruits' },
    { for: 'little', e: '🦒', t: 'איפה החיה?', d: 'הרבה חיות, והרבה שאלות חדשות.', s: 'מִשְׂחָק חָדָשׁ! אֵיפֹה הַחַיָּה? יֵשׁ הַרְבֵּה שְׁאֵלוֹת חֲדָשׁוֹת!', go: 'animals' },
  ] },
  { v: '2026-10-21.2', items: [
    { for: 'all', e: '📷', t: 'התמונה שלך גדלה!', d: 'לוחצים על העיגול שלך, והתמונה שלך מופיעה ענקית עם כוכבים.', s: 'לוֹחֲצִים עַל הָעִגּוּל שֶׁלְּךָ, וְהַתְּמוּנָה שֶׁלְּךָ גְּדֵלָה עִם כּוֹכָבִים!' },
    { for: 'big', e: '🚂', t: 'רכבת הדפוסים', d: 'מה הקרון הבא? בוחרים, והרכבת נוסעת!', s: 'מִשְׂחָק חָדָשׁ! רַכֶּבֶת הַדְּפוּסִים. מָה הַקָּרוֹן הַבָּא?', go: 'f:think' },
    { for: 'big', e: '🧩', t: 'פאזל תמונה חדש', d: 'שמים כל חלק במקום שלו.', s: 'פָּאזֶל חָדָשׁ! שָׂמִים כָּל חֵלֶק בַּמָּקוֹם שֶׁלּוֹ.', go: 'f:think' },
  ] },
  { v: '2026-10-21', items: [
    { for: 'all', e: '✨', t: 'כפתור "מה חדש"', d: 'כאן רואים מה חדש במשחק!', s: 'יֵשׁ כַּפְתּוֹר חָדָשׁ! כָּאן רוֹאִים מָה חָדָשׁ בַּמִּשְׂחָק.' },
  ] },
  { v: '2026-10-20', items: [
    { for: 'big', e: '🧩', t: 'משחקי חשיבה', d: 'פאזל, מה השתנה, מבוך וסודוקו.', s: 'יֵשׁ מִשְׂחֲקֵי חֲשִׁיבָה חֲדָשִׁים! פָּאזֶל, מָבוֹךְ וְסוּדוֹקוּ.', go: 'f:think' },
    { for: 'big', e: '🧠', t: 'זיכרון וקשב', d: 'סיימון, איפה הכדור, ומה השתנה בתמונה.', s: 'מִשְׂחֲקֵי זִכָּרוֹן חֲדָשִׁים! סַיְימוֹן, וְאֵיפֹה הַכַּדּוּר.', go: 'f:focus' },
    { for: 'big', e: '🎨', t: 'יצירה', d: 'דפי צביעה, מנדלה וגלריה משלך.', s: 'אֶפְשָׁר לִצְבֹּעַ! דַּפֵּי צְבִיעָה, מַנְדָּלָה, וְגָלֶרְיָה מִשֶּׁלְּךָ.', go: 'f:art' },
    { for: 'big', e: '💛', t: 'רגשות ורוגע', d: 'איך אני מרגיש היום, ונשימה של בלון.', s: 'מִשְׂחֲקִים שֶׁל רְגָשׁוֹת וּנְשִׁימוֹת רְגוּעוֹת.', go: 'f:calm' },
    { for: 'big', e: '🌱', t: 'עולם הטבע', d: 'חידות על חיות, מיון וסדרות, עם תמונות אמיתיות.', s: 'עוֹלַם הַטֶּבַע! חִידוֹת עַל חַיּוֹת, עִם תְּמוּנוֹת אֲמִתִּיּוֹת.', go: 'nature' },
    { for: 'big', e: '🏝️', t: 'משחקי חשבון חדשים', d: 'זוגות, תופסים, חנות ומסע באיים.', s: 'מִשְׂחֲקֵי חֶשְׁבּוֹן חֲדָשִׁים! חֲנוּת, וּמַסָּע בָּאִיִּים.', go: 'math' },
    { for: 'little', e: '🖼️', t: 'תמונות חדשות', d: 'הרבה תמונות של חיות, רכבים ואוכל.', s: 'יֵשׁ הַרְבֵּה תְּמוּנוֹת חֲדָשׁוֹת! חַיּוֹת, מְכוֹנִיּוֹת, וְאֹכֶל.' },
  ] },
];
const kidNewsKey = kid => 'lbk-knews-' + kid.id;
const kidNewsFor = kid => { const big = +kid.age >= 6; return it => it.for === 'all' || it.for === (big ? 'big' : 'little'); };
function kidNewsItems(kid, onlyNew) {
  if (!KID_NEWS.length) return [];
  let seen = null; try { seen = localStorage.getItem(kidNewsKey(kid)); } catch { }
  const days = onlyNew ? KID_NEWS.filter(n => !seen || n.v > seen) : KID_NEWS;
  return days.flatMap(n => n.items).filter(kidNewsFor(kid));
}
// יש משהו חדש שהילד עוד לא ראה? ילד חדש לגמרי (בלי כוכבים) מתחיל בלי "חדש"
function kidHasNews(kid) {
  if (kid.demo) return kidNewsItems(kid, false).length > 0;
  let seen = null; try { seen = localStorage.getItem(kidNewsKey(kid)); } catch { }
  if (!seen && !store.st(kid.id).stars) { try { localStorage.setItem(kidNewsKey(kid), KID_NEWS[0].v); } catch { } return false; }
  return kidNewsItems(kid, true).length > 0;
}
const KID_GO = go => go.startsWith('f:') ? funHub(go.slice(2)) : go === 'math' ? mathHub() : go === 'nature' ? natureHub() : startGame(go);

function openKidNews(restore = false) {
  const kid = CUR; if (!kid) return;
  const fresh = kidNewsItems(kid, true), items = fresh.length ? fresh : kidNewsItems(kid, false).slice(0, 6);
  if (!kid.demo) try { localStorage.setItem(kidNewsKey(kid), KID_NEWS[0].v); } catch { }
  $('.news-fab')?.remove();
  const seen = (newsBack && newsBack.kid === kid.id) ? newsBack.seen : [];
  const row = (i, k) => `<div class="nw-row kid ${seen.includes(i.go) ? 'seen' : ''}" ${i.go ? `data-kg="${i.go}" role="button"` : ''} style="--d:${restore ? 0 : k * 90}ms"><span class="nw-e">${i.e}</span><span class="nw-t"><b>${esc(i.t)}</b><small>${esc(i.d)}</small></span>
    <span class="nw-side">${spk(i.s)}${i.go ? `<button class="nw-go" data-kg="${i.go}">${seen.includes(i.go) ? '✓ ' : ''}👀 תראו לי</button>` : ''}</span></div>`;
  const hi = 'מָה חָדָשׁ בַּמִּשְׂחָק? בּוֹאוּ נִרְאֶה!';
  openSheet(`<div class="nw-head"><span class="nw-spark">✨</span><h3>מה חדש?</h3><div class="mute small">לוחצים על 🔊 וניצוץ מקריא</div></div>
    <div class="nw-list">${items.map(row).join('')}</div>
    <div class="nw-btns"><button class="btn ghost" id="nwOk" style="grid-column:1/-1">סגירה ✓</button></div>`, sh => {
    $$('[data-kg]', sh).forEach(b => b.onclick = e => {
      if (e.target.closest('.spk')) return; e.stopPropagation(); sfx.tap();
      const go = b.dataset.kg; newsBack = { kid: kid.id, seen: [...new Set([...seen, go])] };
      closeSheet(); setTimeout(() => { KID_GO(go); newsFab(); }, 250);
    });
    $('#nwOk', sh).onclick = () => { newsBack = null; closeSheet(); };
  });
  if (!restore) setTimeout(() => voice.say(items.length === 1 ? items[0].s : hi), 450);
  // הכפתור במסך הבית מפסיק לנצנץ
  $('.knews')?.classList.remove('has');
}
