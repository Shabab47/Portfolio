const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('active'));
});

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '50px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

document.getElementById('sendBtn').addEventListener('click', async function() {
  const btn = this;
  const form = btn.closest('form');
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = 'Sending...';

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: 'service_a2xgcqk',
        template_id: 'template_41tv1vr',
        user_id: 'hqXk3Vvb6U-Tgamhw',
        template_params: {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          title: document.getElementById('subject').value || 'Portfolio Contact',
          time: new Date().toLocaleString(),
          message: `From: ${document.getElementById('name').value} (${document.getElementById('email').value})\nSubject: ${document.getElementById('subject').value || 'Portfolio Contact'}\n\n${document.getElementById('message').value}`,
        }
      })
    });

    if (response.ok) {
      btn.innerHTML = 'Message Sent! \u2714';
      btn.style.background = '#4ade80';
      form.reset();
    } else {
      const errText = await response.text();
      console.error('EmailJS Response:', response.status, errText);
      throw new Error(errText);
    }
  } catch (err) {
    btn.innerHTML = 'Error. Try Again \u2716';
    btn.style.background = '#ef4444';
    console.error('EmailJS Error:', err);
  }

  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '';
    btn.disabled = false;
  }, 3000);
});
