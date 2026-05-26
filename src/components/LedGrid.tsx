import { useEffect, useRef } from 'react';

export default function LedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId = 0;
    const dots: { x: number; y: number; phase: number }[] = [];
    const spacing = 48;
    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      dots.length = 0;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      for (let x = spacing / 2; x < w; x += spacing) {
        for (let y = spacing / 2; y < h; y += spacing) {
          dots.push({ x, y, phase: Math.random() * Math.PI * 2 });
        }
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = (time: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const t = time * 0.001;
      for (const dot of dots) {
        const alpha = 0.08 + 0.12 * (0.5 + 0.5 * Math.sin(t * 1.5 + dot.phase));
        ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-60"
      aria-hidden
    />
  );
}
