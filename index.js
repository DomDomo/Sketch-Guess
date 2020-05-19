const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const users = {};
let currentState = {
  drawer: "",
  wordToGuess: "",
};

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

io.on("connection", (socket) => {
  console.log(`New user has joined with the id of: ${socket.id}`);
  socket.on("new_user", (name) => {
    if (name) users[socket.id] = name;
    console.log(users);
    if (Object.keys(users).length >= 4) {
      io.to(socket.id).emit("game_start");
    }
    socket.broadcast.emit("user_connected", name);
    io.to(socket.id).emit("you_joined");
  });

  // User Logged in
  socket.on('login', (name) => {
    console.log('login', name)
    // Map socket.id to the name
    users[socket.id] = name;
  });

  socket.on("send-chat-message", (message) => {
    if (
      message.toLowerCase() === currentState.wordToGuess.toLocaleLowerCase()
    ) {
      io.sockets.emit("correct_guess", {
        name: users[socket.id],
        word: currentState.wordToGuess,
      });
      io.to(currentState.drawer).emit("revoke_turn");
      io.to(socket.id).emit("game_start");
    } else {
      io.sockets.emit("chat-message", {
        message: message,
        name: users[socket.id],
      });
    }
  });

  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });

  socket.on("clear_canvas", () => {
    socket.broadcast.emit("clear_canvas");
  });

  socket.on("choosen_word", (word) => {
    currentState.drawer = socket.id;
    currentState.wordToGuess = word;
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user_disconnected", users[socket.id]);
    delete users[socket.id];
  });
});

app.use(express.static(__dirname + "/public"));
app.use(cors());

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

