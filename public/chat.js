export class Chat {
  constructor(formChat, inputChat, boxMessages, socket) {
    this.form = formChat;
    this.input = inputChat;
    this.messageBox = boxMessages;

    this.socket = socket;

    this.colorToggle = false;

    formChat.addEventListener("submit", (event) => this._sendMessage(event));

    this._setupSocket(socket);
  }

  _sendMessage(event) {
    event.preventDefault();

    let message = this.input.value;

    if (message) this.socket.emit("send-chat-message", message);
    this.input.value = "";
  }

  _setupSocket(socket) {
    socket.on("chat-message", (data) => {
      this._appendMessage(data, false, false);
    });

    socket.on("user_connected", (name) => {
      this._appendMessage({ name: name }, true, false);
    });
    socket.on("user_disconnected", (name) => {
      this._appendMessage({ name: name }, false, true);
    });

    socket.on("you_joined", () => {
      this._appendMessage({ name: "You" }, true, false);
    });

    socket.on("new_user", (data) => {
      console.log("Hello");
      this._appendMessage(data, true, false);
    });
  }

  _appendMessage(data, userJoining = false, userLeaving = false) {
    let messageElement = document.createElement("p");
    messageElement.style.color = "black";
    messageElement.style.backgroundColor = this.colorToggle
      ? "darkgray"
      : "grey";
    this.colorToggle = !this.colorToggle;
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
  }
}
