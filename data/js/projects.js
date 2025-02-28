const projects = [
    {
        name: "Inter-Chat",
        description: "Chat with AI models in real-time",
        status: "coming soon",
        github: "https://github.com/manugeni/Inter-Chat",
        tags: ["AI", "Chat", "Real-time"]
    },
    {
        name: "Vault Engine",
        description: "3D web engine for creating immersive experiences",
        status: "coming soon",
        github: "https://github.com/manugeni/Vault-Engine",
        tags: ["3D", "WebGL", "Engine"]
    },
    {
        name: "VirtuXperience",
        description: "VR web 3D experience through realms",
        status: "coming soon",
        github: "https://github.com/manugeni/VirtuXperience",
        tags: ["VR", "3D", "WebXR"]
    },
    {
        name: "Slay!",
        description: "Online game where you slay monsters",
        status: "coming soon",
        github: "https://github.com/manugeni/Slay",
        tags: ["Game", "Multiplayer", "WebGL"]
    }
];

function renderProjects(filteredProjects = projects) {
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = filteredProjects.map(project => `
        <div class="project-card" onclick="window.open('${project.github}', '_blank')">
            <h3>${project.name} <span class="status">${project.status}</span></h3>
            <p>${project.description}</p>
            <div class="tags">${project.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
        </div>
    `).join('');
}

function searchProjects() {
    const searchTerm = document.getElementById('project-search').value.toLowerCase();
    const filteredProjects = projects.filter(project => 
        project.name.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    renderProjects(filteredProjects);
}

// Initial render
renderProjects();

// Add search input event listener
document.getElementById('project-search').addEventListener('input', searchProjects);
