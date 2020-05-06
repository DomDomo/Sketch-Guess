export class Toolbar {
  _Colors = ["#fff", "#c1c1c1", "#ef130b", "#ff7100", "#ffe400"];

  constructor(toolbarDiv) {
    this.toolbarDiv = toolbarDiv;

    this.containerColorColumn = this._makeColorColumn(this.toolbarDiv);
  }

  _makeColorColumn(toolbarDiv) {
    const colorColumn = document.createElement("div");
    colorColumn.setAttribute("class", "containerColorColumn");
    toolbarDiv.appendChild(colorColumn);

    this._addColorItems(colorColumn);

    console.log(colorColumn);

    return colorColumn;
  }

  _addColorItems(colorColumn) {
    this._Colors.forEach((color) => {
      let colorElem = document.createElement("div");
      colorElem.setAttribute("class", "colorItem");
      colorElem.style.backgroundColor = color;

      colorColumn.appendChild(colorElem);
    });
  }
}
