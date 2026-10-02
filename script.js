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

// ========== LIVE CHAT CONTROLLER ==========
function toggleLiveChat() {
  const chatWindow = document.getElementById('chat-window');
  const chatIcon = document.getElementById('launcher-chat-icon');
  const closeIcon = document.getElementById('launcher-close-icon');
  const chatBadge = document.querySelector('.chat-launcher-badge');

  if (!chatWindow) return;

  const isActive = chatWindow.classList.toggle('active');

  if (chatIcon && closeIcon) {
    chatIcon.style.display = isActive ? 'none' : 'block';
    closeIcon.style.display = isActive ? 'block' : 'none';
  }

  if (chatBadge) {
    chatBadge.style.opacity = isActive ? '0' : '1';
  }

  if (isActive) {
    const input = document.getElementById('chat-input');
    if (input) setTimeout(() => input.focus(), 250);
    scrollChatBottom();
  }
}

function openLiveChat() {
  const chatWindow = document.getElementById('chat-window');
  if (!chatWindow) return;
  
  if (!chatWindow.classList.contains('active')) {
    toggleLiveChat();
  } else {
    const input = document.getElementById('chat-input');
    if (input) input.focus();
    scrollChatBottom();
  }
}

function closeLiveChat() {
  const chatWindow = document.getElementById('chat-window');
  if (chatWindow && chatWindow.classList.contains('active')) {
    toggleLiveChat();
  }
}

function scrollChatBottom() {
  const body = document.getElementById('chat-body');
  if (body) {
    setTimeout(() => {
      body.scrollTop = body.scrollHeight;
    }, 50);
  }
}

function appendUserMessage(text) {
  const body = document.getElementById('chat-body');
  if (!body) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-message user-msg';
  msgDiv.innerHTML = `
    <div class="msg-bubble">
      <p>${escapeHtml(text)}</p>
    </div>
    <span class="msg-time">Just now</span>
  `;
  body.appendChild(msgDiv);
  scrollChatBottom();
}

function appendBotMessage(htmlContent) {
  const body = document.getElementById('chat-body');
  if (!body) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-message bot-msg';
  msgDiv.innerHTML = `
    <div class="msg-bubble">
      ${htmlContent}
    </div>
    <span class="msg-time">Just now</span>
  `;
  body.appendChild(msgDiv);
  scrollChatBottom();
}

function showTypingIndicator() {
  const body = document.getElementById('chat-body');
  if (!body) return null;

  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message bot-msg typing-msg';
  typingDiv.id = 'chat-typing-indicator';
  typingDiv.innerHTML = `
    <div class="msg-bubble" style="padding: 8px 12px;">
      <div class="typing-dots">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `;
  body.appendChild(typingDiv);
  scrollChatBottom();
  return typingDiv;
}

function removeTypingIndicator() {
  const indicator = document.getElementById('chat-typing-indicator');
  if (indicator) indicator.remove();
}

function handleQuickChip(type) {
  let userText = '';
  let botReply = '';

  switch (type) {
    case 'equipment':
      userText = 'Tell me about Day Plans & Equipment ($75)';
      botReply = `
        <p>🏏 <strong>Software + Full Capturing Setup ($75 / match or daily)</strong></p>
        <p>Includes Analyzer Tier Software, 2 match cameras, cables, analysis laptop, DVR, monitor, and complete live match capturing kit.</p>
        <p>💡 <em>Need a single-side camera setup? We offer custom low-cost options depending on match venue and location.</em></p>
        <p><a href="https://wa.me/94762733698?text=Hi%20Impact%20Play,%20I'm%20interested%20in%20the%20Software%20+%20Camera%20Setup%20($75)%20package" target="_blank" rel="noopener" style="color: #25D366; font-weight: 600; text-decoration: underline;">👉 Reserve via WhatsApp (+94 76 273 3698)</a></p>
      `;
      break;

    case 'software':
      userText = 'Tell me about Software License ($35)';
      botReply = `
        <p>💻 <strong>Analyzer Tier Software Only ($35 / day)</strong></p>
        <p>Instant access to professional ball-by-ball tagging, pitch maps, wagon wheels, bowling line/length analysis, and auto video clipping.</p>
        <p>We also have monthly and yearly tier subscriptions for academies and clubs!</p>
        <p><a href="https://wa.me/94762733698?text=Hi%20Impact%20Play,%20I%20want%20to%20get%20the%20Analyzer%20Tier%20Software%20($35/day)" target="_blank" rel="noopener" style="color: #25D366; font-weight: 600; text-decoration: underline;">👉 Get License on WhatsApp</a></p>
      `;
      break;

    case 'whatsapp':
      userText = 'Connect on WhatsApp';
      botReply = `
        <p>💬 <strong>Chat directly with our specialists:</strong></p>
        <p>We are available 24/7 on WhatsApp for immediate support, inquiries, and demo bookings.</p>
        <p>📞 <strong>+94 76 273 3698</strong></p>
        <p><a href="https://wa.me/94762733698" target="_blank" rel="noopener" style="display:inline-block; padding: 6px 14px; background:#25D366; color:#050d1a; font-weight:bold; border-radius: 20px; text-decoration:none; margin-top:4px;">Open WhatsApp Chat</a></p>
      `;
      break;

    case 'demo':
      userText = 'Book a Free Trial & Demo';
      botReply = `
        <p>🎯 <strong>Free Interactive Walkthrough:</strong></p>
        <p>We will demonstrate live match capture, auto-highlight generation, and player analytics tailored for your club or school team.</p>
        <p><a href="https://wa.me/94762733698?text=Hi%20Impact%20Play,%20I'd%20like%20to%20book%20a%20free%20demo%20and%20trial" target="_blank" rel="noopener" style="color: #25D366; font-weight: 600; text-decoration: underline;">👉 Schedule Demo on WhatsApp (+94 76 273 3698)</a></p>
      `;
      break;

    default:
      userText = type;
      botReply = `<p>Thank you for reaching out! Our team is available directly on WhatsApp at <a href="https://wa.me/94762733698" target="_blank" style="color:#25D366; font-weight:600;">+94 76 273 3698</a>.</p>`;
  }

  appendUserMessage(userText);
  showTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator();
    appendBotMessage(botReply);
  }, 450);
}

function handleChatSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('chat-input');
  if (!input) return;

  const query = input.value.trim();
  if (!query) return;

  appendUserMessage(query);
  input.value = '';

  showTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator();
    const reply = generateSmartReply(query);
    appendBotMessage(reply);
  }, 550);
}

function generateSmartReply(text) {
  const lower = text.toLowerCase();

  if (lower.includes('price') || lower.includes('cost') || lower.includes('usd') || lower.includes('dollar') || lower.includes('rate') || lower.includes('plan')) {
    return `
      <p>💰 <strong>Impact Play Pricing Options:</strong></p>
      <p>• <strong>Software Only:</strong> $35 / match day<br>
         • <strong>Software + Full Capturing Setup:</strong> $75 / day (includes 2 cameras, laptop, DVR, monitor, cables)<br>
         • <em>Single camera setup available at lower rate based on location.</em></p>
      <p><a href="https://wa.me/94762733698?text=Hi,%20I'd%20like%20a%20pricing%20quote" target="_blank" rel="noopener" style="color: #25D366; font-weight: 600; text-decoration: underline;">👉 Get Custom Quote on WhatsApp (+94 76 273 3698)</a></p>
    `;
  }

  if (lower.includes('equipment') || lower.includes('hardware') || lower.includes('camera') || lower.includes('setup') || lower.includes('dvr') || lower.includes('laptop')) {
    return `
      <p>📹 <strong>Complete Hardware Capturing Package:</strong></p>
      <p>We supply high-speed HD broadcast-grade cameras, tripod mounts, long-run video cables, dedicated sports analysis laptop, DVR recording unit, and multi-angle display monitor.</p>
      <p>Available per match for $75. Setup assistance included!</p>
      <p><a href="https://wa.me/94762733698?text=Hi%20Impact%20Play,%20tell%20me%20more%20about%20the%20equipment%20setup" target="_blank" rel="noopener" style="color: #25D366; font-weight: 600; text-decoration: underline;">👉 Inquire Setup on WhatsApp</a></p>
    `;
  }

  if (lower.includes('whatsapp') || lower.includes('phone') || lower.includes('contact') || lower.includes('call') || lower.includes('number')) {
    return `
      <p>📞 <strong>Official Contact Details:</strong></p>
      <p>• <strong>WhatsApp:</strong> <a href="https://wa.me/94762733698" target="_blank" style="color:#25D366; font-weight:600;">+94 76 273 3698</a><br>
         • <strong>Email:</strong> support@impactplay.io<br>
         • <strong>Socials:</strong> @impactplaycricket</p>
      <p>Our analysts and technical team respond within minutes on WhatsApp!</p>
    `;
  }

  if (lower.includes('demo') || lower.includes('trial') || lower.includes('test') || lower.includes('free')) {
    return `
      <p>🎯 <strong>Start Your Free Trial:</strong></p>
      <p>We offer full access trial licenses for teams, clubs, and independent performance analysts.</p>
      <p><a href="https://wa.me/94762733698?text=Hi,%20I'd%20like%20a%20free%20trial%20license" target="_blank" rel="noopener" style="color: #25D366; font-weight: 600; text-decoration: underline;">👉 Request Trial via WhatsApp (+94 76 273 3698)</a></p>
    `;
  }

  return `
    <p>Thank you for your message! 🙏</p>
    <p>Our cricket technology team can answer any specific questions right away. You can also connect directly with our live support engineer on WhatsApp:</p>
    <p><a href="https://wa.me/94762733698?text=Hi%20Impact%20Play,%20I%20have%20a%20question" target="_blank" rel="noopener" style="display:inline-block; padding: 7px 14px; background:#25D366; color:#050d1a; font-weight:700; border-radius: 20px; text-decoration:none; margin-top:4px;">💬 Chat on WhatsApp (+94 76 273 3698)</a></p>
  `;
}

function escapeHtml(string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(string).replace(/[&<>"']/g, s => entityMap[s]);
}

// Expose functions globally for onclick attributes
window.toggleLiveChat = toggleLiveChat;
window.openLiveChat = openLiveChat;
window.closeLiveChat = closeLiveChat;
window.handleQuickChip = handleQuickChip;
window.handleChatSubmit = handleChatSubmit;
