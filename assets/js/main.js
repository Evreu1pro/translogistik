/**
 * Translogistik — homepage interactions
 * --------------------------------------------------------------------------
 * Zero-build frontend. Modules: header, process filmstrip, DE location map,
 * career day-steps reveal, brand-card accordion.
 * Shared header behaviour on other pages lives in site-nav.js.
 * --------------------------------------------------------------------------
 */

(function () {
  'use strict';

  /* ── Header + mobile nav ─────────────────────────────────────────────── */
  const header = document.querySelector('#header');
  const menu = document.querySelector('#menu');
  const nav = document.querySelector('#nav');

  if (!header || !menu || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Menü öffnen');
  };

  addEventListener(
    'scroll',
    () => {
      header.classList.toggle('is-compact', scrollY > 24);
      // Scroll-linked route stroke intensity on the hero SVG
      document.documentElement.style.setProperty(
        '--route',
        Math.min(1, 0.18 + scrollY / 800)
      );
    },
    { passive: true }
  );

  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  });

  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  addEventListener('click', (e) => {
    if (
      nav.classList.contains('open') &&
      !nav.contains(e.target) &&
      !menu.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* ── Process filmstrip (3-stage carousel) ────────────────────────────── */
  let active = 0;
  const posters = [...document.querySelectorAll('.poster')];
  const tabs = [...document.querySelectorAll('.tab')];
  const process = document.querySelector('.process');
  const progress = document.querySelector('#progress');
  const filmstrip = document.querySelector('#filmstrip');
  const processSection = document.querySelector('#prozess');

  function setStage(i) {
    active = (i + 3) % 3;

    posters.forEach((p, j) => {
      let d = j - active;
      if (d > 1) d -= 3;
      if (d < -1) d += 3;
      p.dataset.pos = d;
      p.setAttribute('aria-current', j === active ? 'step' : 'false');
    });

    tabs.forEach((t, j) => t.setAttribute('aria-selected', j === active));

    if (process) process.style.setProperty('--active', active);
    if (progress) progress.textContent = active + 1;
  }

  tabs.forEach((t, i) => t.addEventListener('click', () => setStage(i)));

  posters.forEach((p, i) => {
    p.addEventListener('click', () => setStage(i));
    p.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setStage(i);
      }
    });
  });

  // Swipe support on touch devices
  if (filmstrip) {
    let startX = 0;
    filmstrip.addEventListener(
      'touchstart',
      (e) => {
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );
    filmstrip.addEventListener(
      'touchend',
      (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) setStage(active + (dx < 0 ? 1 : -1));
      },
      { passive: true }
    );
  }

  setStage(0);

  // Desktop: scroll-scrub stages while the process section is in view
  function syncProcessScroll() {
    if (!processSection) return;
    if (
      matchMedia('(max-width:800px)').matches ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const r = processSection.getBoundingClientRect();
    const travel = Math.max(1, processSection.offsetHeight - innerHeight);
    const passed = Math.min(1, Math.max(0, -r.top / travel));
    const next = Math.min(2, Math.floor(passed * 3));
    if (next !== active) setStage(next);
  }

  addEventListener('scroll', syncProcessScroll, { passive: true });
  syncProcessScroll();

  /* ── Germany map: 9 cities + search ──────────────────────────────────── */
  // [name, x%, y%, note, labelDx, labelDy] — München first (only live site page)
  const cities = [
    ['München', 57, 82, 'Standortseite verfügbar.', 4, 1],
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
  // Only München has a page; other slugs intentionally 404 until built.
  const cityHref = (name) => cityPages[name] || citySlug(name);

  const list = document.querySelector('#cities');
  const markers = document.querySelector('#markers');
  const nameEl = document.querySelector('#city-name');
  const infoEl = document.querySelector('#city-info');
  const cityLink = document.querySelector('#city-link');
  const citySearch = document.querySelector('#city-search');

  if (list && markers && nameEl && infoEl) {
    list.textContent = ''; // rebuild the server-rendered list with interactive buttons
    cities.forEach((c, i) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = c[0];
      btn.dataset.i = i;
      btn.dataset.city = c[0];
      if (c[0] === 'München') btn.classList.add('is-live');
      btn.setAttribute('aria-pressed', i === 0);
      btn.onclick = () => selectCity(i);
      li.append(btn);
      list.append(li);

      const anchor = c[4] < 0 ? 'end' : 'start';
      // Label offset + thin leader (room for larger city names)
      const labelX = c[4] < 0 ? -3.1 : 3.1;
      const labelY = c[5] < 0 ? -1.7 : 1.9;
      const lx = c[4] < 0 ? labelX + 0.7 : labelX - 0.7;
      markers.insertAdjacentHTML(
        'beforeend',
        `<g class="marker ${i === 0 ? 'on' : ''}" tabindex="0" role="button"
            aria-label="${c[0]} auswählen" data-i="${i}"
            transform="translate(${c[1]} ${c[2]})">
          <circle class="halo" r="1.6"></circle>
          <circle class="dot" r="0.95"></circle>
          <line class="leader" x1="${c[4] < 0 ? -1.5 : 1.5}" y1="0"
                x2="${lx}" y2="${labelY - 0.5}"></line>
          <text x="${labelX}" y="${labelY}" text-anchor="${anchor}">${c[0]}</text>
        </g>`
      );
    });

    function selectCity(i) {
      [...list.querySelectorAll('button')].forEach((b, j) =>
        b.setAttribute('aria-pressed', j === i)
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
            ? 'Standort München öffnen →'
            : 'Standortseite öffnen →';
        cityLink.classList.toggle('btn--red', name === 'München');
        cityLink.classList.toggle('btn--ghost-ink', name !== 'München');
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

    if (citySearch) {
      citySearch.addEventListener('input', (e) => {
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

        buttons.forEach((b, i) =>
          b.classList.toggle('is-first-preview', i === first)
        );
      });

      citySearch.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const q = e.target.value.trim().toLowerCase();
        if (!q) return;

        let idx = cities.findIndex((c) => c[0].toLowerCase() === q);
        if (idx < 0)
          idx = cities.findIndex((c) => c[0].toLowerCase().startsWith(q));
        if (idx < 0)
          idx = cities.findIndex((c) => c[0].toLowerCase().includes(q));

        if (idx >= 0) {
          selectCity(idx);
          const b = list.querySelectorAll('button')[idx];
          if (b) b.focus();
        }
      });
    }

    if (cityLink) selectCity(0);
  }

  /* ── Career day-steps: reveal on scroll ──────────────────────────────── */
  const daySteps = [...document.querySelectorAll('.day-step')];
  if (daySteps.length) {
    const dayObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('revealed');
        }),
      { threshold: 0.28 }
    );
    daySteps.forEach((s) => dayObserver.observe(s));
  }

  /* ── Brand cards accordion ───────────────────────────────────────────── */
  document.querySelectorAll('.brand-plus').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.brand-card');
      if (!card) return;

      const open = !card.classList.contains('open');

      document.querySelectorAll('.brand-card.open').forEach((c) => {
        c.classList.remove('open');
        const b = c.querySelector('.brand-plus');
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      card.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
})();
