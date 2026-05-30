/* ─── Language toggle ───────────────────────────────────────────────────────── */
let currentLang = 'fr';

const langToggle = document.getElementById('lang-toggle');
const langFrLabel = langToggle.querySelector('.lang-fr');
const langEnLabel = langToggle.querySelector('.lang-en');

function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll('.fr').forEach(el => el.classList.toggle('hidden', lang !== 'fr'));
  document.querySelectorAll('.en').forEach(el => el.classList.toggle('hidden', lang !== 'en'));

  langFrLabel.classList.toggle('active', lang === 'fr');
  langEnLabel.classList.toggle('active', lang === 'en');

  // Update select options for contact form
  updateSelectOptions(lang);
}

function updateSelectOptions(lang) {
  const select = document.getElementById('subject');
  if (!select) return;
  const options = {
    fr: ['Sélectionner…', 'Droit criminel', 'Immigration', 'Droit carcéral', 'Droit de la jeunesse', 'Autre'],
    en: ['Select…', 'Criminal Law', 'Immigration', 'Carceral Law', 'Youth Law', 'Other'],
  };
  [...select.options].forEach((opt, i) => { opt.text = options[lang][i]; });
  select.options[0].disabled = true;
}

langToggle.addEventListener('click', () => {
  setLang(currentLang === 'fr' ? 'en' : 'fr');
});

/* ─── Nav scroll state ──────────────────────────────────────────────────────── */
const nav = document.getElementById('nav');
function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ─── Mobile hamburger ──────────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ─── Scroll fade-in ────────────────────────────────────────────────────────── */
const fadeEls = document.querySelectorAll('.service-card, .about-block, .contact-item, .section-header, .about-text, .contact-info, .contact-form');
fadeEls.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

/* ─── Contact form (client-side only) ──────────────────────────────────────── */
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('.form-submit');
  btn.textContent = currentLang === 'fr' ? 'Envoyé ✓' : 'Sent ✓';
  btn.disabled = true;
  btn.style.background = '#16a34a';
  btn.style.borderColor = '#16a34a';
  setTimeout(() => {
    btn.innerHTML = currentLang === 'fr' ? '<span class="fr">Envoyer</span>' : '<span class="en">Send</span>';
    btn.disabled = false;
    btn.style.background = '';
    btn.style.borderColor = '';
    form.reset();
  }, 3000);
});

/* ─── Init ──────────────────────────────────────────────────────────────────── */
setLang('fr');
