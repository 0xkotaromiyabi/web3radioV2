
import React, { useEffect, useState } from 'react';

const AudioVisualizer = () => {
  const [bars, setBars] = useState<number[]>(Array(16).fill(20));

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * 80 + 20));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-24 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50 flex items-end justify-center gap-1 px-4 py-3 overflow-hidden">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-2 rounded-full bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-150"
          style={{
            height: `${height}%`,
            opacity: 0.6 + (height / 100) * 0.4
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
