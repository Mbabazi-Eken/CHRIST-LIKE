const socket = io();

const messageContainer = document.getElementById('messages');
const input = document.getElementById('message-input');

socket.on('chatLog', (messages) => {
  messages.forEach(msg => addMessage(msg.text, msg.time, msg.sender));
});

socket.on('message', (data) => {
  addMessage(data.text, data.time, data.sender);
});

function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  const time = new Date().toLocaleTimeString();
  const sender = 'me';

  socket.emit('message', { text: message, time, sender });
  addMessage(message, time, sender);
  input.value = '';
}

function addMessage(text, time, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender === 'me' ? 'sent' : 'received');
  msgDiv.innerHTML = `
    <div>${text}</div>
    <div class="timestamp">${time}</div>
  `;
  messageContainer.appendChild(msgDiv);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
