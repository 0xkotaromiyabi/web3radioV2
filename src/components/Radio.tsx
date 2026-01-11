
import React from 'react';
import RadioPlayer from './radio/RadioPlayer';
import logo from '@/assets/web3radio-logo.png';

const RadioComponent = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Logo Header */}
        <div className="mb-8 flex flex-col items-center">
          <img
            src={logo}
            alt="Web3Radio"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl shadow-2xl mb-4 ring-2 ring-white/20"
          />
          <h1 className="text-2xl font-semibold text-white">Web3Radio</h1>
          <p className="text-gray-400 text-sm">Listen to your favorite stations</p>
        </div>

        <RadioPlayer />
      </div>
    </div>
  );
};

export default RadioComponent;
