class Level {
  constructor(levelData, canvasWidth, canvasHeight) {
    this.levelData = levelData;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.platforms = this.createPlatforms();
  }
  
  createPlatforms() {
    return this.levelData.platforms.map(platform => ({
      x: platform.x,
      y: platform.y,
      width: platform.width,
      height: platform.height,
      type: platform.type || 'ground'
    }));
  }
  
  render(ctx) {
    // Draw platforms
    this.platforms.forEach(platform => {
      this.drawPlatform(ctx, platform);
    });
    
    // Draw level decorations
    this.drawDecorations(ctx);
  }
  
  drawPlatform(ctx, platform) {
    // Different platform types
    switch (platform.type) {
      case 'ground':
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Add grass on top
        ctx.fillStyle = '#228B22';
        ctx.fillRect(platform.x, platform.y, platform.width, 8);
        break;
        
      case 'brick':
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Add brick pattern
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        for (let i = 0; i < platform.width; i += 32) {
          for (let j = 0; j < platform.height; j += 16) {
            ctx.strokeRect(platform.x + i, platform.y + j, 32, 16);
          }
        }
        break;
        
      case 'pipe':
        ctx.fillStyle = '#228B22';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Add pipe details
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(platform.x + 4, platform.y, platform.width - 8, 12);
        ctx.fillRect(platform.x + 4, platform.y + platform.height - 12, platform.width - 8, 12);
        break;
        
      default:
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
  }
  
  drawDecorations(ctx) {
    // Draw flag pole at the end
    ctx.fillStyle = '#654321';
    ctx.fillRect(this.canvasWidth - 60, 200, 8, 300);
    
    // Draw flag
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(this.canvasWidth - 52, 200, 40, 30);
    
    // Draw bushes
    this.drawBush(ctx, 300, this.canvasHeight - 80);
    this.drawBush(ctx, 500, this.canvasHeight - 80);
    
    // Draw hills in background
    this.drawHill(ctx, 200, this.canvasHeight - 100);
    this.drawHill(ctx, 600, this.canvasHeight - 120);
  }
  
  drawBush(ctx, x, y) {
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 15, y, 15, 0, Math.PI * 2);
    ctx.arc(x + 30, y, 18, 0, Math.PI * 2);
    ctx.arc(x + 45, y, 12, 0, Math.PI * 2);
    ctx.fill();
  }
  
  drawHill(ctx, x, y) {
    ctx.fillStyle = '#90EE90';
    ctx.beginPath();
    ctx.arc(x, y, 60, 0, Math.PI, true);
    ctx.fill();
  }
}

export default Level;