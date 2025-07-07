import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GameEngine from '../game/GameEngine';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { mockGameData } from '../data/mockData';
import { scoreApi, progressApi } from '../services/api';
import { useToast } from '../hooks/use-toast';
import AuthModal from './AuthModal';

const Game = () => {
  const canvasRef = useRef(null);
  const gameEngineRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [gameStats, setGameStats] = useState({
    score: 0,
    lives: 3,
    level: 1,
    coins: 0,
    gameOver: false,
    paused: false
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Initialize game engine
    gameEngineRef.current = new GameEngine(canvas, ctx, mockGameData);
    
    // Set start time
    setGameStartTime(Date.now());
    
    // Game stats update callback
    gameEngineRef.current.onStatsUpdate = (stats) => {
      setGameStats(stats);
      
      // Auto-save progress for authenticated users
      if (isAuthenticated() && user) {
        saveProgress(stats);
      }
    };
    
    // Game over callback
    gameEngineRef.current.onGameOver = (finalScore) => {
      setGameStats(prev => ({ ...prev, gameOver: true }));
      handleGameOver(finalScore);
    };
    
    // Load saved progress if user is authenticated
    if (isAuthenticated() && user) {
      loadProgress();
    }
    
    // Start game
    gameEngineRef.current.start();
    
    return () => {
      gameEngineRef.current?.stop();
    };
  }, [isAuthenticated, user]);

  const saveProgress = async (stats) => {
    if (!isAuthenticated() || !user) return;
    
    try {
      await progressApi.saveProgress({
        user_id: user.id,
        current_level: stats.level,
        lives_remaining: stats.lives,
        score: stats.score,
        coins: stats.coins,
        power_ups: [],
        last_checkpoint: {}
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const loadProgress = async () => {
    if (!isAuthenticated() || !user) return;
    
    try {
      const result = await progressApi.getProgress(user.id);
      if (result.success) {
        // Apply saved progress to game
        const progress = result.data;
        setGameStats(prev => ({
          ...prev,
          score: progress.score,
          lives: progress.lives_remaining,
          level: progress.current_level,
          coins: progress.coins
        }));
        
        // Update game engine with saved progress
        if (gameEngineRef.current) {
          gameEngineRef.current.loadSavedProgress(progress);
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleGameOver = async (finalScore) => {
    const gameDuration = gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0;
    
    if (isAuthenticated() && user) {
      // Save score to backend
      try {
        const scoreData = {
          user_id: user.id,
          username: user.username,
          score: finalScore,
          level_reached: gameStats.level,
          coins_collected: gameStats.coins,
          game_duration: gameDuration
        };
        
        const result = await scoreApi.saveScore(scoreData);
        if (result.success) {
          toast({
            title: "¡Puntuación guardada!",
            description: `Has conseguido ${finalScore.toLocaleString()} puntos`,
          });
        }
      } catch (error) {
        console.error('Error saving score:', error);
        toast({
          title: "Error",
          description: "No se pudo guardar tu puntuación",
          variant: "destructive",
        });
      }
    } else {
      // Show auth modal for guest users
      toast({
        title: "¡Excelente partida!",
        description: "Inicia sesión para guardar tu puntuación",
      });
    }
  };

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
      setGameStartTime(Date.now());
    }
  };

  const handleNewGame = () => {
    // Clear progress for new game
    if (isAuthenticated() && user) {
      progressApi.deleteProgress(user.id);
    }
    handleRestart();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-400 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header UI */}
        <div className="flex justify-between items-center mb-4">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex space-x-6 text-sm font-bold">
                <span className="text-red-600">
                  {isAuthenticated() ? user.username : 'INVITADO'}
                </span>
                <span className="text-blue-600">PUNTOS: {gameStats.score.toLocaleString()}</span>
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
            <Button onClick={handleNewGame} variant="outline" className="bg-white/90">
              🆕
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
                  <p className="text-lg mb-2">Puntuación Final: {gameStats.score.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Nivel alcanzado: {gameStats.level} | Monedas: {gameStats.coins}
                  </p>
                  
                  {!isAuthenticated() && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 mb-2">
                        ¡Inicia sesión para guardar tu puntuación!
                      </p>
                      <Button 
                        onClick={() => setShowAuthModal(true)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Crear Cuenta / Iniciar Sesión
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex justify-center space-x-4">
                    <Button onClick={handleRestart} className="bg-green-500 hover:bg-green-600">
                      🔄 Reintentar
                    </Button>
                    <Button onClick={() => navigate('/leaderboard')} className="bg-yellow-500 hover:bg-yellow-600">
                      🏆 Ver Puntuaciones
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
                  <p className="text-sm text-gray-600 mb-4">
                    {isAuthenticated() ? 'Tu progreso se guarda automáticamente' : 'Inicia sesión para guardar tu progreso'}
                  </p>
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
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold mb-2">Controles:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-semibold">← → :</span> Mover</div>
                  <div><span className="font-semibold">Espacio:</span> Saltar</div>
                  <div><span className="font-semibold">Shift:</span> Correr</div>
                  <div><span className="font-semibold">P:</span> Pausa</div>
                </div>
              </div>
              
              {!isAuthenticated() && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    ¡Crea una cuenta para competir!
                  </p>
                  <Button 
                    onClick={() => setShowAuthModal(true)}
                    size="sm"
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    Registrarse
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Game;