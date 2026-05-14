"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

export default function ScrollSequence() {
  const TOTAL_FRAMES = 240;
  const [loaderOpacity, setLoaderOpacity] = useState(1);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);

  useEffect(() => {
    const frames: HTMLImageElement[] = [];
    let currentFrame = 0;
    let rafPending = false;

    // --- Canvas setup ---
    const canvas = document.getElementById("bheemasena-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: false, alpha: false });
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

    /* ── Preload Lazy Queue ── */
    function loadFrame(i: number) {
      const img = new Image();
      const num = String(i).padStart(3, '0');
      img.src = `/bheemasena-frames/ezgif-frame-${num}.jpg`;
      img.onload = () => {
        img.decode().catch(() => {}); // decode async, ignore errors
        if (i === 1) {
          resizeCanvas();
          drawFrame(0);
          setLoaderOpacity(0);
          setTimeout(() => setIsLoaderVisible(false), 500);
          // Wave 2
          setTimeout(() => {
            for (let j = 11; j <= TOTAL_FRAMES; j++) loadFrame(j);
          }, 100);
        }
      };
      frames[i - 1] = img;
    }

    // Wave 1
    for (let i = 1; i <= 10; i++) loadFrame(i);
    
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
      {isLoaderVisible && (
        <div id="loader" style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "#FDF6E3",
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
              width: "100%", 
              background: "linear-gradient(90deg, #E8810A, #C0392B)", 
              borderRadius: "999px",
              animation: "loadPulse 1.5s infinite ease-in-out" 
            }}></div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes loadPulse {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .beat {
          position: absolute;
          background: rgba(253, 246, 227, 0.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(232, 129, 10, 0.18);
          box-shadow: 0 4px 24px rgba(232, 129, 10, 0.08);
          border-radius: 18px;
          padding: 24px 28px;
          width: 90%;
          max-width: 560px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.45s ease, transform 0.45s ease;
          box-sizing: border-box;
          z-index: 10;
        }
        
        @media (max-width: 767px) {
          .beat {
            background: rgba(253, 246, 227, 0.82);
            padding: 18px 20px;
            border-radius: 14px;
            width: 88%;
          }
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
        }
        .beat-headline.saffron { color: #C05E00; }

        .beat-sub {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(13px, 3vw, 16px);
          color: rgba(26, 10, 0, 0.72);
          line-height: 1.65;
          margin: 0 0 8px 0;
        }

        .beat-micro {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(11px, 2.5vw, 13px);
          color: rgba(26, 10, 0, 0.50);
          line-height: 1.5;
          margin: 0;
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
          color: rgba(26, 10, 0, 0.72);
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
          opacity: 0.55;
          transition: opacity 0.3s ease;
        }

        #canvas-vignette {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          z-index: 2;
          pointer-events: none;
          background: radial-gradient(
            ellipse at center,
            transparent 40%,
            rgba(253, 246, 227, 0.35) 75%,
            rgba(253, 246, 227, 0.65) 100%
          );
        }

        .myth-symbol {
          position: absolute;
          pointer-events: none;
          user-select: none;
          z-index: 3;
          opacity: 0.08;
          fill: none;
          stroke: #E8810A;
          stroke-width: 2;
        }

        .myth-symbol-filled {
          position: absolute;
          pointer-events: none;
          user-select: none;
          z-index: 3;
          opacity: 0.08;
          fill: #E8810A;
        }

        .myth-lotus { opacity: 0.10; stroke: #C0392B; stroke-width: 2; }
      `}} />

      {/* Decorative top border above the scrollytelling */}
      <div style={{ width: "100%", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "#FDF6E3", position: "relative", zIndex: 10 }}>
        {/* Diya separator */}
        <svg viewBox="0 0 100 100" style={{ height: "32px", opacity: 0.30, fill: "#E8810A" }} className="myth-symbol-filled relative">
          <path d="M50 0 C80 40 80 80 50 100 C20 80 20 40 50 0 M30 100 L70 100 L70 110 L30 110 Z" />
        </svg>
      </div>

      <section
        id="scroll-track"
        style={{
          position: "relative",
          height: "500vh",
          width: "100%",
          background: "#141414", // Fallback dark background
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
            background: "#141414",
          }}
        >
          {/* Lotus top left */}
          <svg viewBox="0 0 100 100" className="myth-symbol myth-lotus" style={{ top: "20px", left: "20px", width: "60px", height: "60px" }}>
            <path d="M50 95 C20 95 5 70 5 50 C25 35 40 45 50 60 C60 45 75 35 95 50 C95 70 80 95 50 95 M50 95 C30 75 25 35 50 5 C75 35 70 75 50 95" />
          </svg>

          {/* Lotus top right */}
          <svg viewBox="0 0 100 100" className="myth-symbol myth-lotus" style={{ top: "20px", right: "20px", width: "60px", height: "60px" }}>
            <path d="M50 95 C20 95 5 70 5 50 C25 35 40 45 50 60 C60 45 75 35 95 50 C95 70 80 95 50 95 M50 95 C30 75 25 35 50 5 C75 35 70 75 50 95" />
          </svg>

          {/* Gada left center */}
          <svg viewBox="0 0 100 300" className="myth-symbol-filled" style={{ left: "10px", top: "50%", transform: "translateY(-50%)", height: "clamp(80px, 15vw, 180px)", width: "auto" }}>
            <path d="M40 280 L60 280 L60 220 C80 200 90 150 90 100 C90 50 60 20 50 0 C40 20 10 50 10 100 C10 150 20 200 40 220 Z" />
          </svg>

          {/* Conch bottom right */}
          <svg viewBox="0 0 100 100" className="myth-symbol-filled" style={{ bottom: "20px", right: "20px", width: "80px", height: "80px" }}>
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
                  height: "60px", 
                  width: "auto", 
                  objectFit: "contain", 
                  display: "block", 
                  margin: "0 auto 14px auto"
                }} 
              />
              <p className="beat-headline">Hotel Bheemasena</p>
              <p className="beat-sub" style={{ color: "#B85E00", fontWeight: 700, fontSize: "clamp(16px, 3.5vw, 22px)" }}>
                Where every meal feels like a celebration.
              </p>
              <p className="beat-sub">
                Nestled in Mandadam, steps away from VIT-AP University — Bheemasena has been the heart of student hunger since day one. Every plate tells a story. Every bite feels like home.
              </p>
              <p className="beat-micro">
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
              <p className="beat-micro">
                Freshly cooked &nbsp;·&nbsp; No preservatives &nbsp;·&nbsp; Made to order
              </p>
            </div>

            {/* Beat 3 — THE FEAST */}
            <div id="beat-3" className="beat">
              <p className="beat-headline">A menu built<br/>for every craving.</p>
              <div className="beat-point">
                <ChevronRight size={16} color="#E8810A" className="flex-shrink-0 mt-[2px]" />
                <span><strong>Biryani</strong> — slow-cooked, aromatic, the real deal. Not fast food biryani.</span>
              </div>
              <div className="beat-point">
                <ChevronRight size={16} color="#E8810A" className="flex-shrink-0 mt-[2px]" />
                <span><strong>Thali</strong> — unlimited rice, 3 curries, dal, rasam, pickle, papad, and dessert.</span>
              </div>
              <div className="beat-point">
                <ChevronRight size={16} color="#E8810A" className="flex-shrink-0 mt-[2px]" />
                <span><strong>Tiffins</strong> — idli, vada, dosa, upma, pongal. Breakfast done right.</span>
              </div>
              <div className="beat-point">
                <ChevronRight size={16} color="#E8810A" className="flex-shrink-0 mt-[2px]" />
                <span><strong>Snacks &amp; Chai</strong> — mirchi bajji, bonda, samosa. Perfect between lectures.</span>
              </div>
              <div className="beat-point">
                <ChevronRight size={16} color="#E8810A" className="flex-shrink-0 mt-[2px]" />
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
              <p className="beat-micro" style={{ color: "#B85E00", fontWeight: 600 }}>
                Thali from ₹60 &nbsp;·&nbsp; Biryani from ₹80 &nbsp;·&nbsp; Tiffin from ₹30
              </p>
            </div>

            {/* Beat 5 — CTA */}
            <div id="beat-5" className="beat">
              <p className="beat-headline">Your next favourite<br/>meal is waiting.</p>
              <p className="beat-sub">
                Come hungry. Leave happy. Bheemasena is not just a restaurant — it is a VIT-AP institution. Join thousands of students who call this place their second canteen, their comfort, their home away from home.
              </p>
              <p className="beat-micro">
                Hotel Bheemasena &nbsp;·&nbsp; Mandadam – 522237 &nbsp;·&nbsp; Beside VIT-AP University
              </p>
              <div className="beat-btn-row">
                <a href="/order" className="btn-primary">Order Now</a>
                <a href="https://maps.google.com/?q=Bheemasena+family+restaurant+amaravati" target="_blank" rel="noopener noreferrer" className="btn-secondary">Get Directions</a>
              </div>
              <p className="beat-micro" style={{ marginTop: "12px" }}>
                Open daily · Breakfast, Lunch &amp; Dinner · Dine-in &amp; Takeaway
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Decorative bottom border */}
      <div style={{ width: "100%", height: "24px", background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"24\" viewBox=\"0 0 40 24\"><path d=\"M20 0 L40 12 L20 24 L0 12 Z\" fill=\"none\" stroke=\"rgba(232, 129, 10, 0.25)\" stroke-width=\"1\"/></svg>') repeat-x center", zIndex: 10, position: "relative" }}></div>
    </>
  );
}
