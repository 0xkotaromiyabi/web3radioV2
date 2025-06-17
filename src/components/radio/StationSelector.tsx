
import React from 'react';
import { Radio as RadioIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Station {
  id: string;
  name: string;
  url: string;
  description: string;
}

interface StationSelectorProps {
  stations: Station[];
  currentStation: string;
  onStationChange: (stationId: string) => void;
}

const StationSelector = ({ stations, currentStation, onStationChange }: StationSelectorProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`mb-4 flex ${isMobile ? 'flex-wrap' : ''} gap-2 justify-center`}>
      {stations.map((station) => (
        <button
          key={station.id}
          onClick={() => onStationChange(station.id)}
          className={`px-4 py-2 rounded-full flex items-center gap-2 ${
            currentStation === station.name
              ? 'bg-[#00ff00] text-black'
              : 'bg-[#333] text-gray-300'
          } ${isMobile ? 'mb-2' : ''}`}
        >
          <RadioIcon size={16} />
          {station.name}
        </button>
      ))}
    </div>
  );
};

export default StationSelector;
