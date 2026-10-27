// לומדים בכיף — 🔐 הרשמת הורה (אותו חשבון כמו בכסף בכיף ובזמן בכיף), קוד הורה וטביעת אצבע.
// רק ההורה נרשם. הילדים, השמות, התמונות וההתקדמות נשארים בטלפון בלבד ולא נשלחים לשרת.
'use strict';

const SB = { url: 'https://dmhxovlepdoobkoiyjhj.supabase.co', key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtaHhvdmxlcGRvb2Jrb2l5amhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNDUxNDIsImV4cCI6MjEwNzkyMTE0Mn0.qao1CRL1QWJhMnWsAaPXKt-WxbgySqIlH68iIdCYH1o' };
const AUTH_RECOVERY = /type=recovery/.test(location.hash);
const AUTH_LINK_ERR = /error_code=|error=access_denied/.test(location.hash);

// ---------- חיבור לשרת ----------
const auth = {
  sb: null, user: null, loading: null,
  lib() {
    if (window.supabase) return Promise.resolve();
    this.loading ??= new Promise((res, rej) => {
      const s = document.createElement('script'); s.src = 'vendor/supabase.js';
      s.onload = res; s.onerror = () => { this.loading = null; rej(new Error('lib')); }; document.head.appendChild(s);
    });
    return this.loading;
  },
  async client() {
    if (this.sb) return this.sb;
    await this.lib();
    this.sb = window.supabase.createClient(SB.url, SB.key, { auth: { persistSession: true, autoRefreshToken: true } });
    return this.sb;
  },
  async current() { try { const c = await this.client(); this.user = (await c.auth.getSession()).data.session?.user || null; } catch { } return this.user; },
  nice(e) {
    const m = e?.message || String(e);
    const map = { 'Invalid login credentials': 'המייל או הסיסמה לא נכונים', 'User already registered': 'המייל הזה כבר רשום. לוחצים "כבר רשומים, כניסה"', 'Password should be at least 6 characters': 'הסיסמה צריכה להיות לפחות 6 תווים' };
    const k = Object.keys(map).find(x => m.includes(x));
    return k ? map[k] : /fetch|network|lib/i.test(m) ? 'אין חיבור לאינטרנט' : /rate|seconds/i.test(m) ? 'כבר שלחנו מייל. חכו דקה ונסו שוב' : m;
  },
  async signIn(email, password) { const { error } = await (await this.client()).auth.signInWithPassword({ email, password }); if (error) throw new Error(this.nice(error)); await this.current(); },
  async signUp(email, password) {
    const { data, error } = await (await this.client()).auth.signUp({ email, password });
    if (error) throw new Error(this.nice(error)); if (!data.session) throw new Error('צריך לאשר את המייל. בדקו את תיבת הדואר'); await this.current();
  },
  async signOut() { try { await (await this.client()).auth.signOut(); } catch { } this.user = null; },
  async reset(email) { const { error } = await (await this.client()).auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname }); if (error) throw new Error(this.nice(error)); },
  async newPassword(pw) { const { error } = await (await this.client()).auth.updateUser({ password: pw }); if (error) throw new Error(this.nice(error)); },
  // בודק סיסמה בלי לצאת מהחשבון (כששכחו את קוד ההורה)
  async checkPassword(pw) { if (!this.user?.email) throw new Error('אין חשבון מחובר בטלפון הזה'); const { error } = await (await this.client()).auth.signInWithPassword({ email: this.user.email, password: pw }); if (error) throw new Error(this.nice(error)); },
  // לוח הבקרה: "נפתחתי", עם המשתמש המחובר
  async ping() { try { if (this.user && window.lbkTrack) await window.lbkTrack.ping(await this.client()); } catch { } },
};

// ---------- 🔢 קוד הורה + טביעת אצבע (נשמר רק בטלפון) ----------
const lock = {
  KEY: 'lbk-lock',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || null; } catch { return null; } },
  put(s) { try { s ? localStorage.setItem(this.KEY, JSON.stringify(s)) : localStorage.removeItem(this.KEY); } catch { } },
  async hash(pin) { const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('lomdim-bekef:' + pin)); return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join(''); },
  async bioOk() { try { return !!window.PublicKeyCredential && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(); } catch { return false; } },
  async set(pin, useBio) {
    const s = { pinHash: await this.hash(pin), cred: this.get()?.cred || null };
    if (useBio && !s.cred) {
      const r = n => crypto.getRandomValues(new Uint8Array(n));
      const c = await navigator.credentials.create({ publicKey: { challenge: r(32), rp: { name: 'לומדים בכיף', id: location.hostname },
        user: { id: r(16), name: 'lomdim-bekef', displayName: 'הורה · לומדים בכיף' }, pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
        authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'discouraged' }, timeout: 60000 } });
      s.cred = btoa(String.fromCharCode(...new Uint8Array(c.rawId)));
    }
    if (!useBio) s.cred = null;
    this.put(s); return s;
  },
  async pinOk(pin) { const s = this.get(); return !!s && (await this.hash(pin)) === s.pinHash; },
  async bio() {
    const s = this.get(); if (!s?.cred) return false;
    await navigator.credentials.get({ publicKey: { challenge: crypto.getRandomValues(new Uint8Array(32)),
      allowCredentials: [{ type: 'public-key', id: Uint8Array.from(atob(s.cred), c => c.charCodeAt(0)), transports: ['internal'] }], userVerification: 'required', timeout: 60000 } });
    return true;
  },
};
const isIOS = () => /iPhone|iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// ---------- מסך הכניסה (מעל הכל, לפני הפעם הראשונה) ----------
function gateEl() { let g = $('#gate'); if (!g) { g = document.createElement('div'); g.id = 'gate'; document.body.appendChild(g); } g.classList.add('on'); return g; }
function gateOff() { $('#gate')?.classList.remove('on'); }
const validMail = e => /^\S+@\S+\.\S+$/.test(e);

function showAuthGate(done) {
  const g = gateEl(); voice.stop?.();
  g.innerHTML = `<div class="gwrap">${mascot('lg')}
    <h2>ברוכים הבאים ללומדים בכיף ✨</h2>
    <p class="mute">הורה נרשם פעם אחת, ואז הילדים נכנסים ישר למשחק.</p>
    <div class="gsame">🔑 כבר רשומים לכסף בכיף או לזמן בכיף? נכנסים עם <b>אותו מייל ואותה סיסמה</b>.</div>
    <label class="field"><input id="aMail" type="email" autocomplete="email" inputmode="email" placeholder="מייל" dir="ltr"></label>
    <label class="field"><input id="aPass" type="password" autocomplete="current-password" placeholder="סיסמה (לפחות 6 תווים)" dir="ltr"></label>
    <div class="err" id="aErr"></div>
    <button class="btn full" id="aIn">כבר רשומים, כניסה</button>
    <button class="btn ghost full" id="aUp" style="margin-top:8px">הרשמה חדשה</button>
    <button class="linkbtn" id="aForgot">🔑 שכחתי סיסמה</button>
    <p class="mute small" style="margin-top:14px">🔒 רק ההורה נרשם. השמות, התמונות וההתקדמות של הילדים נשארים רק בטלפון הזה.</p>
    <a class="mute small" href="guide/" style="display:block;margin-top:8px;color:#F9A8D4">❓ צריך עזרה? למדריך</a></div>`;
  const err = t => { const e = $('#aErr', g); if (e) e.textContent = t; };
  const run = async (fn, btn) => {
    const e = $('#aMail', g).value.trim(), p = $('#aPass', g).value;
    if (!validMail(e)) return err('צריך מייל תקין');
    if (p.length < 6) return err('הסיסמה צריכה להיות לפחות 6 תווים');
    if (!navigator.onLine) return err('צריך אינטרנט כדי להיכנס בפעם הראשונה');
    btn.disabled = true; err('');
    try { await fn.call(auth, e, p); auth.ping(); const fin = () => { done(); maybeNews(); }; lock.get() ? (gateOff(), fin()) : showPinSetup(fin, true); }
    catch (x) { err(x.message); btn.disabled = false; failNote('auth', (fn === auth.signUp ? 'signup: ' : 'signin: ') + x.message); }
  };
  $('#aIn', g).onclick = e => run(auth.signIn, e.target);
  $('#aUp', g).onclick = e => run(auth.signUp, e.target);
  $('#aForgot', g).onclick = async e => {
    const m = $('#aMail', g).value.trim(); if (!validMail(m)) { err('קודם כותבים את המייל למעלה'); $('#aMail', g).focus(); return; }
    e.target.disabled = true;
    try { await auth.reset(m); err(''); e.target.textContent = '📧 נשלח! פתחו את המייל ולחצו על הקישור'; } catch (x) { err(x.message); e.target.disabled = false; failNote('auth', 'reset: ' + x.message); }
  };
  $$('input', g).forEach(i => i.oninput = () => err(''));
}

// בחירת קוד הורה (פעם ראשונה, או החלפה)
function showPinSetup(done, first) {
  const g = gateEl(); let a = '', b = '', stage = 1;
  // המסך נבנה פעם אחת. בכל הקשה מתעדכנות רק הנקודות, כדי שהמסך לא יהבהב
  g.innerHTML = `<div class="gwrap"><div style="font-size:54px">🔐</div>
    <h2 id="pT">בוחרים קוד הורה</h2><p class="mute" id="pS">4 ספרות. איתו נכנסים לאזור ההורה, במקום התרגיל.</p>
    <div class="pdots" id="pDots">${[0, 1, 2, 3].map(() => '<i></i>').join('')}</div><div class="err" id="pErr"></div>
    <div class="ppad">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(k => k ? `<button data-k="${k}">${k}</button>` : '<span></span>').join('')}</div>
    <button class="linkbtn" id="pSkip">${first ? 'אחר כך (נשאר תרגיל)' : 'ביטול'}</button></div>`;
  const dots = () => { const cur = stage === 1 ? a : b; $$('#pDots i', g).forEach((d, i) => d.classList.toggle('f', i < cur.length)); };
  const setStage = n => { stage = n; $('#pT', g).textContent = n === 1 ? 'בוחרים קוד הורה' : 'עוד פעם, לאישור'; $('#pS', g).textContent = n === 1 ? '4 ספרות. איתו נכנסים לאזור ההורה, במקום התרגיל.' : 'מקלידים שוב את אותו קוד'; dots(); };
  $('#pSkip', g).onclick = () => { gateOff(); done(); };
  let busy = false;
  $$('[data-k]', g).forEach(x => x.onclick = async () => {
    if (busy) return; const k = x.dataset.k; $('#pErr', g).textContent = '';
    let cur = stage === 1 ? a : b; cur = k === '⌫' ? cur.slice(0, -1) : (cur + k).slice(0, 4); stage === 1 ? a = cur : b = cur; dots();
    if (cur.length < 4) return;
    busy = true;
    if (stage === 1) { setTimeout(() => { setStage(2); busy = false; }, 250); return; }
    if (a !== b) { a = ''; b = ''; setStage(1); busy = false; const d = $('#pDots', g); d.classList.remove('shake'); void d.offsetWidth; d.classList.add('shake'); $('#pErr', g).textContent = 'הקודים לא זהים. מתחילים שוב'; return; }
    const bio = await lock.bioOk();
    if (!bio) { await lock.set(a, false); gateOff(); toast('🔐 קוד ההורה נשמר'); return done(); }
    g.innerHTML = `<div class="gwrap"><div style="font-size:54px">👆</div><h2>${isIOS() ? 'גם עם Face ID?' : 'גם עם טביעת אצבע?'}</h2>
      <p class="mute">ככה נכנסים לאזור ההורה בלי להקליד. הקוד נשאר לגיבוי.</p>
      <button class="btn full" id="bYes">${isIOS() ? '🙂 כן, עם Face ID' : '👆 כן, עם טביעת אצבע'}</button><button class="btn ghost full" id="bNo" style="margin-top:8px">רק קוד</button><div class="err" id="bErr"></div></div>`;
    $('#bYes', g).onclick = async () => { try { await lock.set(a, true); gateOff(); toast('✅ מוכן! נכנסים עם טביעת אצבע או קוד'); done(); } catch { $('#bErr', g).textContent = 'לא הצליח. אפשר "רק קוד", ולנסות שוב אחר כך באזור ההורה'; } };
    $('#bNo', g).onclick = async () => { await lock.set(a, false); gateOff(); toast('🔐 קוד ההורה נשמר'); done(); };
  });
}

// ---------- שער ההורים: קוד או טביעת אצבע (ובלי קוד: התרגיל הישן) ----------
let pinFails = 0, pinWaitUntil = 0;
function pinGate(then, why) {
  const st = lock.get(); let buf = '';
  openSheet(`<h2>🔒 ${esc(why)}</h2><div class="pdots" id="gDots">${[0, 1, 2, 3].map(() => '<i></i>').join('')}</div><div class="err" id="gErr"></div>
    ${st.cred ? `<button class="btn full" id="gBio" style="margin-bottom:10px">${isIOS() ? '🙂 פתיחה עם Face ID' : '👆 פתיחה בטביעת אצבע'}</button>` : ''}
    <div class="ppad" id="gPad">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(k => k ? `<button data-k="${k}">${k}</button>` : '<span></span>').join('')}</div>
    <button class="linkbtn" id="gForgot">שכחתי את הקוד</button>
    <div id="gPwBox" hidden><label class="field"><input id="gPw" type="password" placeholder="הסיסמה של החשבון" dir="ltr"></label><button class="btn full" id="gPwGo">פתיחה עם הסיסמה</button></div>`, s => {
    const ok = () => { pinFails = 0; closeSheet(); then(); };
    const dots = () => $$('#gDots i', s).forEach((d, i) => d.classList.toggle('f', i < buf.length));
    const bio = async auto => { try { if (await lock.bio()) ok(); } catch (e) { if (!auto && e.name !== 'NotAllowedError') $('#gErr', s).textContent = 'הזיהוי לא הצליח. אפשר להקליד קוד'; } };
    $('#gBio', s)?.addEventListener('click', () => bio(false));
    $$('#gPad [data-k]', s).forEach(b => b.onclick = async () => {
      if (Date.now() < pinWaitUntil) { $('#gErr', s).textContent = `יותר מדי ניסיונות. עוד ${Math.ceil((pinWaitUntil - Date.now()) / 1000)} שניות`; return; }
      const k = b.dataset.k; buf = k === '⌫' ? buf.slice(0, -1) : (buf + k).slice(0, 4); dots(); $('#gErr', s).textContent = '';
      if (buf.length < 4) return;
      if (await lock.pinOk(buf)) return ok();
      pinFails++; buf = ''; dots(); const d = $('#gDots', s); d.classList.remove('shake'); void d.offsetWidth; d.classList.add('shake');
      if (pinFails >= 5) { pinWaitUntil = Date.now() + 30000; pinFails = 0; $('#gErr', s).textContent = 'יותר מדי ניסיונות. מחכים 30 שניות'; } else $('#gErr', s).textContent = 'קוד שגוי';
    });
    $('#gForgot', s).onclick = () => { $('#gPwBox', s).hidden = false; $('#gPad', s).hidden = true; $('#gPw', s).focus(); };
    $('#gPwGo', s).onclick = async e => {
      const pw = $('#gPw', s).value; if (!pw) return;
      if (!navigator.onLine) { $('#gErr', s).textContent = 'צריך אינטרנט כדי לבדוק את הסיסמה'; return; }
      e.target.disabled = true;
      try { await auth.checkPassword(pw); closeSheet(); toast('✅ נכנסת. אפשר לבחור קוד חדש'); showPinSetup(then, false); }
      catch (x) { $('#gErr', s).textContent = x.message; e.target.disabled = false; failNote('auth', 'pin-forgot: ' + x.message); }
    };
    // אנדרואיד: טביעת האצבע קופצת לבד. באייפון אפל מחייבת לחיצה
    if (st.cred && !isIOS()) setTimeout(() => bio(true), 350);
  });
}

// ---------- 👤 חשבון וקוד, מאזור ההורה ----------
function accountSheet() {
  const st = lock.get();
  openSheet(`<h2>👤 החשבון וקוד ההורה</h2>
    <div class="card" style="margin-bottom:12px"><div class="mute small">מחובר כ־</div><b dir="ltr" style="display:block;text-align:right">${esc(auth.user?.email || 'לא מחובר')}</b>
      <p class="mute small" style="margin-top:6px">אותו חשבון כמו בכסף בכיף ובזמן בכיף. הילדים וההתקדמות שלהם נשמרים רק בטלפון.</p></div>
    <div class="stack"><button class="btn full" id="acPin">🔢 ${st ? 'להחליף את קוד ההורה' : 'לבחור קוד הורה'}</button>
      ${st ? `<button class="btn ghost full" id="acBio">${st.cred ? '👆 לבטל טביעת אצבע' : '👆 להוסיף טביעת אצבע'}</button><button class="btn ghost full" id="acOff">🧮 לחזור לתרגיל במקום קוד</button>` : ''}
      <button class="btn ghost full" id="acOut">🚪 יציאה מהחשבון</button></div><div class="err" id="acErr"></div>`, s => {
    $('#acPin', s).onclick = () => { closeSheet(); showPinSetup(parentHome, false); };
    $('#acBio', s)?.addEventListener('click', async () => {
      const cur = lock.get(); if (cur.cred) { cur.cred = null; lock.put(cur); closeSheet(); toast('טביעת האצבע בוטלה'); return; }
      if (!(await lock.bioOk())) { $('#acErr', s).textContent = 'הטלפון הזה לא תומך בטביעת אצבע באתר'; return; }
      closeSheet(); showPinSetup(parentHome, false); toast('בוחרים קוד שוב, ואחריו טביעת אצבע');
    });
    $('#acOff', s)?.addEventListener('click', () => { lock.put(null); closeSheet(); toast('🧮 חזרנו לתרגיל'); });
    $('#acOut', s).onclick = () => {
      openSheet(`<h2>🚪 יציאה מהחשבון?</h2><p>הילדים וההתקדמות נשארים בטלפון. בפעם הבאה שנכנסים צריך מייל וסיסמה.</p>
        <div class="stack" style="margin-top:12px"><button class="btn full" id="y">כן, לצאת</button><button class="btn ghost full" id="n">ביטול</button></div>`, s2 => {
        $('#n', s2).onclick = closeSheet;
        $('#y', s2).onclick = async () => { await auth.signOut(); lock.put(null); closeSheet(); showAuthGate(profiles); };
      });
    };
  });
}

// ---------- קישור מהמייל: סיסמה חדשה, או קישור שכבר לא תקף ----------
function recoverySheets() {
  if (AUTH_RECOVERY && auth.user) {
    history.replaceState(null, '', location.pathname + location.search);
    openSheet(`<h2>🔑 סיסמה חדשה</h2><p class="mute small">לחשבון <span dir="ltr">${esc(auth.user.email || '')}</span></p>
      <label class="field"><input id="npPass" type="password" autocomplete="new-password" placeholder="סיסמה חדשה (לפחות 6 תווים)" dir="ltr"></label>
      <div class="err" id="npErr"></div><button class="btn full" id="npSave">שמירה</button>`, s => {
      $('#npSave', s).onclick = async () => {
        const pw = $('#npPass', s).value; if (pw.length < 6) { $('#npErr', s).textContent = 'הסיסמה צריכה להיות לפחות 6 תווים'; return; }
        try { await auth.newPassword(pw); closeSheet(); toast('✅ הסיסמה הוחלפה. היא עובדת בכל האפליקציות'); } catch (x) { $('#npErr', s).textContent = x.message; }
      };
    });
  } else if (AUTH_LINK_ERR) {
    history.replaceState(null, '', location.pathname + location.search);
    openSheet(`<h2>⏰ הקישור מהמייל כבר לא תקף</h2><p class="mute small">קישור לאיפוס סיסמה עובד פעם אחת בלבד ולזמן קצר. שולחים מייל חדש ולוחצים על הקישור מיד:</p>
      <label class="field"><input id="leMail" type="email" placeholder="המייל שאיתו נרשמתם" dir="ltr"></label><div class="err" id="leErr"></div><button class="btn full" id="leSend">📧 לשלוח קישור חדש</button>`, s => {
      $('#leSend', s).onclick = async e => {
        const m = $('#leMail', s).value.trim(); if (!validMail(m)) { $('#leErr', s).textContent = 'צריך מייל תקין'; return; }
        e.target.disabled = true; try { await auth.reset(m); e.target.textContent = '📧 נשלח! פתחו את המייל ולחצו על הקישור'; } catch (x) { e.target.disabled = false; $('#leErr', s).textContent = x.message; }
      };
    });
  }
}

// ---------- הפעלה: בלי חשבון מחובר מראים את מסך הכניסה ----------
async function authStart(done) {
  if (new URLSearchParams(location.search).has('shot')) return done();
  const u = await auth.current();
  if (u) { done(); auth.ping(); recoverySheets(); await Promise.race([loadApproved(), new Promise(r => setTimeout(r, 2500))]); maybeNews(); return; }
  // בלי אינטרנט בפעם הראשונה: נותנים לשחק, ומבקשים להירשם כשיש אינטרנט
  if (!navigator.onLine || !window.supabase) { done(); maybeNews(); return; }
  showAuthGate(done); recoverySheets();
}
