const chatWindow = document.querySelector('.chat-window');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const themeToggle = document.getElementById('theme-toggle');

const API_KEY = 'YOUR_API_KEY_HERE';
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addMessage(userMessage, 'user-message');
        userInput.value = '';
        await fetchBotResponse(userMessage);
    }
});

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.chat-container').classList.toggle('dark-mode');
    document.querySelector('.chat-header').classList.toggle('dark-mode');
    document.querySelector('.chat-window').classList.toggle('dark-mode');
    document.querySelector('.chat-input').classList.toggle('dark-mode');
    document.querySelector('.chat-input input').classList.toggle('dark-mode');
    document.querySelector('.chat-input button').classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '🌞' : '🌙';
});

function addMessage(text, className) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.textContent = text;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function fetchBotResponse(userMessage) {
    addMessage('Typing...', 'bot-message'); // Temporary response while waiting for the API
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // Specify the model
                messages: [{ role: 'user', content: userMessage }]
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const botMessage = data.choices[0].message.content.trim();
        addMessage(botMessage, 'bot-message');
    } catch (error) {
        addMessage('Oops! Something went wrong. Please try again later.', 'bot-message');
        console.error('Error:', error);
    }
}
