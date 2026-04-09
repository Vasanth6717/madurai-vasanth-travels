/* ============================================================
   MeenaxiGo — Main JS  v10  (full animation edition)
   ============================================================ */

const WHATSAPP_NUMBER = '917010869402';

/* ============================================================
   PRELOADER
   ============================================================ */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (pre) setTimeout(() => pre.classList.add('hidden'), 900);

  initSlider('tariffTrack','tariffViewport','tariffPrev','tariffNext', 272, 6, 55);
  initSlider('pkgTrack',   'pkgViewport',  'pkgPrev',   'pkgNext',    282, 9, 45);
  initParticles();
  initCardTilt();
});

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
function showToast(title, subtitle, type = 'info') {
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = `toast-msg toast-${type}`;
  el.innerHTML = `
    <div class="toast-icon"><i class="fas ${icons[type]}"></i></div>
    <div class="toast-body"><p>${title}</p><span>${subtitle}</span></div>
    <button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;
  container.appendChild(el);
  // Entrance
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(50px)';
    el.style.transition = 'all .4s';
    setTimeout(() => el.remove(), 400);
  }, 4500);
}

/* ============================================================
   NAVBAR SCROLL
   ============================================================ */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (window.scrollY > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');

  const btn = document.getElementById('backToTop');
  if (btn) {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }
}, { passive: true });

/* ---- Sticky Book Now Bar ---- */
const heroSection = document.getElementById('home');
window.addEventListener('scroll', () => {
  const bar = document.getElementById('stickyBar');
  if (!bar) return;
  const heroBottom = heroSection ? heroSection.getBoundingClientRect().bottom : 600;
  if (heroBottom < 0) bar.classList.add('visible');
  else bar.classList.remove('visible');
}, { passive: true });

/* ---- Active nav link on scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('#mainNavLinks .nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 90) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
}, { passive: true });

/* ============================================================
   BOOTSTRAP TOOLTIPS + MIN DATE
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el =>
    new bootstrap.Tooltip(el, { trigger: 'hover' })
  );
  const dateField = document.getElementById('bookDate');
  if (dateField) dateField.setAttribute('min', new Date().toISOString().split('T')[0]);
});

/* ============================================================
   HERO CANVAS PARTICLES
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COUNT = 55;
  const particles = Array.from({ length: COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2.5 + 0.5,
    dx: (Math.random() - .5) * .45,
    dy: -Math.random() * .6 - .1,
    alpha: Math.random() * .5 + .15,
    pulse: Math.random() * Math.PI * 2,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.pulse += 0.025;
      const a = p.alpha * (.7 + .3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,180,0,${a})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      // Reset when out of canvas
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================================
   3D CARD TILT EFFECT
   ============================================================ */
function initCardTilt() {
  const tiltEls = document.querySelectorAll(
    '.service-card, .why-card, .how-step, .contact-item'
  );

  tiltEls.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const rotX  = ((e.clientY - cy) / (rect.height / 2)) * -7;
      const rotY  = ((e.clientX - cx) / (rect.width  / 2)) *  7;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.02)`;
      card.style.transition = 'transform .08s linear';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform   = '';
      card.style.transition  = 'transform .45s cubic-bezier(.25,.8,.25,1)';
    });
  });
}

/* ============================================================
   BUTTON RIPPLE ON CLICK
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn, .bk-submit-btn, .sticky-book-btn, .sticky-call-btn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top  = (e.clientY - rect.top)  + 'px';
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* ============================================================
   SCROLL REVEAL — direction-based IntersectionObserver
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* --- Assign reveal classes automatically to key elements --- */
  const revealMap = [
    { sel: '.section-label',     cls: 'reveal zoom',  delay: 0 },
    { sel: '.section-title',     cls: 'reveal up',    delay: 1 },
    { sel: '.service-card',      cls: 'reveal up',    delay: null },
    { sel: '.why-card',          cls: 'reveal up',    delay: null },
    { sel: '.how-step',          cls: 'reveal zoom',  delay: null },
    { sel: '.feature-item',      cls: 'reveal left',  delay: null },
    { sel: '.contact-item',      cls: 'reveal right', delay: null },
    { sel: '.booking-card',      cls: 'reveal zoom',  delay: 0 },
    { sel: '.route-img-card',    cls: 'reveal up',    delay: null },
    { sel: '.testi-card',        cls: 'reveal flip',  delay: null },
    { sel: '.about-img-grid',    cls: 'reveal left',  delay: 0 },
    { sel: '.about-content',     cls: 'reveal right', delay: 0 },
    { sel: '.stats-bar',         cls: 'reveal up',    delay: 0 },
    { sel: '.footer-top',        cls: 'reveal up',    delay: 0 },
  ];

  revealMap.forEach(({ sel, cls, delay }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      // Don't double-apply
      if (el.classList.contains('reveal')) return;
      cls.split(' ').forEach(c => el.classList.add(c));
      if (delay !== null) {
        el.dataset.delay = delay;
      } else {
        el.dataset.delay = (i % 5) + 1;
      }
    });
  });

  /* --- IntersectionObserver to trigger --- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.delay || 0) * 0.1;
        setTimeout(() => {
          entry.target.classList.add('in-view');
          // Testimonial star trigger
          if (entry.target.classList.contains('testi-card')) {
            entry.target.classList.add('in-view');
          }
        }, delay * 1000);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* --- Animated underline on section titles --- */
  const titleObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated-title', 'in-view');
        titleObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.section-title').forEach(el => {
    el.classList.add('animated-title');
    titleObs.observe(el);
  });
});

/* ============================================================
   MAGNETIC HOVER ON CTA BUTTONS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-warning.btn-lg, .nav-book-btn, .bk-submit-btn').forEach(btn => {
    btn.classList.add('pulse-cta');
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) * .22;
      const dy = (e.clientY - rect.top  - rect.height / 2) * .22;
      btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
});

/* ============================================================
   STATS BAR COUNTER WITH GLOW
   ============================================================ */
function animateCounter(el, target, duration) {
  const start  = performance.now();
  el.classList.add('counting');
  const update = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else { el.textContent = target; }
  };
  requestAnimationFrame(update);
}

const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  let counted = false;
  const statsObs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !counted) {
      counted = true;
      document.querySelectorAll('.stat-number[data-target]').forEach((el, i) => {
        setTimeout(() => animateCounter(el, parseInt(el.dataset.target), 1800), i * 150);
      });
    }
  }, { threshold: 0.5 });
  statsObs.observe(statsBar);
}

/* ============================================================
   FORM VALIDATION HELPERS
   ============================================================ */
function setValid(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('is-invalid');
  el.classList.add('is-valid');
  const err = el.parentElement.querySelector('.field-error');
  if (err) err.classList.remove('show');
}
function setInvalid(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('is-valid');
  el.classList.add('is-invalid');
  let err = el.parentElement.querySelector('.field-error');
  if (!err) {
    err = document.createElement('div');
    err.className = 'field-error';
    el.parentElement.appendChild(err);
  }
  err.textContent = msg;
  err.classList.add('show');
  // Shake animation on invalid input
  el.style.animation = 'none';
  requestAnimationFrame(() => {
    el.style.animation = 'inputShake .4s ease';
  });
}
function clearValidation(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('is-valid', 'is-invalid');
  const err = el.parentElement.querySelector('.field-error');
  if (err) err.classList.remove('show');
}

/* Real-time validation on blur */
document.addEventListener('DOMContentLoaded', () => {
  ['bookName','bookPhone','bookPickup','bookDrop','bookDate','bookVehicle'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => {
      if (el.value.trim()) setValid(id);
      else clearValidation(id);
    });
  });
});

/* ============================================================
   BOOKING FORM → WHATSAPP
   ============================================================ */
function submitBooking(e) {
  e.preventDefault();
  const name    = document.getElementById('bookName').value.trim();
  const phone   = document.getElementById('bookPhone').value.trim();
  const pickup  = document.getElementById('bookPickup').value.trim();
  const drop    = document.getElementById('bookDrop').value.trim();
  const date    = document.getElementById('bookDate').value;
  const trip    = document.getElementById('bookTrip').value;
  const vehicle = document.getElementById('bookVehicle').value;

  let valid = true;
  if (!name)                     { setInvalid('bookName',    'Please enter your name');              valid = false; }
  if (!phone || phone.length < 10){ setInvalid('bookPhone',  'Enter a valid 10-digit number');       valid = false; }
  if (!pickup)                   { setInvalid('bookPickup',  'Please enter pickup location');        valid = false; }
  if (!drop)                     { setInvalid('bookDrop',    'Please enter drop location');          valid = false; }
  if (!date)                     { setInvalid('bookDate',    'Please select travel date');           valid = false; }
  if (!vehicle)                  { setInvalid('bookVehicle', 'Please choose a vehicle');             valid = false; }

  if (!valid) {
    showToast('Missing Fields', 'Please fill all required fields', 'error');
    return;
  }

  const msg =
    `*New Taxi Booking — MeenaxiGo*\n\n` +
    `👤 *Name:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `📍 *Pickup:* ${pickup}\n` +
    `📌 *Drop:* ${drop}\n` +
    `📅 *Date:* ${date}\n` +
    `🔄 *Trip Type:* ${trip}\n` +
    `🚗 *Vehicle:* ${vehicle}\n\n` +
    `Please confirm availability and share the fare estimate.`;

  showToast('Booking Sent!', 'Opening WhatsApp to confirm your booking', 'success');
  setTimeout(() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank'), 700);
}

/* ============================================================
   CONTACT FORM → WHATSAPP
   ============================================================ */
function submitContact(e) {
  e.preventDefault();
  const name  = document.getElementById('contactName').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();
  const msg   = document.getElementById('contactMsg').value.trim();

  if (!name || !phone || !msg) {
    showToast('Missing Fields', 'Please fill in all fields', 'error');
    return;
  }

  const text =
    `*Message from Website — MeenaxiGo*\n\n` +
    `👤 *Name:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `💬 *Message:* ${msg}`;

  showToast('Message Sent!', 'Opening WhatsApp now', 'success');
  setTimeout(() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank'), 700);
}

/* ============================================================
   POPULAR ROUTES — AUTO-FILL BOOKING FORM
   ============================================================ */
function fillRoute(pickup, drop) {
  const pField = document.getElementById('bookPickup');
  const dField = document.getElementById('bookDrop');
  if (pField) { pField.value = pickup; setValid('bookPickup'); }
  if (dField) { dField.value = drop;   setValid('bookDrop');   }
  showToast('Route Selected!', `${pickup} → ${drop} filled in the booking form`, 'success');
}

/* ============================================================
   INFINITE SLIDERS — RAF, hardcoded widths
   ============================================================ */
function initSlider(trackId, viewportId, prevId, nextId, itemW, origN, pxPerSec) {
  const track   = document.getElementById(trackId);
  const vp      = document.getElementById(viewportId);
  const btnPrev = document.getElementById(prevId);
  const btnNext = document.getElementById(nextId);
  if (!track || !vp) return;

  const gap   = 24;
  const origW = origN * (itemW + gap);

  const origItems = Array.from(track.children);
  for (let i = 0; i < 4; i++) {
    origItems.forEach(el => {
      const c = el.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      track.appendChild(c);
    });
  }

  let pos     = origW;
  let paused  = false;
  let jumping = false;
  let lastTs  = null;

  function tick(ts) {
    if (!paused && !jumping) {
      if (lastTs !== null) {
        pos += pxPerSec * Math.min((ts - lastTs) / 1000, 0.05);
        if (pos >= 2 * origW) pos -= origW;
      }
      track.style.transform = `translateX(-${pos}px)`;
      lastTs = ts;
    } else {
      lastTs = null;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  vp.addEventListener('mouseenter', () => { paused = true;  });
  vp.addEventListener('mouseleave', () => { paused = false; });
  vp.addEventListener('touchstart',  () => { paused = true;  }, { passive: true });
  vp.addEventListener('touchend',    () => { paused = false; }, { passive: true });

  function jump(dir) {
    if (jumping) return;
    jumping = true;
    let target = pos + dir * (itemW + gap);
    if (target <  origW)     target += origW;
    if (target >  3 * origW) target -= origW;

    track.style.transition = 'transform 0.42s cubic-bezier(0.4,0,0.2,1)';
    track.style.transform  = `translateX(-${target}px)`;

    setTimeout(() => {
      pos = target;
      if (pos >= 2 * origW) pos -= origW;
      if (pos <  origW)     pos += origW;
      track.style.transition = '';
      track.style.transform  = `translateX(-${pos}px)`;
      jumping = false;
    }, 440);
  }

  if (btnPrev) btnPrev.addEventListener('click', () => jump(-1));
  if (btnNext) btnNext.addEventListener('click', () => jump(+1));
}

/* ============================================================
   HERO PARALLAX ON SCROLL
   ============================================================ */
window.addEventListener('scroll', () => {
  const heroSlides = document.querySelectorAll('.carousel-item.active .hero-bg');
  const scrollY = window.scrollY;
  heroSlides.forEach(bg => {
    bg.style.transform = `translateY(${scrollY * 0.25}px)`;
  });
}, { passive: true });

/* ============================================================
   CURSOR GLOW (desktop only)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth < 992) return;
  const glow = document.createElement('div');
  glow.id = 'cursorGlow';
  glow.style.cssText = `
    position:fixed; width:28px; height:28px; border-radius:50%;
    background:radial-gradient(circle, rgba(255,180,0,.35) 0%, transparent 70%);
    pointer-events:none; z-index:99999; transform:translate(-50%,-50%);
    transition:opacity .3s; opacity:0;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

  // Grow on hovering interactive elements
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .btn, .service-card, .why-card, .route-img-card')) {
      glow.style.width  = '52px';
      glow.style.height = '52px';
      glow.style.background = 'radial-gradient(circle, rgba(255,180,0,.5) 0%, transparent 70%)';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .btn, .service-card, .why-card, .route-img-card')) {
      glow.style.width  = '28px';
      glow.style.height = '28px';
      glow.style.background = 'radial-gradient(circle, rgba(255,180,0,.35) 0%, transparent 70%)';
    }
  });
});
