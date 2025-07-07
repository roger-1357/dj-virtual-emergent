import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Deck from './dj/Deck';
import Crossfader from './dj/Crossfader';
import MusicBrowser from './dj/MusicBrowser';
import RecordingPanel from './dj/RecordingPanel';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { mockTracks } from '../data/djMockData';
import { useToast } from '../hooks/use-toast';

const DJApp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Audio context and nodes
  const audioContextRef = useRef(null);
  const masterGainNodeRef = useRef(null);
  const crossfaderNodeRef = useRef(null);
  
  // Deck states
  const [deckA, setDeckA] = useState({
    track: null,
    isPlaying: false,
    volume: 0.8,
    tempo: 0,
    pitch: 0,
    eq: { high: 0, mid: 0, low: 0 },
    cuePoints: [],
    isLooping: false,
    loopStart: 0,
    loopEnd: 0,
    currentTime: 0,
    duration: 0,
    bpm: 0
  });
  
  const [deckB, setDeckB] = useState({
    track: null,
    isPlaying: false,
    volume: 0.8,
    tempo: 0,
    pitch: 0,
    eq: { high: 0, mid: 0, low: 0 },
    cuePoints: [],
    isLooping: false,
    loopStart: 0,
    loopEnd: 0,
    currentTime: 0,
    duration: 0,
    bpm: 0
  });
  
  const [crossfaderValue, setCrossfaderValue] = useState(50); // 0-100, 50 is center
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [isRecording, setIsRecording] = useState(false);
  const [showBrowser, setShowBrowser] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState(null);
  
  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = async () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
        
        // Create master gain node
        masterGainNodeRef.current = audioContextRef.current.createGain();
        masterGainNodeRef.current.connect(audioContextRef.current.destination);
        masterGainNodeRef.current.gain.value = masterVolume;
        
        // Create crossfader node (we'll implement this as dual gain nodes)
        crossfaderNodeRef.current = {
          left: audioContextRef.current.createGain(),
          right: audioContextRef.current.createGain()
        };
        
        crossfaderNodeRef.current.left.connect(masterGainNodeRef.current);
        crossfaderNodeRef.current.right.connect(masterGainNodeRef.current);
        
        updateCrossfader(crossfaderValue);
        
      } catch (error) {
        console.error('Error initializing audio:', error);
        toast({
          title: "Audio Error",
          description: "Could not initialize audio system",
          variant: "destructive",
        });
      }
    };
    
    initAudio();
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Update crossfader mixing
  const updateCrossfader = (value) => {
    if (crossfaderNodeRef.current) {
      // Convert 0-100 to gain values
      const leftGain = Math.cos((value / 100) * Math.PI / 2);
      const rightGain = Math.sin((value / 100) * Math.PI / 2);
      
      crossfaderNodeRef.current.left.gain.value = leftGain;
      crossfaderNodeRef.current.right.gain.value = rightGain;
    }
  };
  
  // Update master volume
  useEffect(() => {
    if (masterGainNodeRef.current) {
      masterGainNodeRef.current.gain.value = masterVolume;
    }
  }, [masterVolume]);
  
  // Update crossfader
  useEffect(() => {
    updateCrossfader(crossfaderValue);
  }, [crossfaderValue]);
  
  // Load track to deck
  const loadTrackToDeck = (track, deck) => {
    const setDeck = deck === 'A' ? setDeckA : setDeckB;
    
    setDeck(prev => ({
      ...prev,
      track: track,
      currentTime: 0,
      duration: track.duration,
      bpm: track.bpm,
      isPlaying: false
    }));
    
    toast({
      title: "Track Loaded",
      description: `${track.title} loaded to Deck ${deck}`,
    });
  };
  
  // Toggle play/pause
  const togglePlayPause = (deck) => {
    const setDeck = deck === 'A' ? setDeckA : setDeckB;
    const deckState = deck === 'A' ? deckA : deckB;
    
    if (!deckState.track) {
      toast({
        title: "No Track",
        description: `Load a track to Deck ${deck} first`,
        variant: "destructive",
      });
      return;
    }
    
    setDeck(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  };
  
  // Update deck parameter
  const updateDeckParam = (deck, param, value) => {
    const setDeck = deck === 'A' ? setDeckA : setDeckB;
    
    setDeck(prev => ({
      ...prev,
      [param]: value
    }));
  };
  
  // Update EQ
  const updateEQ = (deck, band, value) => {
    const setDeck = deck === 'A' ? setDeckA : setDeckB;
    
    setDeck(prev => ({
      ...prev,
      eq: {
        ...prev.eq,
        [band]: value
      }
    }));
  };
  
  // Add cue point
  const addCuePoint = (deck, time) => {
    const setDeck = deck === 'A' ? setDeckA : setDeckB;
    const deckState = deck === 'A' ? deckA : deckB;
    
    if (deckState.cuePoints.length < 8) {
      setDeck(prev => ({
        ...prev,
        cuePoints: [...prev.cuePoints, { id: Date.now(), time, name: `Cue ${prev.cuePoints.length + 1}` }]
      }));
    }
  };
  
  // Sync decks
  const syncDecks = () => {
    if (deckA.track && deckB.track && deckA.bpm && deckB.bpm) {
      const bpmDiff = deckA.bpm - deckB.bpm;
      const tempoAdjust = (bpmDiff / deckB.bpm) * 100;
      
      setDeckB(prev => ({
        ...prev,
        tempo: tempoAdjust
      }));
      
      toast({
        title: "Decks Synced",
        description: `Deck B tempo adjusted to match Deck A`,
      });
    }
  };
  
  // Toggle recording
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording ? "Session saved" : "Recording session...",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Top Bar */}
      <div className="bg-black/80 border-b border-gray-700 p-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => navigate('/')}
            variant="outline" 
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            ← Home
          </Button>
          <h1 className="text-xl font-bold text-cyan-400">Virtual DJ Pro</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            onClick={syncDecks}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            🔄 Sync
          </Button>
          <Button
            onClick={() => setShowBrowser(!showBrowser)}
            size="sm"
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            {showBrowser ? 'Hide' : 'Show'} Browser
          </Button>
          <div className="text-sm text-gray-400">
            Master: {Math.round(masterVolume * 100)}%
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Music Browser */}
        {showBrowser && (
          <div className="w-80 bg-gray-900 border-r border-gray-700">
            <MusicBrowser 
              tracks={mockTracks}
              selectedTrack={selectedTrack}
              onSelectTrack={setSelectedTrack}
              onLoadTrack={loadTrackToDeck}
            />
          </div>
        )}
        
        {/* Main DJ Interface */}
        <div className="flex-1 flex flex-col">
          {/* Decks Section */}
          <div className="flex-1 flex">
            {/* Deck A */}
            <div className="flex-1 p-4">
              <Card className="h-full bg-gray-800/50 border-gray-700">
                <Deck
                  deck="A"
                  deckState={deckA}
                  onTogglePlay={() => togglePlayPause('A')}
                  onUpdateParam={(param, value) => updateDeckParam('A', param, value)}
                  onUpdateEQ={(band, value) => updateEQ('A', band, value)}
                  onAddCue={(time) => addCuePoint('A', time)}
                  audioContext={audioContextRef.current}
                  outputNode={crossfaderNodeRef.current?.left}
                />
              </Card>
            </div>
            
            {/* Center Controls */}
            <div className="w-64 p-4 flex flex-col justify-center">
              <Card className="bg-gray-800/50 border-gray-700 p-4">
                <Crossfader
                  value={crossfaderValue}
                  onChange={setCrossfaderValue}
                  masterVolume={masterVolume}
                  onMasterVolumeChange={setMasterVolume}
                />
                
                <div className="mt-6">
                  <RecordingPanel
                    isRecording={isRecording}
                    onToggleRecording={toggleRecording}
                  />
                </div>
              </Card>
            </div>
            
            {/* Deck B */}
            <div className="flex-1 p-4">
              <Card className="h-full bg-gray-800/50 border-gray-700">
                <Deck
                  deck="B"
                  deckState={deckB}
                  onTogglePlay={() => togglePlayPause('B')}
                  onUpdateParam={(param, value) => updateDeckParam('B', param, value)}
                  onUpdateEQ={(band, value) => updateEQ('B', band, value)}
                  onAddCue={(time) => addCuePoint('B', time)}
                  audioContext={audioContextRef.current}
                  outputNode={crossfaderNodeRef.current?.right}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DJApp;