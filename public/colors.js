var colorArray = [
  "000000",
  "ff6666",
  "ffbd55",
  "ffff66",
  "9de24f",
  "87cefa",
  "ffffff",
];
for (let i = 0; i < colorArray.length; i++) {
  let swatch = document.createElement("button");
  swatch.className = "swatch btn btn-secondary my-2 my-sm-0";
  if (colorArray[i] == "ffffff") {
    swatch.setAttribute("id", "eraser");
  }
  swatch.style.backgroundColor = "#" + colorArray[i];

  document.getElementById("colors").appendChild(swatch);
}

const setColor = (color) => {
  current.color = color;
  let active = document.getElementsByClassName("active")[0];
  if (active) {
    active.className = "swatch btn btn-secondary my-2 my-sm-0";
  }
};

const setSwatch = (event) => {
  let swatch = event.target;
  setColor(swatch.style.backgroundColor);
  swatch.className += " active";
};

const swatches = document.querySelectorAll(".swatch").forEach((swatch) => {
  swatch.addEventListener("click", setSwatch);
});

setSwatch({ target: document.getElementsByClassName("swatch")[0] });
