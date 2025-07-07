import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Waveform from './Waveform';
import HotCues from './HotCues';

const Deck = ({ 
  deck, 
  deckState, 
  onTogglePlay, 
  onUpdateParam, 
  onUpdateEQ, 
  onAddCue,
  audioContext,
  outputNode 
}) => {
  const [jogWheelRotation, setJogWheelRotation] = useState(0);
  const audioElementRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const gainNodeRef = useRef(null);
  const eqNodesRef = useRef({ high: null, mid: null, low: null });
  
  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Initialize audio nodes when track is loaded
  useEffect(() => {
    if (deckState.track && audioContext && outputNode) {
      // Clean up previous nodes
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
      }
      
      // Create new audio element
      const audio = new Audio();
      audio.src = deckState.track.url;
      audio.crossOrigin = "anonymous";
      audioElementRef.current = audio;
      
      // Create audio nodes
      sourceNodeRef.current = audioContext.createMediaElementSource(audio);
      gainNodeRef.current = audioContext.createGain();
      
      // Create EQ nodes
      eqNodesRef.current.high = audioContext.createBiquadFilter();
      eqNodesRef.current.mid = audioContext.createBiquadFilter();
      eqNodesRef.current.low = audioContext.createBiquadFilter();
      
      // Configure EQ filters
      eqNodesRef.current.high.type = 'highshelf';
      eqNodesRef.current.high.frequency.value = 3200;
      eqNodesRef.current.mid.type = 'peaking';
      eqNodesRef.current.mid.frequency.value = 1000;
      eqNodesRef.current.mid.Q.value = 1;
      eqNodesRef.current.low.type = 'lowshelf';
      eqNodesRef.current.low.frequency.value = 320;
      
      // Connect audio graph
      sourceNodeRef.current
        .connect(eqNodesRef.current.high)
        .connect(eqNodesRef.current.mid)
        .connect(eqNodesRef.current.low)
        .connect(gainNodeRef.current)
        .connect(outputNode);
      
      // Set initial values
      gainNodeRef.current.gain.value = deckState.volume;
      
      // Update audio time
      const updateTime = () => {
        if (audio.currentTime !== undefined) {
          onUpdateParam('currentTime', audio.currentTime);
        }
      };
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', () => {
        onUpdateParam('duration', audio.duration);
      });
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        if (sourceNodeRef.current) {
          sourceNodeRef.current.disconnect();
        }
      };
    }
  }, [deckState.track, audioContext, outputNode]);
  
  // Update volume when changed
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = deckState.volume;
    }
  }, [deckState.volume]);
  
  // Update EQ when changed
  useEffect(() => {
    if (eqNodesRef.current.high) {
      eqNodesRef.current.high.gain.value = deckState.eq.high;
    }
    if (eqNodesRef.current.mid) {
      eqNodesRef.current.mid.gain.value = deckState.eq.mid;
    }
    if (eqNodesRef.current.low) {
      eqNodesRef.current.low.gain.value = deckState.eq.low;
    }
  }, [deckState.eq]);
  
  // Update playback rate (tempo/pitch)
  useEffect(() => {
    if (audioElementRef.current) {
      const rate = 1 + (deckState.tempo / 100) + (deckState.pitch / 100);
      audioElementRef.current.playbackRate = Math.max(0.5, Math.min(2.0, rate));
    }
  }, [deckState.tempo, deckState.pitch]);
  
  // Handle play/pause
  useEffect(() => {
    if (audioElementRef.current) {
      if (deckState.isPlaying) {
        audioElementRef.current.play().catch(console.error);
      } else {
        audioElementRef.current.pause();
      }
    }
  }, [deckState.isPlaying]);
  
  // Jog wheel animation
  useEffect(() => {
    if (deckState.isPlaying) {
      const interval = setInterval(() => {
        setJogWheelRotation(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [deckState.isPlaying]);
  
  const handleSeek = (percentage) => {
    if (audioElementRef.current && deckState.duration) {
      const newTime = (percentage / 100) * deckState.duration;
      audioElementRef.current.currentTime = newTime;
      onUpdateParam('currentTime', newTime);
    }
  };
  
  const handleCue = () => {
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = 0;
      onUpdateParam('currentTime', 0);
    }
  };
  
  const handleLoop = () => {
    if (deckState.track) {
      onUpdateParam('isLooping', !deckState.isLooping);
      onUpdateParam('loopStart', deckState.currentTime);
      onUpdateParam('loopEnd', deckState.currentTime + 4); // 4 second loop
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Deck Header */}
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-xl font-bold text-cyan-400">
          DECK {deck}
        </CardTitle>
        {deckState.track && (
          <div className="text-center text-sm">
            <div className="font-semibold text-white">{deckState.track.title}</div>
            <div className="text-gray-400">{deckState.track.artist}</div>
            <div className="text-cyan-300">{deckState.bpm} BPM</div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Waveform */}
        <Card className="bg-black/40 border-gray-600">
          <CardContent className="p-2">
            <Waveform
              track={deckState.track}
              currentTime={deckState.currentTime}
              duration={deckState.duration}
              isPlaying={deckState.isPlaying}
              onSeek={handleSeek}
              cuePoints={deckState.cuePoints}
            />
          </CardContent>
        </Card>

        {/* Transport Controls */}
        <div className="flex justify-center space-x-2">
          <Button
            onClick={handleCue}
            size="sm"
            variant="outline"
            className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20"
          >
            CUE
          </Button>
          <Button
            onClick={onTogglePlay}
            size="lg"
            className={`${
              deckState.isPlaying 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {deckState.isPlaying ? '⏸️' : '▶️'}
          </Button>
          <Button
            onClick={handleLoop}
            size="sm"
            variant="outline"
            className={`border-purple-500 text-purple-400 hover:bg-purple-500/20 ${
              deckState.isLooping ? 'bg-purple-500/30' : ''
            }`}
          >
            LOOP
          </Button>
        </div>

        {/* Hot Cues */}
        <HotCues
          cuePoints={deckState.cuePoints}
          onAddCue={onAddCue}
          currentTime={deckState.currentTime}
          onJumpToCue={(time) => handleSeek((time / deckState.duration) * 100)}
        />

        {/* Time Display */}
        <div className="flex justify-between text-sm font-mono bg-black/60 p-2 rounded">
          <span className="text-cyan-400">{formatTime(deckState.currentTime)}</span>
          <span className="text-gray-400">-{formatTime(deckState.duration - deckState.currentTime)}</span>
        </div>

        {/* Jog Wheel */}
        <div className="flex justify-center">
          <div 
            className="w-32 h-32 rounded-full border-4 border-cyan-400 bg-gradient-to-br from-gray-800 to-black relative cursor-pointer shadow-lg"
            style={{ transform: `rotate(${jogWheelRotation}deg)` }}
          >
            <div className="absolute inset-2 rounded-full border-2 border-cyan-300/50"></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-2 left-1/2 w-1 h-6 bg-cyan-400 transform -translate-x-1/2"></div>
          </div>
        </div>

        {/* Tempo/Pitch Controls */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">TEMPO (%)</label>
            <Slider
              value={[deckState.tempo]}
              onValueChange={(value) => onUpdateParam('tempo', value[0])}
              min={-20}
              max={20}
              step={0.1}
              className="tempo-slider"
            />
            <div className="text-center text-xs text-cyan-400 mt-1">
              {deckState.tempo > 0 ? '+' : ''}{deckState.tempo.toFixed(1)}%
            </div>
          </div>
          
          <div>
            <label className="text-xs text-gray-400 block mb-1">PITCH (%)</label>
            <Slider
              value={[deckState.pitch]}
              onValueChange={(value) => onUpdateParam('pitch', value[0])}
              min={-12}
              max={12}
              step={0.1}
              className="pitch-slider"
            />
            <div className="text-center text-xs text-purple-400 mt-1">
              {deckState.pitch > 0 ? '+' : ''}{deckState.pitch.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* EQ Controls */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-gray-400 block mb-1 text-center">HIGH</label>
            <Slider
              value={[deckState.eq.high]}
              onValueChange={(value) => onUpdateEQ('high', value[0])}
              min={-20}
              max={20}
              step={0.5}
              orientation="vertical"
              className="h-20 mx-auto"
            />
            <div className="text-center text-xs text-red-400 mt-1">
              {deckState.eq.high > 0 ? '+' : ''}{deckState.eq.high}dB
            </div>
          </div>
          
          <div>
            <label className="text-xs text-gray-400 block mb-1 text-center">MID</label>
            <Slider
              value={[deckState.eq.mid]}
              onValueChange={(value) => onUpdateEQ('mid', value[0])}
              min={-20}
              max={20}
              step={0.5}
              orientation="vertical"
              className="h-20 mx-auto"
            />
            <div className="text-center text-xs text-yellow-400 mt-1">
              {deckState.eq.mid > 0 ? '+' : ''}{deckState.eq.mid}dB
            </div>
          </div>
          
          <div>
            <label className="text-xs text-gray-400 block mb-1 text-center">LOW</label>
            <Slider
              value={[deckState.eq.low]}
              onValueChange={(value) => onUpdateEQ('low', value[0])}
              min={-20}
              max={20}
              step={0.5}
              orientation="vertical"
              className="h-20 mx-auto"
            />
            <div className="text-center text-xs text-blue-400 mt-1">
              {deckState.eq.low > 0 ? '+' : ''}{deckState.eq.low}dB
            </div>
          </div>
        </div>

        {/* Volume Control */}
        <div>
          <label className="text-xs text-gray-400 block mb-1">VOLUME</label>
          <Slider
            value={[deckState.volume * 100]}
            onValueChange={(value) => onUpdateParam('volume', value[0] / 100)}
            min={0}
            max={100}
            step={1}
            className="volume-slider"
          />
          <div className="text-center text-xs text-green-400 mt-1">
            {Math.round(deckState.volume * 100)}%
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default Deck;