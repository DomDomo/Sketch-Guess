const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());

const timeUntilRoundStarts = 4; // in seconds
const playersToStartTheGame = 2;
const users = {};
const points = {};
let currentState = {
  drawer: "",
  wordToGuess: "",
  gameIsRunning: false,
};

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/draw.html`);
});

io.on("connection", (socket) => {
  console.log(`New user has joined with the id of: ${socket.id}`);

  function afterCountDown() {
    setTimeout(() => {
      let keys = Object.keys(users);
      let randomPlayerID = keys[(keys.length * Math.random()) << 0];
      currentState.drawer = randomPlayerID;
      io.to(randomPlayerID).emit("game_start");
      io.sockets.emit("drawer_selected", { name: users[randomPlayerID] });
    }, timeUntilRoundStarts * 1000 + 1000);
  }

  socket.on("new_user", (name) => {
    console.log(`New username chosen by user with the id of: ${socket.id}`);
    //Check if username is taken

    let isUsernameTaken = Object.values(users).includes(name) ? true : false;

    if (name && isUsernameTaken) {
      //Show username not available error

      console.log("Username taken...");
    } else if (name) {
      users[socket.id] = name;
      points[name] = 0;
      console.log("User added to active successfully");
      //Show draw elements
      io.to(socket.id).emit("show_game");

      socket.broadcast.emit("user_connected", name);
      socket.emit("newUserList", name, users, points);
      io.to(socket.id).emit("you_joined");
      //Are there enough players to start the game
      if (!currentState.gameIsRunning) {
        if (Object.keys(users).length >= playersToStartTheGame) {
          currentState.gameIsRunning = true;
          io.sockets.emit("start_countdown", {
            time: timeUntilRoundStarts,
          });
          afterCountDown();
        }
      }
    }
  });

  socket.on("send-chat-message", (message) => {
    if (
      message.toLowerCase() === currentState.wordToGuess.toLocaleLowerCase() &&
      currentState.drawer !== socket.id
    ) {
      points[users[socket.id]]++;
      io.sockets.emit("correct_guess", {
        name: users[socket.id],
        word: currentState.wordToGuess,
        score: points[users[socket.id]],
      });
      io.to(currentState.drawer).emit("revoke_turn");
      io.sockets.emit("start_countdown", { time: timeUntilRoundStarts });
      afterCountDown();
    } else {
      if (
        message.toLowerCase() !== currentState.wordToGuess.toLocaleLowerCase()
      ) {
        io.sockets.emit("chat-message", {
          message: message,
          name: users[socket.id],
        });
      }
    }
  });

  socket.on("begin_round", () => {
    let keys = Object.keys(users);
    let randomPlayerID = keys[(keys.length * Math.random()) << 0];
    io.to(randomPlayerID).emit("game_start");
    io.sockets.emit("drawer_selected", { name: users[randomPlayerID] });
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
    console.log(socket.id);
    if (currentState.drawer === socket.id) {
      io.to(socket).emit("revoke_turn");
      currentState = {
        drawer: "",
        wordToGuess: "",
        gameIsRunning: false,
      };
    }
    delete points[users[socket.id]];
    delete users[socket.id];
    if (Object.keys(users).length < playersToStartTheGame) {
      console.log("hello");
      currentState.gameIsRunning = false;
      io.sockets.emit("revoke_turn");
    }
  });
});

app.use(express.static(__dirname + "/public"));
app.use(cors());

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
