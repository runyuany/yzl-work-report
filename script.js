const header = document.querySelector('[data-header]');
const backTop = document.querySelector('[data-back-top]');
const navLinks = Array.from(document.querySelectorAll('.nav a'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function updateChrome() {
  const offset = window.scrollY;
  header?.classList.toggle('is-scrolled', offset > 8);
  if (backTop) {
    backTop.hidden = offset < 520;
  }
}

function updateActiveNav() {
  const current = sections
    .slice()
    .reverse()
    .find((section) => section.getBoundingClientRect().top <= 120);

  navLinks.forEach((link) => {
    const target = link.getAttribute('href').slice(1);
    link.classList.toggle('is-active', Boolean(current && current.id === target));
  });
}

function activateTab(root, tabName) {
  const buttons = Array.from(root.querySelectorAll('[data-tab]'));
  const panels = Array.from(root.querySelectorAll('[data-panel]'));

  buttons.forEach((button) => {
    const active = button.dataset.tab === tabName;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
  });

  panels.forEach((panel) => {
    const active = panel.dataset.panel === tabName;
    panel.classList.toggle('is-active', active);
    panel.hidden = !active;
  });
}

document.querySelectorAll('[data-tabs]').forEach((tabs) => {
  tabs.addEventListener('click', (event) => {
    const button = event.target.closest('[data-tab]');
    if (!button) return;
    activateTab(tabs, button.dataset.tab);
  });

  tabs.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

    const buttons = Array.from(tabs.querySelectorAll('[data-tab]'));
    const currentIndex = buttons.findIndex((button) => button.getAttribute('aria-selected') === 'true');
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % buttons.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = buttons.length - 1;

    event.preventDefault();
    buttons[nextIndex].focus();
    activateTab(tabs, buttons[nextIndex].dataset.tab);
  });
});

backTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  updateChrome();
  updateActiveNav();
}, { passive: true });

updateChrome();
updateActiveNav();
