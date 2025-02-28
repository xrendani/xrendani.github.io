// /data/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const loader = document.getElementById('loader');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default submission for demo; remove if live
            loader.classList.remove('hidden'); // Show loader

            // Simulate form submission (replace with actual fetch for live use)
            setTimeout(() => {
                loader.classList.add('hidden'); // Hide loader
                alert('Message sent! (Simulated)'); // Placeholder response
                form.reset(); // Clear form
            }, 2000); // 2-second delay for demo
        });
    }
});
