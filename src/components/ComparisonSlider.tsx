import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";
import beforeImg from "@/assets/before-website.jpg";
import afterImg from "@/assets/after-website.jpg";

export default function ComparisonSlider() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div className="relative w-full">
      {/* Labels */}
      <div className="flex justify-between mb-4">
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: "hsl(0 72% 51% / 0.15)", color: "hsl(0 72% 51%)" }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: "hsl(0 72% 51%)" }} />
          Înainte
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: "hsl(var(--primary))" }} />
          După Nexora
        </motion.span>
      </div>

      {/* Slider container */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl cursor-col-resize select-none"
        style={{ aspectRatio: "4/3", border: "1px solid hsl(var(--border))" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* After image (full, behind) */}
        <img
          src={afterImg}
          alt="Website după redesign"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          draggable={false}
        />

        {/* Before image (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={beforeImg}
            alt="Website înainte de redesign"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100vw", maxWidth: "none" }}
            loading="lazy"
            draggable={false}
          />
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 z-10"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          <div className="w-0.5 h-full" style={{ background: "hsl(var(--primary))", boxShadow: "0 0 12px hsl(var(--primary) / 0.5)" }} />
          
          {/* Handle */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: "hsl(var(--primary))",
              boxShadow: "0 0 20px hsl(var(--primary) / 0.4), 0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            <ArrowLeftRight size={18} className="text-primary-foreground" />
          </div>
        </div>

        {/* Subtle gradient overlay on before side */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            width: `${position}%`,
            background: "linear-gradient(90deg, transparent 70%, hsl(0 0% 0% / 0.1) 100%)",
          }}
        />
      </div>

      {/* Instruction */}
      <p className="text-center text-xs text-muted-foreground/50 mt-3">
        ← Trage slider-ul pentru a compara →
      </p>
    </div>
  );
}
