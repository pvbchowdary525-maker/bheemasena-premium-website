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
      const isMobile = window.innerWidth < 768;
      const cssW = window.innerWidth;
      const cssH = isMobile ? window.innerHeight * 0.6 : window.innerHeight;

      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
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

      const isMobile = window.innerWidth < 768;
      const cssW = window.innerWidth;
      const cssH = isMobile ? window.innerHeight * 0.6 : window.innerHeight;

      const iAR = img.naturalWidth / img.naturalHeight;
      const cAR = cssW / cssH;

      ctx!.clearRect(0, 0, cssW, cssH);
      ctx!.imageSmoothingEnabled = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ctx as any).imageSmoothingQuality = 'high';

      if (isMobile) {
        let drawW, drawH, offsetX;
        if (iAR > cAR) {
          drawH = cssH;
          drawW = drawH * iAR;
          offsetX = (cssW - drawW) / 2;
          ctx!.drawImage(img, offsetX, 0, drawW, drawH);
        } else {
          drawW = cssW;
          drawH = drawW / iAR;
          ctx!.drawImage(img, 0, 0, drawW, drawH);
        }
      } else {
        /* DESKTOP — contain: full frame, centered with letterboxing */
        let drawW, drawH, offsetX, offsetY;
        if (iAR > cAR) {
          drawW = cssW;
          drawH = cssW / iAR;
          offsetX = 0;
          offsetY = (cssH - drawH) / 2;
        } else {
          drawH = cssH;
          drawW = cssH * iAR;
          offsetX = (cssW - drawW) / 2;
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
    const firstImg = new Image();
    const firstNum = String(1).padStart(3, "0");
    firstImg.src = `/bheemasena-frames/ezgif-frame-${firstNum}.jpg`;
    firstImg.onload = () => {
      resizeCanvas();
      drawFrame(0);
    };
    frames[0] = firstImg;

    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(3, "0");
      img.src = `/bheemasena-frames/ezgif-frame-${num}.jpg`;
      frames[i - 1] = img;
    }
    
    // Initial calls
    resizeCanvas();
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
          width: auto;
          max-width: 380px;
          padding: 0;
          background: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          border: none;
          box-shadow: none;
          border-radius: 0;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.45s ease, transform 0.45s ease;
          box-sizing: border-box;
        }
        .beat.visible {
          opacity: 1;
          pointer-events: auto;
        }

        @media (min-width: 768px) {
          .beat::before {
            content: '';
            position: absolute;
            inset: -12px -16px;
            background: rgba(253, 246, 227, 0.55);
            filter: blur(18px);
            border-radius: 16px;
            z-index: -1;
            pointer-events: none;
          }
        }

        /* Desktop specific positions */
        #beat-1 {
          top: 8%;
          left: 50%;
          transform: translateX(-50%) translateY(-10px);
          text-align: center;
          max-width: 500px;
        }
        #beat-1.visible { transform: translateX(-50%) translateY(0); }

        #beat-2 {
          top: 50%;
          left: 3%;
          transform: translateY(-50%) translateX(-20px);
          text-align: left;
          max-width: 340px;
        }
        #beat-2.visible { transform: translateY(-50%) translateX(0); }

        #beat-3 {
          top: 50%;
          right: 3%;
          left: auto;
          transform: translateY(-50%) translateX(20px);
          text-align: right;
          max-width: 340px;
        }
        #beat-3.visible { transform: translateY(-50%) translateX(0); }
        #beat-3 .beat-point { flex-direction: row-reverse; }

        #beat-4 {
          bottom: 6%;
          left: 3%;
          transform: translateY(10px);
          text-align: left;
          max-width: 400px;
        }
        #beat-4.visible { transform: translateY(0); }

        #beat-5 {
          bottom: 4%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          text-align: center;
          max-width: 480px;
        }
        #beat-5.visible { transform: translateX(-50%) translateY(0); }

        /* Typography inside beats (Desktop base) */
        .beat-headline {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: clamp(24px, 4.5vw, 46px);
          color: #1A0A00;
          line-height: 1.15;
          margin: 0 0 10px 0;
          text-shadow:
            0 0 20px rgba(253, 246, 227, 0.95),
            0 0 40px rgba(253, 246, 227, 0.80),
            0 0 60px rgba(253, 246, 227, 0.60),
            0 2px 4px rgba(253, 246, 227, 0.90);
        }
        .beat-headline.saffron {
          color: #B85E00;
          text-shadow:
            0 0 20px rgba(253, 246, 227, 0.95),
            0 0 40px rgba(253, 246, 227, 0.80),
            0 2px 4px rgba(253, 246, 227, 0.90);
        }

        .beat-sub {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(13px, 2.2vw, 15px);
          color: #2C1200;
          line-height: 1.65;
          margin: 0 0 8px 0;
          text-shadow:
            0 0 16px rgba(253, 246, 227, 0.98),
            0 0 32px rgba(253, 246, 227, 0.85),
            0 1px 3px rgba(253, 246, 227, 0.95);
        }

        .beat-micro {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(11px, 1.8vw, 13px);
          color: rgba(44, 18, 0, 0.70);
          line-height: 1.5;
          margin: 0;
          text-shadow:
            0 0 14px rgba(253, 246, 227, 0.98),
            0 0 28px rgba(253, 246, 227, 0.85);
        }

        .beat-point {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(12px, 2vw, 14px);
          color: #2C1200;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 10px;
          line-height: 1.5;
          text-shadow:
            0 0 16px rgba(253, 246, 227, 0.98),
            0 0 32px rgba(253, 246, 227, 0.85);
        }

        /* Buttons stay solid */
        .beat-btn-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 18px;
        }
        .btn-primary {
          background: linear-gradient(135deg, #E8810A, #C0392B);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 13px 26px;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: clamp(13px, 2.5vw, 15px);
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 4px 16px rgba(232, 129, 10, 0.40);
        }
        .btn-secondary {
          border: 1.5px solid #E8810A;
          color: #B85E00;
          background: rgba(253, 246, 227, 0.70);
          border-radius: 12px;
          padding: 13px 26px;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: clamp(13px, 2.5vw, 15px);
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }

        #bheemasena-canvas {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }

        /* ── MOBILE SPLIT-SCREEN LAYOUT ── */
        @media (max-width: 767px) {
          #sticky-stage {
            display: flex !important;
            flex-direction: column !important;
          }

          #bheemasena-canvas {
            position: relative !important;
            width: 100vw !important;
            height: 60vh !important;
            flex-shrink: 0 !important;
            z-index: 1 !important;
          }

          #text-overlays {
            position: relative !important;
            width: 100% !important;
            height: 40vh !important;
            flex-shrink: 0 !important;
            background: #FDF6E3 !important;
            border-top: 2px solid rgba(232, 129, 10, 0.15) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 10 !important;
            overflow: hidden !important;
          }

          .beat {
            position: absolute;
            top: 50% !important;
            left: 50% !important;
            bottom: auto !important;
            right: auto !important;
            transform: translate(-50%, -50%) translateY(10px) !important;
            width: 92vw !important;
            max-width: 92vw !important;
            text-align: center !important;
            padding: 0 16px !important;
          }
          .beat.visible {
            transform: translate(-50%, -50%) translateY(0) !important;
          }

          #beat-3 .beat-point {
            flex-direction: row;
            justify-content: center;
            text-align: center;
          }

          /* Text pill styles for mobile */
          .beat-headline {
            font-size: clamp(22px, 6vw, 32px);
            text-shadow: none !important;
            color: #1A0A00 !important;
            background: rgba(253, 246, 227, 0.80);
            border-radius: 6px;
            padding: 3px 10px;
            display: inline-block;
            margin-bottom: 8px;
          }
          .beat-headline.saffron {
            color: #B85E00 !important;
          }

          .beat-sub {
            font-size: clamp(13px, 3.5vw, 15px);
            text-shadow: none !important;
            color: rgba(26, 10, 0, 0.72) !important;
            background: rgba(253, 246, 227, 0.70);
            border-radius: 4px;
            padding: 2px 8px;
            display: inline-block;
            margin-bottom: 6px;
          }

          .beat-micro {
            font-size: clamp(11px, 3vw, 13px);
            text-shadow: none !important;
            color: rgba(26, 10, 0, 0.50) !important;
            background: rgba(253, 246, 227, 0.65);
            border-radius: 4px;
            padding: 2px 6px;
            display: inline-block;
            margin-bottom: 6px;
          }

          .beat-point {
            font-size: clamp(12px, 3.2vw, 14px);
            text-shadow: none !important;
            justify-content: center;
          }
          .beat-point span {
            background: rgba(253, 246, 227, 0.70);
            border-radius: 4px;
            padding: 2px 6px;
            display: inline;
          }

          .beat-btn-row {
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }
        }
      `}} />

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
                  height: "60px", 
                  width: "auto", 
                  objectFit: "contain", 
                  display: "block", 
                  margin: "0 auto 14px auto"
                }} 
              />
              <p className="beat-headline">Hotel Bheemasena</p>
              <p className="beat-sub" style={{ fontWeight: 600, fontSize: "clamp(15px, 3.5vw, 20px)" }}>
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
              <p className="beat-sub" style={{ fontWeight: 600 }}>
                Student-friendly prices. Generous portions. Always fresh. Always hot.
              </p>
            </div>

            {/* Beat 5 — CTA */}
            <div id="beat-5" className="beat">
              <p className="beat-headline">Your next favourite<br/>meal is waiting.</p>
              <p className="beat-micro" style={{ fontSize: "clamp(12px, 3vw, 14px)", marginBottom: "4px" }}>
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
