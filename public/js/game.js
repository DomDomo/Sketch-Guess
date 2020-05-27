import { words } from "./words.js";

export class Game {
  constructor(
    choiceBoxHeader,
    choiceButtonsDiv,
    socket,
    wordChoiceBox,
    canvas
  ) {
    this.socket = socket;
    this.choiceBox = wordChoiceBox;
    this.canvas = canvas;

    this.wordButtons = Array.from(wordChoiceBox.getElementsByClassName("btn"));
    this.choiceBoxHeader = choiceBoxHeader;
    this.choiceButtonsDiv = choiceButtonsDiv;

    this.chosenWord;

    this._setupSocket(socket);
    this._revokeTurn(socket);
    this._setupChoiceBox(wordChoiceBox);
  }

  _beginGame() {
    let randomWords = words.sort(() => 0.5 - Math.random()).slice(0, 3);
    this._setWords(randomWords);

    this.choiceButtonsDiv.style.display = "block";
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
    socket.on("start_countdown", (data) => {
      this._startCountdown(data);
    });
  }

  _revokeTurn(socket) {
    socket.on("revoke_turn", () => {
      this.canvas.revokeCanvasAcces();
      this.choiceButtonsDiv.style.display = "none";
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
    this.chosenWord = word;
    this.socket.emit("choosen_word", this.chosenWord);
    this.canvas.initiateTurn();
    this.choiceButtonsDiv.style.display = "none";
    this.choiceBoxHeader.innerText = `Your word is: ${word}`;
    this.canvas._resizeCanvas();
  }

  _startCountdown(data) {
    let time = data.time;

    let timer = setInterval(() => {
      if (time === 0) {
        this.choiceBoxHeader.innerText = `Round begins in: ${time}`;
        //When the timer is finished begin the round
        this.choiceBoxHeader.innerText = "";
        clearInterval(timer);
      } else {
        time -= 1;
        this.choiceBoxHeader.innerText = `Round begins in: ${time}`;
      }
    }, 1000);
  }
}
