const minRad = 1;
const maxRad = 100;
const defaultRad = 20;
let interval = 5;
const radElem = document.getElementById("radval");
const decRadElem = document.getElementById("decrad");
const incRadElem = document.getElementById("incrad");

const setRadius = (rad, interval = 0) => {
  newRadius = rad + interval;
  if (rad === 1 && interval > 0) {
    newRadius = 5;
  }
  if (newRadius < minRad) {
    newRadius = minRad;
  } else if (newRadius > maxRad) {
    newRadius = maxRad;
  }
  radius = newRadius;
  context.lineWidth = radius * 2;
  current.lineWidth = radius * 2;

  radElem.innerHTML = radius;
};

decRadElem.addEventListener("click", () => {
  setRadius(radius, -interval);
});
incRadElem.addEventListener("click", () => {
  setRadius(radius, interval);
});

setRadius(defaultRad);
