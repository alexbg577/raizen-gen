// Copy to clipboard
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    btn.textContent = 'Copied!';
    btn.style.background = 'var(--accent)';
    setTimeout(() => { btn.textContent = 'Copy'; btn.style.background = ''; }, 2000);
  });
}

// Countdown timers
function updateCountdowns() {
  document.querySelectorAll('.countdown').forEach(el => {
    const ends = parseInt(el.dataset.ends);
    const remaining = ends - Date.now();
    if (remaining <= 0) { el.textContent = 'Ended'; return; }
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    el.textContent = `${h}h ${m}m ${s}s`;
  });
}
setInterval(updateCountdowns, 1000);
updateCountdowns();

// Tier radio visual
document.querySelectorAll('.tier-option input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.tier-card').forEach(c => c.style.borderColor = '');
  });
});

// Animate numbers
function animateNumbers() {
  document.querySelectorAll('.stat-num, .stock-count').forEach(el => {
    const target = parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
    if (!target) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 20);
  });
}
window.addEventListener('load', animateNumbers);

// Smooth reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } });
}, { threshold: 0.1 });

document.querySelectorAll('.stock-card, .feature-card, .lb-row, .giveaway-card, .dash-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  observer.observe(el);
});
