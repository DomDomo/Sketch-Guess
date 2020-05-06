const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

io.on("connection", (socket) => {
  console.log(`New user has joined with the id of: ${socket.id}`);

  // User Logged in
  socket.on('login', (name) => {
    console.log('login', name)
    // Map socket.id to the name
    users[socket.id] = name;
  });

  socket.on("send-chat-message", (message) => {
    io.sockets.emit("chat-message", message);
  });

  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });
});

app.use(express.static(__dirname + "/public"));

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

