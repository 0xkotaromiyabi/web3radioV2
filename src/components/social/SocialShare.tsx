import React from 'react'; 
import { Twitter, Share2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SocialShare = () => {
  const shareUrl = window.location.href;
  const shareText = "Listen to Web3Radio on your favorite platform! 🎵\n\n" +
                    "Web: http://web3radio.xyz\n" +
                    "Telegram Bot: http://t.me/web3radio_bot\n" +
                    "Invite… Discord Bot: http://bit.ly/web3radioDC\n" +
                    "ENS Webhash: http://2cva5js2vf.hash.is";

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
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast.success('Share text copied to clipboard for Farcaster!');
        return;
      case 'copy':
        navigator.clipboard.writeText(shareText);
        toast.success('Share text copied to clipboard!');
        return;
    }

    window.open(shareLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      <Button
        variant="outline"
        className="bg-[#1DA1F2] text-white hover:bg-[#1a8cd8]"
        onClick={() => handleShare('twitter')}
      >
        <Twitter className="mr-2 h-4 w-4" />
        Twitter
      </Button>
      
      <Button
        variant="outline"
        className="bg-[#0088cc] text-white hover:bg-[#0077b3]"
        onClick={() => handleShare('telegram')}
      >
        <Send className="mr-2 h-4 w-4" />
        Telegram
      </Button>
      
      <Button
        variant="outline"
        className="bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
        onClick={() => handleShare('farcaster')}
      >
        FC
      </Button>
      
      <Button
        variant="outline"
        className="bg-gray-600 text-white hover:bg-gray-700"
        onClick={() => handleShare('copy')}
      >
        <Share2 className="mr-2 h-4 w-4" />
        Copy Link
      </Button>
    </div>
  );
};

export default SocialShare;
