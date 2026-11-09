/* GearCheck: kleine Helfer ohne fremde Bibliotheken.
   Menü · Suche · Länderwahl · Unternavigation · Lesefortschritt · Teilen · Rechner · Finder · Saisontipp · Filter
   Alles funktioniert auch ohne JavaScript, die Seite zeigt dann einfach die statischen Inhalte. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- Kopfzeile: beim Runterscrollen ausblenden, beim Hochscrollen zeigen ---------- */
  var drops = $$('.nav-drop, .menu-drop');
  var lastY = window.scrollY, ticking = false;
  var progressBar = null, article = $('main.article');
  if (article) {
    progressBar = d.createElement('div');
    progressBar.className = 'read-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    d.body.appendChild(progressBar);
  }
  function onScroll() {
    var y = window.scrollY;
    var menuOpen = drops.some(function (x) { return x.open; });
    if (y > 180 && y > lastY + 6 && !menuOpen) root.classList.add('header-hidden');
    else if (y < lastY - 6 || y < 180) root.classList.remove('header-hidden');
    lastY = y;
    if (progressBar) {
      var end = article.offsetTop + article.offsetHeight - window.innerHeight;
      var p = end > 0 ? Math.min(1, Math.max(0, (y - article.offsetTop + 100) / end)) : 0;
      progressBar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* ---------- Menüs (Sportarten, Handy-Menü) ---------- */
  d.addEventListener('click', function (e) {
    drops.forEach(function (x) { if (x.open && !x.contains(e.target)) x.open = false; });
  });
  d.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    drops.forEach(function (x) { if (x.open) { x.open = false; var s = $('summary', x); if (s) s.focus(); } });
  });
  drops.forEach(function (x) {
    x.addEventListener('toggle', function () {
      if (!x.open) return;
      root.classList.remove('header-hidden');
      drops.forEach(function (o) { if (o !== x) o.open = false; });
    });
  });
  $$('.mobile-menu a, .mega a').forEach(function (a) {
    a.addEventListener('click', function () { drops.forEach(function (x) { x.open = false; }); });
  });

  /* ---------- Länderwahl DE / AT / CH ---------- */
  // Alle drei Länder bestellen heute über Amazon.de mit derselben Partner-ID.
  // Kommt später ein eigener Marktplatz oder ein Link pro Land dazu, hier eintragen
  // oder am Link selbst: data-offer-ch="https://…" (gilt dann nur für dieses Produkt und Land).
  var MARKETS = {
    DE: { name: 'Deutschland', host: 'www.amazon.de', tag: 'gearcheck02-21',
      note: 'Die Links führen zu <b>Amazon.de</b>. Die Preisspannen sind grobe Richtwerte in Euro, Versandkosten hängen vom jeweiligen Angebot ab.' },
    AT: { name: 'Österreich', host: 'www.amazon.de', tag: 'gearcheck02-21',
      note: 'Die Links führen zu <b>Amazon.de</b>, das nach Österreich liefert. Versandkosten und Lieferzeiten können je nach Angebot abweichen.' },
    CH: { name: 'Schweiz', host: 'www.amazon.de', tag: 'gearcheck02-21',
      note: 'Die Links führen zu <b>Amazon.de</b>. Viele, aber nicht alle Artikel werden in die Schweiz geliefert. Versand und mögliche Einfuhrabgaben kommen je nach Angebot dazu, die Preisspannen sind darum nur eine Orientierung in Euro.' }
  };
  function detectCountry() {
    var saved = store.get('gc-land');
    if (saved && MARKETS[saved]) return saved;
    var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < langs.length; i++) {
      var l = String(langs[i]).toUpperCase();
      if (/-CH$/.test(l)) return 'CH';
      if (/-AT$/.test(l)) return 'AT';
      if (/-(DE|LU)$/.test(l)) return 'DE';
    }
    // Zweiter Hinweis: die Zeitzone des Geräts. Bleibt im Browser, nichts wird übertragen.
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    if (tz === 'Europe/Zurich' || tz === 'Europe/Vaduz') return 'CH';
    if (tz === 'Europe/Vienna') return 'AT';
    return 'DE';
  }
  function marketUrl(href, m) {
    try {
      var u = new URL(href);
      if (!/(^|\.)amazon\./.test(u.hostname)) return href;
      u.hostname = m.host;
      u.searchParams.set('tag', m.tag);
      return u.toString();
    } catch (e) { return href; }
  }
  function applyCountry(code) {
    var m = MARKETS[code] || MARKETS.DE;
    root.setAttribute('data-land', code);
    $$('[data-country]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-country') === code ? 'true' : 'false'); });
    $$('[data-land-name]').forEach(function (el) { el.textContent = m.name; });
    $$('[data-ship-note]').forEach(function (el) {
      el.querySelector('span').innerHTML = m.note + ' Dein Land: <b>' + esc(m.name) + '</b> · <button type="button" data-open-country>ändern</button>';
    });
    // Schweiz: an jeder Karte offen sagen, dass der Preis in Euro ist und die Lieferung geprüft werden muss
    $$('.gear-price > span:first-child').forEach(function (s) { s.textContent = code === 'CH' ? 'Preis in EUR' : 'Preisorientierung'; });
    $$('.gear-buy, .pick').forEach(function (box) {
      var hint = box.querySelector('.ship-hint'), btn = box.querySelector('a[data-amazon]');
      if (code === 'CH' && btn) {
        if (!hint) { hint = d.createElement('small'); hint.className = 'ship-hint'; btn.insertAdjacentElement('afterend', hint); }
        hint.textContent = btn.hasAttribute('data-offer-ch') ? 'Angebot mit Lieferung in die Schweiz' : 'Lieferung in die Schweiz bei Amazon.de prüfen';
      } else if (hint) { hint.remove(); }
    });
    $$('a[data-amazon]').forEach(function (a) {
      if (!a.hasAttribute('data-href')) a.setAttribute('data-href', a.getAttribute('href'));
      var own = a.getAttribute('data-offer-' + code.toLowerCase());
      var next = own || marketUrl(a.getAttribute('data-href'), m);
      if (next !== a.getAttribute('href')) a.setAttribute('href', next);
    });
  }
  applyCountry(detectCountry());
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-country]');
    if (b) { var c = b.getAttribute('data-country'); store.set('gc-land', c); applyCountry(c); return; }
    if (e.target.closest('[data-open-country]')) {
      var sw = $('.country');
      if (sw) { sw.scrollIntoView({ behavior: 'smooth', block: 'center' }); var p = $('[aria-pressed="true"]', sw); if (p) setTimeout(function () { p.focus(); }, 400); }
    }
  });

  /* ---------- Suche ---------- */
  var dlg = $('#suche');
  if (dlg && typeof dlg.showModal === 'function') {
    var input = $('#suche-feld'), out = $('#suche-treffer');
    var index = null, loading = null, hits = [], active = -1;
    var SYN = {
      fahrrad: ['velo', 'rad', 'radsport'], velo: ['fahrrad', 'rad'], rad: ['fahrrad', 'velo'], fahrradhelm: ['velohelm', 'helm'], velohelm: ['fahrradhelm'],
      joggen: ['laufen', 'running', 'lauf'], jogging: ['laufen', 'running'], laufen: ['running', 'lauf'], running: ['laufen', 'lauf'],
      gym: ['home gym', 'fitness'], fitness: ['home gym'], krafttraining: ['hantel', 'home gym', 'kraft'], hantel: ['kurzhantel', 'langhantel'], hanteln: ['kurzhantel', 'hantel'],
      turnschuhe: ['schuhe', 'laufschuhe'], sportschuhe: ['schuhe', 'laufschuhe'], boxen: ['kampfsport', 'box'], mma: ['kampfsport'], thaiboxen: ['kampfsport', 'thai'], kickboxen: ['kampfsport'],
      ski: ['wintersport', 'ski'], snowboard: ['wintersport', 'snowboard'], skifahren: ['wintersport', 'ski'], schwimmen: ['schwimm'], tennis: ['tennis'], padel: ['padel'], fussball: ['fussball'],
      helm: ['helm'], brille: ['brille'], handschuhe: ['handschuh']
    };
    var norm = function (s) {
      return String(s).toLowerCase().replace(/ß/g, 'ss').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
    };
    var load = function () {
      if (index || loading) return loading;
      loading = fetch('/assets/data/suche.json').then(function (r) { return r.json(); }).then(function (data) {
        index = data.map(function (e) { e.nt = norm(e.t); e.nd = norm((e.d || '') + ' ' + (e.x || '')); return e; });
        render(input.value);
      }).catch(function () { out.innerHTML = '<p class="search-empty">Die Suche konnte nicht geladen werden.</p>'; });
      return loading;
    };
    var score = function (e, terms) {
      var total = 0;
      for (var i = 0; i < terms.length; i++) {
        var alts = terms[i], best = 0;
        for (var j = 0; j < alts.length; j++) {
          var t = alts[j], w = j === 0 ? 1 : 0.7;
          if (!t) continue;
          if ((' ' + e.nt).indexOf(' ' + t) > -1) best = Math.max(best, 7 * w);
          else if (e.nt.indexOf(t) > -1) best = Math.max(best, 4 * w);
          else if (e.nd.indexOf(t) > -1) best = Math.max(best, 1.5 * w);
        }
        if (!best) return 0;
        total += best;
      }
      return total * ({ s: 1.6, g: 1.3, p: 1, x: 0.8 }[e.k] || 1);
    };
    // Markiert den ersten Suchbegriff im Titel, auch wenn dort Umlaute oder ß stehen
    var mark = function (title, q) {
      var first = (q || '').split(' ')[0];
      if (!first || first.length < 2) return esc(title);
      var pat = first.replace(/ss/g, '\u0000').split('').map(function (ch) {
        if (ch === '\u0000') return '(?:ss|ß)';
        if (ch === 'a') return '[aä]';
        if (ch === 'o') return '[oö]';
        if (ch === 'u') return '[uü]';
        return ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }).join('');
      var m = new RegExp(pat, 'i').exec(title);
      if (!m) return esc(title);
      return esc(title.slice(0, m.index)) + '<mark>' + esc(m[0]) + '</mark>' + esc(title.slice(m.index + m[0].length));
    };
    var SUGGEST = ['Boxhandschuhe', 'Laufschuhe', 'Fahrradhelm', 'Kurzhanteln', 'Skibrille', 'Schwimmbrille', 'Fussballschuhe', 'Padel'];
    var render = function (raw) {
      var q = norm(raw || '');
      active = -1;
      if (!q) {
        out.innerHTML = '<div class="search-group"><h3>Beliebte Suchen</h3><div class="search-suggest">' +
          SUGGEST.map(function (s) { return '<button type="button" class="chip" data-suggest="' + esc(s) + '">' + esc(s) + '</button>'; }).join('') + '</div></div>';
        hits = [];
        return;
      }
      if (!index) { out.innerHTML = '<p class="search-empty">Suche wird geladen …</p>'; load(); return; }
      var terms = q.split(' ').filter(Boolean).map(function (t) { return [t].concat(SYN[t] || []); });
      var res = index.map(function (e) { return { e: e, s: score(e, terms) }; }).filter(function (r) { return r.s > 0; })
        .sort(function (a, b) { return b.s - a.s; });
      var groups = [['s', 'Sportarten', 3], ['g', 'Ratgeber', 5], ['p', 'Produkte', 8], ['x', 'Seiten', 3]];
      hits = [];
      var html = groups.map(function (g) {
        var list = res.filter(function (r) { return r.e.k === g[0]; }).slice(0, g[2]);
        if (!list.length) return '';
        return '<div class="search-group"><h3>' + g[1] + '</h3>' + list.map(function (r) {
          hits.push(r.e);
          return '<a class="search-hit cat-' + esc(r.e.c || 'none') + '" href="' + esc(r.e.u) + '"><span class="dot"></span><span><b>' + mark(r.e.t, q) + '</b><small>' + esc(r.e.m || r.e.d || '') + '</small></span></a>';
        }).join('') + '</div>';
      }).join('');
      out.innerHTML = html || '<p class="search-empty">Nichts gefunden für „' + esc(raw) + '“. Versuch es mit einem allgemeineren Begriff, zum Beispiel „Schuhe“ oder „Helm“.</p>';
    };
    var openSearch = function () {
      if (dlg.open) return;
      dlg.showModal();
      root.classList.remove('header-hidden');
      input.value = '';
      render('');
      load();
      setTimeout(function () { input.focus(); }, 30);
    };
    $$('[data-search-open]').forEach(function (b) { b.addEventListener('click', openSearch); });
    input.addEventListener('input', function () { render(input.value); });
    out.addEventListener('click', function (e) {
      var s = e.target.closest('[data-suggest]');
      if (s) { input.value = s.getAttribute('data-suggest'); render(input.value); input.focus(); }
    });
    out.addEventListener('click', function (e) { if (e.target.closest('a')) dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    input.addEventListener('keydown', function (e) {
      var links = $$('.search-hit', out);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!links.length) return;
        active = (active + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
        links.forEach(function (l, i) { l.classList.toggle('is-active', i === active); });
        links[active].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        var target = links[active >= 0 ? active : 0];
        if (target) { window.location.href = target.getAttribute('href'); dlg.close(); }
      }
    });
    d.addEventListener('keydown', function (e) {
      var typing = /INPUT|TEXTAREA|SELECT/.test((d.activeElement || {}).tagName || '');
      if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) { e.preventDefault(); openSearch(); }
    });
  }

  /* ---------- Unternavigation auf den Sportseiten ---------- */
  var sub = $('.subnav');
  if (sub && 'IntersectionObserver' in window) {
    var inner = $('.subnav-inner', sub);
    var links = $$('a[href^="#"]', sub);
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var a = byId[en.target.id];
        if (!a) return;
        links.forEach(function (l) { l.classList.toggle('is-active', l === a); });
        inner.scrollTo({ left: a.offsetLeft - inner.clientWidth / 2 + a.clientWidth / 2, behavior: 'smooth' });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(byId).forEach(function (id) { var el = d.getElementById(id); if (el) io.observe(el); });
  }

  /* ---------- Teilen ---------- */
  $$('[data-share-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var label = b.querySelector('span');
      var done = function () { label.textContent = 'Link kopiert ✓'; setTimeout(function () { label.textContent = 'Link kopieren'; }, 2200); };
      if (navigator.clipboard) navigator.clipboard.writeText(window.location.href.split('#')[0]).then(done);
    });
  });
  $$('[data-share-native]').forEach(function (b) {
    if (!navigator.share) { b.remove(); return; }
    b.addEventListener('click', function () {
      navigator.share({ title: d.title, url: window.location.href.split('#')[0] }).catch(function () {});
    });
  });

  /* ---------- Interaktive Helfer in den Ratgebern ---------- */
  var tools = {
    // Boxhandschuhe: Unzen nach Körpergewicht (gleiche Werte wie die Tabelle im Ratgeber)
    oz: function (form, show) {
      var rows = [[55, '10–12 oz', '14 oz'], [70, '12–14 oz', '16 oz'], [85, '14–16 oz', '16 oz'], [Infinity, '16 oz', '16–18 oz']];
      var kg = parseFloat(form.kg.value), use = form.use.value;
      if (!kg) return show('<p>Gib dein Körpergewicht ein, dann siehst du hier die passende Unzen-Zahl.</p>');
      if (kg < 30 || kg > 200) return show('<p>Bitte ein Gewicht zwischen 30 und 200 kg eingeben. Für Kinder gibt es eigene Kinderhandschuhe, frag im Verein nach der passenden Grösse.</p>');
      var r = rows.filter(function (x) { return kg <= x[0]; })[0];
      var oz = use === 'sparring' ? r[2] : r[1];
      show('<b class="big">' + oz + '</b><p>' + (use === 'sparring'
        ? 'fürs Sparring bei ' + kg + ' kg. Die meisten Gyms verlangen beim Sparring 16 oz, frag im Zweifel deinen Trainer.'
        : 'für Sandsack und Pratzen bei ' + kg + ' kg. Wenn du später auch Sparring machen willst, nimm direkt 16 oz.') +
        '</p><p><a href="#schnellauswahl">Passende Handschuhe in der Schnellauswahl →</a></p>');
    },
    // Fussballschuhe: Sohle nach Platz
    sole: function (form, show) {
      var map = {
        rasen: ['FG', 'Firm Ground', 'Konische oder längliche Nocken für trockenen bis normalen Naturrasen.', '#schnellauswahl', 'Zur Schnellauswahl'],
        nass: ['SG', 'Soft Ground', 'Längere Stollen, oft zum Schrauben, für nassen und tiefen Rasen. Auf Kunstrasen nicht geeignet.', '#schnellauswahl', 'Zur Schnellauswahl'],
        kunst: ['AG', 'Artificial Ground', 'Viele kurze Nocken, die auf Kunstrasen greifen und Gelenke wie Sohle schonen.', '/fussball/#kunstrasenschuh-ag', 'Kunstrasenschuhe ansehen'],
        beides: ['MG', 'Multi Ground', 'Der Kompromiss für Naturrasen und Kunstrasen, wenn du nur ein Paar willst.', '/fussball/#multi-ground-schuh-mg', 'MG-Schuhe ansehen'],
        hart: ['TF', 'Turf', 'Kurze Gumminoppen für Hartplatz, alten Kunstrasen und Kleinfeld.', '/fussball/#turf-schuh-tf', 'Turf-Schuhe ansehen'],
        halle: ['IN', 'Indoor', 'Flache, helle Sohle, die auf dem Hallenboden greift und keine Streifen macht.', '/fussball/#hallenschuh-in', 'Hallenschuhe ansehen']
      };
      var v = form.platz.value;
      if (!v) return show('<p>Wähle aus, wo du meistens spielst.</p>');
      var r = map[v];
      show('<b class="big">' + r[0] + ' <small style="font-size:0.55em;font-style:normal">(' + r[1] + ')</small></b><p>' + r[2] + '</p><p><a href="' + r[3] + '">' + r[4] + ' →</a></p>');
    },
    // Home-Gym: Ausstattung nach Platz, Budget und Ziel
    homegym: function (form, show) {
      var space = form.platz.value, budget = form.budget.value, goal = form.ziel.value;
      if (!space || !budget || !goal) return show('<p>Wähle Platz, Budget und Ziel, dann siehst du hier einen Vorschlag.</p>');
      var I = {
        matte: ['Trainingsmatte', 'trainingsmatte', 20, 40], baender: ['Widerstandsbänder mit Griffen', 'widerstandsbaender-mit-griffen', 15, 35],
        loop: ['Mini-Bänder', 'mini-baender-loop-bands', 10, 20], stange: ['Klimmzugstange', 'klimmzugstange', 20, 45], seil: ['Springseil', 'springseil', 10, 25],
        rolle: ['Faszienrolle', 'faszienrolle', 15, 40], schlinge: ['Schlingentrainer', 'schlingentrainer', 30, 100], kh: ['Verstellbare Kurzhanteln', 'verstellbare-kurzhanteln', 100, 300],
        kb: ['Kettlebell', 'kettlebell', 25, 60], bank: ['Hantelbank', 'hantelbank', 80, 200], lh: ['Langhantel-Set', 'langhantel-set', 100, 300],
        rack: ['Kniebeugenständer', 'kniebeugenstaender', 80, 250], boden: ['Bodenschutzmatten', 'bodenschutzmatten', 30, 80], gun: ['Massagepistole', 'massagepistole', 50, 150],
        weste: ['Gewichtsweste', 'gewichtsweste', 40, 120]
      };
      var list = ['matte'];
      if (goal === 'kraft') list.push('baender', 'stange');
      if (goal === 'fit') list.push('seil', 'baender');
      if (goal === 'beweglich') list.push('rolle', 'loop');
      if (budget !== '100') {
        if (goal === 'kraft') list.push('kh');
        if (goal === 'fit') list.push('kb', 'schlinge');
        if (goal === 'beweglich') list.push('schlinge');
      }
      if (budget === 'mehr') {
        if (goal === 'kraft') list.push(space === 'gross' ? 'lh' : 'bank');
        if (goal === 'kraft' && space === 'gross') list.push('rack', 'bank', 'boden');
        if (goal === 'fit') list.push('weste', space !== 'klein' ? 'boden' : 'rolle');
        if (goal === 'beweglich') list.push('gun');
      }
      list = list.filter(function (x, i) { return list.indexOf(x) === i; });
      var lo = 0, hi = 0;
      var items = list.map(function (k) { var it = I[k]; lo += it[2]; hi += it[3]; return '<li><a href="/home-gym/#' + it[1] + '">' + it[0] + '</a> <span style="color:var(--muted)">ca. ' + it[2] + '–' + it[3] + ' €</span></li>'; });
      var hint = space === 'klein' ? 'Alles lässt sich nach dem Training in einer Ecke verstauen.' : space === 'mittel' ? 'Mit einem eigenen Zimmer passt auch eine Hantelbank.' : 'Im Keller oder in der Garage lohnt sich ein Bodenschutz, sobald schwere Gewichte dazukommen.';
      show('<b class="big">Dein Start-Set</b><ul>' + items.join('') + '</ul><p>Zusammen ca. ' + lo + '–' + hi + ' € (aus unseren Preisspannen, Stand November 2026). ' + hint + '</p>');
    },
    // Fahrradhelm: Grösse nach Kopfumfang (Beispielwerte wie im Ratgeber)
    helm: function (form, show) {
      var cm = parseFloat(String(form.cm.value).replace(',', '.'));
      if (!cm) return show('<p>Miss deinen Kopfumfang etwa einen Zentimeter über den Augenbrauen und gib ihn hier ein.</p>');
      if (cm < 40 || cm > 70) return show('<p>Bitte einen Kopfumfang zwischen 40 und 70 cm eingeben.</p>');
      var r = cm < 51 ? ['XS oder Kinderhelm', 'Unter 51 cm passen meist Kinder- oder XS-Helme.']
        : cm < 55 ? ['S', 'Typischer Bereich ca. 51–55 cm.']
        : cm === 55 ? ['S oder M', 'Du liegst genau zwischen zwei Grössen. Probier beide an, das Drehrad hilft beim Feineinstellen.']
        : cm < 59 ? ['M', 'Typischer Bereich ca. 55–59 cm.']
        : cm === 59 ? ['M oder L', 'Du liegst genau zwischen zwei Grössen. Probier beide an, das Drehrad hilft beim Feineinstellen.']
        : cm <= 63 ? ['L', 'Typischer Bereich ca. 59–63 cm.']
        : ['XL', 'Über 63 cm bieten einige Hersteller XL-Helme an.'];
      show('<b class="big">Grösse ' + r[0] + '</b><p>' + r[1] + ' Bei ' + cm + ' cm Kopfumfang. Der Helm sitzt richtig, wenn er beim Kopfschütteln nicht wackelt.</p>');
    },
    // Schienbeinschoner: Grösse nach Körpergrösse
    shin: function (form, show) {
      var cm = parseFloat(form.cm.value);
      if (!cm) return show('<p>Gib die Körpergrösse ein.</p>');
      if (cm < 90 || cm > 220) return show('<p>Bitte eine Körpergrösse zwischen 90 und 220 cm eingeben.</p>');
      var s = cm <= 120 ? 'XS' : cm <= 140 ? 'S' : cm <= 160 ? 'M' : cm <= 180 ? 'L' : 'XL';
      show('<b class="big">Grösse ' + s + '</b><p>Typischer Wert bei ' + cm + ' cm. Die Grössen unterscheiden sich je nach Hersteller, schau im Zweifel in dessen Tabelle. Das Schienbein soll möglichst ganz bedeckt sein, ohne dass der Schoner ans Knie oder auf den Fussrücken stösst.</p>');
    }
  };
  $$('form[data-tool]').forEach(function (form) {
    var fn = tools[form.getAttribute('data-tool')];
    var outEl = $('.tool-result', form);
    if (!fn || !outEl) return;
    var show = function (html) { outEl.innerHTML = html; };
    var run = function () { fn(form, show); };
    form.addEventListener('input', run);
    form.addEventListener('change', run);
    form.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    run();
  });

  /* ---------- GearCheck Finder (Startseite) ---------- */
  var finder = $('[data-finder]');
  var finderData = $('#finder-daten');
  if (finder && finderData) {
    // Einträge: [Name, Sprungmarke, Begründung, Preis von, Preis bis, Orte, selbst getestet]
    var F = JSON.parse(finderData.textContent);
    var state = { sport: Object.keys(F)[0], level: 'start', ort: null, budget: 300 };
    var res = $('.finder-result', finder);
    var orteBox = $('[data-finder-orte]', finder), frage = $('[data-finder-frage]', finder);
    var press = function (sel, attr, val) { $$(sel, finder).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute(attr) === String(val) ? 'true' : 'false'); }); };
    var fits = function (it) { return !it[5] || it[5].split(' ').indexOf(state.ort) > -1; };
    // Das Budget bestimmt die Preisklasse: Aus unserer Spanne je Produkt wird der untere, mittlere oder obere Teil genommen.
    var nice = function (v) { return v >= 20 ? Math.round(v / 5) * 5 : Math.round(v); };
    var TIER = {
      100: { name: 'Einstiegsklasse', text: 'Solide Einstiegsmodelle, für den Anfang völlig ausreichend.', band: function (lo, hi) { var m = (lo + hi) / 2; return [lo, nice((lo + m) / 2)]; } },
      300: { name: 'Mittelklasse', text: 'Bessere Verarbeitung, hält auch bei regelmässigem Training länger.', band: function (lo, hi) { var m = (lo + hi) / 2; return [nice((lo + m) / 2), nice((m + hi) / 2)]; } },
      0: { name: 'Obere Preisklasse', text: 'Mehr Komfort und Haltbarkeit, lohnt sich vor allem bei viel Training.', band: function (lo, hi) { return [nice((lo + hi) / 2), hi]; } }
    };
    var bandOf = function (it) { return it[3] ? TIER[state.budget].band(it[3], it[4]) : [0, 0]; };
    var range = function (list) { var lo = 0, hi = 0; list.forEach(function (it) { var b = bandOf(it); lo += b[0]; hi += b[1]; }); return [lo, hi]; };
    var row = function (s, it, note) {
      var b = bandOf(it);
      return '<li><a href="' + esc(s.url + '#' + it[1]) + '"><span><b>' + esc(it[0]) + (it[6] ? ' <em class="fl-tested">✓ getestet</em>' : '') + '</b><small>' + esc(it[2]) +
        (b[1] ? ' · ca. ' + b[0] + '–' + b[1] + ' €' : '') + (note ? ' · <strong>' + esc(note) + '</strong>' : '') + '</small></span></a></li>';
    };
    var drawOrte = function () {
      var s = F[state.sport];
      if (!state.ort || !s.orte.some(function (o) { return o[0] === state.ort; })) state.ort = s.orte[0][0];
      frage.textContent = s.frage;
      orteBox.innerHTML = s.orte.map(function (o) { return '<button type="button" class="chip" data-finder-ort="' + esc(o[0]) + '" aria-pressed="false">' + esc(o[1]) + '</button>'; }).join('');
    };
    var draw = function () {
      var s = F[state.sport];
      var max = state.budget || Infinity;
      var tier = TIER[state.budget];
      var need = s.start.filter(fits);
      // Einsteiger: die drei wichtigsten Ergänzungen kommen in Frage, Fortgeschrittene: alle
      var cand = s.mehr.filter(fits);
      if (state.level === 'start') cand = cand.slice(0, 3);
      // Grundausstattung der Reihe nach, gerechnet mit dem oberen Wert der Preisklasse (lieber etwas Luft lassen)
      var sum = 0, needNow = [], needLater = [];
      need.forEach(function (it) { var c = bandOf(it)[1]; if (sum + c <= max || !needNow.length) { needNow.push(it); sum += c; } else needLater.push(it); });
      // Ergänzungen, solange das Restbudget reicht
      var extraNow = [], extraLater = [];
      cand.forEach(function (it) { var c = bandOf(it)[1]; if (!needLater.length && sum + c <= max) { extraNow.push(it); sum += c; } else extraLater.push(it); });
      var now = needNow.concat(extraNow), r = range(now), rNeed = range(need);
      var ortName = s.orte.filter(function (o) { return o[0] === state.ort; })[0][1];
      var budgetName = state.budget === 100 ? 'bis 100 €' : state.budget === 300 ? '100 bis 300 €' : 'über 300 €';
      var rest = isFinite(max) ? Math.max(0, max - r[1]) : null;
      var html = '<span class="tag">' + esc(s.name) + ' · ' + (state.level === 'start' ? 'Einsteiger' : 'Fortgeschritten') + ' · ' + esc(ortName) + ' · ' + budgetName + '</span>' +
        '<h3>Deine Ausrüstungsliste</h3>' +
        '<p class="fl-sum"><b>' + tier.name + ':</b> ' + tier.text + '<br>' + now.length + ' Teile, zusammen ca. <b>' + r[0] + '–' + r[1] + ' €</b>' +
        (rest !== null ? ', es bleiben etwa ' + rest + ' € Luft.' : '.') + ' <span class="fl-src">Aus unseren Preisspannen.</span></p>' +
        '<h4 class="fl-h">Das brauchst du zuerst</h4><ol class="finder-list">' + needNow.map(function (it) { return row(s, it); }).join('') +
        needLater.map(function (it) { return row(s, it, 'danach, wenn das Budget reicht'); }).join('') + '</ol>';
      if (needLater.length) html += '<p class="fl-warn">Für die komplette Grundausstattung solltest du mit etwa ' + rNeed[0] + '–' + rNeed[1] + ' € rechnen. Starte mit den ersten Teilen der Liste.</p>';
      if (extraNow.length) html += '<h4 class="fl-h">Passt zusätzlich ins Budget</h4><ol class="finder-list">' + extraNow.map(function (it) { return row(s, it); }).join('') + '</ol>';
      if (extraLater.length) html += '<h4 class="fl-h">Später, wenn das Budget es zulässt</h4><ol class="finder-list is-later">' + extraLater.map(function (it) { return row(s, it); }).join('') + '</ol>';
      html += '<div class="fl-fehl"><b>Häufige Fehlkäufe</b><ul>' + s.fehl.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="finder-actions"><a class="btn btn-dark btn-sm" href="' + esc(s.url) + '">Zur kompletten ' + esc(s.name) + '-Ausrüstung</a>' +
        '<button type="button" class="btn btn-sm" data-finder-print>Checkliste drucken</button></div>';
      res.className = 'finder-result cat-' + s.cat;
      res.innerHTML = html;
      press('[data-finder-sport]', 'data-finder-sport', state.sport);
      press('[data-finder-level]', 'data-finder-level', state.level);
      press('[data-finder-ort]', 'data-finder-ort', state.ort);
      press('[data-finder-budget]', 'data-finder-budget', state.budget);
    };
    finder.addEventListener('click', function (e) {
      var b = e.target.closest('[data-finder-sport]');
      if (b) { state.sport = b.getAttribute('data-finder-sport'); drawOrte(); draw(); return; }
      b = e.target.closest('[data-finder-level]');
      if (b) { state.level = b.getAttribute('data-finder-level'); draw(); return; }
      b = e.target.closest('[data-finder-ort]');
      if (b) { state.ort = b.getAttribute('data-finder-ort'); draw(); return; }
      b = e.target.closest('[data-finder-budget]');
      if (b) { state.budget = parseInt(b.getAttribute('data-finder-budget'), 10); draw(); return; }
      if (e.target.closest('[data-finder-print]')) {
        d.body.classList.add('print-finder');
        window.print();
        setTimeout(function () { d.body.classList.remove('print-finder'); }, 500);
      }
    });
    drawOrte();
    draw();
  }

  /* ---------- Saisontipp passend zum Monat ---------- */
  var season = $('[data-season]');
  if (season) {
    var SEASONS = [
      { id: 'winter', months: [11, 12, 1, 2], cat: 'wintersport', art: 'wintersport', tag: 'Saisontipp · Skisaison', title: 'Bereit für die Piste?',
        text: 'Skihelm und Skibrille in der richtigen Grösse, warm angezogen nach dem Zwiebelprinzip und alles für die Skiferien auf einer Liste.',
        links: [['Helm & Brille', '/ratgeber/skihelm-skibrille/'], ['Richtig anziehen', '/ratgeber/skibekleidung-zwiebelprinzip/'], ['Packliste', '/wintersport/']] },
      { id: 'fruehling', months: [3, 4, 5], cat: 'running', art: 'running', tag: 'Saisontipp · Frühling', title: 'Raus an die frische Luft',
        text: 'Die Tage werden länger: der richtige Laufschuh für den Start und alles, was du fürs Radfahren im Frühling brauchst.',
        links: [['Laufschuhe finden', '/ratgeber/laufschuhe-einsteiger/'], ['Fahrradhelm', '/ratgeber/velohelm-kaufen/'], ['Running-Ausrüstung', '/running/']] },
      { id: 'sommer', months: [6, 7, 8], cat: 'schwimmen', art: 'schwimmen', tag: 'Saisontipp · Sommer', title: 'Ab ins Wasser',
        text: 'Hallenbad, Freibad oder See: Welche Schwimmbrille passt und was du fürs Freiwasser brauchst. Dazu Padel und Tennis für warme Abende.',
        links: [['Schwimmbrille finden', '/ratgeber/schwimmbrille-kaufen/'], ['Schwimm-Ausrüstung', '/schwimmen/'], ['Tennis & Padel', '/tennis-padel/']] },
      { id: 'herbst', months: [9, 10], cat: 'fitness', art: 'home-gym', tag: 'Saisontipp · Herbst', title: 'Training nach drinnen holen',
        text: 'Wenn es draussen nass und dunkel wird: ein Home-Gym mit wenig Platz und die richtigen Hallenschuhe für den Winter.',
        links: [['Home-Gym starten', '/ratgeber/home-gym-einsteiger/'], ['Kurzhanteln', '/ratgeber/kurzhanteln-verstellbar/'], ['Fussballschuhe', '/ratgeber/fussballschuhe-sohle/']] }
    ];
    var month = new Date().getMonth() + 1;
    var cur = SEASONS.filter(function (s) { return s.months.indexOf(month) > -1; })[0];
    if (cur && cur.id !== season.getAttribute('data-season')) {
      season.className = 'season cat-' + cur.cat;
      season.setAttribute('data-season', cur.id);
      season.innerHTML = '<div class="season-text"><span class="tag">' + esc(cur.tag) + '</span><h2 class="display">' + esc(cur.title) + '</h2><p>' + esc(cur.text) + '</p><div class="hero-actions">' +
        cur.links.map(function (l, i) { return '<a class="btn ' + (i === 0 ? 'btn-primary' : 'btn-ghost') + '" href="' + l[1] + '">' + esc(l[0]) + '</a>'; }).join('') +
        '</div></div><div class="season-art"><img src="/assets/img/sport/' + cur.art + '.svg" alt="" width="600" height="320" loading="lazy"></div>';
    }
  }

  /* ---------- Filter auf der Ratgeber-Übersicht ---------- */
  var filters = $$('[data-filter]');
  if (filters.length) {
    filters.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-filter');
        filters.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        $$('.guide-section').forEach(function (s) { s.hidden = f !== 'alle' && s.getAttribute('data-cat') !== f; });
      });
    });
  }
})();
