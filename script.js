const ctaButton = document.querySelector('.nav-cta');
const ctaSection = document.getElementById('cta');

if (ctaButton && ctaSection) {
  ctaButton.addEventListener('click', () => {
    ctaSection.scrollIntoView({ behavior: 'smooth' });
  });
}

const obs = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), index * 80);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach((element) => obs.observe(element));
