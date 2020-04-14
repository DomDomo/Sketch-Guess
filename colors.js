var colorArray = ["000000", "ffaa33", "aabbcc", "2345ff", "abcdef", "123456"];
for (let i = 0; i < colorArray.length; i++) {
  let swatch = document.createElement("div");
  swatch.className = "swatch";
  swatch.style.backgroundColor = "#" + colorArray[i];
  document.getElementById("colors").appendChild(swatch);
}

const setColor = (color) => {
  context.fillStyle = color;
  context.strokeStyle = color;
  let active = document.getElementsByClassName("active")[0];
  if (active) {
    active.className = "swatch";
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
