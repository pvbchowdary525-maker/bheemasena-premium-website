"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const TOTAL_FRAMES = 240;

export default function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `/bheemasena-frames/ezgif-frame-${paddedIndex}.jpg`;
      
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setLoaded(true);
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  const renderFrame = (latest: number) => {
    if (!canvasRef.current || images.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameIndex = Math.min(Math.floor(latest * TOTAL_FRAMES), TOTAL_FRAMES - 1);
    const image = images[frameIndex];
    if (!image) return;

    const dpr = window.devicePixelRatio || 1;
    // Set actual size in memory (scaled to account for extra pixel density)
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    // Normalize coordinate system to use css pixels
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    // Draw background color
    ctx.fillStyle = "#FFFAF0";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    
    // Stretch/cover full canvas
    ctx.drawImage(image, 0, 0, window.innerWidth, window.innerHeight);
  };

  useMotionValueEvent(scrollYProgress, "change", renderFrame);

  // Re-render canvas on window resize
  useEffect(() => {
    if (!loaded) return;
    
    // Initial render when loaded
    renderFrame(scrollYProgress.get());
    
    const handleResize = () => {
      renderFrame(scrollYProgress.get());
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, images, scrollYProgress]);

  // Story Beat Opacities
  // 0–15%: Hero / Intro
  const opacityBeat1 = useTransform(scrollYProgress, [0, 0.05, 0.12, 0.15], [1, 1, 1, 0]);
  
  // 15–40%: First Bite
  const opacityBeat2 = useTransform(scrollYProgress, [0.12, 0.15, 0.35, 0.40], [0, 1, 1, 0]);
  const yBeat2 = useTransform(scrollYProgress, [0.12, 0.15], [50, 0]);

  // 40–65%: The Feast
  const opacityBeat3 = useTransform(scrollYProgress, [0.37, 0.40, 0.60, 0.65], [0, 1, 1, 0]);
  const yBeat3 = useTransform(scrollYProgress, [0.37, 0.40], [50, 0]);

  // 65–85%: Satisfaction
  const opacityBeat4 = useTransform(scrollYProgress, [0.62, 0.65, 0.80, 0.85], [0, 1, 1, 0]);
  const yBeat4 = useTransform(scrollYProgress, [0.62, 0.65], [50, 0]);

  // 85–100%: Final Frame
  const opacityBeat5 = useTransform(scrollYProgress, [0.82, 0.85, 0.95, 1], [0, 1, 1, 1]);
  const yBeat5 = useTransform(scrollYProgress, [0.82, 0.85], [50, 0]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "500vh" }}>
      {/* Sticky Canvas Container */}
      <div className="sticky top-0 left-0 w-[100vw] h-[100vh] overflow-hidden m-0 p-0 max-w-none">
        
        {/* Subtle radial glow behind the hero */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-primary/5 rounded-full blur-[100px]"></div>
        </div>

        {/* Set canvas to 100vw and 100vh explicitly via inline styles */}
        <canvas ref={canvasRef} className="absolute inset-0 z-10 block m-0 p-0" style={{ width: "100vw", height: "100vh", maxWidth: "100vw" }} />

        {/* Text Overlays - Z-Index above canvas */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center w-full h-full">
          <div className="w-full max-w-7xl mx-auto h-full relative">
            
            {/* Beat 1: Hero */}
            <motion.div 
              style={{ opacity: opacityBeat1 }}
              className="absolute inset-0 flex flex-col items-center justify-center mt-20"
            >
              <div className="w-[90vw] md:max-w-xl mx-auto p-[16px_20px] md:p-10 rounded-[14px] md:rounded-3xl bg-[rgba(255,248,237,0.85)] md:bg-white/40 backdrop-blur-[10px] md:backdrop-blur-md border border-[rgba(232,129,10,0.20)] shadow-xl text-center pointer-events-auto">
                <h1 className="font-serif font-bold text-gradient-dark mb-4 drop-shadow-sm leading-tight" style={{ fontSize: 'clamp(28px, 7vw, 64px)' }}>
                  Hotel Bheemasena
                </h1>
                <p className="font-sans font-medium text-foreground mb-4" style={{ fontSize: 'clamp(14px, 3.5vw, 18px)' }}>
                  Where every meal feels like a celebration.
                </p>
                <p className="font-sans text-muted" style={{ fontSize: 'clamp(14px, 3.5vw, 16px)' }}>
                  Serving the hungry hearts of VIT-AP University — right here in Mandadam.
                </p>
              </div>
            </motion.div>

            {/* Beat 2: First Bite */}
            <motion.div 
              style={{ opacity: opacityBeat2, y: yBeat2 }}
              className="absolute inset-0 flex flex-col items-center md:items-start justify-center"
            >
              <div className="w-[90vw] md:max-w-md mx-auto md:ml-[10%] p-[16px_20px] md:p-8 rounded-[14px] md:rounded-2xl bg-[rgba(255,248,237,0.85)] md:bg-white/40 backdrop-blur-[10px] md:backdrop-blur-md border border-[rgba(232,129,10,0.20)] shadow-xl text-center md:text-left pointer-events-auto">
                <h2 className="font-serif font-bold text-gradient-dark mb-4 leading-tight" style={{ fontSize: 'clamp(28px, 6vw, 48px)' }}>
                  Made with love.<br/>Served with soul.
                </h2>
                <p className="font-sans text-foreground font-medium mb-4" style={{ fontSize: 'clamp(14px, 3.5vw, 18px)' }}>
                  Every dish at Bheemasena is crafted fresh, packed with flavour, and priced for students who deserve the best.
                </p>
                <p className="font-sans text-muted" style={{ fontSize: 'clamp(14px, 3.5vw, 16px)' }}>
                  From morning tiffins to hearty rice meals — your day starts and ends better here.
                </p>
              </div>
            </motion.div>

            {/* Beat 3: The Feast */}
            <motion.div 
              style={{ opacity: opacityBeat3, y: yBeat3 }}
              className="absolute inset-0 flex flex-col items-center md:items-end justify-center"
            >
              <div className="w-[90vw] md:max-w-md mx-auto md:mr-[10%] p-[16px_20px] md:p-8 rounded-[14px] md:rounded-2xl bg-[rgba(255,248,237,0.85)] md:bg-white/40 backdrop-blur-[10px] md:backdrop-blur-md border border-[rgba(232,129,10,0.20)] shadow-xl text-center md:text-right pointer-events-auto">
                <h2 className="font-serif font-bold text-gradient-dark mb-4 leading-tight" style={{ fontSize: 'clamp(28px, 6vw, 48px)' }}>
                  A menu built for every craving.
                </h2>
                <ul className="space-y-4 font-sans text-foreground font-medium" style={{ fontSize: 'clamp(14px, 3.5vw, 18px)' }}>
                  <li className="flex flex-col md:flex-row items-center justify-center md:justify-end gap-2 md:gap-3">
                    <span>Biryani that hits different after a long lab session.</span> <span className="hidden md:inline text-primary text-xl">•</span>
                  </li>
                  <li className="flex flex-col md:flex-row items-center justify-center md:justify-end gap-2 md:gap-3">
                    <span>Thali plates loaded with variety — rice, curries, dal.</span> <span className="hidden md:inline text-secondary text-xl">•</span>
                  </li>
                  <li className="flex flex-col md:flex-row items-center justify-center md:justify-end gap-2 md:gap-3">
                    <span>Quick snacks, cold drinks, and chai breaks.</span> <span className="hidden md:inline text-tertiary text-xl">•</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Beat 4: Satisfaction */}
            <motion.div 
              style={{ opacity: opacityBeat4, y: yBeat4 }}
              className="absolute inset-0 flex flex-col items-center justify-center mt-32"
            >
              <div className="w-[90vw] md:max-w-2xl mx-auto p-[16px_20px] md:p-10 rounded-[14px] md:rounded-3xl bg-[rgba(255,248,237,0.85)] md:bg-white/40 backdrop-blur-[10px] md:backdrop-blur-md border border-[rgba(232,129,10,0.20)] shadow-xl text-center pointer-events-auto">
                <h2 className="font-serif font-bold text-gradient-dark mb-4 leading-tight" style={{ fontSize: 'clamp(32px, 7vw, 60px)' }}>
                  Full stomach.<br/>Happy heart.
                </h2>
                <p className="font-sans text-foreground font-medium mb-4" style={{ fontSize: 'clamp(14px, 3.5vw, 20px)' }}>
                  Great food shouldn&apos;t cost your whole month&apos;s pocket money. At Bheemasena, you eat well, spend smart, and leave happy — every single time.
                </p>
                <p className="font-sans font-semibold text-primary" style={{ fontSize: 'clamp(14px, 3.5vw, 18px)' }}>
                  Student-friendly prices. Generous portions. Always fresh. Always hot.
                </p>
              </div>
            </motion.div>

            {/* Beat 5: Final Frame & CTA */}
            <motion.div 
              style={{ opacity: opacityBeat5, y: yBeat5 }}
              className="absolute inset-0 flex flex-col items-center justify-center mt-40 pointer-events-auto"
            >
              <div className="w-[90vw] md:max-w-xl mx-auto p-[16px_20px] md:p-10 rounded-[14px] md:rounded-3xl bg-[rgba(255,248,237,0.85)] md:bg-white/60 backdrop-blur-[10px] md:backdrop-blur-xl border border-[rgba(232,129,10,0.20)] shadow-2xl text-center">
                <h2 className="font-serif font-bold text-gradient-dark mb-4 leading-tight" style={{ fontSize: 'clamp(28px, 6vw, 48px)' }}>
                  Your next favourite meal is waiting.
                </h2>
                <p className="font-sans text-foreground font-medium mb-6 md:mb-8" style={{ fontSize: 'clamp(14px, 3.5vw, 18px)' }}>
                  Hotel Bheemasena, Mandadam — 522237.<br/>Right beside VIT-AP University.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-4 md:mb-6">
                  <a href="/order" className="w-full sm:w-auto relative group overflow-hidden rounded-full p-[3px] block">
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-100 group-hover:opacity-80 transition-opacity duration-300 shadow-[0_0_20px_rgba(232,129,10,0.6)] group-hover:shadow-[0_0_30px_rgba(232,129,10,0.9)]" />
                    <div className="relative px-8 py-3 bg-gradient-to-r from-primary to-secondary rounded-full transition-colors duration-300 w-full">
                      <span className="relative z-10 font-bold text-white drop-shadow-md text-base md:text-lg block text-center">
                        See Our Menu
                      </span>
                    </div>
                  </a>
                  
                  <a href="#location" className="font-sans font-semibold text-secondary hover:text-primary transition-colors underline-offset-4 hover:underline" style={{ fontSize: 'clamp(14px, 3.5vw, 18px)' }}>
                    Get Directions
                  </a>
                </div>
                
                <p className="font-sans text-muted" style={{ fontSize: 'clamp(12px, 3vw, 14px)' }}>
                  Open daily. Serving students, faculty, and food lovers since day one.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
