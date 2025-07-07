import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';

const MusicBrowser = ({ tracks, selectedTrack, onSelectTrack, onLoadTrack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [filterGenre, setFilterGenre] = useState('all');
  
  // Get unique genres
  const genres = ['all', ...new Set(tracks.map(track => track.genre))];
  
  // Filter and sort tracks
  const filteredTracks = tracks
    .filter(track => {
      const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           track.artist.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = filterGenre === 'all' || track.genre === filterGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'bpm':
          return a.bpm - b.bpm;
        case 'duration':
          return a.duration - b.duration;
        default:
          return 0;
      }
    });
  
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getBpmColor = (bpm) => {
    if (bpm < 100) return 'text-blue-400';
    if (bpm < 120) return 'text-green-400';
    if (bpm < 140) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <CardHeader className="pb-3 border-b border-gray-700">
        <CardTitle className="text-lg font-bold text-cyan-400">
          🎵 MUSIC LIBRARY
        </CardTitle>
        
        {/* Search */}
        <Input
          placeholder="Search tracks or artists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
        />
        
        {/* Filters */}
        <div className="flex space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-600 text-white text-sm rounded px-2 py-1"
          >
            <option value="title">Sort by Title</option>
            <option value="artist">Sort by Artist</option>
            <option value="bpm">Sort by BPM</option>
            <option value="duration">Sort by Duration</option>
          </select>
          
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-600 text-white text-sm rounded px-2 py-1"
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre === 'all' ? 'All Genres' : genre}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      {/* Track List */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-1">
            {filteredTracks.map((track) => (
              <Card 
                key={track.id}
                className={`
                  cursor-pointer transition-all duration-150 border
                  ${selectedTrack?.id === track.id 
                    ? 'bg-cyan-600/20 border-cyan-400' 
                    : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
                  }
                `}
                onClick={() => onSelectTrack(track)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {/* Track Info */}
                    <div>
                      <div className="font-semibold text-white text-sm truncate">
                        {track.title}
                      </div>
                      <div className="text-gray-400 text-xs truncate">
                        {track.artist}
                      </div>
                    </div>
                    
                    {/* Track Details */}
                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-mono ${getBpmColor(track.bpm)}`}>
                        {track.bpm} BPM
                      </span>
                      <span className="text-gray-400">
                        {formatDuration(track.duration)}
                      </span>
                      <span className="text-purple-400 uppercase text-[10px]">
                        {track.genre}
                      </span>
                    </div>
                    
                    {/* Load Buttons */}
                    <div className="flex space-x-1 pt-1">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLoadTrack(track, 'A');
                        }}
                        size="sm"
                        className="flex-1 h-6 text-xs bg-cyan-600 hover:bg-cyan-700"
                      >
                        → DECK A
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLoadTrack(track, 'B');
                        }}
                        size="sm"
                        className="flex-1 h-6 text-xs bg-purple-600 hover:bg-purple-700"
                      >
                        → DECK B
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredTracks.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <div className="text-lg mb-2">🔍</div>
                <div>No tracks found</div>
                <div className="text-xs">Try adjusting your search or filters</div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Footer Info */}
      <div className="p-2 border-t border-gray-700 text-center text-xs text-gray-400">
        {filteredTracks.length} of {tracks.length} tracks
      </div>
    </div>
  );
};

export default MusicBrowser;