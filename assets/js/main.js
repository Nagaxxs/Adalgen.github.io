/* Adal Gen — interactions (vanilla ports of 21st.dev components) */

/* =====================================================================
 * НАСТРОЙКА ФОРМЫ «Сообщить о коррупции»
 * FORM_ENDPOINT — адрес приёма заявок (например, Formspree:
 *   'https://formspree.io/f/abcdwxyz'). Пусто ('') — онлайн-отправка
 *   выключена: форма покажет официальные каналы (1424, WhatsApp-бот,
 *   eOtinish) и предложит скопировать текст сообщения.
 * ===================================================================== */
var FORM_ENDPOINT = '';
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function init() {
    document.documentElement.classList.remove('no-js');

    /* header + progress + floating CTA */
    var header = $('.site-header'), prog = $('.progress'), fab = $('.to-report'), rep = $('#report');
    var onScroll = function () {
      var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
      header.classList.toggle('scrolled', y > 10);
      if (prog) prog.style.setProperty('--s', h > 0 ? (y / h).toFixed(4) : 0);
      if (fab && rep) { var r = rep.getBoundingClientRect(); fab.classList.toggle('show', y > innerHeight * 0.9 && (r.top > innerHeight || r.bottom < 0)); }
      timeline();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* mobile menu */
    var burger = $('.burger');
    burger.addEventListener('click', function () {
      var open = header.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });
    $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { header.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && header.classList.contains('menu-open')) { header.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); burger.focus(); } });

    /* stagger + reveal */
    $$('[data-stagger]').forEach(function (g) { $$('[data-reveal]', g).forEach(function (el, i) { if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', i % 6); }); });
    var counted = new WeakSet();
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('in'); io.unobserve(e.target);
          $$('[data-count]', e.target).forEach(count);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      $$('[data-reveal]').forEach(function (el) { io.observe(el); });
    } else { $$('[data-reveal]').forEach(function (el) { el.classList.add('in'); }); }

    /* number ticker (magicui/number-ticker: spring-like ease to value) */
    function count(el) {
      if (counted.has(el) || reduce) return; counted.add(el);
      var to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), t0 = null, dur = 1600;
      var fmt = function (v) { return v.toFixed(dec).replace('.', ','); };
      el.textContent = fmt(0);
      requestAnimationFrame(function step(t) {
        if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
        el.textContent = fmt(to * e); if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(to);
      });
    }

    /* card spotlight: pointer-follow radial gradient */
    $$('.spot, .spot-b').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    /* background beams (aceternity/background-beams) — paths + animated gradients via SMIL */
    var host = $('#beams');
    if (host) {
      var NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 696 316'); svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%'); svg.setAttribute('fill', 'none');
      var defs = document.createElementNS(NS, 'defs'), all = '', n = 50;
      var P = function (i) { var dx = 7 * i, dy = -8 * i;
        return 'M' + (-380 + dx) + ' ' + (-189 + dy) + 'C' + (-380 + dx) + ' ' + (-189 + dy) + ' ' + (-312 + dx) + ' ' + (216 + dy) + ' ' + (152 + dx) + ' ' + (343 + dy) + 'C' + (616 + dx) + ' ' + (470 + dy) + ' ' + (684 + dx) + ' ' + (875 + dy) + ' ' + (684 + dx) + ' ' + (875 + dy); };
      for (var i = 0; i < n; i++) all += P(i);
      var base = document.createElementNS(NS, 'path'); base.setAttribute('d', all); base.setAttribute('stroke', 'rgba(255,255,255,.05)'); base.setAttribute('stroke-width', '0.5'); svg.appendChild(base);
      var lines = reduce ? 0 : 18;
      for (var k = 0; k < lines; k++) {
        var idx = Math.floor(k * n / lines) + 1, id = 'bg' + k, g = document.createElementNS(NS, 'linearGradient');
        g.setAttribute('id', id); g.setAttribute('x1', '0%'); g.setAttribute('x2', '0%'); g.setAttribute('y1', '0%'); g.setAttribute('y2', '0%');
        var dur = (Math.random() * 10 + 10).toFixed(1) + 's', begin = (Math.random() * 10).toFixed(1) + 's';
        [['x1', '0%;100%'], ['x2', '0%;95%'], ['y1', '0%;100%'], ['y2', '0%;' + (93 + Math.random() * 8).toFixed(0) + '%']].forEach(function (a) {
          var an = document.createElementNS(NS, 'animate'); an.setAttribute('attributeName', a[0]); an.setAttribute('values', a[1]);
          an.setAttribute('dur', dur); an.setAttribute('begin', begin); an.setAttribute('repeatCount', 'indefinite'); an.setAttribute('calcMode', 'spline'); an.setAttribute('keySplines', '.42 0 .58 1'); g.appendChild(an);
        });
        [['0', '#2fd6e8', '0'], ['0', '#2fd6e8', '1'], ['32.5%', '#7fe9f4', '1'], ['100%', '#fec50c', '0']].forEach(function (s) {
          var st = document.createElementNS(NS, 'stop'); st.setAttribute('offset', s[0]); st.setAttribute('stop-color', s[1]); st.setAttribute('stop-opacity', s[2]); g.appendChild(st);
        });
        defs.appendChild(g);
        var p = document.createElementNS(NS, 'path'); p.setAttribute('d', P(idx)); p.setAttribute('stroke', 'url(#' + id + ')'); p.setAttribute('stroke-opacity', '0.6'); p.setAttribute('stroke-width', '0.6'); svg.appendChild(p);
      }
      svg.appendChild(defs); host.appendChild(svg);
    }

    /* scenario tabs (ARIA tabs with arrow-key support) */
    var tabs = $$('.scen-tab');
    function select(t, focus) {
      tabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; });
      if (focus) t.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var j = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (e.key === 'Home') j = -i; if (e.key === 'End') j = tabs.length - 1 - i;
        if (j !== undefined) { e.preventDefault(); select(tabs[(i + j + tabs.length) % tabs.length], true); }
      });
    });

    /* timeline scroll beam (aceternity/timeline) */
    var tl = $('#tl'), tlLine = tl && $('.tl-line i', tl), items = tl ? $$('.tl-item', tl) : [];
    function timeline() {
      if (!tl) return;
      var r = tl.getBoundingClientRect(), vh = innerHeight;
      var p = Math.max(0, Math.min(1, (vh * 0.55 - r.top) / r.height));
      tlLine.style.height = (p * 100).toFixed(2) + '%';
      items.forEach(function (it) { it.classList.toggle('on', it.getBoundingClientRect().top < vh * 0.55); });
    }

    /* video facades → YouTube iframe on click */
    $$('.vplay').forEach(function (b) {
      b.addEventListener('click', function () {
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.yt + '?autoplay=1&rel=0';
        f.title = b.dataset.title || 'YouTube video';
        f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        f.allowFullscreen = true; f.referrerPolicy = 'strict-origin-when-cross-origin';
        b.replaceWith(f); f.focus();
      });
    });

    /* FAQ: only one open at a time */
    $$('.faq details').forEach(function (d) { d.addEventListener('toggle', function () { if (d.open) $$('.faq details').forEach(function (o) { if (o !== d) o.open = false; }); }); });

    /* report form */
    var form = $('#reportForm');
    if (form) {
      var card = form.parentElement, anon = $('#anon'), who = $('#whoFields'), desc = $('#f-desc'), cnt = $('#cnt'), errBox = $('.form-error', form), btn = $('button[type=submit]', form);
      var btnLabel = btn.firstChild.textContent;
      var syncAnon = function () { who.hidden = anon.checked; if (anon.checked) { $('#f-name').value = ''; $('#f-contact').value = ''; $('#fld-contact').classList.remove('invalid'); } };
      anon.addEventListener('change', syncAnon); syncAnon();
      desc.addEventListener('input', function () { cnt.textContent = desc.value.length; });
      var dateIn = $('#f-date'); if (dateIn) dateIn.max = new Date().toISOString().slice(0, 10);
      var rules = [
        ['#fld-region', function () { return $('#f-region').value; }],
        ['#fld-category', function () { return $('#f-category').value; }],
        ['#fld-desc', function () { return desc.value.trim().length >= 30; }],
        ['#fld-contact', function () { if (anon.checked) return true; var v = $('#f-contact').value.trim(); return /^\+?[\d\s()\-]{10,}$/.test(v) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }]
      ];
      var validate = function () {
        var first = null;
        rules.forEach(function (r) { var ok = !!r[1](), f = $(r[0]); f.classList.toggle('invalid', !ok); var inp = $('input,select,textarea', f); inp.setAttribute('aria-invalid', !ok); if (!ok && !first) first = inp; });
        var c = $('#f-consent'), cOk = c.checked; $('#chk-consent').classList.toggle('invalid', !cOk); if (!cOk && !first) first = c;
        return first;
      };
      $$('input,select,textarea', form).forEach(function (el) { el.addEventListener('change', function () { if (form.dataset.tried) validate(); }); });

      var collect = function () {
        var v = function (id) { return ($(id).value || '').trim(); };
        return {
          anonymous: anon.checked ? 'да' : 'нет',
          name: anon.checked ? '' : v('#f-name'), contact: anon.checked ? '' : v('#f-contact'),
          region: v('#f-region'), city: v('#f-city'), category: v('#f-category'),
          description: v('#f-desc'), date: v('#f-date'), place: v('#f-place'),
          consent: 'да', submitted_at: new Date().toISOString(), _subject: 'Adal Gen: сообщение о коррупции'
        };
      };
      var asText = function (d) {
        var L = ['СООБЩЕНИЕ О КОРРУПЦИИ', '', 'Регион: ' + d.region + (d.city ? ', ' + d.city : ''), 'Сфера: ' + d.category];
        if (d.date) L.push('Дата: ' + d.date.split('-').reverse().join('.'));
        if (d.place) L.push('Место: ' + d.place);
        L.push('', 'Что произошло:', d.description);
        if (d.anonymous === 'нет' && (d.name || d.contact)) L.push('', 'Контакт: ' + [d.name, d.contact].filter(Boolean).join(', '));
        return L.join('\n');
      };
      var showState = function (cls, focusSel) {
        card.classList.remove('sent', 'unsent'); card.classList.add(cls);
        var h = $(focusSel, card); h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true });
        window.scrollTo({ top: card.getBoundingClientRect().top + window.scrollY - 90, behavior: reduce ? 'auto' : 'smooth' });
      };
      var showUnsent = function (d, failed) {
        $('#nosendTitle').textContent = failed ? 'Не удалось отправить сообщение' : 'Онлайн-отправка пока не подключена';
        $('#nosendText').textContent = failed
          ? 'Похоже, нет соединения или сервис приёма недоступен. Сообщение не отправлено. Передай его в официальные каналы — там им займутся по закону:'
          : 'Твоё сообщение никуда не отправлено и нигде не сохранено. Передай его в официальные каналы — там им займутся по закону:';
        $('#reportText').value = asText(d); $('#copyStatus').textContent = '';
        showState('unsent', '#nosendTitle');
      };

      form.addEventListener('submit', function (e) {
        e.preventDefault(); form.dataset.tried = 1; errBox.hidden = true;
        if (form.website && form.website.value) return; // honeypot
        var bad = validate(); if (bad) { bad.focus(); errBox.textContent = 'Проверь отмеченные поля.'; errBox.hidden = false; return; }
        var d = collect();
        if (!FORM_ENDPOINT) { showUnsent(d, false); return; }
        btn.disabled = true; btn.firstChild.textContent = 'Отправляем… ';
        fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(d) })
          .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); showState('sent', '.thanks h3'); })
          .catch(function () { showUnsent(d, true); })
          .then(function () { btn.disabled = false; btn.firstChild.textContent = btnLabel; });
      });

      $('#copyReport').addEventListener('click', function () {
        var ta = $('#reportText'), st = $('#copyStatus');
        var ok = function () { st.textContent = 'Скопировано ✓'; }, manual = function () { ta.focus(); ta.select(); st.textContent = 'Выделено — нажми Ctrl+C / «Копировать»'; };
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(ta.value).then(ok, function () { try { ta.select(); document.execCommand('copy') ? ok() : manual(); } catch (x) { manual(); } });
        else { try { ta.focus(); ta.select(); document.execCommand('copy') ? ok() : manual(); } catch (x) { manual(); } }
      });
      $$('.js-back', card).forEach(function (b) { b.addEventListener('click', function () { card.classList.remove('unsent'); $('#f-desc').focus(); }); });
      $$('.js-again', card).forEach(function (b) { b.addEventListener('click', function () { form.reset(); syncAnon(); cnt.textContent = '0'; delete form.dataset.tried; card.classList.remove('sent', 'unsent'); $('#f-region').focus(); }); });
    }

    onScroll();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
