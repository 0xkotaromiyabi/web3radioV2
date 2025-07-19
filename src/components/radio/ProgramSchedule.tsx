
import React from 'react';

interface ProgramScheduleProps {
  isMobile: boolean;
}

const ProgramSchedule = ({ isMobile }: ProgramScheduleProps) => {
  const upcomingPrograms = [
    "10:00 - Crypto Talk with Kotarominami",
    "12:00 - Web3 News Update",
    "14:00 - NFT Market Analysis",
    "16:00 - DeFi Deep Dive",
    "18:00 - Blockchain Technology Hour"
  ];

  return (
    <div className={`h-${isMobile ? '12' : '8'} bg-[#0a0a0a] border border-[#333] mb-2 overflow-hidden`}>
      <div className="animate-marquee whitespace-nowrap">
        {upcomingPrograms.map((program, index) => (
          <span key={index} className="text-[#00ff00] font-mono text-sm mx-4">
            📻 {program}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProgramSchedule;
