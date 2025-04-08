
import React from 'react';
import { Radio as RadioIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface StationSelectorProps {
  currentStation: string;
  onStationChange: (station: 'web3' | 'venus' | 'iradio' | 'female' | 'delta') => void;
}

const StationSelector = ({ currentStation, onStationChange }: StationSelectorProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`mb-4 flex ${isMobile ? 'flex-wrap' : ''} gap-2 justify-center`}>
      <button
        onClick={() => onStationChange('web3')}
        className={`px-4 py-2 rounded-full flex items-center gap-2 ${
          currentStation === 'web3' 
            ? 'bg-[#00ff00] text-black' 
            : 'bg-[#333] text-gray-300'
        } ${isMobile ? 'mb-2' : ''}`}
      >
        <RadioIcon size={16} />
        Web3 Radio
      </button>
      <button
        onClick={() => onStationChange('venus')}
        className={`px-4 py-2 rounded-full flex items-center gap-2 ${
          currentStation === 'venus' 
            ? 'bg-[#00ff00] text-black' 
            : 'bg-[#333] text-gray-300'
        } ${isMobile ? 'mb-2' : ''}`}
      >
        <RadioIcon size={16} />
        Venus Radio
      </button>
      <button
        onClick={() => onStationChange('iradio')}
        className={`px-4 py-2 rounded-full flex items-center gap-2 ${
          currentStation === 'iradio' 
            ? 'bg-[#00ff00] text-black' 
            : 'bg-[#333] text-gray-300'
        } ${isMobile ? 'mb-2' : ''}`}
      >
        <RadioIcon size={16} />
        i-Radio
      </button>
      <button
        onClick={() => onStationChange('female')}
        className={`px-4 py-2 rounded-full flex items-center gap-2 ${
          currentStation === 'female' 
            ? 'bg-[#00ff00] text-black' 
            : 'bg-[#333] text-gray-300'
        } ${isMobile ? 'mb-2' : ''}`}
      >
        <RadioIcon size={16} />
        Female Radio
      </button>
      <button
        onClick={() => onStationChange('delta')}
        className={`px-4 py-2 rounded-full flex items-center gap-2 ${
          currentStation === 'delta' 
            ? 'bg-[#00ff00] text-black' 
            : 'bg-[#333] text-gray-300'
        }`}
      >
        <RadioIcon size={16} />
        Delta FM
      </button>
    </div>
  );
};

export default StationSelector;
