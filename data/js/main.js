// Toggle mobile menu
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
});

// Fetch a random quote
async function fetchRandomQuote() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        document.getElementById('random-quote').textContent = `"${data.content}" - ${data.author}`;
    } catch (error) {
        console.error('Error fetching quote:', error);
        document.getElementById('random-quote').textContent = "Failed to load quote. Please try again later.";
    }
}

// Fetch a random image
async function fetchRandomImage() {
    try {
        const response = await fetch('https://source.unsplash.com/random/800x600');
        const imageUrl = response.url;
        document.getElementById('random-image').src = imageUrl;
    } catch (error) {
        console.error('Error fetching image:', error);
        document.getElementById('random-image').alt = "Failed to load image.";
    }
}

// Initialize dynamic content
function initializeDynamicContent() {
    fetchRandomQuote();
    fetchRandomImage();
}

// Run the initialization function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeDynamicContent);
