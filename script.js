/* ================================================
   IMPACT PLAY — Cricket Analysis Software
   Main JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ========== NAVBAR SCROLL EFFECT ==========
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });


  // ========== MOBILE MENU ==========
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');
  const navActions = document.querySelector('.nav-actions');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('mobile-open');
      if (navActions) navActions.classList.toggle('mobile-open');
      document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('mobile-open');
        if (navActions) navActions.classList.remove('mobile-open');
        document.body.style.overflow = '';
      });
    });
  }


  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href'); if (!href || href === '#' || href.length <= 1) return; const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });


  // ========== HERO STATS COUNTER ==========
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      el.textContent = current.toLocaleString('en-US');

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Observe hero stats
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNumbers.forEach((el, i) => {
            setTimeout(() => animateCounter(el), i * 200);
          });
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(heroStats);
  }


  // ========== PRICING TOGGLE ==========
  const toggleSwitch = document.getElementById('toggle-switch');
  const toggleLabels = document.querySelectorAll('.toggle-label');
  let isYearly = false;

  if (toggleSwitch) {
    toggleSwitch.addEventListener('click', () => {
      isYearly = !isYearly;
      toggleSwitch.classList.toggle('yearly', isYearly);

      // Update label active states
      toggleLabels.forEach(label => {
        const period = label.getAttribute('data-period');
        if ((period === 'yearly' && isYearly) || (period === 'monthly' && !isYearly)) {
          label.classList.add('active');
        } else {
          label.classList.remove('active');
        }
      });

      // Update prices with animation
      document.querySelectorAll('.price-amount').forEach(el => {
        const monthly = parseInt(el.getAttribute('data-monthly'));
        const yearly = parseInt(el.getAttribute('data-yearly'));
        const value = isYearly ? yearly : monthly;
        const valueEl = el.querySelector('.price-value');
        const periodEl = el.closest('.card-price').querySelector('.price-period');

        // Animate price change
        valueEl.style.transform = 'translateY(-10px)';
        valueEl.style.opacity = '0';

        setTimeout(() => {
          if (value === 0) {
            valueEl.textContent = '0';
            periodEl.textContent = '/ forever';
          } else {
            valueEl.textContent = value.toLocaleString('en-IN');
            periodEl.textContent = isYearly ? '/ month, billed yearly' : '/ month';
          }
          valueEl.style.transform = 'translateY(0)';
          valueEl.style.opacity = '1';
        }, 200);
      });
    });

    // Set initial active label
    toggleLabels.forEach(label => {
      if (label.getAttribute('data-period') === 'monthly') {
        label.classList.add('active');
      }
    });
  }


  // ========== FAQ ACCORDION ==========
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Close all items
      document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });


  // ========== SCROLL ANIMATIONS ==========
  const fadeElements = document.querySelectorAll(
    '.feature-card, .pricing-card, .testimonial-card, .faq-item, .section-header'
  );

  fadeElements.forEach(el => el.classList.add('fade-in'));

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeElements.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    fadeObserver.observe(el);
  });


  // ========== HERO PARTICLES ==========
  const particlesContainer = document.getElementById('hero-particles');

  if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 6}s`;
      particle.style.animationDuration = `${4 + Math.random() * 4}s`;

      const size = 2 + Math.random() * 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Randomize color between teal and sky
      const colors = ['#00d4aa', '#0ea5e9', '#00d4aa', '#38bdf8'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];

      particlesContainer.appendChild(particle);
    }
  }

});
