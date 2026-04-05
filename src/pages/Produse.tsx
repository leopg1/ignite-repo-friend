import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Zap, Check, Star, MessageCircle, ArrowLeft, Shield, Clock, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";

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

const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease: "easeOut" as const } });

const Produse = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="bg-background text-foreground" style={{ minHeight: "100vh" }}>
      {/* HEADER */}
      <motion.header
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          transition: "background 0.5s, backdrop-filter 0.5s, border-color 0.5s",
          background: scrolled ? "hsl(var(--background) / 0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid hsl(var(--border))" : "1px solid transparent",
        }}>
        <div className="flex items-center justify-between h-14 px-4 md:h-16 md:px-6" style={{ maxWidth: 1152, margin: "0 auto" }}>
          <Link to="/" className="flex items-center gap-2 font-heading font-bold text-foreground" style={{ fontSize: 17, textDecoration: "none" }}>
            <Zap size={18} className="text-primary" /> Nexora
          </Link>
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 14, textDecoration: "none" }}>
            <ArrowLeft size={16} /> Înapoi la pagina principală
          </Link>
        </div>
      </motion.header>

      {/* HERO */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-float-orb animate-pulse-glow" style={{ position: "absolute", top: "20%", left: "30%", width: 500, height: 500, borderRadius: "50%", background: "hsl(var(--primary) / 0.06)", filter: "blur(140px)" }} />
        </div>
        <div className="relative z-10 text-center" style={{ maxWidth: 800, margin: "0 auto" }}>
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-1.5 rounded-full mb-5" style={{ padding: "5px 14px", background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.15)", fontSize: 12, fontWeight: 500 }}>
            <span className="text-primary">Produse proprii Nexora</span>
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="font-heading font-bold text-foreground mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}>
            SaaS-uri <span className="gradient-text-animated">dezvoltate de noi.</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-muted-foreground mx-auto" style={{ fontSize: "clamp(0.875rem, 1.5vw, 1.1rem)", maxWidth: 560, lineHeight: 1.7 }}>
            Nu doar construim pentru alții — avem și produse proprii, live și funcționale. Fiecare produs rezolvă o problemă reală de business.
          </motion.p>
        </div>
      </section>

      {/* REPLICAI */}
      <ProductSection
        name="ReplicAI"
        icon={<Star size={32} />}
        tagline="Răspunsuri inteligente la review-uri, pe pilot automat."
        description="Platforma se conectează la Google Maps, Booking și alte platforme de review-uri ale afacerii tale. AI-ul analizează fiecare review și generează un răspuns personalizat, profesional. Clientul intră în platformă, apasă un buton, și review-ul e rezolvat."
        features={[
          { icon: <Globe size={18} />, title: "Conectare multi-platformă", desc: "Google Maps, Booking, TripAdvisor și alte platforme — toate centralizate într-un singur loc." },
          { icon: <Zap size={18} />, title: "Răspuns AI instant", desc: "AI-ul analizează tonul review-ului și generează un răspuns profesional, personalizat, în sub 5 secunde." },
          { icon: <Users size={18} />, title: "Zero efort manual", desc: "Clientul intră în platformă, vede review-urile noi, apasă un buton — gata. Fără copiat, fără formulări." },
          { icon: <Shield size={18} />, title: "Protecție reputație", desc: "Niciun review nu rămâne fără răspuns. Răspunsuri rapide îmbunătățesc ratingul și încrederea clienților." },
        ]}
        metrics={[
          { value: "95%", label: "Timp economisit" },
          { value: "<5s", label: "Per răspuns generat" },
          { value: "24/7", label: "Funcționare non-stop" },
          { value: "5★", label: "Rating menținut" },
        ]}
        reverse={false}
      />

      {/* AI CHATBOT */}
      <ProductSection
        name="AI Chatbot"
        icon={<MessageCircle size={32} />}
        tagline="Un chatbot AI antrenat pe afacerea ta, integrat direct în site."
        description="Chatbot-ul este antrenat conform specificului afacerii — produse, servicii, tone of voice. Se integrează direct în website-ul clientului printr-un simplu snippet de cod. Răspunde vizitatorilor 24/7, califică lead-uri și reduce presiunea pe echipă."
        features={[
          { icon: <Shield size={18} />, title: "Antrenament custom", desc: "Chatbot-ul învață din datele tale reale: produse, prețuri, întrebări frecvente, procese interne." },
          { icon: <Globe size={18} />, title: "Integrare simplă", desc: "Un singur snippet de cod în site-ul tău. Funcționează pe orice platformă: WordPress, React, Shopify." },
          { icon: <Users size={18} />, title: "Calificare lead-uri", desc: "Filtrează automat vizitatorii. Trimite doar lead-urile calificate către echipa ta de vânzări." },
          { icon: <Clock size={18} />, title: "Suport non-stop", desc: "Răspunde instant la întrebări, chiar și noaptea sau în weekend, fără intervenție umană." },
        ]}
        metrics={[
          { value: "80%", label: "Întrebări rezolvate" },
          { value: "2min", label: "Timp de integrare" },
          { value: "0", label: "Cod necesar" },
          { value: "∞", label: "Conversații simultane" },
        ]}
        reverse={true}
      />

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 className="font-heading font-bold text-foreground mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}>
            Vrei un produs <span className="gradient-text">similar?</span>
          </h2>
          <p className="text-muted-foreground mb-8" style={{ fontSize: 14 }}>
            Construim SaaS-uri la cheie. Spune-ne ideea și o transformăm în produs funcțional.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/#contact" className="btn-primary inline-flex items-center justify-center" style={{ padding: "14px 32px", fontSize: 15, textDecoration: "none" }}>
              Discută cu noi
            </Link>
            <Link to="/" className="btn-secondary inline-flex items-center justify-center" style={{ padding: "14px 28px", fontSize: 15, textDecoration: "none" }}>
              Înapoi la site
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="mx-auto px-6 py-8 text-center text-xs text-muted-foreground/30" style={{ maxWidth: 1152 }}>
          <p>© {new Date().getFullYear()} Nexora. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </div>
  );
};

function ProductSection({ name, icon, tagline, description, features, metrics, reverse }: {
  name: string;
  icon: React.ReactNode;
  tagline: string;
  description: string;
  features: { icon: React.ReactNode; title: string; desc: string }[];
  metrics: { value: string; label: string }[];
  reverse: boolean;
}) {
  const { ref, v } = useReveal();

  return (
    <section ref={ref} className={reverse ? "" : ""} style={{ padding: "60px 24px", background: reverse ? "hsl(240 10% 5%)" : "transparent" }}>
      <div style={{ maxWidth: 1152, margin: "0 auto" }}>
        <div className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 items-start`}>
          {/* Info side */}
          <div className="flex-1">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-primary" style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.15)" }}>
                  {icon}
                </div>
                <div>
                  <h2 className="font-heading font-bold text-foreground" style={{ fontSize: 28 }}>{name}</h2>
                  <p className="text-muted-foreground" style={{ fontSize: 14 }}>{tagline}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8" style={{ fontSize: 15 }}>{description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {metrics.map((m, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 16 }} animate={v ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                    className="glass-card text-center" style={{ padding: "16px 12px" }}>
                    <p className="font-heading font-bold text-foreground" style={{ fontSize: 22 }}>{m.value}</p>
                    <p className="text-muted-foreground" style={{ fontSize: 11, marginTop: 2 }}>{m.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Features side */}
          <div className="flex-1">
            <div className="space-y-4">
              {features.map((f, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: reverse ? -20 : 20 }}
                  animate={v ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                  className="glass-card-hover flex gap-4 items-start" style={{ padding: 20 }}>
                  <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-primary" style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.12)" }}>
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1" style={{ fontSize: 14 }}>{f.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Produse;
