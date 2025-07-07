class Enemy {
  constructor(x, y, type, canvasWidth, canvasHeight) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = 24;
    this.height = 24;
    this.velocityX = -1;
    this.velocityY = 0;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.onGround = false;
    this.animationFrame = 0;
    this.animationSpeed = 0.1;
    this.direction = -1;
  }
  
  update(platforms) {
    // Update animation
    this.animationFrame += this.animationSpeed;
    
    // Apply gravity
    this.velocityY += 0.5;
    
    // Move enemy
    this.x += this.velocityX;
    this.y += this.velocityY;
    
    // Check platform collisions
    this.checkPlatformCollisions(platforms);
    
    // Reverse direction at edges or walls
    if (this.x <= 0 || this.x >= this.canvasWidth - this.width) {
      this.direction *= -1;
      this.velocityX = this.direction;
    }
    
    // Remove if fallen off screen
    if (this.y > this.canvasHeight) {
      this.y = this.canvasHeight + 100; // Mark for removal
    }
  }
  
  checkPlatformCollisions(platforms) {
    this.onGround = false;
    
    platforms.forEach(platform => {
      if (this.collidesWith(platform)) {
        // Top collision (landing on platform)
        if (this.velocityY > 0 && this.y < platform.y) {
          this.y = platform.y - this.height;
          this.velocityY = 0;
          this.onGround = true;
        }
        // Side collisions - reverse direction
        else if (this.velocityX > 0 && this.x < platform.x) {
          this.x = platform.x - this.width;
          this.direction = -1;
          this.velocityX = this.direction;
        }
        else if (this.velocityX < 0 && this.x > platform.x) {
          this.x = platform.x + platform.width;
          this.direction = 1;
          this.velocityX = this.direction;
        }
      }
    });
  }
  
  collidesWith(object) {
    return this.x < object.x + object.width &&
           this.x + this.width > object.x &&
           this.y < object.y + object.height &&
           this.y + this.height > object.y;
  }
  
  render(ctx) {
    switch (this.type) {
      case 'goomba':
        this.drawGoomba(ctx);
        break;
      case 'koopa':
        this.drawKoopa(ctx);
        break;
      default:
        this.drawGoomba(ctx);
    }
  }
  
  drawGoomba(ctx) {
    // Body
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(this.x, this.y + 8, this.width, this.height - 8);
    
    // Head
    ctx.fillStyle = '#CD853F';
    ctx.fillRect(this.x + 2, this.y, this.width - 4, 16);
    
    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(this.x + 6, this.y + 4, 3, 3);
    ctx.fillRect(this.x + 15, this.y + 4, 3, 3);
    
    // Mouth
    ctx.fillRect(this.x + 10, this.y + 10, 4, 2);
    
    // Feet animation
    const footOffset = Math.sin(this.animationFrame * 10) * 2;
    ctx.fillStyle = '#654321';
    ctx.fillRect(this.x + 2, this.y + this.height - 4, 6, 4);
    ctx.fillRect(this.x + this.width - 8, this.y + this.height - 4 + footOffset, 6, 4);
  }
  
  drawKoopa(ctx) {
    // Shell
    ctx.fillStyle = '#228B22';
    ctx.fillRect(this.x + 2, this.y + 8, this.width - 4, this.height - 12);
    
    // Shell pattern
    ctx.strokeStyle = '#006400';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x + 2, this.y + 8, this.width - 4, this.height - 12);
    
    // Head
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(this.x + 6, this.y, 12, 12);
    
    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(this.x + 8, this.y + 3, 2, 2);
    ctx.fillRect(this.x + 14, this.y + 3, 2, 2);
    
    // Feet
    ctx.fillStyle = '#228B22';
    ctx.fillRect(this.x, this.y + this.height - 4, 6, 4);
    ctx.fillRect(this.x + this.width - 6, this.y + this.height - 4, 6, 4);
  }
}

export default Enemy;