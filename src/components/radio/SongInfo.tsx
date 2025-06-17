
import React, { useState } from 'react';
import { Music, User, Disc, RefreshCw, Clock, ListMusic } from 'lucide-react';

interface SongInfoProps {
  title: string;
  artist: string;
  album: string;
}

const SongInfo = ({ title, artist, album }: SongInfoProps) => {
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded p-3 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[#00ff00] font-bold flex items-center gap-2">
          <Music size={16} />
          <span>Now Playing</span>
        </h3>
        <div className="flex gap-2">
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
          <span className="font-medium">{title || 'Unknown Title'}</span>
        </p>
        <p className="flex items-center gap-2">
          <User size={14} className="text-gray-400" />
          <span>{artist || 'Unknown Artist'}</span>
        </p>
        <p className="flex items-center gap-2">
          <Disc size={14} className="text-gray-400" />
          <span>{album || 'Unknown Album'}</span>
        </p>
      </div>
    </div>
  );
};

export default SongInfo;
