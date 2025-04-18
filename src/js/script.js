// Update commands array
const commands = [
    { cmd: 'cd about', delay: 0.8 },
    { cmd: 'cd projects', delay: 1.0 },
    { cmd: 'cd github', delay: 1.2 },
    { cmd: 'cd apps', delay: 1.4 },
    { cmd: 'cd gallery', delay: 1.6 },
    { cmd: 'cd library', delay: 1.8 },
    { cmd: 'cd social', delay: 2.0 }
];

// Initialize commands with staggered delays
function initCommands() {
    const commandsContainer = document.querySelector('.commands');
    commandsContainer.innerHTML = '';
    
    commands.forEach((command, index) => {
        const div = document.createElement('div');
        div.className = 'command';
        div.textContent = `$ ${command.cmd}`;
        div.style.setProperty('--delay', `${command.delay}s`);
        div.setAttribute('data-cmd', command.cmd);
        commandsContainer.appendChild(div);
    });
}

// Add gallery hover effect
document.addEventListener('mouseover', function(e) {
    if (e.target.closest('.gallery-item')) {
        const img = e.target.querySelector('img');
        if (img) img.style.transform = 'scale(1.03)';
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.closest('.gallery-item')) {
        const img = e.target.querySelector('img');
        if (img) img.style.transform = 'scale(1)';
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initCommands();
    // ... rest of existing initialization
});
