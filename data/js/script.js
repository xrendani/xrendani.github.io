document.addEventListener('DOMContentLoaded', () => {
    const themeButton = document.getElementById('theme-button');
    const currentTheme = localStorage.getItem('theme') || 'light';

    const setTheme = (theme) => {
        document.body.classList.add('transition');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            themeButton.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            themeButton.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
            localStorage.setItem('theme', 'light');
        }
        setTimeout(() => document.body.classList.remove('transition'), 500);
    };

    setTheme(currentTheme);

    themeButton.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
        setTheme(newTheme);
    });

    // Smooth scroll for nav links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Hover effect for links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseover', () => {
            link.style.transition = 'color 0.3s';
            link.style.color = '#ff6347'; // Change to your preferred hover color
        });
        link.addEventListener('mouseout', () => {
            link.style.color = ''; // Revert to original color
        });
    });

    // Lazy loading for images
    const lazyloadImages = document.querySelectorAll("img.lazyload");
    let lazyloadThrottleTimeout;

    function lazyload() {
        if(lazyloadThrottleTimeout) {
            clearTimeout(lazyloadThrottleTimeout);
        }    

        lazyloadThrottleTimeout = setTimeout(function() {
            const scrollTop = window.pageYOffset;
            lazyloadImages.forEach(function(img) {
                if(img.offsetTop < (window.innerHeight + scrollTop)) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    img.classList.remove('lazyload');
                }
            });
            if(lazyloadImages.length == 0) { 
                document.removeEventListener("scroll", lazyload);
                window.removeEventListener("resize", lazyload);
                window.removeEventListener("orientationChange", lazyload);
            }
        }, 20);
    }

    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);

    // Fetch and display news articles
    const apiKey = 'bb9fe86a125e428d97a795251cfe4bdf';
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const newsFeed = document.getElementById('news-feed');
            data.articles.forEach((article, index) => {
                const newsItem = document.createElement('div');
                newsItem.classList.add('news-item');
                newsItem.style.animationDelay = `${index * 0.3}s`;
                newsItem.innerHTML = `
                    <h2>${article.title}</h2>
                    <p>${article.description}</p>
                    <a href="${article.url}" target="_blank">Read more</a>
                `;
                newsFeed.appendChild(newsItem);
            });
        })
        .catch(error => console.error('Error fetching news:', error));
});
