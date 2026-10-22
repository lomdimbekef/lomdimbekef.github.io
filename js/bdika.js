// לומדים בכיף — 📱 עמדת בדיקה (https://kesefbekef.github.io/bdika/)
// ?bdika=1 → נכנסים ישר להדגמה: משפחה מדומה (נועה ואיתי), בלי כניסה לחשבון, בלי חלונות קופצים,
// בלי שער הורה ובלי מעקב. הנתונים האמיתיים לא נוגעים (ההדגמה עובדת על עותק בזיכרון).
// &news=<v>|<i> או postMessage({bdika:'news', v, i}) → מפעילים את "👀 תראו לי" של אותו פריט ב"מה חדש".
'use strict';
const BDIKA = new URLSearchParams(location.search).has('bdika');
// הודעה לעמדת הבדיקה (רק כשהמשחק בתוך מסגרת)
const toStation = m => { try { if (window.parent !== window) window.parent.postMessage({ app: 'lomdim', ...m }, '*'); } catch { } };

function bdikaNews(v, i) {
  const it = (NEWS.find(n => n.v === String(v))?.items || [])[+i];
  closeSheet(); $('.news-fab')?.remove();
  if (!it || !it.go || !NEWS_GO[it.go]) { profiles(); return; }
  try { NEWS_GO[it.go](); } catch (e) { console.warn(e); profiles(); }
}
function bdikaStart() {
  document.body.classList.add('bdika');
  showcaseStart(); closeSheet();          // משפחה מדומה, בלי חלון הפתיחה של ההדגמה
  setTimeout(() => toStation({ bdika: 'alive' }), 3500);   // "✅ נטען" בעמדה
  const p = new URLSearchParams(location.search).get('news');
  if (p && p.includes('|')) { const [v, i] = p.split('|'); setTimeout(() => bdikaNews(v, i), 200); }
}
if (BDIKA) {
  addEventListener('message', e => { const d = e.data; if (d && d.bdika === 'news') bdikaNews(d.v, d.i); });
  // לעמדה: "✅ נטען" אחרי כמה שניות, ו"⚠️ תקלה" על כל שגיאה
  addEventListener('error', e => toStation({ bdika: 'error', msg: String(e.message || 'error').slice(0, 200) }));
  addEventListener('unhandledrejection', e => toStation({ bdika: 'error', msg: String(e.reason?.message || e.reason || 'rejection').slice(0, 200) }));
}
