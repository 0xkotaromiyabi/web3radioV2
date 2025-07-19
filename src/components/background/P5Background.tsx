import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const P5Background: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);

  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      let t = 0;
      let w: number, h: number;

      const a = (x: number, y: number) => {
        let k: number, e: number;
        let d = p.mag(k = x / 8 - w/16, e = y / 8 - h/16) ** 2 / 50;
        p.stroke(99 + 99 / p.abs(k || 0.1) * p.sin(t * 4 + e * e) ** 2, 96);
        let q = x / 3 + e + 60 + 1 / (k || 0.1) + (k || 0.1) / p.sin(e || 0.1) * p.sin(d - t);
        let c = d / 4 - t / 8;
        p.point(q * p.sin(c) + w/2, (q - y * d / 9) * p.cos(c) + h/2);
      };

      p.setup = () => {
        w = p.windowWidth;
        h = p.windowHeight;
        p.createCanvas(w, h);
        p.strokeWeight(1);
      };

      p.draw = () => {
        p.background(6);
        t += p.PI / 90;
        
        // Scale the loop based on screen size
        const iterations = Math.floor((w * h) / 16);
        const gridW = Math.floor(w / 2);
        const gridH = Math.floor(h / 2);
        
        for (let i = iterations; i--;) {
          a(i % gridW, Math.floor(i / gridW) % gridH);
        }
      };

      p.windowResized = () => {
        w = p.windowWidth;
        h = p.windowHeight;
        p.resizeCanvas(w, h);
      };
    };

    p5Instance.current = new p5(sketch, sketchRef.current);

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
    };
  }, []);

  return (
    <div 
      ref={sketchRef} 
      className="fixed inset-0 w-full h-full opacity-40 pointer-events-none z-0"
    />
  );
};

export default P5Background;