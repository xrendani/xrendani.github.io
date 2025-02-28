// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Dark/Light mode toggle
const themeToggle = document.createElement('div');
themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
themeToggle.style.position = 'fixed';
themeToggle.style.bottom = '20px';
themeToggle.style.right = '20px';
themeToggle.style.cursor = 'pointer';
themeToggle.style.zIndex = '1000';
themeToggle.style.padding = '10px';
themeToggle.style.background = 'rgba(255, 255, 255, 0.1)';
themeToggle.style.borderRadius = '50%';
themeToggle.style.transition = 'background 0.3s ease';
document.body.appendChild(themeToggle);

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    themeToggle.style.background = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Check for saved theme preference
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    themeToggle.style.background = 'rgba(0, 0, 0, 0.1)';
}

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = (elementTop < window.innerHeight) && (elementBottom >= 0);
        if (isVisible) {
            element.classList.add('visible');
        }
    });
};

// Add fade-in class to elements
document.querySelectorAll('.hero h1, .hero p, .video-container, .tech-grid, .social-links').forEach(element => {
    element.classList.add('fade-in');
});

// Trigger animations on scroll
window.addEventListener('scroll', animateOnScroll);
animateOnScroll(); // Initial check

// Add hover effect to tech cards
const techCards = document.querySelectorAll('.tech-card');
techCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Add hover effect to social icons
const socialIcons = document.querySelectorAll('.social-icon');
socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'translateY(-5px)';
    });
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'translateY(0)';
    });
});
