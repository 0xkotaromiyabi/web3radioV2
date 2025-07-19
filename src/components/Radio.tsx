
import React from 'react';
import RadioPlayer from './radio/RadioPlayer';

const Radio = () => {
  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 md:p-6">
      <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center">
        <img 
          src="/web3radio-logo.png" 
          alt="Web3 Radio" 
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full shadow-lg"
        />
      </div>
      
      <RadioPlayer />
    </div>
  );
};

export default Radio;
