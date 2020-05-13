export class Canvas {
  constructor(canvasDiv, socket, color = "#4d4d4d", thickness = 20) {
    this.canvasDiv = canvasDiv;

    this.canvas = this._makeCanvas(this.canvasDiv);

    this.context = this.canvas.getContext("2d");

    this.socket = socket;

    this.color = color;
    this.thickness = thickness;
    this.dragging = false;

    this.myTurn = false;

    this.rect = this.canvas.getBoundingClientRect();
    this.x = undefined;
    this.y = undefined;

    this.canvas.addEventListener("mousedown", (event) =>
      this._mouseDown(event)
    );
    this.canvas.addEventListener("mousemove", (event) =>
      this._mouseMove(event)
    );
    this.canvas.addEventListener("mouseup", (event) => this._mouseUp(event));

    const self = this;
    window.addEventListener("resize", () => self._resizeCanvas());

    this._resizeCanvas();
  }

  _makeCanvas(canvasDiv) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    canvas.setAttribute("height", this.canvasDiv.offsetHeight);
    canvas.setAttribute("width", this.canvasDiv.offsetWidth);
    canvas.style.backgroundColor = "white";
    canvasDiv.appendChild(canvas);

    return canvas;
  }

  _resizeCanvas() {
    const { canvas, canvasDiv } = this;

    canvas.width = canvasDiv.offsetWidth;
    canvas.height = canvasDiv.offsetHeight;

    this.rect = this.canvas.getBoundingClientRect();
    //this.clearCanvas(true);
  }

  clearCanvas(emit = false) {
    this.context.clearRect(
      0,
      0,
      this.canvasDiv.offsetWidth,
      this.canvasDiv.offsetHeight
    );

    if (emit) this.socket.emit("clear_canvas");
  }

  drawLine(x0, y0, x1, y1, color, thickness, emit = false) {
    this.context.beginPath();
    this.context.moveTo(x0, y0);
    this.context.lineTo(x1, y1);
    this.context.strokeStyle = color;
    this.context.lineWidth = thickness;
    this.context.lineCap = "round";
    this.context.stroke();
    this.context.closePath();

    if (emit) {
      this._sendDrawingData(x0, y0, x1, y1, this.color, this.thickness);
    }
  }

  _mouseDown(event) {
    this.dragging = true;
    this.x = event.pageX - this.rect.x;
    this.y = event.pageY - this.rect.y - window.scrollY;
  }

  _mouseMove(event) {
    if (!this.dragging || !this.myTurn) {
      return;
    }

    this.drawLine(
      this.x,
      this.y,
      event.pageX - this.rect.x,
      event.pageY - this.rect.y - window.scrollY,
      this.color,
      this.thickness,
      true
    );
    this.x = event.pageX - this.rect.x;
    this.y = event.pageY - this.rect.y - window.scrollY;
  }

  _mouseUp(event) {
    if (!this.dragging || !this.myTurn) {
      return;
    }
    this.dragging = false;
    this.drawLine(
      this.x,
      this.y,
      event.pageX - this.rect.x,
      event.pageY - this.rect.y - window.scrollY,
      this.color,
      this.thickness,
      true
    );
  }

  _sendDrawingData(x0, y0, x1, y1, color, thickness) {
    const { canvas, socket } = this;

    const data = {
      x0: x0 / canvas.width,
      y0: y0 / canvas.height,
      x1: x1 / canvas.width,
      y1: y1 / canvas.height,
      color: color,
      thickness: thickness,
    };
    socket.emit("drawing", data);
  }

  receiveDrawingData(data) {
    const { canvas } = this;

    this.drawLine(
      data.x0 * canvas.width,
      data.y0 * canvas.height,
      data.x1 * canvas.width,
      data.y1 * canvas.height,
      data.color,
      data.thickness
    );
  }

  setNewColor(newColor) {
    this.color = newColor;
  }
  setNewThickness(newThickness) {
    this.thickness = newThickness;
  }
  initiateTurn() {
    this.myTurn = true;
    this.dragging = false;
  }
  revokeCanvasAcces() {
    this.myTurn = false;
    this.dragging = false;
    this.clearCanvas(true);
  }
}
