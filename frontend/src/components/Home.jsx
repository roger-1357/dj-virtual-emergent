import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-black/80 backdrop-blur-sm shadow-2xl border-2 border-cyan-400">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            🎧 Virtual DJ
          </CardTitle>
          <p className="text-gray-300">Professional DJ Mixing Station</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => navigate('/dj')}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            🎵 Open DJ Console
          </Button>
          
          <div className="text-center text-sm text-gray-400 mt-6">
            <p>Features:</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div>• Dual Decks A/B</div>
              <div>• Crossfader</div>
              <div>• Waveforms</div>
              <div>• Hot Cues</div>
              <div>• EQ Controls</div>
              <div>• Audio Effects</div>
              <div>• Beat Sync</div>
              <div>• Loop Controls</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;