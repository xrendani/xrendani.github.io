document.addEventListener('DOMContentLoaded', () => {
    const themeButton = document.getElementById('theme-button');
    const currentTheme = localStorage.getItem('theme') || 'light';

    const setTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            themeButton.textContent = 'Light Mode';
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            themeButton.textContent = 'Dark Mode';
            localStorage.setItem('theme', 'light');
        }
    };

    setTheme(currentTheme);

    themeButton.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
        setTheme(newTheme);
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
