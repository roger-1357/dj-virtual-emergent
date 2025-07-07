import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameEngine from '../game/GameEngine';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { mockGameData } from '../data/mockData';

const Game = () => {
  const canvasRef = useRef(null);
  const gameEngineRef = useRef(null);
  const navigate = useNavigate();
  const [gameStats, setGameStats] = useState({
    score: 0,
    lives: 3,
    level: 1,
    coins: 0,
    gameOver: false,
    paused: false
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Initialize game engine
    gameEngineRef.current = new GameEngine(canvas, ctx, mockGameData);
    
    // Game stats update callback
    gameEngineRef.current.onStatsUpdate = (stats) => {
      setGameStats(stats);
    };
    
    // Game over callback
    gameEngineRef.current.onGameOver = (finalScore) => {
      setGameStats(prev => ({ ...prev, gameOver: true }));
      // Save score to localStorage (mock backend)
      const scores = JSON.parse(localStorage.getItem('marioScores') || '[]');
      scores.push({ score: finalScore, date: new Date().toISOString() });
      scores.sort((a, b) => b.score - a.score);
      localStorage.setItem('marioScores', JSON.stringify(scores.slice(0, 10)));
    };
    
    // Start game
    gameEngineRef.current.start();
    
    return () => {
      gameEngineRef.current?.stop();
    };
  }, []);

  const handlePause = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.togglePause();
      setGameStats(prev => ({ ...prev, paused: !prev.paused }));
    }
  };

  const handleRestart = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.restart();
      setGameStats({
        score: 0,
        lives: 3,
        level: 1,
        coins: 0,
        gameOver: false,
        paused: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-400 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header UI */}
        <div className="flex justify-between items-center mb-4">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex space-x-6 text-sm font-bold">
                <span className="text-red-600">MARIO</span>
                <span className="text-blue-600">PUNTOS: {gameStats.score}</span>
                <span className="text-green-600">VIDAS: {gameStats.lives}</span>
                <span className="text-yellow-600">MONEDAS: {gameStats.coins}</span>
                <span className="text-purple-600">NIVEL: {gameStats.level}</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex space-x-2">
            <Button onClick={handlePause} variant="outline" className="bg-white/90">
              {gameStats.paused ? '▶️' : '⏸️'}
            </Button>
            <Button onClick={handleRestart} variant="outline" className="bg-white/90">
              🔄
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="bg-white/90">
              🏠
            </Button>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border-4 border-white rounded-lg shadow-2xl bg-gradient-to-b from-blue-300 to-green-300"
          />
          
          {/* Game Over Overlay */}
          {gameStats.gameOver && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <h2 className="text-3xl font-bold text-red-600 mb-4">¡GAME OVER!</h2>
                  <p className="text-lg mb-4">Puntuación Final: {gameStats.score}</p>
                  <div className="flex space-x-4">
                    <Button onClick={handleRestart} className="bg-green-500 hover:bg-green-600">
                      🔄 Reintentar
                    </Button>
                    <Button onClick={() => navigate('/')} variant="outline">
                      🏠 Menú Principal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Pause Overlay */}
          {gameStats.paused && !gameStats.gameOver && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <h2 className="text-2xl font-bold text-blue-600 mb-4">⏸️ PAUSA</h2>
                  <Button onClick={handlePause} className="bg-blue-500 hover:bg-blue-600">
                    ▶️ Continuar
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Controls Info */}
        <Card className="mt-4 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold mb-2">Controles:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">← → :</span> Mover
              </div>
              <div>
                <span className="font-semibold">Espacio:</span> Saltar
              </div>
              <div>
                <span className="font-semibold">Shift:</span> Correr
              </div>
              <div>
                <span className="font-semibold">P:</span> Pausa
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Game;