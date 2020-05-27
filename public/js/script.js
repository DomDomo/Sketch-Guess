import { Canvas } from "./canvas.js";
import { Toolbar } from "./toolbar.js";
import { Chat } from "./chat.js";
import { Game } from "./game.js";
import { UserBar } from "./userBar.js";

console.log("🌍 Connecting to server…");

export const socket = io();

const canvasDiv = document.querySelector("#canvasDiv");
const toolbarDiv = document.querySelector("#toolbarDiv");

const containerUser = document.getElementById("containerUser");

const formChat = document.getElementById("formChat");
const inputChat = document.getElementById("inputChat");
const boxMessages = document.getElementById("boxMessages");

const wordChoiceBox = document.getElementById("wordChoiceBox");

socket.on("connect", () => {
  // At this point we have connected to the server
  //$('#usernameModal').modal('show');

  socket.on("show_game", () => {
    document.getElementById("menuContainer").classList.remove("showFlex");
    document.getElementById("menuContainer").classList.add("hidden");
    document.getElementById("gameContainer").classList.remove("hidden");

    const canvas = new Canvas(canvasDiv, socket);
    const toolbar = new Toolbar(toolbarDiv, canvas);
    const chat = new Chat(formChat, inputChat, boxMessages, socket);
    const game = new Game(socket, wordChoiceBox, canvas);
    const userBar = new UserBar(socket, containerUser);

    window.canvas = canvas;
    window.toolbar = toolbar;
    window.chat = chat;
    window.game = game;
    window.userBar = userBar;

    canvas.socket.on("drawing", (data) => {
      canvas.receiveDrawingData(data);
    });

    canvas.socket.on("clear_canvas", (data) => {
      canvas.clearCanvas();
    });
  });

  window.onscroll = function (event) {
    canvas.rect = canvasDiv.getBoundingClientRect();
  };
});

//Username setup stuff

window.addEventListener("load", () => {
  const playBtn = document.getElementById("playBtn");
  const usernameInput = document.getElementById("usernameInput");

  function handleName(event) {
    event.preventDefault();
    let name = usernameInput.value;
    socket.emit("new_user", name);
    name = "";
  }

  playBtn.addEventListener("click", (event) => handleName(event));
  usernameInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) handleName(event);
  });
});
