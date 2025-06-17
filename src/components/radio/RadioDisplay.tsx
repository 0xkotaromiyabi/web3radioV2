
import React from 'react';
import { Radio } from 'lucide-react';

interface RadioDisplayProps {
  isPlaying: boolean;
  currentStation: string;
  currentTrack: string;
}

const RadioDisplay = ({ isPlaying, currentStation, currentTrack }: RadioDisplayProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 sm:p-6 mb-4 border border-green-500/30 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-gray-600'} transition-colors`}>
            <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h3 className="text-green-400 font-bold text-sm sm:text-base">{currentStation}</h3>
            <p className="text-gray-300 text-xs sm:text-sm">{isPlaying ? 'ON AIR' : 'OFFLINE'}</p>
          </div>
        </div>
        {isPlaying && (
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-green-500 animate-pulse"></div>
            <div className="w-1 h-6 bg-green-400 animate-pulse delay-100"></div>
            <div className="w-1 h-5 bg-green-300 animate-pulse delay-200"></div>
          </div>
        )}
      </div>
      
      <div className="bg-black/50 rounded p-3 border border-green-500/20">
        <p className="text-green-400 text-xs mb-1">NOW PLAYING</p>
        <p className="text-white font-mono text-sm sm:text-base truncate">
          {currentTrack || 'Select a station to start listening'}
        </p>
      </div>
    </div>
  );
};

export default RadioDisplay;
