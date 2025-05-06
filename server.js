const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

mongoose.connect('mongodb://localhost:27017/chatApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// schema for sms
const messageSchema = new mongoose.Schema({
  text: String,
  sender: String,
  time: String
});

const Message = mongoose.model('Message', messageSchema);

let chatLog = [];
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send existing chat log
  socket.emit('chatLog', chatLog);

  // Receive and broadcast new messages
  socket.on('message', (data) => {
    const message = {
      text: data.text,
      time: data.time,
      sender: socket.id
    };

    chatLog.push(message);
    io.emit('message', message);
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// routes  //
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/html/index.html');
});
app.get('/devotionals', (req, res) => {
  res.sendFile(__dirname + '/public/html/devotionals.html');
});
app.get('/videos', (req, res) => {
  res.sendFile(__dirname + '/public/html/videos.html');
});
app.get('/uplifting', (req, res) => {
  res.sendFile(__dirname + '/public/html/uplifting.html');
});
app.get('/comments', (req, res) => {
  res.sendFile(__dirname + '/public/html/comments.html');
});
app.get('/inbox', (req, res) => {
  res.sendFile(__dirname + '/public/html/inbox.html');
});
app.get('/music', (req, res) => {
  res.sendFile(__dirname + '/public/html/inbox.html');
});
app.get('/blog', (req, res) => {
  res.sendFile(__dirname + '/public/html/inbox.html');
});




server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
