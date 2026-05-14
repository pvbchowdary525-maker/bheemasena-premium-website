"use client";

import { useEffect } from "react";
import { ChevronRight } from "lucide-react";

export default function ScrollSequence() {
  const TOTAL_FRAMES = 240;

  useEffect(() => {
    const frames: HTMLImageElement[] = [];
    let currentFrame = 0;
    let rafPending = false;

    // --- Canvas setup ---
    const canvas = document.getElementById("bheemasena-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ── Canvas sizing (HiDPI / 4K aware) ── */
    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.scale(dpr, dpr);
      ctx!.imageSmoothingEnabled = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ctx as any).imageSmoothingQuality = 'high';
      drawFrame(currentFrame);
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", resizeCanvas);

    /* ── Frame drawing ── */
    function drawFrame(index: number) {
      const img = frames[index];
      if (!img || !img.complete) return;

      const cW = window.innerWidth;
      const cH = window.innerHeight;
      const iAR = img.naturalWidth / img.naturalHeight;
      const cAR = cW / cH;

      ctx!.clearRect(0, 0, cW, cH);
      ctx!.imageSmoothingEnabled = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ctx as any).imageSmoothingQuality = 'high';

      if (window.innerWidth < 768) {
        /* MOBILE — top-anchored: character's face always fully visible,
           food items at bottom may be partially cropped — this is fine  */
        let drawW, drawH, offsetX;
        if (iAR > cAR) {
          drawH = cH;
          drawW = drawH * iAR;
          offsetX = (cW - drawW) / 2;
          ctx!.drawImage(img, offsetX, 0, drawW, drawH);
        } else {
          drawW = cW;
          drawH = drawW / iAR;
          ctx!.drawImage(img, 0, 0, drawW, drawH);
        }
      } else {
        /* DESKTOP — contain: full frame, centered with letterboxing */
        let drawW, drawH, offsetX, offsetY;
        if (iAR > cAR) {
          drawW = cW;
          drawH = cW / iAR;
          offsetX = 0;
          offsetY = (cH - drawH) / 2;
        } else {
          drawH = cH;
          drawW = cH * iAR;
          offsetX = (cW - drawW) / 2;
          offsetY = 0;
        }
        ctx!.drawImage(img, offsetX, offsetY, drawW, drawH);
      }
    }

    /* ── Beat visibility logic ── */
    const beatConfig = [
      { id: 'beat-1', start: 0.00, end: 0.15 },
      { id: 'beat-2', start: 0.15, end: 0.40 },
      { id: 'beat-3', start: 0.40, end: 0.65 },
      { id: 'beat-4', start: 0.65, end: 0.85 },
      { id: 'beat-5', start: 0.85, end: 1.01 },
    ];

    function updateBeats(progress: number) {
      beatConfig.forEach(({ id, start, end }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const visible = progress >= start && progress < end;
        if (visible) {
          el.classList.add('visible');
        } else {
          el.classList.remove('visible');
        }
      });
    }

    /* ── Scroll handler (RAF-throttled) ── */
    function onScroll() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;

        const track = document.getElementById("scroll-track");
        if (!track) return;
        
        const trackTop = track.getBoundingClientRect().top;
        const totalScroll = track.offsetHeight - window.innerHeight;
        const scrolled = Math.max(0, -trackTop);
        const progress = Math.min(scrolled / totalScroll, 1); // 0.0 → 1.0

        const frameIndex = Math.min(
          Math.floor(progress * TOTAL_FRAMES),
          TOTAL_FRAMES - 1
        );
        if (frameIndex !== currentFrame) {
          currentFrame = frameIndex;
          drawFrame(currentFrame);
        }

        updateBeats(progress);
      });
    }
    
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ── Preload all 240 frames ── */
    let loaded = 0;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(3, "0");
      img.src = `/bheemasena-frames/ezgif-frame-${num}.jpg`;
      img.onload = () => {
        loaded++;
        if (loaded === 1) {
          resizeCanvas();
          drawFrame(0);
        }
      };
      frames[i - 1] = img;
    }
    
    // Initial calls
    onScroll();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("orientationchange", resizeCanvas);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .beat {
          position: absolute;
          width: 90%;
          max-width: 560px;
          padding: 24px 28px;
          background: transparent;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          border: none;
          box-shadow: none;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.45s ease, transform 0.45s ease;
          box-sizing: border-box;
        }
        .beat.visible {
          opacity: 1;
          pointer-events: auto;
        }

        /* Beat-specific positions and enter directions */
        #beat-1 {
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          text-align: center;
        }
        #beat-1.visible { transform: translateX(-50%) translateY(0); }

        #beat-2 {
          top: 50%;
          left: 4%;
          transform: translateY(-50%) translateX(-30px);
        }
        #beat-2.visible { transform: translateY(-50%) translateX(0); }

        #beat-3 {
          top: 50%;
          right: 4%;
          left: auto;
          transform: translateY(-50%) translateX(30px);
        }
        #beat-3.visible { transform: translateY(-50%) translateX(0); }

        #beat-4 {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.96);
          text-align: center;
        }
        #beat-4.visible { transform: translate(-50%, -50%) scale(1); }

        #beat-5 {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) translateY(20px);
          text-align: center;
        }
        #beat-5.visible { transform: translate(-50%, -50%) translateY(0); }

        /* Typography inside beats */
        .beat-headline {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: clamp(22px, 5.5vw, 44px);
          color: #1A0A00;
          line-height: 1.15;
          margin: 0 0 10px 0;
          text-shadow: 0 2px 12px rgba(255, 248, 237, 0.60), 0 1px 4px rgba(26, 10, 0, 0.25);
        }
        .beat-headline.saffron { color: #E8810A; }

        .beat-sub {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(13px, 3vw, 16px);
          color: rgba(26, 10, 0, 0.68);
          line-height: 1.65;
          margin: 0 0 8px 0;
          text-shadow: 0 1px 8px rgba(255, 248, 237, 0.55), 0 1px 3px rgba(26, 10, 0, 0.20);
        }

        .beat-micro {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(11px, 2.5vw, 13px);
          color: rgba(26, 10, 0, 0.45);
          line-height: 1.5;
          margin: 0;
          text-shadow: 0 1px 8px rgba(255, 248, 237, 0.55), 0 1px 3px rgba(26, 10, 0, 0.20);
        }

        .beat-point {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(13px, 3vw, 15px);
          color: rgba(26, 10, 0, 0.72);
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 10px;
          line-height: 1.5;
        }

        .beat-point span {
          text-shadow: 0 1px 8px rgba(255, 248, 237, 0.55), 0 1px 3px rgba(26, 10, 0, 0.20);
        }

        .beat-btn-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 22px;
        }
        .btn-primary {
          background: linear-gradient(135deg, #E8810A, #C0392B);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 13px 26px;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: clamp(13px, 3vw, 15px);
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }
        .btn-secondary {
          border: 1.5px solid #E8810A;
          color: #E8810A;
          background: transparent;
          border-radius: 12px;
          padding: 13px 26px;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: clamp(13px, 3vw, 15px);
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }

        #bheemasena-canvas {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
      `}} />

      <section
        id="scroll-track"
        style={{
          position: "relative",
          height: "500vh",
          width: "100%",
          background: "#131313", // Fallback dark background
        }}
      >
        <div
          id="sticky-stage"
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <canvas
            id="bheemasena-canvas"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
            }}
          ></canvas>

          <div
            id="text-overlays"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            {/* Beat 1 — HERO */}
            <div id="beat-1" className="beat">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/bheemasena-logo.jpeg" 
                alt="Bheemasena Logo" 
                style={{ 
                  height: "64px", 
                  width: "auto", 
                  objectFit: "contain", 
                  display: "block", 
                  margin: "0 auto 16px auto"
                }} 
              />
              <p className="beat-headline">Hotel Bheemasena</p>
              <p className="beat-sub" style={{ color: "#E8810A", fontWeight: 600, fontSize: "clamp(15px, 3.5vw, 20px)" }}>
                Where every meal feels like a celebration.
              </p>
              <p className="beat-micro">
                Serving the hungry hearts of VIT-AP University — right here in Mandadam.
              </p>
            </div>

            {/* Beat 2 — FIRST BITE */}
            <div id="beat-2" className="beat">
              <p className="beat-headline saffron">Made with love.<br/>Served with soul.</p>
              <p className="beat-sub">
                Every dish at Bheemasena is crafted fresh, packed with flavour, and priced for students who deserve the best.
              </p>
              <p className="beat-sub">
                From morning tiffins to hearty rice meals — your day starts and ends better here.
              </p>
            </div>

            {/* Beat 3 — THE FEAST */}
            <div id="beat-3" className="beat">
              <p className="beat-headline">A menu built for<br/>every craving.</p>
              <div className="beat-point">
                <ChevronRight size={16} color="#E8810A" className="flex-shrink-0 mt-[2px]" />
                <span>Biryani that hits different after a long lab session.</span>
              </div>
              <div className="beat-point">
                <ChevronRight size={16} color="#E8810A" className="flex-shrink-0 mt-[2px]" />
                <span>Thali plates loaded with rice, curries, dal, pickle, and papad.</span>
              </div>
              <div className="beat-point">
                <ChevronRight size={16} color="#E8810A" className="flex-shrink-0 mt-[2px]" />
                <span>Quick snacks, cold drinks, and chai — we&apos;ve got your whole day.</span>
              </div>
            </div>

            {/* Beat 4 — SATISFACTION */}
            <div id="beat-4" className="beat">
              <p className="beat-headline">Full stomach.<br/>Happy heart.</p>
              <p className="beat-sub">
                Great food shouldn&apos;t cost your whole month&apos;s pocket money. At Bheemasena, you eat well, spend smart, and leave happy — every single time.
              </p>
              <p className="beat-sub" style={{ color: "#E8810A", fontWeight: 600 }}>
                Student-friendly prices. Generous portions. Always fresh. Always hot.
              </p>
            </div>

            {/* Beat 5 — CTA */}
            <div id="beat-5" className="beat">
              <p className="beat-headline">Your next favourite<br/>meal is waiting.</p>
              <p className="beat-micro" style={{ fontSize: "clamp(12px, 3vw, 14px)", color: "rgba(26,10,0,0.55)", marginBottom: "4px" }}>
                Hotel Bheemasena, Mandadam — 522237. Right beside VIT-AP University.
              </p>
              <div className="beat-btn-row">
                <a href="/order" className="btn-primary">See Our Menu</a>
                <a href="https://maps.google.com/?q=Bheemasena+family+restaurant+amaravati" target="_blank" rel="noopener noreferrer" className="btn-secondary">Get Directions</a>
              </div>
              <p className="beat-micro" style={{ marginTop: "14px" }}>
                Open daily. Serving students, faculty, and food lovers since day one.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
