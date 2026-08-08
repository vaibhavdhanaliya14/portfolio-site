document.addEventListener('DOMContentLoaded', () => {
  // Navigation Hamburger Toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Contact Form Handling & Client Validation
  const contactForm = document.getElementById('contact-form');
  const formAlert = document.getElementById('form-alert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showAlert('Please fill in all required fields.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showAlert('Please enter a valid email address.', 'error');
        return;
      }

      showAlert('Thank you! Your message has been sent successfully.', 'success');
      contactForm.reset();
    });
  }

  function showAlert(message, type) {
    if (!formAlert) return;
    formAlert.textContent = message;
    formAlert.className = `alert ${type}`;
    formAlert.classList.remove('hidden');

    setTimeout(() => {
      formAlert.classList.add('hidden');
    }, 4000);
  }
});