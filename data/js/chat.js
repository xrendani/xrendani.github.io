import { HfInference } from "https://cdn.jsdelivr.net/npm/@huggingface/inference/+esm";

const client = new HfInference("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");

async function sendMessage() {
    const inputField = document.getElementById('chat-input');
    const userInput = inputField.value.trim();

    if (!userInput) {
        alert("Please enter a message.");
        return;
    }

    // Append user's message
    appendMessage(userInput, 'user');
    inputField.value = '';

    try {
        // Fetch response from Hugging Face Qwen model
        const response = await client.chatCompletion({
            model: "Qwen/Qwen2.5-Coder-32B-Instruct",
            messages: [{ role: "user", content: userInput }],
            max_tokens: 500
        });

        const botReply = response.choices[0].message.content || "Sorry, I didn't understand that.";
        appendMessage(botReply, 'bot');
    } catch (error) {
        console.error("Error fetching AI response:", error);
        appendMessage("Error: Unable to connect to AI service. Please try again later.", 'bot');
    }
}

function appendMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElem = document.createElement('div');
    messageElem.className = `chat-message ${sender}`;
    messageElem.textContent = message;
    chatMessages.appendChild(messageElem);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Allow pressing Enter to send a message
document.getElementById('chat-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
