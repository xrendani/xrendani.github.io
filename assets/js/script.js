document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const messages = document.getElementById('messages');

    sendButton.addEventListener('click', function() {
        const userMessage = userInput.value.trim();
        if (userMessage) {
            addMessage('user', userMessage);
            userInput.value = '';

            // Simulate AI response
            setTimeout(function() {
                addMessage('ai', 'This is a response from the AI.');
            }, 500);
        }
    });

    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    function addMessage(sender, text) {
        const message = document.createElement('div');
        message.classList.add('message', sender);
        message.innerText = text;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }
});
