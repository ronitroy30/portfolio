// Fade in on load
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  revealOnScroll();
});

// Modal
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");

document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const projectName = button.getAttribute('data-project');
    modal.classList.add('open');
    modalBody.innerHTML = `<p>More details about <strong>${projectName}</strong>.</p>`;
  });
});

modalClose.addEventListener('click', () => {
  modal.classList.remove('open');
});
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('open');
});

// Reveal on scroll
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('anim-up');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
