
import React from 'react';
import RadioPlayer from './radio/RadioPlayer';
import SocialShare from './social/SocialShare';

const Radio = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-4 sm:mb-6 flex justify-center">
        <img 
          src="/web3radio-logo.png" 
          alt="Web3 Radio" 
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full shadow-lg border-2 border-green-500/30"
        />
      </div>
      
      <RadioPlayer />
      <SocialShare />
    </div>
  );
};

export default Radio;
