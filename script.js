/* ═══════════════════════════════════════════════════
   AAHIL NOUMAN — script.js
═══════════════════════════════════════════════════ */

// ── PROGRESS BAR ─────────────────────────────────────
const bar = document.createElement('div');
bar.className = 'page-progress';
document.body.prepend(bar);
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  bar.style.width = Math.min(pct, 100) + '%';
}, { passive: true });

// ── NAVBAR ────────────────────────────────────────────
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  // Active nav link highlight
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}, { passive: true });

// ── HAMBURGER MENU ────────────────────────────────────
const ham     = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-links');

function openMenu() {
  navMenu.classList.add('open');
  ham.classList.add('open');
  document.body.style.overflow = 'hidden'; // prevent scroll behind overlay
}
function closeMenu() {
  navMenu.classList.remove('open');
  ham.classList.remove('open');
  document.body.style.overflow = '';
}

ham.addEventListener('click', () => {
  navMenu.classList.contains('open') ? closeMenu() : openMenu();
});

// Close on any nav link click
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// Close on overlay click (tap outside menu links)
navMenu.addEventListener('click', e => { if (e.target === navMenu) closeMenu(); });

// Close on Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// ── SCROLL REVEAL ─────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll([
  '.about-left', '.about-right',
  '.skill-cat',
  '.project-card', '.minor-card',
  '.timeline-item', '.cert-item',
  '.contact-left', '.contact-right'
].join(',')).forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 3 === 1) el.classList.add('reveal-d1');
  if (i % 3 === 2) el.classList.add('reveal-d2');
  revealObs.observe(el);
});

// ── STATS COUNTER ─────────────────────────────────────
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('[data-target]').forEach(el => {
      const target  = parseFloat(el.dataset.target);
      const decimal = el.dataset.decimal === 'true';
      const dur     = 1400;
      const t0      = performance.now();
      const suffix  = decimal ? '' : '+';

      (function tick(now) {
        const p    = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val  = target * ease;
        el.textContent = decimal ? val.toFixed(2) : Math.floor(val) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = decimal ? target.toFixed(2) : target + suffix;
      })(performance.now());
    });
    statsObs.unobserve(e.target);
  });
}, { threshold: 0.5 });

const statsCard = document.querySelector('.about-stats-card');
if (statsCard) statsObs.observe(statsCard);

// ── CONTACT FORM ──────────────────────────────────────
const form    = document.getElementById('contact-form');
const success = document.getElementById('form-success');
const submitB = document.getElementById('form-submit');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const fields = [
      { el: document.getElementById('f-name'),    ok: v => v.length > 0,     msg: 'Name required' },
      { el: document.getElementById('f-email'),   ok: v => /\S+@\S+\.\S+/.test(v), msg: 'Valid email required' },
      { el: document.getElementById('f-message'), ok: v => v.length > 0,     msg: 'Message required' }
    ];

    let valid = true;
    fields.forEach(({ el, ok }) => {
      if (!ok(el.value.trim())) {
        el.style.borderColor = 'var(--rose)';
        el.style.boxShadow   = '0 0 0 3px rgba(201,106,106,0.12)';
        setTimeout(() => { el.style.borderColor = ''; el.style.boxShadow = ''; }, 2800);
        valid = false;
      }
    });
    if (!valid) return;

    submitB.disabled = true;
    submitB.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        style="animation:spin .7s linear infinite"><path d="M21 12a9 9 0 1 1-6.2-8.6"/></svg>
      Sending…`;

    setTimeout(() => {
      form.reset();
      submitB.disabled = false;
      submitB.innerHTML = `
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22,2 15,22 11,13 2,9"/>
        </svg> Send Message`;
      success.style.display = 'block';
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }, 1800);
  });
}

// ── 3D CARD TILT (desktop only) ──────────────────────
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / r.height) * 2;
      const ry = ((e.clientX - r.left - r.width  / 2) / r.width)  * -2;
      card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease, border-color 0.25s, box-shadow 0.25s';
      card.style.transform  = '';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}

// ── SMOOTH ACTIVE NAV ON LOAD ─────────────────────────
window.dispatchEvent(new Event('scroll'));

// ── SPINNER KEYFRAME ──────────────────────────────────
const sty = document.createElement('style');
sty.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(sty);

console.log('%c Aahil Nouman · Portfolio ', 'background:#c9a96e;color:#0a0a10;font-size:13px;font-weight:700;padding:8px 18px;border-radius:6px;');
