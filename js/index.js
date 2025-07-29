// snakeGame-upgraded.js
// ---------------------------------------------
// Modern, feature‑rich Snake game implementation
// ---------------------------------------------
// ‣ ES6 class‑based architecture
// ‣ Adaptive speed scaling & pause/resume
// ‣ Mobile swipe controls
// ‣ Robust collision & food‑placement logic
// ‣ High‑score persistence (localStorage)
// ‣ Centralised audio management with graceful fall‑backs
// ‣ Strict mode & constant naming for reliability

"use strict";

/* ─────────────────────────
   Utility helpers
   ───────────────────────── */
const GRID_SIZE = 18;
const INITIAL_SPEED = 6;          // squares per second
const SPEED_STEP = 0.5;           // speed increase after every threshold
const SPEED_INCREMENT_EVERY = 5;  // points

const Direction = Object.freeze({
  ArrowUp:    { x: 0,  y: -1 },
  ArrowDown:  { x: 0,  y: 1  },
  ArrowLeft:  { x: -1, y: 0  },
  ArrowRight: { x: 1,  y: 0  },
});

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ─────────────────────────
   Audio Manager
   ───────────────────────── */
class AudioManager {
  constructor() {
    this.sounds = {
      food:   new Audio("snake-hiss-95241.mp3"),
      move:   new Audio("snake-hiss-95241.mp3"),
      over:   new Audio("game-over.mp3"),
      theme:  new Audio("background-theme.mp3"),
    };
    this.sounds.theme.loop = true;
  }
  play(name) {
    if (this.sounds[name]) {
      // Clone to allow rapid successive plays without waiting to finish
      const clone = this.sounds[name].cloneNode();
      void clone.play().catch(() => {/* autoplay blocked */});
    }
  }
  startMusic() { this.sounds.theme.play().catch(() => {}); }
  stopMusic()  { this.sounds.theme.pause();  this.sounds.theme.currentTime = 0; }
}

/* ─────────────────────────
   Core Game Class
   ───────────────────────── */
class SnakeGame {
  constructor({
    boardId = "board",
    scoreId = "scoreBox",
    hiScoreId = "hiScoreBox",
  } = {}) {
    // DOM refs
    this.board     = document.getElementById(boardId);
    this.scoreBox  = document.getElementById(scoreId);
    this.hiScoreBox= document.getElementById(hiScoreId);

    // State vars
    this.audio   = new AudioManager();
    this.speed   = INITIAL_SPEED;
    this.score   = 0;
    this.snake   = [{ x: 13, y: 15 }];
    this.inputDir= { x: 0, y: 0 };
    this.food    = this.#randomFood();
    this.lastTime= 0;
    this.running = false;

    // Hi‑score
    this.hiScore = Number(localStorage.getItem("hiScore")) || 0;
    this.hiScoreBox.textContent = `Hi‑Score: ${this.hiScore}`;

    // Bindings
    this.#setEventListeners();
    this.#start();
  }

  /* ───────────── Private ───────────── */
  #start() {
    this.running = true;
    this.audio.startMusic();
    requestAnimationFrame(this.#gameLoop.bind(this));
  }

  #restart() {
    this.speed  = INITIAL_SPEED;
    this.score  = 0;
    this.snake  = [{ x: 13, y: 15 }];
    this.food   = this.#randomFood();
    this.inputDir = { x: 0, y: 0 };
    this.scoreBox.textContent = "Score: 0";
    this.board.innerHTML = "";
    this.audio.startMusic();
    if (!this.running) {
      this.running = true;
      requestAnimationFrame(this.#gameLoop.bind(this));
    }
  }

  #gameLoop(currentTime) {
    if (!this.running) return; // paused
    if ((currentTime - this.lastTime) / 1000 < 1 / this.speed) {
      requestAnimationFrame(this.#gameLoop.bind(this));
      return;
    }
    this.lastTime = currentTime;

    // Update → Render → Queue next frame
    this.#update();
    this.#render();

    requestAnimationFrame(this.#gameLoop.bind(this));
  }

  #update() {
    // 1. Collision detection
    if (this.#isCollision()) {
      this.running = false;
      this.audio.play("over");
      this.audio.stopMusic();
      alert("Game Over! Press OK or tap to restart.");
      return this.#restart();
    }

    // 2. Food eaten
    if (this.snake[0].x === this.food.x && this.snake[0].y === this.food.y) {
      this.audio.play("food");
      this.score += 1;
      // Increase speed every few points
      if (this.score % SPEED_INCREMENT_EVERY === 0) this.speed += SPEED_STEP;
      // Extend snake (push a new head will happen below after shifting)
      this.snake.unshift({ ...this.snake[0] });
      // New food
      this.food = this.#randomFood();
      this.#updateScoreUI();
    }

    // 3. Move snake body (iterate backwards)
    for (let i = this.snake.length - 2; i >= 0; --i) {
      this.snake[i + 1] = { ...this.snake[i] };
    }
    // 4. Move head
    this.snake[0].x += this.inputDir.x;
    this.snake[0].y += this.inputDir.y;
  }

  #render() {
    // Clear board
    this.board.innerHTML = "";

    // Render snake
    this.snake.forEach((segment, idx) => {
      const el = document.createElement("div");
      el.style.gridRowStart = segment.y;
      el.style.gridColumnStart = segment.x;
      el.className = idx === 0 ? "head" : "snake";
      this.board.appendChild(el);
    });

    // Render food
    const foodEl = document.createElement("div");
    foodEl.style.gridRowStart = this.food.y;
    foodEl.style.gridColumnStart = this.food.x;
    foodEl.className = "food";
    this.board.appendChild(foodEl);
  }

  #isCollision() {
    // Self
    for (let i = 1; i < this.snake.length; ++i) {
      if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) {
        return true;
      }
    }
    // Walls
    return (
      this.snake[0].x <= 0 ||
      this.snake[0].y <= 0 ||
      this.snake[0].x > GRID_SIZE ||
      this.snake[0].y > GRID_SIZE
    );
  }

  #randomFood() {
    let newPos;
    do {
      newPos = { x: randomInt(1, GRID_SIZE), y: randomInt(1, GRID_SIZE) };
    } while (this.snake.some(seg => seg.x === newPos.x && seg.y === newPos.y));
    return newPos;
  }

  #updateScoreUI() {
    this.scoreBox.textContent = `Score: ${this.score}`;
    if (this.score > this.hiScore) {
      this.hiScore = this.score;
      localStorage.setItem("hiScore", String(this.hiScore));
      this.hiScoreBox.textContent = `Hi‑Score: ${this.hiScore}`;
    }
  }

  #setEventListeners() {
    // Keyboard
    window.addEventListener("keydown", e => {
      if (e.key in Direction) {
        this.audio.play("move");
        this.inputDir = Direction[e.key];
      } else if (e.key === " ") {
        // Spacebar pause/resume
        if (this.running) {
          this.running = false;
          this.audio.stopMusic();
        } else {
          this.running = true;
          this.audio.startMusic();
          requestAnimationFrame(this.#gameLoop.bind(this));
        }
      }
    });

    // Mobile swipe support
    let touchStartX = 0;
    let touchStartY = 0;
    window.addEventListener("touchstart", e => {
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    });
    window.addEventListener("touchend", e => {
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy)) {
        this.inputDir = dx > 0 ? Direction.ArrowRight : Direction.ArrowLeft;
      } else {
        this.inputDir = dy > 0 ? Direction.ArrowDown : Direction.ArrowUp;
      }
      this.audio.play("move");
    });
  }
}

/* ─────────────────────────
   Initialise game after DOM ready
   ───────────────────────── */
window.addEventListener("DOMContentLoaded", () => {
  new SnakeGame();
});
