// --- Load Games ---
fetch("games.json")
  .then(res => res.json())
  .then(games => {
    const container = document.querySelector(".content");

    games.forEach(game => {
      const div = document.createElement("div");
      div.className = "game";
      div.innerHTML = `
        <img src="${game.image}" />
        <h2>${game.name}</h2>
      `;

      // Click image to expand modal
      const img = div.querySelector("img");
      img.addEventListener("click", () => openModal(game, img));

      container.appendChild(div);
    });
  });

// --- Modal Elements ---
const modal = document.getElementById("gameModal");
const closeModalBtn = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalTrailer = document.getElementById("modalTrailer");
const modalScreenshots = document.getElementById("modalScreenshots");
const modalLink = document.getElementById("modalLink");
const currentSS = document.getElementById("currentSS");
const prevSS = document.getElementById("prevSS");
const nextSS = document.getElementById("nextSS");

let currentScreenshots = [];
let currentIndex = 0;

// --- Open Modal with expanding animation ---
function openModal(game, imgElement) {
  const rect = imgElement.getBoundingClientRect();
  const modalContent = document.querySelector(".modal-content");

  modal.style.display = "block";

  // Start from image position
  modalContent.style.top = rect.top + "px";
  modalContent.style.left = rect.left + "px";
  modalContent.style.width = rect.width + "px";
  modalContent.style.height = rect.height + "px";
  modalContent.style.transform = "scale(0.1)";

  // Fill modal content
  modalTitle.textContent = game.name;
  modalTrailer.src = game.trailer || "";
  modalLink.href = game.link;

  currentScreenshots = game.screenshots || [];
  currentIndex = 0;
  currentSS.src = currentScreenshots.length > 0 ? currentScreenshots[currentIndex] : "";

  // Animate to center and full size
  setTimeout(() => {
    modalContent.style.top = "50%";
    modalContent.style.left = "50%";
    modalContent.style.width = "80%";
    modalContent.style.height = "auto";
    modalContent.style.transform = "translate(-50%, -50%) scale(1)";
  }, 10);
}

// --- Close Modal ---
function closeModal() {
  const modalContent = document.querySelector(".modal-content");
  modalContent.style.transform = "scale(0.1)";
  setTimeout(() => {
    modal.style.display = "none";
  }, 400);
}

closeModalBtn.onclick = closeModal;
window.onclick = e => { if (e.target === modal) closeModal(); };

// --- Screenshot Carousel ---
prevSS.onclick = () => {
  if(currentScreenshots.length === 0) return;
  currentIndex = (currentIndex - 1 + currentScreenshots.length) % currentScreenshots.length;
  currentSS.src = currentScreenshots[currentIndex];
};

nextSS.onclick = () => {
  if(currentScreenshots.length === 0) return;
  currentIndex = (currentIndex + 1) % currentScreenshots.length;
  currentSS.src = currentScreenshots[currentIndex];
};

// --- Sci-Fi Starfield Background ---
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    z: Math.random()*canvas.width
  });
}

function animate() {
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let i=0;i<stars.length;i++){
    let star = stars[i];
    star.z -= 2;
    if(star.z <=0){
      star.z = canvas.width;
      star.x = Math.random()*canvas.width;
      star.y = Math.random()*canvas.height;
    }
    let k = 128.0/star.z;
    let px = (star.x - canvas.width/2)*k + canvas.width/2;
    let py = (star.y - canvas.height/2)*k + canvas.height/2;
    ctx.fillStyle = "#0ff";
    ctx.fillRect(px, py, 2, 2);
  }
  requestAnimationFrame(animate);
}

animate();
// Background Audio
var bgAudio = new Audio('background-music.mp3'); // Replace with your file path
bgAudio.loop = true;
bgAudio.volume = 0.27; // Adjust volume 0.0 - 1.0

// Play audio on first user interaction (to bypass autoplay restrictions)
function startAudio() {
  bgAudio.play().catch(err => console.log('Audio autoplay blocked:', err));
  document.removeEventListener('click', startAudio);
}
document.addEventListener('click', startAudio);

// Mute/Unmute toggle button
const audioToggle = document.getElementById('audioToggle');
audioToggle.addEventListener('click', () => {
  if (bgAudio.paused) {
    bgAudio.play();
    audioToggle.textContent = '🔊';
  } else {
    bgAudio.pause();
    audioToggle.textContent = '🔇';
  }
});