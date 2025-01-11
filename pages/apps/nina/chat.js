class ChatBot {
    constructor() {
        this.messages = [];
        this.form = document.getElementById('chat-form');
        this.input = document.getElementById('chat-input');
        this.messagesContainer = document.getElementById('messages');
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async callHuggingFaceAPI(message) {
        try {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
                {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer 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", // Replace with your API key
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ inputs: message }),
                }
            );
            
            const data = await response.json();
            return data[0]?.generated_text || "I apologize, I couldn't process that request.";
        } catch (error) {
            console.error("API Error:", error);
            return "Sorry, I encountered an error. Please try again.";
        }
    }

    createMessageElement(message, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = `max-w-[80%] rounded-lg p-3 ${
            isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
        }`;
        contentDiv.textContent = message;
        
        messageDiv.appendChild(contentDiv);
        return messageDiv;
    }

    async handleSubmit(e) {
        e.preventDefault();
        const message = this.input.value.trim();
        if (!message) return;

        // Add user message
        this.messagesContainer.appendChild(this.createMessageElement(message, true));
        this.input.value = '';
        this.input.disabled = true;

        // Animate avatar
        if (window.faceAvatar) {
            window.faceAvatar.pulse();
        }

        // Show loading
        const loadingDiv = this.createMessageElement('...', false);
        this.messagesContainer.appendChild(loadingDiv);

        try {
            const response = await this.callHuggingFaceAPI(message);
            this.messagesContainer.removeChild(loadingDiv);
            this.messagesContainer.appendChild(this.createMessageElement(response, false));
        } catch (error) {
            this.messagesContainer.removeChild(loadingDiv);
            this.messagesContainer.appendChild(
                this.createMessageElement('Sorry, I encountered an error. Please try again.', false)
            );
        }

        this.input.disabled = false;
        this.input.focus();
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize chatbot when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});
