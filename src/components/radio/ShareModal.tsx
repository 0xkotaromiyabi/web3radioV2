import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Share2, Twitter, Instagram, Link as LinkIcon, Download, X, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/web3radio-logo.png';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentSong: {
        title: string;
        artist: string;
        album: string;
        artwork?: string;
    } | null;
    stationName: string;
}

export function ShareModal({ isOpen, onClose, currentSong, stationName }: ShareModalProps) {
    const { toast } = useToast();
    const cardRef = useRef<HTMLDivElement>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    if (!isOpen) return null;

    const appUrl = 'https://www.webthreeradio.xyz/';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(appUrl);
        toast({
            title: "Link Copied!",
            description: "App URL copied to clipboard.",
        });
    };

    const handleTwitterShare = () => {
        const text = currentSong
            ? `Listening to ${currentSong.title} by ${currentSong.artist} on ${stationName} 🎧📻\n`
            : `Tuning in to ${stationName} 📻\n`;

        const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(appUrl)}`;
        window.open(intentUrl, '_blank');
    };

    const generateImage = async (): Promise<Blob | null> => {
        if (!cardRef.current) return null;
        try {
            setIsCapturing(true);
            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                scale: 2 // High resolution
            });

            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/png');
            });
        } catch (error) {
            console.error("Failed to generate image", error);
            return null;
        } finally {
            setIsCapturing(false);
        }
    };

    const handleInstagramShare = async () => {
        const blob = await generateImage();
        if (!blob) {
            toast({ title: "Error", description: "Failed to generate share image.", variant: "destructive" });
            return;
        }

        // Try Web Share API (often supported on mobile Chrome/Safari for images)
        if (navigator.share && navigator.canShare) {
            const file = new File([blob], 'web3radio-share.png', { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: 'Web3Radio',
                        text: `Listening to ${currentSong?.title || stationName}`,
                        files: [file]
                    });
                    return;
                } catch (err) {
                    console.error("Web share failed/cancelled", err);
                }
            }
        }

        // Fallback: download the image so user can post it manually
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'web3radio-story.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
            title: "Image Downloaded",
            description: "You can now share this image on Instagram Stories!",
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 w-full max-w-[400px] border border-white/20 shadow-2xl relative flex flex-col items-center">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share to Social
                </h3>

                {/* --- THE IG STORY CARD (Captured via html2canvas) --- */}
                <div
                    ref={cardRef}
                    className="relative w-full aspect-[9/16] max-h-[500px] rounded-[32px] overflow-hidden bg-gradient-to-br from-[#1a1c29] to-[#0f1016] shadow-2xl mb-8 flex flex-col items-center justify-center p-8"
                >
                    {/* Subtle Background Art Blur */}
                    {currentSong?.artwork && (
                        <div
                            className="absolute inset-0 opacity-40 blur-3xl scale-125"
                            style={{ backgroundImage: `url(${currentSong.artwork})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        />
                    )}

                    <div className="relative z-10 flex flex-col items-center w-full">
                        {/* Artwork */}
                        <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-8 border border-white/10 bg-black/40 flex items-center justify-center">
                            {currentSong?.artwork ? (
                                <img src={currentSong.artwork} alt="Artwork" className="w-full h-full object-cover" crossOrigin="anonymous" />
                            ) : (
                                <Music className="w-16 h-16 text-white/50" />
                            )}
                        </div>

                        {/* Song Info */}
                        <div className="text-center w-full space-y-2">
                            <h2 className="text-white text-2xl font-bold font-['Space_Grotesk'] tracking-tight truncate w-full px-4">
                                {currentSong?.title || "Live Stream"}
                            </h2>
                            <p className="text-white/70 text-lg font-medium truncate w-full px-4">
                                {currentSong?.artist || stationName}
                            </p>

                            <div className="inline-block mt-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                                <p className="text-white/90 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    {stationName}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Branding Watermark */}
                    <div className="absolute bottom-6 flex items-center gap-3 opacity-80">
                        <img src={logo} alt="Web3Radio" className="w-8 h-8 rounded-lg" />
                        <div className="text-left">
                            <p className="text-white text-sm font-bold tracking-wider">Web3Radio</p>
                            <p className="text-white/50 text-[10px] font-mono">webthreeradio.xyz</p>
                        </div>
                    </div>
                </div>

                {/* --- Action Buttons --- */}
                <div className="grid grid-cols-3 gap-4 w-full">
                    <button
                        onClick={handleInstagramShare}
                        disabled={isCapturing}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-active:scale-95">
                            {isCapturing ? <Download className="w-6 h-6 text-white animate-bounce" /> : <Instagram className="w-6 h-6 text-white" />}
                        </div>
                        <span className="text-white/70 text-xs font-medium">IG Story</span>
                    </button>

                    <button
                        onClick={handleTwitterShare}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="w-14 h-14 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-active:scale-95">
                            <Twitter className="w-5 h-5 text-white" fill="currentColor" />
                        </div>
                        <span className="text-white/70 text-xs font-medium">X (Twitter)</span>
                    </button>

                    <button
                        onClick={handleCopyLink}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-active:scale-95">
                            <LinkIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white/70 text-xs font-medium">Copy Link</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
