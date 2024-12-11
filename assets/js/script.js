// main.js

// Handle Navigation Toggle for Mobile
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Smooth Scroll for Internal Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Dynamically Add Social Media Icons
const socialsContainer = document.querySelector('.footer-socials');
if (socialsContainer) {
  const socials = [
    { platform: 'Twitter', url: 'https://twitter.com/wizcann', icon: 'fab fa-twitter' },
    { platform: 'GitHub', url: 'https://github.com/wizcann', icon: 'fab fa-github' },
    { platform: 'Instagram', url: 'https://instagram.com/wizcann', icon: 'fab fa-instagram' },
    { platform: 'Facebook', url: 'https://facebook.com/wiizcann', icon: 'fab fa-facebook' },
  ];

  socials.forEach(({ platform, url, icon }) => {
    const socialLink = document.createElement('a');
    socialLink.href = url;
    socialLink.target = '_blank';
    socialLink.rel = 'noopener noreferrer';
    socialLink.innerHTML = `<i class="${icon}" aria-hidden="true"></i>`;
    socialLink.title = `Follow me on ${platform}`;
    socialsContainer.appendChild(socialLink);
  });
}

// Change Favicon Dynamically
function setFavicon(iconUrl) {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = iconUrl;
}

// Set your custom favicon here
setFavicon('https://wizcann.is-a.dev/assets/images/favicon.ico');
