const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const users = {};

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/draw.html`);
});

io.on("connection", (socket) => {
  console.log(`New user has joined with the id of: ${socket.id}`);
  socket.on("new_user", (name) => {
    users[socket.id] = name;
    console.log(users);
    socket.broadcast.emit("user_connected", name);
    io.to(socket.id).emit("you_joined");
  });

  socket.on("send-chat-message", (message) => {
    io.sockets.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user_disconnected", users[socket.id]);
    delete users[socket.id];
  });
});

app.use(express.static(__dirname + "/public"));

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
