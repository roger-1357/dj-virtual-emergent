class Collectible {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = type === 'coin' ? 16 : 24;
    this.height = type === 'coin' ? 16 : 24;
    this.animationFrame = 0;
    this.animationSpeed = 0.2;
    this.collected = false;
  }
  
  update() {
    this.animationFrame += this.animationSpeed;
  }
  
  collidesWith(object) {
    return this.x < object.x + object.width &&
           this.x + this.width > object.x &&
           this.y < object.y + object.height &&
           this.y + this.height > object.y;
  }
  
  render(ctx) {
    if (this.collected) return;
    
    const bounce = Math.sin(this.animationFrame) * 3;
    
    switch (this.type) {
      case 'coin':
        this.drawCoin(ctx, bounce);
        break;
      case 'powerup':
        this.drawPowerUp(ctx, bounce);
        break;
      default:
        this.drawCoin(ctx, bounce);
    }
  }
  
  drawCoin(ctx, bounce) {
    // Coin body
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(this.x + this.width/2, this.y + this.height/2 + bounce, this.width/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Coin shine
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(this.x + this.width/2 - 2, this.y + this.height/2 - 2 + bounce, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Coin outline
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x + this.width/2, this.y + this.height/2 + bounce, this.width/2, 0, Math.PI * 2);
    ctx.stroke();
    
    // Coin symbol
    ctx.fillStyle = '#DAA520';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('$', this.x + this.width/2, this.y + this.height/2 + bounce + 4);
  }
  
  drawPowerUp(ctx, bounce) {
    // Mushroom stem
    ctx.fillStyle = '#F5DEB3';
    ctx.fillRect(this.x + 8, this.y + 12 + bounce, 8, 12);
    
    // Mushroom cap
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.arc(this.x + this.width/2, this.y + 8 + bounce, 10, 0, Math.PI, true);
    ctx.fill();
    
    // Mushroom spots
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(this.x + 6, this.y + 6 + bounce, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x + 18, this.y + 6 + bounce, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x + 12, this.y + 2 + bounce, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Glow effect
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x - 2, this.y - 2 + bounce, this.width + 4, this.height + 4);
  }
}

export default Collectible;