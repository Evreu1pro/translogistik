// Translogistik München — page interactions
// Nav/header: site-nav.js. This file: route motion, standort map, lead wizard.

(function () {
  // ---- Hero route line (same --route mechanism as index) ----
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function syncRoute() {
    if (reduceMotion) {
      document.documentElement.style.setProperty('--route', 1);
      return;
    }
    const v = Math.min(1, 0.18 + scrollY / 800);
    document.documentElement.style.setProperty('--route', String(v));
  }
  addEventListener('scroll', syncRoute, { passive: true });
  syncRoute();

  // ---- Standort map (same data/behavior as main.js, München default) ----
  // München first — only live Standortseite; other slugs intentionally 404.
  const cities = [
    ['München', 57, 82, 'Ihr direkter Standort — diese Seite.', 4, 1],
    ['Hamburg', 50, 24, 'Standortseite in Vorbereitung.', 4, -2],
    ['Bremen', 44, 31, 'Neueröffnung Spätsommer 2026 · Seite in Vorbereitung.', 4, 1],
    ['Berlin', 69, 32, 'Standortseite in Vorbereitung.', 4, 1],
    ['Paderborn', 40, 46, 'Standortseite in Vorbereitung.', 4, 1],
    ['Günthersdorf', 65, 51, 'Standortseite in Vorbereitung.', 4, 1],
    ['Köln', 30, 52, 'Standortseite in Vorbereitung.', -4, 1],
    ['Langenselbold', 49, 59, 'Standortseite in Vorbereitung.', 4, 1],
    ['Fürth', 51, 71, 'Standortseite in Vorbereitung.', 4, 1],
  ];
  const cityPages = { München: '/translogistik-muenchen' };
  const citySlug = (name) =>
    '/translogistik-' +
    name
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  const cityHref = (name) => cityPages[name] || citySlug(name);

  const list = document.querySelector('#cities');
  const markers = document.querySelector('#markers');
  const nameEl = document.querySelector('#city-name');
  const infoEl = document.querySelector('#city-info');
  const cityLink = document.querySelector('#city-link');
  const search = document.querySelector('#city-search');
  const defaultIndex = cities.findIndex((c) => c[0] === 'München');

  if (list && markers && nameEl && infoEl) {
    list.textContent = ''; // rebuild the server-rendered list with interactive buttons
    cities.forEach((c, i) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = c[0];
      b.dataset.i = String(i);
      b.dataset.city = c[0];
      if (c[0] === 'München') b.classList.add('is-live');
      b.setAttribute('aria-pressed', i === defaultIndex ? 'true' : 'false');
      b.addEventListener('click', () => selectCity(i));
      li.append(b);
      list.append(li);

      const anchor = c[4] < 0 ? 'end' : 'start';
      const labelX = c[4] < 0 ? -2.6 : 2.6;
      const labelY = c[5] < 0 ? -1.4 : 1.6;
      const lx = c[4] < 0 ? labelX + 0.6 : labelX - 0.6;
      markers.insertAdjacentHTML(
        'beforeend',
        `<g class="marker ${i === defaultIndex ? 'on' : ''}" tabindex="0" role="button" aria-label="${c[0]} auswählen" data-i="${i}" transform="translate(${c[1]} ${c[2]})"><circle class="halo" r="1.6"></circle><circle class="dot" r="0.95"></circle><line class="leader" x1="${c[4] < 0 ? -1.5 : 1.5}" y1="0" x2="${lx}" y2="${labelY - 0.5}"></line><text x="${labelX}" y="${labelY}" text-anchor="${anchor}">${c[0]}</text></g>`
      );
    });

    function selectCity(i) {
      [...list.querySelectorAll('button')].forEach((b, j) =>
        b.setAttribute('aria-pressed', j === i ? 'true' : 'false')
      );
      [...markers.children].forEach((m, j) => m.classList.toggle('on', j === i));
      const name = cities[i][0];
      nameEl.textContent = name;
      infoEl.textContent =
        cities[i][3] || 'Bewerbungen und Anfragen: info@translogistik.eu';
      if (cityLink) {
        cityLink.href = cityHref(name);
        cityLink.textContent =
          name === 'München'
            ? 'Sie sind auf der Seite München'
            : 'Standortseite öffnen →';
        cityLink.classList.toggle('btn--red', name === 'München');
        cityLink.classList.toggle('btn--ghost-ink', name !== 'München');
        if (name === 'München') {
          cityLink.setAttribute('aria-current', 'page');
          cityLink.href = '#standorte';
        } else {
          cityLink.removeAttribute('aria-current');
        }
      }
    }

    markers.addEventListener('click', (e) => {
      const m = e.target.closest('.marker');
      if (m) selectCity(+m.dataset.i);
    });
    markers.addEventListener('keydown', (e) => {
      const m = e.target.closest('.marker');
      if (m && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        selectCity(+m.dataset.i);
      }
    });
    if (search) {
      search.addEventListener('input', (e) => {
        const q = e.target.value.trim().toLowerCase();
        const buttons = [...list.querySelectorAll('button')];
        const markerEls = [...markers.children];
        let first = -1;
        buttons.forEach((b, i) => {
          const hit = !q || cities[i][0].toLowerCase().includes(q);
          b.parentElement.hidden = !hit;
          const prev = !!q && hit;
          b.classList.toggle('is-preview', prev);
          if (markerEls[i]) markerEls[i].classList.toggle('is-preview', prev);
          if (prev && first < 0) first = i;
        });
        buttons.forEach((b, i) => b.classList.toggle('is-first-preview', i === first));
      });
    }

    if (search) {
      search.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const q = e.target.value.trim().toLowerCase();
        if (!q) return;
        let idx = cities.findIndex((c) => c[0].toLowerCase() === q);
        if (idx < 0) idx = cities.findIndex((c) => c[0].toLowerCase().startsWith(q));
        if (idx < 0) idx = cities.findIndex((c) => c[0].toLowerCase().includes(q));
        if (idx >= 0) selectCity(idx);
      });
    }

    selectCity(defaultIndex);
  }

  // ---- Lead questionnaire ----
  const form = document.querySelector('#lead-form');
  if (!form) return;

  const questions = [...form.querySelectorAll('.question')];
  const dots = [...form.querySelectorAll('.step-dot')];
  const back = document.querySelector('#back');
  const next = document.querySelector('#next');
  const send = document.querySelector('#send');
  const wizard = document.querySelector('#wizard');
  const confirmation = document.querySelector('#confirmation');
  const reference = document.querySelector('#reference');
  const restart = document.querySelector('#restart');
  let step = 0;

  function paint() {
    questions.forEach((q, i) => q.classList.toggle('active', i === step));
    dots.forEach((d, i) => d.classList.toggle('active', i <= step));
    if (back) back.hidden = step === 0;
    if (next) next.hidden = step === questions.length - 1;
    if (send) send.hidden = step !== questions.length - 1;
  }

  function validStep() {
    const q = questions[step];
    if (!q) return false;
    const radios = q.querySelectorAll('input[type=radio]');
    if (radios.length && !q.querySelector('input[type=radio]:checked')) {
      radios[0].focus();
      return false;
    }
    for (const input of q.querySelectorAll('input[required], textarea[required]')) {
      if (!input.reportValidity()) return false;
    }
    return true;
  }

  if (next) {
    next.addEventListener('click', () => {
      if (validStep()) {
        step++;
        paint();
      }
    });
  }
  if (back) {
    back.addEventListener('click', () => {
      step = Math.max(0, step - 1);
      paint();
    });
  }

  
  function burstConfetti() {
    const box = document.querySelector('#confetti');
    if (!box) return;
    box.innerHTML = '';
    const n = 42;
    for (let i = 0; i < n; i++) {
      const el = document.createElement('i');
      const left = Math.random() * 100;
      const dx = (Math.random() - 0.5) * 160;
      const rot = 120 + Math.random() * 320;
      const delay = Math.random() * 0.25;
      const dur = 1.05 + Math.random() * 0.55;
      el.style.left = left + '%';
      el.style.setProperty('--dx', dx + 'px');
      el.style.setProperty('--rot', rot + 'deg');
      el.style.animationDelay = delay + 's';
      el.style.animationDuration = dur + 's';
      box.appendChild(el);
    }
  }

  const CONTACT_EMAIL = 'info@translogistik.eu';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validStep()) return;

    const data = new FormData(form);
    const subject =
      'Anfrage Standort München — ' +
      (data.get('service') || 'Allgemein') +
      ' (' + (data.get('person') || 'Kontakt') + ')';
    const body = [
      'Wer fragt an: ' + (data.get('person') || '—'),
      'Anliegen: ' + (data.get('service') || '—'),
      'Umfang: ' + (data.get('umfang') || '—'),
      '',
      'Name: ' + (data.get('name') || '—'),
      'Telefon: ' + (data.get('telefon') || '—'),
      'E-Mail: ' + (data.get('email') || '—'),
      '',
      'Nachricht:',
      data.get('nachricht') || '—',
      '',
      'Gesendet über das Kontaktformular der Standortseite München.'
    ].join('\n');
    location.href =
      'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    if (wizard) wizard.classList.add('hidden');
    if (confirmation) {
      confirmation.classList.add('show');
      burstConfetti();
    }
  });

  if (restart) {
    restart.addEventListener('click', () => {
      form.reset();
      step = 0;
      if (wizard) wizard.classList.remove('hidden');
      if (confirmation) confirmation.classList.remove('show');
      const conf = document.querySelector('#confetti');
      if (conf) conf.innerHTML = '';
      paint();
    });
  }

  // Job row → preselect Bewerber in form
  document.querySelectorAll('[data-job]').forEach((a) => {
    a.addEventListener('click', () => {
      const career = [...document.querySelectorAll('input[name=person]')].find(
        (x) => x.value === 'Bewerber'
      );
      if (career) career.checked = true;
      const service = [...document.querySelectorAll('input[name=service]')].find(
        (x) => x.value === 'Karriere'
      );
      if (service) service.checked = true;
    });
  });

  paint();
})();
