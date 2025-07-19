
import React from 'react'; 
import { Twitter, Share2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SocialShare = () => {
  const shareUrl = window.location.href;
  const shareText = "🎵 Listen to Web3Radio - The sound of on-chain culture!\n\n" +
                    "🌐 Web: https://web3radio.xyz\n" +
                    "🤖 Telegram: https://t.me/web3radio_bot\n" +
                    "🎮 Discord: https://bit.ly/web3radioDC\n" +
                    "🔗 ENS: https://2cva5js2vf.hash.is";

  const handleShare = (platform: string) => {
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'telegram':
        shareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'farcaster':
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast.success('Share text copied to clipboard for Farcaster!');
        return;
      case 'copy':
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast.success('Share text copied to clipboard!');
        return;
    }

    window.open(shareLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-800/50 rounded-lg border border-green-500/20">
      <h3 className="text-green-400 font-semibold mb-4 text-center text-sm sm:text-base">Share Web3Radio</h3>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <Button
          variant="outline"
          size="sm"
          className="bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] border-none text-xs sm:text-sm"
          onClick={() => handleShare('twitter')}
        >
          <Twitter className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Twitter</span>
          <span className="xs:hidden">X</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="bg-[#0088cc] text-white hover:bg-[#0077b3] border-none text-xs sm:text-sm"
          onClick={() => handleShare('telegram')}
        >
          <Send className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Telegram
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="bg-[#8B5CF6] text-white hover:bg-[#7C3AED] border-none text-xs sm:text-sm px-2 sm:px-3"
          onClick={() => handleShare('farcaster')}
        >
          FC
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-600 text-white hover:bg-gray-700 border-none text-xs sm:text-sm"
          onClick={() => handleShare('copy')}
        >
          <Share2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Copy</span>
          <span className="sm:hidden">📋</span>
        </Button>
      </div>
    </div>
  );
};

export default SocialShare;
