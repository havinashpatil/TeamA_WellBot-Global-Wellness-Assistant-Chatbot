document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const searchParams = new URLSearchParams(window.location.search);
    const urlToken = searchParams.get('token');
    const urlName = searchParams.get('name');

    const token = localStorage.getItem('token') || urlToken;
    const name = localStorage.getItem('name') || urlName;

    if (!token) {
        window.location.href = '/login';
        return;
    }

    // Save tokens if present in URL
    if (urlToken) {
        localStorage.setItem('token', urlToken);
        localStorage.setItem('name', urlName);
        // Clean URL
        window.history.replaceState({}, document.title, "/dashboard");
    }

    document.getElementById('userName').textContent = name || 'Friend';
    if (document.getElementById('headerName')) {
        document.getElementById('headerName').textContent = name || 'Friend';
    }

    // Elements
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatToggle = document.getElementById('chatToggle');
    const chatPanel = document.getElementById('chatPanel');
    const closeChat = document.getElementById('closeChat');
    const logoutBtn = document.getElementById('logoutBtn');

    // Toggle Chat Panel
    chatToggle.addEventListener('click', () => {
        chatPanel.classList.toggle('active');
        if (chatPanel.classList.contains('active')) {
            userInput.focus();
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    });

    closeChat.addEventListener('click', () => {
        chatPanel.classList.remove('active');
    });

    // Logout
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '/login';
    });

    // Show / hide typing indicator
    function showTyping() {
        const el = document.createElement('div');
        el.classList.add('typing-indicator');
        el.id = 'typingIndicator';
        el.innerHTML = '<span></span><span></span><span></span>';
        chatBox.appendChild(el);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    function removeTyping() {
        const el = document.getElementById('typingIndicator');
        if (el) el.remove();
    }

    // Send Message Function
    async function sendMessage() {
        const message = userInput.value.trim();
        // Since we removed the mood dropdown from the main dashboard, 
        // we'll default to 'Neutral' or fetch from a global variable if set by mood cards.
        const mood = window.currentMood || 'Neutral';

        if (!message) return;

        // Add User Message
        appendMessage(message, 'user');
        userInput.value = '';
        sendBtn.disabled = true;

        showTyping();

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message, mood })
            });

            const data = await response.json();
            removeTyping();
            // Add Bot Message
            appendMessage(data.reply, 'bot');
        } catch (error) {
            removeTyping();
            console.error('Error:', error);
            appendMessage("I'm having trouble connecting. Please try again.", 'bot');
        } finally {
            sendBtn.disabled = false;
        }
    }

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function appendMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('message', `${sender}-message`);
        div.textContent = text;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
