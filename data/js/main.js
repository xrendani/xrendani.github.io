// Toggle mobile navigation menu
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// Social Icons Data
const socialIcons = [
  {
    title: "X (Twitter)",
    url: "https://twitter.com/callmerendani",
    icon: "https://abs.twimg.com/favicons/twitter.ico",
  },
  {
    title: "YouTube",
    url: "https://youtube.com/@callmerendani",
    icon: "https://www.youtube.com/s/desktop/d5a0b8f4/img/favicon.ico",
  },
  {
    title: "GitHub",
    url: "https://github.com/manugeni",
    icon: "https://github.githubassets.com/favicons/favicon.png",
  },
];

// Function to create a social icon
function createSocialIcon(link) {
  const iconLink = document.createElement("a");
  iconLink.href = link.url;
  iconLink.target = "_blank";
  iconLink.title = link.title;
  iconLink.className = "social-icon";

  const iconImg = document.createElement("img");
  iconImg.src = link.icon;
  iconImg.alt = `${link.title} icon`;
  iconImg.className = "social-icon-img";

  iconLink.appendChild(iconImg);
  return iconLink;
}

// Function to add social icons dynamically
function addSocialIcons() {
  const socialIconsContainer = document.createElement("div");
  socialIconsContainer.className = "social-icons-container";

  socialIcons.forEach((link) => {
    const icon = createSocialIcon(link);
    socialIconsContainer.appendChild(icon);
  });

  // Append the social icons container to the body or a specific container
  const header = document.querySelector("header");
  if (header) {
    header.appendChild(socialIconsContainer);
  } else {
    document.body.prepend(socialIconsContainer);
  }
}

// Function to initialize the site functionality
function initializeSite() {
  addSocialIcons();
  addDarkModeToggle();
  addScrollToTopButton();
}

// Run the initialization function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeSite);
