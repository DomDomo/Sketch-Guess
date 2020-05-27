
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
      this._regularMessage(data);
    });

    socket.on("user_connected", (name) => {
      this._joinMessage({ name: name });
    });
    socket.on("user_disconnected", (name) => {
      this._leftMessage({ name: name });
    });

    socket.on("you_joined", () => {
      this._joinMessage({ name: "You" });
    });

    socket.on("correct_guess", (data) => {
      this._correctGuessMessage(data);
    });
  }

  _appendMessage(messageElement) {
    boxMessages.append(messageElement);
    boxMessages.scrollTop = boxMessages.scrollHeight;
  }

  _makeMessageTemplate(data) {
    let messageElement = document.createElement("p");
    messageElement.style.color = "black";
    messageElement.style.backgroundColor = this.colorToggle
      ? "darkgray"
      : "grey";
    this.colorToggle = !this.colorToggle;
    let nameElement = document.createElement("b");
    nameElement.innerText = data.name;
    messageElement.appendChild(nameElement);

    return messageElement;
  }

  _regularMessage(data) {
    let messageElement = this._makeMessageTemplate(data);
    messageElement.innerHTML = messageElement.innerHTML + ": " + data.message;
    this._appendMessage(messageElement);
  }

  _joinMessage(data) {
    let messageElement = this._makeMessageTemplate(data);
    messageElement.innerHTML = messageElement.innerHTML + " joined";
    messageElement.style.color = "green";
    this._appendMessage(messageElement);
  }

  _leftMessage(data) {
    let messageElement = this._makeMessageTemplate(data);
    messageElement.innerHTML = messageElement.innerHTML + " left";
    messageElement.style.color = "red";
    this._appendMessage(messageElement);
  }

  _correctGuessMessage(data) {
      let messageElement = this._makeMessageTemplate(data);
      messageElement.innerHTML = `${messageElement.innerHTML} got that it was  <b>${data.word}<b>`;
      messageElement.style.color = "blue";
      this._appendMessage(messageElement);

      let toChange = document.getElementById(`score_${data.name}`);
      toChange.innerHTML = `${data.score}`;


  }
}
