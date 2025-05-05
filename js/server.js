const WebSocket = require('ws');
const wss = new WebSocket.Server({ port:8080 });
wss.on('connection', (ws) => {
 console.log('a new client connected');
 ws.on('message', (message) => {
 console.log(`received message`  + message);
 wss.clients.forEach((client) => {
 if (client !== ws && client.readyState === WebSocket.OPEN) {
 client.send(message);
 }
 });
 });
});
