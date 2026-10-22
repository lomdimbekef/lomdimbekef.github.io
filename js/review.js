// לומדים בכיף — 🔁 סיור תיקונים: עובר רק על המסכים שבהם נכתבו הערות, ומראה מה השתנה.
// נוהל: מי שמתקן הערה מהסיור מוסיף או מעדכן כאן פריט באותו פרסום (כמו שורה ב"מה חדש").
// id = קבוע. date = מתי נכתבה. where = המסך. note = ההערה מילה במילה. did = מה עשינו או מה מתוכנן.
// st = 'fixed' ✅ תוקן · 'answered' 💬 נענה · 'todo' ⏳ עוד לא. at = שם השלב בסיור (TOUR.t), open = מה לפתוח מעליו.
// before = צילום "לפני" תחת review/ (צולם לפני התיקון).
'use strict';

const REVIEW = [
  // ---------- סבב 4 (21.10, 18:36) ----------
  { id: '2110-04c', date: '2026-10-21', at: 'הוספת ילד', where: 'חלון ההערות: משיכה למטה', note: 'בהערות, משיכה כלפי מטה לא סוגרת. לא עושה כלום.',
    did: 'עכשיו החלון יורד עם האצבע כשמושכים למטה מראש החלון, ומשיכה ארוכה סוגרת אותו וחוזרים למסך הקודם. משיכה קצרה מחזירה אותו למקום. אותה שיטה כמו בכסף בכיף.', st: 'fixed' },
  // ---------- סבב 3 (21.10, 17:38) ----------
  { id: '2110-03c', date: '2026-10-21', at: 'האזור של ההורה', where: 'בחירת קוד בהרשמה', note: 'המסך עדיין מהבהב, בבחירה הראשונה של הקוד אחרי ההרשמה',
    did: 'אחרי הכניסה ירד קונפטי על המסך בזמן שמקלידים את הקוד, וזה נראה כמו הבהוב. הורדנו אותו, והכפתורים של הקוד לא משנים צבע או גודל כשנוגעים בהם, רק מתכהים קצת.', st: 'fixed' },
  { id: '2110-01b', date: '2026-10-21', at: 'חשיבה: רכבת הדפוסים', where: 'כפתור 🎬 הדגמה', note: 'רוצה גם כפתור הדגמה קבוע בכל משחק, לראות שוב בפעמים הבאות',
    did: 'בכל משחק יש למעלה כפתור "🎬 הדגמה". הוא מראה שוב את ההדגמה עם האצבע וניצוץ, ו"▶️ חזרה למשחק" מחזיר. ב"מצאו את ההבדלים" אפשר גם לעשות שוב סיבוב ניסיון.', st: 'fixed' },
  // ---------- סבב 2: ההערות מסיור התיקונים (21.10, ערב) ----------
  { id: '2110-14', date: '2026-10-21', at: 'הפרופיל של הילד', where: '✏️ עריכה · תמונות', note: 'דיברנו על כמה תמונות שיהיה. לכל ילד. וצריך לכתוב להעלות כמה תמונות',
    did: 'בדף של הילד יש עכשיו כפתור "📷 להוסיף תמונות (עד 5)" והסבר שהן מתחלפות. אפשר לבחור כמה ביחד, ולהסיר כל אחת ב־✕.', st: 'fixed' },
  { id: '2110-15', date: '2026-10-21', at: 'האזור של ההורה', where: '👨‍👧 האזור של ההורה', note: 'שההגדרות שלמטה יהיו בתוך הפרופילים של הילדים. זה סתם מורכב ככה',
    did: 'ההגדרות של כל ילד עברו לתוך הדף שלו. באזור ההורה לוחצים על הילד (או "⚙️ הגדרות") ומגיעים ישר אליהן.', st: 'fixed' },
  { id: '2110-10b', date: '2026-10-21', at: 'חשיבה: רכבת הדפוסים', where: 'חשיבה: רכבת הדפוסים', before: 'review/2110-10.jpg', note: 'לא טוב. תביט משהו חדש',
    did: 'המבוך הוסר. במקומו "🚂 רכבת הדפוסים": הקרונות הולכים לפי דפוס, למשל 🔴🔵🔴🔵, ובוחרים מה הקרון הבא. הרכבת נוסעת, והדפוסים נהיים מסובכים יותר.', st: 'fixed' },
  { id: '2110-03b', date: '2026-10-21', at: 'האזור של ההורה', where: 'קוד ההורה', note: 'כשלוחצים סיסמא כל המסך מהבהב',
    did: 'המסך של בחירת הקוד כבר לא נבנה מחדש בכל הקשה, רק הנקודות מתמלאות. גם חלון הקוד לא זז יותר כשנוגעים בכפתור. הוא זז רק במשיכה אמיתית למטה.', st: 'fixed' },
  { id: '2110-04b', date: '2026-10-21', at: 'הוספת ילד', where: 'משיכה למטה', note: 'לא עובד',
    did: 'הוספנו חסימה חזקה יותר: משיכה למטה בראש המסך או בראש חלון כבר לא מרעננת את האפליקציה בכרום של אנדרואיד. חלון נסגר רק במשיכה ארוכה מהידית.', st: 'fixed' },
  { id: '2110-13b', date: '2026-10-21', at: 'זיכרון וקשב: מה השתנה?', where: 'זיכרון וקשב: מה השתנה?', note: 'כזה מתחלף רואים את ההוא שצריך ללחוץ',
    did: 'התמונה החדשה נטענה רק אחרי שהכרטיסים נפתחו, ולכן ראו אותה מתחלפת. עכשיו יש אימוג׳י גדולים וברורים במקום תמונות, וההחלפה קורית כשכל הכרטיסים הפוכים.', st: 'fixed' },
  { id: '2110-01', date: '2026-10-21', at: 'מי משחק היום?', where: 'מי משחק היום?', before: 'review/2110-01.jpg',
    note: 'לפני שמתחילים לשחק בפעם הראשונה באמת בכל משחק שיהיה סיבוב למידה וניסיון. עם אופציה לדילוג עליו.',
    did: 'בפעם הראשונה בכל משחק מופיע מסך "🎓 איך משחקים?": הדגמה קטנה עם אצבע שמראה על מה לוחצים, וניצוץ מקריא. יש "▶️ מתחילים" ו"⏭️ דילוג". אחרי פעם אחת זה לא חוזר.', st: 'fixed' },
  { id: '2110-02', date: '2026-10-21', at: 'מי משחק היום?', where: 'מי משחק היום? · תמונות פרופיל', before: 'review/2110-02.jpg',
    note: 'בפרופיל שיהיה אפשרות לשים כמה תמונות ושיתחלפו כל 2 שניות. ראיתי שלבן שלי היה מאד איכפת. ברגע שלוחצים על התמונות פרופיל שיכנס עם הגדלה של התמונה לכמה שניות על כל המסך ועם אפקטים מגניבים שמרימים לילד.',
    did: 'עכשיו אפשר להעלות עד 5 תמונות לכל ילד, והן מתחלפות כל 2 שניות. כשהילד לוחץ על העיגול שלו, התמונה גדלה לכל המסך לכמה שניות, עם קרני אור, כוכבים, קונפטי, והשם שלו.', st: 'fixed' },
  { id: '2110-03', date: '2026-10-21', at: 'הוספת ילד', where: 'שער ההורים', before: 'review/2110-03.jpg',
    note: 'עדיך שכל התהליך של ההורים יהיה עם קוד וטביעת אצבע ולא תרגילים. זה מעצבן.',
    did: 'בפעם הראשונה ההורה נרשם עם מייל וסיסמה (אותו חשבון כמו בכסף בכיף) ובוחר קוד של 4 ספרות. מעכשיו נכנסים לאזור ההורה עם הקוד, או בטביעת אצבע אם הטלפון תומך. שכחתם את הקוד? נכנסים עם הסיסמה.', st: 'fixed', open: 'gate' },
  { id: '2110-04', date: '2026-10-21', at: 'הוספת ילד', where: 'חלון ההערות', before: 'review/2110-04.jpg',
    note: 'שהמסך יהיה נגלל כלפי מטה. למשל המסל הזה של ההערות. כשאני מושך למטה הוא מרענן את האפליקציה',
    did: 'החלון נגלל רגיל, ומשיכה למטה כבר לא מרעננת את האפליקציה. משיכה למטה מראש החלון סוגרת אותו.', st: 'fixed', open: 'notes' },
  { id: '2110-05', date: '2026-10-21', at: 'האזור של ההורה', where: 'האזור של ההורה', before: 'review/2110-05.jpg',
    note: 'עדיף שכשלוחצים על כך ילד יהיה את ההגדרות שלו. ולא בנפרד למעלה ולמטה סתם מורכב.',
    did: 'לוחצים על ילד באזור ההורה ונפתח דף אחד שלו: תמונות ופרטים למעלה, וכל ההגדרות למטה. הכפתורים הנפרדים "הגדרות של..." הוסרו.', st: 'fixed' },
  { id: '2110-06', date: '2026-10-21', at: 'הגדרות של ילד', where: 'הגדרות של ילד · חשבון', before: 'review/2110-06.jpg',
    note: 'בחשבון שיהיה פחוס ומינוס לבחור עד איזה מספר. סתם מיותר הקטגוריות של המספרים.',
    did: 'במקום הקטגוריות: מספר גדול באמצע, עם ➖ ו־➕. עד 20 בקפיצות של 1, עד 100 של 5, ואחר כך של 50. לחיצה ארוכה רצה מהר.', st: 'fixed' },
  { id: '2110-07', date: '2026-10-21', at: 'הגדרות של ילד', where: 'הגדרות של ילד · רמה', before: 'review/2110-06.jpg',
    note: 'וצריך הגדרות רמה של כל המשחקים. אם לא שינו בהגדרות שיתחיל ברירית מחדל שתואמת גיל. האם הרמה מתקדמת עם הזמן אוטומטית?',
    did: 'תשובה: בחשבון הרמה עולה לבד לפי כל סוג תרגיל. ועכשיו גם בשאר המשחקים: כל משחק מתחיל ברמה לפי הגיל (1 עד 5), עולה לבד אחרי סבב טוב ויורד אחרי סבב קשה. בדף של הילד יש "📈 רמה בכל משחק" לראות ולשנות.', st: 'fixed' },
  { id: '2110-08', date: '2026-10-21', at: 'חשיבה: פאזל תמונה', where: 'חשיבה: פאזל', before: 'review/2110-08.jpg',
    note: 'לא אהבתי את המשחק', did: 'במקום להחליף חלקים: מסגרת עם צל אפור של התמונה, ולמטה חלקים. בוחרים חלק ונוגעים במקום שלו. מתחילים מ־4 חלקים ומגיעים ל־9.', st: 'fixed' },
  { id: '2110-09', date: '2026-10-21', at: 'חשיבה: מצאו את ההבדלים', where: 'חשיבה: מצאו את ההבדלים', before: 'review/2110-09.jpg',
    note: 'ההסבר לא טוב. לקח לי כמה שניות להבין מה צריך לעשות כאן. אולי כשנכנסים צריך שיהיה טקסט מפורט וסרטון הדגמה. וכמובן אופציה לנסות אולי בצורה של שירה אחת למעלה ושורה אחת למטה. כדי להבין מה צריך לעשות ורק אח"כ את כל הטבלה',
    did: 'בכניסה הראשונה: הסבר עם אצבע שמראה מה ללחוץ. אחר כך סיבוב ניסיון של שורה אחת למעלה ושורה אחת למטה, עם הבדל אחד, ורק אז הלוח המלא.', st: 'fixed' },
  { id: '2110-10', date: '2026-10-21', at: 'חשיבה: רכבת הדפוסים', where: 'חשיבה: מבוך ← רכבת הדפוסים', before: 'review/2110-10.jpg',
    note: 'המשחק לא תקין.', did: 'הבעיה: החצים הסתתרו מתחת לכרטיס הסיור, ואי אפשר היה לגלול אליהם. עכשיו המבוך קטן לפי המסך, וארבעת החצים בשורה אחת מתחתיו. השבילים בהירים והקירות כהים, כוכב שנאסף נעלם, ואפשר גם לגעת במשבצת והעכבר הולך אליה.', st: 'fixed' },
  { id: '2110-11', date: '2026-10-21', at: 'זיכרון וקשב: סיימון', where: 'זיכרון וקשב: סיימון', before: 'review/2110-11.jpg',
    note: 'חייב להיות אחרי כל סיבוב של לחיצות משהו שיראה אם עשיתי טוב או לא',
    did: 'אחרי כל סיבוב מופיע סימן גדול: ✅ \"יפה! עוד צבע\" והעיגול באמצע נהיה ירוק, או 🙈 \"כמעט! ננסה שוב\" עם רעידה קטנה.', st: 'fixed' },
  { id: '2110-12', date: '2026-10-21', at: 'זיכרון וקשב: איפה הכדור?', where: 'זיכרון וקשב: איפה הכדור?', before: 'review/2110-12.jpg',
    note: 'נשאר צהוב למטה אז זה לא זיכרון. רואים.', did: 'הכדור נעלם לגמרי כשהכוסות יורדות, ומופיע שוב רק אחרי שבוחרים כוס.', st: 'fixed' },
  { id: '2110-13', date: '2026-10-21', at: 'זיכרון וקשב: מה השתנה?', where: 'זיכרון וקשב: מה השתנה?', before: 'review/2110-13.jpg',
    note: 'צריך שיהיה תמונות יותר ברורות ופשוטות. שיהיה קל לעשות סימנים לזיכרון. ולא תמונות מורכבות.',
    did: 'אימוג׳י גדולים וברורים על רקע נקי, ופחות דברים בהתחלה.', st: 'todo' },
];

// מה לפתוח מעל המסך של השלב
const REVIEW_OPEN = {
  gate: () => { closeSheet(); parentGate(parentHome); },
  notes: () => { notes.open(); },
};
// נשמר בטלפון עד שהשליחה מצליחה, וגם אם יוצאים באמצע ממשיכים מאותו מקום:
// lbk-review = { [id]: 'ok' | 'bad' | 'seen' } · lbk-review-notes = { [id]: 'הערה' } · lbk-review-pos = העצירה האחרונה · lbk-review-sent = מה כבר נשלח
const RV_KEY = 'lbk-review', RV_NOTES = 'lbk-review-notes', RV_POS = 'lbk-review-pos', RV_SENT = 'lbk-review-sent';
const rvGet = k => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch { return {}; } };
const rvSet = (k, v) => { try { localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); } catch { } };
const rvPos = () => { try { return localStorage.getItem(RV_POS) || ''; } catch { return ''; } };
const RV_ST = { fixed: ['✅', 'תוקן'], answered: ['💬', 'נענה'], todo: ['⏳', 'עוד לא'] };
// עוד לא נסקרו: מה שתוקן או נענה, ואין עליו סימון או שליחה
const rvPending = () => { const d = rvGet(RV_KEY), sent = rvGet(RV_SENT); return REVIEW.filter(r => r.st !== 'todo' && !d[r.id] && !sent[r.id]); };
// מה שסומן או נכתב ועוד לא נשלח
function rvUnsent() {
  const d = rvGet(RV_KEY), notes = rvGet(RV_NOTES), sent = rvGet(RV_SENT);
  return REVIEW.filter(r => (d[r.id] && d[r.id] !== 'seen' && sent[r.id] !== d[r.id]) || (notes[r.id] || '').trim()).map(r => ({ r, st: d[r.id] || '', note: (notes[r.id] || '').trim() }));
}
// open = רק לצילום "לפני". בסיור עצמו לא פותחים חלון, כי הוא מסתיר את כרטיס הסיור
function rvStep(r, shot) {
  const base = TOUR.find(s => s.t === r.at) || TOUR[0];
  return { e: '🔁', t: r.where, sel: base.sel, review: r, go: () => { closeSheet(); base.go(); if (shot && r.open) setTimeout(REVIEW_OPEN[r.open], 300); } };
}
function reviewBadge() {
  const n = rvPending().length, u = rvUnsent().length;
  $$('.rv-badge').forEach(b => { b.hidden = !n && !u; b.textContent = n ? `🔁 תיקונים ${n}` : `📤 ${u} לשליחה`; });
  const m = $('#rvBtn'); if (m) m.hidden = !n && !u;
}
function reviewStart() {
  if (!REVIEW.length) return;
  if (!SHOW.on) showcaseStart();
  closeSheet();
  const order = [...REVIEW.filter(r => r.st !== 'todo'), ...REVIEW.filter(r => r.st === 'todo')];
  tour.steps = order.map(r => rvStep(r));
  const pend = rvPending().map(r => r.id), pos = rvPos();
  let first = tour.steps.findIndex(x => x.review.id === pos);
  if (first < 0) first = tour.steps.findIndex(x => pend.includes(x.review.id));
  if (first < 0) { if (rvUnsent().length) { tour.steps = null; return reviewSummary(); } first = 0; }
  tour.start(first);
}
function reviewMark(id, v) { const d = rvGet(RV_KEY); d[id] = v; rvSet(RV_KEY, d); reviewBadge(); }
// כרטיס של שלב בסיור התיקונים (במקום הכרטיס הרגיל של הסיור)
function reviewCard(i, n) {
  const r = tour.steps[i].review, [se, sl] = RV_ST[r.st], mine = rvGet(RV_KEY)[r.id], todo = r.st === 'todo';
  const nts = rvGet(RV_NOTES), cnt = Object.values(nts).filter(x => (x || '').trim()).length;
  const dd = new Date(r.date + 'T12:00:00').toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
  rvSet(RV_POS, r.id);
  document.body.insertAdjacentHTML('beforeend', `<div id="tour" class="rv"><div class="tprog"><i style="width:${(i + 1) / n * 100}%"></i></div>
    <div class="thead"><span>🔁 ${i + 1} מתוך ${n} · ${dd}</span><span class="rv-cnt ${cnt ? 'on' : ''}">💬 ${cnt} הערות</span><button id="rMin" aria-label="להקטין">▾</button><button id="tX" aria-label="יציאה, ממשיכים אחר כך מכאן">✕</button></div>
    <div class="rv-h"><span class="rv-st ${r.st}">${se} ${sl}</span><b>${esc(r.where)}</b></div>
    <div class="rv-note"><small>📝 ההערה שלך</small>${esc(r.note)}</div>
    <div class="rv-did ${r.st}"><small>${todo ? '⏳ מה מתוכנן' : r.st === 'answered' ? '💬 התשובה' : '✨ מה שינינו'}</small>${esc(r.did)}</div>
    ${r.before && !todo ? '<button class="chip" id="rBefore" style="margin-bottom:8px">👀 איך זה היה לפני</button>' : ''}
    <label class="rv-say"><span>💬 הערה על התיקון הזה</span><textarea id="rNote" rows="2" placeholder="${todo ? 'משהו להוסיף לפני שנבנה?' : 'מה עוד לא טוב? מה לשנות? (לא חובה)'}">${esc(nts[r.id] || '')}</textarea></label>
    ${todo ? '' : `<div class="rv-big"><button class="ok ${mine === 'ok' ? 'on' : ''}" id="rOk">✅ מאשר</button><button class="bad ${mine === 'bad' ? 'on' : ''}" id="rBad">🔧 עוד לא טוב</button></div>`}
    <div class="tnav rv-nav"><button id="tPrev" ${i ? '' : 'disabled'} aria-label="הקודם">→</button><button id="tNext">${i === n - 1 ? '📤 לסיכום ושליחה' : 'הבא ←'}</button></div></div>`);
  const card = $('#tour'), ta = $('#rNote', card);
  const saveNote = () => {
    const all = rvGet(RV_NOTES), v = ta.value; if (v.trim()) all[r.id] = v; else delete all[r.id]; rvSet(RV_NOTES, all);
    const c = Object.values(all).filter(x => (x || '').trim()).length, el = $('.rv-cnt', card); el.textContent = `💬 ${c} הערות`; el.classList.toggle('on', !!c); reviewBadge();
  };
  const next = () => i < n - 1 ? tour.go(i + 1) : (tour.stop(), reviewSummary());
  ta.addEventListener('input', saveNote);
  $('.rv-note', card).onclick = e => e.currentTarget.classList.toggle('open');
  // ▾ מקטין את הכרטיס כדי לראות את המסך שמאחוריו
  $('#rMin', card).onclick = () => { card.classList.toggle('min'); $('#rMin', card).textContent = card.classList.contains('min') ? '▴' : '▾'; };
  $('#tPrev', card).onclick = () => { saveNote(); tour.go(i - 1); };
  $('#tNext', card).onclick = () => { saveNote(); if (todo && !mine) reviewMark(r.id, 'seen'); next(); };
  $('#tX', card).onclick = () => { saveNote(); tour.stop(); reviewBadge(); if (rvUnsent().length) toast('💾 ההערות נשמרו. ממשיכים מכאן ב"🔁 תיקונים"'); };
  $('#rOk', card)?.addEventListener('click', () => { saveNote(); reviewMark(r.id, 'ok'); confetti(40); setTimeout(next, 350); });
  $('#rBad', card)?.addEventListener('click', e => {
    reviewMark(r.id, 'bad'); $('#rOk', card).classList.remove('on'); e.currentTarget.classList.add('on');
    card.classList.remove('min'); ta.closest('.rv-say').classList.add('need'); ta.placeholder = 'מה עוד לא טוב? כתוב כאן 👇'; ta.focus();
  });
  $('#rBefore', card)?.addEventListener('click', () => {
    const ov = document.createElement('div'); ov.className = 'rv-zoom';
    ov.innerHTML = `<div><small>👀 לפני התיקון</small><img src="${esc(r.before)}" alt="לפני"><button class="btn full">סגירה</button></div>`;
    ov.onclick = ev => { if (ev.target === ov || ev.target.closest('button')) ov.remove(); }; document.body.appendChild(ov);
  });
}
function reviewSummary() {
  const list = rvUnsent(), ok = list.filter(x => x.st === 'ok'), bad = list.filter(x => x.st === 'bad'), withNote = list.filter(x => x.note);
  const left = rvPending().filter(r => !list.some(x => x.r.id === r.id)), sorted = [...bad, ...list.filter(x => x.st !== 'bad')];
  const item = x => `<div class="rv-li ${x.st}"><b>${x.st === 'ok' ? '✅' : x.st === 'bad' ? '🔧' : '💬'} ${esc(x.r.where)}</b>${x.note ? `<p>💬 ${esc(x.note)}</p>` : ''}</div>`;
  openSheet(`<div class="nw-head"><span class="nw-spark">🔁</span><h3>סיכום סיור התיקונים</h3></div>
    <div class="rv-sum"><div><b>${ok.length}</b><span>✅ אושרו</span></div><div><b>${bad.length}</b><span>🔧 עוד לא טוב</span></div><div><b>${withNote.length}</b><span>💬 הערות</span></div><div><b>${left.length}</b><span>⏭️ לא נבדקו</span></div></div>
    ${list.length ? `<div class="rv-list">${sorted.map(item).join('')}</div><button class="btn full rv-send" id="rvSend">📤 שליחה (${list.length})</button>` : '<p class="mute small center" style="margin-bottom:10px">אין מה לשלוח, הכל כבר נשלח 👍</p>'}
    <button class="btn ghost full" id="rvAgain" style="margin-top:8px">🔁 ${left.length ? `להמשיך (${left.length} לא נבדקו)` : 'לעבור שוב'}</button><div class="err" id="rvErr"></div>`, sh => {
    $('#rvAgain', sh).onclick = () => { rvSet(RV_POS, ''); closeSheet(); setTimeout(reviewStart, 250); };
    $('#rvSend', sh)?.addEventListener('click', async e => {
      e.target.disabled = true; e.target.textContent = 'שולח...';
      const line = (x, k) => `${k + 1}. ${x.st === 'ok' ? '✅ מאשר' : x.st === 'bad' ? '🔧 עוד לא טוב' : '💬 הערה'} · ${x.r.where} (${x.r.id})\n   📝 ההערה המקורית: ${x.r.note.slice(0, 140)}${x.r.note.length > 140 ? '…' : ''}${x.note ? `\n   💬 עכשיו: ${x.note}` : ''}`;
      const msg = `[סיור תיקונים]\n✅ ${ok.length} אושרו · 🔧 ${bad.length} עוד לא טוב · 💬 ${withNote.length} הערות\n\n` + sorted.map(line).join('\n\n');
      const db = saveFeedbackDb(bad.length || withNote.length ? 'idea' : 'approval', msg);
      let mail = false;
      try {
        const res = await fetch(`https://formsubmit.co/ajax/${FEEDBACK_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ _subject: `🔁 סיור תיקונים — לומדים בכיף (✅ ${ok.length} · 🔧 ${bad.length})`, _template: 'table', _captcha: 'false', 'סוג': 'סיור תיקונים', 'הערות': msg, 'מכשיר': devName() }) });
        mail = await mailOk(res);
      } catch { }
      if ((await db) || mail) {
        const sent = rvGet(RV_SENT), nts = rvGet(RV_NOTES);
        for (const x of list) { sent[x.r.id] = x.st || 'note'; delete nts[x.r.id]; }
        rvSet(RV_SENT, sent); rvSet(RV_NOTES, nts); if (!left.length) rvSet(RV_POS, '');
        reviewBadge(); confetti(); toast('📤 נשלח. תודה! נעבור על זה'); closeSheet(); return;
      }
      e.target.disabled = false; e.target.textContent = `📤 שליחה (${list.length})`; failNote('feedback', 'review: mail+db failed');
      $('#rvErr', sh).textContent = 'לא הצלחתי לשלוח (אין אינטרנט?). ההערות שמורות בטלפון, אפשר לנסות שוב.';
    });
  });
}

// ---------- צילום "לפני": ?shot=<id> פותח את המסך של ההערה במצב הדגמה, בלי פסים וכפתורים ----------
(() => {
  const id = new URLSearchParams(location.search).get('shot'); if (!id) return;
  const r = REVIEW.find(x => x.id === id); if (!r) return;
  addEventListener('load', () => setTimeout(() => {
    voice.say = () => { }; document.body.classList.add('shot'); showcaseStart(); closeSheet();
    const st = rvStep(r, true); try { st.go(); } catch (e) { console.warn(e); }
    setTimeout(() => { if (!r.open) closeSheet(); $('#showBar')?.remove(); $('#notesFab')?.remove(); document.body.classList.add('shot'); }, 900);
  }, 300));
})();
