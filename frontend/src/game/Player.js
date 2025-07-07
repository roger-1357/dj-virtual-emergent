class Player {
  constructor(x, y, canvasWidth, canvasHeight) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 5;
    this.jumpPower = 12;
    this.onGround = false;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.facing = 'right';
    this.powered = false;
    this.animationFrame = 0;
    this.animationSpeed = 0.2;
  }
  
  update(keys, platforms) {
    // Handle input
    this.handleInput(keys);
    
    // Apply gravity
    this.velocityY += 0.5;
    
    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;
    
    // Check platform collisions
    this.checkPlatformCollisions(platforms);
    
    // Keep player in bounds
    if (this.x < 0) this.x = 0;
    if (this.x > this.canvasWidth - this.width) this.x = this.canvasWidth - this.width;
    
    // Update animation
    if (Math.abs(this.velocityX) > 0.1) {
      this.animationFrame += this.animationSpeed;
    }
    
    // Apply friction
    this.velocityX *= 0.8;
  }
  
  handleInput(keys) {
    const isRunning = keys['ShiftLeft'] || keys['ShiftRight'];
    const currentSpeed = isRunning ? this.speed * 1.5 : this.speed;
    
    if (keys['ArrowLeft']) {
      this.velocityX = -currentSpeed;
      this.facing = 'left';
    }
    if (keys['ArrowRight']) {
      this.velocityX = currentSpeed;
      this.facing = 'right';
    }
    
    // Jump
    if (keys['Space'] && this.onGround) {
      this.velocityY = -this.jumpPower;
      this.onGround = false;
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
        // Bottom collision (hitting platform from below)
        else if (this.velocityY < 0 && this.y > platform.y) {
          this.y = platform.y + platform.height;
          this.velocityY = 0;
        }
        // Side collisions
        else if (this.velocityX > 0 && this.x < platform.x) {
          this.x = platform.x - this.width;
          this.velocityX = 0;
        }
        else if (this.velocityX < 0 && this.x > platform.x) {
          this.x = platform.x + platform.width;
          this.velocityX = 0;
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
  
  powerUp() {
    this.powered = true;
    this.height = this.powered ? 48 : 32;
  }
  
  render(ctx) {
    // Draw player as a colored rectangle with simple animation
    ctx.fillStyle = this.powered ? '#FF6B6B' : '#4ECDC4';
    
    // Simple animation effect
    const bounce = Math.sin(this.animationFrame) * 2;
    
    // Draw main body
    ctx.fillRect(this.x, this.y + bounce, this.width, this.height);
    
    // Draw face
    ctx.fillStyle = '#FFF';
    const eyeSize = 4;
    const eyeY = this.y + bounce + 8;
    
    if (this.facing === 'right') {
      ctx.fillRect(this.x + 18, eyeY, eyeSize, eyeSize);
      ctx.fillRect(this.x + 25, eyeY, eyeSize, eyeSize);
    } else {
      ctx.fillRect(this.x + 3, eyeY, eyeSize, eyeSize);
      ctx.fillRect(this.x + 10, eyeY, eyeSize, eyeSize);
    }
    
    // Draw hat
    ctx.fillStyle = '#E74C3C';
    ctx.fillRect(this.x + 4, this.y + bounce - 8, this.width - 8, 12);
    
    // Draw mustache
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(this.x + 8, this.y + bounce + 16, 16, 4);
    
    // Draw overalls
    ctx.fillStyle = '#3498DB';
    ctx.fillRect(this.x + 6, this.y + bounce + 22, this.width - 12, this.height - 24);
    
    // Power-up effect
    if (this.powered) {
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x - 2, this.y + bounce - 2, this.width + 4, this.height + 4);
    }
  }
}

export default Player;