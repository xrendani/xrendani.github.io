document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('theme-switch');
    const themeLabel = document.getElementById('theme-label');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeSwitch.checked = true;
        themeLabel.textContent = 'Dark Mode';
    } else {
        document.body.classList.add('light-mode');
        themeLabel.textContent = 'Light Mode';
    }

    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            document.body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('theme', 'dark');
            themeLabel.textContent = 'Dark Mode';
        } else {
            document.body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('theme', 'light');
            themeLabel.textContent = 'Light Mode';
        }
    });
});


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
