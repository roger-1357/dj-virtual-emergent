import React, { useRef, useEffect, useState } from 'react';

const Waveform = ({ 
  track, 
  currentTime, 
  duration, 
  isPlaying, 
  onSeek, 
  cuePoints = [] 
}) => {
  const canvasRef = useRef(null);
  const [waveformData, setWaveformData] = useState([]);
  
  // Generate mock waveform data based on track
  useEffect(() => {
    if (track) {
      // Generate pseudo-random waveform data based on track properties
      const segments = 200;
      const data = [];
      const seed = track.title.length + track.artist.length;
      
      for (let i = 0; i < segments; i++) {
        // Create pseudo-random but consistent waveform
        const x = i / segments;
        const base = Math.sin(x * Math.PI * 4 + seed) * 0.3;
        const variation = Math.sin(x * Math.PI * 20 + seed * 2) * 0.4;
        const noise = (Math.sin(x * Math.PI * 100 + seed * 3) * 0.3);
        
        const amplitude = Math.abs(base + variation + noise);
        data.push(Math.min(1, amplitude));
      }
      
      setWaveformData(data);
    }
  }, [track]);
  
  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !waveformData.length || !duration) return;
    
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw waveform
    const barWidth = width / waveformData.length;
    const centerY = height / 2;
    
    waveformData.forEach((amplitude, index) => {
      const x = index * barWidth;
      const barHeight = amplitude * centerY * 0.8;
      
      // Determine color based on position relative to current time
      const timePosition = (index / waveformData.length) * duration;
      const isPlayed = timePosition <= currentTime;
      
      // Color gradient
      if (isPlayed) {
        ctx.fillStyle = '#22d3ee'; // cyan for played portion
      } else {
        ctx.fillStyle = '#4b5563'; // gray for unplayed portion
      }
      
      // Draw bars (stereo style)
      ctx.fillRect(x, centerY - barHeight, barWidth - 1, barHeight);
      ctx.fillRect(x, centerY, barWidth - 1, barHeight);
    });
    
    // Draw cue points
    cuePoints.forEach(cue => {
      const x = (cue.time / duration) * width;
      ctx.fillStyle = '#fbbf24'; // yellow for cue points
      ctx.fillRect(x - 1, 0, 2, height);
      
      // Draw cue label
      ctx.fillStyle = '#fbbf24';
      ctx.font = '10px Arial';
      ctx.fillText(cue.name, x + 3, 12);
    });
    
    // Draw playhead
    const playheadX = (currentTime / duration) * width;
    ctx.strokeStyle = '#ef4444'; // red playhead
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();
    
    // Draw time markers
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    for (let i = 0; i <= 4; i++) {
      const x = (i / 4) * width;
      const time = (i / 4) * duration;
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      ctx.fillText(`${minutes}:${seconds.toString().padStart(2, '0')}`, x + 2, height - 5);
    }
    
  }, [waveformData, currentTime, duration, cuePoints]);
  
  // Handle click to seek
  const handleClick = (event) => {
    if (!duration) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = (x / canvas.width) * 100;
    
    onSeek(percentage);
  };
  
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={80}
        className="w-full h-20 cursor-pointer border border-gray-600 rounded"
        onClick={handleClick}
      />
      
      {/* Waveform overlay info */}
      <div className="absolute top-1 left-2 text-xs text-cyan-400 pointer-events-none">
        {track ? `${track.title} - ${track.artist}` : 'No track loaded'}
      </div>
      
      {isPlaying && (
        <div className="absolute top-1 right-2 text-xs text-green-400 pointer-events-none animate-pulse">
          ● PLAYING
        </div>
      )}
    </div>
  );
};

export default Waveform;