/// cursor neon ///
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
    ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffffff';
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



// Configuración básica de escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("heart"), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Crear geometría de partículas en forma de corazón
const totalParticles = 1000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(totalParticles * 3);

function createHeartPath(i, total) {
  const t = (i / total) * Math.PI * 2;
  const scale = 0.14;
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  const z = Math.sin(t * 4) * 0.5;
  return new THREE.Vector3(x * scale, y * scale, z * scale);
}

// Asignar posiciones a las partículas
for (let i = 0; i < totalParticles; i++) {
  const p = createHeartPath(i, totalParticles);
  positions[i * 3] = p.x + (Math.random() - 0.5) * 0.1;
  positions[i * 3 + 1] = p.y + (Math.random() - 0.5) * 0.1;
  positions[i * 3 + 2] = p.z + (Math.random() - 0.5) * 0.1;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

// Material brillante tipo neón
const material = new THREE.PointsMaterial({
  color:'rgb(255, 0, 255)',
  size: 0.03,
  transparent: true,
  opacity: 0.8
});

// Crear y agregar partículas a la escena
const particles = new THREE.Points(geometry, material);
scene.add(particles);

camera.position.z = 4;

// ---------- Movimiento interactivo ----------
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

document.addEventListener("mousedown", (e) => {
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
});
document.addEventListener("mouseup", () => (isDragging = false));
document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    particles.rotation.y += deltaX * 0.01;
    particles.rotation.x += deltaY * 0.01;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  }
});

// ---------- Animación ----------
// Animación
let angle = 0; // Angulo inicial
function animate() {
  requestAnimationFrame(animate);
  // Angulo actual
  angle += 0.01;
  // mover corazon alrededor de eje y 
  const radius = 1.5; // distant eje y
  particles.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
// ---------- Ajuste de pantalla ----------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/// musica ///
// --- Música de fondo ---
function playBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  // --- Opción archivo local por parámetro 'musica' ---
  
  let btn = document.getElementById('music-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'music-btn';
    btn.textContent = 'Music';
    btn.style.position = 'fixed';
    btn.style.bottom = '18px';
    btn.style.right = '18px';
    btn.style.zIndex = 99;
    btn.style.background = 'rgba(123, 101, 117, 0.85)';
    btn.style.border = 'none';
    btn.style.borderRadius = '24px';
    btn.style.padding = '10px 18px';
    btn.style.fontSize = '1.1em';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);
  }
  audio.volume = 0.7;
  audio.loop = true;
  // Intentar reproducir inmediatamente
  audio.play().then(() => {
    btn.textContent = 'Music';
  }).catch(() => {
    // Si falla el autoplay, esperar click en el botón
    btn.textContent = 'Music';
  });
  btn.onclick = () => {
    if (audio.paused) {
      audio.play();
      btn.textContent = 'Music';
    } else {
      audio.pause();
      btn.textContent = 'Music';
    }
  };
}

// Intentar reproducir la música lo antes posible (al cargar la página)
window.addEventListener('DOMContentLoaded', () => {
  playBackgroundMusic();
});
