const express = require("express");
const socketio = require("socket.io");
const http = require("http");

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
  res.sendFile(`${__dirname}/public/draw.html`);
});

io.on("connection", (socket) => {
  console.log(`New user has joined with the id of: ${socket.id}`);
  
  socket.on("new_user", (name) => {
    console.log(`New username chosen by user with the id of: ${socket.id}`);
    //Check if username is taken
    for (var key in users) {
      if (users.hasOwnProperty(key)) {
        
      }
    }

    if(name && false){
      //Show username not available error

      console.log('Username taken...')
    } else if(name) {
      users[socket.id] = name;
      console.log('User added to active successfully');
      //Show draw elements
      socket.broadcast.emit("user_connected", name);
      io.to(socket.id).emit("you_joined");
      //Are there enough players to start the game
      if (Object.keys(users).length >= 2) {
        io.to(socket.id).emit("game_start");
      }
    }
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

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

