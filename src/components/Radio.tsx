
import React from 'react';
import RadioPlayer from './radio/RadioPlayer';

const Radio = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 flex justify-center">
        <img 
          src="/web3radio-logo.png" 
          alt="Web3 Radio" 
          className="w-32 h-32 rounded-full shadow-lg"
        />
      </div>
      
      <RadioPlayer />
    </div>
  );
};

export default Radio;
