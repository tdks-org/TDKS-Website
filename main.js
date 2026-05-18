(() => {
  function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    const headerActions = document.querySelector('.header-actions');

    if (!toggle || !nav) return;

    if (!nav.id) nav.id = 'primary-navigation';
    toggle.setAttribute('aria-controls', nav.id);
    toggle.setAttribute('aria-expanded', 'false');

    const closeMenu = () => {
      nav.classList.remove('open');
      if (headerActions) headerActions.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
      nav.classList.add('open');
      if (headerActions) headerActions.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      const firstLink = nav.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
      if (firstLink) firstLink.focus();
    };

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.contains('open');
      if (isOpen) closeMenu();
      else openMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('open')) return;
      const target = e.target;
      if (target instanceof Node && !nav.contains(target) && !toggle.contains(target)) {
        closeMenu();
      }
    });
  }

  function initHeaderShadow() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const check = () => {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };

    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    check();
  }

  function cleanupIndexUrl() {
    if (!window.location.pathname.endsWith('index.html')) return;
    const clean = window.location.pathname.replace(/index\.html$/, '') + window.location.search + window.location.hash;
    history.replaceState(null, '', clean);
  }

  function setFooterYear() {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeaderShadow();
    cleanupIndexUrl();
    setFooterYear();
  });
})();
