/* =========================================================
   Portfolio interactivity
   ========================================================= */

// ----- Tiny helper -----
const $  = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {

  /* -------- Year in footer -------- */
  $('#year').textContent = new Date().getFullYear();

  /* =========================================================
     LOADER — hide after page is ready
     ========================================================= */
  window.addEventListener('load', () => {
    setTimeout(() => {
      $('#loader')?.classList.add('hidden');
    }, 600);
  });

  /* =========================================================
     CUSTOM CURSOR
     ========================================================= */
  const cursorDot  = $('#cursorDot');
  const cursorRing = $('#cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }
  });

  // Ring trails smoothly behind the dot
  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    if (cursorRing) {
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Enlarge ring on interactive elements
  const hoverSelectors = 'a, button, .project-card, .pillar, .skill-card, .chip, .timeline-item';
  $$(hoverSelectors).forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing?.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing?.classList.remove('hover'));
  });

  /* =========================================================
     MOBILE NAV
     ========================================================= */
  const navToggle = $('#navToggle');
  const navList   = $('#navList');

  navToggle?.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu after clicking a link
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navList?.classList.remove('open');
      navToggle?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  /* =========================================================
     ACTIVE NAV LINK ON SCROLL
     ========================================================= */
  const sections  = $$('section[id]');
  const navLinks  = $$('.nav-link');

  function setActiveNav() {
    const scrollPos = window.scrollY + 200;
    let currentSection = 'home';
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentSection = section.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === currentSection);
    });
  }
  window.addEventListener('scroll', setActiveNav, { passive: true });

  /* =========================================================
     TYPING ANIMATION (rotating hero words)
     ========================================================= */
  const typeTarget = $('.type-target');
  if (typeTarget) {
    const words = typeTarget.dataset.words.split(',');
    let wordIdx = 0, charIdx = 0;
    let isDeleting = false;

    function type() {
      const currentWord = words[wordIdx];
      if (isDeleting) {
        typeTarget.textContent = currentWord.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          wordIdx = (wordIdx + 1) % words.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 40);
      } else {
        typeTarget.textContent = currentWord.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === currentWord.length) {
          isDeleting = true;
          setTimeout(type, 2200); // pause when full word displayed
          return;
        }
        setTimeout(type, 85);
      }
    }
    // start after a short delay so loader is gone
    setTimeout(type, 1200);
  }

  /* =========================================================
     REVEAL ON SCROLL (IntersectionObserver)
     ========================================================= */
  const reveals = $$('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  /* =========================================================
     SKILL BARS — fill when in view
     ========================================================= */
  const skillBars = $$('.bar-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.dataset.fill || 0;
        entry.target.style.width = fill + '%';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  skillBars.forEach(bar => barObserver.observe(bar));

  /* =========================================================
     STATS COUNTER
     ========================================================= */
  const counters = $$('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* =========================================================
     PROJECT FILTER
     ========================================================= */
  const filterBtns   = $$('.filter-btn');
  const projectCards = $$('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const shouldShow = (filter === 'all' || card.dataset.category === filter);
        if (shouldShow) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  /* =========================================================
     CONTACT FORM VALIDATION
     ========================================================= */
  const form = $('#contactForm');
  const success = $('#formSuccess');

  function setError(input, msg) {
    const field = input.closest('.field');
    field.classList.add('error');
    const errorEl = field.querySelector('.field-error');
    if (errorEl) errorEl.textContent = msg;
  }
  function clearError(input) {
    const field = input.closest('.field');
    field.classList.remove('error');
    const errorEl = field.querySelector('.field-error');
    if (errorEl) errorEl.textContent = '';
  }

  // Clear error as user types
  $$('#contactForm input, #contactForm textarea').forEach(input => {
    input.addEventListener('input', () => clearError(input));
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameEl  = $('#cf-name');
    const emailEl = $('#cf-email');
    const msgEl   = $('#cf-msg');

    let valid = true;

    if (!nameEl.value.trim()) { setError(nameEl, 'Please enter your name'); valid = false; }
    if (!emailEl.value.trim()) {
      setError(emailEl, 'Email is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      setError(emailEl, 'Please enter a valid email address');
      valid = false;
    }
    if (!msgEl.value.trim()) { setError(msgEl, 'Please add a message'); valid = false; }
    else if (msgEl.value.trim().length < 10) { setError(msgEl, 'Message is a bit short — at least 10 characters'); valid = false; }

    if (valid) {
      success?.classList.add('show');
      form.reset();
      setTimeout(() => success?.classList.remove('show'), 5000);
    }
  });

  /* =========================================================
     BACK TO TOP
     ========================================================= */
  const backToTop = $('#backToTop');
  window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =========================================================
     PARALLAX on the decorative circles (subtle)
     ========================================================= */
  const decoCircles = $('.deco-circles');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    lastScroll = window.scrollY;
    if (decoCircles) {
      decoCircles.style.transform = `translate(0, ${lastScroll * -0.05}px) rotate(${lastScroll * 0.02}deg)`;
    }
  }, { passive: true });

  /* =========================================================
     Subtle tilt on project cards (mouse-follow)
     ========================================================= */
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-10px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
