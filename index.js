const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  console.log(`New user has joined with the id of: ${socket.id}`);

  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });
});

app.use(express.static(__dirname + "/public"));

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
