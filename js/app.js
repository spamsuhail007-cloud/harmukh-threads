/* ============================================================
   APP — Bootstraps the application
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Sticky navbar scroll handler ---
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Hamburger toggle ---
  const ham = document.getElementById('hamburger');
  const mobNav = document.getElementById('mobile-nav');
  ham.addEventListener('click', () => {
    const isOpen = ham.classList.toggle('open');
    mobNav.classList.toggle('open', isOpen);
    ham.setAttribute('aria-expanded', String(isOpen));
    mobNav.setAttribute('aria-hidden', String(!isOpen));
  });

  // --- Resize: re-route home if crossing 768px ---
  let lastMobile = window.innerWidth < 768;
  window.addEventListener('resize', () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile !== lastMobile) {
      lastMobile = isMobile;
      // If on home, re-render
      const hash = window.location.hash;
      if (!hash || hash === '#/' || hash === '#/home-desktop' || hash === '#/home-mobile') {
        Router.navigate('home');
      }
    }
  });

  // --- Admin route via /admin hash ---
  if (window.location.hash.startsWith('#/admin')) {
    // handled by router
  }

  // --- Cart events ---
  Cart.bindEvents();

  // --- Init router (will render first page) ---
  Router.init();
});
