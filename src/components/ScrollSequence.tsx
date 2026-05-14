"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

export default function ScrollSequence() {
  const TOTAL_FRAMES = 240;
  const [loaderOpacity, setLoaderOpacity] = useState(1);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [loadedFramesCount, setLoadedFramesCount] = useState(0);
  const [stageHeight, setStageHeight] = useState("100vh");
  const [trackHeight, setTrackHeight] = useState("500vh");

  useEffect(() => {
    setStageHeight(`${window.innerHeight}px`);
    setTrackHeight(`${window.innerHeight * 5}px`);

    const frames: HTMLImageElement[] = [];
    let targetFrame = 0;
    let interpolatedFrame = 0;
    let lastDrawnFrame = -1;
    let loopRafId: number;
    let cachedTrackTop = 0;
    let cachedTotalScroll = 0;
    let lastProgress = -1;

    function cacheLayout() {
      const track = document.getElementById("scroll-track");
      if (!track) return;
      const rect = track.getBoundingClientRect();
      cachedTrackTop = window.scrollY + rect.top;
      cachedTotalScroll = track.offsetHeight - window.innerHeight;
    }

    // --- Canvas setup ---
    const canvas = document.getElementById("bheemasena-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    // @ts-expect-error - desynchronized is a valid property but not in all TS definitions
    const ctx = canvas.getContext("2d", { willReadFrequently: false, alpha: false, desynchronized: true });
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
      lastDrawnFrame = -1;
      drawFrame(Math.round(interpolatedFrame));
      cacheLayout();
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
        /* MOBILE — top-anchored: character's face always fully visible */
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

    /* ── Scroll handler (target update only) ── */
    function onScroll() {
      if (cachedTotalScroll === 0) cacheLayout(); // Initial fallback
      
      const scrolled = Math.max(0, window.scrollY - cachedTrackTop);
      const progress = Math.min(scrolled / cachedTotalScroll, 1); // 0.0 → 1.0

      targetFrame = Math.min(
        Math.floor(progress * TOTAL_FRAMES),
        TOTAL_FRAMES - 1
      );

      if (Math.abs(progress - lastProgress) > 0.001) {
        lastProgress = progress;
        updateBeats(progress);
      }
    }
    
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ── Animation Loop (Lerp) ── */
    function renderLoop() {
      interpolatedFrame += (targetFrame - interpolatedFrame) * 0.18;
      const newFrame = Math.round(interpolatedFrame);

      if (newFrame !== lastDrawnFrame) {
        lastDrawnFrame = newFrame;
        drawFrame(newFrame);
      }
      loopRafId = requestAnimationFrame(renderLoop);
    }
    loopRafId = requestAnimationFrame(renderLoop);

    /* ── Preload Lazy Queue (4 Waves) ── */
    function loadFrame(i: number) {
      const img = new Image();
      img.loading = "eager";
      const num = String(i).padStart(3, '0');
      img.src = `/bheemasena-frames/ezgif-frame-${num}.jpg`;
      img.onload = () => {
        setLoadedFramesCount(prev => prev + 1);
        img.decode().catch(() => {}); // decode async, ignore errors
        if (i === 1) {
          resizeCanvas();
          lastDrawnFrame = 0;
          drawFrame(0);
          setLoaderOpacity(0);
          setTimeout(() => setIsLoaderVisible(false), 500);
          
          // Wave 2: frames 2-20 right after frame 1
          for (let j = 2; j <= 20; j++) loadFrame(j);
          
          // Wave 3: frames 21-100 after 300ms
          setTimeout(() => {
            for (let j = 21; j <= 100; j++) loadFrame(j);
          }, 300);
          
          // Wave 4: frames 101-240 after 800ms
          setTimeout(() => {
            for (let j = 101; j <= TOTAL_FRAMES; j++) loadFrame(j);
          }, 800);
        }
      };
      frames[i - 1] = img;
    }

    // Wave 1
    loadFrame(1);
    
    // Initial calls
    cacheLayout();
    onScroll();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("orientationchange", resizeCanvas);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(loopRafId);
    };
  }, []);

  return (
    <>
      {isLoaderVisible && (
        <div id="loader" style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "#050505",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "16px",
          opacity: loaderOpacity,
          transition: "opacity 0.5s ease"
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bheemasena-logo.jpeg" height="64" style={{ height: "64px", width: "auto" }} alt="Hotel Bheemasena" />
          <p style={{ fontFamily: "'Poppins', sans-serif", color: "#E8810A", fontWeight: 600, fontSize: "15px" }}>
            Preparing your feast...
          </p>
          <div style={{ width: "160px", height: "3px", background: "rgba(232,129,10,0.20)", borderRadius: "999px", overflow: "hidden" }}>
            <div id="loader-bar" style={{ 
              height: "100%", 
              width: `${Math.max(5, (loadedFramesCount / TOTAL_FRAMES) * 100)}%`, 
              background: "linear-gradient(90deg, #E8810A, #C0392B)", 
              borderRadius: "999px",
              transition: "width 0.2s ease-out" 
            }}></div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .beat {
          position: absolute;
          width: 90%;
          max-width: 640px;
          min-height: 400px;
          padding: 0;
          opacity: 0;
          pointer-events: none;
          transform: translateY(60px);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
          z-index: 10;
        }
        
        .beat.visible {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }

        /* Staggered children animation for award-winning feel */
        .beat > * {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .beat.visible > * {
          opacity: 1;
          transform: translateY(0);
        }
        .beat.visible > *:nth-child(1) { transition-delay: 0.1s; }
        .beat.visible > *:nth-child(2) { transition-delay: 0.2s; }
        .beat.visible > *:nth-child(3) { transition-delay: 0.3s; }
        .beat.visible > *:nth-child(4) { transition-delay: 0.4s; }
        .beat.visible > *:nth-child(5) { transition-delay: 0.5s; }
        .beat.visible > *:nth-child(6) { transition-delay: 0.6s; }

        /* Beat-specific positions */
        #beat-1 {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) translateY(60px);
          text-align: center;
        }
        #beat-1.visible { transform: translate(-50%, -50%) translateY(0); }

        #beat-2 {
          top: 50%;
          left: 6%;
          transform: translateY(-50%) translateX(-40px);
          max-width: 520px;
        }
        #beat-2.visible { transform: translateY(-50%) translateX(0); }

        #beat-3 {
          top: 50%;
          right: 6%;
          left: auto;
          transform: translateY(-50%) translateX(40px);
          text-align: right;
          max-width: 520px;
        }
        #beat-3.visible { transform: translateY(-50%) translateX(0); }
        #beat-3 .beat-point { flex-direction: row-reverse; }

        #beat-4 {
          top: 65%;
          left: 6%;
          transform: translateY(-50%) translateY(40px);
          max-width: 520px;
        }
        #beat-4.visible { transform: translateY(-50%) translateY(0); }

        #beat-5 {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) translateY(60px);
          text-align: center;
        }
        #beat-5.visible { transform: translate(-50%, -50%) translateY(0); }

        @media (max-width: 767px) {
          #beat-2, #beat-3, #beat-4 {
            top: 50%;
            left: 50%;
            right: auto;
            text-align: center;
            transform: translate(-50%, -50%) translateY(40px);
            width: 90%;
            max-width: 100%;
          }
          #beat-2.visible, #beat-3.visible, #beat-4.visible {
            transform: translate(-50%, -50%) translateY(0);
          }
          #beat-3 .beat-point {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .beat-point {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .beat-point svg {
            display: none;
          }
        }

        /* Typography inside beats */
        .beat-headline {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: clamp(36px, 8vw, 72px);
          color: #FDF6E3;
          line-height: 1.05;
          margin: 0 0 16px 0;
          text-shadow: 0 4px 32px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.6);
        }
        .beat-headline.saffron { color: #E8810A; }

        .beat-sub {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(16px, 3.5vw, 24px);
          color: rgba(253, 246, 227, 0.85);
          line-height: 1.6;
          margin: 0 0 12px 0;
          text-shadow: 0 2px 16px rgba(0,0,0,0.8);
        }

        .beat-micro {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(12px, 2.5vw, 15px);
          color: rgba(253, 246, 227, 0.60);
          line-height: 1.5;
          margin: 0;
          text-shadow: 0 2px 8px rgba(0,0,0,0.8);
        }

        .beat-point {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(14px, 3vw, 18px);
          color: rgba(253, 246, 227, 0.85);
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-top: 16px;
          line-height: 1.5;
          text-shadow: 0 2px 16px rgba(0,0,0,0.8);
        }

        .beat-point span {
          color: rgba(253, 246, 227, 0.85);
        }

        .beat-btn-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 36px;
        }
        .btn-primary {
          background: linear-gradient(135deg, #E8810A, #C0392B);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 16px 32px;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: clamp(14px, 3vw, 16px);
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 8px 32px rgba(232, 129, 10, 0.30);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(232, 129, 10, 0.40);
        }
        .btn-secondary {
          border: 1.5px solid rgba(253, 246, 227, 0.8);
          color: #FDF6E3;
          background: rgba(0,0,0,0.2);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          padding: 16px 32px;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: clamp(14px, 3vw, 16px);
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s ease;
        }
        .btn-secondary:hover {
          background: rgba(253, 246, 227, 0.1);
        }

        #bheemasena-canvas {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          opacity: 0.25;
          transition: opacity 0.5s ease;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        #canvas-vignette {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          z-index: 2;
          pointer-events: none;
          background: radial-gradient(
            ellipse at center,
            transparent 10%,
            rgba(0, 0, 0, 0.7) 60%,
            rgba(0, 0, 0, 0.95) 100%
          );
        }

        .myth-symbol {
          position: absolute;
          pointer-events: none;
          user-select: none;
          z-index: 3;
          opacity: 0.04;
          fill: none;
          stroke: #E8810A;
          stroke-width: 2;
        }

        .myth-symbol-filled {
          position: absolute;
          pointer-events: none;
          user-select: none;
          z-index: 3;
          opacity: 0.04;
          fill: #E8810A;
        }
      `}} />

      {/* Decorative top border above the scrollytelling */}
      <div style={{ width: "100%", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "#050505", position: "relative", zIndex: 10 }}>
        {/* Diya separator */}
        <svg viewBox="0 0 100 100" style={{ height: "32px", opacity: 0.20, fill: "#E8810A" }} className="myth-symbol-filled relative">
          <path d="M50 0 C80 40 80 80 50 100 C20 80 20 40 50 0 M30 100 L70 100 L70 110 L30 110 Z" />
        </svg>
      </div>

      <section
        id="scroll-track"
        style={{
          position: "relative",
          height: trackHeight,
          width: "100%",
          background: "#050505", 
        }}
      >
        <div
          id="sticky-stage"
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            width: "100vw",
            height: stageHeight,
            overflow: "hidden",
            background: "#050505",
            willChange: "transform",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Lotus top left */}
          <svg viewBox="0 0 100 100" className="myth-symbol" style={{ top: "20px", left: "20px", width: "80px", height: "80px" }}>
            <path d="M50 95 C20 95 5 70 5 50 C25 35 40 45 50 60 C60 45 75 35 95 50 C95 70 80 95 50 95 M50 95 C30 75 25 35 50 5 C75 35 70 75 50 95" />
          </svg>

          {/* Lotus top right */}
          <svg viewBox="0 0 100 100" className="myth-symbol" style={{ top: "20px", right: "20px", width: "80px", height: "80px" }}>
            <path d="M50 95 C20 95 5 70 5 50 C25 35 40 45 50 60 C60 45 75 35 95 50 C95 70 80 95 50 95 M50 95 C30 75 25 35 50 5 C75 35 70 75 50 95" />
          </svg>

          {/* Gada left center */}
          <svg viewBox="0 0 100 300" className="myth-symbol-filled" style={{ left: "20px", top: "50%", transform: "translateY(-50%)", height: "clamp(120px, 20vw, 240px)", width: "auto" }}>
            <path d="M40 280 L60 280 L60 220 C80 200 90 150 90 100 C90 50 60 20 50 0 C40 20 10 50 10 100 C10 150 20 200 40 220 Z" />
          </svg>

          {/* Conch bottom right */}
          <svg viewBox="0 0 100 100" className="myth-symbol-filled" style={{ bottom: "20px", right: "20px", width: "100px", height: "100px" }}>
            <path d="M30 90 C10 70 10 30 50 10 C90 30 90 70 70 90 C60 110 40 110 30 90 M50 10 C60 30 60 60 40 70" fill="none" stroke="#E8810A" strokeWidth="4" />
            <path d="M30 90 C10 70 10 30 50 10 C90 30 90 70 70 90 C60 110 40 110 30 90 Z" opacity="0.5" />
          </svg>

          <canvas
            id="bheemasena-canvas"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
              willChange: "transform",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          ></canvas>

          <div id="canvas-vignette"></div>

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
                  height: "80px", 
                  width: "auto", 
                  objectFit: "contain", 
                  display: "block", 
                  margin: "0 auto 24px auto",
                  borderRadius: "8px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.6)"
                }} 
              />
              <p className="beat-headline">Hotel Bheemasena</p>
              <p className="beat-sub" style={{ color: "#E8810A", fontWeight: 700 }}>
                Where every meal feels like a celebration.
              </p>
              <p className="beat-sub">
                Nestled in Mandadam, steps away from VIT-AP University — Bheemasena has been the heart of student hunger since day one. Every plate tells a story. Every bite feels like home.
              </p>
              <p className="beat-micro" style={{ marginTop: "24px", letterSpacing: "1px", textTransform: "uppercase" }}>
                Mandadam – 522237 &nbsp;·&nbsp; Open daily &nbsp;·&nbsp; Breakfast to Dinner
              </p>
            </div>

            {/* Beat 2 — FIRST BITE */}
            <div id="beat-2" className="beat">
              <p className="beat-headline saffron">Made with love.<br/>Served with soul.</p>
              <p className="beat-sub">
                Every morning our kitchen fires up before sunrise. Fresh ingredients, handpicked daily. No shortcuts, no compromise — just the kind of food your grandmother would approve of.
              </p>
              <p className="beat-sub">
                From piping hot idlis at 7am to satisfying rice meals at noon — Bheemasena fuels your whole day, every day.
              </p>
              <p className="beat-micro" style={{ marginTop: "24px", letterSpacing: "1px", textTransform: "uppercase" }}>
                Freshly cooked &nbsp;·&nbsp; No preservatives &nbsp;·&nbsp; Made to order
              </p>
            </div>

            {/* Beat 3 — THE FEAST */}
            <div id="beat-3" className="beat">
              <p className="beat-headline">A menu built<br/>for every craving.</p>
              <div className="beat-point">
                <ChevronRight size={24} color="#E8810A" className="flex-shrink-0 mt-[2px]" />
                <span><strong>Biryani</strong> — slow-cooked, aromatic, the real deal. Not fast food biryani.</span>
              </div>
              <div className="beat-point">
                <ChevronRight size={24} color="#E8810A" className="flex-shrink-0 mt-[2px]" />
                <span><strong>Thali</strong> — unlimited rice, 3 curries, dal, rasam, pickle, papad, and dessert.</span>
              </div>
              <div className="beat-point">
                <ChevronRight size={24} color="#E8810A" className="flex-shrink-0 mt-[2px]" />
                <span><strong>Tiffins</strong> — idli, vada, dosa, upma, pongal. Breakfast done right.</span>
              </div>
              <div className="beat-point">
                <ChevronRight size={24} color="#E8810A" className="flex-shrink-0 mt-[2px]" />
                <span><strong>Snacks &amp; Chai</strong> — mirchi bajji, bonda, samosa. Perfect between lectures.</span>
              </div>
              <div className="beat-point">
                <ChevronRight size={24} color="#E8810A" className="flex-shrink-0 mt-[2px]" />
                <span><strong>Specials</strong> — rotating weekly dishes, seasonal curries, festival sweets.</span>
              </div>
            </div>

            {/* Beat 4 — SATISFACTION */}
            <div id="beat-4" className="beat">
              <p className="beat-headline">Full stomach.<br/>Happy heart.</p>
              <p className="beat-sub">
                A student&apos;s budget is precious. At Bheemasena, a full, satisfying meal costs less than your coffee. We believe good food is a right, not a luxury.
              </p>
              <p className="beat-sub">
                Generous portions. Honest prices. The same warmth whether you are a fresher on your first day or a final-year regular who has eaten here a thousand times.
              </p>
              <p className="beat-micro" style={{ color: "#E8810A", fontWeight: 600, fontSize: "clamp(14px, 3vw, 18px)", marginTop: "24px" }}>
                Thali from ₹60 &nbsp;·&nbsp; Biryani from ₹80 &nbsp;·&nbsp; Tiffin from ₹30
              </p>
            </div>

            {/* Beat 5 — CTA */}
            <div id="beat-5" className="beat">
              <p className="beat-headline">Your next favourite<br/>meal is waiting.</p>
              <p className="beat-sub">
                Come hungry. Leave happy. Bheemasena is not just a restaurant — it is a VIT-AP institution. Join thousands of students who call this place their second canteen, their comfort, their home away from home.
              </p>
              <p className="beat-micro" style={{ marginTop: "16px", letterSpacing: "1px", textTransform: "uppercase" }}>
                Hotel Bheemasena &nbsp;·&nbsp; Mandadam – 522237 &nbsp;·&nbsp; Beside VIT-AP University
              </p>
              <div className="beat-btn-row">
                <a href="/order" className="btn-primary">Order Now</a>
                <a href="https://maps.google.com/?q=Bheemasena+family+restaurant+amaravati" target="_blank" rel="noopener noreferrer" className="btn-secondary">Get Directions</a>
              </div>
              <p className="beat-micro" style={{ marginTop: "32px", opacity: 0.6 }}>
                Open daily · Breakfast, Lunch &amp; Dinner · Dine-in &amp; Takeaway
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Decorative bottom border */}
      <div style={{ width: "100%", height: "24px", background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"24\" viewBox=\"0 0 40 24\"><path d=\"M20 0 L40 12 L20 24 L0 12 Z\" fill=\"none\" stroke=\"rgba(232, 129, 10, 0.25)\" stroke-width=\"1\"/></svg>') repeat-x center", zIndex: 10, position: "relative", backgroundColor: "#050505" }}></div>
    </>
  );
}
