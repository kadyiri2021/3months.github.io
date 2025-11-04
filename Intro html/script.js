const canvas = document.getElementById("cursor");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let mouse = { x: width / 2, y: height / 2 };
let circles = [];

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function draw() {
  ctx.clearRect(0, 0, width, height);

  circles.push({ x: mouse.x, y: mouse.y, alpha: 1 });

  circles.forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 0, 255, ${c.alpha})';
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ff00ff";
    ctx.lineWidth = 3;
    ctx.stroke();
    c.alpha -= 0.02;
    if (c.alpha <= 0) circles.splice(i, 1);
  });

  requestAnimationFrame(draw);
}

draw();