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

  function initAnnouncements() {
    document.querySelectorAll('.announcement-card').forEach((card) => {
      const body = card.querySelector('.announcement-body');
      const toggle = card.querySelector('.announcement-toggle');
      if (!body || !toggle) return;

      const measure = () => {
        if (card.classList.contains('is-expanded')) return;
        card.classList.toggle('is-clamped', body.scrollHeight > body.clientHeight + 1);
      };

      toggle.addEventListener('click', () => {
        const expanded = card.classList.toggle('is-expanded');
        toggle.setAttribute('aria-expanded', String(expanded));
        toggle.textContent = expanded ? 'Show less' : 'Read more';
        if (!expanded) card.scrollIntoView({ block: 'nearest' });
      });

      measure();
      window.addEventListener('resize', measure);
    });
  }

  // Visit counting (Abacus counter API, no account / no cookies).
  // A "visit" is one browser session; page views are counted on every load.
  // Read by admin.html, which is not linked from any page.
  const STATS = {
    api: 'https://abacus.jasoncameron.dev',
    ns: 'trideltaks-org',
    timeZone: 'America/Los_Angeles',
    dateKey(date) {
      // YYYY-MM-DD in Pacific time
      return date.toLocaleDateString('en-CA', { timeZone: STATS.timeZone });
    },
    pageName(pathname) {
      const file = pathname.split('/').pop().replace(/\.html$/, '');
      return file === '' || file === 'index' ? 'home' : file;
    }
  };
  window.TDKS_STATS = STATS;

  function trackVisit() {
    const host = window.location.hostname;
    const isLocal = !host || host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local');
    if (isLocal || navigator.webdriver || document.body.hasAttribute('data-no-track')) return;

    const hit = (key) => fetch(STATS.api + '/hit/' + STATS.ns + '/' + key, { keepalive: true }).catch(() => {});
    const day = STATS.dateKey(new Date());

    hit('views-page-' + STATS.pageName(window.location.pathname));

    let newSession = true;
    try {
      newSession = !sessionStorage.getItem('tdks-visit-counted');
      sessionStorage.setItem('tdks-visit-counted', '1');
    } catch (e) { /* storage blocked: count every load */ }
    if (!newSession) return;

    hit('visits-total');
    hit('visits-d-' + day);
    hit('visits-m-' + day.slice(0, 7));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeaderShadow();
    cleanupIndexUrl();
    setFooterYear();
    initAnnouncements();
    trackVisit();
  });
})();
