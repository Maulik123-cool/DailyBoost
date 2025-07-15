const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 40,
  width: 30,
  height: 30,
  speed: 5,
  color: "lime"
};

let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;
let keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " " && !gameOver) shoot();
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function shoot() {
  bullets.push({
    x: player.x + player.width / 2 - 2,
    y: player.y,
    width: 4,
    height: 10,
    speed: 7,
    color: "yellow"
  });
}

function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    width: 30,
    height: 30,
    speed: 2 + Math.random() * 2,
    color: "red"
  });
}

function drawRect(obj) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function update() {
  if (gameOver) return;

  // Move player
  if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
  if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  // Move bullets
  bullets.forEach((b, i) => {
    b.y -= b.speed;
    if (b.y < 0) bullets.splice(i, 1);
  });

  // Move enemies and check death conditions
  for (let ei = enemies.length - 1; ei >= 0; ei--) {
    const e = enemies[ei];
    e.y += e.speed;

    // Die if enemy hits player
    if (isColliding(e, player)) {
      gameOver = true;
      break;
    }

    // Die if enemy reaches bottom
    if (e.y + e.height >= canvas.height) {
      gameOver = true;
      break;
    }

    // Check bullet collision
    for (let bi = bullets.length - 1; bi >= 0; bi--) {
      if (isColliding(bullets[bi], e)) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score++;
        document.getElementById("score").innerText = score;
        break;
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(player);
  bullets.forEach(drawRect);
  enemies.forEach(drawRect);

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", 100, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

setInterval(spawnEnemy, 1000);
gameLoop();
