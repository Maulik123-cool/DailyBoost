const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

// Player properties
const player = {
  x: width / 2 - 20,
  y: height - 60,
  width: 40,
  height: 40,
  speed: 5,
  dx: 0,
};

// Bullets array
let bullets = [];

// Enemies array
let enemies = [];
const enemySize = 30;
let enemySpeed = 1;
let spawnTimer = 0;
let spawnInterval = 100; // frames

// Score
let score = 0;

// Handle keyboard input
const keys = {
  left: false,
  right: false,
  space: false,
};

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = true;
  if (e.code === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = true;
  if (e.code === "Space") keys.space = true;
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = false;
  if (e.code === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = false;
  if (e.code === "Space") keys.space = false;
});

// Shoot cooldown to avoid spamming bullets
let canShoot = true;
const shootCooldown = 15; // frames
let shootTimer = 0;

function shoot() {
  bullets.push({
    x: player.x + player.width / 2 - 3,
    y: player.y,
    width: 6,
    height: 10,
    speed: 7,
  });
}

function update() {
  // Move player
  if (keys.left) player.dx = -player.speed;
  else if (keys.right) player.dx = player.speed;
  else player.dx = 0;

  player.x += player.dx;

  // Prevent going out of bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > width) player.x = width - player.width;

  // Shooting logic
  if (keys.space && canShoot) {
    shoot();
    canShoot = false;
    shootTimer = 0;
  }

  if (!canShoot) {
    shootTimer++;
    if (shootTimer > shootCooldown) {
      canShoot = true;
    }
  }

  // Update bullets
  bullets = bullets.filter((b) => b.y + b.height > 0);
  bullets.forEach((b) => (b.y -= b.speed));

  // Spawn enemies over time
  spawnTimer++;
  if (spawnTimer > spawnInterval) {
    spawnTimer = 0;
    const x = Math.random() * (width - enemySize);
    enemies.push({
      x: x,
      y: -enemySize,
      width: enemySize,
      height: enemySize,
      speed: enemySpeed,
    });
  }

  // Update enemies
  enemies.forEach((e) => (e.y += e.speed));

  // Remove enemies that go off screen
  enemies = enemies.filter((e) => e.y < height);

  // Check collisions between bullets and enemies
  bullets.forEach((b, bIndex) => {
    enemies.forEach((e, eIndex) => {
      if (
        b.x < e.x + e.width &&
        b.x + b.width > e.x &&
        b.y < e.y + e.height &&
        b.y + b.height > e.y
      ) {
        // Collision detected
        bullets.splice(bIndex, 1);
        enemies.splice(eIndex, 1);
        score++;
        enemySpeed += 0.05; // Speed up enemies slightly
        spawnInterval = Math.max(20, spawnInterval - 1); // Spawn faster
        document.getElementById("score").innerText = score;
      }
    });
  });
}

function drawPlayer() {
  ctx.fillStyle = "#0f0";
  ctx.fillRect(player.x, player.y, player.width, player.height);
  // Simple barrel
  ctx.fillStyle = "#0c0";
  ctx.fillRect(player.x + player.width / 2 - 5, player.y - 10, 10, 10);
}

function drawBullets() {
  ctx.fillStyle = "#ff0";
  bullets.forEach((b) => ctx.fillRect(b.x, b.y, b.width, b.height));
}

function drawEnemies() {
  ctx.fillStyle = "#f00";
  enemies.forEach((e) => ctx.fillRect(e.x, e.y, e.width, e.height));
}

function clear() {
  ctx.clearRect(0, 0, width, height);
}

function gameLoop() {
  clear();
  update();
  drawPlayer();
  drawBullets();
  drawEnemies();
  requestAnimationFrame(gameLoop);
}

gameLoop();
