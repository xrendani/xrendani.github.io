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
document.body.appendChild(themeToggle);

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Check for saved theme preference
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Typing effect for hero section
const heroText = document.querySelector('.hero h1');
const originalText = heroText.textContent;
heroText.textContent = '';

let i = 0;
const typingSpeed = 100;

function typeWriter() {
    if (i < originalText.length) {
        heroText.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeWriter, typingSpeed);
    }
}

typeWriter();

// Project card hover animations
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.tech-grid, .projects, .hero').forEach(section => {
    observer.observe(section);
});

// Add some additional CSS through JavaScript
const style = document.createElement('style');
style.textContent = `
    .light-mode {
        --primary: #F5F5F5;
        --secondary: #FFFFFF;
        --text: #2A2A2A;
        --code-bg: #F0F0F0;
    }

    .project-card {
        position: relative;
        overflow: hidden;
    }

    .project-card::after {
        content: '';
        position: absolute;
        top: var(--mouse-y, 0);
        left: var(--mouse-x, 0);
        width: 200px;
        height: 200px;
        background: radial-gradient(circle closest-side, rgba(0,255,136,0.2), transparent);
        transform: translate(-50%, -50%);
        pointer-events: none;
    }

    .tech-grid, .projects, .hero {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }

    .visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
