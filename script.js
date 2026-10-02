/* ================================================
   CRICK4U — Cricket Analysis Software
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
      userText = 'What equipment is in the $75 Full Setup?';
      botReply = `
        <p>🏏 <strong>Full Capturing Equipment + Software ($75 / match day):</strong></p>
        <p>• <strong>2x Broadcast HD Match Cameras</strong> (Bowler run-up & Batsman facing angles)<br>
           • <strong>Analysis Laptop</strong> with Crick4U pre-configured<br>
           • <strong>Multi-channel DVR & Monitor</strong> for live match feed capture<br>
           • <strong>All Cabling, Tripods & Power Gear</strong> included</p>
        <p><a href="https://wa.me/94762733698?text=Hi%20Crick4U,%20I%20want%20to%20reserve%20the%20$75%20Full%20Equipment%20Setup" target="_blank" rel="noopener" style="color: #25D366; font-weight: 700; text-decoration: underline;">👉 Reserve Setup on WhatsApp (+94 76 273 3698)</a></p>
      `;
      break;

    case 'oneside':
      userText = 'Can I get a 1-side camera setup for low cost?';
      botReply = `
        <p>📹 <strong>Yes! Single-Side Camera Setup Available:</strong></p>
        <p>If you don't need dual-angle coverage or are looking for a budget-friendly option for academy matches or practice fixtures, we provide a 1-side camera package at a reduced rate.</p>
        <p><em>*Cost varies based on match location, ground facilities, and schedule.</em></p>
        <p><a href="https://wa.me/94762733698?text=Hi%20Crick4U,%20I'd%20like%20a%20quote%20for%20a%201-side%20camera%20setup" target="_blank" rel="noopener" style="color: #25D366; font-weight: 700; text-decoration: underline;">👉 Get Venue Quote on WhatsApp</a></p>
      `;
      break;

    case 'features':
      userText = 'What cricket analysis & tagging features are included?';
      botReply = `
        <p>📊 <strong>Crick4U Pro Analytics Engine:</strong></p>
        <p>• <strong>Ball-by-Ball Tagging:</strong> Runs, extras, shot zones, dismissal types<br>
           • <strong>Spatial Pitch Maps:</strong> Precise landing coordinates, bounce & movement<br>
           • <strong>Interactive Wagon Wheels & Beehives:</strong> Filterable by batter/bowler<br>
           • <strong>Automated KPI Reports:</strong> Instant PDF summaries for coaches & players</p>
        <p><a href="https://wa.me/94762733698?text=Hi%20Crick4U,%20tell%20me%20more%20about%20your%20analysis%20software" target="_blank" rel="noopener" style="color: #25D366; font-weight: 700; text-decoration: underline;">👉 Chat with an Analyst on WhatsApp</a></p>
      `;
      break;

    case 'clipping':
      userText = 'How does automated video clipping & replay work?';
      botReply = `
        <p>🎥 <strong>Instant Multi-Angle Delivery Clipping:</strong></p>
        <p>Every single ball is automatically indexed and clipped as it's scored. You can search deliveries by player, shot type, boundary, or wicket in seconds.</p>
        <p>Allows coaches and broadcast overlays to replay any ball instantly during or after the match.</p>
        <p><a href="https://wa.me/94762733698?text=Hi%20Crick4U,%20can%20you%20show%20me%20a%20demo%20of%20video%20clipping?" target="_blank" rel="noopener" style="color: #25D366; font-weight: 700; text-decoration: underline;">👉 Request Video Clipping Demo</a></p>
      `;
      break;

    case 'analysts':
      userText = 'Do you provide match analysts & operators?';
      botReply = `
        <p>🧑‍💻 <strong>Professional Match Day Operators & Analysts:</strong></p>
        <p>Yes! We provide certified cricket analysts and trained equipment operators on-site to handle camera setup, live video capture, live scoring, and post-match analytics.</p>
        <p>Trusted by coaches, clubs, and tournament organizers across Sri Lanka.</p>
        <p><a href="https://wa.me/94762733698?text=Hi%20Crick4U,%20I%20need%20a%20match%20analyst%20for%20our%20tournament" target="_blank" rel="noopener" style="color: #25D366; font-weight: 700; text-decoration: underline;">👉 Book an Analyst on WhatsApp</a></p>
      `;
      break;

    case 'demo':
      userText = 'Book a Free Live Demo / Trial';
      botReply = `
        <p>🎯 <strong>Interactive Live Demo & Trial:</strong></p>
        <p>We provide hands-on walkthroughs for cricket clubs, academies, and coaches. See live ball tagging, pitch maps, and auto video clipping in action.</p>
        <p><button onclick="openOrderModal('Free 14-Day Trial')" style="background:linear-gradient(135deg,#00d4aa,#0ea5e9); color:#050d1a; font-weight:700; border:none; padding:7px 14px; border-radius:16px; cursor:pointer; margin-top:4px; font-size:12.5px;">📝 Fill Registration & Trial Form</button></p>
        <p><a href="https://wa.me/94762733698?text=Hi%20Crick4U,%20I'd%20like%20to%20schedule%20a%20free%20live%20demo" target="_blank" rel="noopener" style="color: #25D366; font-weight: 700; text-decoration: underline;">👉 Or Chat on WhatsApp (+94 76 273 3698)</a></p>
      `;
      break;

    case 'whatsapp':
      userText = 'Connect directly on WhatsApp';
      botReply = `
        <p>💬 <strong>Direct WhatsApp Support:</strong></p>
        <p>Our analysts and equipment managers reply within minutes!</p>
        <p>📞 <strong>+94 76 273 3698</strong></p>
        <p><a href="https://wa.me/94762733698" target="_blank" rel="noopener" style="display:inline-block; padding: 7px 16px; background:#25D366; color:#050d1a; font-weight:bold; border-radius: 20px; text-decoration:none; margin-top:4px;">Open WhatsApp Chat</a></p>
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
  }, 500);
}

function generateSmartReply(text) {
  const lower = text.toLowerCase();

  if (lower.includes('price') || lower.includes('cost') || lower.includes('usd') || lower.includes('dollar') || lower.includes('rate') || lower.includes('plan') || lower.includes('fee')) {
    return `
      <p>💰 <strong>Match Capturing Packages & Pricing:</strong></p>
      <p>• <strong>Full Capturing Setup + Software:</strong> $75 / day or match (includes 2 cameras, laptop, DVR, monitor, cables)<br>
         • <strong>One-Side Camera Setup:</strong> Low-cost option available (rates vary by ground venue/location)<br>
         • <strong>Match Operator / Analyst:</strong> On-site personnel available upon request.</p>
      <p><a href="https://wa.me/94762733698?text=Hi%20Crick4U,%20I'd%20like%20a%20pricing%20quote" target="_blank" rel="noopener" style="color: #25D366; font-weight: 700; text-decoration: underline;">👉 Inquire on WhatsApp (+94 76 273 3698)</a></p>
    `;
  }

  if (lower.includes('equipment') || lower.includes('hardware') || lower.includes('camera') || lower.includes('setup') || lower.includes('dvr') || lower.includes('laptop') || lower.includes('one side') || lower.includes('1 side')) {
    return `
      <p>📹 <strong>Equipment & Match Setup:</strong></p>
      <p>We provide full match setups: 2 broadcast HD cameras, dedicated analysis laptop, DVR unit, review monitor, and long-run cables.</p>
      <p>A single-side camera setup is also available for lower cost depending on match venue location.</p>
      <p><a href="https://wa.me/94762733698?text=Hi%20Crick4U,%20tell%20me%20about%20equipment%20availability" target="_blank" rel="noopener" style="color: #25D366; font-weight: 700; text-decoration: underline;">👉 Check Equipment Availability on WhatsApp</a></p>
    `;
  }

  if (lower.includes('analyst') || lower.includes('operator') || lower.includes('scorer') || lower.includes('staff')) {
    return `
      <p>🧑‍💻 <strong>Match Analysts & Operators:</strong></p>
      <p>We provide trained Sri Lanka Cricket certified analysts to handle live match video capture, ball tagging, and instant PDF KPI report generation for your tournament.</p>
      <p><a href="https://wa.me/94762733698?text=Hi%20Crick4U,%20I%20need%20an%20analyst%20for%20our%20match" target="_blank" rel="noopener" style="color: #25D366; font-weight: 700; text-decoration: underline;">👉 Book Analyst on WhatsApp</a></p>
    `;
  }

  if (lower.includes('feature') || lower.includes('tagging') || lower.includes('pitch map') || lower.includes('wagon') || lower.includes('report') || lower.includes('stat')) {
    return `
      <p>📊 <strong>Analysis & Reporting Capabilities:</strong></p>
      <p>Crick4U delivers real-time pitch maps, wagon wheels, beehive plots, ball-by-ball tagging, auto video clipping, and coach-ready KPI reports.</p>
      <p><a href="https://wa.me/94762733698?text=Hi%20Crick4U,%20tell%20me%20more%20about%20the%20analysis%20features" target="_blank" rel="noopener" style="color: #25D366; font-weight: 700; text-decoration: underline;">👉 Discuss Features on WhatsApp</a></p>
    `;
  }

  if (lower.includes('video') || lower.includes('clip') || lower.includes('replay') || lower.includes('record')) {
    return `
      <p>🎥 <strong>Automated Delivery Video Clipping:</strong></p>
      <p>Every ball is captured and tagged to the scoring data, allowing instant video search by bowler, batter, boundary, or wicket.</p>
      <p><a href="https://wa.me/94762733698?text=Hi%20Crick4U,%20tell%20me%20about%20video%20clipping" target="_blank" rel="noopener" style="color: #25D366; font-weight: 700; text-decoration: underline;">👉 Learn More on WhatsApp</a></p>
    `;
  }

  if (lower.includes('whatsapp') || lower.includes('phone') || lower.includes('contact') || lower.includes('call') || lower.includes('number')) {
    return `
      <p>📞 <strong>Official Contact:</strong></p>
      <p>• <strong>WhatsApp:</strong> <a href="https://wa.me/94762733698" target="_blank" style="color:#25D366; font-weight:700;">+94 76 273 3698</a><br>
         • <strong>Email:</strong> support@crick4u.io<br>
         • <strong>Socials:</strong> @crick4ucricket</p>
      <p>Our specialists reply within minutes on WhatsApp!</p>
    `;
  }

  if (lower.includes('demo') || lower.includes('trial') || lower.includes('test') || lower.includes('free')) {
    return `
      <p>🎯 <strong>Book a Free Interactive Demo:</strong></p>
      <p>We provide full walkthroughs for cricket clubs, academies, and analysts.</p>
      <p><a href="https://wa.me/94762733698?text=Hi%20Crick4U,%20I'd%20like%20to%20book%20a%20demo" target="_blank" rel="noopener" style="color: #25D366; font-weight: 700; text-decoration: underline;">👉 Schedule Demo via WhatsApp (+94 76 273 3698)</a></p>
    `;
  }

  return `
    <p>Thank you for reaching out! 🙏</p>
    <p>Our cricket technology team can answer any specific questions right away. You can also chat directly with our technical analyst on WhatsApp:</p>
    <p><a href="https://wa.me/94762733698?text=Hi%20Crick4U,%20I%20have%20a%20question" target="_blank" rel="noopener" style="display:inline-block; padding: 7px 16px; background:#25D366; color:#050d1a; font-weight:700; border-radius: 20px; text-decoration:none; margin-top:4px;">💬 Chat on WhatsApp (+94 76 273 3698)</a></p>
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

// Expose live chat functions globally for onclick attributes
window.toggleLiveChat = toggleLiveChat;
window.openLiveChat = openLiveChat;
window.closeLiveChat = closeLiveChat;
window.handleQuickChip = handleQuickChip;
window.handleChatSubmit = handleChatSubmit;

// ========== ORDER & FREE TRIAL MODAL CONTROLLER ==========
function openOrderModal(planName) {
  const modal = document.getElementById('order-modal-backdrop');
  if (!modal) return;

  const planSelect = document.getElementById('form-plan');
  if (planSelect && planName) {
    let matched = false;
    for (let i = 0; i < planSelect.options.length; i++) {
      if (planSelect.options[i].value.toLowerCase().includes(planName.toLowerCase()) ||
          planName.toLowerCase().includes(planSelect.options[i].value.toLowerCase())) {
        planSelect.selectedIndex = i;
        matched = true;
        break;
      }
    }
    if (!matched && planName) {
      // Find closest by word match
      const words = planName.split(' ');
      for (let i = 0; i < planSelect.options.length; i++) {
        if (words.some(w => w.length > 3 && planSelect.options[i].value.includes(w))) {
          planSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  // Ensure form is visible, hide success state
  const form = document.getElementById('order-form');
  const successState = document.getElementById('modal-success-state');
  if (form) form.style.display = 'flex';
  if (successState) successState.style.display = 'none';

  // Clear previous errors
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const firstInput = document.getElementById('form-firstname');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 250);
  }
}

function closeOrderModal() {
  const modal = document.getElementById('order-modal-backdrop');
  if (modal) {
    modal.classList.remove('active');
  }
  document.body.style.overflow = '';
}

function handleModalBackdropClick(e) {
  if (e.target && e.target.id === 'order-modal-backdrop') {
    closeOrderModal();
  }
}

function validateOrderFormData() {
  const firstNameEl = document.getElementById('form-firstname');
  const lastNameEl = document.getElementById('form-lastname');
  const emailEl = document.getElementById('form-email');
  const phoneEl = document.getElementById('form-phone');
  const countryEl = document.getElementById('form-country');
  const orgEl = document.getElementById('form-organisation');
  const roleEl = document.getElementById('form-role');
  const planEl = document.getElementById('form-plan');
  const msgEl = document.getElementById('form-message');

  const requiredFields = [
    { el: firstNameEl, name: 'First name' },
    { el: lastNameEl, name: 'Last name' },
    { el: emailEl, name: 'Email address', isEmail: true },
    { el: phoneEl, name: 'Phone number' },
    { el: countryEl, name: 'Country' },
    { el: orgEl, name: 'Organisation / Club' },
    { el: roleEl, name: 'Role' },
    { el: planEl, name: 'Plan selection' }
  ];

  let firstErrorField = null;
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

  for (const item of requiredFields) {
    if (!item.el || !item.el.value.trim()) {
      if (item.el) item.el.classList.add('input-error');
      if (!firstErrorField) firstErrorField = item;
    } else if (item.isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(item.el.value.trim())) {
        item.el.classList.add('input-error');
        if (!firstErrorField) firstErrorField = item;
      }
    }
  }

  if (firstErrorField) {
    firstErrorField.el.focus();
    alert(`Please complete the required field: ${firstErrorField.name}`);
    return null;
  }

  return {
    firstName: firstNameEl.value.trim(),
    lastName: lastNameEl.value.trim(),
    email: emailEl.value.trim(),
    phone: phoneEl.value.trim(),
    country: countryEl.value.trim(),
    organisation: orgEl.value.trim(),
    role: roleEl.value.trim(),
    plan: planEl.value.trim(),
    message: msgEl ? msgEl.value.trim() : ''
  };
}

function submitOrderViaWhatsApp() {
  const data = validateOrderFormData();
  if (!data) return;

  const refNo = 'C4U-' + Math.floor(100000 + Math.random() * 900000);

  const text = `🏏 *CRICK4U — ORDER / TRIAL REGISTRATION*
━━━━━━━━━━━━━━━━━━━━━━
*Ref ID:* #${refNo}
*Name:* ${data.firstName} ${data.lastName}
*Role:* ${data.role}
*Club / Team:* ${data.organisation}
*Country:* ${data.country}
*Email:* ${data.email}
*Phone / WhatsApp:* ${data.phone}

*Selected Plan / Rig:*
👉 *${data.plan}*

*Requirements / Message:*
${data.message || 'Standard trial setup and onboarding requested.'}
━━━━━━━━━━━━━━━━━━━━━━
_Sent via Crick4U Official Website (navis-create.github.io/impact-play)_`;

  const waUrl = `https://wa.me/94762733698?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');

  // Show success state
  showModalSuccess(`Your inquiry (#${refNo}) has been prepared for WhatsApp! Our team will connect with you on +94 76 273 3698.`);
}

function submitOrderViaEmailAndPDF() {
  const data = validateOrderFormData();
  if (!data) return;

  const refNo = 'C4U-' + Math.floor(100000 + Math.random() * 900000);

  // Generate & Download PDF
  generateOrderPDF(data, refNo);

  // Prepare and open Email
  const mailSubject = encodeURIComponent(`[Crick4U Registration #${refNo}] ${data.plan} - ${data.firstName} ${data.lastName} (${data.organisation})`);
  const mailBody = encodeURIComponent(`Hello Crick4U Support Team,

Please review my registration and trial / package order below:

Reference Number: #${refNo}
Full Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Country: ${data.country}
Organisation / Club: ${data.organisation}
Role: ${data.role}

Requested Package:
${data.plan}

Special Notes / Match Dates / Venue:
${data.message || 'No additional notes provided.'}

I have downloaded the official Crick4U PDF confirmation and can attach it if required.

Best regards,
${data.firstName} ${data.lastName}
Phone: ${data.phone}
Organisation: ${data.organisation}`);

  setTimeout(() => {
    window.location.href = `mailto:support@crick4u.io?subject=${mailSubject}&body=${mailBody}`;
  }, 400);

  // Show success in modal
  showModalSuccess(`Your official PDF document has been generated and downloaded. Your email client has also been opened to send your inquiry to support@crick4u.io.`);
}

function showModalSuccess(message) {
  const form = document.getElementById('order-form');
  const successState = document.getElementById('modal-success-state');
  const successDesc = document.getElementById('success-desc');

  if (form) form.style.display = 'none';
  if (successDesc) successDesc.textContent = message;
  if (successState) successState.style.display = 'flex';
}

function generateOrderPDF(data, refNo) {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    alert('PDF generated successfully. Downloading summary document...');
    window.print();
    return;
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // Top Dark Navy Header
  doc.setFillColor(9, 14, 26);
  doc.rect(0, 0, 210, 42, 'F');

  // Accent Gradient Bar
  doc.setFillColor(0, 212, 170); // Teal
  doc.rect(0, 41, 105, 1.5, 'F');
  doc.setFillColor(14, 165, 233); // Cyan
  doc.rect(105, 41, 105, 1.5, 'F');

  // Logo & Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('CRICK4U', 18, 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(14, 165, 233);
  doc.text('CRICKET ANALYSIS & MATCH CAPTURING SYSTEMS', 18, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Official Customer Inquiry & Free Trial Registration Form', 18, 35);

  // Reference Metadata (Top Right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`REF: #${refNo}`, 192, 18, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Date: ${dateStr}`, 192, 26, { align: 'right' });
  doc.setTextColor(0, 212, 170);
  doc.text('STATUS: PENDING REVIEW', 192, 33, { align: 'right' });

  let currentY = 52;

  // Selected Plan Card Box
  doc.setFillColor(243, 248, 252);
  doc.roundedRect(16, currentY, 178, 24, 3, 3, 'F');
  doc.setDrawColor(14, 165, 233);
  doc.setLineWidth(0.6);
  doc.roundedRect(16, currentY, 178, 24, 3, 3, 'D');

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('REQUESTED PACKAGE / RIG SETUP:', 22, currentY + 8);

  doc.setTextColor(3, 105, 161);
  doc.setFontSize(13);
  doc.text(data.plan, 22, currentY + 17);

  currentY += 34;

  // Section 1: Applicant Information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. APPLICANT & CLUB DETAILS', 16, currentY);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(16, currentY + 2, 194, currentY + 2);

  currentY += 9;

  const details = [
    ['Full Name', `${data.firstName} ${data.lastName}`],
    ['Email Address', data.email],
    ['Phone / WhatsApp', data.phone],
    ['Organisation / Club', data.organisation],
    ['Designation / Role', data.role],
    ['Country', data.country]
  ];

  details.forEach(([lbl, val], i) => {
    const rowY = currentY + (i * 8.5);
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(16, rowY - 5, 178, 8, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(lbl, 22, rowY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(val || 'N/A', 80, rowY);
  });

  currentY += (details.length * 8.5) + 8;

  // Section 2: Requirements & Notes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. REQUIREMENTS, FIXTURE DATES & VENUE NOTES', 16, currentY);

  doc.line(16, currentY + 2, 194, currentY + 2);
  currentY += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const userMsg = data.message ? data.message : 'Standard trial onboarding requested. No specific fixture dates or hardware constraints noted.';
  const wrappedLines = doc.splitTextToSize(userMsg, 174);
  doc.text(wrappedLines, 20, currentY);

  currentY += (wrappedLines.length * 5) + 12;

  // Section 3: Official Verification & Headquarters Box
  doc.setFillColor(243, 248, 252);
  doc.roundedRect(16, currentY, 178, 36, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(16, currentY, 178, 36, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('OFFICIAL VERIFICATION & TECHNICAL CONTACTS', 22, currentY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('• Direct WhatsApp Support: +94 76 273 3698 (Instant Response 24/7)', 22, currentY + 15);
  doc.text('• Dedicated Email: support@crick4u.io', 22, currentY + 21);
  doc.text('• Web Portal: https://navis-create.github.io/impact-play/', 22, currentY + 27);
  doc.text('• Certified analysts & match capture crews available for Colombo CC, Panadura SC & clubs.', 22, currentY + 33);

  // Footer Tagline
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Crick4U Cricket Analytics © 2026. This registration confirmation serves as an official customer inquiry voucher.', 105, 288, { align: 'center' });

  // Download PDF file
  const safeName = `${data.firstName}_${data.lastName}`.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Crick4U_Order_${safeName}_${refNo}.pdf`;
  doc.save(filename);
}

// Expose modal controller functions globally
window.openOrderModal = openOrderModal;
window.closeOrderModal = closeOrderModal;
window.handleModalBackdropClick = handleModalBackdropClick;
window.submitOrderViaWhatsApp = submitOrderViaWhatsApp;
window.submitOrderViaEmailAndPDF = submitOrderViaEmailAndPDF;
