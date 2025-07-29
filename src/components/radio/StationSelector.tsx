
import React from 'react';
import { Radio as RadioIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface StationSelectorProps {
  currentStation: string;
  onStationChange: (station: 'web3' | 'Venus' | 'iradio' | 'female' | 'delta' | 'longplayer') => void;
}

const StationSelector = ({ currentStation, onStationChange }: StationSelectorProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="mb-4 flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => onStationChange('web3')}
        className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
          currentStation === 'web3'
            ? 'bg-[#00ff00] text-black'
            : 'bg-[#333] text-gray-300'
        } transition-all duration-200 hover:scale-105`}
      >
        <RadioIcon size={14} className="sm:w-4 sm:h-4" />
        <span className="hidden xs:inline sm:inline">Web3 Radio</span>
        <span className="xs:hidden">Web3</span>
      </button>
      <button
        onClick={() => onStationChange('Venus')}
        className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
          currentStation === 'Venus'
            ? 'bg-[#00ff00] text-black'
            : 'bg-[#333] text-gray-300'
        } transition-all duration-200 hover:scale-105`}
      >
        <RadioIcon size={14} className="sm:w-4 sm:h-4" />
        <span className="hidden xs:inline sm:inline">Venus FM</span>
        <span className="xs:hidden">Venus</span>
      </button>
      <button
        onClick={() => onStationChange('iradio')}
        className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
          currentStation === 'iradio'
            ? 'bg-[#00ff00] text-black'
            : 'bg-[#333] text-gray-300'
        } transition-all duration-200 hover:scale-105`}
      >
        <RadioIcon size={14} className="sm:w-4 sm:h-4" />
        <span className="hidden xs:inline sm:inline">i-Radio</span>
        <span className="xs:hidden">iRadio</span>
      </button>
      <button
        onClick={() => onStationChange('female')}
        className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
          currentStation === 'female'
            ? 'bg-[#00ff00] text-black'
            : 'bg-[#333] text-gray-300'
        } transition-all duration-200 hover:scale-105`}
      >
        <RadioIcon size={14} className="sm:w-4 sm:h-4" />
        <span className="hidden xs:inline sm:inline">Female Radio</span>
        <span className="xs:hidden">Female</span>
      </button>
      <button
        onClick={() => onStationChange('delta')}
        className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
          currentStation === 'delta'
            ? 'bg-[#00ff00] text-black'
            : 'bg-[#333] text-gray-300'
        } transition-all duration-200 hover:scale-105`}
      >
        <RadioIcon size={14} className="sm:w-4 sm:h-4" />
        <span className="hidden xs:inline sm:inline">Delta FM</span>
        <span className="xs:hidden">Delta</span>
      </button>
      <button
        onClick={() => onStationChange('longplayer')}
        className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
          currentStation === 'longplayer'
            ? 'bg-[#00ff00] text-black'
            : 'bg-[#333] text-gray-300'
        } transition-all duration-200 hover:scale-105`}
      >
        <RadioIcon size={14} className="sm:w-4 sm:h-4" />
        <span className="hidden xs:inline sm:inline">Longplayer</span>
        <span className="xs:hidden">Long</span>
      </button>
    </div>
  );
};

export default StationSelector;

