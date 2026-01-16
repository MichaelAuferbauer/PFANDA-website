// ============================================
// PFANDA - Main JavaScript
// Interaktive UX Features
// ============================================

(function() {
  'use strict';

  // ============================================
  // Entry Point: DOMContentLoaded
  // ============================================
  // Alle Features werden erst initialisiert, wenn das DOM vollständig geladen ist
  // Verhindert Fehler durch fehlende Elemente und verbessert Performance
  document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initActiveNavItem();
    initSmoothScroll();
    initFAQAccordion();
    initStickyCTA();
    initBackToTop();
    initLightbox();
    initFormValidation();
  });

  // ============================================
  // 1. Mobile Menu Toggle
  // ============================================
  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Defensive Check: Nur initialisieren, wenn Elemente existieren
    if (!menuToggle || !navMenu) return;

    // Toggle Menu beim Klick auf Toggle-Button
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });

    // Schließen beim Klick auf Nav-Link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
      });
    });

    // Schließen beim Klick außerhalb
    document.addEventListener('click', function(event) {
      if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        navMenu.classList.remove('active');
      }
    });
  }

  // ============================================
  // 2. Active Navigation Item
  // ============================================
  function initActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
      try {
        const linkPath = new URL(link.href).pathname;
        if (linkPath === currentPath || 
            (currentPath === '/' && linkPath.includes('index.html')) ||
            (currentPath.endsWith('/') && linkPath.includes('index.html'))) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      } catch (e) {
        // Ignoriere Fehler bei relativen URLs
      }
    });
  }

  // ============================================
  // 3. Smooth Scroll mit Offset für Sticky Navbar
  // ============================================
  // Alle Anchor-Links scrollen weich zur Ziel-Sektion
  // Berücksichtigt die Höhe der Sticky Navbar für korrekten Offset
  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Ignoriere leere Anchors (#)
        if (href === '#' || href === '#!') return;
        
        // Finde Ziel-Element
        const target = document.querySelector(href);
        
        // Defensive Check: Nur scrollen, wenn Ziel existiert
        if (!target) return;
        
        e.preventDefault();
        
        // Berechne Offset für Sticky Navbar
        // Navbar ist ca. 60-70px hoch, plus etwas Padding
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const offset = navbarHeight + 20; // 20px zusätzlicher Abstand
        
        // Berechne Ziel-Position
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        // Smooth Scroll
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  // ============================================
  // 4. FAQ Accordion mit max-height Transition
  // ============================================
  // Struktur: .faq-item mit .faq-question (Header) + .faq-answer (Content)
  // Öffnet ein Item, schließt automatisch alle anderen
  // Tastatur-freundlich (Enter/Space)
  function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Defensive Check: Nur initialisieren, wenn FAQ-Items existieren
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      
      // Defensive Check: Nur wenn beide Elemente existieren
      if (!question || !answer) return;

      // Klick-Handler
      const handleToggle = function() {
        const isOpen = answer.classList.contains('is-open');
        
        // Schließe alle anderen Items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            const otherAnswer = otherItem.querySelector('.faq-answer');
            const otherQuestion = otherItem.querySelector('.faq-question');
            if (otherAnswer) otherAnswer.classList.remove('is-open');
            if (otherQuestion) otherQuestion.classList.remove('is-open');
          }
        });
        
        // Toggle aktuelles Item
        if (isOpen) {
          answer.classList.remove('is-open');
          question.classList.remove('is-open');
        } else {
          answer.classList.add('is-open');
          question.classList.add('is-open');
        }
      };

      // Klick-Event
      question.addEventListener('click', handleToggle);
      
      // Tastatur-Support: Enter und Space
      question.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      });

      // Accessibility: Tabindex für Tastatur-Navigation
      question.setAttribute('tabindex', '0');
      question.setAttribute('role', 'button');
      question.setAttribute('aria-expanded', 'false');
      
      // Update aria-expanded beim Toggle
      const originalHandleToggle = handleToggle;
      question.addEventListener('click', function() {
        const isOpen = answer.classList.contains('is-open');
        question.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });
  }

  // ============================================
  // 5. Sticky CTA Button ("Warteliste")
  // ============================================
  // Button ist initial unsichtbar
  // Wird sichtbar ab 25% Scroll-Tiefe
  // Klick scrollt zur Wartelisten-Sektion
  function initStickyCTA() {
    // Erstelle Button, falls er nicht existiert
    let stickyCTA = document.querySelector('.sticky-cta');
    
    if (!stickyCTA) {
      // Prüfe, ob Wartelisten-Sektion existiert
      const waitlistSection = document.querySelector('#warteliste');
      if (!waitlistSection) return; // Keine Warteliste = kein Button nötig
      
      // Erstelle Button dynamisch
      stickyCTA = document.createElement('a');
      stickyCTA.href = '#warteliste';
      stickyCTA.className = 'sticky-cta btn';
      stickyCTA.textContent = 'Warteliste';
      document.body.appendChild(stickyCTA);
    }

    // Scroll-Handler: Zeige Button ab 25% Scroll-Tiefe
    function handleScroll() {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent >= 25) {
        stickyCTA.classList.add('is-visible');
      } else {
        stickyCTA.classList.remove('is-visible');
      }
    }

    // Initial Check
    handleScroll();
    
    // Throttle Scroll-Event für bessere Performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ============================================
  // 6. Back-to-Top Button
  // ============================================
  // Unsichtbar bis 40% Scroll-Tiefe
  // Klick scrollt weich nach ganz oben
  function initBackToTop() {
    // Erstelle Button, falls er nicht existiert
    let backToTop = document.querySelector('.back-to-top');
    
    if (!backToTop) {
      backToTop = document.createElement('button');
      backToTop.className = 'back-to-top';
      backToTop.innerHTML = '↑';
      backToTop.setAttribute('aria-label', 'Nach oben scrollen');
      document.body.appendChild(backToTop);
    }

    // Scroll-Handler: Zeige Button ab 40% Scroll-Tiefe
    function handleScroll() {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent >= 40) {
        backToTop.classList.add('is-visible');
        
        // Position anpassen, wenn Sticky CTA auch sichtbar ist
        const stickyCTA = document.querySelector('.sticky-cta.is-visible');
        if (stickyCTA) {
          backToTop.style.bottom = 'calc(var(--spacing-lg) + 60px)';
        } else {
          backToTop.style.bottom = '';
        }
      } else {
        backToTop.classList.remove('is-visible');
      }
    }

    // Klick-Handler: Scroll nach oben
    backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Initial Check
    handleScroll();
    
    // Throttle Scroll-Event für bessere Performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    // Beobachte Sticky CTA für Position-Anpassung
    const stickyCTA = document.querySelector('.sticky-cta');
    if (stickyCTA) {
      const observer = new MutationObserver(function() {
        if (stickyCTA.classList.contains('is-visible') && backToTop.classList.contains('is-visible')) {
          backToTop.style.bottom = 'calc(var(--spacing-lg) + 60px)';
        } else {
          backToTop.style.bottom = '';
        }
      });
      observer.observe(stickyCTA, { attributes: true, attributeFilter: ['class'] });
    }
  }

  // ============================================
  // 7. Screenshot Lightbox / Modal
  // ============================================
  // Klick auf .screenshot öffnet zentriertes Modal
  // Schließen durch ESC, Overlay-Klick oder Close-Icon
  // Scroll im Hintergrund wird deaktiviert
  function initLightbox() {
    const screenshots = document.querySelectorAll('.screenshot');
    
    // Defensive Check: Nur initialisieren, wenn Screenshots existieren
    if (screenshots.length === 0) return;

    // Erstelle Lightbox-Struktur
    let lightbox = document.querySelector('.lightbox');
    
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
          <button class="lightbox-close" aria-label="Schließen">×</button>
          <img class="lightbox-image" src="" alt="">
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    const overlay = lightbox.querySelector('.lightbox-overlay');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const image = lightbox.querySelector('.lightbox-image');

    // Öffnen der Lightbox
    function openLightbox(src, alt) {
      image.src = src;
      image.alt = alt || 'Bild';
      lightbox.classList.add('is-open');
      document.body.classList.add('no-scroll'); // Deaktiviere Scroll
    }

    // Schließen der Lightbox
    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('no-scroll'); // Aktiviere Scroll wieder
    }

    // Event-Handler für Screenshots
    screenshots.forEach(screenshot => {
      screenshot.addEventListener('click', function(e) {
        e.preventDefault();
        const src = this.src || this.getAttribute('data-src') || this.href;
        const alt = this.alt || this.getAttribute('alt') || 'Bild';
        if (src) {
          openLightbox(src, alt);
        }
      });
    });

    // Schließen durch Overlay-Klick
    if (overlay) {
      overlay.addEventListener('click', closeLightbox);
    }

    // Schließen durch Close-Button
    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    // Schließen durch ESC-Taste
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

  // ============================================
  // 8. Form Validation (Basic)
  // ============================================
  function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Überspringe Wartelisten-Formular (hat eigenes Script)
      if (form.id === 'waitlistForm') return;
      
      form.addEventListener('submit', function(e) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#dc3545';
          } else {
            field.style.borderColor = '';
          }
        });

        if (!isValid) {
          e.preventDefault();
          alert('Bitte füllen Sie alle Pflichtfelder aus.');
        }
      });
    });
  }

})();
