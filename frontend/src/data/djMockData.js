// Mock data for DJ tracks and playlists
export const mockTracks = [
  {
    id: 1,
    title: "Titanium",
    artist: "David Guetta ft. Sia",
    genre: "House",
    bpm: 126,
    duration: 245,
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    key: "F# minor",
    year: 2011,
    energy: 85,
    danceability: 88
  },
  {
    id: 2,
    title: "Levels",
    artist: "Avicii",
    genre: "Progressive House",
    bpm: 126,
    duration: 203,
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    key: "C major",
    year: 2011,
    energy: 92,
    danceability: 91
  },
  {
    id: 3,
    title: "Animals",
    artist: "Martin Garrix",
    genre: "Big Room",
    bpm: 128,
    duration: 302,
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    key: "A minor",
    year: 2013,
    energy: 95,
    danceability: 89
  },
  {
    id: 4,
    title: "Clarity",
    artist: "Zedd ft. Foxes",
    genre: "Electro House",
    bpm: 128,
    duration: 271,
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    key: "G major",
    year: 2012,
    energy: 87,
    danceability: 85
  },
  {
    id: 5,
    title: "Wake Me Up",
    artist: "Avicii",
    genre: "Progressive House",
    bpm: 124,
    duration: 247,
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    key: "B minor",
    year: 2013,
    energy: 89,
    danceability: 87
  },
  {
    id: 6,
    title: "Scary Monsters and Nice Sprites",
    artist: "Skrillex",
    genre: "Dubstep",
    bpm: 140,
    duration: 220,
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    key: "F# minor",
    year: 2010,
    energy: 98,
    danceability: 82
  },
  {
    id: 7,
    title: "One More Time",
    artist: "Daft Punk",
    genre: "French House",
    bpm: 123,
    duration: 320,
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    key: "F major",
    year: 2000,
    energy: 86,
    danceability: 93
  },
  {
    id: 8,
    title: "Bangarang",
    artist: "Skrillex ft. Sirah",
    genre: "Dubstep",
    bpm: 110,
    duration: 215,
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    key: "A minor",
    year: 2011,
    energy: 96,
    danceability: 80
  },
  {
    id: 9,
    title: "Satisfaction",
    artist: "Benny Benassi",
    genre: "Electro House",
    bpm: 132,
    duration: 248,
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    key: "E minor",
    year: 2002,
    energy: 91,
    danceability: 88
  },
  {
    id: 10,
    title: "Calabria 2008",
    artist: "Enur vs. Natasja",
    genre: "House",
    bpm: 130,
    duration: 199,
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    key: "F minor",
    year: 2007,
    energy: 84,
    danceability: 90
  },
  {
    id: 11,
    title: "Turn Down for What",
    artist: "DJ Snake & Lil Jon",
    genre: "Trap",
    bpm: 100,
    duration: 213,
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    key: "Bb minor",
    year: 2013,
    energy: 94,
    danceability: 83
  },
  {
    id: 12,
    title: "Strobe",
    artist: "Deadmau5",
    genre: "Progressive House",
    bpm: 128,
    duration: 645,
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    key: "Db major",
    year: 2009,
    energy: 78,
    danceability: 79
  },
  {
    id: 13,
    title: "Around the World",
    artist: "Daft Punk",
    genre: "French House",
    bpm: 121,
    duration: 429,
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    key: "Bb major",
    year: 1997,
    energy: 82,
    danceability: 91
  },
  {
    id: 14,
    title: "Silhouettes",
    artist: "Avicii",
    genre: "Progressive House",
    bpm: 128,
    duration: 267,
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    key: "F# minor",
    year: 2012,
    energy: 85,
    danceability: 86
  },
  {
    id: 15,
    title: "Riverside",
    artist: "Agnes Obel",
    genre: "Ambient",
    bpm: 85,
    duration: 301,
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    key: "C major",
    year: 2016,
    energy: 45,
    danceability: 42
  }
];

export const mockPlaylists = [
  {
    id: 1,
    name: "Main Set",
    tracks: [1, 2, 3, 4, 5],
    description: "High energy main set tracks",
    genre: "House/Progressive",
    totalDuration: 1268
  },
  {
    id: 2,
    name: "Warm Up",
    tracks: [7, 13, 15],
    description: "Smooth warm up selections",
    genre: "Various",
    totalDuration: 1050
  },
  {
    id: 3,
    name: "Bass Heavy",
    tracks: [6, 8, 11],
    description: "Drop the bass",
    genre: "Dubstep/Trap",
    totalDuration: 648
  },
  {
    id: 4,
    name: "Classic House",
    tracks: [7, 9, 10, 13],
    description: "Timeless house classics",
    genre: "House",
    totalDuration: 1196
  }
];

export const mockEffects = [
  {
    id: 1,
    name: "Filter",
    type: "filter",
    parameters: {
      frequency: 1000,
      resonance: 1,
      type: "lowpass"
    }
  },
  {
    id: 2,
    name: "Reverb",
    type: "reverb",
    parameters: {
      roomSize: 0.3,
      damping: 0.5,
      wetness: 0.2
    }
  },
  {
    id: 3,
    name: "Delay",
    type: "delay",
    parameters: {
      delayTime: 0.3,
      feedback: 0.4,
      wetness: 0.2
    }
  },
  {
    id: 4,
    name: "Flanger",
    type: "flanger",
    parameters: {
      rate: 0.5,
      depth: 0.7,
      feedback: 0.3
    }
  }
];

export const mockBeatGrids = {
  1: { // Titanium
    beats: [0, 0.476, 0.952, 1.428, 1.904, 2.38, 2.856, 3.332], // First 8 beats
    bpm: 126,
    firstBeat: 0.1
  },
  2: { // Levels
    beats: [0, 0.476, 0.952, 1.428, 1.904, 2.38, 2.856, 3.332],
    bpm: 126,
    firstBeat: 0.2
  }
  // Add more beat grids as needed
};

export const djSettings = {
  crossfaderCurve: "linear", // linear, smooth, sharp
  autoGain: true,
  keyLock: true,
  quantization: "1/4", // 1/32, 1/16, 1/8, 1/4, 1/2, 1
  syncMode: "tempo", // tempo, beat, phase
  cueMode: "cdj", // cdj, pioneer, vinyl
  waveformDetail: "high", // low, medium, high
  recordingQuality: "320kbps",
  masterLimiter: true,
  microphoneEnabled: false
};