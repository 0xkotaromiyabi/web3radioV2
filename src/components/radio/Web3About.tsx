import React, { useEffect, useRef } from 'react';
import logo from '@/assets/web3radio-logo.png';
import { Radio, Calendar, Smartphone, Users } from 'lucide-react';

// Pure Canvas 2D metaball animation — no external dependencies
const useMetaball = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        let mouse = { x: 0.5, y: 0.5 };

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        };
        resize();
        window.addEventListener('resize', resize);

        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = (e.clientX - rect.left) / rect.width;
            mouse.y = (e.clientY - rect.top) / rect.height;
        };
        window.addEventListener('mousemove', onMouseMove);

        let t = 0;
        const draw = () => {
            t += 0.008;
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            // Define metaballs
            const balls = [
                { x: 0.12 * w, y: 0.15 * h, r: Math.min(w, h) * 0.30 },
                { x: 0.88 * w, y: 0.82 * h, r: Math.min(w, h) * 0.25 },
                { x: (0.45 + Math.sin(t) * 0.28) * w, y: (0.5 + Math.cos(t * 0.7) * 0.3) * h, r: Math.min(w, h) * 0.14 },
                { x: (0.55 + Math.cos(t * 0.9) * 0.25) * w, y: (0.45 + Math.sin(t * 1.1) * 0.22) * h, r: Math.min(w, h) * 0.11 },
                { x: mouse.x * w, y: mouse.y * h, r: Math.min(w, h) * 0.09 },
            ];

            // Draw each ball as a radial gradient "blob"
            for (const b of balls) {
                const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
                grad.addColorStop(0, 'rgba(255,255,255,0.22)');
                grad.addColorStop(0.55, 'rgba(255,255,255,0.06)');
                grad.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            }

            // Subtle connections between nearby balls
            for (let i = 0; i < balls.length; i++) {
                for (let j = i + 1; j < balls.length; j++) {
                    const a = balls[i], b = balls[j];
                    const dx = b.x - a.x, dy = b.y - a.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = (a.r + b.r) * 1.1;
                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.08;
                        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
                        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
                        grad.addColorStop(1, `rgba(255,255,255,${alpha})`);
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = grad;
                        ctx.lineWidth = (a.r + b.r) * 0.12 * (1 - dist / maxDist);
                        ctx.stroke();
                    }
                }
            }

            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [canvasRef]);
};

const Web3About = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useMetaball(canvasRef);

    return (
        <div className="relative w-full min-h-[120vh] md:min-h-[140vh] nexus-grain overflow-hidden flex flex-col items-center py-24 px-6 md:px-12 bg-transparent">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-100" style={{ width: '100%', height: '100%' }} />

            <div className="relative z-10 w-full max-w-5xl space-y-32">

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center space-y-12">
                    <div className="flex items-center gap-4 opacity-70">
                        <img src={logo} alt="Web3Radio" className="w-10 h-10 rounded-xl" />
                        <span className="nexus-mono text-[10px]">Web3Radio</span>
                    </div>

                    <h2 className="nexus-heading text-4xl md:text-7xl lg:text-8xl text-white max-w-4xl tracking-tighter">
                        Redefining Radio for the Digital Age
                    </h2>

                    <div className="nexus-mono text-[10px] text-white/40 space-y-1">
                        <p>Broadcasting Status • Online</p>
                        <p>A new frequency is emerging</p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
                    <div className="space-y-8">
                        <p className="nexus-mono text-[10px] text-white/30 font-bold tracking-[0.3em]">+ ABOUT</p>
                        <p className="nexus-heading text-xl md:text-2xl text-white/90 leading-relaxed font-light">
                            Web3Radio is an innovative audio platform where community and technology meet.
                        </p>
                        <p className="nexus-heading text-lg text-white/60 leading-relaxed font-light">
                            We provide a space for broadcasters and listeners to connect through a transparent and decentralized network — making radio more interactive, rewarding, and accessible to everyone.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <p className="nexus-mono text-[10px] text-white/30 font-bold tracking-[0.3em]">+ FEATURES</p>
                        <ul className="space-y-8">
                            {[
                                { icon: Radio, name: "Radio Hub", desc: "Explore a diverse range of curated stations and musical genres." },
                                { icon: Calendar, name: "Exclusive Events", desc: "Stay informed with the latest news and Web3-exclusive gatherings." },
                                { icon: Smartphone, name: "Rental Access", desc: "Unique opportunities to interact with specialized station resources." },
                                { icon: Users, name: "Community Power", desc: "A platform where listeners help shape the future of the network." }
                            ].map((item, i) => (
                                <li key={i} className="group flex gap-4 cursor-default">
                                    <div className="mt-0.5 w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-all duration-300">
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="nexus-mono text-[11px] text-white block mb-1">{item.name}</span>
                                        <span className="nexus-heading text-sm text-white/40 block leading-snug">{item.desc}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Footer info */}
                <div className="pt-24 flex flex-col md:flex-row justify-between items-end gap-12 border-t border-white/5 pb-12">
                    <div className="space-y-4">
                        <p className="nexus-mono text-[10px] text-white/30">+ CONNECT</p>
                        <a href="mailto:hi@webthreeradio.xyz" className="nexus-heading text-2xl md:text-3xl text-white hover:text-white/50 transition-colors border-b border-transparent hover:border-white/20 pb-1">
                            hi@webthreeradio.xyz
                        </a>
                    </div>

                    <div className="text-right nexus-mono text-[9px] text-white/20">
                        <p>BROADCASTING STATUS • ONLINE</p>
                        <p>THE FUTURE OF RADIO IS HERE</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Web3About;
