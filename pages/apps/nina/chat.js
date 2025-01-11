class ChatBot {
    constructor() {
        this.messages = [];
        this.form = document.getElementById('chat-form');
        this.input = document.getElementById('chat-input');
        this.messagesContainer = document.getElementById('messages');
        this.API_KEY = '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';
        
        this.models = {
            codeLlama: 'codellama/CodeLlama-34b-Instruct-hf',
            starcoder: 'bigcode/starcoder',
            mistral: 'mistralai/Mistral-7B-Instruct-v0.1'
        };
        
        this.currentModel = this.models.codeLlama;
        this.codeExecutionEnabled = true;
        
        this.context = `You are an expert programming assistant. Focus on:
- Complete, working code solutions
- Detailed explanations
- Best practices and optimizations
- Security considerations
When showing code, use markdown code blocks with language specification.`;
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.addModelSelector();
        this.loadMessages();
    }

    addModelSelector() {
        const selector = document.createElement('select');
        selector.className = 'fixed top-4 right-4 p-2 rounded border';
        Object.entries(this.models).forEach(([key, value]) => {
            const option = document.createElement('option');
            option.value = value;
            option.text = key;
            selector.appendChild(option);
        });
        selector.addEventListener('change', (e) => {
            this.currentModel = e.target.value;
        });
        document.body.appendChild(selector);
    }

    async callAPI(message, model = this.currentModel) {
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${model}`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: `${this.context}\n\nUser: ${message}\n\nAssistant:`,
                    parameters: {
                        max_length: 2048,
                        temperature: 0.7,
                        top_p: 0.95,
                        repetition_penalty: 1.2
                    }
                }),
            }
        );
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        return this.processResponse(data[0]?.generated_text);
    }

    processResponse(text) {
        if (!text) return "I apologize, I couldn't process that request.";
        
        // Clean up the response
        text = text.replace(/Assistant: ?/g, '').trim();
        
        // Extract and process code blocks
        const codeBlocks = text.match(/```(\w+)?\n([\s\S]*?)```/g) || [];
        if (this.codeExecutionEnabled && codeBlocks.length > 0) {
            this.addExecuteButtons(codeBlocks);
        }
        
        return text;
    }

    addExecuteButtons(codeBlocks) {
        codeBlocks.forEach((block, index) => {
            const language = block.match(/```(\w+)?/)[1];
            if (['javascript', 'python', 'html'].includes(language)) {
                const buttonId = `execute-${index}`;
                const button = document.createElement('button');
                button.id = buttonId;
                button.className = 'bg-blue-500 text-white px-3 py-1 rounded mt-2';
                button.textContent = `Run ${language} code`;
                button.onclick = () => this.executeCode(block, language);
                this.messagesContainer.appendChild(button);
            }
        });
    }

    async executeCode(codeBlock, language) {
        const code = codeBlock.replace(/```\w+\n|```/g, '');
        let output;

        try {
            switch (language) {
                case 'javascript':
                    output = await this.executeJavaScript(code);
                    break;
                case 'html':
                    this.renderHTML(code);
                    return;
                default:
                    output = 'Code execution not supported for this language';
            }

            this.addMessage(false, `Execution output:\n\`\`\`\n${output}\n\`\`\``);
        } catch (error) {
            this.addMessage(false, `Error: ${error.message}`);
        }
    }

    executeJavaScript(code) {
        return new Promise((resolve, reject) => {
            try {
                const oldConsoleLog = console.log;
                let output = '';
                console.log = (...args) => {
                    output += args.join(' ') + '\n';
                };

                eval(code);
                console.log = oldConsoleLog;
                resolve(output || 'Code executed successfully');
            } catch (error) {
                reject(error);
            }
        });
    }

    renderHTML(code) {
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '300px';
        iframe.style.border = '1px solid #ccc';
        this.messagesContainer.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(code);
        doc.close();
    }

    createMessageElement(message, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = `max-w-[80%] rounded-lg p-3 ${
            isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
        }`;
        
        if (!isUser && message.includes('```')) {
            contentDiv.innerHTML = this.formatCodeBlock(message);
            setTimeout(() => Prism.highlightAllUnder(contentDiv), 0);
        } else {
            contentDiv.textContent = message;
        }
        
        messageDiv.appendChild(contentDiv);
        return messageDiv;
    }

    formatCodeBlock(message) {
        return message.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
            return `<pre class="bg-gray-800 text-white p-3 rounded"><code class="language-${language || 'plaintext'}">${
                code.replace(/</g, '&lt;').replace(/>/g, '&gt;')
            }</code></pre>`;
        });
    }

    saveMessages() {
        localStorage.setItem('chatMessages', JSON.stringify(this.messages));
    }

    loadMessages() {
        const saved = localStorage.getItem('chatMessages');
        if (saved) {
            this.messages = JSON.parse(saved);
            this.messages.forEach(msg => {
                this.addMessage(msg.isUser, msg.text);
            });
        }
    }

    addMessage(isUser, text) {
        this.messages.push({ isUser, text });
        const messageDiv = this.createMessageElement(text, isUser);
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        this.saveMessages();
    }

    async handleSubmit(e) {
        e.preventDefault();
        const message = this.input.value.trim();
        if (!message) return;

        this.addMessage(true, message);
        this.input.value = '';
        this.input.disabled = true;

        if (window.faceAvatar) {
            window.faceAvatar.pulse();
        }

        const loadingDiv = this.createMessageElement('...', false);
        this.messagesContainer.appendChild(loadingDiv);

        try {
            const response = await this.callAPI(message);
            this.messagesContainer.removeChild(loadingDiv);
            this.addMessage(false, response);
        } catch (error) {
            console.error('API Error:', error);
            this.messagesContainer.removeChild(loadingDiv);
            this.addMessage(false, 'Sorry, I encountered an error. Please try again.');
        }

        this.input.disabled = false;
        this.input.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});
