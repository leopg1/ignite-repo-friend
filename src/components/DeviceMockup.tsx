import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import mockupScreen from "@/assets/mockup-screen.jpg";

export default function DeviceMockup() {
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
      {/* MacBook mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full lg:w-3/5 flex-shrink-0"
      >
        <div className="relative mx-auto" style={{ maxWidth: 580 }}>
          {/* Screen bezel */}
          <div
            className="relative rounded-t-xl overflow-hidden"
            style={{
              border: "2px solid hsl(var(--border))",
              borderBottom: "none",
              background: "hsl(240 10% 6%)",
            }}
          >
            {/* Top bar */}
            <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: "hsl(240 10% 8%)" }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(0 72% 50%)" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(45 90% 50%)" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(140 60% 45%)" }} />
              <div className="flex-1 flex justify-center">
                <div className="px-3 py-0.5 rounded-md text-xs font-mono text-muted-foreground/30" style={{ background: "hsl(240 10% 10%)" }}>
                  app.nexora.dev
                </div>
              </div>
            </div>

            {/* Scrolling screenshot */}
            <div className="relative overflow-hidden" style={{ height: 320 }}>
              <motion.img
                src={mockupScreen}
                alt="Dashboard aplicație Nexora"
                loading="lazy"
                width={800}
                height={1920}
                className="w-full"
                style={{ objectFit: "cover", objectPosition: "top" }}
                animate={inView ? {
                  y: ["0%", "-55%"],
                } : {}}
                transition={{
                  y: {
                    duration: 12,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1,
                  },
                }}
              />
              {/* Top/bottom fade */}
              <div className="absolute inset-x-0 top-0 h-8 pointer-events-none" style={{ background: "linear-gradient(to bottom, hsl(240 10% 6%), transparent)" }} />
              <div className="absolute inset-x-0 bottom-0 h-8 pointer-events-none" style={{ background: "linear-gradient(to top, hsl(240 10% 6%), transparent)" }} />
            </div>
          </div>

          {/* Laptop base/chin */}
          <div
            className="relative h-4 rounded-b-lg mx-auto"
            style={{
              width: "108%",
              marginLeft: "-4%",
              background: "linear-gradient(to bottom, hsl(240 8% 14%), hsl(240 8% 10%))",
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
            }}
          >
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-b" style={{ background: "hsl(240 8% 18%)" }} />
          </div>

          {/* Glow effect */}
          <div
            className="absolute -inset-4 -z-10 rounded-2xl opacity-30 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.15), transparent 70%)" }}
          />
        </div>
      </motion.div>

      {/* Phone mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-48 sm:w-52 flex-shrink-0"
      >
        <div className="relative mx-auto">
          {/* Phone frame */}
          <div
            className="relative rounded-[2rem] overflow-hidden"
            style={{
              border: "3px solid hsl(240 8% 16%)",
              background: "hsl(240 10% 6%)",
              padding: "12px 4px",
            }}
          >
            {/* Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full z-10" style={{ background: "hsl(240 10% 6%)" }} />

            {/* Screen content */}
            <div className="relative rounded-[1.5rem] overflow-hidden" style={{ height: 380 }}>
              <motion.img
                src={mockupScreen}
                alt="Dashboard mobil Nexora"
                loading="lazy"
                width={800}
                height={1920}
                className="w-full"
                style={{ objectFit: "cover", objectPosition: "top center" }}
                animate={inView ? {
                  y: ["0%", "-50%"],
                } : {}}
                transition={{
                  y: {
                    duration: 15,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 2,
                  },
                }}
              />
              <div className="absolute inset-x-0 top-0 h-6 pointer-events-none" style={{ background: "linear-gradient(to bottom, hsl(240 10% 6%), transparent)" }} />
              <div className="absolute inset-x-0 bottom-0 h-6 pointer-events-none" style={{ background: "linear-gradient(to top, hsl(240 10% 6%), transparent)" }} />
            </div>
          </div>

          {/* Phone glow */}
          <div
            className="absolute -inset-4 -z-10 rounded-3xl opacity-20 blur-2xl pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, hsl(var(--accent) / 0.2), transparent 70%)" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
