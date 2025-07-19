import React from 'react';
import { Volume2, Volume1, VolumeX, SkipBack, SkipForward, Play, Pause } from 'lucide-react';

interface RadioControlsProps {
  isPlaying: boolean;
  volume: number;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
}

const RadioControls = ({ isPlaying, volume, togglePlay, setVolume }: RadioControlsProps) => {
  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div className="bg-[#232323] p-3 sm:p-4">
      <div className="flex justify-center items-center gap-4 sm:gap-6 mb-3 sm:mb-4">
        <button className="text-gray-400 hover:text-white transition-colors">
          <SkipBack size={14} className="sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={togglePlay}
          className="bg-[#333] hover:bg-[#444] rounded-full p-2 sm:p-3 text-white transition-all duration-200 hover:scale-105"
        >
          {isPlaying ? <Pause size={16} className="sm:w-5 sm:h-5" /> : <Play size={16} className="sm:w-5 sm:h-5" />}
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <SkipForward size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <VolumeIcon className="text-gray-400 flex-shrink-0" size={14} />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className="w-full h-1 bg-[#444] appearance-none rounded cursor-pointer"
          style={{
            backgroundImage: `linear-gradient(to right, #00ff00 0%, #00ff00 ${volume}%, #444 ${volume}%, #444 100%)`
          }}
        />
        <span className="text-[#00ff00] text-xs font-mono min-w-[2rem] text-right">{volume}</span>
      </div>
    </div>
  );
};

export default RadioControls;