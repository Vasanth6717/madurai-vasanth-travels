/* ============================================================
   Madurai Vasanth Travels — Main JS
   ============================================================ */

const WHATSAPP_NUMBER = '919876543210';

/* ---- Navbar scroll effect ---- */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Back-to-top visibility
  const btn = document.getElementById('backToTop');
  if (window.scrollY > 400) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
});

/* ---- Active nav link on scroll (desktop) ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('#mainNavLinks .nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 90) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

/* ---- Bootstrap Tooltips (top-bar social icons + Call Now) ---- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    new bootstrap.Tooltip(el, { trigger: 'hover' });
  });
});

/* ---- Set min date for booking form ---- */
document.addEventListener('DOMContentLoaded', () => {
  const dateField = document.getElementById('bookDate');
  if (dateField) {
    const today = new Date().toISOString().split('T')[0];
    dateField.setAttribute('min', today);
  }
});

/* ---- Booking Form → WhatsApp ---- */
function submitBooking(e) {
  e.preventDefault();

  const name    = document.getElementById('bookName').value.trim();
  const phone   = document.getElementById('bookPhone').value.trim();
  const pickup  = document.getElementById('bookPickup').value.trim();
  const drop    = document.getElementById('bookDrop').value.trim();
  const date    = document.getElementById('bookDate').value;
  const trip    = document.getElementById('bookTrip').value;
  const vehicle = document.getElementById('bookVehicle').value;

  if (!name || !phone || !pickup || !drop || !date || !vehicle) {
    alert('Please fill in all required fields.');
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

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

/* ---- Contact Form → WhatsApp ---- */
function submitContact(e) {
  e.preventDefault();

  const name  = document.getElementById('contactName').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();
  const msg   = document.getElementById('contactMsg').value.trim();

  if (!name || !phone || !msg) {
    alert('Please fill in all fields.');
    return;
  }

  const text =
    `*Message from Website — MeenaxiGo*\n\n` +
    `👤 *Name:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `💬 *Message:* ${msg}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

/* ---- Stagger fade-up on scroll ---- */
document.addEventListener('DOMContentLoaded', () => {
  const animEls = document.querySelectorAll(
    '.service-card, .why-card, .feature-item, .tariff-card, .pkg-card, .contact-item, .booking-card'
  );
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 80 * (entry.target.dataset.delay || 0));
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity .55s ease, transform .55s ease';
    el.dataset.delay = i % 6;
    fadeObs.observe(el);
  });
});

/* ---- Animated counter for stats bar ---- */
function animateCounter(el, target, duration) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
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
   Infinite Auto-Scroll Sliders with Arrow Navigation
   ============================================================ */
window.addEventListener('load', () => {
  initSlider({
    trackId:    'tariffTrack',
    viewportId: 'tariffViewport',
    prevId:     'tariffPrev',
    nextId:     'tariffNext',
    speed:      0.6
  });
  initSlider({
    trackId:    'pkgTrack',
    viewportId: 'pkgViewport',
    prevId:     'pkgPrev',
    nextId:     'pkgNext',
    speed:      0.5
  });
});

function initSlider({ trackId, viewportId, prevId, nextId, speed }) {
  const track    = document.getElementById(trackId);
  const viewport = document.getElementById(viewportId);
  const prevBtn  = document.getElementById(prevId);
  const nextBtn  = document.getElementById(nextId);
  if (!track || !viewport) return;

  const origItems = Array.from(track.children);

  // Compute origW by summing each item's rendered offsetWidth + the CSS gap (24px).
  // Include a trailing gap so the loop resets seamlessly between the last original
  // item and the first clone (which also has a 24px gap before it).
  const GAP  = 24;
  const origW = origItems.reduce((sum, el) => sum + el.offsetWidth + GAP, 0);

  // Clone 4× so total = 5× originals — arrows can never overshoot.
  for (let i = 0; i < 4; i++) {
    origItems.forEach(item => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  }

  let pos     = 0;
  let paused  = false;
  let jumping = false;

  function cardStep() {
    const firstItem = track.querySelector('.slider-item');
    return firstItem ? firstItem.offsetWidth + 24 : 290;
  }

  // RAF loop — auto scrolls when not paused or jumping
  function tick() {
    if (!paused && !jumping) {
      pos += speed;
      if (pos >= origW) pos -= origW;  // reset using stored constant
      track.style.transform = `translateX(-${pos}px)`;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Pause on hover / touch
  viewport.addEventListener('mouseenter', () => { paused = true; });
  viewport.addEventListener('mouseleave', () => { paused = false; });
  viewport.addEventListener('touchstart',  () => { paused = true; },  { passive: true });
  viewport.addEventListener('touchend',    () => { paused = false; }, { passive: true });

  // Smooth arrow jump with ease-in-out
  function jumpBy(delta) {
    const target = pos + delta;
    const start  = pos;
    const dur    = 400;
    const t0     = performance.now();
    jumping = true;

    function animate(now) {
      const elapsed  = now - t0;
      const progress = Math.min(elapsed / dur, 1);
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      pos = start + (target - start) * ease;

      // keep pos inside the single-set range
      let p = pos % origW;
      if (p < 0) p += origW;
      track.style.transform = `translateX(-${p}px)`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        pos = p;
        jumping = false;
      }
    }
    requestAnimationFrame(animate);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => jumpBy(-cardStep()));
  if (nextBtn) nextBtn.addEventListener('click', () => jumpBy(cardStep()));
}
