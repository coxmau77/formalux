const ctaButton = document.querySelector('.nav-cta');
const ctaSection = document.getElementById('cta');
const nav = document.querySelector('nav');
const menuButton = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const html = document.documentElement;
const themeToggleButton = document.querySelector('.theme-toggle');

if (ctaButton && ctaSection) {
  ctaButton.addEventListener('click', () => {
    ctaSection.scrollIntoView({ behavior: 'smooth' });
  });
}

if (nav && menuButton && navLinks) {
  const isMenuOpen = () => nav.classList.contains('menu-open');

  const closeMenu = () => {
    nav.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (!isMenuOpen()) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    const clickedInsideMenu = navLinks.contains(target);
    const clickedMenuButton = menuButton.contains(target);
    if (!clickedInsideMenu && !clickedMenuButton) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

if (themeToggleButton) {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    html.setAttribute('data-theme', savedTheme);
  }

  const syncThemeButton = () => {
    const currentTheme = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const isDark = currentTheme === 'dark';
    themeToggleButton.setAttribute('aria-pressed', String(isDark));
    themeToggleButton.textContent = isDark ? '☀️ Light mode' : '🌙 Dark mode';
  };

  syncThemeButton();

  themeToggleButton.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    syncThemeButton();
  });
}

const statBoxes = document.querySelectorAll('.stat-box');

const animateCounter = (statNumElement) => {
  const suffixElement = statNumElement.querySelector('span');
  const suffixText = suffixElement ? suffixElement.textContent : '';
  const rawNumberText = (statNumElement.firstChild?.textContent || '').trim();
  const prefix = rawNumberText.startsWith('+') ? '+' : '';
  const targetValue = Number.parseInt(rawNumberText.replace(/[^\d]/g, ''), 10);

  if (!Number.isFinite(targetValue)) {
    return;
  }

  const durationMs = 850;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / durationMs, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(targetValue * eased);
    statNumElement.firstChild.textContent = `${prefix}${currentValue}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    statNumElement.firstChild.textContent = `${prefix}${targetValue}`;
    if (suffixElement) {
      suffixElement.textContent = suffixText;
    }
  };

  requestAnimationFrame(tick);
};

statBoxes.forEach((box) => {
  const statNumElement = box.querySelector('.stat-num');
  if (!statNumElement || !statNumElement.firstChild) {
    return;
  }

  box.addEventListener('mouseenter', () => animateCounter(statNumElement));
});

const obs = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), index * 80);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach((element) => obs.observe(element));
