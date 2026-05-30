/* ─── Language ───────────────────────────────────────────────────────────────── */
let currentLang = localStorage.getItem('lang') || 'fr';

const langToggle = document.getElementById('lang-toggle');
const langFrLabel = langToggle && langToggle.querySelector('.lang-fr');
const langEnLabel = langToggle && langToggle.querySelector('.lang-en');

const SELECT_OPTIONS = {
  fr: ['Sélectionner…', 'Droit criminel', 'Immigration', 'Droit carcéral', 'Droit de la jeunesse', 'Autre'],
  en: ['Select…', 'Criminal Law', 'Immigration', 'Carceral Law', 'Youth Law', 'Other'],
};

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('.fr').forEach(el => el.classList.toggle('hidden', lang !== 'fr'));
  document.querySelectorAll('.en').forEach(el => el.classList.toggle('hidden', lang !== 'en'));

  if (langFrLabel) langFrLabel.classList.toggle('active', lang === 'fr');
  if (langEnLabel) langEnLabel.classList.toggle('active', lang === 'en');

  const select = document.getElementById('subject');
  if (select) {
    const opts = SELECT_OPTIONS[lang];
    [...select.options].forEach((opt, i) => { if (opts[i]) opt.text = opts[i]; });
    select.options[0].disabled = true;
    select.options[0].selected = true;
  }
}

if (langToggle) {
  langToggle.addEventListener('click', () => setLang(currentLang === 'fr' ? 'en' : 'fr'));
}

/* ─── Nav scroll / solid ─────────────────────────────────────────────────────── */
const nav = document.getElementById('nav');

function updateNav() {
  if (!nav) return;
  if (nav.classList.contains('nav-solid')) return;
  nav.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ─── Mobile hamburger ──────────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* ─── Dropdown (mobile tap) ─────────────────────────────────────────────────── */
document.querySelectorAll('.dropdown-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.stopPropagation();
      btn.closest('.dropdown').classList.toggle('open');
    }
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
});

/* ─── Scroll fade-in ────────────────────────────────────────────────────────── */
const fadeTargets = document.querySelectorAll(
  '.service-card, .about-block, .contact-item, .section-header, .about-text, .contact-info, .contact-form, .check-item, .process-item, .value-card, .sidebar-card, .remote-banner, .cabinet-grid'
);
fadeTargets.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 55);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeTargets.forEach(el => observer.observe(el));

/* ─── Contact form ──────────────────────────────────────────────────────────── */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const original = btn.innerHTML;
    btn.textContent = currentLang === 'fr' ? 'Envoyé ✓' : 'Sent ✓';
    btn.disabled = true;
    btn.style.cssText = 'background:#16a34a;border-color:#16a34a;cursor:default';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.cssText = '';
      form.reset();
      setLang(currentLang);
    }, 3000);
  });
}

/* ─── Init ──────────────────────────────────────────────────────────────────── */
setLang(currentLang);
