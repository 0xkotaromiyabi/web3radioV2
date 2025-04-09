
import React from 'react';
import { Music, User, Disc } from 'lucide-react';

interface SongInfoProps {
  currentSong: {
    title: string;
    artist: string;
    album: string;
  } | null;
  isLoading: boolean;
}

const SongInfo = ({ currentSong, isLoading }: SongInfoProps) => {
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

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded p-3 mb-4">
      <h3 className="text-[#00ff00] font-bold mb-2 flex items-center gap-2">
        <Music size={16} />
        <span>Now Playing</span>
      </h3>
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
      </div>
    </div>
  );
};

export default SongInfo;
