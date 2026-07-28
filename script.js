'use strict';

// ==================== CONSTANTES ====================
const HERO_IMG = 'imagens/ponte.jpg';
const BLOG_IMAGES = {
  '.blog-card__img--1': 'imagens/Torre_de_Belem.jpg',
  '.blog-card__img--2': 'imagens/Opera_de_Arame.jpeg',
  '.blog-card__img--3': 'imagens/Arco_da_Rua_Augusta.jpeg'
};

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function() {
  loadBackgroundImages();
  initializeNavigation();
  initializeMobileMenu();
  initializeScrollReveal();
  initializeSmoothScroll();
  initializePhoneMask();
  initializeContactForm();
});

// ==================== IMAGENS DE FUNDO ====================
/**
 * Carrega imagens de fundo no hero e nos cards do blog
 */
function loadBackgroundImages() {
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    heroBg.style.backgroundImage = `url(${HERO_IMG})`;
  }

  Object.entries(BLOG_IMAGES).forEach(([selector, imageUrl]) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.backgroundImage = `url(${imageUrl})`;
    }
  });
}

// ==================== NAVEGAÇÃO ====================
/*Inicializa a navegação com destaque da seção ativa ao rolar*/
function initializeNavigation() {
  const nav = document.getElementById('nav');
  const navLinks = document.getElementById('navLinks');
  const sections = document.querySelectorAll('section[id]');
  const allLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

  /*Atualiza a navegação ao rolar a página*/
  function updateActiveNavLink() {
    // Adiciona classe 'scrolled' quando scroll > 20px
    nav.classList.toggle('scrolled', window.scrollY > 20);

    // Encontra a seção atual
    let currentSection = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 130) {
        currentSection = section.id;
      }
    });

    // Marca o link ativo
    allLinks.forEach(link => {
      const sectionId = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', sectionId === currentSection);
    });
  }

  // Listeners do scroll
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();
}

// ==================== MENU MOBILE ====================
/**
 * Inicializa o menu mobile (hamburger)
 */
function initializeMobileMenu() {
  const nav = document.getElementById('nav');
  const navLinks = document.getElementById('navLinks');
  const burger = document.getElementById('burger');

  /**
   * Fecha o menu mobile
   */
  function closeMobileMenu() {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Clique no burger
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Clique em um link do menu
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Clique fora do menu
  document.addEventListener('click', (event) => {
    const isClickOutside = !nav.contains(event.target);
    const isMenuOpen = navLinks.classList.contains('open');

    if (isClickOutside && isMenuOpen) {
      closeMobileMenu();
    }
  });
}

// ==================== ANIMAÇÃO AO ROLAR ====================
/**
 * Inicializa animações de reveal ao rolar a página
 */
function initializeScrollReveal() {
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observa todos os elementos com classe 'reveal'
  document.querySelectorAll('.reveal').forEach((element) => {
    observer.observe(element);
  });
}

// ==================== SCROLL SUAVE ====================
/**
 * Inicializa scroll suave para links internos
 */
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function(event) {
      const targetSelector = this.getAttribute('href');
      const targetElement = document.querySelector(targetSelector);

      if (!targetElement) return;

      event.preventDefault();

      // Obtém altura da navegação do CSS
      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
      ) || 72;

      // Calcula posição de scroll
      const scrollPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    });
  });
}

// ==================== SCROLL SUAVE CARDS ==================== /**


// ==================== MÁSCARA DE TELEFONE ====================
/**
 * Inicializa máscara de formatação para campo de telefone
 */
function initializePhoneMask() {
  const phoneInput = document.getElementById('telefone');

  if (!phoneInput) return;

  phoneInput.addEventListener('input', function() {
    // Remove tudo que não é número
    let value = this.value.replace(/\D/g, '').slice(0, 11);

    // Formata conforme a quantidade de números
    if (value.length > 10) {
      // (XX) XXXXX-XXXX
      value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length > 6) {
      // (XX) XXXX-XXX
      value = value.replace(/^(\d{2})(\d{4})(\d*)$/, '($1) $2-$3');
    } else if (value.length > 2) {
      // (XX) XXX
      value = value.replace(/^(\d{2})(\d*)$/, '($1) $2');
    }

    this.value = value;
  });
}

// ==================== FORMULÁRIO DE CONTATO ====================
/**
 * Inicializa validação e envio do formulário de contato
 */
function initializeContactForm() {
  const form = document.getElementById('contactForm');

  if (!form) return;

  const fieldIds = ['nome', 'email', 'assunto', 'mensagem'];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Marca um campo como erro
   */
  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);

    if (field) field.classList.add('error');
    if (errorElement) errorElement.textContent = message;
  }

  /**
   * Remove erro de um campo
   */
  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);

    if (field) field.classList.remove('error');
    if (errorElement) errorElement.textContent = '';
  }

  // Limpa erros ao digitar
  fieldIds.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('input', () => clearError(fieldId));
      field.addEventListener('change', () => clearError(fieldId));
    }
  });

  // Validação e envio do formulário
  form.addEventListener('submit', async function(event) {
    // 1. Intercepta o envio para validar os campos primeiro
    event.preventDefault();

    // Coleta valores dos campos
    const name = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('assunto').value;
    const message = document.getElementById('mensagem').value.trim();

    // Lógica de Validação
    let isValid = true;

    if (!name || name.length < 3) {
      showError('nome', 'Informe seu nome completo.');
      isValid = false;
    } else {
      clearError('nome');
    }

    if (!email || !emailRegex.test(email)) {
      showError('email', 'Informe um e-mail válido.');
      isValid = false;
    } else {
      clearError('email');
    }

    if (!subject) {
      showError('assunto', 'Selecione o assunto.');
      isValid = false;
    } else {
      clearError('assunto');
    }

    if (!message || message.length < 10) {
      showError('mensagem', 'Descreva sua mensagem (mín. 10 caracteres).');
      isValid = false;
    } else {
      clearError('mensagem');
    }

    // Se NÃO for válido, para a execução aqui
    if (!isValid) return;

    // 2. Se chegou aqui, os dados estão corretos! 
    // Vamos preparar o botão visualmente
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    submitBtn.disabled = true;
    btnText.textContent = 'Enviando...';
    btnSpinner.hidden = false;

    // 3. Envia o formulário usando Fetch API
    try {
      const formData = new FormData(form);
      
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // SUCESSO
        form.reset();
        document.getElementById('formSuccess').hidden = false; // Mostra sua div de sucesso
        btnText.textContent = 'Enviado!';
        
        // Scroll suave até a mensagem de sucesso
        document.getElementById('formSuccess').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        // ERRO DO SERVIDOR
        alert('Ops! Algo deu errado no servidor. Tente novamente.');
        btnText.textContent = 'Tentar novamente';
      }
    } catch (error) {
      // ERRO DE CONEXÃO
      alert('Erro de conexão. Verifique sua internet.');
      btnText.textContent = 'Erro ao enviar';
    } finally {
      // Finaliza o estado do botão
      submitBtn.disabled = false;
      btnSpinner.hidden = true;
    } 
});
}
