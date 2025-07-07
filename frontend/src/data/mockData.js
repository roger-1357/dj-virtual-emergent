export const mockGameData = {
  levels: [
    {
      id: 1,
      name: "Mundo 1-1",
      platforms: [
        // Ground platforms
        { x: 0, y: 550, width: 800, height: 50, type: 'ground' },
        // Floating platforms
        { x: 200, y: 450, width: 100, height: 20, type: 'brick' },
        { x: 350, y: 400, width: 80, height: 20, type: 'brick' },
        { x: 500, y: 350, width: 60, height: 20, type: 'brick' },
        // Pipe
        { x: 650, y: 450, width: 60, height: 100, type: 'pipe' },
        // Steps
        { x: 600, y: 500, width: 40, height: 50, type: 'brick' },
        { x: 560, y: 475, width: 40, height: 75, type: 'brick' },
        { x: 520, y: 450, width: 40, height: 100, type: 'brick' }
      ],
      enemies: [
        { x: 250, y: 400, type: 'goomba' },
        { x: 400, y: 520, type: 'goomba' },
        { x: 480, y: 520, type: 'koopa' }
      ],
      collectibles: [
        { x: 230, y: 420, type: 'coin' },
        { x: 250, y: 420, type: 'coin' },
        { x: 270, y: 420, type: 'coin' },
        { x: 380, y: 370, type: 'coin' },
        { x: 530, y: 320, type: 'coin' },
        { x: 320, y: 370, type: 'powerup' }
      ]
    },
    {
      id: 2,
      name: "Mundo 1-2",
      platforms: [
        // Ground platforms
        { x: 0, y: 550, width: 800, height: 50, type: 'ground' },
        // More challenging layout
        { x: 150, y: 480, width: 60, height: 20, type: 'brick' },
        { x: 250, y: 420, width: 60, height: 20, type: 'brick' },
        { x: 350, y: 360, width: 60, height: 20, type: 'brick' },
        { x: 450, y: 300, width: 60, height: 20, type: 'brick' },
        { x: 550, y: 240, width: 60, height: 20, type: 'brick' },
        // Pipes
        { x: 300, y: 450, width: 60, height: 100, type: 'pipe' },
        { x: 680, y: 400, width: 60, height: 150, type: 'pipe' }
      ],
      enemies: [
        { x: 200, y: 520, type: 'goomba' },
        { x: 320, y: 520, type: 'koopa' },
        { x: 420, y: 520, type: 'goomba' },
        { x: 520, y: 520, type: 'koopa' }
      ],
      collectibles: [
        { x: 170, y: 450, type: 'coin' },
        { x: 270, y: 390, type: 'coin' },
        { x: 370, y: 330, type: 'coin' },
        { x: 470, y: 270, type: 'coin' },
        { x: 570, y: 210, type: 'coin' },
        { x: 450, y: 270, type: 'powerup' }
      ]
    },
    {
      id: 3,
      name: "Mundo 1-3",
      platforms: [
        // Ground platforms
        { x: 0, y: 550, width: 800, height: 50, type: 'ground' },
        // Complex jumping sequence
        { x: 100, y: 500, width: 40, height: 20, type: 'brick' },
        { x: 180, y: 450, width: 40, height: 20, type: 'brick' },
        { x: 260, y: 400, width: 40, height: 20, type: 'brick' },
        { x: 340, y: 350, width: 40, height: 20, type: 'brick' },
        { x: 420, y: 300, width: 40, height: 20, type: 'brick' },
        { x: 500, y: 250, width: 40, height: 20, type: 'brick' },
        { x: 580, y: 200, width: 40, height: 20, type: 'brick' },
        // Final platform
        { x: 660, y: 150, width: 100, height: 20, type: 'brick' }
      ],
      enemies: [
        { x: 150, y: 520, type: 'goomba' },
        { x: 280, y: 520, type: 'koopa' },
        { x: 380, y: 520, type: 'goomba' },
        { x: 480, y: 520, type: 'koopa' },
        { x: 600, y: 520, type: 'goomba' }
      ],
      collectibles: [
        { x: 120, y: 470, type: 'coin' },
        { x: 200, y: 420, type: 'coin' },
        { x: 280, y: 370, type: 'coin' },
        { x: 360, y: 320, type: 'coin' },
        { x: 440, y: 270, type: 'coin' },
        { x: 520, y: 220, type: 'coin' },
        { x: 600, y: 170, type: 'coin' },
        { x: 690, y: 120, type: 'powerup' }
      ]
    }
  ],
  player: {
    startX: 100,
    startY: 400,
    lives: 3,
    speed: 5,
    jumpPower: 12
  },
  powerUps: [
    { type: 'mushroom', effect: 'size_increase' },
    { type: 'fire_flower', effect: 'fire_power' }
  ]
};