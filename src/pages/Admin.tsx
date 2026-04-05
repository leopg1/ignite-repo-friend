import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Inbox, Clock, CheckCircle, XCircle, ArrowLeft, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  challenge: string | null;
  company_size: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: "hsl(244 100% 72% / 0.1)", text: "hsl(244 100% 72%)", label: "Nou" },
  contacted: { bg: "hsl(40 90% 55% / 0.1)", text: "hsl(40 90% 55%)", label: "Contactat" },
  converted: { bg: "hsl(160 60% 45% / 0.1)", text: "hsl(160 60% 45%)", label: "Convertit" },
  lost: { bg: "hsl(0 72% 55% / 0.1)", text: "hsl(0 72% 55%)", label: "Pierdut" },
};

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchLeads();
  }, [session]);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setLeads(data);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("leads").update({ status }).eq("id", id);
    fetchLeads();
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "hsl(240 10% 3.9%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "hsl(240 5% 50%)", fontSize: 14 }}>Se încarcă...</div>
    </div>
  );

  if (!session) return (
    <div style={{ minHeight: "100vh", background: "hsl(240 10% 3.9%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card" style={{ width: "100%", maxWidth: 380, padding: 32 }}>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 22, color: "hsl(0 0% 94%)", marginBottom: 6 }}>Admin Nexora</h1>
        <p style={{ fontSize: 14, color: "hsl(240 5% 50%)", marginBottom: 24 }}>Autentifică-te pentru a vedea lead-urile.</p>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", background: "hsl(240 10% 8%)", border: "1px solid hsl(240 6% 16%)", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "hsl(0 0% 94%)", outline: "none" }} />
          <input type="password" placeholder="Parolă" value={password} onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", background: "hsl(240 10% 8%)", border: "1px solid hsl(240 6% 16%)", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "hsl(0 0% 94%)", outline: "none" }} />
          {authError && <p style={{ fontSize: 13, color: "hsl(0 72% 55%)" }}>{authError}</p>}
          <button type="submit" className="btn-primary" style={{ width: "100%", padding: "12px", marginTop: 4 }}>Intră în admin →</button>
        </form>
        <button onClick={() => navigate("/")} style={{ marginTop: 16, fontSize: 13, color: "hsl(240 5% 50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <ArrowLeft size={14} /> Înapoi la site
        </button>
      </motion.div>
    </div>
  );

  const filtered = filter === "all" ? leads : leads.filter(l => l.status === filter);
  const counts = {
    all: leads.length,
    new: leads.filter(l => l.status === "new").length,
    contacted: leads.filter(l => l.status === "contacted").length,
    converted: leads.filter(l => l.status === "converted").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "hsl(240 10% 3.9%)", color: "hsl(0 0% 94%)" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid hsl(240 6% 14%)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18 }}>📊 Admin Panel</h1>
          <span style={{ fontSize: 12, color: "hsl(240 5% 40%)", background: "hsl(240 10% 8%)", padding: "3px 10px", borderRadius: 6 }}>{leads.length} lead-uri</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={() => navigate("/")} style={{ fontSize: 13, color: "hsl(240 5% 50%)", background: "none", border: "none", cursor: "pointer" }}>← Site</button>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "hsl(0 72% 55%)", background: "none", border: "none", cursor: "pointer" }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total", value: counts.all, icon: <Inbox size={18} />, color: "hsl(244 100% 72%)" },
            { label: "Noi", value: counts.new, icon: <Clock size={18} />, color: "hsl(40 90% 55%)" },
            { label: "Contactați", value: counts.contacted, icon: <Eye size={18} />, color: "hsl(200 100% 60%)" },
            { label: "Convertiți", value: counts.converted, icon: <CheckCircle size={18} />, color: "hsl(160 60% 45%)" },
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: 16, textAlign: "center" }}>
              <div style={{ color: s.color, marginBottom: 8, display: "flex", justifyContent: "center" }}>{s.icon}</div>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 24 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: "hsl(240 5% 45%)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {["all", "new", "contacted", "converted", "lost"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                background: filter === f ? "hsl(244 100% 72% / 0.15)" : "hsl(240 10% 8%)",
                border: `1px solid ${filter === f ? "hsl(244 100% 72% / 0.3)" : "hsl(240 6% 16%)"}`,
                color: filter === f ? "hsl(244 100% 78%)" : "hsl(240 5% 55%)"
              }}>
              {f === "all" ? "Toate" : statusColors[f]?.label || f}
            </button>
          ))}
        </div>

        {/* Leads table */}
        <div className="glass-card" style={{ overflow: "hidden" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center", color: "hsl(240 5% 40%)" }}>
              <Inbox size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
              <p style={{ fontSize: 14 }}>Niciun lead {filter !== "all" ? `cu status "${statusColors[filter]?.label || filter}"` : "încă"}</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid hsl(240 6% 14%)" }}>
                    {["Nume", "Telefon", "Provocare", "Mărime", "Status", "Data"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "hsl(240 5% 40%)", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(lead => (
                    <tr key={lead.id} onClick={() => setSelected(lead)} style={{ borderBottom: "1px solid hsl(240 6% 12%)", cursor: "pointer", transition: "background 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "hsl(240 10% 6%)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={{ padding: "12px 16px", color: "hsl(0 0% 90%)", fontWeight: 500 }}>{lead.name}</td>
                      <td style={{ padding: "12px 16px", color: "hsl(240 5% 60%)" }}>{lead.phone}</td>
                      <td style={{ padding: "12px 16px", color: "hsl(240 5% 60%)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.challenge || "—"}</td>
                      <td style={{ padding: "12px 16px", color: "hsl(240 5% 60%)" }}>{lead.company_size || "—"}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 6, background: statusColors[lead.status]?.bg || "hsl(240 10% 10%)", color: statusColors[lead.status]?.text || "hsl(240 5% 50%)" }}>
                          {statusColors[lead.status]?.label || lead.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "hsl(240 5% 45%)", fontSize: 13 }}>
                        {new Date(lead.created_at).toLocaleDateString("ro-RO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Lead detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "hsl(240 10% 2% / 0.85)", backdropFilter: "blur(8px)" }}
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              className="glass-card" style={{ width: "100%", maxWidth: 480, padding: 28 }} onClick={e => e.stopPropagation()}>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 20 }}>{selected.name}</h3>
              <div style={{ display: "grid", gap: 14, marginBottom: 24 }}>
                <div><p style={{ fontSize: 11, color: "hsl(240 5% 40%)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Telefon</p><p style={{ fontSize: 15 }}>{selected.phone}</p></div>
                {selected.email && <div><p style={{ fontSize: 11, color: "hsl(240 5% 40%)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Email</p><p style={{ fontSize: 15 }}>{selected.email}</p></div>}
                {selected.challenge && <div><p style={{ fontSize: 11, color: "hsl(240 5% 40%)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Provocare</p><p style={{ fontSize: 15 }}>{selected.challenge}</p></div>}
                {selected.company_size && <div><p style={{ fontSize: 11, color: "hsl(240 5% 40%)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Mărime firmă</p><p style={{ fontSize: 15 }}>{selected.company_size}</p></div>}
                <div><p style={{ fontSize: 11, color: "hsl(240 5% 40%)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>Primit pe</p><p style={{ fontSize: 15 }}>{new Date(selected.created_at).toLocaleDateString("ro-RO", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p></div>
              </div>
              <p style={{ fontSize: 11, color: "hsl(240 5% 40%)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Schimbă status</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
                {Object.entries(statusColors).map(([key, val]) => (
                  <button key={key} onClick={() => updateStatus(selected.id, key)}
                    style={{
                      padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
                      background: selected.status === key ? val.bg : "hsl(240 10% 8%)",
                      border: `1px solid ${selected.status === key ? val.text + "44" : "hsl(240 6% 16%)"}`,
                      color: selected.status === key ? val.text : "hsl(240 5% 50%)"
                    }}>
                    {val.label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer"
                  className="btn-primary" style={{ flex: 1, textAlign: "center", textDecoration: "none", padding: "10px", fontSize: 13 }}>
                  WhatsApp →
                </a>
                <button onClick={() => setSelected(null)} className="btn-secondary" style={{ flex: 1, padding: "10px", fontSize: 13 }}>Închide</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}