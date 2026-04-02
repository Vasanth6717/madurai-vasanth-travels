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

/* ---- Active nav link on scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.navbar-nav .nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 80) {
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

/* ---- Close mobile nav on link click ---- */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const navCollapse = document.getElementById('navbarNav');
    if (navCollapse.classList.contains('show')) {
      new bootstrap.Collapse(navCollapse).hide();
    }
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

/* ---- Animate elements on scroll (Intersection Observer) ---- */
const animElements = document.querySelectorAll(
  '.service-card, .why-card, .feature-item'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

/* ---- Infinite Auto-Scroll Sliders ---- */
document.addEventListener('DOMContentLoaded', () => {
  initSlider('tariffTrack', 'tariffViewport');
  initSlider('pkgTrack', 'pkgViewport');
});

function initSlider(trackId, viewportId) {
  const track    = document.getElementById(trackId);
  const viewport = document.getElementById(viewportId);
  if (!track || !viewport) return;

  // Clone all items and append for seamless loop
  const items = Array.from(track.children);
  items.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  // Pause on hover (mouse + touch)
  viewport.addEventListener('mouseenter', () => track.classList.add('paused'));
  viewport.addEventListener('mouseleave', () => track.classList.remove('paused'));
  viewport.addEventListener('touchstart',  () => track.classList.add('paused'),   { passive: true });
  viewport.addEventListener('touchend',    () => track.classList.remove('paused'), { passive: true });
}
