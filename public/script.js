import { Canvas } from "./canvas.js";
import { Toolbar } from "./toolbar.js";

console.log("🌍 Connecting to server…");

export const socket = io();

const canvasDiv = document.querySelector("#canvasDiv");
const toolbarDiv = document.querySelector("#toolbarDiv");

socket.on("connect", () => {
  // At this point we have connected to the server
  const name = prompt("What is your name?");

  socket.emit("new_user", name);

  const canvas = new Canvas(canvasDiv, socket);
  const toolbar = new Toolbar(toolbarDiv, canvas);

  window.canvas = canvas;
  window.toolbar = toolbar;

  canvas.socket.on("drawing", (data) => {
    canvas.receiveDrawingData(data);
  });
});

window.addEventListener("load", () => {});
