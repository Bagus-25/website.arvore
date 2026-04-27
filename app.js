/* ============================================================
   ARVORE — app.js
   Interactions: navbar scroll, mobile menu, scroll reveal,
   contact form, animated counters
   ============================================================ */

'use strict';

/* ---------- NAV SCROLL ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ---------- MOBILE BURGER ---------- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---------- SCROLL REVEAL ---------- */
const revealEls = document.querySelectorAll(
  '.service-card, .why-item, .price-card, .section-header, .visual-card, .contact__content, .contact__form'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ---------- ANIMATED COUNTERS ---------- */
function animateCounter(el, target, decimals = 0, suffix = '') {
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = (eased * target).toFixed(decimals);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = document.querySelectorAll('.stat__num');
      nums.forEach(num => {
        const text = num.textContent.trim();
        if (text.includes('%')) {
          animateCounter(num, parseFloat(text), 1, '%');
        } else if (text.includes('+')) {
          animateCounter(num, parseInt(text), 0, '+');
        }
        // "24/7" stays as-is
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero__stats');
if (heroStats) statsObserver.observe(heroStats);

/* ---------- CONTACT FORM ---------- */
const contactForm = document.getElementById('contact-form');
const btnText = document.getElementById('btn-text');
const btnLoading = document.getElementById('btn-loading');
const submitBtn = document.getElementById('submit-btn');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !service || !message) {
    showToast('Mohon lengkapi semua field terlebih dahulu.', 'warn');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Format email tidak valid.', 'warn');
    return;
  }

  // Simulate send
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  submitBtn.disabled = true;

  setTimeout(() => {
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
    contactForm.reset();
    showToast('Pesan berhasil dikirim! Tim kami akan menghubungi Anda segera.', 'success');
  }, 2000);
});

/* ---------- TOAST NOTIFICATION ---------- */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast toast--' + type;
  toast.textContent = message;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '28px',
    right: '28px',
    zIndex: '9999',
    maxWidth: '340px',
    background: type === 'success' ? '#1c1c1f' : '#1c1c1f',
    border: '1px solid ' + (type === 'success' ? 'hsl(36,18%,50%)' : 'hsl(36,10%,40%)'),
    color: type === 'success' ? '#e8e0d4' : '#a89f94',
    padding: '14px 18px',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontFamily: 'Inter, sans-serif',
    lineHeight: '1.5',
    boxShadow: '0 8px 32px rgba(0,0,0,.6)',
    opacity: '0',
    transform: 'translateY(8px)',
    transition: 'opacity .25s ease, transform .25s ease',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/* ---------- SMOOTH ANCHOR SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---------- HIDE SCROLL HINT ON SCROLL ---------- */
const scrollHint = document.getElementById('scroll-hint');
if (scrollHint) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) scrollHint.style.opacity = '0';
    else scrollHint.style.opacity = '1';
  }, { passive: true });
}
