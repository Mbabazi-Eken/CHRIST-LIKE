let mySocketId;

const socket = io();

socket.on('connect', () => {
  mySocketId = socket.id;
});

const messageContainer = document.getElementById('messages');
const input = document.getElementById('message-input');

socket.on('chatLog', (messages) => {
  messages.forEach(msg => addMessage(msg.text, msg.time, msg.sender));
});

socket.on('inboxMessage', (data) => {
  const sender = data.sender === mySocketId ? 'me' : 'other';
  addMessage(data.text, data.time, sender);
});

function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  const time = new Date().toLocaleTimeString();

  socket.emit('inboxMessage', {
    text: message,
    time,
    sender: mySocketId,
    roomId: 'comments', // use a fixed room name for public comments
    socketId: mySocketId
  });

  input.value = '';
}

function addMessage(text, time, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message');

  if (sender === 'me') {
    msgDiv.classList.add('sent');
  } else {
    msgDiv.classList.add('received');
  }
  msgDiv.innerHTML = `
    <div>${text}</div>
    <span class="timestamp">${time}</span>
  `;
  messageContainer.appendChild(msgDiv);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
