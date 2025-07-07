import Player from './Player';
import Level from './Level';
import Enemy from './Enemy';
import Collectible from './Collectible';

class GameEngine {
  constructor(canvas, ctx, gameData) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.gameData = gameData;
    this.running = false;
    this.paused = false;
    this.animationId = null;
    
    // Game state
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.coins = 0;
    this.gameOver = false;
    
    // Game objects
    this.player = null;
    this.currentLevel = null;
    this.enemies = [];
    this.collectibles = [];
    
    // Input handling
    this.keys = {};
    this.setupInputHandling();
    
    // Callbacks
    this.onStatsUpdate = null;
    this.onGameOver = null;
    
    // Initialize game
    this.init();
  }
  
  init() {
    // Create player
    this.player = new Player(100, 400, this.canvas.width, this.canvas.height);
    
    // Load level
    this.loadLevel(this.level);
    
    // Update stats
    this.updateStats();
  }
  
  loadLevel(levelNumber) {
    const levelData = this.gameData.levels[levelNumber - 1] || this.gameData.levels[0];
    this.currentLevel = new Level(levelData, this.canvas.width, this.canvas.height);
    
    // Create enemies
    this.enemies = levelData.enemies.map(enemy => 
      new Enemy(enemy.x, enemy.y, enemy.type, this.canvas.width, this.canvas.height)
    );
    
    // Create collectibles
    this.collectibles = levelData.collectibles.map(collectible => 
      new Collectible(collectible.x, collectible.y, collectible.type)
    );
  }
  
  setupInputHandling() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      
      // Prevent default for game keys
      if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ShiftLeft', 'ShiftRight'].includes(e.code)) {
        e.preventDefault();
      }
      
      // Pause toggle
      if (e.code === 'KeyP') {
        this.togglePause();
      }
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }
  
  start() {
    if (!this.running) {
      this.running = true;
      this.gameLoop();
    }
  }
  
  stop() {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
  
  togglePause() {
    this.paused = !this.paused;
    if (!this.paused && this.running) {
      this.gameLoop();
    }
  }
  
  restart() {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.coins = 0;
    this.gameOver = false;
    this.paused = false;
    
    this.init();
    
    if (!this.running) {
      this.start();
    }
  }
  
  gameLoop() {
    if (!this.running || this.paused) return;
    
    this.update();
    this.render();
    
    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }
  
  update() {
    if (this.gameOver) return;
    
    // Update player
    this.player.update(this.keys, this.currentLevel.platforms);
    
    // Update enemies
    this.enemies.forEach(enemy => {
      enemy.update(this.currentLevel.platforms);
    });
    
    // Check collisions
    this.checkCollisions();
    
    // Check if player fell off screen
    if (this.player.y > this.canvas.height) {
      this.loseLife();
    }
    
    // Check level completion
    if (this.player.x > this.canvas.width - 50) {
      this.nextLevel();
    }
  }
  
  checkCollisions() {
    // Player vs Enemies
    this.enemies.forEach((enemy, index) => {
      if (this.player.collidesWith(enemy)) {
        if (this.player.velocityY > 0 && this.player.y < enemy.y) {
          // Player jumped on enemy
          this.enemies.splice(index, 1);
          this.score += 100;
          this.player.velocityY = -8; // Bounce
        } else {
          // Player hit enemy
          this.loseLife();
        }
      }
    });
    
    // Player vs Collectibles
    this.collectibles.forEach((collectible, index) => {
      if (this.player.collidesWith(collectible)) {
        this.collectibles.splice(index, 1);
        
        if (collectible.type === 'coin') {
          this.coins++;
          this.score += 50;
          
          // Extra life every 100 coins
          if (this.coins % 100 === 0) {
            this.lives++;
          }
        } else if (collectible.type === 'powerup') {
          this.player.powerUp();
          this.score += 500;
        }
      }
    });
    
    this.updateStats();
  }
  
  loseLife() {
    this.lives--;
    
    if (this.lives <= 0) {
      this.gameOver = true;
      if (this.onGameOver) {
        this.onGameOver(this.score);
      }
    } else {
      // Respawn player
      this.player.x = 100;
      this.player.y = 400;
      this.player.velocityX = 0;
      this.player.velocityY = 0;
    }
    
    this.updateStats();
  }
  
  nextLevel() {
    this.level++;
    this.score += 1000; // Level completion bonus
    
    if (this.level > this.gameData.levels.length) {
      // Game completed
      this.gameOver = true;
      if (this.onGameOver) {
        this.onGameOver(this.score);
      }
    } else {
      this.loadLevel(this.level);
      this.player.x = 100;
      this.player.y = 400;
    }
    
    this.updateStats();
  }
  
  updateStats() {
    if (this.onStatsUpdate) {
      this.onStatsUpdate({
        score: this.score,
        lives: this.lives,
        level: this.level,
        coins: this.coins,
        gameOver: this.gameOver,
        paused: this.paused
      });
    }
  }
  
  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background
    this.drawBackground();
    
    // Draw level
    this.currentLevel.render(this.ctx);
    
    // Draw collectibles
    this.collectibles.forEach(collectible => {
      collectible.render(this.ctx);
    });
    
    // Draw enemies
    this.enemies.forEach(enemy => {
      enemy.render(this.ctx);
    });
    
    // Draw player
    this.player.render(this.ctx);
  }
  
  drawBackground() {
    // Simple gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw clouds
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.drawCloud(150, 80);
    this.drawCloud(400, 60);
    this.drawCloud(650, 100);
  }
  
  drawCloud(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 20, 0, Math.PI * 2);
    this.ctx.arc(x + 20, y, 25, 0, Math.PI * 2);
    this.ctx.arc(x + 40, y, 20, 0, Math.PI * 2);
    this.ctx.arc(x + 10, y - 15, 15, 0, Math.PI * 2);
    this.ctx.arc(x + 30, y - 15, 15, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

export default GameEngine;