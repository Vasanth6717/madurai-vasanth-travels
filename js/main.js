/* ============================================================
   MeenaxiGo — Main JS  v8
   ============================================================ */

const WHATSAPP_NUMBER = '917010869402';

/* ---- Preloader ---- */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (pre) {
    setTimeout(() => pre.classList.add('hidden'), 600);
  }
});

/* ============================================================
   TOAST NOTIFICATION SYSTEM
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
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(40px)'; el.style.transition = 'all .4s'; setTimeout(() => el.remove(), 400); }, 4500);
}

/* ---- Navbar scroll effect ---- */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (window.scrollY > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');

  const btn = document.getElementById('backToTop');
  if (window.scrollY > 400) btn.classList.add('visible');
  else btn.classList.remove('visible');
});

/* ---- Sticky Book Now Bar ---- */
const heroSection = document.getElementById('home');
window.addEventListener('scroll', () => {
  const bar = document.getElementById('stickyBar');
  if (!bar) return;
  const heroBottom = heroSection ? heroSection.getBoundingClientRect().bottom : 600;
  if (heroBottom < 0) bar.classList.add('visible');
  else bar.classList.remove('visible');
});

/* ---- Active nav link on scroll ---- */
const sections  = document.querySelectorAll('section[id]');
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
});

/* ---- Bootstrap Tooltips ---- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    new bootstrap.Tooltip(el, { trigger: 'hover' });
  });
});

/* ---- Set min date ---- */
document.addEventListener('DOMContentLoaded', () => {
  const dateField = document.getElementById('bookDate');
  if (dateField) dateField.setAttribute('min', new Date().toISOString().split('T')[0]);
});

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
  if (!name)    { setInvalid('bookName',    'Please enter your name');           valid = false; }
  if (!phone || phone.length < 10) { setInvalid('bookPhone', 'Enter a valid 10-digit number'); valid = false; }
  if (!pickup)  { setInvalid('bookPickup',  'Please enter pickup location');     valid = false; }
  if (!drop)    { setInvalid('bookDrop',    'Please enter drop location');       valid = false; }
  if (!date)    { setInvalid('bookDate',    'Please select travel date');        valid = false; }
  if (!vehicle) { setInvalid('bookVehicle', 'Please choose a vehicle');         valid = false; }

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
   STAGGER FADE-UP ON SCROLL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // NOTE: .tariff-card and .pkg-card are intentionally excluded — they live inside
  // a translateX-scrolled track so the IntersectionObserver measures them at their
  // raw DOM position (off-screen), meaning they'd never become visible.
  const animEls = document.querySelectorAll(
    '.service-card, .why-card, .feature-item, .contact-item, .booking-card, .testi-card, .route-img-card, .how-step'
  );
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 80 * (entry.target.dataset.delay || 0));
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  animEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity .55s ease, transform .55s ease';
    el.dataset.delay = i % 6;
    fadeObs.observe(el);
  });
});

/* ============================================================
   ANIMATED COUNTER FOR STATS BAR
   ============================================================ */
function animateCounter(el, target, duration) {
  const start  = performance.now();
  const update = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  let counted = false;
  const statsObs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !counted) {
      counted = true;
      document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target), 1800);
      });
    }
  }, { threshold: 0.5 });
  statsObs.observe(statsBar);
}

/* ============================================================
   INFINITE SLIDERS v7 — RAF, hardcoded widths
   ============================================================ */
window.addEventListener('load', () => {
  initSlider('tariffTrack','tariffViewport','tariffPrev','tariffNext', 272, 6,  55);
  initSlider('pkgTrack',   'pkgViewport',  'pkgPrev',   'pkgNext',    282, 9,  45);
});

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
