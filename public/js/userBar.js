export class UserBar {
    constructor(socket, containerUser) {
      /* this.users = users;
      this.currentState = currentState; */
      this.socket = socket;
      this.containerUser = containerUser;
      this.colorToggle = false;

      this._setupSocket(socket);
    }
  
    _setupSocket(socket) {
      socket.on("newUserList", (name, users) => {
        this._userNewList(name, users);
      });

      socket.on("user_connected", (name) => {
        this._userJoin(name);
      });

      socket.on("user_disconnected", (name) => {
        this._userLeave(name);
      });

      /* socket.on("correct_guess", (data) => {
        this._userCorrectGuess(data);
      }); */
    }

    _userNewList(name, users) {
      for (const user in users) {
        console.log(`${user}: ${users[user]}`);
        let nameElement = document.createElement("div");
        nameElement.style.color = "black";
        nameElement.style.backgroundColor = this.colorToggle
            ? "darkgray"
            : "grey";
        this.colorToggle = !this.colorToggle;
        let userNameElement = document.createElement("b");
        userNameElement.innerText = users[user];
        let pointElement = document.createElement("p");
        pointElement.innerHTML = "Points: ";
        nameElement.id = `name_${users[user]}`;
        nameElement.appendChild(userNameElement);
        nameElement.appendChild(pointElement);
        containerUser.appendChild(nameElement);
      };
    }

    _userJoin(name) {
      let nameElement = document.createElement("div");
        nameElement.style.color = "black";
        nameElement.style.backgroundColor = this.colorToggle
            ? "darkgray"
            : "grey";
        this.colorToggle = !this.colorToggle;
        let userNameElement = document.createElement("b");
        userNameElement.innerText = name;
        let pointElement = document.createElement("p");
        pointElement.innerHTML = "Points: ";
        nameElement.id = `name_${name}`;
        nameElement.appendChild(userNameElement);
        nameElement.appendChild(pointElement);
        containerUser.appendChild(nameElement);
    }

    _userLeave(name) {
      let toRemove = document.getElementById(`name_${name}`);
      console.log(toRemove);
      toRemove.parentNode.removeChild(toRemove);
    }
  
    /* _joinMessage(data) {
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
    } */
  }
  