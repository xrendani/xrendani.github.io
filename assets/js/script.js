// script.js

// Handle Navigation Toggle for Mobile
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Smooth Scroll for Internal Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Dynamically Add Social Media Icons
  const socialsContainer = document.querySelector(".footer-socials");
  if (socialsContainer) {
    const socials = [
      { platform: "Twitter (X)", url: "https://x.com/manugeni_", icon: "fab fa-twitter" },
      { platform: "GitHub", url: "https://github.com/manugeni", icon: "fab fa-github" },
      // Instagram and Facebook excluded due to unavailability
    ];

    socialsContainer.innerHTML = socials
      .map(
        ({ platform, url, icon }) =>
          `<a href="${url}" target="_blank" rel="noopener noreferrer" title="Follow me on ${platform}">
            <i class="${icon}" aria-hidden="true"></i>
          </a>`
      )
      .join("");
  }

  // Change Favicon Dynamically
  function setFavicon(iconUrl) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = iconUrl;
  }

  // Set your custom favicon here
  setFavicon("https://wizcann.is-a.dev/assets/images/favicon.ico");
});
