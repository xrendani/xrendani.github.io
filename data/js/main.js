// External Links Data
const externalLinks = [
    {
        title: "GitHub",
        description: "Explore my projects on GitHub.",
        url: "https://github.com/manugeni",
        icon: "https://github.githubassets.com/favicons/favicon.png",
    },
    {
        title: "LinkedIn",
        description: "Connect with me on LinkedIn.",
        url: "https://linkedin.com/in/manugeni",
        icon: "https://static.licdn.com/sc/h/akt4ae504epesldzj74dzred8",
    },
    {
        title: "Twitter",
        description: "Follow me on Twitter for updates.",
        url: "https://twitter.com/manugeni",
        icon: "https://abs.twimg.com/favicons/twitter.ico",
    },
    {
        title: "Blog",
        description: "Read my latest blog posts.",
        url: "https://blog.manugeni.is-a.dev",
        icon: "https://blog.manugeni.is-a.dev/favicon.ico",
    },
    {
        title: "Portfolio",
        description: "Check out my portfolio.",
        url: "https://portfolio.manugeni.is-a.dev",
        icon: "https://portfolio.manugeni.is-a.dev/favicon.ico",
    },
];

// Function to create a link card
function createLinkCard(link) {
    const card = document.createElement("div");
    card.className = "card";

    const icon = document.createElement("img");
    icon.src = link.icon;
    icon.alt = `${link.title} icon`;
    icon.className = "link-icon";

    const title = document.createElement("h3");
    title.textContent = link.title;
    title.className = "link-title";

    const description = document.createElement("p");
    description.textContent = link.description;
    description.className = "link-description";

    const button = document.createElement("a");
    button.href = link.url;
    button.target = "_blank";
    button.textContent = "Visit";
    button.className = "link-button";

    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(button);

    return card;
}

// Function to populate the main page with external links
function populateExternalLinks() {
    const linksContainer = document.getElementById("external-links");
    if (!linksContainer) return;

    externalLinks.forEach((link) => {
        const card = createLinkCard(link);
        linksContainer.appendChild(card);
    });
}

// Function to add a dark mode toggle
function addDarkModeToggle() {
    const toggleButton = document.createElement("button");
    toggleButton.id = "dark-mode-toggle";
    toggleButton.textContent = "Toggle Dark Mode";
    toggleButton.className = "dark-mode-button";

    toggleButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem(
            "darkMode",
            document.body.classList.contains("dark-mode")
        );
    });

    // Check localStorage for dark mode preference
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    if (isDarkMode) {
        document.body.classList.add("dark-mode");
    }

    // Append the toggle button to the header or a specific container
    const header = document.querySelector("header");
    if (header) {
        header.appendChild(toggleButton);
    }
}

// Function to add a scroll-to-top button
function addScrollToTopButton() {
    const scrollButton = document.createElement("button");
    scrollButton.id = "scroll-to-top";
    scrollButton.textContent = "↑";
    scrollButton.className = "scroll-to-top-button";

    scrollButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Show/hide the button based on scroll position
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollButton.style.display = "block";
        } else {
            scrollButton.style.display = "none";
        }
    });

    document.body.appendChild(scrollButton);
}

// Function to initialize the site functionality
function initializeSite() {
    populateExternalLinks();
    addDarkModeToggle();
    addScrollToTopButton();
}

// Run the initialization function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeSite);
