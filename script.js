/* ═══════════════════════════════════════════════════════════════════
   ARKO SAHA PORTFOLIO — JavaScript
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── Cursor Glow ─────────────────────────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');
let cursorRaf;
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!cursorRaf) animateGlow();
});

function animateGlow() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top  = glowY + 'px';
  cursorRaf = requestAnimationFrame(animateGlow);
}

/* Hide glow on touch devices */
document.addEventListener('touchstart', () => {
  if (cursorGlow) cursorGlow.style.display = 'none';
}, { passive: true });

/* ─── Nav scroll behaviour ────────────────────────────────────────── */
const nav = document.getElementById('nav');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ─── Mobile nav toggle ───────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navDrawer = document.getElementById('navDrawer');
let drawerOpen = false;

navToggle.addEventListener('click', () => {
  drawerOpen = !drawerOpen;
  navToggle.setAttribute('aria-expanded', drawerOpen);
  navDrawer.setAttribute('aria-hidden', !drawerOpen);
  navDrawer.style.display = 'flex';

  // Trigger transition
  requestAnimationFrame(() => {
    navDrawer.classList.toggle('open', drawerOpen);
  });

  document.body.style.overflow = drawerOpen ? 'hidden' : '';
});

// Close drawer when a link is clicked
navDrawer.querySelectorAll('.drawer-link').forEach(link => {
  link.addEventListener('click', () => {
    drawerOpen = false;
    navToggle.setAttribute('aria-expanded', 'false');
    navDrawer.setAttribute('aria-hidden', 'true');
    navDrawer.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── Reveal on scroll (IntersectionObserver) ────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

/* ─── Animated counter numbers ────────────────────────────────────── */
const statNums = document.querySelectorAll('.stat-num[data-target]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

function animateCounter(el, target) {
  const duration = 1200;
  const start = performance.now();

  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };

  requestAnimationFrame(step);
}

/* ─── Skill bar animation ─────────────────────────────────────────── */
const barFills = document.querySelectorAll('.bar-fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const width = bar.dataset.width;
      // Small delay to let the section animate in first
      setTimeout(() => {
        bar.style.width = width + '%';
      }, 200);
      barObserver.unobserve(bar);
    }
  });
}, { threshold: 0.2 });

barFills.forEach(bar => barObserver.observe(bar));

/* ─── Active nav link on scroll ──────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const activeLinkObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === '#' + id;
        link.style.color = isActive ? 'var(--amber)' : '';
      });
    }
  });
}, {
  threshold: 0.35,
  rootMargin: '-60px 0px -40% 0px'
});

sections.forEach(s => activeLinkObserver.observe(s));

/* ─── Subtle parallax on hero bg text ───────────────────────────── */
const heroBgText = document.querySelector('.hero-bg-text');
if (heroBgText) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    // Move the bg text slightly upward as user scrolls
    heroBgText.style.transform = `translateY(${scrolled * 0.18}px)`;
  }, { passive: true });
}

/* ─── Keyboard trap for mobile drawer ────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawerOpen) {
    drawerOpen = false;
    navToggle.setAttribute('aria-expanded', 'false');
    navDrawer.setAttribute('aria-hidden', 'true');
    navDrawer.classList.remove('open');
    document.body.style.overflow = '';
    navToggle.focus();
  }
});
