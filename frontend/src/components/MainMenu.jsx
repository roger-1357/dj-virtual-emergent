import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-2">
            Super Mario Bros
          </CardTitle>
          <p className="text-gray-600">¡Aventura clásica de plataformas!</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => navigate('/game')}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200"
          >
            🎮 Jugar
          </Button>
          <Button 
            onClick={() => navigate('/leaderboard')}
            variant="outline"
            className="w-full h-12 text-lg font-semibold border-2 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
          >
            🏆 Puntuaciones
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainMenu;