"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const TOTAL_FRAMES = 240;

const BEATS = [
  { id: 'beat1', start: 0.00, end: 0.15, enterFrom: 'translateY(40px)' },
  { id: 'beat2', start: 0.15, end: 0.40, enterFrom: 'translateX(-40px)' },
  { id: 'beat3', start: 0.40, end: 0.65, enterFrom: 'translateX(40px)' },
  { id: 'beat4', start: 0.65, end: 0.85, enterFrom: 'translateY(40px)' },
  { id: 'beat5', start: 0.85, end: 1.05, enterFrom: 'translateY(40px)' },
];

export default function ScrollSequence() {
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

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

  useEffect(() => {
    if (!loaded || images.length === 0) return;

    const canvas = canvasRef.current;
    const scrollTrack = scrollTrackRef.current;
    if (!canvas || !scrollTrack) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawFrame = (frameIndex: number) => {
      const img = images[frameIndex];
      if (!img) return;

      const dpr = window.devicePixelRatio || 1;
      const canvasW = window.innerWidth;
      const canvasH = window.innerHeight;

      // Ensure canvas pixel size is correct for retina
      if (canvas.width !== canvasW * dpr || canvas.height !== canvasH * dpr) {
        canvas.width = canvasW * dpr;
        canvas.height = canvasH * dpr;
        ctx.scale(dpr, dpr);
      }

      ctx.fillStyle = "#FFFAF0";
      ctx.fillRect(0, 0, canvasW, canvasH);

      const isMobile = canvasW < 768;
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = canvasW / canvasH;

      let drawW, drawH, offsetX, offsetY;

      if (isMobile) {
        if (imgAspect > canvasAspect) {
          // Image is wider than canvas — scale by height, crop sides
          drawH = canvasH;
          drawW = drawH * imgAspect;
          offsetX = (canvasW - drawW) / 2; // center horizontally
          offsetY = 0; // anchor to TOP — keeps character's head visible
        } else {
          // Image is taller than canvas — scale by width, crop bottom
          drawW = canvasW;
          drawH = drawW / imgAspect;
          offsetX = 0;
          offsetY = 0; // anchor to TOP — character's head always in frame
        }
      } else {
        if (imgAspect > canvasAspect) {
          drawW = canvasW;
          drawH = drawW / imgAspect;
          offsetX = 0;
          offsetY = (canvasH - drawH) / 2; // vertically centered
        } else {
          drawH = canvasH;
          drawW = canvasH * imgAspect;
          offsetX = (canvasW - drawW) / 2; // horizontally centered
          offsetY = 0;
        }
      }

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    };

    const updateTextOverlays = (progress: number) => {
      BEATS.forEach(beat => {
        const el = document.getElementById(beat.id);
        if (!el) return;
        const visible = progress >= beat.start && progress < beat.end;
        
        el.style.opacity = visible ? '1' : '0';
        el.style.pointerEvents = visible ? 'auto' : 'none';
        el.style.transform = visible ? 'translateX(0) translateY(0)' : beat.enterFrom;
      });
    };

    const onScrollOrResize = () => {
      const rect = scrollTrack.getBoundingClientRect();
      const totalScrollable = scrollTrack.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(scrolled / totalScrollable, 1);

      const frameIndex = Math.min(
        Math.floor(progress * TOTAL_FRAMES),
        TOTAL_FRAMES - 1
      );
      
      drawFrame(frameIndex);
      updateTextOverlays(progress);
    };

    // Initial draw
    onScrollOrResize();

    window.addEventListener("scroll", onScrollOrResize);
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("orientationchange", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("orientationchange", onScrollOrResize);
    };
  }, [loaded, images]);

  return (
    <div ref={scrollTrackRef} id="scroll-track" style={{ height: "500vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        
        <canvas 
          ref={canvasRef} 
          id="bheemasena-canvas"
          style={{ width: "100vw", height: "100vh", display: "block", position: "absolute", top: 0, left: 0, zIndex: 1 }} 
        />
        
        <div id="text-overlays" style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }}>
          
          {/* Beat 1 */}
          <div 
            id="beat1" 
            style={{ 
              position: "absolute", 
              bottom: "30%", 
              left: "50%", 
              marginLeft: "-45vw", 
              width: "90vw", 
              maxWidth: "600px", 
              transform: "translateX(50%)", 
              transition: "opacity 0.4s ease, transform 0.4s ease",
              opacity: 0 
            }}
            className="md:ml-[-300px] md:left-[50%]"
          >
            <div style={{ 
              background: "rgba(255,248,237,0.82)", 
              backdropFilter: "blur(12px)", 
              borderRadius: "16px", 
              padding: "24px 28px", 
              textAlign: "center" 
            }}>
              <h1 style={{ fontSize: "clamp(32px, 8vw, 72px)", fontWeight: 800, color: "#1A0A00", lineHeight: 1.1, margin: "0 0 16px 0" }}>
                Hotel Bheemasena
              </h1>
              <p style={{ fontSize: "clamp(16px, 4vw, 24px)", color: "#E8810A", fontWeight: 600, margin: "0 0 12px 0" }}>
                Where every meal feels like a celebration.
              </p>
              <p style={{ fontSize: "clamp(13px, 3vw, 16px)", color: "rgba(26,10,0,0.60)", margin: 0 }}>
                Serving the hungry hearts of VIT-AP University — right here in Mandadam.
              </p>
            </div>
          </div>

          {/* Beat 2 */}
          <div 
            id="beat2" 
            style={{ 
              position: "absolute", 
              top: "50%", 
              left: "5vw", 
              marginTop: "-15vh", 
              width: "90vw", 
              maxWidth: "450px", 
              transition: "opacity 0.4s ease, transform 0.4s ease",
              opacity: 0 
            }}
            className="md:left-[10vw]"
          >
            <div style={{ 
              background: "rgba(255,248,237,0.82)", 
              backdropFilter: "blur(12px)", 
              borderRadius: "16px", 
              padding: "24px 28px" 
            }}>
              <h2 style={{ fontSize: "clamp(28px, 6vw, 42px)", color: "#E8810A", fontWeight: 800, margin: "0 0 16px 0", lineHeight: 1.2 }}>
                Made with love.<br/>Served with soul.
              </h2>
              <p style={{ fontSize: "16px", color: "#1A0A00", fontWeight: 500, margin: "0 0 12px 0", lineHeight: 1.5 }}>
                Every dish at Bheemasena is crafted fresh, packed with flavour, and priced for students who deserve the best.
              </p>
              <p style={{ fontSize: "16px", color: "#1A0A00", fontWeight: 500, margin: 0, lineHeight: 1.5 }}>
                From morning tiffins to hearty rice meals — your day starts and ends better here.
              </p>
            </div>
          </div>

          {/* Beat 3 */}
          <div 
            id="beat3" 
            style={{ 
              position: "absolute", 
              top: "50%", 
              right: "5vw", 
              marginTop: "-15vh", 
              width: "90vw", 
              maxWidth: "450px", 
              transition: "opacity 0.4s ease, transform 0.4s ease",
              opacity: 0 
            }}
            className="md:right-[10vw]"
          >
            <div style={{ 
              background: "rgba(255,248,237,0.82)", 
              backdropFilter: "blur(12px)", 
              borderRadius: "16px", 
              padding: "24px 28px" 
            }}>
              <h2 style={{ fontSize: "clamp(28px, 6vw, 42px)", color: "#1A0A00", fontWeight: 800, margin: "0 0 20px 0", lineHeight: 1.2 }}>
                A menu built for every craving.
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ display: "flex", alignItems: "flex-start", gap: "8px", margin: 0, color: "#1A0A00", fontWeight: 500 }}>
                  <ChevronRight size={20} color="#E8810A" className="mt-0.5 flex-shrink-0" />
                  <span>Biryani that hits different after a long lab session.</span>
                </p>
                <p style={{ display: "flex", alignItems: "flex-start", gap: "8px", margin: 0, color: "#1A0A00", fontWeight: 500 }}>
                  <ChevronRight size={20} color="#E8810A" className="mt-0.5 flex-shrink-0" />
                  <span>Thali plates loaded with rice, curries, dal, pickle, and papad.</span>
                </p>
                <p style={{ display: "flex", alignItems: "flex-start", gap: "8px", margin: 0, color: "#1A0A00", fontWeight: 500 }}>
                  <ChevronRight size={20} color="#E8810A" className="mt-0.5 flex-shrink-0" />
                  <span>Quick snacks, cold drinks, and chai breaks — we&apos;ve got your whole day.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Beat 4 */}
          <div 
            id="beat4" 
            style={{ 
              position: "absolute", 
              top: "50%", 
              left: "50%", 
              marginLeft: "-45vw", 
              marginTop: "-15vh", 
              width: "90vw", 
              maxWidth: "600px", 
              transition: "opacity 0.4s ease, transform 0.4s ease",
              opacity: 0 
            }}
            className="md:ml-[-300px]"
          >
            <div style={{ 
              background: "rgba(255,248,237,0.82)", 
              backdropFilter: "blur(12px)", 
              borderRadius: "16px", 
              padding: "32px", 
              textAlign: "center" 
            }}>
              <h2 style={{ fontSize: "clamp(32px, 7vw, 48px)", color: "#1A0A00", fontWeight: 800, margin: "0 0 16px 0", lineHeight: 1.2 }}>
                Full stomach.<br/>Happy heart.
              </h2>
              <p style={{ fontSize: "16px", color: "#1A0A00", fontWeight: 500, margin: "0 0 16px 0", lineHeight: 1.5 }}>
                Great food shouldn&apos;t cost your whole month&apos;s pocket money. At Bheemasena, you eat well, spend smart, and leave happy — every single time.
              </p>
              <p style={{ fontSize: "18px", color: "#E8810A", fontWeight: 700, margin: 0, lineHeight: 1.5 }}>
                Student-friendly prices. Generous portions. Always fresh. Always hot.
              </p>
            </div>
          </div>

          {/* Beat 5 */}
          <div 
            id="beat5" 
            style={{ 
              position: "absolute", 
              top: "50%", 
              left: "50%", 
              marginLeft: "-45vw", 
              marginTop: "-20vh", 
              width: "90vw", 
              maxWidth: "600px", 
              transition: "opacity 0.4s ease, transform 0.4s ease",
              opacity: 0 
            }}
            className="md:ml-[-300px]"
          >
            <div style={{ 
              background: "rgba(255,248,237,0.82)", 
              backdropFilter: "blur(12px)", 
              borderRadius: "16px", 
              padding: "40px 32px", 
              textAlign: "center" 
            }}>
              <h2 style={{ fontSize: "clamp(36px, 8vw, 56px)", color: "#1A0A00", fontWeight: 800, margin: "0 0 16px 0", lineHeight: 1.1 }}>
                Your next favourite meal is waiting.
              </h2>
              <p style={{ fontSize: "18px", color: "rgba(26,10,0,0.60)", fontWeight: 500, margin: "0 0 32px 0", lineHeight: 1.5 }}>
                Hotel Bheemasena, Mandadam — 522237. Right beside VIT-AP University.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/order" className="w-full sm:w-auto block">
                  <button className="w-full sm:min-w-[200px] h-[52px] rounded-full bg-gradient-to-r from-[#E8810A] to-[#C0392B] text-white font-bold text-[16px] shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center pointer-events-auto">
                    See Our Menu
                  </button>
                </Link>
                <Link href="#location" className="w-full sm:w-auto block">
                  <button className="w-full sm:min-w-[200px] h-[52px] rounded-full border-[2px] border-[#E8810A] text-[#E8810A] font-bold text-[16px] hover:bg-[#E8810A]/10 transition-colors flex items-center justify-center pointer-events-auto">
                    Get Directions
                  </button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
