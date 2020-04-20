const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const socket = io();

let radius = 20;
const start = 0;
const end = Math.PI * 2;

let drawing = false;

const onResize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.lineWidth = radius * 2;
};

socket.on("draw", (data) => {
  context.lineTo(data.x, data.y);

  context.stroke();
  context.beginPath();
  context.arc(data.x, data.y, radius, start, end);
  context.fill();

  context.beginPath();
  context.moveTo(event.clientX, event.clientY);
});

const onMouseDown = (event) => {
  drawing = true;
  putPoint(event);
};

const putPoint = (event) => {
  if (!drawing) return;
  context.lineTo(event.clientX, event.clientY);

  let data = {
    x: event.clientX,
    y: event.clientY,
  };

  socket.emit("draw", data);

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
canvas.addEventListener("mouseleave", onMouseUp);

window.addEventListener("resize", onResize, false);

onResize();
