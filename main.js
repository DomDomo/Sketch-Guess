const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const radius = 20;
const start = 0;
const end = Math.PI * 2;

let drawing = false;

const onResize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.lineWidth = radius * 2;
};

const onMouseDown = (event) => {
  drawing = true;
  putPoint(event);
};

const putPoint = (event) => {
  if (!drawing) return;
  context.lineTo(event.clientX, event.clientY);

  context.stroke();
  context.beginPath();
  context.arc(event.clientX, event.clientY, radius, start, end);
  context.fill();
  context.beginPath();
  context.moveTo(event.clientX, event.clientY);
};

const onMouseUp = () => {
  drawing = false;
  context.beginPath();
};
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mousemove", putPoint);
canvas.addEventListener("mouseup", onMouseUp);

window.addEventListener("resize", onResize, false);

onResize();
