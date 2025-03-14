/**
 * Portfolio TypeScript-ready JavaScript
 * @author Rendani (manugeni)
 * @lastUpdated 2025-03-14 00:58:19
 */

/** @type {Object.<string, Function>} */
const Portfolio = {
    /**
     * Current timestamp for the application
     * @type {string}
     */
    currentTimestamp: '2025-03-14 00:58:19',

    /**
     * Initialize the portfolio application
     */
    init() {
        this.setupTheme();
        this.setupAnimations();
        this.setupNavigation();
        this.setupProjects();
        this.updateTimestamp();
        this.setupLogoAnimation();
        this.setupTechStackHighlight();
    },

    /**
     * Update the timestamp in the footer
     */
    updateTimestamp() {
        const timestampElement = document.querySelector('.last-updated');
        if (timestampElement) {
            timestampElement.textContent = `Last updated: ${this.currentTimestamp}`;
        }
    },

    /**
     * Handle theme setup and transitions
     */
    setupTheme() {
        const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const root = document.documentElement;

        const updateTheme = (e) => {
            const isDark = e.matches;
            const theme = {
                '--bg-primary': isDark ? '#0d1117' : '#ffffff',
                '--bg-secondary': isDark ? '#161b22' : '#f6f8fa',
                '--text-primary': isDark ? '#c9d1d9' : '#24292f',
                '--text-secondary': isDark ? '#8b949e' : '#57606a',
                '--accent': isDark ? '#58a6ff' : '#0969da',
                '--card-bg': isDark ? '#21262d' : '#ffffff',
                '--border-color': isDark ? '#30363d' : '#d0d7de'
            };

            Object.entries(theme).forEach(([key, value]) => {
                root.style.setProperty(key, value);
            });
        };

        prefersColorScheme.addEventListener('change', updateTheme);
        updateTheme(prefersColorScheme);
    },

    /**
     * Setup intersection observer for animations
     */
    setupAnimations() {
        const observerOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-enter-active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.project-card').forEach(card => {
            card.classList.add('fade-enter');
            observer.observe(card);
        });
    },

    /**
     * Setup smooth scrolling navigation
     */
    setupNavigation() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add scroll to top button functionality
        const scrollButton = document.createElement('button');
        scrollButton.className = 'scroll-to-top';
        scrollButton.innerHTML = '↑';
        scrollButton.style.display = 'none';
        document.body.appendChild(scrollButton);

        window.addEventListener('scroll', () => {
            scrollButton.style.display = window.scrollY > 500 ? 'block' : 'none';
        });

        scrollButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },

    /**
     * Setup project card interactions
     */
    setupProjects() {
        const projects = document.querySelectorAll('.project-card');
        
        projects.forEach(project => {
            // Mouse interactions
            project.addEventListener('mouseenter', () => {
                project.style.transform = 'translateY(-4px)';
                project.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            });

            project.addEventListener('mouseleave', () => {
                project.style.transform = 'translateY(0)';
                project.style.boxShadow = 'none';
            });

            // Touch interactions for mobile
            project.addEventListener('touchstart', () => {
                project.style.transform = 'translateY(-2px)';
            }, { passive: true });

            project.addEventListener('touchend', () => {
                project.style.transform = 'translateY(0)';
            });

            // Add click handler for project details
            project.addEventListener('click', (e) => {
                if (e.target.closest('a')) return; // Don't trigger if clicking a link
                
                const projectTitle = project.querySelector('.project-title').textContent;
                const projectDesc = project.querySelector('.project-description').textContent;
                
                this.showProjectDetails(projectTitle, projectDesc);
            });
        });
    },

    /**
     * Setup logo animation
     */
    setupLogoAnimation() {
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('mouseenter', () => {
                logo.style.transform = 'rotate(360deg)';
                logo.style.transition = 'transform 0.8s ease-in-out';
            });

            logo.addEventListener('mouseleave', () => {
                logo.style.transform = 'rotate(0deg)';
            });
        }
    },

    /**
     * Setup tech stack tag highlighting
     */
    setupTechStackHighlight() {
        const techTags = document.querySelectorAll('.tech-tag');
        
        techTags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.backgroundColor = 'var(--accent)';
                tag.style.color = 'var(--bg-primary)';
            });

            tag.addEventListener('mouseleave', () => {
                tag.style.backgroundColor = 'var(--bg-primary)';
                tag.style.color = 'var(--text-secondary)';
            });
        });
    },

    /**
     * Show project details in a modal
     * @param {string} title - Project title
     * @param {string} description - Project description
     */
    showProjectDetails(title, description) {
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${title}</h3>
                <p>${description}</p>
                <button class="modal-close">Close</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Add close functionality
        const closeBtn = modal.querySelector('.modal-close');
        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Portfolio.init();
});

// Prevent flash of unstyled content
document.documentElement.classList.add('js-loaded');

// Add TypeScript types for better IDE support
/**
 * @typedef {Object} ProjectData
 * @property {string} title
 * @property {string} description
 * @property {string[]} technologies
 */

/**
 * @type {ProjectData[]}
 */
const projectsData = [
    {
        title: 'Portfolio',
        description: 'Professional portfolio website',
        technologies: ['TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML']
    },
    {
        title: 'Xperience',
        description: 'A powerful 3D cinematic video creation tool',
        technologies: ['TypeScript', 'Three.js', 'Tailwind CSS']
    },
    {
        title: 'Vivid',
        description: 'Modern, modular 3D engine',
        technologies: ['TypeScript', 'WebGL', 'Tailwind CSS']
    },
    {
        title: 'InterChat',
        description: 'AI-powered chat application',
        technologies: ['TypeScript', 'JavaScript', 'Tailwind CSS']
    }
];
