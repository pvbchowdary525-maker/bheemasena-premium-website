"use client";

import { useEffect } from "react";
import Link from "next/link";
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

    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx!.setTransform(1, 0, 0, 1, 0, 0); // reset any previous scale
      ctx!.scale(dpr, dpr);
      drawFrame(currentFrame); // redraw after resize
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", resizeCanvas);
    resizeCanvas();

    // --- Frame drawing ---
    function drawFrame(index: number) {
      const img = frames[index];
      if (!img || !img.complete) return;

      const cW = window.innerWidth;
      const cH = window.innerHeight;
      const iW = img.naturalWidth;
      const iH = img.naturalHeight;
      const imgAspect = iW / iH;
      const canvasAspect = cW / cH;

      ctx!.clearRect(0, 0, cW, cH);
      
      // 4K Canvas Quality Settings
      ctx!.imageSmoothingEnabled = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ctx as any).imageSmoothingQuality = 'high';

      if (window.innerWidth < 768) {
        // MOBILE: top-anchored crop — character always visible at top
        let drawW, drawH, offsetX;
        if (imgAspect > canvasAspect) {
          drawH = cH;
          drawW = drawH * imgAspect;
          offsetX = (cW - drawW) / 2;
          ctx!.drawImage(img, offsetX, 0, drawW, drawH);
        } else {
          drawW = cW;
          drawH = drawW / imgAspect;
          ctx!.drawImage(img, 0, 0, drawW, drawH);
        }
      } else {
        // DESKTOP: contain — show full frame centered
        let drawW, drawH, offsetX, offsetY;
        if (imgAspect > canvasAspect) {
          drawW = cW;
          drawH = cW / imgAspect;
          offsetX = 0;
          offsetY = (cH - drawH) / 2;
        } else {
          drawH = cH;
          drawW = cH * imgAspect;
          offsetX = (cW - drawW) / 2;
          offsetY = 0;
        }
        ctx!.drawImage(img, offsetX, offsetY, drawW, drawH);
      }
    }

    const beatConfig = [
      { id: 'beat-1', start: 0.00, end: 0.15 },
      { id: 'beat-2', start: 0.15, end: 0.40 },
      { id: 'beat-3', start: 0.40, end: 0.65 },
      { id: 'beat-4', start: 0.65, end: 0.85 },
      { id: 'beat-5', start: 0.85, end: 1.00 },
    ];

    function updateBeats(progress: number) {
      beatConfig.forEach(({ id, start, end }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const visible = progress >= start && progress < end;
        el.classList.toggle('visible', visible);
      });
    }

    // --- Scroll handler ---
    function onScroll() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;

        const track = document.getElementById("scroll-track");
        if (!track) return;

        const trackTop = track.getBoundingClientRect().top;
        const trackHeight = track.offsetHeight - window.innerHeight;
        const scrolled = Math.max(0, -trackTop);
        const progress = Math.min(scrolled / trackHeight, 1); // 0.0 → 1.0

        // Map progress to frame index
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

    // --- Preload all frames ---
    let loaded = 0;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(3, "0");
      img.src = `/bheemasena-frames/ezgif-frame-${num}.jpg`;
      img.onload = () => {
        loaded++;
        if (loaded === 1) drawFrame(0); // draw first frame immediately
        if (loaded === TOTAL_FRAMES) console.log("All frames loaded");
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
          background: rgba(255, 248, 237, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-radius: 18px;
          border: 1px solid rgba(232, 129, 10, 0.18);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .beat.visible {
          opacity: 1;
          pointer-events: auto;
        }

        #beat-1 { bottom: 28%; left: 50%; transform: translateX(-50%) translateY(20px); }
        #beat-1.visible { transform: translateX(-50%) translateY(0); }

        #beat-2 { top: 50%; left: 5%; transform: translateX(-30px) translateY(-50%); }
        #beat-2.visible { transform: translateX(0) translateY(-50%); }

        #beat-3 { top: 50%; right: 5%; transform: translateX(30px) translateY(-50%); }
        #beat-3.visible { transform: translateX(0) translateY(-50%); }

        #beat-4 { top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.95); }
        #beat-4.visible { transform: translate(-50%, -50%) scale(1); }

        #beat-5 { top: 50%; left: 50%; transform: translate(-50%, -50%) translateY(20px); }
        #beat-5.visible { transform: translate(-50%, -50%) translateY(0); }

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
              <h1 style={{ fontSize: "clamp(28px, 7vw, 56px)", fontWeight: 800, color: "#1A0A00", lineHeight: 1.1 }}>
                Hotel Bheemasena
              </h1>
              <p style={{ fontSize: "clamp(15px, 3.5vw, 22px)", color: "#E8810A", fontWeight: 600, marginTop: "8px" }}>
                Where every meal feels like a celebration.
              </p>
              <p style={{ fontSize: "clamp(12px, 2.8vw, 15px)", color: "rgba(26,10,0,0.55)", marginTop: "10px" }}>
                Serving the hungry hearts of VIT-AP University — right here in Mandadam.
              </p>
            </div>

            {/* Beat 2 — FIRST BITE */}
            <div id="beat-2" className="beat">
              <h2 style={{ fontSize: "clamp(22px, 5vw, 40px)", fontWeight: 800, color: "#E8810A", margin: 0, lineHeight: 1.2 }}>
                Made with love.<br/>Served with soul.
              </h2>
              <p style={{ fontSize: "clamp(13px, 3vw, 16px)", color: "#1A0A00", marginTop: "12px", lineHeight: 1.6 }}>
                Every dish at Bheemasena is crafted fresh, packed with flavour, and priced for students who deserve the best.
              </p>
              <p style={{ fontSize: "clamp(13px, 3vw, 16px)", color: "#1A0A00", marginTop: "8px", lineHeight: 1.6 }}>
                From morning tiffins to hearty rice meals — your day starts and ends better here.
              </p>
            </div>

            {/* Beat 3 — THE FEAST */}
            <div id="beat-3" className="beat">
              <h2 style={{ fontSize: "clamp(22px, 5vw, 40px)", fontWeight: 800, color: "#1A0A00", margin: "0 0 16px 0", lineHeight: 1.2 }}>
                A menu built for every craving.
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ fontSize: "clamp(13px, 3vw, 15px)", color: "rgba(26,10,0,0.75)", margin: 0, display: "flex", alignItems: "flex-start", gap: "6px" }}>
                  <ChevronRight size={14} color="#E8810A" className="mt-1 flex-shrink-0" />
                  <span>Biryani that hits different after a long lab session.</span>
                </p>
                <p style={{ fontSize: "clamp(13px, 3vw, 15px)", color: "rgba(26,10,0,0.75)", margin: 0, display: "flex", alignItems: "flex-start", gap: "6px" }}>
                  <ChevronRight size={14} color="#E8810A" className="mt-1 flex-shrink-0" />
                  <span>Thali plates loaded with rice, curries, dal, pickle, and papad.</span>
                </p>
                <p style={{ fontSize: "clamp(13px, 3vw, 15px)", color: "rgba(26,10,0,0.75)", margin: 0, display: "flex", alignItems: "flex-start", gap: "6px" }}>
                  <ChevronRight size={14} color="#E8810A" className="mt-1 flex-shrink-0" />
                  <span>Quick snacks, cold drinks, and chai — we&apos;ve got your whole day.</span>
                </p>
              </div>
            </div>

            {/* Beat 4 — SATISFACTION */}
            <div id="beat-4" className="beat">
              <h2 style={{ fontSize: "clamp(26px, 6vw, 48px)", fontWeight: 800, color: "#1A0A00", textAlign: "center", margin: 0, lineHeight: 1.2 }}>
                Full stomach.<br/>Happy heart.
              </h2>
              <p style={{ textAlign: "center", color: "rgba(26,10,0,0.70)", marginTop: "12px", fontSize: "clamp(14px, 3.5vw, 16px)", lineHeight: 1.5 }}>
                Great food shouldn&apos;t cost your whole month&apos;s pocket money. At Bheemasena, you eat well, spend smart, and leave happy — every single time.
              </p>
              <p style={{ textAlign: "center", color: "#E8810A", fontWeight: 600, marginTop: "8px", fontSize: "clamp(14px, 3.5vw, 16px)", lineHeight: 1.5 }}>
                Student-friendly prices. Generous portions. Always fresh. Always hot.
              </p>
            </div>

            {/* Beat 5 — CTA */}
            <div id="beat-5" className="beat">
              <h2 style={{ fontSize: "clamp(26px, 6.5vw, 52px)", fontWeight: 800, color: "#1A0A00", textAlign: "center", margin: 0, lineHeight: 1.1 }}>
                Your next favourite meal is waiting.
              </h2>
              <p style={{ fontSize: "clamp(13px, 3vw, 16px)", color: "rgba(26,10,0,0.55)", textAlign: "center", marginTop: "10px", marginBottom: 0 }}>
                Hotel Bheemasena, Mandadam — 522237.<br/>Right beside VIT-AP University.
              </p>
              <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                <Link href="/order" style={{ textDecoration: "none" }}>
                  <button style={{ 
                    background: "linear-gradient(135deg, #E8810A, #C0392B)", 
                    color: "white", 
                    borderRadius: "12px", 
                    padding: "14px 28px", 
                    fontWeight: 700, 
                    fontSize: "clamp(14px, 3.5vw, 16px)", 
                    border: "none", 
                    cursor: "pointer",
                    boxShadow: "0 8px 16px rgba(232,129,10,0.25)"
                  }}>
                    See Our Menu
                  </button>
                </Link>
                <Link href="#location" style={{ textDecoration: "none" }}>
                  <button style={{ 
                    border: "1.5px solid #E8810A", 
                    color: "#E8810A", 
                    borderRadius: "12px", 
                    padding: "14px 28px", 
                    fontWeight: 600, 
                    fontSize: "clamp(14px, 3.5vw, 16px)", 
                    background: "transparent", 
                    cursor: "pointer" 
                  }}>
                    Get Directions
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
