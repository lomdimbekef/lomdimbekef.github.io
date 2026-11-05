// לומדים בכיף — 👨‍👩‍👧 משפחה משותפת בכמה טלפונים (מוצפן)
// הילדים, התמונות וההתקדמות מוצפנים בטלפון (AES-GCM) ורק אז נשלחים לשרת. לשרת אין את המפתח.
// המפתח עובר לטלפון נוסף רק בקישור ההזמנה, בחלק שאחרי # (החלק הזה לא נשלח לשום שרת).
// בשרת: lomdim_blobs, שורה לכל חלק: family (הגדרות כלליות), kid:<id> (פרופיל והתקדמות), photos:<id> (תמונות)
'use strict';

const FAM_KEY = 'lbk-family';
const fam = {
  get() { try { return JSON.parse(localStorage.getItem(FAM_KEY)) || null; } catch { return null; } },
  set(v) { try { v ? localStorage.setItem(FAM_KEY, JSON.stringify(v)) : localStorage.removeItem(FAM_KEY); } catch { } },
  busy: false, timer: null, last: 0, err: '',
  on() { return !!this.get() && !(typeof SHOW !== 'undefined' && SHOW.on) && !(typeof BDIKA !== 'undefined' && BDIKA); },
};

// ---------- הצפנה ----------
const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64 = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));
const rand = n => b64(crypto.getRandomValues(new Uint8Array(n)));
async function sha256hex(s) { return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map(x => x.toString(16).padStart(2, '0')).join(''); }
let famKeyObj = null, famKeyRaw = '';
async function famKey() {
  const f = fam.get(); if (!f) throw new Error('no family');
  if (famKeyRaw !== f.key) { famKeyObj = await crypto.subtle.importKey('raw', unb64(f.key), 'AES-GCM', false, ['encrypt', 'decrypt']); famKeyRaw = f.key; }
  return famKeyObj;
}
async function seal(obj) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await famKey(), new TextEncoder().encode(JSON.stringify(obj)));
  return { iv: b64(iv), data: b64(data) };
}
async function unseal(row) {
  const out = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(row.iv) }, await famKey(), unb64(row.data));
  return JSON.parse(new TextDecoder().decode(out));
}
const hashStr = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36) + ':' + s.length; };

// ---------- מה נשמר בכל חלק ----------
const FAM_SKIP = new Set(['kids', 'stats', 'v', 'gone', 'voiceName', 'surpI']);  // קול הטלפון שייך לטלפון עצמו
function famPack(k) {
  const d = store.d;
  if (k === 'family') { const o = {}; Object.keys(d).forEach(x => { if (!FAM_SKIP.has(x)) o[x] = d[x]; }); o.gone = d.gone || []; return o; }
  const [type, id] = k.split(':'), kid = store.kid(id);
  if (!kid) return null;
  if (type === 'photos') return { photos: kidPhotos(kid) };
  const p = { ...kid }; delete p.photo; delete p.photos;
  return { kid: p, st: d.stats[id] || null, order: d.kids.findIndex(x => x.id === id) };
}
function famUnpack(k, v) {
  const d = store.d;
  if (k === 'family') {
    Object.keys(v).forEach(x => { if (x !== 'gone') d[x] = v[x]; });
    d.gone = [...new Set([...(d.gone || []), ...(v.gone || [])])];
    d.kids = d.kids.filter(x => !d.gone.includes(x.id)); d.gone.forEach(id => delete d.stats[id]);
    return;
  }
  const [type, id] = k.split(':');
  if ((d.gone || []).includes(id)) return;
  let kid = store.kid(id);
  if (type === 'photos') { if (kid) { kid.photos = v.photos || []; kid.photo = kid.photos[0] || ''; } else d.kids.push({ id, photos: v.photos || [], photo: (v.photos || [])[0] || '' }); return; }
  if (!kid) { kid = { id, photos: [], photo: '' }; d.kids.splice(Math.min(v.order ?? d.kids.length, d.kids.length), 0, kid); }
  Object.assign(kid, v.kid, { photos: kid.photos, photo: kid.photo });
  if (v.st) d.stats[id] = v.st;
}
// שני הטלפונים שיחקו עם אותו ילד מאז הסנכרון האחרון: מאחדים (אף כוכב לא הולך לאיבוד)
function famMergeKid(L, R) {
  const out = { ...R, kid: { ...R.kid, ...L.kid } };
  const a = L.st || {}, b = R.st || {};
  if (!a || !b) return { ...out, st: a || b };
  const ev = new Map(); [...(b.events || []), ...(a.events || [])].forEach(e => ev.set(e.t + '|' + e.g, e));
  const maxObj = (x = {}, y = {}) => { const o = { ...y }; Object.keys(x).forEach(k => { o[k] = typeof x[k] === 'number' && typeof y[k] === 'number' ? Math.max(x[k], y[k]) : x[k] && typeof x[k] === 'object' && y[k] && typeof y[k] === 'object' ? maxObj(x[k], y[k]) : x[k] ?? y[k]; }); return o; };
  const st = maxObj(a, b);
  st.events = [...ev.values()].sort((p, q) => p.t - q.t).slice(-600);
  // כוכבים: הגבוה מבין השניים, ועוד התשובות הנכונות שהיו רק בטלפון השני
  const [hi, lo] = (a.stars || 0) >= (b.stars || 0) ? [a, b] : [b, a], seen = new Set((hi.events || []).map(e => e.t + '|' + e.g));
  st.stars = (hi.stars || 0) + (lo.events || []).filter(e => e.ok && !seen.has(e.t + '|' + e.g)).length;
  return { ...out, st };
}

// ---------- סנכרון ----------
async function famSync(reason = '') {
  if (!fam.on() || fam.busy || !navigator.onLine) return false;
  const f = fam.get(); fam.busy = true; fam.err = '';
  try {
    if (!(await auth.current())) throw new Error('צריך להיכנס לחשבון');
    const sb = await auth.client();
    const meta = f.meta ||= { h: {}, seen: {} };
    const { data: rows, error } = await sb.from('lomdim_blobs').select('k, updated_at').eq('family_id', f.id);
    if (error) throw error;
    const remote = Object.fromEntries((rows || []).map(r => [r.k, r.updated_at]));
    const d = store.d; d.gone ||= [];
    const keys = new Set(['family', ...d.kids.flatMap(k => ['kid:' + k.id, 'photos:' + k.id]), ...Object.keys(remote)]);
    // קודם המשפחה (בשביל רשימת הילדים שנמחקו), אחר כך הילדים, ואחר כך התמונות
    const order = [...keys].sort((x, y) => (x === 'family' ? -1 : y === 'family' ? 1 : x.startsWith('photos') - y.startsWith('photos')));
    let changedHere = false;
    for (const k of order) {
      const id = k.split(':')[1];
      if (id && d.gone.includes(id)) { if (remote[k]) { await sb.from('lomdim_blobs').delete().eq('family_id', f.id).eq('k', k); } delete meta.h[k]; delete meta.seen[k]; continue; }
      const L = famPack(k), lj = L ? JSON.stringify(L) : null, lh = lj ? hashStr(lj) : null;
      const localChanged = lj && lh !== meta.h[k];
      const remoteChanged = remote[k] && remote[k] !== meta.seen[k];
      let push = null;
      if (remoteChanged) {
        const { data: row, error: e2 } = await sb.from('lomdim_blobs').select('iv, data, updated_at').eq('family_id', f.id).eq('k', k).single();
        if (e2) throw e2;
        let R; try { R = await unseal(row); } catch { throw new Error('המפתח לא מתאים. צריך להצטרף שוב מהקישור'); }
        if (localChanged && k.startsWith('kid:')) { push = famMergeKid(L, R); famUnpack(k, push); }
        else if (localChanged && k === 'family') { push = { ...R, ...L, gone: [...new Set([...(R.gone || []), ...(L.gone || [])])] }; famUnpack(k, push); }
        else if (localChanged) push = L;                     // תמונות: מה ששונה כאן מנצח
        else famUnpack(k, R);
        meta.seen[k] = row.updated_at; changedHere = true;
        if (!push) { const nj = famPack(k); meta.h[k] = nj ? hashStr(JSON.stringify(nj)) : null; }
      } else if (localChanged) push = L;
      if (push) {
        const box = await seal(push);
        const { data: up, error: e3 } = await sb.from('lomdim_blobs').upsert({ family_id: f.id, k, iv: box.iv, data: box.data, updated_at: new Date().toISOString() }).select('updated_at').single();
        if (e3) throw e3;
        meta.seen[k] = up.updated_at; meta.h[k] = hashStr(JSON.stringify(famPack(k) ?? push));
      }
    }
    f.lastSync = Date.now(); fam.set(f);
    if (changedHere) { store.saveLocal(); famRefresh(); }
    return true;
  } catch (e) {
    fam.err = auth.nice(e); if (!/אינטרנט/.test(fam.err)) failNote('family', reason + ' ' + (e?.message || e));
    return false;
  } finally { fam.busy = false; }
}
// מסך שמראה ילדים או כוכבים מתעדכן אחרי שהגיע שינוי מהטלפון השני (לא באמצע משחק)
function famRefresh() {
  if (typeof CUR_GAME !== 'undefined' && CUR_GAME && CUR) return;
  if ($('#sheet')?.classList.contains('on')) return;
  if (!CUR && $('#app .plist')) parentHome(); else if (!CUR && $('#app .kids')) profiles();
}
// כל שמירה בטלפון: שולחים לשרת כמה שניות אחר כך
store.saveLocal = store.save;
store.save = function () { this.saveLocal(); if (fam.on()) { clearTimeout(fam.timer); fam.timer = setTimeout(() => famSync('save'), 4000); } };
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') famSync('open'); });
setInterval(() => { if (document.visibilityState === 'visible') famSync('tick'); }, 60000);

// ---------- יצירה, הזמנה והצטרפות ----------
async function famCreate() {
  const sb = await auth.client(), secret = rand(18), key = b64(crypto.getRandomValues(new Uint8Array(32)));
  const { data: id, error } = await sb.rpc('lomdim_create_family', { p_join_hash: await sha256hex(secret) });
  if (error) throw error;
  const old = fam.get();
  fam.set(old && old.id === id ? old : { id, key, secret, meta: { h: {}, seen: {} } });
  await famSync('create');
}
const famLink = f => `${location.origin}${location.pathname}#join=${f.id}.${f.secret}.${f.key}`;
function famParse(s) { const m = String(s || '').match(/join=([0-9a-f-]{36})\.([\w-]{10,})\.([\w-]{40,})/i); return m ? { id: m[1], secret: m[2], key: m[3] } : null; }
async function famJoin(inv) {
  const sb = await auth.client();
  const { data: ok, error } = await sb.rpc('lomdim_join', { p_family: inv.id, p_secret: inv.secret });
  if (error) throw error; if (!ok) throw new Error('הקישור לא תקין או שפג תוקפו. בקשו קישור חדש');
  fam.set({ id: inv.id, key: inv.key, secret: inv.secret, meta: { h: {}, seen: {} } });
  await famSync('join');
}
async function famLeave() { try { await (await auth.client()).rpc('lomdim_leave'); } catch { } fam.set(null); }

// קישור הזמנה שנפתח: שומרים אותו עד שההורה מחובר, ומוחקים מהכתובת
const FAM_PENDING = famParse(location.hash);
if (FAM_PENDING) { try { localStorage.setItem('lbk-join', JSON.stringify(FAM_PENDING)); } catch { } history.replaceState(null, '', location.pathname + location.search); }
function famPendingInvite() { try { return JSON.parse(localStorage.getItem('lbk-join')) || null; } catch { return null; } }

let famQR = null;
const famLoadQR = () => famQR ??= new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'vendor/qrcode.js'; s.onload = () => res(window.qrcode); s.onerror = () => { famQR = null; rej(new Error('qr')); }; document.head.appendChild(s); });

// ---------- המסך: 👨‍👩‍👧 משפחה בכמה טלפונים ----------
async function familySheet() {
  // במצב הדגמה ובעמדת הבדיקה: רק הסבר, בלי חשבון ובלי שרת
  if ((typeof SHOW !== 'undefined' && SHOW.on) || (typeof BDIKA !== 'undefined' && BDIKA)) return openSheet(`<h2>👨‍👩‍👧 משפחה בכמה טלפונים</h2>
    <p style="font-size:16px;line-height:1.8">אותם ילדים, אותן תמונות ואותה התקדמות, גם בטלפון של בן או בת הזוג. בטלפון הראשון יוצרים משפחה, ומופיע ריבוע QR. הטלפון השני סורק, נכנס לחשבון ומצטרף.</p>
    <div class="card" style="margin:12px 0;font-size:15px;line-height:1.7">🔒 <b>מוצפן:</b> הפרטים נעולים בטלפון לפני שהם נשלחים, ובשרת אף אחד לא יכול לקרוא אותם.</div>
    <p class="small mute">🎭 זה מצב הדגמה, אז כאן לא יוצרים משפחה אמיתית.</p><button class="btn full" id="fOk">הבנתי</button>`, s => { $('#fOk', s).onclick = closeSheet; });
  if (!auth.user) return showAuthGate(familySheet);
  const f = fam.get(), inv = famPendingInvite();
  if (inv && (!f || f.id !== inv.id)) return famJoinSheet(inv);
  if (!f) return openSheet(`<h2>👨‍👩‍👧 משפחה בכמה טלפונים</h2>
    <p style="font-size:16px;line-height:1.8">אותם ילדים, אותן תמונות ואותה התקדמות, גם בטלפון של בן או בת הזוג. כל מה שמשתנה בטלפון אחד מופיע גם בשני.</p>
    <div class="card" style="margin:12px 0;font-size:15px;line-height:1.7">🔒 <b>מוצפן:</b> הפרטים נעולים בטלפון לפני שהם נשלחים. בשרת אף אחד לא יכול לקרוא אותם, גם לא אנחנו. רק טלפון שקיבל את קישור ההזמנה יכול לפתוח.</div>
    <button class="btn full" id="fCreate">✨ ליצור משפחה משותפת</button>
    <button class="btn ghost full" id="fPaste" style="margin-top:10px">📋 קיבלתי קישור הזמנה</button>
    <p class="small mute" id="fMsg" style="margin-top:10px"></p>`, s => {
    $('#fCreate', s).onclick = async e => { e.target.disabled = true; $('#fMsg', s).textContent = '⏳ יוצר ומצפין...'; try { await famCreate(); familySheet(); toast('✅ נוצרה משפחה משותפת'); } catch (er) { e.target.disabled = false; $('#fMsg', s).textContent = '⚠️ ' + auth.nice(er); } };
    $('#fPaste', s).onclick = famPasteSheet;
  });
  const when = f.lastSync ? new Date(f.lastSync).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : 'עוד לא';
  openSheet(`<h2>👨‍👩‍👧 משפחה משותפת</h2>
    <div class="card" style="margin-bottom:12px;font-size:15px;line-height:1.7">✅ הטלפון הזה מחובר למשפחה. 🔒 הכל מוצפן.<br>סנכרון אחרון: <b>${when}</b>${fam.err ? `<br>⚠️ ${esc(fam.err)}` : ''}</div>
    <h3 style="margin:6px 0">📲 להוסיף טלפון</h3>
    <p class="small mute" style="line-height:1.7">בטלפון השני: פותחים את המצלמה ומכוונים לריבוע, או שולחים לו את הקישור. נכנסים לחשבון (אפשר אותו חשבון או חשבון אחר), ומאשרים.</p>
    <div id="fQr" style="background:#fff;border-radius:18px;padding:10px;width:min(240px,70vw);margin:10px auto"></div>
    <button class="btn full" id="fCopy">📋 להעתיק קישור הזמנה</button>
    <p class="small mute" style="margin-top:6px;line-height:1.6">⚠️ הקישור הוא המפתח למשפחה. שולחים אותו רק לבן או בת הזוג.</p>
    <button class="btn ghost full" id="fNow" style="margin-top:12px">🔄 לסנכרן עכשיו</button>
    <button class="btn ghost full" id="fLeave" style="margin-top:10px">🚪 לנתק את הטלפון הזה מהמשפחה</button>`, async s => {
    try { const qr = (await famLoadQR())(0, 'M'); qr.addData(famLink(f)); qr.make(); $('#fQr', s).innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); } catch { $('#fQr', s).remove(); }
    $('#fCopy', s).onclick = async e => { try { await navigator.clipboard.writeText(famLink(f)); e.target.textContent = '✅ הועתק. שולחים לטלפון השני'; } catch { prompt('להעתיק את הקישור:', famLink(f)); } };
    $('#fNow', s).onclick = async e => { e.target.textContent = '⏳ מסנכרן...'; const ok = await famSync('button'); toast(ok ? '✅ מסונכרן' : '⚠️ ' + (fam.err || 'לא הצליח')); familySheet(); };
    $('#fLeave', s).onclick = () => openSheet(`<h2>לנתק?</h2><p style="line-height:1.8">הילדים וההתקדמות נשארים בטלפון הזה, אבל הוא כבר לא יתעדכן מהטלפון השני.</p>
      <div class="row" style="gap:10px;margin-top:14px"><button class="btn ghost grow" id="lNo">ביטול</button><button class="btn danger grow" id="lYes">כן, לנתק</button></div>`, s2 => {
      $('#lNo', s2).onclick = familySheet; $('#lYes', s2).onclick = async () => { await famLeave(); closeSheet(); toast('הטלפון נותק מהמשפחה'); parentHome(); };
    });
  });
}
function famPasteSheet() {
  openSheet(`<h2>📋 קישור הזמנה</h2><p class="small mute">מדביקים כאן את הקישור שקיבלתם מהטלפון השני:</p>
    <textarea id="fIn" dir="ltr" style="width:100%;min-height:90px;font-size:16px;border-radius:14px;padding:10px;margin:10px 0"></textarea>
    <button class="btn full" id="fGo">המשך</button><p class="small" id="fMsg" style="margin-top:8px"></p>`, s => {
    $('#fGo', s).onclick = () => { const inv = famParse($('#fIn', s).value); if (!inv) { $('#fMsg', s).textContent = '⚠️ זה לא נראה כמו קישור הזמנה'; return; } famJoinSheet(inv); };
  });
}
function famJoinSheet(inv) {
  const mine = store.d.kids.length;
  openSheet(`<h2>👨‍👩‍👧 להצטרף למשפחה?</h2>
    <p style="font-size:16px;line-height:1.8">הטלפון הזה יקבל את הילדים, התמונות וההתקדמות מהמשפחה, ויתעדכן מעכשיו כל הזמן.${mine ? `<br>👧 ${mine} הילדים שכבר יש כאן יישארו, ויתווספו למשפחה.` : ''}</p>
    <button class="btn full" id="jYes">✅ כן, להצטרף</button><button class="btn ghost full" id="jNo" style="margin-top:10px">לא עכשיו</button>
    <p class="small" id="fMsg" style="margin-top:8px"></p>`, s => {
    $('#jNo', s).onclick = () => { try { localStorage.removeItem('lbk-join'); } catch { } closeSheet(); };
    $('#jYes', s).onclick = async e => {
      e.target.disabled = true; $('#fMsg', s).textContent = '⏳ מצטרף ומוריד את המשפחה...';
      try { await famJoin(inv); try { localStorage.removeItem('lbk-join'); } catch { } closeSheet(); confetti(60); toast('🎉 הצטרפתם למשפחה!'); parentHome(); }
      catch (er) { e.target.disabled = false; $('#fMsg', s).textContent = '⚠️ ' + auth.nice(er); }
    };
  });
}

// בפתיחה, אחרי הכניסה לחשבון: סנכרון, וקישור הזמנה שמחכה
async function famStart() {
  if (!FAM_READY) return;
  const inv = famPendingInvite(), f = fam.get();
  if (inv && (!f || f.id !== inv.id)) { if (await auth.current()) famJoinSheet(inv); else showAuthGate(() => famJoinSheet(inv)); return; }
  if (fam.on()) famSync('start');
}
