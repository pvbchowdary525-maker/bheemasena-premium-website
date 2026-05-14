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

  // Draw frame on canvas based on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!loaded || !canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameIndex = Math.min(Math.floor(latest * TOTAL_FRAMES), TOTAL_FRAMES - 1);
    const image = images[frameIndex];

    if (!image) return;

    // Set canvas dimensions to match window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Calculate aspect ratio to cover or contain
    // The prompt says "centered and scaled to fit while preserving aspect ratio", which usually means `contain` for exact matches,
    // but to avoid edges, maybe `cover` or fit carefully. Since background is white, `contain` works perfectly and blends with the page.
    const hRatio = canvas.width / image.width;
    const vRatio = canvas.height / image.height;
    const ratio = Math.min(hRatio, vRatio); // Use Math.min for contain, Math.max for cover

    const centerShift_x = (canvas.width - image.width * ratio) / 2;
    const centerShift_y = (canvas.height - image.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw background color (optional, since page bg is white, but good for canvas)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      centerShift_x,
      centerShift_y,
      image.width * ratio,
      image.height * ratio
    );
  });

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
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {/* Subtle radial glow behind the hero */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-primary/5 rounded-full blur-[100px]"></div>
        </div>

        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />

        {/* Text Overlays - Z-Index above canvas */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 h-full relative">
            
            {/* Beat 1: Hero */}
            <motion.div 
              style={{ opacity: opacityBeat1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center mt-20"
            >
              <h1 className="font-serif text-6xl md:text-8xl font-bold text-gradient-dark mb-6 drop-shadow-sm">
                Hotel Bheemasena
              </h1>
              <p className="font-sans text-xl md:text-2xl font-medium text-foreground mb-4">
                Where every meal feels like a celebration.
              </p>
              <p className="font-sans text-sm md:text-base text-muted max-w-lg">
                Serving the hungry hearts of VIT-AP University — right here in Mandadam.
              </p>
            </motion.div>

            {/* Beat 2: First Bite */}
            <motion.div 
              style={{ opacity: opacityBeat2, y: yBeat2 }}
              className="absolute inset-0 flex flex-col items-start justify-center text-left"
            >
              <div className="max-w-md bg-white/40 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient-dark mb-6">
                  Made with love.<br/>Served with soul.
                </h2>
                <p className="font-sans text-lg text-foreground font-medium mb-4">
                  Every dish at Bheemasena is crafted fresh, packed with flavour, and priced for students who deserve the best.
                </p>
                <p className="font-sans text-base text-muted">
                  From morning tiffins to hearty rice meals — your day starts and ends better here.
                </p>
              </div>
            </motion.div>

            {/* Beat 3: The Feast */}
            <motion.div 
              style={{ opacity: opacityBeat3, y: yBeat3 }}
              className="absolute inset-0 flex flex-col items-end justify-center text-right"
            >
              <div className="max-w-md bg-white/40 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl text-left md:text-right">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient-dark mb-6">
                  A menu built for every craving.
                </h2>
                <ul className="space-y-4 font-sans text-lg text-foreground font-medium">
                  <li className="flex items-center justify-end gap-3">
                    Biryani that hits different after a long lab session. <span className="text-primary text-xl">•</span>
                  </li>
                  <li className="flex items-center justify-end gap-3">
                    Thali plates loaded with variety — rice, curries, dal, pickle, papad. <span className="text-secondary text-xl">•</span>
                  </li>
                  <li className="flex items-center justify-end gap-3">
                    Quick snacks, cold drinks, and chai breaks — we&apos;ve got your whole day. <span className="text-tertiary text-xl">•</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Beat 4: Satisfaction */}
            <motion.div 
              style={{ opacity: opacityBeat4, y: yBeat4 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center mt-32"
            >
              <div className="max-w-2xl bg-white/40 backdrop-blur-md p-10 rounded-3xl border border-white/20 shadow-xl">
                <h2 className="font-serif text-5xl md:text-6xl font-bold text-gradient-dark mb-6">
                  Full stomach.<br/>Happy heart.
                </h2>
                <p className="font-sans text-xl text-foreground font-medium mb-4">
                  Great food shouldn&apos;t cost your whole month&apos;s pocket money. At Bheemasena, you eat well, spend smart, and leave happy — every single time.
                </p>
                <p className="font-sans text-lg text-primary font-semibold">
                  Student-friendly prices. Generous portions. Always fresh. Always hot.
                </p>
              </div>
            </motion.div>

            {/* Beat 5: Final Frame & CTA */}
            <motion.div 
              style={{ opacity: opacityBeat5, y: yBeat5 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center mt-40 pointer-events-auto"
            >
              <div className="max-w-xl bg-white/60 backdrop-blur-xl p-10 rounded-3xl border border-primary/20 shadow-2xl">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient-dark mb-4">
                  Your next favourite meal is waiting.
                </h2>
                <p className="font-sans text-lg text-foreground font-medium mb-8">
                  Hotel Bheemasena, Mandadam — 522237.<br/>Right beside VIT-AP University.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
                  <button className="relative group overflow-hidden rounded-full p-[3px]">
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-100 group-hover:opacity-80 transition-opacity duration-300 shadow-[0_0_20px_rgba(232,129,10,0.6)] group-hover:shadow-[0_0_30px_rgba(232,129,10,0.9)]" />
                    <div className="relative px-8 py-3 bg-gradient-to-r from-primary to-secondary rounded-full transition-colors duration-300">
                      <span className="relative z-10 text-lg font-bold text-white drop-shadow-md">
                        See Our Menu
                      </span>
                    </div>
                  </button>
                  
                  <a href="#" className="font-sans text-lg font-semibold text-secondary hover:text-primary transition-colors underline-offset-4 hover:underline">
                    Get Directions
                  </a>
                </div>
                
                <p className="font-sans text-sm text-muted">
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
