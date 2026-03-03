import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import logo from '@/assets/web3radio-logo.png';
import { Radio, Calendar, Smartphone, Users } from 'lucide-react';

const Web3About = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        // --- Shader Source ---
        const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

        const fragmentShader = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      varying vec2 vUv;

      float smin(float a, float b, float k) {
        float h = max(k - abs(a - b), 0.0) / k;
        return min(a, b) - h * h * k * 0.25;
      }

      float sdSphere(vec3 p, float r) {
        return length(p) - r;
      }

      float sceneSDF(vec3 p) {
        float t = uTime * 0.5;
        
        // Static background spheres
        float s1 = sdSphere(p - vec3(-1.5, 0.8, 0.0), 1.2);
        float s2 = sdSphere(p - vec3(1.5, -0.8, 0.0), 1.0);
        
        // Animated spheres
        vec3 p1 = vec3(sin(t) * 1.5, cos(t * 0.7) * 0.8, sin(t * 0.5) * 0.5);
        float d1 = sdSphere(p - p1, 0.5);
        
        vec3 p2 = vec3(cos(t * 0.8) * 1.2, sin(t * 1.1) * 0.6, cos(t * 0.4) * 0.4);
        float d2 = sdSphere(p - p2, 0.4);

        // Mouse influence
        vec3 mPos = vec3((uMouse.x - 0.5) * 4.0, (uMouse.y - 0.5) * 2.5, 0.2);
        float dMouse = sdSphere(p - mPos, 0.35);

        float res = smin(s1, s2, 0.8);
        res = smin(res, d1, 0.6);
        res = smin(res, d2, 0.6);
        res = smin(res, dMouse, 0.7);
        
        return res;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
        vec3 ro = vec3(uv * 1.5, -1.5);
        vec3 rd = vec3(0.0, 0.0, 1.0);
        
        float t = 0.0;
        for(int i = 0; i < 40; i++) {
          vec3 p = ro + rd * t;
          float d = sceneSDF(p);
          if(d < 0.001 || t > 10.0) break;
          t += d * 0.8;
        }
        
        vec3 color = vec3(0.05); // Dark background
        if(t < 10.0) {
          vec3 p = ro + rd * t;
          vec3 n = normalize(vec3(
            sceneSDF(p + vec3(0.01, 0.0, 0.0)) - sceneSDF(p - vec3(0.01, 0.0, 0.0)),
            sceneSDF(p + vec3(0.0, 0.01, 0.0)) - sceneSDF(p - vec3(0.0, 0.01, 0.0)),
            sceneSDF(p + vec3(0.0, 0.0, 0.01)) - sceneSDF(p - vec3(0.0, 0.0, 0.01))
          ));
          
          float diff = dot(n, normalize(vec3(1.0, 1.0, -1.0))) * 0.5 + 0.5;
          float fresnel = pow(1.0 - max(0.0, dot(n, -rd)), 2.5);
          
          color = mix(vec3(0.02, 0.02, 0.03), vec3(1.0), fresnel * 0.4);
          color += diff * 0.05;
        }

        gl_FragColor = vec4(color, 1.0);
      }
    `;

        // --- Init Three.js ---
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(width, height) },
                uMouse: { value: new THREE.Vector2(0.5, 0.5) }
            },
            vertexShader,
            fragmentShader
        });

        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(mesh);

        let animationId: number;
        const animate = (time: number) => {
            material.uniforms.uTime.value = time * 0.001;
            renderer.render(scene, camera);
            animationId = requestAnimationFrame(animate);
        };
        animate(0);

        const handleMouseMove = (e: MouseEvent) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                material.uniforms.uMouse.value.x = (e.clientX - rect.left) / rect.width;
                material.uniforms.uMouse.value.y = 1.0 - (e.clientY - rect.top) / rect.height;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        const handleResize = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            renderer.setSize(w, h);
            material.uniforms.uResolution.value.set(w, h);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full min-h-[120vh] md:min-h-[140vh] nexus-grain overflow-hidden flex flex-col items-center py-24 px-6 md:px-12">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />

            {/* Nexus UI Components */}
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
                        <p className="font-nexus text-xl md:text-2xl text-white/90 leading-relaxed font-light">
                            Web3Radio is an innovative audio platform where community and technology meet.
                        </p>
                        <p className="font-nexus text-lg text-white/60 leading-relaxed font-light">
                            We provide a space for broadcasters and listeners to connect through a transparent and decentralized network — making radio more interactive, rewarding, and accessible to everyone.
                        </p>
                    </div>

                    <div className="space-y-12">
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
                                            <span className="font-nexus text-sm text-white/40 block leading-snug">{item.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer info */}
                <div className="pt-24 flex flex-col md:flex-row justify-between items-end gap-12 border-t border-white/5">
                    <div className="space-y-2">
                        <p className="nexus-mono text-[10px] text-white/30">+ CONNECT</p>
                        <a href="mailto:hi@webthreeradio.xyz" className="font-nexus text-2xl md:text-3xl text-white hover:text-white/50 transition-colors">hi@webthreeradio.xyz</a>
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
