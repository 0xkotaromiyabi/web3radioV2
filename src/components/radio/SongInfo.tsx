
import React, { useState } from 'react';
import { Music, User, Disc, RefreshCw, Clock, ListMusic } from 'lucide-react';

interface Song {
  title: string;
  artist: string;
  album: string;
}

interface SongInfoProps {
  currentSong: Song | null;
  isLoading: boolean;
  currentStation: string;
  onRefresh?: () => void;
  lastUpdated?: string;
  playlist?: Song[];
}

const SongInfo = ({ currentSong, isLoading, currentStation, onRefresh, lastUpdated, playlist = [] }: SongInfoProps) => {
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  if (isLoading) {
    return (
      <div className="bg-[#1a1a1a] border border-[#333] rounded p-3 mb-4 animate-pulse">
        <div className="h-4 bg-[#333] rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-[#333] rounded mb-2 w-1/2"></div>
        <div className="h-4 bg-[#333] rounded w-2/3"></div>
      </div>
    );
  }

  if (!currentSong) {
    return (
      <div className="bg-[#1a1a1a] border border-[#333] rounded p-3 mb-4 text-gray-400 text-sm">
        <p className="flex items-center gap-2">
          <Music size={16} />
          <span>Waiting for song information...</span>
        </p>
      </div>
    );
  }

  const stationSource = 
    currentStation === 'female' ? 'OnlineRadioBox (Female Radio)' :
    currentStation === 'delta' ? 'OnlineRadioBox (Delta FM)' :
    currentStation === 'iradio' ? 'OnlineRadioBox (i-Radio)' : 
    'Stream Metadata';

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded p-3 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[#00ff00] font-bold flex items-center gap-2">
          <Music size={16} />
          <span>Now Playing</span>
        </h3>
        <div className="flex gap-2">
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="text-gray-400 hover:text-[#00ff00] transition-colors"
              title="Refresh song info"
            >
              <RefreshCw size={14} />
            </button>
          )}
          <button 
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={`text-gray-400 hover:text-[#00ff00] transition-colors ${showPlaylist ? 'text-[#00ff00]' : ''}`}
            title={showPlaylist ? "Hide playlist" : "Show playlist"}
          >
            <ListMusic size={14} />
          </button>
        </div>
      </div>
      <div className="text-white text-sm space-y-2">
        <p className="flex items-center gap-2">
          <Music size={14} className="text-gray-400" />
          <span className="font-medium">{currentSong.title || 'Unknown Title'}</span>
        </p>
        <p className="flex items-center gap-2">
          <User size={14} className="text-gray-400" />
          <span>{currentSong.artist || 'Unknown Artist'}</span>
        </p>
        <p className="flex items-center gap-2">
          <Disc size={14} className="text-gray-400" />
          <span>{currentSong.album || 'Unknown Album'}</span>
        </p>
        {lastUpdated && (
          <p className="flex items-center gap-2 text-xs text-gray-400">
            <Clock size={12} className="text-gray-500" />
            <span>Updated: {lastUpdated}</span>
          </p>
        )}
      </div>
      
      {/* Playlist Section */}
      {showPlaylist && playlist.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#333]">
          <h4 className="text-[#00ff00] text-xs font-bold mb-2 flex items-center gap-2">
            <ListMusic size={12} />
            <span>Recent Playlist</span>
          </h4>
          <div className="max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            <ul className="space-y-2">
              {playlist.map((song, index) => (
                <li key={index} className="text-xs py-1 border-b border-[#333] last:border-0">
                  <p className="text-white font-medium">{song.title || 'Unknown'}</p>
                  <p className="text-gray-400">{song.artist || 'Unknown'}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-2 text-[10px] text-gray-500">
        Source: {stationSource}
      </div>
    </div>
  );
};

export default SongInfo;
