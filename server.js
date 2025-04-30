// server.js
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use(express.static(__dirname + '/public'));
io.on('connection', function(socket) {
  console.log('a new client connected');
  socket.on('new comment', function(comment) {
    io.emit('new comment', comment);
  });
  socket.on('disconnect', function() {
    console.log('a client disconnected');
  });
});
server.listen(3000, function() {
  console.log('server listening on port 3000');
});
