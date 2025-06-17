
import React from 'react';
import RadioPlayer from './radio/RadioPlayer';

const Radio = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-6 sm:mb-8 flex justify-center">
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
