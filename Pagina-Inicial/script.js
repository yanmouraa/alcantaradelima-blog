'use strict';

const HERO_IMG = 'imagens/ponte.jpg';
const BLOG_IMAGES = {
  '.blog-card__img--1': 'imagens/Torre_de_Belem.jpg',
  '.blog-card__img--2': 'imagens/Opera_de_Arame.jpeg',
  '.blog-card__img--3': 'imagens/Arco_da_Rua_Augusta.jpeg'
};

document.addEventListener('DOMContentLoaded', function() {

  // Aplica a foto no hero e nos cards do blog
  const heroBg = document.getElementById('heroBg');
  if (heroBg) heroBg.style.backgroundImage = 'url(' + HERO_IMG + ')';
  Object.entries(BLOG_IMAGES).forEach(([selector, imageUrl]) => {
    const el = document.querySelector(selector);
    if (el) el.style.backgroundImage = 'url(' + imageUrl + ')';
  });

  // NAV
  const nav      = document.getElementById('nav');
  const navLinks = document.getElementById('navLinks');
  const burger   = document.getElementById('burger');
  const sections = document.querySelectorAll('section[id]');
  const allLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) current = s.id; });
    allLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href').replace('#','') === current));
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Mobile menu
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Reveal ao rolar
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // Scroll suave
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const t = document.querySelector(this.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
  });

  // Mascara telefone
  const tel = document.getElementById('telefone');
  if (tel) {
    tel.addEventListener('input', function() {
      let v = this.value.replace(/\D/g,'').slice(0,11);
      if (v.length>10)     v=v.replace(/^(\d{2})(\d{5})(\d{4})$/,'($1) $2-$3');
      else if(v.length>6)  v=v.replace(/^(\d{2})(\d{4})(\d*)$/,'($1) $2-$3');
      else if(v.length>2)  v=v.replace(/^(\d{2})(\d*)$/,'($1) $2');
      this.value = v;
    });
  }

  // Formulario
  const form = document.getElementById('contactForm');
  if (form) {
    const se = (id,msg) => { const f=document.getElementById(id),er=document.getElementById(id+'-error'); if(f)f.classList.add('error'); if(er)er.textContent=msg; };
    const ce = (id)      => { const f=document.getElementById(id),er=document.getElementById(id+'-error'); if(f)f.classList.remove('error'); if(er)er.textContent=''; };
    ['nome','email','assunto','mensagem'].forEach(id => {
      const el=document.getElementById(id);
      if(el){ el.addEventListener('input',()=>ce(id)); el.addEventListener('change',()=>ce(id)); }
    });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const n=document.getElementById('nome').value.trim();
      const em=document.getElementById('email').value.trim();
      const a=document.getElementById('assunto').value;
      const m=document.getElementById('mensagem').value.trim();
      const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let ok=true;
      if(!n||n.length<3)      { se('nome','Informe seu nome completo.');             ok=false; } else ce('nome');
      if(!em||!emailRe.test(em)){ se('email','Informe um e-mail valido.');           ok=false; } else ce('email');
      if(!a)                   { se('assunto','Selecione o assunto.');                ok=false; } else ce('assunto');
      if(!m||m.length<10)      { se('mensagem','Descreva sua mensagem (min. 10 chars).'); ok=false; } else ce('mensagem');
      if(!ok) return;
      const btn=document.getElementById('submitBtn'),bt=document.getElementById('btnText'),bs=document.getElementById('btnSpinner');
      btn.disabled=true; bt.textContent='Enviando...'; bs.hidden=false;
      // Para envio real: substitua o setTimeout abaixo por uma chamada fetch() ao Formspree ou EmailJS
      await new Promise(r=>setTimeout(r,1800));
      btn.disabled=false; bt.textContent='Enviar mensagem'; bs.hidden=true;
      const fs=document.getElementById('formSuccess'); fs.hidden=false;
      form.reset();
      fs.scrollIntoView({behavior:'smooth',block:'nearest'});
      setTimeout(()=>{ fs.hidden=true; },6000);
    });
  }

});
