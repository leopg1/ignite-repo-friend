import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Zap, Menu, X, Check, ArrowDown, Cog, Monitor, Brain, Globe, MessageCircle, TrendingUp, Users, Shield, Clock, Layers, Star, RefreshCw, Lightbulb, Search, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import serverIllustration from "@/assets/server-illustration.png";
import AdminPanelShowcase from "@/components/AdminPanelShowcase";
import CodeEditorShowcase from "@/components/CodeEditorShowcase";
import DeviceMockup from "@/components/DeviceMockup";

/* ─── SCROLL REVEAL HOOK ─── */
function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, v };
}

/* ─── COUNTER HOOK ─── */
function useCounter(end: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, end, duration]);
  return count;
}

/* ─── ANIMATION HELPERS ─── */
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.6, ease } }
};
const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease } });
const scrollReveal = (delay = 0) => ({
  initial: { opacity: 0, y: 40, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay, ease },
});
const scrollRevealScale = (delay = 0) => ({
  initial: { opacity: 0, y: 50, scale: 0.92, filter: "blur(10px)" },
  whileInView: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, delay, ease },
});

/* ─── SECTION WRAPPER ─── */
import { forwardRef } from "react";
const Section = forwardRef<HTMLDivElement, { id?: string; children: React.ReactNode; alt?: boolean; className?: string; style?: React.CSSProperties; fadeIn?: boolean; fadeOut?: boolean; divider?: boolean }>(
  ({ id, children, alt, className = "", fadeIn, fadeOut, divider, style = {} }, ref) => {
    const transitionClasses = [
      alt && fadeIn ? "section-alt-fade-in" : !alt && fadeIn ? "section-fade-in" : "",
      alt && fadeOut ? "section-alt-fade-out" : !alt && fadeOut ? "section-fade-out" : "",
      divider ? "section-divider" : "",
    ].filter(Boolean).join(" ");

    return (
      <section ref={ref} id={id} className={`${transitionClasses} ${className}`} style={{ position: "relative", zIndex: 2, padding: "96px 24px", background: alt ? "hsl(240 10% 5%)" : "transparent", ...style }}>
        {children}
      </section>
    );
  }
);
Section.displayName = "Section";

const Index = () => {
  const [quizOpen, setQuizOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const openQuiz = () => setQuizOpen(true);

  useEffect(() => {
    const h = () => {
      setScrolled(window.scrollY > 50);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navLinks = [
    { label: "Servicii", href: "#servicii" },
    { label: "Cum lucrăm", href: "#cum-lucram" },
    { label: "Produse", href: "/produse", isRoute: true },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <div className="bg-background text-foreground" style={{ minHeight: "100vh" }}>
      {/* SCROLL PROGRESS */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 60, height: 2 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))", transition: "width 80ms linear" }} />
      </div>

      {/* HEADER */}
      <motion.header
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          transition: "background 0.5s, backdrop-filter 0.5s, border-color 0.5s",
          background: scrolled || mobileOpen ? "hsl(var(--background) / 0.95)" : "transparent",
          backdropFilter: scrolled || mobileOpen ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid hsl(var(--border))" : "1px solid transparent",
        }}>
        <div className="flex items-center justify-between h-14 px-4 md:h-16 md:px-6" style={{ maxWidth: 1152, margin: "0 auto" }}>
          <a href="#" className="flex items-center gap-2 font-heading font-bold text-foreground" style={{ fontSize: 17, textDecoration: "none" }} aria-label="Nexora - pagina principală">
            <Zap size={18} className="text-primary" /> Nexora
          </a>
          <nav className="hidden md:flex items-center" style={{ gap: 32 }} aria-label="Navigare principală">
            {navLinks.map(l => (
              l.isRoute ? (
                <Link key={l.href} to={l.href} className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 14, textDecoration: "none" }}>{l.label}</Link>
              ) : (
                <a key={l.href} href={l.href} className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 14, textDecoration: "none" }}>{l.label}</a>
              )
            ))}
            <a href="#contact" className="text-primary hover:text-primary/80 transition-colors font-medium" style={{ fontSize: 14, textDecoration: "none" }}>Contactează-ne</a>
          </nav>
          <button className="flex items-center justify-center md:hidden text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Închide meniul" : "Deschide meniul"}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
              className="md:hidden border-b border-border">
              <div className="px-4 pb-4 pt-2 flex flex-col gap-0.5">
                {navLinks.map(l => (
                  l.isRoute ? (
                    <Link key={l.href} to={l.href} onClick={() => setMobileOpen(false)} className="block py-3 px-3 text-muted-foreground rounded-lg" style={{ fontSize: 15, textDecoration: "none" }}>{l.label}</Link>
                  ) : (
                    <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block py-3 px-3 text-muted-foreground rounded-lg" style={{ fontSize: 15, textDecoration: "none" }}>{l.label}</a>
                  )
                ))}
                <a href="#contact" onClick={() => setMobileOpen(false)} className="block py-3 px-3 text-primary font-medium rounded-lg" style={{ fontSize: 15, textDecoration: "none" }}>Contactează-ne</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <HeroBlock openQuiz={openQuiz} />
      <TechBar />
      <PainPointsAndWhyBlock openQuiz={openQuiz} />
      <ForWhoBlock />
      <ServicesBlock />
      <FreeAnalysisBlock openQuiz={openQuiz} />
      
      <HowWeWorkBlock />
      <PortfolioBlock />
      <StatsBlock />
      <FAQBlock />
      <FinalCTABlock openQuiz={openQuiz} />
      <FooterBlock />

      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} />

      {/* WHATSAPP FLOATING */}
      <motion.a
        href={`https://wa.me/40700000000?text=${encodeURIComponent("Bună! Am văzut Nexora și vreau să aflu dacă mă puteți ajuta.")}`}
        target="_blank" rel="noopener noreferrer" aria-label="Contactează-ne pe WhatsApp"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50, width: 52, height: 52, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 24px rgba(37,211,102,0.3)", cursor: "pointer" }}>
        <MessageCircle size={24} color="#fff" />
      </motion.a>

      <CookieBanner />
    </div>
  );
};

/* ═══════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════ */
function HeroBlock({ openQuiz }: { openQuiz: () => void }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  return (
    <section ref={heroRef} style={{ position: "relative", zIndex: 1, height: "100vh", minHeight: 600, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <motion.div style={{ y: orbY, scale: orbScale }} className="animate-float-orb animate-pulse-glow">
          <div style={{ position: "absolute", top: "15%", left: "25%", width: 600, height: 600, borderRadius: "50%", background: "hsl(var(--primary) / 0.08)", filter: "blur(140px)" }} />
        </motion.div>
        <motion.div style={{ y: orbY, scale: orbScale }} className="animate-float-orb-slow">
          <div style={{ position: "absolute", bottom: "15%", right: "20%", width: 450, height: 450, borderRadius: "50%", background: "hsl(var(--accent) / 0.06)", filter: "blur(140px)" }} />
        </motion.div>
      </div>

      <div className="relative z-10 text-center px-4 pt-20 pb-6 md:pt-28 md:pb-16 md:px-6" style={{ maxWidth: 1152, margin: "0 auto" }}>
        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-1.5 rounded-full mb-4 md:mb-6" style={{ padding: "5px 14px", background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.15)", fontSize: 12, fontWeight: 500 }}>
          <span className="text-primary">Studio digital de produse software</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.1)} className="font-heading font-bold text-foreground mb-4 md:mb-6" style={{ fontSize: "clamp(1.75rem, 5vw, 4.25rem)", lineHeight: 1.1 }}>
          Construim produse digitale{" "}
          <span className="gradient-text-animated">care lucrează pentru tine.</span>
        </motion.h1>

        <motion.p {...fadeUp(0.2)} className="text-muted-foreground mx-auto mb-6 md:mb-10" style={{ fontSize: "clamp(0.875rem, 1.5vw, 1.125rem)", maxWidth: 560, lineHeight: 1.6 }}>
          Automatizări, aplicații web, integrare AI și platforme SaaS — de la concept la produs live.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <motion.button onClick={openQuiz} className="btn-primary" style={{ padding: "12px 28px", fontSize: 14 }}
            whileHover={{ scale: 1.03, boxShadow: "0 6px 30px hsl(var(--primary) / 0.4)" }} whileTap={{ scale: 0.98 }}>
            Spune-ne ideea ta
          </motion.button>
          <motion.a href="#servicii" className="btn-secondary" style={{ padding: "12px 28px", fontSize: 14, textDecoration: "none", textAlign: "center" }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            Vezi ce facem
          </motion.a>
        </motion.div>

        <motion.div {...fadeUp(0.45)} className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-muted-foreground" style={{ fontSize: 13 }}>
          {["Răspuns în 24h", "Fără jargon tehnic", "Suport post-lansare"].map(t => (
            <span key={t} className="flex items-center gap-1.5"><Check size={13} className="text-green-500" />{t}</span>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="hidden sm:block mt-8 md:mt-12">
          <a href="#tech" className="inline-flex flex-col items-center gap-1 text-muted-foreground/40" style={{ textDecoration: "none" }} aria-label="Scroll down">
            <span style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase" }}>scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><ArrowDown size={14} /></motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   TECH BAR
   ═══════════════════════════════════════════════ */
function TechBar() {
  const techs = ["React", "Supabase", "n8n", "Make", "OpenAI", "Stripe", "Vercel", "Node.js", "TypeScript", "Tailwind"];
  return (
    <section id="tech" className="border-y border-border" style={{ position: "relative", zIndex: 2, padding: "16px 0", overflow: "hidden" }}>
      <div className="flex items-center gap-4 px-5" style={{ maxWidth: 1152, margin: "0 auto" }}>
        <p className="label-sm hidden sm:block whitespace-nowrap shrink-0">Tehnologii</p>
        <div className="flex-1 overflow-hidden min-w-0">
          <div className="animate-scroll-left flex gap-10" style={{ width: "max-content" }}>
            {[...techs, ...techs].map((n, i) => (
              <span key={i} className="font-heading font-medium text-muted-foreground/30 whitespace-nowrap select-none" style={{ fontSize: 14 }}>{n}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   PAIN POINTS + DE CE NEXORA (COMBINED)
   ═══════════════════════════════════════════════ */
function PainPointsAndWhyBlock({ openQuiz }: { openQuiz: () => void }) {
  const { ref, v } = useReveal();
  const items = [
    { icon: <TrendingUp size={18} />, text: "Angajații copiază date manual între spreadsheet-uri" },
    { icon: <MessageCircle size={18} />, text: "Trimiți oferte și facturi manual, unul câte unul" },
    { icon: <Globe size={18} />, text: "Ai un site, dar nu aduce niciun lead" },
    { icon: <Shield size={18} />, text: "Nu ai vizibilitate reală asupra business-ului" },
    { icon: <Users size={18} />, text: "Răspunzi la aceleași întrebări de zeci de ori pe zi" },
    { icon: <Clock size={18} />, text: "Plătești oameni pentru taskuri pe care un soft le face instant" },
  ];
  const diffs = [
    { icon: <MessageCircle size={20} />, title: "Comunicare directă", desc: "Fără jargon, fără ocolișuri. Știi exact ce se întâmplă." },
    { icon: <Users size={20} />, title: "Echipă mică, atenție totală", desc: "Lucrezi direct cu oamenii care-ți construiesc produsul." },
    { icon: <Zap size={20} />, title: "Răspuns rapid", desc: "Pe WhatsApp răspundem în ore, nu în zile." },
    { icon: <TrendingUp size={20} />, title: "Rezultate de business", desc: "Livrăm soluții care economisesc timp sau aduc bani." },
  ];
  return (
    <Section ref={ref} alt fadeIn fadeOut>
      <div style={{ maxWidth: 1152, margin: "0 auto" }}>
        {/* Pain points */}
        <motion.div {...scrollReveal()} className="text-center mb-10">
          <p className="label-sm mb-3">Recunoști asta?</p>
          <h2 className="font-heading font-bold text-foreground mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Semnele că e timpul să acționezi</h2>
          <p className="text-muted-foreground mx-auto" style={{ maxWidth: 480, fontSize: 14 }}>Dacă bifezi măcar 2 din cele de mai jos, hai să vorbim.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-16">
          {items.map((p, i) => (
            <motion.div key={i} {...scrollReveal(i * 0.06)} className="glass-card-hover" whileHover={{ y: -2, transition: { duration: 0.2 } }}
              style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-primary" style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.12)" }}>
                {p.icon}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(0 0% 82%)" }}>{p.text}</p>
            </motion.div>
          ))}
        </div>

        {/* De ce Nexora */}
        <motion.div {...scrollReveal()} className="text-center mb-10">
          <p className="label-sm mb-3">De ce Nexora</p>
          <h2 className="font-heading font-bold text-foreground mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Nu suntem o agenție tipică.</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {diffs.map((d, i) => (
            <motion.div key={i} {...scrollRevealScale(i * 0.08)} className="glass-card-hover text-center" style={{ padding: 24 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-primary mx-auto mb-3" style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.15)" }}>
                {d.icon}
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1.5" style={{ fontSize: 14 }}>{d.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div {...scrollReveal(0.3)} className="text-center mt-8">
          <motion.button onClick={openQuiz} className="btn-tertiary" style={{ fontSize: 14, background: "none", border: "none", cursor: "pointer" }}
            whileHover={{ x: 4 }}>
            Hai să rezolvăm asta
          </motion.button>
        </motion.div>
      </div>
    </Section>
  );
}
function ForWhoBlock() {
  const { ref, v } = useReveal();
  const profiles = [
    { icon: <Zap size={24} />, title: "Antreprenori & Fondatori", desc: "Ai o idee de produs sau vrei să-ți automatizezi afacerea. Cauți execuție rapidă, nu ședințe interminabile." },
    { icon: <TrendingUp size={24} />, title: "Firme mici (2-50 angajați)", desc: "Procesele manuale vă consumă timpul. Trebuie să digitalizați, dar nu aveți echipă tech." },
    { icon: <Layers size={24} />, title: "Fondatori de SaaS", desc: "Vrei să transformi o idee în MVP funcțional, validat de utilizatori, fără investiție masivă." },
  ];
  return (
    <Section ref={ref} divider>
      <div style={{ maxWidth: 1152, margin: "0 auto" }}>
        <motion.div {...scrollReveal()} className="text-center mb-12">
          <p className="label-sm mb-3">Pentru cine e Nexora</p>
          <h2 className="font-heading font-bold text-foreground" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
            Dacă te regăsești aici, suntem <span className="gradient-text">echipa ta.</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profiles.map((p, i) => (
            <motion.div key={i} {...scrollRevealScale(i * 0.1)} className="glass-card-hover group" style={{ padding: 28 }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-primary transition-transform group-hover:scale-110" style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.12)" }}>
                {p.icon}
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2" style={{ fontSize: 16 }}>{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════
   SERVICES
   ═══════════════════════════════════════════════ */

function ServicesBlock() {
  const { ref, v } = useReveal();
  const services = [
    { icon: Cog, title: "Automatizări", sub: "Elimină taskurile repetitive", before: "4h/zi pe taskuri manuale", after: "Totul rulează automat", tools: "n8n · Make · Zapier" },
    { icon: Monitor, title: "Aplicații Web & SaaS", sub: "De la idee la produs live", before: "Spreadsheet-uri sau idee blocată", after: "O singură aplicație, live, cu useri", tools: "React · Supabase · Stripe" },
    { icon: Brain, title: "AI Integrat", sub: "Lasă AI-ul să răspundă", before: "200+ întrebări pe zi, manual", after: "AI răspunde non-stop", tools: "OpenAI · Claude · RAG" },
    { icon: RefreshCw, title: "Redesign & SEO", sub: "Site modern, vizibil pe Google", before: "Site vechi, nimeni nu te găsește", after: "Design modern, prima pagină Google", tools: "React · Tailwind · Google · Analytics" },
    { icon: Lightbulb, title: "Consultanță Tehnică", sub: "Claritate înainte de execuție", before: "Nu știi ce tehnologie să alegi", after: "Plan clar, buget realist, timeline", tools: "Audit · Roadmap · Strategy" },
    { icon: Globe, title: "Prezență Online Completă", sub: "Website + branding + strategie", before: "Lipsă vizibilitate, fără leads", after: "Prezență profesională, leads constante", tools: "Web · SEO · Social · Ads" },
  ];
  return (
    <Section id="servicii" ref={ref} alt fadeIn fadeOut>
      <div style={{ maxWidth: 1152, margin: "0 auto" }}>
        <motion.div {...scrollReveal()} className="text-center mb-12">
          <p className="label-sm mb-3">Servicii</p>
          <h2 className="font-heading font-bold text-foreground" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Ce construim</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={i} {...scrollRevealScale(i * 0.06)} className="glass-card-hover group" whileHover={{ y: -4, transition: { duration: 0.25 } }}
                style={{ padding: "24px 20px", textAlign: "center" }}>
                <motion.div whileHover={{ rotate: 8, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary" style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.1)" }}>
                  <Icon size={22} />
                </motion.div>
                <h3 className="font-heading font-bold text-foreground mb-1.5" style={{ fontSize: 16 }}>{s.title}</h3>
                <p className="text-muted-foreground mb-4" style={{ fontSize: 13 }}>{s.sub}</p>
                <div className="border-t border-border pt-4" style={{ fontSize: 13, lineHeight: 1.7 }}>
                  <p style={{ color: "hsl(0 72% 55%)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Înainte</p>
                  <p className="text-muted-foreground/60 mb-2.5">{s.before}</p>
                  <p style={{ color: "hsl(160 60% 45%)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>După</p>
                  <p style={{ color: "hsl(0 0% 82%)" }}>{s.after}</p>
                </div>
                <p className="text-muted-foreground/30 mt-4" style={{ fontSize: 11 }}>{s.tools}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Admin Panel Showcase */}
        <motion.div {...scrollRevealScale(0.1)} className="mt-14">
          <motion.div {...scrollReveal()} className="text-center mb-6">
            <p className="label-sm mb-2">Exemplu real</p>
            <h3 className="font-heading font-semibold text-foreground" style={{ fontSize: "clamp(1.1rem, 2vw, 1.35rem)" }}>
              Dashboard-uri pe care le construim
            </h3>
            <p className="text-muted-foreground mt-2" style={{ fontSize: 13, maxWidth: 500, margin: "8px auto 0" }}>
              Aplicații complete cu analytics, management utilizatori și rapoarte — adaptate afacerii tale.
            </p>
          </motion.div>
          <AdminPanelShowcase />
        </motion.div>

        {/* Code Editor Showcase */}
        <motion.div {...scrollRevealScale(0.1)} className="mt-14">
          <motion.div {...scrollReveal()} className="text-center mb-6">
            <p className="label-sm mb-2">Automatizări & AI</p>
            <h3 className="font-heading font-semibold text-foreground" style={{ fontSize: "clamp(1.1rem, 2vw, 1.35rem)" }}>
              Cod care lucrează <span className="gradient-text">pentru tine</span>
            </h3>
            <p className="text-muted-foreground mt-2" style={{ fontSize: 13, maxWidth: 500, margin: "8px auto 0" }}>
              Pipeline-uri AI și automatizări care rulează non-stop — zero intervenție manuală.
            </p>
          </motion.div>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <CodeEditorShowcase />
          </div>
        </motion.div>
      </div>
    </Section>
  );
}


/* ═══════════════════════════════════════════════
   FREE ANALYSIS CTA
   ═══════════════════════════════════════════════ */
function FreeAnalysisBlock({ openQuiz }: { openQuiz: () => void }) {
  const { ref, v } = useReveal();
  const features = [
    { icon: <Search size={16} />, text: "Audit complet al prezenței online" },
    { icon: <BarChart3 size={16} />, text: "Analiză competiție & poziționare" },
    { icon: <Lightbulb size={16} />, text: "Recomandări concrete de îmbunătățire" },
  ];

  return (
    <Section ref={ref} divider>
      <div style={{ maxWidth: 1152, margin: "0 auto" }}>
        <motion.div
          {...scrollRevealScale()}
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: "linear-gradient(135deg, hsl(240 10% 7%) 0%, hsl(244 30% 12%) 50%, hsl(240 10% 7%) 100%)",
            border: "1px solid hsl(244 40% 30% / 0.3)",
          }}
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "hsl(var(--primary) / 0.06)", filter: "blur(120px)", transform: "translate(30%, -40%)" }} />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: "hsl(var(--accent) / 0.04)", filter: "blur(100px)", transform: "translate(-30%, 40%)" }} />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16" style={{ padding: "48px 40px" }}>
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  {...scrollReveal(0.1)}
                  className="inline-flex items-center gap-1.5 rounded-full mb-4"
                  style={{ padding: "5px 14px", background: "hsl(160 60% 45% / 0.1)", border: "1px solid hsl(160 60% 45% / 0.2)", fontSize: 11, fontWeight: 600, color: "hsl(160 60% 45%)", letterSpacing: "0.05em" }}
                >
                  ✦ 100% Gratuit
                </motion.div>

                <h3 className="font-heading font-bold text-foreground mb-3" style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", lineHeight: 1.2 }}>
                  Analiză gratuită a prezenței tale online
                </h3>
                <p className="text-muted-foreground mb-6" style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 480 }}>
                  Află cum arăți online vs. competiția ta. Primești un raport detaliat cu puncte forte, puncte slabe și recomandări concrete.
                </p>

                <div className="flex flex-col gap-3">
                  {features.map((f, i) => (
                    <motion.div
                      key={i}
                      {...scrollReveal(0.15 + i * 0.08)}
                      className="flex items-center gap-3"
                    >
                      <div className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.15)" }}>
                        <span className="text-primary">{f.icon}</span>
                      </div>
                      <span className="text-sm" style={{ color: "hsl(0 0% 78%)" }}>{f.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                {...scrollRevealScale(0.2)}
                className="shrink-0 flex flex-col items-center text-center"
                style={{ minWidth: 280, maxWidth: 360 }}
              >
                <img
                  src={serverIllustration}
                  alt="Infrastructură digitală"
                  className="w-full max-w-[280px] h-auto mb-6 drop-shadow-2xl"
                  style={{ filter: "drop-shadow(0 8px 24px hsl(var(--primary) / 0.3))" }}
                />

                <motion.button
                  onClick={openQuiz}
                  className="btn-primary w-full"
                  style={{ padding: "14px 28px", fontSize: 14, borderRadius: 12, maxWidth: 260 }}
                  whileHover={{ scale: 1.03, boxShadow: "0 8px 32px hsl(var(--primary) / 0.4)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Vreau analiza gratuită
                </motion.button>

                <p className="text-muted-foreground/50 mt-3" style={{ fontSize: 11 }}>Fără obligații · Răspundem în max 2 ore</p>
              </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function HowWeWorkBlock() {
  const { ref, v } = useReveal();
  const steps = [
    { num: "01", badge: "Gratuit", badgeType: "free" as const, title: "Înțelegem problema", desc: "Un apel scurt. Tu vorbești, noi ascultăm. Fără prezentări, fără vânzare." },
    { num: "02", badge: "AI-assisted", badgeType: "ai" as const, title: "Analiză & audit", desc: "Analizăm prezența ta online, procesele și competiția cu ajutorul AI." },
    { num: "03", badge: "~48h", badgeType: "default" as const, title: "Propunem soluția", desc: "Primești un document clar: ce construim, cât durează, cât costă." },
    { num: "04", badge: "Iterativ", badgeType: "default" as const, title: "Design & prototip", desc: "Creăm un prototip vizual pe care-l poți testa înainte de dezvoltare." },
    { num: "05", badge: "2-8 săpt", badgeType: "default" as const, title: "Construim & testăm", desc: "Ești implicat pe parcurs. Update-uri săptămânale, acces live la progres." },
    { num: "06", badge: "Continuu", badgeType: "default" as const, title: "Livrăm & susținem", desc: "La lansare nu dispărem. 30 de zile de suport incluse." },
  ];
  const badgeStyles = {
    free: { color: "hsl(160 60% 45%)", border: "1px solid hsl(160 60% 45% / 0.3)", background: "hsl(160 60% 45% / 0.08)" },
    ai: { color: "hsl(var(--accent))", border: "1px solid hsl(var(--accent) / 0.3)", background: "hsl(var(--accent) / 0.08)" },
    default: { color: "hsl(var(--primary) / 0.85)", border: "1px solid hsl(var(--primary) / 0.25)", background: "hsl(var(--primary) / 0.08)" },
  };
  return (
    <Section id="cum-lucram" ref={ref} divider>
      <div style={{ maxWidth: 1152, margin: "0 auto" }}>
        <motion.div {...scrollReveal()} className="text-center mb-14">
          <p className="label-sm mb-3">Proces</p>
          <h2 className="font-heading font-bold text-foreground mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Simplu. Transparent. Fără surprize.</h2>
          <p className="text-muted-foreground mx-auto" style={{ maxWidth: 480, fontSize: 14 }}>Tu nu atingi nicio linie de cod. Noi facem tot.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 relative gap-y-10 gap-x-0">
          {steps.map((s, i) => (
            <motion.div key={i}
              {...scrollRevealScale(0.05 + i * 0.08)}
              className="text-center relative z-[1] flex flex-col items-center px-5">
              <div className="relative inline-block mb-4">
                <div className="absolute -inset-3 rounded-full pointer-events-none" style={{ background: "hsl(var(--primary) / 0.06)", filter: "blur(16px)" }} />
                <p className="gradient-text font-heading font-bold relative"
                  style={{ fontSize: "clamp(2.5rem, 4vw, 3rem)", lineHeight: 1 }}>
                  {s.num}
                </p>
              </div>
              <span
                className="inline-block rounded-full text-xs font-semibold mb-4" style={{ padding: "4px 12px", letterSpacing: "0.04em", ...badgeStyles[s.badgeType] }}>
                {s.badge}
              </span>
              <h3 className="font-heading font-bold text-foreground mb-2" style={{ fontSize: 15 }}>{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed mx-auto" style={{ fontSize: 13, maxWidth: 220 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════
   PORTFOLIO - PRODUSE SAAS PROPRII
   ═══════════════════════════════════════════════ */
function PortfolioBlock() {
  const { ref, v } = useReveal();
  const products = [
    {
      icon: <Star size={28} />,
      accentColor: "var(--primary)",
      name: "ReplicAI",
      tagline: "Răspunsuri inteligente la review-uri, pe pilot automat.",
      description: "Platforma se conectează la Google Maps, Booking și alte platforme de review-uri ale afacerii tale. AI-ul analizează fiecare review și generează un răspuns personalizat, profesional. Clientul intră în platformă, apasă un buton, și review-ul e rezolvat.",
      features: [
        { label: "Conectare automată", detail: "Google Maps, Booking & altele" },
        { label: "Răspuns AI instant", detail: "Personalizat per review" },
        { label: "Un singur click", detail: "Zero efort manual" },
      ],
      metrics: [
        { value: "95%", label: "Timp economisit" },
        { value: "<5s", label: "Răspuns generat" },
        { value: "24/7", label: "Funcționare non-stop" },
      ],
    },
    {
      icon: <MessageCircle size={28} />,
      accentColor: "var(--primary)",
      name: "AI Chatbot",
      tagline: "Un chatbot AI antrenat pe afacerea ta, integrat direct în site.",
      description: "Chatbot-ul este antrenat conform specificului afacerii — produse, servicii, tone of voice. Se integrează direct în website-ul clientului printr-un simplu snippet de cod. Răspunde vizitatorilor 24/7, califică lead-uri și reduce presiunea pe echipă.",
      features: [
        { label: "Antrenament custom", detail: "Pe datele tale reale" },
        { label: "Integrare simplă", detail: "Un singur snippet în site" },
        { label: "Calificare lead-uri", detail: "Filtrare automată vizitatori" },
      ],
      metrics: [
        { value: "80%", label: "Întrebări rezolvate" },
        { value: "2min", label: "Timp de integrare" },
        { value: "0", label: "Cod necesar" },
      ],
    },
  ];

  return (
    <Section ref={ref} alt fadeIn fadeOut>
      <div style={{ maxWidth: 1152, margin: "0 auto" }}>
        <motion.div {...scrollReveal()} className="text-center mb-14">
          <p className="label-sm mb-3">Produse proprii</p>
          <h2 className="font-heading font-bold text-foreground" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
            SaaS-uri <span className="gradient-text">dezvoltate de noi.</span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-3" style={{ maxWidth: 480, fontSize: 14 }}>
            Nu doar construim pentru alții — avem și produse proprii, live și funcționale.
          </p>
          <Link to="/produse" className="btn-tertiary inline-flex items-center gap-1.5 mt-4" style={{ fontSize: 13, textDecoration: "none" }}>
            Vezi detalii complete
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {products.map((p, i) => (
            <motion.div
              key={i}
              {...scrollRevealScale(i * 0.12)}
              className="glass-card-hover group relative overflow-hidden"
              style={{ padding: 0 }}
            >
              {/* Top accent line */}
              <div style={{ height: 2, background: `linear-gradient(90deg, hsl(${p.accentColor}), hsl(${p.accentColor} / 0.3))` }} />

              <div style={{ padding: "28px 28px 24px" }}>
                {/* Header */}
                <div className="flex items-start gap-4 mb-5">
                  <motion.div
                    whileHover={{ rotate: 6, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: `hsl(${p.accentColor} / 0.08)`, border: `1px solid hsl(${p.accentColor} / 0.15)`, color: `hsl(${p.accentColor})` }}
                  >
                    {p.icon}
                  </motion.div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-1" style={{ fontSize: 20 }}>{p.name}</h3>
                    <p style={{ fontSize: 13, color: `hsl(${p.accentColor} / 0.8)`, fontWeight: 500 }}>{p.tagline}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-6" style={{ fontSize: 13.5 }}>{p.description}</p>

                {/* Features */}
                <div className="space-y-2.5 mb-6">
                  {p.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-3">
                      <div className="shrink-0 w-5 h-5 rounded-md flex items-center justify-center" style={{ background: `hsl(${p.accentColor} / 0.1)` }}>
                        <Check size={12} style={{ color: `hsl(${p.accentColor})` }} />
                      </div>
                      <div>
                        <span className="text-foreground font-medium" style={{ fontSize: 13 }}>{f.label}</span>
                        <span className="text-muted-foreground" style={{ fontSize: 13 }}> — {f.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 pt-5 border-t border-border">
                  {p.metrics.map((m, mi) => (
                    <div key={mi} className="text-center">
                      <p className="font-heading font-bold text-foreground" style={{ fontSize: 18 }}>{m.value}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 11 }}>{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Device Mockup */}
        <motion.div {...scrollRevealScale(0.1)} className="mt-16">
          <motion.div {...scrollReveal()} className="text-center mb-8">
            <p className="label-sm mb-2">Live preview</p>
            <h3 className="font-heading font-semibold text-foreground" style={{ fontSize: "clamp(1.1rem, 2vw, 1.35rem)" }}>
              Aplicații care rulează <span className="gradient-text">pe orice device</span>
            </h3>
            <p className="text-muted-foreground mt-2" style={{ fontSize: 13, maxWidth: 480, margin: "8px auto 0" }}>
              Responsive, rapid, profesional — de la desktop la mobil.
            </p>
          </motion.div>
          <DeviceMockup />
        </motion.div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════
   STATS
   ═══════════════════════════════════════════════ */
function StatsBlock() {
  const { ref, v } = useReveal();
  const stats = [
    { value: 100, suffix: "%", label: "Proiecte livrate la termen", icon: <Shield size={22} /> },
    { value: 24, suffix: "h", label: "Timp mediu de răspuns", icon: <Clock size={22} /> },
    { value: 30, suffix: " zile", label: "Suport inclus gratuit", icon: <Star size={22} /> },
    { value: 10, suffix: "+", label: "Tehnologii integrate", icon: <Layers size={22} /> },
  ];

  return (
    <Section ref={ref} divider>
      {/* Subtle background orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "hsl(var(--primary) / 0.04)", filter: "blur(120px)" }} />
      <div style={{ maxWidth: 1152, margin: "0 auto", position: "relative" }}>
        <motion.div {...scrollReveal()} className="text-center mb-12">
          <p className="label-sm mb-3">Nexora în cifre</p>
          <h2 className="font-heading font-bold text-foreground" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
            Angajamentul nostru în <span className="gradient-text">fapte, nu vorbe.</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={i}
              {...scrollRevealScale(i * 0.08)}
              className="glass-card-hover text-center relative" style={{ padding: "28px 20px" }}>
              <div className="flex justify-center mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-primary" style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.12)" }}>
                  {s.icon}
                </div>
              </div>
              <StatNumber end={s.value} suffix={s.suffix} started={v} />
              <p className="text-muted-foreground leading-snug mt-1.5" style={{ fontSize: 13 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function StatNumber({ end, suffix, started }: { end: number; suffix: string; started: boolean }) {
  const count = useCounter(end, 1200, started);
  return (
    <p className="font-heading font-bold tabular-nums text-foreground" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1 }}>
      {count}{suffix}
    </p>
  );
}

/* ═══════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════ */
function FAQBlock() {
  const { ref, v } = useReveal();
  const faqs = [
    { q: "Cât costă un proiect?", a: "Depinde de complexitate. Automatizări simple pornesc de la 500€, aplicații web de la 2.000€. Primul apel e gratuit și-ți spunem sincer dacă te putem ajuta." },
    { q: "Cât durează să livrați?", a: "Automatizare simplă: 1-2 săptămâni. Site: 2-3 săptămâni. Aplicație web sau MVP: 4-8 săptămâni." },
    { q: "Ce se întâmplă dacă nu sunt mulțumit?", a: "Lucrăm cu plăți în etape. La orice punct poți opri și discutăm. Nu am lăsat niciun proiect nefinalizat." },
    { q: "Trebuie să știu tehnologie?", a: "Deloc. Tu ne spui problema, noi o rezolvăm. Comunicăm simplu, fără termeni tehnici." },
    { q: "Oferiți suport după livrare?", a: "Da, primele 30 zile sunt incluse. Apoi avem pachete de mentenanță lunară opționale." },
    { q: "Cu ce fel de firme lucrați?", a: "Cu antreprenori solo, startup-uri și firme mici care vor să crească fără echipă tech internă." },
  ];
  return (
    <Section id="faq" ref={ref} alt fadeIn fadeOut>
      <div style={{ maxWidth: 672, margin: "0 auto" }}>
        <motion.div {...scrollReveal()} className="text-center mb-10">
          <p className="label-sm mb-3">FAQ</p>
          <h2 className="font-heading font-bold text-foreground" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Întrebări frecvente</h2>
        </motion.div>
        <motion.div {...scrollReveal(0.1)}>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="glass-card border-none px-5">
                <AccordionTrigger className="text-left hover:no-underline py-4 font-heading font-semibold text-foreground" style={{ fontSize: 14 }}>{f.q}</AccordionTrigger>
                <AccordionContent className="pb-4 text-sm text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════
   FINAL CTA
   ═══════════════════════════════════════════════ */
function FinalCTABlock({ openQuiz }: { openQuiz: () => void }) {
  const { ref, v } = useReveal();
  return (
    <Section id="contact" ref={ref} divider style={{ overflow: "hidden" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-float-orb absolute" style={{ top: "30%", left: "40%", width: 400, height: 400, borderRadius: "50%", background: "hsl(var(--primary) / 0.06)", filter: "blur(150px)" }} />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
        className="relative z-10 text-center" style={{ maxWidth: 1152, margin: "0 auto" }}>
        <p className="label-sm mb-3">Hai să discutăm</p>
        <h2 className="font-heading font-bold text-foreground mb-4" style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}>
          Primul pas <span className="gradient-text-animated">nu costă nimic.</span>
        </h2>
        <p className="text-muted-foreground mx-auto mb-8" style={{ maxWidth: 440, fontSize: 14 }}>Scrie-ne pe WhatsApp sau completează formularul. Răspundem în câteva ore.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <motion.button onClick={openQuiz} className="btn-primary" style={{ padding: "14px 32px", fontSize: 15 }}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 36px hsl(var(--primary) / 0.45)" }} whileTap={{ scale: 0.97 }}>
            Completează formularul
          </motion.button>
          <motion.a href="https://wa.me/40700000000?text=Bun%C4%83!%20Am%20v%C4%83zut%20Nexora%20%C8%99i%20vreau%20s%C4%83%20discut%20despre%20un%20proiect." target="_blank" rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center justify-center gap-2" style={{ padding: "14px 28px", fontSize: 15, textDecoration: "none" }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <MessageCircle size={18} /> Scrie pe WhatsApp
          </motion.a>
        </div>
        <p className="text-muted-foreground/40" style={{ fontSize: 12 }}>Răspundem de obicei în sub 2 ore</p>
      </motion.div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════ */
function FooterBlock() {
  return (
    <footer className="relative z-2 border-t border-border">
      <div className="mx-auto" style={{ maxWidth: 1152, padding: "48px 24px" }}>
        {/* Top grid */}
        <div className="grid gap-8 mb-12" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          <div>
            <div className="flex items-center gap-2 font-heading font-bold text-foreground mb-3" style={{ fontSize: 16 }}>
              <Zap size={16} className="text-primary" /> Nexora
            </div>
            <p className="text-sm text-muted-foreground/50 leading-relaxed mb-4">Tehnologia care lucrează pentru tine, nu invers.</p>
            <div className="text-xs text-muted-foreground/40 leading-relaxed">
              <p className="font-medium text-muted-foreground/60 mb-1">Pădurean Gabriel-Leonard PFA</p>
              <p>CUI: 54354457</p>
              <p>Nr. înreg.: F2026016431005</p>
              <p className="mt-1">Bd. Bucureștii Noi nr. 136,</p>
              <p>Sector 1, București</p>
            </div>
          </div>
          <div>
            <h4 className="label-sm mb-3">Servicii</h4>
            {["Automatizări", "Aplicații Web & SaaS", "AI Integrat", "Redesign & SEO", "Consultanță", "Prezență Online"].map(item => (
              <p key={item} className="text-sm text-muted-foreground/50 mb-2">{item}</p>
            ))}
          </div>
          <div>
            <h4 className="label-sm mb-3">Companie</h4>
            <a href="#cum-lucram" className="block text-sm text-muted-foreground/50 mb-2 hover:text-muted-foreground transition-colors" style={{ textDecoration: "none" }}>Cum lucrăm</a>
            <a href="#faq" className="block text-sm text-muted-foreground/50 mb-2 hover:text-muted-foreground transition-colors" style={{ textDecoration: "none" }}>FAQ</a>
            <a href="#" className="block text-sm text-muted-foreground/50 mb-2 hover:text-muted-foreground transition-colors" style={{ textDecoration: "none" }}>Politica de confidențialitate</a>
            <a href="#" className="block text-sm text-muted-foreground/50 mb-2 hover:text-muted-foreground transition-colors" style={{ textDecoration: "none" }}>Termeni și condiții</a>
            <a href="#" className="block text-sm text-muted-foreground/50 mb-2 hover:text-muted-foreground transition-colors" style={{ textDecoration: "none" }}>Politica cookies</a>
          </div>
          <div>
            <h4 className="label-sm mb-3">Contact</h4>
            <a href="https://wa.me/40700000000" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground/50 mb-2 hover:text-muted-foreground transition-colors" style={{ textDecoration: "none" }}>WhatsApp</a>
            <a href="mailto:contact@nexora.ro" className="block text-sm text-muted-foreground/50 mb-2 hover:text-muted-foreground transition-colors" style={{ textDecoration: "none" }}>contact@nexora.ro</a>

            <h4 className="label-sm mb-3 mt-6">Protecția consumatorilor</h4>
            <a href="https://anpc.ro/" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground/50 mb-2 hover:text-muted-foreground transition-colors" style={{ textDecoration: "none" }}>ANPC</a>
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground/50 mb-2 hover:text-muted-foreground transition-colors" style={{ textDecoration: "none" }}>SOL (Soluționare Online Litigii)</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted-foreground/30">
          <p>© {new Date().getFullYear()} Nexora. Toate drepturile rezervate.</p>
          <div className="flex flex-wrap gap-4">
            <a href="https://anpc.ro/" target="_blank" rel="noopener noreferrer" className="hover:text-muted-foreground transition-colors" style={{ textDecoration: "none" }}>ANPC</a>
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="hover:text-muted-foreground transition-colors" style={{ textDecoration: "none" }}>SOL</a>
            <a href="#" className="hover:text-muted-foreground transition-colors" style={{ textDecoration: "none" }}>Confidențialitate</a>
            <a href="#" className="hover:text-muted-foreground transition-colors" style={{ textDecoration: "none" }}>Termeni</a>
            <a href="#" className="hover:text-muted-foreground transition-colors" style={{ textDecoration: "none" }}>GDPR</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   QUIZ MODAL
   ═══════════════════════════════════════════════ */
function QuizModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => { setStep(1); setA1(""); setA2(""); setName(""); setPhone(""); setEmail(""); setDone(false); setSubmitting(false); };
  const close = () => { onClose(); setTimeout(reset, 300); };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) return;
    setSubmitting(true);
    try {
      await supabase.from("leads").insert({ name: name.trim(), phone: phone.trim(), email: email.trim() || null, challenge: a1 || null, company_size: a2 || null, status: "new" });
    } catch { /* still show success */ }
    setDone(true);
    setSubmitting(false);
  };

  const inputStyle: React.CSSProperties = { width: "100%", background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "hsl(var(--foreground))", outline: "none" };
  const challenges = [
    { icon: <Cog size={16} />, label: "Procese manuale" },
    { icon: <Globe size={16} />, label: "Lipsă vizibilitate online" },
    { icon: <MessageCircle size={16} />, label: "Comunicare haotică" },
    { icon: <Brain size={16} />, label: "Vreau AI în business" },
  ];
  const sizes = ["Solo / Freelancer", "2-10 angajați", "10-50 angajați", "50+"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "hsl(var(--background) / 0.88)", backdropFilter: "blur(12px)" }} onClick={close}>
          <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-card w-full relative" style={{ maxWidth: 400, padding: 28, borderColor: "hsl(var(--primary) / 0.2)" }} onClick={e => e.stopPropagation()}>
            <button onClick={close} aria-label="Închide" className="absolute top-3.5 right-3.5 text-muted-foreground hover:text-foreground transition-colors" style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={18} />
            </button>

            {!done && (
              <div className="mb-6">
                <div className="flex gap-1 mb-1.5">
                  {[1, 2, 3].map(s => (
                    <div key={s} className="h-0.5 flex-1 rounded-full transition-all" style={{ background: s <= step ? "linear-gradient(90deg, hsl(var(--primary)), hsl(230 100% 58%))" : "hsl(var(--border))" }} />
                  ))}
                </div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40">Pasul {step} din 3</p>
              </div>
            )}

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-5">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                    className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "hsl(160 60% 45% / 0.1)", border: "1px solid hsl(160 60% 45% / 0.2)" }}>
                    <Check size={24} style={{ color: "hsl(160 60% 45%)" }} />
                  </motion.div>
                  <h3 className="font-heading font-bold text-foreground text-lg mb-2">Mulțumim, {name}!</h3>
                  <p className="text-sm text-muted-foreground mb-1.5">Am primit datele tale. Te contactăm în curând!</p>
                  <p className="text-xs text-muted-foreground/50">De obicei răspundem pe WhatsApp în max 2 ore.</p>
                </motion.div>
              ) : step === 1 ? (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="font-heading font-semibold text-foreground mb-4" style={{ fontSize: 17 }}>Care e cea mai mare provocare?</h3>
                  <div className="grid gap-1.5">
                    {challenges.map(o => (
                      <motion.button key={o.label} onClick={() => { setA1(o.label); setStep(2); }} className="glass-card-hover"
                        whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                        style={{ padding: 14, textAlign: "left", display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "hsl(0 0% 82%)", cursor: "pointer", background: "none" }}>
                        <span className="text-primary">{o.icon}</span>{o.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : step === 2 ? (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="font-heading font-semibold text-foreground mb-4" style={{ fontSize: 17 }}>Câți oameni are firma ta?</h3>
                  <div className="grid gap-1.5">
                    {sizes.map(o => (
                      <motion.button key={o} onClick={() => { setA2(o); setStep(3); }} className="glass-card-hover"
                        whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                        style={{ padding: 14, textAlign: "left", fontSize: 14, color: "hsl(0 0% 82%)", cursor: "pointer", background: "none" }}>{o}</motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="font-heading font-semibold text-foreground mb-4" style={{ fontSize: 17 }}>Lasă-ne datele tale</h3>
                  <div className="flex flex-col gap-2.5">
                    <input placeholder="Nume" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                    <input placeholder="WhatsApp / Telefon" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
                    <input placeholder="Email (opțional)" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
                    <motion.button onClick={handleSubmit} disabled={!name.trim() || !phone.trim() || submitting} className="btn-primary w-full mt-1.5"
                      whileHover={name.trim() && phone.trim() && !submitting ? { scale: 1.02 } : {}} whileTap={name.trim() && phone.trim() && !submitting ? { scale: 0.98 } : {}}
                      style={{ padding: 13, opacity: (!name.trim() || !phone.trim() || submitting) ? 0.4 : 1, cursor: (!name.trim() || !phone.trim() || submitting) ? "not-allowed" : "pointer" }}>
                      {submitting ? "Se trimite..." : "Trimite"}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════
   COOKIE BANNER
   ═══════════════════════════════════════════════ */
function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => { if (!localStorage.getItem("cookie-ok")) setShow(true); }, 2000);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
      className="glass-card fixed z-40 flex items-center justify-between gap-4" style={{ bottom: 16, left: 16, right: 90, maxWidth: 440, padding: "14px 18px", fontSize: 13 }}>
      <p className="text-muted-foreground">Folosim cookie-uri pentru o experiență mai bună.</p>
      <button onClick={() => { localStorage.setItem("cookie-ok", "1"); setShow(false); }} className="btn-sm shrink-0">Accept</button>
    </motion.div>
  );
}

export default Index;
