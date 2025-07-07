import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { scoreApi, statsApi } from '../services/api';
import { useToast } from '../hooks/use-toast';
import AuthModal from './AuthModal';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [scores, setScores] = useState([]);
  const [globalStats, setGlobalStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    loadLeaderboard();
    loadGlobalStats();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const result = await scoreApi.getLeaderboard(10);
      if (result.success) {
        setScores(result.data);
      } else {
        toast({
          title: "Error",
          description: "No se pudo cargar el leaderboard",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGlobalStats = async () => {
    try {
      const result = await statsApi.getGlobalStats();
      if (result.success) {
        setGlobalStats(result.data);
      }
    } catch (error) {
      console.error('Error loading global stats:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando puntuaciones...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500 mb-2">
              🏆 Tabla de Puntuaciones
            </CardTitle>
            
            {/* Global Stats */}
            {globalStats && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Total Jugadores</p>
                  <p className="text-2xl font-bold text-blue-800">{globalStats.total_users}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Partidas Jugadas</p>
                  <p className="text-2xl font-bold text-green-800">{globalStats.total_games}</p>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {scores.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 text-lg mb-4">¡No hay puntuaciones aún!</p>
                <p className="text-gray-500">Sé el primero en aparecer en el leaderboard.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {scores.map((score, index) => (
                  <div
                    key={score.id}
                    className={`flex justify-between items-center p-4 rounded-lg border-2 ${
                      index === 0 
                        ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-400' 
                        : index === 1 
                        ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-400'
                        : index === 2
                        ? 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-400'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-lg">{score.username}</span>
                          {user && user.id === score.user_id && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                              TÚ
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDate(score.created_at)} • Nivel {score.level_reached}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{score.score.toLocaleString()} pts</div>
                      <div className="text-sm text-gray-600">
                        {score.coins_collected} monedas
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-center space-x-4 mt-6">
              <Button 
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
              >
                🏠 Menú Principal
              </Button>
              <Button 
                onClick={() => navigate('/game')}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
              >
                🎮 Jugar Ahora
              </Button>
            </div>
            
            {!isAuthenticated() && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-blue-700 mb-2">
                  ¡Inicia sesión para aparecer en el leaderboard!
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

export default Leaderboard;