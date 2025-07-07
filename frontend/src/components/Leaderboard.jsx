import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Load scores from localStorage (mock backend)
    const savedScores = JSON.parse(localStorage.getItem('marioScores') || '[]');
    setScores(savedScores);
  }, []);

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

  const clearScores = () => {
    localStorage.removeItem('marioScores');
    setScores([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500 mb-2">
              🏆 Tabla de Puntuaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scores.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 text-lg mb-4">¡No hay puntuaciones aún!</p>
                <p className="text-gray-500">Juega tu primera partida para aparecer aquí.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {scores.map((score, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-3 rounded-lg border-2 ${
                      index === 0 
                        ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-400' 
                        : index === 1 
                        ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-400'
                        : index === 2
                        ? 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-400'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                      <div>
                        <div className="font-bold text-lg">{score.score.toLocaleString()} pts</div>
                        <div className="text-sm text-gray-600">{formatDate(score.date)}</div>
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
              {scores.length > 0 && (
                <Button 
                  onClick={clearScores}
                  variant="outline"
                  className="border-2 hover:bg-red-50 text-red-600 border-red-300 hover:border-red-400 transform hover:scale-105 transition-all duration-200"
                >
                  🗑️ Limpiar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;