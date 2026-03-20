const player = document.getElementById('player');
const track = document.getElementById('track');
const scoreElement = document.getElementById('score');
const overlay = document.getElementById('overlay');
const finalScoreElement = document.getElementById('final-score');

let playerX = 135;
let score = 0;
let gameActive = true;
let obstacles = [];

// Handle Inputs
window.addEventListener('keydown', (e) => {
  if (!gameActive) return;
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    if (playerX > 10) playerX -= 25;
  }
  if (e.key === 'ArrowRight' || e.key === 'd') {
    if (playerX < 260) playerX += 25;
  }
  player.style.left = playerX + 'px';
});

function createObstacle() {
  if (!gameActive) return;
  const obs = document.createElement('div');
  obs.classList.add('obstacle');
  obs.style.left = Math.floor(Math.random() * 260) + 'px';
  obs.style.top = '-50px';
  track.appendChild(obs);
  obstacles.push({ element: obs, top: -50 });
}

function update() {
  if (!gameActive) return;

  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.top += 5; // Speed of the rolling
    obs.element.style.top = obs.top + 'px';

    // Collision Detection
    const playerRect = player.getBoundingClientRect();
    const obsRect = obs.element.getBoundingClientRect();

    if (
      playerRect.left < obsRect.right &&
      playerRect.right > obsRect.left &&
      playerRect.top < obsRect.bottom &&
      playerRect.bottom > obsRect.top
    ) {
      endGame();
    }

    // Score point and remove off-screen obstacles
    if (obs.top > 600) {
      obs.element.remove();
      obstacles.splice(i, 1);
      score++;
      scoreElement.innerText = `Score: ${score}`;
    }
  }

  requestAnimationFrame(update);
}

function endGame() {
  gameActive = false;
  finalScoreElement.innerText = score;
  overlay.classList.remove('hidden');
}

function resetGame() {
  score = 0;
  playerX = 135;
  gameActive = true;
  obstacles.forEach(obs => obs.element.remove());
  obstacles = [];
  scoreElement.innerText = `Score: 0`;
  overlay.classList.add('hidden');
  player.style.left = '135px';
  update();
}

// Spawn an obstacle every 1.5 seconds
setInterval(createObstacle, 1500);

// Start the game loop
update();
