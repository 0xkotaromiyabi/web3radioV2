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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-none" />

            {/* Scrollable container that centers itself vertically */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 w-full max-w-[320px] max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl relative flex flex-col items-center animate-in zoom-in-95 duration-300 scrollbar-hide my-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-50"
                >
                    <X className="w-4 h-4" />
                </button>

                <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                </h3>

                {/* --- THE IG STORY CARD (Captured via html2canvas) --- */}
                <div
                    ref={cardRef}
                    className="relative w-full max-w-[200px] aspect-[9/16] rounded-[20px] overflow-hidden bg-gradient-to-br from-[#1a1c29] to-[#0f1016] shadow-2xl mb-6 flex flex-col items-center justify-center p-4 shrink-0 mx-auto"
                >
                    {/* Subtle Background Art Blur */}
                    {currentSong?.artwork && (
                        <div
                            className="absolute inset-0 opacity-40 blur-2xl scale-110 pointer-events-none"
                            style={{ backgroundImage: `url(${currentSong.artwork})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        />
                    )}

                    <div className="relative z-10 flex flex-col items-center w-full">
                        {/* Artwork */}
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-4 border border-white/10 bg-black/40 flex items-center justify-center pointer-events-none">
                            {currentSong?.artwork ? (
                                <img src={currentSong.artwork} alt="Artwork" className="w-full h-full object-cover" crossOrigin="anonymous" />
                            ) : (
                                <Music className="w-10 h-10 text-white/50" />
                            )}
                        </div>

                        {/* Song Info */}
                        <div className="text-center w-full space-y-1 pointer-events-none">
                            <h2 className="text-white text-base font-bold font-['Space_Grotesk'] tracking-tight truncate w-full px-2">
                                {currentSong?.title || "Live Stream"}
                            </h2>
                            <p className="text-white/70 text-[10px] font-medium truncate w-full px-2">
                                {currentSong?.artist || stationName}
                            </p>

                            <div className="inline-block mt-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                                <p className="text-white/90 text-[8px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    {stationName}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Branding Watermark */}
                    <div className="absolute bottom-3 flex items-center gap-1.5 opacity-80 pointer-events-none w-full px-4 justify-center">
                        <img src={logo} alt="Web3Radio" className="w-4 h-4 rounded-md" />
                        <div className="text-left">
                            <p className="text-white text-[8px] font-bold tracking-wider leading-none">Web3Radio</p>
                            <p className="text-white/50 text-[6px] font-mono mt-0.5 leading-none">webthreeradio.xyz</p>
                        </div>
                    </div>
                </div>

                {/* --- Action Buttons --- */}
                <div className="grid grid-cols-3 gap-3 w-full shrink-0">
                    <button
                        onClick={handleInstagramShare}
                        disabled={isCapturing}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-active:scale-95">
                            {isCapturing ? <Download className="w-5 h-5 text-white animate-bounce" /> : <Instagram className="w-5 h-5 text-white" />}
                        </div>
                        <span className="text-white/70 text-[10px] font-medium">IG Story</span>
                    </button>

                    <button
                        onClick={handleTwitterShare}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-active:scale-95">
                            <Twitter className="w-4 h-4 text-white" fill="currentColor" />
                        </div>
                        <span className="text-white/70 text-[10px] font-medium">X (Twitter)</span>
                    </button>

                    <button
                        onClick={handleCopyLink}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-active:scale-95">
                            <LinkIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white/70 text-[10px] font-medium">Copy Link</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
