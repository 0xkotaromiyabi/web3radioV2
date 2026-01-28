
import React from 'react';
import { Radio as RadioIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface StationSelectorProps {
  currentStation: string;
  onStationChange: (station: 'web3' | 'ozradio' | 'iradio' | 'female' | 'delta' | 'prambors') => void;
}

const StationSelector = ({ currentStation, onStationChange }: StationSelectorProps) => {
  const isMobile = useIsMobile();

  const stations = [
    { id: 'web3', name: 'Web3 Radio', shortName: 'Web3' },
    { id: 'ozradio', name: 'Oz Radio Jakarta', shortName: 'Oz' },
    { id: 'iradio', name: 'i-Radio', shortName: 'iRadio' },
    { id: 'female', name: 'Female Radio', shortName: 'Female' },
    { id: 'delta', name: 'Delta FM', shortName: 'Delta' },
    { id: 'prambors', name: 'Prambors FM', shortName: 'Prambors' },
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {stations.map((station) => (
          <button
            key={station.id}
            onClick={() => onStationChange(station.id as any)}
            className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-200 
              ${currentStation === station.id
                ? 'bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-[0_4px_12px_rgba(59,130,246,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] transform scale-105'
                : 'bg-white text-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:scale-105 active:scale-95'
              }`}
          >
            <RadioIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{station.name}</span>
            <span className="sm:hidden">{station.shortName}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StationSelector;
