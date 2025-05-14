const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/comment');

// Schema for messages
const messageSchema = new mongoose.Schema({
  text: String,
  sender: String,
  time: String,
  roomId: { type: String, index: true },
  socketId: String
});

const Message = mongoose.model('Message', messageSchema);

const inboxRooms = {};

// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Join a room
  socket.join('comments'); // Auto-join the public comment room

  Message.find({ roomId: 'comments' }).sort({ time: 1 }).then(messages => {
    socket.emit('chatLog', messages);
  });
});
  // Handle private messages
  socket.on('inboxMessage', async ({ text, time, sender, roomId, socketId }) => {
    const message = { text, time, sender, roomId, socketId };
    io.to(roomId).emit('inboxMessage', message);

    const newMsg = new Message(message);
    await newMsg.save();
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });


// Routes
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/html/index.html');
});
app.get('/devotionals', (req, res) => res.sendFile(__dirname + '/public/html/devotionals.html'));
app.get('/videos', (req, res) => res.sendFile(__dirname + '/public/html/videos.html'));
app.get('/uplifting', (req, res) => res.sendFile(__dirname + '/public/html/uplifting.html'));
app.get('/comments', (req, res) => res.sendFile(__dirname + '/public/html/comments.html'));
app.get('/music', (req, res) => res.sendFile(__dirname + '/public/html/music.html'));
app.get('/blog', (req, res) => res.sendFile(__dirname + '/public/html/blog.html'));
app.get('/inbox', (req, res) => res.sendFile(__dirname + '/public/html/inbox.html'));

// Dynamic inbox room route
app.get('/inbox/:roomId', async (req, res) => {
  const { roomId } = req.params;
  const { sender } = req.query;

  if (!inboxRooms[roomId]) {
    inboxRooms[roomId] = { users: [], messages: [] };
  }

  try {
    const messages = await Message.find({ roomId }).sort({ time: 1 });
    inboxRooms[roomId].messages = messages;
    res.sendFile(__dirname + '/public/html/inbox.html');
  } catch (err) {
    console.error('Error loading messages:', err);
    res.status(500).send('Internal server error');
  }
});

// Create/join inbox room
app.post('/inbox', (req, res) => {
  const { sender, receiver } = req.body;

  if (!sender || !receiver) {
    return res.status(400).send('Sender and receiver are required.');
  }

  const roomId = [sender, receiver].sort().join('_');

  if (!inboxRooms[roomId]) {
    inboxRooms[roomId] = { users: [sender, receiver], messages: [] };
  }

  res.redirect(`/inbox/${roomId}?sender=${sender}`);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
