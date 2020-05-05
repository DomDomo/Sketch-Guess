import { socket } from "./script.js";

const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const chatBox = document.getElementById("chat-box");

socket.on("chat-message", (data) => {
  appendMessage(data);
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  //console.log(messageInput.value);
  let message = messageInput.value;
  socket.emit("send-chat-message", message);
  messageInput.value = "";
});

const appendMessage = (message) => {
  let messageElement = document.createElement("div");
  messageElement.innerText = message;
  chatBox.append(messageElement);
};
