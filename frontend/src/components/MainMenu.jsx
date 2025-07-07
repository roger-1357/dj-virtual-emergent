import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import AuthModal from './AuthModal';

const MainMenu = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-2">
            Super Mario Bros
          </CardTitle>
          <p className="text-gray-600">¡Aventura clásica de plataformas!</p>
          
          {isAuthenticated() && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                ¡Bienvenido, {user.username}!
              </p>
              <p className="text-xs text-green-600">
                Mejor puntuación: {user.high_score.toLocaleString()} pts
              </p>
            </div>
          )}
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
          
          <div className="border-t pt-4">
            {isAuthenticated() ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 text-center">
                  Niveles completados: {user.levels_completed} | Monedas: {user.total_coins}
                </p>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setShowAuthModal(true)}
                variant="outline"
                className="w-full h-10 text-sm font-semibold border-2 border-blue-300 text-blue-600 hover:bg-blue-50 transform hover:scale-105 transition-all duration-200"
              >
                👤 Iniciar Sesión / Registrarse
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default MainMenu;