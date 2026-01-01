
import React from 'react';
import RadioPlayer from './radio/RadioPlayer';

const RadioComponent = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Logo Header */}
        <div className="mb-8 flex flex-col items-center">
          <img
            src="/web3radio-logo.png"
            alt="Web3Radio"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl shadow-apple-lg mb-4"
          />
          <h1 className="text-2xl font-semibold text-gray-900">Web3Radio</h1>
          <p className="text-gray-500 text-sm">Listen to your favorite stations</p>
        </div>

        <RadioPlayer />
      </div>
    </div>
  );
};

export default RadioComponent;
