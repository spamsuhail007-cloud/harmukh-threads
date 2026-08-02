/* ============================================================
   ROUTER — Hash-based SPA navigation with fade transitions
   ============================================================ */

const Router = (() => {
  let currentPage = null;
  const pages = {};

  function register(name, renderFn) {
    pages[name] = renderFn;
  }

  function navigate(page, params = {}, pushState = true) {
    // Determine if mobile or desktop for home page
    if (page === 'home') {
      page = window.innerWidth < 768 ? 'home-mobile' : 'home-desktop';
    }

    if (currentPage === page && !params.force) return;
    currentPage = page;

    // Update URL hash
    if (pushState) {
      const hash = page === 'home-desktop' || page === 'home-mobile' ? '#/' : `#/${page}`;
      window.history.pushState({ page, params }, '', hash);
    }

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(el => {
      el.classList.remove('active');
      const elPage = el.dataset.page;
      if (elPage === page || (elPage === 'home' && (page === 'home-desktop' || page === 'home-mobile'))) {
        el.classList.add('active');
      }
    });

    // Hide admin navbar on admin page, show otherwise
    const navbar = document.getElementById('navbar');
    if (page === 'admin') {
      navbar.style.display = '';
    } else {
      navbar.style.display = '';
    }

    render(page, params);
  }

  function render(page, params) {
    const root = document.getElementById('page-root');
    const fn = pages[page];
    if (!fn) {
      root.innerHTML = `<div class="container" style="padding:80px 0;text-align:center"><h2>Page not found</h2></div>`;
      return;
    }
    root.innerHTML = '';
    const el = fn(params);
    if (el) {
      root.appendChild(el);
      // Trigger animation
      requestAnimationFrame(() => {
        el.classList.add('page-enter');
      });
    }
    root.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function init() {
    // Handle nav link clicks
    document.addEventListener('click', e => {
      const link = e.target.closest('[data-page]');
      if (link) {
        e.preventDefault();
        const page = link.dataset.page;
        navigate(page);
        // Close mobile menu
        closeMobileMenu();
      }
      const logoLink = e.target.closest('#logo-link');
      if (logoLink) {
        e.preventDefault();
        navigate('home');
        closeMobileMenu();
      }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', e => {
      if (e.state) {
        render(e.state.page, e.state.params || {});
        currentPage = e.state.page;
      } else {
        navigate('home', {}, false);
      }
    });

    // Handle hash on load
    const hash = window.location.hash;
    if (hash.startsWith('#/admin')) {
      navigate('admin', {}, false);
    } else {
      navigate('home', {}, false);
    }
  }

  function closeMobileMenu() {
    const mob = document.getElementById('mobile-nav');
    const ham = document.getElementById('hamburger');
    mob.classList.remove('open');
    ham.classList.remove('open');
    ham.setAttribute('aria-expanded', 'false');
    mob.setAttribute('aria-hidden', 'true');
  }

  return { register, navigate, init };
})();
