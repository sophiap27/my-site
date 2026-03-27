const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('final-score');
const overlay = document.getElementById('overlay');
const restartBtn = document.getElementById('restart-btn');

// Game State
let score = 0;
let gameActive = true;
let speed = 5;
let obstacles = [];
let ball = {
    x: 0, // Centered (range -1 to 1)
    y: 0.8, 
    radius: 15
};

// Controls
let keys = {};
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function spawnObstacle() {
    if (Math.random() < 0.05) {
        obstacles.push({
            x: (Math.random() * 2) - 1,
            z: 0, // Start at horizon
            width: 0.4
        });
    }
}

function update() {
    if (!gameActive) return;

    // Movement
    if ((keys['arrowleft'] || keys['a']) && ball.x > -0.9) ball.x -= 0.04;
    if ((keys['arrowright'] || keys['d']) && ball.x < 0.9) ball.x += 0.04;

    // Obstacle Logic
    spawnObstacle();
    
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.z += speed / 500; // Move toward screen

        // Collision Check
        if (obs.z > 0.75 && obs.z < 0.85) {
            if (Math.abs(ball.x - obs.x) < 0.2) {
                endGame();
            }
        }

        // Scoring & Cleanup
        if (obs.z > 1) {
            obstacles.splice(i, 1);
            score++;
            scoreEl.innerText = score;
        }
    }
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const horizonY = canvas.height * 0.4;

    // Draw Sloped Road
    ctx.strokeStyle = '#39ff14';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 50, horizonY);
    ctx.lineTo(centerX + 50, horizonY);
    ctx.lineTo(canvas.width + 200, canvas.height);
    ctx.lineTo(-200, canvas.height);
    ctx.closePath();
    ctx.stroke();

    // Draw Obstacles (Red)
    obstacles.forEach(obs => {
        let perspective = obs.z; 
        let drawX = centerX + (obs.x * centerX * perspective);
        let drawY = horizonY + (perspective * (canvas.height - horizonY));
        let size = perspective * 100;

        ctx.fillStyle = '#ff0000';
        ctx.fillRect(drawX - size/2, drawY - size, size, size);
    });

    // Draw Ball (Neon Green)
    let ballDrawX = centerX + (ball.x * centerX * 0.8);
    let ballDrawY = horizonY + (0.8 * (canvas.height - horizonY));
    
    ctx.fillStyle = '#39ff14';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#39ff14';
    ctx.beginPath();
    ctx.arc(ballDrawX, ballDrawY, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function endGame() {
    gameActive = false;
    overlay.style.display = 'flex';
    finalScoreEl.innerText = score;
}

function reset() {
    score = 0;
    obstacles = [];
    ball.x = 0;
    gameActive = true;
    scoreEl.innerText = "0";
    overlay.style.display = 'none';
    loop();
}

restartBtn.addEventListener('click', reset);

function loop() {
    update();
    draw();
    if (gameActive) requestAnimationFrame(loop);
}

loop();
