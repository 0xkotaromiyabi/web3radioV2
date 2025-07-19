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
    <div className="bg-[#232323] p-4">
      <div className="flex justify-between items-center mb-4">
        <button className="text-gray-400 hover:text-white">
          <SkipBack size={16} />
        </button>
        <button
          onClick={togglePlay}
          className="bg-[#333] hover:bg-[#444] rounded-full p-2 text-white"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button className="text-gray-400 hover:text-white">
          <SkipForward size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <VolumeIcon className="text-gray-400" size={16} />
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
      </div>
    </div>
  );
};

export default RadioControls;