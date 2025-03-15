document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Fetch and display GitHub repositories
    async function fetchGitHubRepos() {
        try {
            const response = await fetch('https://api.github.com/users/manugeni/repos?sort=updated&per_page=6');
            const repos = await response.json();
            
            const projectsContainer = document.getElementById('projects-container');
            
            repos.forEach(repo => {
                if (!repo.fork) {  // Only show non-forked repositories
                    const card = document.createElement('div');
                    card.className = 'project-card';
                    
                    card.innerHTML = `
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'No description available'}</p>
                        <div class="project-stats">
                            <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                            <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                        </div>
                        <a href="${repo.html_url}" target="_blank" class="project-link">
                            View Project <i class="fas fa-external-link-alt"></i>
                        </a>
                    `;
                    
                    projectsContainer.appendChild(card);
                }
            });
        } catch (error) {
            console.error('Error fetching repositories:', error);
        }
    }

    // Initialize repositories
    fetchGitHubRepos();

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Add parallax effect to background
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        document.querySelector('.background-animation').style.transform = 
            `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
    });
});

// Add dynamic typing effect to subtitle
const subtitles = ['Developer', 'Creator', 'Innovator'];
let currentSubtitleIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 1000;

function typeEffect() {
    const subtitle = document.querySelector('.subtitle');
    const currentSubtitle = subtitles[currentSubtitleIndex];

    if (isDeleting) {
        subtitle.textContent = currentSubtitle.substring(0, currentCharIndex - 1);
        currentCharIndex--;
    } else {
        subtitle.textContent = currentSubtitle.substring(0, currentCharIndex + 1);
        currentCharIndex++;
    }

    if (!isDeleting && currentCharIndex === currentSubtitle.length) {
        isDeleting = true;
        setTimeout(() => typeEffect(), pauseTime);
        return;
    }

    if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentSubtitleIndex = (currentSubtitleIndex + 1) % subtitles.length;
    }

    setTimeout(() => typeEffect(), isDeleting ? deletingSpeed : typingSpeed);
}

// Start the typing effect
setTimeout(() => typeEffect(), pauseTime);
