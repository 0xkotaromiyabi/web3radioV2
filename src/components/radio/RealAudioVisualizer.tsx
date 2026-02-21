import React, { useEffect, useRef } from 'react';
import { useAudio } from '@/contexts/AudioProvider';

const RealAudioVisualizer = () => {
    const { analyser, isPlaying } = useAudio();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !analyser) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        analyser.fftSize = 64; // Small fftSize for chunky bars
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (isPlaying) {
                analyser.getByteFrequencyData(dataArray);
            } else {
                // Draw flat line when not playing
                dataArray.fill(0);
            }

            const barWidth = (canvas.width / bufferLength) * 1.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                // Normalize the frequency data to canvas height
                barHeight = (dataArray[i] / 255) * canvas.height;

                // Add minimum height for visual presence
                if (barHeight < 2) barHeight = 2;

                // Create gradient
                const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
                gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
                gradient.addColorStop(1, "rgba(255, 255, 255, 0.9)");

                ctx.fillStyle = gradient;

                // Draw bar origin from bottom
                ctx.beginPath();
                ctx.roundRect(x, canvas.height - barHeight, barWidth - 2, barHeight, 2);
                ctx.fill();

                x += barWidth;
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [analyser, isPlaying]);

    return (
        <div className="w-full h-12 flex items-center justify-center mt-2 mb-2 px-4 pointer-events-none">
            <canvas
                ref={canvasRef}
                width={160}
                height={48}
                className="w-full h-full object-contain"
            />
        </div>
    );
};

export default RealAudioVisualizer;
