import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, ChevronRight } from "lucide-react";

const codeLines = [
  { type: "comment", text: "// 🚀 Nexora — Automatizare completă în 30 de linii" },
  { type: "keyword", text: "import", rest: ' { NexoraAI, Pipeline } ', from: '"@nexora/core"' },
  { type: "keyword", text: "import", rest: ' { connect } ', from: '"@nexora/integrations"' },
  { type: "blank", text: "" },
  { type: "comment", text: "// Conectăm sursa de date" },
  { type: "keyword", text: "const", rest: " db = ", call: 'connect("supabase", {' },
  { type: "prop", text: '  project: "client-crm",' },
  { type: "prop", text: '  realtime: true,' },
  { type: "close", text: "})" },
  { type: "blank", text: "" },
  { type: "comment", text: "// Pipeline AI — procesare automată lead-uri" },
  { type: "keyword", text: "const", rest: " pipeline = ", call: "new Pipeline({" },
  { type: "prop", text: '  trigger: "new_lead",' },
  { type: "prop", text: '  model: "gpt-4o",' },
  { type: "prop", text: '  actions: ["qualify", "respond", "assign"],' },
  { type: "close", text: "})" },
  { type: "blank", text: "" },
  { type: "comment", text: "// Lansăm tot — o singură linie" },
  { type: "keyword", text: "await", rest: " pipeline.", call: "deploy()" },
  { type: "blank", text: "" },
  { type: "success", text: "// ✅ Live — 0 intervenție manuală, 24/7" },
];

function renderLine(line: typeof codeLines[0]) {
  if (line.type === "blank") return <span>&nbsp;</span>;
  if (line.type === "comment") return <span style={{ color: "hsl(var(--muted-foreground))", opacity: 0.5 }}>{line.text}</span>;
  if (line.type === "success") return <span style={{ color: "hsl(160 60% 50%)" }}>{line.text}</span>;
  if (line.type === "prop") return <span style={{ color: "hsl(var(--foreground))", opacity: 0.8 }}>{line.text}</span>;
  if (line.type === "close") return <span style={{ color: "hsl(var(--foreground))", opacity: 0.7 }}>{line.text}</span>;
  if (line.type === "keyword") {
    return (
      <span>
        <span style={{ color: "hsl(280 80% 70%)" }}>{line.text}</span>
        <span style={{ color: "hsl(var(--foreground))", opacity: 0.8 }}>{line.rest}</span>
        {line.from && <span style={{ color: "hsl(160 60% 50%)" }}>{line.from}</span>}
        {line.call && <span style={{ color: "hsl(var(--accent))" }}>{line.call}</span>}
      </span>
    );
  }
  return <span>{line.text}</span>;
}

export default function CodeEditorShowcase() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Start animation when in view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (visibleLines >= codeLines.length) return;
    const delay = codeLines[visibleLines]?.type === "blank" ? 150 : 80;
    const timer = setTimeout(() => setVisibleLines(v => v + 1), delay);
    return () => clearTimeout(timer);
  }, [started, visibleLines]);

  // Terminal output after code is done
  const showTerminal = visibleLines >= codeLines.length;

  return (
    <div ref={containerRef} className="w-full">
      {/* Window chrome */}
      <div
        className="rounded-t-xl flex items-center gap-2 px-4 py-3"
        style={{ background: "hsl(240 10% 8%)", borderBottom: "1px solid hsl(var(--border))" }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "hsl(0 72% 50%)" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "hsl(45 90% 50%)" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "hsl(140 60% 45%)" }} />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs text-muted-foreground/40 font-mono">nexora-pipeline.ts</span>
        </div>
        <Terminal size={14} className="text-muted-foreground/30" />
      </div>

      {/* Code area */}
      <div
        className="font-mono text-xs sm:text-sm leading-relaxed overflow-hidden"
        style={{
          background: "hsl(240 12% 5%)",
          padding: "20px 24px",
          minHeight: 340,
          borderLeft: "1px solid hsl(var(--border))",
          borderRight: "1px solid hsl(var(--border))",
        }}
      >
        {codeLines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            <span className="w-8 text-right mr-4 select-none" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.25 }}>
              {i + 1}
            </span>
            {renderLine(line)}
          </motion.div>
        ))}

        {/* Blinking cursor */}
        {visibleLines < codeLines.length && started && (
          <div className="flex items-center mt-0.5">
            <span className="w-8 text-right mr-4 select-none" style={{ color: "hsl(var(--muted-foreground))", opacity: 0.25 }}>
              {visibleLines + 1}
            </span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
              className="inline-block w-2 h-4"
              style={{ background: "hsl(var(--primary))" }}
            />
          </div>
        )}
      </div>

      {/* Terminal output */}
      <div
        className="rounded-b-xl overflow-hidden"
        style={{
          background: "hsl(240 12% 4%)",
          borderTop: "1px solid hsl(var(--border))",
          border: "1px solid hsl(var(--border))",
          borderTopColor: "hsl(var(--border))",
        }}
      >
        <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: "1px solid hsl(var(--border) / 0.5)" }}>
          <ChevronRight size={12} className="text-muted-foreground/30" />
          <span className="text-xs font-mono text-muted-foreground/40">Terminal</span>
        </div>
        <div className="px-4 py-3 font-mono text-xs" style={{ minHeight: 60 }}>
          {showTerminal && (
            <>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-muted-foreground/50">
                <span style={{ color: "hsl(var(--accent))" }}>$</span> nexora deploy --production
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ color: "hsl(45 90% 55%)" }}>
                ⠋ Building pipeline...
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} style={{ color: "hsl(160 60% 50%)" }}>
                ✓ Pipeline deployed successfully
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }} style={{ color: "hsl(160 60% 50%)" }}>
                ✓ 3 automations active — processing leads 24/7
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="text-muted-foreground/40 mt-1">
                Ready on <span style={{ color: "hsl(var(--primary))" }}>https://client.nexora.dev</span>
              </motion.p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
