// Shared header navigation for all pages except the index (uses main.js).
// Supports permanently compact headers via data-always-compact on #header.
(function () {
  const header = document.querySelector('#header');
  const menu = document.querySelector('#menu');
  const nav = document.querySelector('#nav');
  if (!header || !menu || !nav) return;

  const alwaysCompact = header.hasAttribute('data-always-compact');
  const closeMenu = () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Menü öffnen');
  };

  if (alwaysCompact) {
    header.classList.add('is-compact');
  } else {
    const syncCompact = () => header.classList.toggle('is-compact', scrollY > 24);
    addEventListener('scroll', syncCompact, { passive: true });
    syncCompact();
  }

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
    if (nav.classList.contains('open') && !nav.contains(e.target) && !menu.contains(e.target)) {
      closeMenu();
    }
  });
})();
