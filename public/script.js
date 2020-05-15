import { Canvas } from "./canvas.js";
import { Toolbar } from "./toolbar.js";
import { Chat } from "./chat.js";
import { Game } from "./game.js";

console.log("🌍 Connecting to server…");

export const socket = io();

const canvasDiv = document.querySelector("#canvasDiv");
const toolbarDiv = document.querySelector("#toolbarDiv");

const formChat = document.getElementById("formChat");
const inputChat = document.getElementById("inputChat");
const boxMessages = document.getElementById("boxMessages");

const wordChoiceBox = document.getElementById("wordChoiceBox");

socket.on("connect", () => {
  // At this point we have connected to the server
  $('#usernameModal').modal('show');



  

  const canvas = new Canvas(canvasDiv, socket);
  const toolbar = new Toolbar(toolbarDiv, canvas);
  const chat = new Chat(formChat, inputChat, boxMessages, socket);
  const game = new Game(socket, wordChoiceBox, canvas);

  window.canvas = canvas;
  window.toolbar = toolbar;
  window.chat = chat;
  window.game = game;

  canvas.socket.on("drawing", (data) => {
    canvas.receiveDrawingData(data);
  });

  canvas.socket.on("clear_canvas", (data) => {
    canvas.clearCanvas();
  });

  window.onscroll = function (event) {
    canvas.rect = canvasDiv.getBoundingClientRect();
  };
});

window.addEventListener("load", () => {});
