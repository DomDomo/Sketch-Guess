import { words } from "./words.js";

export class Game {
  constructor(socket, wordChoiceBox, canvas) {
    this.socket = socket;
    this.choiceBox = wordChoiceBox;
    this.canvas = canvas;

    this.wordButtons = Array.from(wordChoiceBox.getElementsByClassName("btn"));
    this.choiceBoxHeader = wordChoiceBox.querySelector("h3");

    this.chosenWord;

    this._setupSocket(socket);
    this._revokeTurn(socket);
    this._setupChoiceBox(wordChoiceBox);
  }

  _beginGame() {
    let randomWords = words.sort(() => 0.5 - Math.random()).slice(0, 3);
    this._setWords(randomWords);
    //console.log(randomWords);
    this.choiceBox.style.display = "block";
  }

  _setWords(randomWords) {
    const { wordButtons } = this;
    for (let i = 0; i < randomWords.length; i++) {
      wordButtons[i].innerText = randomWords[i];
    }
  }

  _setupSocket(socket) {
    socket.on("game_start", () => {
      this._beginGame();
    });
  }

  _revokeTurn(socket) {
    socket.on("revoke_turn", () => {
      this.canvas.revokeCanvasAcces();
      this.choiceBoxHeader.style.display = "Choose a word!";
      this.choiceBox.style.display = "none";
      this.wordButtons.forEach((element) => {
        element.style.display = "";
      });
    });
  }

  _setupChoiceBox() {
    this.wordButtons.forEach((element) => {
      element.addEventListener("click", () => {
        this._chooseWord(element.innerText);
      });
    });
  }

  _chooseWord(word) {
    console.log(word);
    this.chosenWord = word;
    this.socket.emit("choosen_word", this.chosenWord);
    this.canvas.initiateTurn();
    this.wordButtons.forEach((element) => {
      element.style.display = "none";
    });
    this.choiceBoxHeader.innerText = `Your word is: ${word}`;
    this.canvas._resizeCanvas();
  }
}
