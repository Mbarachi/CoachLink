/**
 * The whole back-office, served as one page from GET /admin.
 *
 * Deliberately dependency-free: no build step, no framework, no separate app to
 * deploy. It authenticates through the same /auth/signin endpoint everyone else
 * uses and keeps the token in sessionStorage, so it holds no privilege of its
 * own — the RolesGuard on /admin/* is what actually enforces access.
 */
export const ADMIN_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>CoachLink Admin</title>
<style>
  :root {
    --ink: #1a1a1a; --muted: #6b6b6b; --line: #e4e4e4; --bg: #f7f7f5;
    --surface: #fff; --ok: #0f7b3f; --ok-bg: #e6f4ec;
    --bad: #b3261e; --bad-bg: #fdeceb; --wait: #8a6100; --wait-bg: #fdf3e0;
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink);
    font: 15px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  header { background: var(--surface); border-bottom: 1px solid var(--line);
    padding: 14px 20px; display: flex; align-items: center; gap: 14px; }
  header h1 { font-size: 16px; margin: 0; letter-spacing: -0.01em; }
  .spacer { flex: 1; }
  main { max-width: 860px; margin: 0 auto; padding: 20px; }
  button { font: inherit; cursor: pointer; border-radius: 8px; border: 1px solid var(--line);
    background: var(--surface); padding: 8px 14px; }
  button:disabled { opacity: .5; cursor: default; }
  button.primary { background: var(--ink); color: #fff; border-color: var(--ink); }
  button.ok { background: var(--ok); border-color: var(--ok); color: #fff; }
  button.bad { background: var(--surface); border-color: var(--bad); color: var(--bad); }
  input, textarea { font: inherit; width: 100%; padding: 10px 12px; border: 1px solid var(--line);
    border-radius: 8px; background: var(--surface); }
  label { display: block; font-size: 13px; color: var(--muted); margin: 0 0 5px; }
  .field { margin-bottom: 12px; }
  .card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px;
    padding: 16px; margin-bottom: 12px; }
  .row { display: flex; align-items: center; gap: 10px; }
  .name { font-weight: 650; font-size: 16px; }
  .meta { color: var(--muted); font-size: 13px; }
  .bio { margin: 12px 0; white-space: pre-wrap; }
  .facts { display: flex; flex-wrap: wrap; gap: 8px 20px; font-size: 13.5px; margin-bottom: 12px; }
  .facts b { font-weight: 600; }
  .pill { font-size: 12px; font-weight: 650; padding: 3px 9px; border-radius: 99px; }
  .pill.PENDING { background: var(--wait-bg); color: var(--wait); }
  .pill.APPROVED { background: var(--ok-bg); color: var(--ok); }
  .pill.REJECTED { background: var(--bad-bg); color: var(--bad); }
  .tabs { display: flex; gap: 8px; margin-bottom: 18px; }
  .tabs button[aria-selected="true"] { background: var(--ink); color: #fff; border-color: var(--ink); }
  .empty { text-align: center; color: var(--muted); padding: 48px 0; }
  .err { background: var(--bad-bg); color: var(--bad); border-radius: 8px;
    padding: 10px 12px; margin-bottom: 12px; font-size: 14px; }
  .login { max-width: 340px; margin: 60px auto; }
  .actions { display: flex; gap: 8px; }
  .note { font-size: 13px; color: var(--muted); border-left: 2px solid var(--line);
    padding-left: 10px; margin-top: 10px; }
</style>
</head>
<body>
<header>
  <h1>CoachLink Admin</h1>
  <span class="spacer"></span>
  <span id="who" class="meta"></span>
  <button id="signout" hidden>Sign out</button>
</header>
<main>
  <div id="login" class="login" hidden>
    <div id="loginErr" class="err" hidden></div>
    <div class="field"><label for="email">Email</label><input id="email" type="email" autocomplete="username" /></div>
    <div class="field"><label for="password">Password</label><input id="password" type="password" autocomplete="current-password" /></div>
    <button id="signin" class="primary" style="width:100%">Sign in</button>
  </div>

  <div id="app" hidden>
    <div class="tabs">
      <button data-status="PENDING" aria-selected="true">Pending</button>
      <button data-status="APPROVED" aria-selected="false">Approved</button>
      <button data-status="REJECTED" aria-selected="false">Rejected</button>
    </div>
    <div id="listErr" class="err" hidden></div>
    <div id="list"></div>
  </div>
</main>

<script>
(function () {
  var API = location.origin + '/api/v1';
  var TOKEN_KEY = 'coachlink.admin.token';
  var status = 'PENDING';

  var el = function (id) { return document.getElementById(id); };
  var token = function () { return sessionStorage.getItem(TOKEN_KEY); };

  function api(path, options) {
    var opts = options || {};
    var headers = { 'Content-Type': 'application/json' };
    if (token()) headers.Authorization = 'Bearer ' + token();
    return fetch(API + path, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (res) {
      return res.text().then(function (text) {
        var data = null;
        try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
        if (!res.ok) {
          var msg = data && data.message ? data.message : 'Request failed (' + res.status + ')';
          throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
        }
        return data;
      });
    });
  }

  function show(view) {
    el('login').hidden = view !== 'login';
    el('app').hidden = view !== 'app';
    el('signout').hidden = view !== 'app';
    if (view === 'login') el('who').textContent = '';
  }

  function naira(n) { return '\\u20a6' + Number(n).toLocaleString('en-NG'); }

  function node(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined && text !== null) n.textContent = String(text);
    return n;
  }

  function fact(label, value) {
    var wrap = node('span');
    wrap.appendChild(node('b', null, label + ': '));
    wrap.appendChild(document.createTextNode(String(value)));
    return wrap;
  }

  function card(coach) {
    var c = node('div', 'card');

    var head = node('div', 'row');
    var who = node('div');
    who.appendChild(node('div', 'name', coach.user.firstName + ' ' + coach.user.lastName));
    who.appendChild(node('div', 'meta', coach.user.email + ' \\u00b7 ' + coach.user.phoneNumber));
    head.appendChild(who);
    head.appendChild(node('span', 'spacer'));
    head.appendChild(node('span', 'pill ' + coach.verificationStatus, coach.verificationStatus));
    c.appendChild(head);

    c.appendChild(node('div', 'bio', coach.bio));

    var facts = node('div', 'facts');
    facts.appendChild(fact('Venue', coach.venue));
    facts.appendChild(fact('Area', coach.area));
    facts.appendChild(fact('Rate', naira(coach.sessionRate) + ' / session'));
    facts.appendChild(fact('Experience', coach.yearsOfExperience + ' yrs'));
    facts.appendChild(fact('Sports', coach.sports.map(function (s) { return s.name; }).join(', ') || '\\u2014'));
    facts.appendChild(fact('Applied', new Date(coach.createdAt).toLocaleDateString()));
    c.appendChild(facts);

    if (coach.verificationNote) {
      var reviewer = coach.reviewedBy ? coach.reviewedBy.firstName + ' ' + coach.reviewedBy.lastName : 'an admin';
      c.appendChild(node('div', 'note', '\\u201c' + coach.verificationNote + '\\u201d \\u2014 ' + reviewer));
    }

    if (coach.verificationStatus === 'PENDING') {
      var actions = node('div', 'actions');
      var approve = node('button', 'ok', 'Approve');
      var reject = node('button', 'bad', 'Reject');
      approve.onclick = function () { review(coach, 'APPROVED', null, [approve, reject]); };
      reject.onclick = function () {
        var note = window.prompt('Why is this profile being rejected? The coach will see this.');
        if (note === null) return;
        if (!note.trim()) { alert('A rejection needs a reason.'); return; }
        review(coach, 'REJECTED', note.trim(), [approve, reject]);
      };
      actions.appendChild(approve);
      actions.appendChild(reject);
      c.appendChild(actions);
    }

    return c;
  }

  function review(coach, decision, note, buttons) {
    buttons.forEach(function (b) { b.disabled = true; });
    api('/admin/coaches/' + coach.id + '/verification', {
      method: 'PATCH',
      body: note ? { status: decision, note: note } : { status: decision }
    }).then(load).catch(function (err) {
      buttons.forEach(function (b) { b.disabled = false; });
      fail('listErr', err.message);
    });
  }

  function fail(id, message) {
    var box = el(id);
    box.textContent = message;
    box.hidden = false;
  }

  function load() {
    el('listErr').hidden = true;
    return Promise.all([
      api('/admin/coaches?status=' + status),
      api('/admin/coaches/counts')
    ]).then(function (results) {
      var coaches = results[0];
      var counts = results[1];

      Array.prototype.forEach.call(document.querySelectorAll('.tabs button'), function (b) {
        var s = b.dataset.status;
        b.textContent = s.charAt(0) + s.slice(1).toLowerCase() + ' (' + (counts[s] || 0) + ')';
        b.setAttribute('aria-selected', String(s === status));
      });

      var list = el('list');
      list.textContent = '';
      if (!coaches.length) {
        list.appendChild(node('div', 'empty', 'Nothing ' + status.toLowerCase() + '.'));
        return;
      }
      coaches.forEach(function (c) { list.appendChild(card(c)); });
    }).catch(function (err) {
      if (/access|authenticated|Unauthorized/i.test(err.message)) return signOut();
      fail('listErr', err.message);
    });
  }

  function signOut() {
    sessionStorage.removeItem(TOKEN_KEY);
    show('login');
  }

  el('signin').onclick = function () {
    el('loginErr').hidden = true;
    var btn = el('signin');
    btn.disabled = true;
    api('/auth/signin', { method: 'POST', body: { email: el('email').value.trim(), password: el('password').value } })
      .then(function (data) {
        if (data.user.role !== 'ADMIN') throw new Error('That account is not an admin.');
        sessionStorage.setItem(TOKEN_KEY, data.accessToken);
        el('who').textContent = data.user.email;
        el('password').value = '';
        show('app');
        return load();
      })
      .catch(function (err) { fail('loginErr', err.message); })
      .then(function () { btn.disabled = false; });
  };

  el('password').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') el('signin').click();
  });

  el('signout').onclick = signOut;

  Array.prototype.forEach.call(document.querySelectorAll('.tabs button'), function (b) {
    b.onclick = function () { status = b.dataset.status; load(); };
  });

  if (token()) {
    show('app');
    load();
  } else {
    show('login');
  }
})();
</script>
</body>
</html>`;
