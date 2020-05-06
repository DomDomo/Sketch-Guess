import { socket } from "./script.js";

let colorToggle = true;

const formChat = document.getElementById("formChat");
const inputChat = document.getElementById("inputChat");
const boxMessages = document.getElementById("boxMessages");

formChat.addEventListener("submit", (event) => {
  event.preventDefault();

  let message = inputChat.value;
  console.log(message);
  if (message) socket.emit("send-chat-message", message);
  inputChat.value = "";
});

socket.on("chat-message", (data) => {
  appendMessage(data, false, false);
});

socket.on("user_connected", (name) => {
  appendMessage({ name: name }, true, false);
});
socket.on("user_disconnected", (name) => {
  appendMessage({ name: name }, false, true);
});

socket.on("you_joined", () => {
  appendMessage({ name: "You" }, true, false);
});

export const appendMessage = (
  data,
  userJoining = false,
  userLeaving = false
) => {
  let messageElement = document.createElement("p");
  messageElement.style.color = "black";
  messageElement.style.backgroundColor = colorToggle ? "darkgray" : "grey";
  colorToggle = !colorToggle;
  let nameElement = document.createElement("b");
  nameElement.innerText = data.name;
  messageElement.appendChild(nameElement);

  if (userJoining) {
    messageElement.innerHTML = messageElement.innerHTML + " joined";
    messageElement.style.color = "green";
  } else if (userLeaving) {
    messageElement.innerHTML = messageElement.innerHTML + " left";
    messageElement.style.color = "red";
  } else {
    messageElement.innerHTML = messageElement.innerHTML + ": " + data.message;
  }

  boxMessages.append(messageElement);
  messageElement.scrollTo = boxMessages.scrollHeight;
};

socket.on("new_user", (data) => {
  console.log("Hello");
  appendMessage(data, true, false);
});
