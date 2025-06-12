
import React from 'react';

const AudioVisualizer = () => {
  return (
    <div className="h-16 bg-[#000] border border-[#333] mb-2">
      <div className="h-full flex items-end justify-around px-1">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-[#00ff00]"
            style={{
              height: `${Math.random() * 100}%`,
              transition: 'height 150ms ease'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioVisualizer;
