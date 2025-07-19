import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const P5Background: React.FC = () => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);

  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      let t = 0;
      let w: number;

      const a = (x: number, y: number) => {
        let k = x / 8 - 12;
        let e = y / 8 - 9;
        let d = p.mag(k, e) ** 2 / 50;
        p.stroke(99 + 99 / p.abs(k) * p.sin(t * 4 + e * e) ** 2, 96);
        let q = x / 3 + e + 60 + 1 / k + k / p.sin(e) * p.sin(d - t);
        let c = d / 4 - t / 8;
        p.point(q * p.sin(c) + 200, (q - y * d / 9) * p.cos(c) + 200);
      };

      p.setup = () => {
        w = 400;
        p.createCanvas(w, w);
      };

      p.draw = () => {
        p.background(6);
        t += p.PI / 90;
        for (let i = 1e4; i--;) {
          a(i % 200, Math.floor(i / 200) << 2);
        }
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
      className="fixed inset-0 w-full h-full opacity-30 pointer-events-none z-0"
      style={{ filter: 'blur(1px)' }}
    />
  );
};

export default P5Background;