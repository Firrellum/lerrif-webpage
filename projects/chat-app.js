const socketProtocol = 'wss';

let socket;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectInterval = 3000; 

function connectWebSocket() {
    console.log(`Attempting to connect to ${socketProtocol}://lerif-chat.onrender.com`);
    socket = new WebSocket(`${socketProtocol}://lerif-chat.onrender.com`);

    socket.onmessage = (event) => {
        const onlines = document.getElementById('online-peepo');
        const chatBox = document.getElementById('chatBox');
        const typingIndicator = document.getElementById('typingIndicator');
        const message = JSON.parse(event.data);
        const currentUser = localStorage.getItem('lerrif-username');
    
        const now = new Date();
        const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
        if (message.type === 'typing') {
            if (message.username !== currentUser) {
                typingIndicator.textContent = `${message.username} is typing...`;
                typingIndicator.style.display = 'block';
                setTimeout(() => {
                    typingIndicator.style.display = 'none';
                }, 3000);
            }
        } else {
            // Handle regular chat messages
            const messageClass = message.username === currentUser ? 'sent' : '';
            chatBox.innerHTML += `<p class="${messageClass}"><strong>${message.username}:</strong> ${message.text} <span class="timestamp">[${message.timestamp}]</span></p>`;
            onlines.innerHTML = `<p><strong>${message.online}</strong> Online`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    };

    socket.onerror = (error) => {
        console.log('WebSocket Error:', error);
        document.getElementById('ping').textContent = '🔴 Disconnected';
    };

    socket.onopen = () => {
        console.log('WebSocket connection established');
        document.getElementById('ping').textContent = '🟢 Connected';
        reconnectAttempts = 0; 
    };

    socket.onclose = (event) => {
        console.log(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
        document.getElementById('ping').textContent = '🔴 Disconnected';
        if (reconnectAttempts < maxReconnectAttempts) {
            setTimeout(() => {
                console.log(`Reconnecting... Attempt ${reconnectAttempts + 1}`);
                reconnectAttempts++;
                connectWebSocket();
            }, reconnectInterval);
        } else {
            console.log('Max reconnect attempts reached. Please refresh the page.');
            document.getElementById('ping').textContent = '🔴 Disconnected (Max reconnect attempts reached)';
        }
    };
}

connectWebSocket();

function keepAlive() {
    fetch(`https://lerif-chat.onrender.com/ping`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => console.log('Keep-alive ping:', data))
        .catch(err => console.error('Keep-alive error:', err));
}

setInterval(keepAlive, 1 * 60 * 1000); 

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            window.location.href = href;
        });
    });

    const navToggle = document.querySelector('.nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    const githubIcons = document.querySelectorAll('.github-icon');
    const githubSvg = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.69 9.015 20.805C6 21.36 5.22 19.755 4.98 19.095C4.845 18.75 4.275 17.415 3.78 17.13C3.375 16.905 2.79 16.35 3.765 16.335C4.68 16.32 5.355 17.19 5.58 17.55C6.63 19.275 8.295 18.825 9.075 18.51C9.18 17.73 9.495 17.145 9.84 16.815C7.185 16.485 4.41 15.555 4.41 11.115C4.41 9.885 4.845 8.835 5.58 8.01C5.46 7.68 5.055 6.48 5.67 4.92C5.67 4.92 6.66 4.575 9.015 6.045C9.975 5.79 11.025 5.655 12.075 5.655C13.125 5.655 14.175 5.79 15.135 6.045C17.49 4.575 18.48 4.92 18.48 4.92C19.095 6.48 18.69 7.68 18.57 8.01C19.305 8.835 19.74 9.885 19.74 11.115C19.74 15.57 16.95 16.485 14.28 16.815C14.715 17.22 15.09 17.985 15.09 19.11C15.09 20.685 15.075 22.41 15.075 22.815C15.075 23.13 15.3 23.505 15.915 23.385C20.565 21.795 24 17.31 24 12C24 5.37 18.63 0 12 0Z" fill="var(--primary-cyan)"/>
        </svg>
    `;
    githubIcons.forEach(icon => {
        icon.innerHTML = githubSvg;
    });

    if (localStorage.getItem('lerrif-username')) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'flex';
    }

    document.getElementById('enterButton').addEventListener('click', () => {
        const usernameInput = document.getElementById('usernameInput');
        const username = usernameInput.value.trim();

        if (username) {
            localStorage.setItem('lerrif-username', username);
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('chat-container').style.display = 'flex';
        } else {
            alert('Please enter a valid username!');
        }
    });

    document.getElementById('messageForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const messageInput = document.getElementById('messageInput');
        const username = localStorage.getItem('lerrif-username');

        if (messageInput.value.trim()) {
            const message = {
                username: username,
                text: messageInput.value.trim(),
                online: null
            };

            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(message));
                messageInput.value = '';
            } else {
                console.log('Cannot send message: WebSocket is not open');
                alert('Cannot send message: Not connected to the server. Please wait for reconnection or refresh the page.');
            }
        }
    });
    
    document.getElementById('messageInput').addEventListener('input', () => {
        const username = localStorage.getItem('lerrif-username');
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'typing',
                username: username
            }));
        }
    });
});