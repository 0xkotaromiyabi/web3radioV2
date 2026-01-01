
import React from 'react';
import { Volume2, Volume1, VolumeX, Play, Pause } from 'lucide-react';

interface RadioControlsProps {
  isPlaying: boolean;
  volume: number;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
}

const RadioControls = ({ isPlaying, volume, togglePlay, setVolume }: RadioControlsProps) => {
  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div className="px-6 py-4">
      {/* Play Button - 3D Style */}
      <div className="flex justify-center mb-6">
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center shadow-[0_6px_20px_rgba(59,130,246,0.5),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.6),0_3px_6px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-105 active:scale-95 active:shadow-[0_2px_8px_rgba(59,130,246,0.4)]"
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 text-white drop-shadow-sm" fill="white" />
          ) : (
            <Play className="w-7 h-7 text-white ml-1 drop-shadow-sm" fill="white" />
          )}
        </button>
      </div>

      {/* Volume Control - Apple Style Slider */}
      <div className="flex items-center gap-4">
        <VolumeIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <div className="flex-1 relative">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full h-2 appearance-none rounded-full cursor-pointer shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume}%, #e5e7eb ${volume}%, #e5e7eb 100%)`
            }}
          />
        </div>
        <span className="text-sm text-gray-600 font-medium min-w-[2rem] text-right tabular-nums">
          {volume}
        </span>
      </div>
    </div>
  );
};

export default RadioControls;