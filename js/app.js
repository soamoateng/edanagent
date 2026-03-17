/**
 * Edanagent - Mobile-first interactive JavaScript
 * Handles: Mobile menu toggle, navbar scroll, smooth scrolling, form validation
 */

document.addEventListener('DOMContentLoaded', function() {
  
  /* Mobile menu toggle - FIXED: Robust implementation */
  function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const hamburger = document.getElementById('hamburger-btn');
    const closeBtn = document.getElementById('menu-close-btn');
    
    if (menu.classList.contains('show')) {
      // Close menu
      menu.classList.remove('show');
      hamburger.textContent = '☰';
      hamburger.setAttribute('aria-expanded', 'false');
      closeBtn.style.display = 'none';
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    } else {
      // Open menu
      menu.classList.add('show');
      hamburger.textContent = '×';
      hamburger.setAttribute('aria-expanded', 'true');
      closeBtn.style.display = 'block';
      menu.setAttribute('aria-hidden', 'false');
      menu.focus();
      document.body.style.overflow = 'hidden';
    }
  }

  /* Navbar scroll effect */
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* Smooth scrolling for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const targetId = a.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        const navbarHeight = 70;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        // Close mobile menu if open
        if (document.getElementById('mobile-menu').classList.contains('show')) {
          toggleMenu();
        }
      }
    });
  });

  /* Form validation - FIXED: Clean validation */
  const searchForm = document.getElementById('searchForm');
  const locationSelect = document.getElementById('location');
  const searchBtn = document.getElementById('searchBtn');
  const locationError = document.getElementById('location-error');

  function validateForm() {
    if (!locationSelect.value) {
      locationError.style.display = 'block';
      locationSelect.style.borderColor = '#ef4444';
      locationSelect.focus();
      return false;
    }
    locationError.style.display = 'none';
    locationSelect.style.borderColor = '';
    return true;
  }

  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm()) {
      searchBtn.disabled = true;
      searchBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Searching...';
      setTimeout(() => {
        const params = new URLSearchParams({
          location: locationSelect.value,
          type: document.getElementById('type').value,
          budget: document.getElementById('budget').value
        });
        window.location.href = `/search?${params}`;
      }, 800);
    }
  });

  locationSelect.addEventListener('change', () => {
    locationError.style.display = 'none';
    if (locationSelect.value) {
      locationSelect.style.borderColor = '';
    }
  });

  /* FIXED: Outside click handler - PROTECTS FORM INTERACTIONS */
  let menuOpenState = false;
  document.addEventListener('click', e => {
    const menu = document.getElementById('mobile-menu');
    const hamburger = document.getElementById('hamburger-btn');
    const closeBtn = document.getElementById('menu-close-btn');
    
    // PROTECT FORM INTERACTIONS - Never toggle on form clicks
    if (e.target.closest('#searchForm') || 
        e.target.closest('.hero-card') || 
        e.target.closest('.form-s') ||
        e.target.closest('.form-i') ||
        e.target.closest('label')) {
      return; // FORM SAFE ZONE
    }
    
    // Only toggle if clicking hamburger/close button OR true outside click when menu open
    if (e.target === hamburger || e.target === closeBtn) {
      toggleMenu();
    } else if (menuOpenState && !menu.contains(e.target) && e.target !== hamburger) {
      toggleMenu();
    }
  });

  /* Keyboard navigation - ESC closes menu */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const menu = document.getElementById('mobile-menu');
      if (menu.classList.contains('show')) {
        toggleMenu();
      }
    }
  });

  /* Expose toggleMenu globally for onclick handlers */
  window.toggleMenu = toggleMenu;
});
