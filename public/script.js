import { Canvas } from "./canvas.js";

console.log("🌍 Connecting to server…");

export const socket = io();
const canvasDiv = document.querySelector("#canvasDiv");

socket.on("connect", () => {
  // At this point we have connected to the server
  console.log("🌍 Connected to server");

  // Create a Whiteboard instance
  const canvas = new Canvas(canvasDiv, socket);
  window.canvas = canvas;

  canvas.socket.on("drawing", (data) => {
    canvas.receiveDrawingData(data);
  });
});

window.addEventListener("load", () => {});
