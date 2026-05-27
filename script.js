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

/* ── Hero Terminal Typewriter ─────────────────────────────── */
(function initTerminal() {
  const jsonEl   = document.getElementById('terminalJson');
  const cursorLn = document.getElementById('terminalCursorLine');
  if (!jsonEl) return;

  const lines = [
    { raw: '{',                              html: '<span class="t-brace">{</span>' },
    { raw: '  "name": "Arko Saha",',         html: '  <span class="t-key">"name"</span>: <span class="t-str">"Arko Saha"</span>,' },
    { raw: '  "role": "ML Engineer & Quant Researcher",', html: '  <span class="t-key">"role"</span>: <span class="t-str">"ML Engineer &amp; Quant Researcher"</span>,' },
    { raw: '  "location": "London, UK",',    html: '  <span class="t-key">"location"</span>: <span class="t-str">"London, UK"</span>,' },
    { raw: '  "skills": [',                  html: '  <span class="t-key">"skills"</span>: <span class="t-arr">[</span>' },
    { raw: '    "Deep Learning", "MLOps",',   html: '    <span class="t-str">"Deep Learning"</span>, <span class="t-str">"MLOps"</span>,' },
    { raw: '    "Data Engineering", "Quant Research"',html: '    <span class="t-str">"Data Engineering"</span>, <span class="t-str">"Quant Research"</span>' },
    { raw: '  ],',                           html: '  <span class="t-arr">]</span>,' },
    { raw: '  "publications": 3,',           html: '  <span class="t-key">"publications"</span>: <span class="t-num">3</span>,' },
    { raw: '  "certifications": 12,',        html: '  <span class="t-key">"certifications"</span>: <span class="t-num">12</span>,' },
    { raw: '  "mission_driven": true',       html: '  <span class="t-key">"mission_driven"</span>: <span class="t-bool">true</span>' },
    { raw: '}',                              html: '<span class="t-brace">}</span>' },
  ];

  const CHAR_DELAY  = 28;   // ms per character
  const LINE_DELAY  = 120;  // ms pause between lines

  let lineIdx = 0;
  let charIdx = 0;
  let currentHtml = '';
  let rendered = '';        // fully-rendered lines so far

  function typeLine() {
    if (lineIdx >= lines.length) {
      cursorLn.style.display = 'flex';
      return;
    }

    const line = lines[lineIdx];

    if (charIdx < line.raw.length) {
      charIdx++;
      // Reveal the HTML up to charIdx characters of raw text.
      // We count only visible (non-tag) characters.
      currentHtml = sliceHtmlToChars(line.html, charIdx);
      jsonEl.innerHTML = rendered + currentHtml;
      setTimeout(typeLine, CHAR_DELAY);
    } else {
      // Line done — commit it
      rendered += line.html + '\n';
      currentHtml = '';
      charIdx = 0;
      lineIdx++;
      setTimeout(typeLine, LINE_DELAY);
    }
  }

  /**
   * Returns the HTML string revealing only `n` visible characters.
   * Walks the html char-by-char; inside a tag (< … >) it copies
   * tag chars without incrementing the visible counter.
   */
  function sliceHtmlToChars(html, n) {
    let out = '';
    let visible = 0;
    let inTag = false;
    for (let i = 0; i < html.length; i++) {
      const ch = html[i];
      if (ch === '<') { inTag = true; }
      if (inTag) {
        out += ch;
        if (ch === '>') inTag = false;
      } else {
        if (visible < n) { out += ch; visible++; }
        else break;
      }
    }
    return out;
  }

  // Kick off after a short delay so the page settles
  setTimeout(typeLine, 800);
})();

/* ─── Global Copy Code Button ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const initCopyButtons = () => {
    // 1. Find all code-labels and add copy buttons
    const codeLabels = document.querySelectorAll('.code-label');
    codeLabels.forEach(label => {
      // Avoid duplicate copy buttons
      if (label.querySelector('.copy-code-btn')) return;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-code-btn';
      copyBtn.textContent = 'Copy';
      copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
      
      // Styling to match Substack/Manuscript aesthetics
      copyBtn.style.marginLeft = '1rem';
      copyBtn.style.padding = '0.25rem 0.6rem';
      copyBtn.style.fontSize = '0.65rem';
      copyBtn.style.fontFamily = 'var(--font-mono)';
      copyBtn.style.background = 'rgba(255, 255, 255, 0.05)';
      copyBtn.style.border = '1px solid rgba(255, 255, 255, 0.15)';
      copyBtn.style.color = '#c9d1d9';
      copyBtn.style.borderRadius = '4px';
      copyBtn.style.cursor = 'pointer';
      copyBtn.style.transition = 'all 0.15s ease';
      
      copyBtn.addEventListener('click', () => {
        const nextPre = label.nextElementSibling;
        if (nextPre && nextPre.tagName === 'PRE') {
          const codeText = nextPre.innerText || nextPre.textContent;
          navigator.clipboard.writeText(codeText.trim()).then(() => {
            copyBtn.textContent = 'Copied!';
            copyBtn.style.borderColor = 'var(--forest)';
            copyBtn.style.color = 'var(--forest-l)';
            setTimeout(() => {
              copyBtn.textContent = 'Copy';
              copyBtn.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              copyBtn.style.color = '#c9d1d9';
            }, 2000);
          }).catch(err => console.error('Failed to copy: ', err));
        }
      });
      
      copyBtn.addEventListener('mouseenter', () => {
        copyBtn.style.background = 'rgba(255, 255, 255, 0.12)';
        copyBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        copyBtn.style.color = '#fff';
      });
      copyBtn.addEventListener('mouseleave', () => {
        copyBtn.style.background = 'rgba(255, 255, 255, 0.05)';
        copyBtn.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        copyBtn.style.color = '#c9d1d9';
      });

      label.appendChild(copyBtn);
    });

    // 2. Add copy button for pre elements that don't have a label
    const pres = document.querySelectorAll('pre');
    pres.forEach(pre => {
      const prev = pre.previousElementSibling;
      if (prev && prev.classList.contains('code-label')) return;
      if (pre.querySelector('.copy-code-btn-pre')) return;

      pre.style.position = 'relative';
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-code-btn-pre';
      copyBtn.textContent = 'Copy';
      copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
      
      copyBtn.style.position = 'absolute';
      copyBtn.style.top = '0.6rem';
      copyBtn.style.right = '0.6rem';
      copyBtn.style.padding = '0.25rem 0.6rem';
      copyBtn.style.fontSize = '0.65rem';
      copyBtn.style.fontFamily = 'var(--font-mono)';
      copyBtn.style.background = 'rgba(20, 26, 31, 0.8)';
      copyBtn.style.border = '1px solid rgba(255, 255, 255, 0.1)';
      copyBtn.style.color = '#8b949e';
      copyBtn.style.borderRadius = '4px';
      copyBtn.style.cursor = 'pointer';
      copyBtn.style.transition = 'all 0.15s ease';
      copyBtn.style.zIndex = '10';

      copyBtn.addEventListener('click', () => {
        const codeText = pre.innerText || pre.textContent;
        // Strip out the 'Copy' text itself if it gets matched
        const cleanText = codeText.replace(/Copy\n|Copied!\n/g, '').trim();
        navigator.clipboard.writeText(cleanText).then(() => {
          copyBtn.textContent = 'Copied!';
          copyBtn.style.borderColor = 'var(--forest)';
          copyBtn.style.color = '#5DCAA5';
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            copyBtn.style.color = '#8b949e';
          }, 2000);
        }).catch(err => console.error('Failed to copy: ', err));
      });

      copyBtn.addEventListener('mouseenter', () => {
        copyBtn.style.background = 'rgba(20, 26, 31, 0.95)';
        copyBtn.style.borderColor = 'rgba(255, 255, 255, 0.25)';
        copyBtn.style.color = '#c9d1d9';
      });
      copyBtn.addEventListener('mouseleave', () => {
        copyBtn.style.background = 'rgba(20, 26, 31, 0.8)';
        copyBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        copyBtn.style.color = '#8b949e';
      });

      pre.appendChild(copyBtn);
    });
  };

  initCopyButtons();
  // Safe backup run for dynamically rendered elements or late loading
  if (document.readyState === 'complete') {
    initCopyButtons();
  } else {
    window.addEventListener('load', initCopyButtons);
  }
});

