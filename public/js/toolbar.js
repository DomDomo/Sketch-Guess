export class Toolbar {
  _Colors = [
    "#fff",
    "#ef130b",
    "#ff7100",
    "#ffe400",
    "#00cc00",
    "#00b2ff",
    "#231fd3",
    "#000",
  ];

  constructor(toolbarDiv, canvas) {
    this.toolbarDiv = toolbarDiv;
    this.canvas = canvas;

    this.containerColorColumn = this._makeColorColumn(this.toolbarDiv);
    this.containerBrushSizes = document.getElementsByClassName(
      "containerBrushSizes"
    )[0];
    this.containerBrushSizes = this._addBrushSizes(this.containerBrushSizes);
  }

  _makeColorColumn(toolbarDiv) {
    const colorColumn = document.createElement("div");
    colorColumn.setAttribute("class", "containerColorColumn");
    toolbarDiv.appendChild(colorColumn);

    this._addColorItems(colorColumn);

    return colorColumn;
  }

  _addColorItems(colorColumn) {
    this._Colors.forEach((color) => {
      let colorElem = document.createElement("div");
      colorElem.setAttribute("class", "colorItem");
      colorElem.style.backgroundColor = color;
      colorElem.addEventListener("click", () => {
        canvas.setNewColor(color);
      });

      colorColumn.appendChild(colorElem);
    });
  }

  _addBrushSizes(containerBrushSizes) {
    let thickness = 5;
    containerBrushSizes.querySelectorAll(".brushSize").forEach((brushSize) => {
      brushSize.addEventListener("click", () => {
        let multiplier = brushSize.getAttribute("data-size");
        canvas.setNewThickness(50 * multiplier + 5);
      });
    });
  }
}
