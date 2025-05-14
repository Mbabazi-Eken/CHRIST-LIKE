const socket = io();

let mySocketId = null;

// Extract roomId from the URL path
const pathParts = window.location.pathname.replace(/\/$/, '').split('/');
const roomId = pathParts[pathParts.length - 1];

// Extract sender from URL query string
const urlParams = new URLSearchParams(window.location.search);
const sender = urlParams.get('sender');

// Validate presence of roomId and sender
if (!roomId || !sender) {
  alert('Missing roomId or sender in URL');
  throw new Error('Missing roomId or sender');
}

// DOM Elements
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messagesContainer = document.getElementById('messages');
const roomTitle = document.getElementById('roomTitle');

// Display static title
roomTitle.innerText = `Talk to Me`;

// Get your socket ID
socket.on('connect', () => {
  mySocketId = socket.id;
  socket.emit('joinRoom', { roomId });
});

// Load chat history
socket.on('chatHistory', (msgs) => {
  messagesContainer.innerHTML = '';
  msgs.forEach(displayMessage);
});

// Display new incoming message
socket.on('inboxMessage', (message) => {
  displayMessage(message);
});

// Send a new message
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = messageInput.value.trim();
  if (!text) return;

  const time = new Date().toLocaleTimeString();

  socket.emit('inboxMessage', {
    roomId,
    sender,
    text,
    time,
    socketId: socket.id // include sender's socketId
  });

  messageInput.value = '';
});

// Display a single message in chat
function displayMessage({ sender: msgSender, text, time, socketId }) {
  const isYou = socketId === mySocketId;

  const div = document.createElement('div');
  div.classList.add('message', isYou ? 'you' : 'other');
  div.innerHTML = `<strong>${isYou ? 'You' : 'User'}</strong>: ${text}<span class="time">${time}</span>`;
  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
