
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
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <button className="text-gray-400 hover:text-white p-1 sm:p-2 rounded-md hover:bg-gray-700 transition-colors">
          <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={togglePlay}
          className="bg-[#333] hover:bg-[#444] rounded-full p-3 sm:p-4 text-white transition-colors shadow-lg"
        >
          {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6" />}
        </button>
        <button className="text-gray-400 hover:text-white p-1 sm:p-2 rounded-md hover:bg-gray-700 transition-colors">
          <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <VolumeIcon className="text-gray-400 flex-shrink-0" size={16} />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className="w-full h-2 bg-[#444] appearance-none rounded cursor-pointer flex-1"
          style={{
            backgroundImage: `linear-gradient(to right, #00ff00 0%, #00ff00 ${volume}%, #444 ${volume}%, #444 100%)`
          }}
        />
        <span className="text-gray-400 text-xs sm:text-sm font-mono min-w-[2rem] text-right">
          {volume}%
        </span>
      </div>
    </div>
  );
};

export default RadioControls;
