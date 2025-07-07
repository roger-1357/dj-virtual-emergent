import React from 'react';
import { Button } from '../ui/button';

const HotCues = ({ cuePoints, onAddCue, currentTime, onJumpToCue }) => {
  const maxCues = 8;
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleCueClick = (index) => {
    if (cuePoints[index]) {
      // Jump to existing cue
      onJumpToCue(cuePoints[index].time);
    } else {
      // Set new cue at current time
      onAddCue(currentTime);
    }
  };
  
  const getCueColor = (index) => {
    const colors = [
      'bg-red-600 hover:bg-red-700 border-red-400',
      'bg-blue-600 hover:bg-blue-700 border-blue-400',
      'bg-green-600 hover:bg-green-700 border-green-400',
      'bg-yellow-600 hover:bg-yellow-700 border-yellow-400',
      'bg-purple-600 hover:bg-purple-700 border-purple-400',
      'bg-pink-600 hover:bg-pink-700 border-pink-400',
      'bg-orange-600 hover:bg-orange-700 border-orange-400',
      'bg-teal-600 hover:bg-teal-700 border-teal-400'
    ];
    return colors[index] || 'bg-gray-600 hover:bg-gray-700 border-gray-400';
  };

  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-400 font-bold text-center">HOT CUES</div>
      
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: maxCues }, (_, index) => {
          const cue = cuePoints[index];
          const hassCue = !!cue;
          
          return (
            <Button
              key={index}
              onClick={() => handleCueClick(index)}
              size="sm"
              className={`
                h-12 relative border-2 transition-all duration-150
                ${hassCue 
                  ? getCueColor(index) 
                  : 'bg-gray-800 hover:bg-gray-700 border-gray-600 text-gray-400'
                }
                ${hassCue ? 'shadow-lg transform hover:scale-105' : ''}
              `}
            >
              <div className="flex flex-col items-center justify-center text-xs">
                <div className="font-bold">{index + 1}</div>
                {hassCue && (
                  <div className="text-[10px] opacity-80">
                    {formatTime(cue.time)}
                  </div>
                )}
              </div>
              
              {/* Active indicator */}
              {hassCue && Math.abs(currentTime - cue.time) < 0.5 && (
                <div className="absolute inset-0 border-2 border-white rounded animate-pulse"></div>
              )}
            </Button>
          );
        })}
      </div>
      
      {/* Cue instructions */}
      <div className="text-[10px] text-gray-500 text-center">
        Click empty slot to set cue • Click cue to jump
      </div>
      
      {/* Cue list */}
      {cuePoints.length > 0 && (
        <div className="mt-3 space-y-1">
          <div className="text-xs text-gray-400 font-bold">ACTIVE CUES:</div>
          <div className="max-h-16 overflow-y-auto space-y-1">
            {cuePoints.map((cue, index) => (
              <div key={cue.id} className="flex justify-between items-center text-xs bg-gray-800/50 p-1 rounded">
                <span className={`w-3 h-3 rounded-full ${getCueColor(index).split(' ')[0]}`}></span>
                <span className="text-gray-300">{cue.name}</span>
                <span className="text-cyan-400">{formatTime(cue.time)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotCues;