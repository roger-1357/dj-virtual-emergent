import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const RecordingPanel = ({ isRecording, onToggleRecording }) => {
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Update recording time
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-black/40 border-gray-600">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-sm font-bold text-cyan-400">
          RECORDING
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recording Status */}
        <div className="text-center">
          <div className={`text-2xl mb-2 ${isRecording ? 'animate-pulse' : ''}`}>
            {isRecording ? '🔴' : '⚫'}
          </div>
          <div className={`text-sm font-bold ${isRecording ? 'text-red-400' : 'text-gray-400'}`}>
            {isRecording ? 'RECORDING' : 'STOPPED'}
          </div>
        </div>
        
        {/* Recording Time */}
        <div className="text-center">
          <div className="font-mono text-lg text-white bg-black/60 rounded p-2">
            {formatTime(recordingTime)}
          </div>
        </div>
        
        {/* Recording Controls */}
        <div className="space-y-2">
          <Button
            onClick={onToggleRecording}
            className={`w-full ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isRecording ? '⏹️ STOP' : '🔴 RECORD'}
          </Button>
          
          {isRecording && (
            <div className="text-xs text-center text-gray-400">
              Recording master output...
            </div>
          )}
        </div>
        
        {/* Recording Info */}
        <div className="space-y-1 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>Format:</span>
            <span className="text-cyan-400">MP3 320kbps</span>
          </div>
          <div className="flex justify-between">
            <span>Sample Rate:</span>
            <span className="text-cyan-400">44.1 kHz</span>
          </div>
          <div className="flex justify-between">
            <span>Channels:</span>
            <span className="text-cyan-400">Stereo</span>
          </div>
        </div>
        
        {/* Recording Level Meter */}
        <div className="space-y-1">
          <div className="text-xs text-gray-400">Input Level:</div>
          <div className="flex space-x-1">
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-150 ${
                  isRecording 
                    ? 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500' 
                    : 'bg-gray-600'
                }`}
                style={{ 
                  width: isRecording ? `${Math.random() * 60 + 20}%` : '0%' 
                }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-1">
          <Button
            size="sm"
            variant="outline"
            className="text-xs border-gray-600 text-gray-400 hover:bg-gray-800"
            disabled={!isRecording}
          >
            📁 Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs border-gray-600 text-gray-400 hover:bg-gray-800"
            disabled={isRecording}
          >
            🗑️ Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordingPanel;