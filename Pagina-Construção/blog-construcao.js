// ============================================================
//  BLOG — Em Construção | Alcântara de Lima Advocacia
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Reveal animation ao carregar ──
  const revealEls = document.querySelectorAll('.reveal');
  setTimeout(() => {
    revealEls.forEach(el => el.classList.add('visible'));
  }, 80);

  // ── Menu mobile (burger) ──
  const burger   = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });

  // Fechar menu ao clicar em qualquer link
  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    });
  });

  // ── Nav sombra ao rolar ──
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

});
