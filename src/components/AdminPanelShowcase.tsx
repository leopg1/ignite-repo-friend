import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Bell, Search, MoreHorizontal, ChevronRight, ShoppingCart, Settings, Check, Clock, AlertCircle } from "lucide-react";

const miniBarData = [35, 55, 40, 70, 50, 85, 65, 90, 75, 95, 80, 60];

/* ── Animated counter hook ── */
function useAnimatedNumber(target: number, duration = 1200, active = true) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>();
  useEffect(() => {
    if (!active) { setValue(0); return; }
    let start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(ease * target));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration, active]);
  return value;
}

function AnimatedValue({ target, prefix = "", suffix = "", decimals = 0, active = true }: { target: number; prefix?: string; suffix?: string; decimals?: number; active?: boolean }) {
  const val = useAnimatedNumber(target * (decimals ? 10 : 1), 1400, active);
  const display = decimals ? (val / 10).toFixed(decimals) : val.toLocaleString();
  return <>{prefix}{display}{suffix}</>;
}

/* ── Tab Data ── */
const dashboardActivity = [
  { name: "Andrei M.", action: "Comandă nouă", amount: "+€1,240", time: "2m", bg: "hsl(160 60% 45% / 0.15)", fg: "hsl(160 60% 45%)" },
  { name: "Maria P.", action: "Cont creat", amount: "", time: "5m", bg: "hsl(var(--primary) / 0.15)", fg: "hsl(var(--primary))" },
  { name: "Ion V.", action: "Plată procesată", amount: "+€890", time: "12m", bg: "hsl(var(--accent) / 0.15)", fg: "hsl(var(--accent))" },
  { name: "Elena D.", action: "Abonament upgrade", amount: "+€49/lună", time: "18m", bg: "hsl(160 60% 45% / 0.15)", fg: "hsl(160 60% 45%)" },
];

const usersData = [
  { name: "Andrei Marinescu", email: "andrei@firma.ro", plan: "Pro", status: "Activ" },
  { name: "Maria Popescu", email: "maria@startup.io", plan: "Business", status: "Activ" },
  { name: "Ion Vasilescu", email: "ion@companie.ro", plan: "Pro", status: "Trial" },
  { name: "Elena Dumitrescu", email: "elena@brand.ro", plan: "Enterprise", status: "Activ" },
  { name: "Cristian Radu", email: "cristian@shop.ro", plan: "Pro", status: "Inactiv" },
];

const ordersData = [
  { id: "#NX-1247", client: "Andrei M.", total: "€1,240", status: "completed", date: "Azi" },
  { id: "#NX-1246", client: "Elena D.", total: "€49/lună", status: "processing", date: "Azi" },
  { id: "#NX-1245", client: "Ion V.", total: "€890", status: "completed", date: "Ieri" },
  { id: "#NX-1244", client: "Maria P.", total: "€2,100", status: "pending", date: "Ieri" },
  { id: "#NX-1243", client: "Cristian R.", total: "€560", status: "completed", date: "2 zile" },
];

type TabKey = "dashboard" | "users" | "orders";

const tabKeys: TabKey[] = ["dashboard", "users", "orders"];
const tabs: { key: TabKey; icon: typeof BarChart3; label: string }[] = [
  { key: "dashboard", icon: BarChart3, label: "Dashboard" },
  { key: "users", icon: Users, label: "Utilizatori" },
  { key: "orders", icon: ShoppingCart, label: "Comenzi" },
];

const statusIcon = (s: string) => {
  if (s === "completed") return <Check size={10} />;
  if (s === "processing") return <Clock size={10} />;
  return <AlertCircle size={10} />;
};
const statusColor = (s: string) => {
  if (s === "completed") return "hsl(160 60% 45%)";
  if (s === "processing") return "hsl(var(--primary))";
  return "hsl(40 90% 55%)";
};

const AUTO_SWITCH_INTERVAL = 4000;

export default function AdminPanelShowcase() {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [isInView, setIsInView] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // IntersectionObserver for in-view detection
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      setIsInView(e.isIntersecting);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Auto-switch tabs
  useEffect(() => {
    if (!isInView || userInteracted) return;
    timerRef.current = setInterval(() => {
      setActiveTab(prev => {
        const idx = tabKeys.indexOf(prev);
        return tabKeys[(idx + 1) % tabKeys.length];
      });
    }, AUTO_SWITCH_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isInView, userInteracted]);

  // Reset auto after user stops interacting (10s)
  useEffect(() => {
    if (!userInteracted) return;
    const t = setTimeout(() => setUserInteracted(false), 10000);
    return () => clearTimeout(t);
  }, [userInteracted]);

  const handleTabClick = useCallback((key: TabKey) => {
    setActiveTab(key);
    setUserInteracted(true);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 60, scale: 0.92, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: "hsl(240 12% 6%)",
        border: "1px solid hsl(var(--border))",
        boxShadow: "0 25px 60px -12px hsl(var(--primary) / 0.08), 0 0 0 1px hsl(var(--border))",
      }}
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(0 72% 55%)" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(40 90% 55%)" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(160 60% 45%)" }} />
        </div>
        <div className="flex items-center gap-2 rounded-lg px-3 py-1" style={{ background: "hsl(var(--secondary))", fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
          <Search size={10} />
          <motion.span key={activeTab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            app.nexora.ro/{activeTab === "dashboard" ? "dashboard" : activeTab === "users" ? "users" : "orders"}
          </motion.span>
        </div>
        <div className="flex items-center gap-2">
          <Bell size={13} className="text-muted-foreground" />
          <div className="w-5 h-5 rounded-full" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }} />
        </div>
      </div>

      {/* Dashboard content */}
      <div className="flex" style={{ minHeight: 320 }}>
        {/* Mini sidebar */}
        <div className="hidden sm:flex flex-col items-center gap-1 py-4 px-2" style={{ borderRight: "1px solid hsl(var(--border))", width: 48 }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <motion.button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors relative"
                style={{
                  background: isActive ? "hsl(var(--primary) / 0.15)" : "transparent",
                  color: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  border: "none",
                  cursor: "pointer",
                }}
                title={tab.label}
              >
                <Icon size={14} />
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r"
                    style={{ background: "hsl(var(--primary))" }}
                  />
                )}
              </motion.button>
            );
          })}
          <div className="mt-auto">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground/40">
              <Settings size={14} />
            </div>
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 p-4 sm:p-5 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && <DashboardTab key="dashboard" />}
            {activeTab === "users" && <UsersTab key="users" />}
            {activeTab === "orders" && <OrdersTab key="orders" />}
          </AnimatePresence>
        </div>
      </div>

      {/* Auto-switch progress bar */}
      {!userInteracted && isInView && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5">
          <motion.div
            key={activeTab}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: AUTO_SWITCH_INTERVAL / 1000, ease: "linear" }}
            style={{ height: "100%", background: "hsl(var(--primary) / 0.4)" }}
          />
        </div>
      )}

      {/* Reflection/glow overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, hsl(var(--primary) / 0.03) 0%, transparent 40%)" }} />
    </motion.div>
  );
}

/* ── Dashboard Tab ── */
function DashboardTab() {
  const stats = [
    { label: "Venituri", target: 24580, prefix: "€", suffix: "", decimals: 0, change: "+18.2%" },
    { label: "Utilizatori", target: 1247, prefix: "", suffix: "", decimals: 0, change: "+12.5%" },
    { label: "Conversie", target: 48, prefix: "", suffix: "%", decimals: 1, change: "+0.6%" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-3 gap-2.5">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.08, duration: 0.4 }}
            className="rounded-xl p-3"
            style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border) / 0.5)" }}
          >
            <p style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{stat.label}</p>
            <p className="font-heading font-bold text-foreground" style={{ fontSize: 17 }}>
              <AnimatedValue target={stat.target} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
            </p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight size={10} style={{ color: "hsl(160 60% 45%)" }} />
              <span style={{ fontSize: 10, color: "hsl(160 60% 45%)", fontWeight: 500 }}>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 rounded-xl p-3" style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border) / 0.5)" }}>
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--foreground))" }}>Venituri lunare</p>
            <MoreHorizontal size={13} className="text-muted-foreground" />
          </div>
          <div className="flex items-end gap-1.5" style={{ height: 80 }}>
            {miniBarData.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.1 + i * 0.04, duration: 0.5, ease: "easeOut" }}
                className="flex-1 rounded-sm"
                style={{
                  background: i === miniBarData.length - 3
                    ? "hsl(var(--primary))"
                    : i >= miniBarData.length - 2
                      ? "hsl(var(--primary) / 0.7)"
                      : "hsl(var(--primary) / 0.2)",
                  minWidth: 6,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span style={{ fontSize: 9, color: "hsl(var(--muted-foreground))" }}>Ian</span>
            <span style={{ fontSize: 9, color: "hsl(var(--muted-foreground))" }}>Dec</span>
          </div>
        </div>

        <div className="sm:w-[200px] rounded-xl p-3" style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border) / 0.5)" }}>
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--foreground))" }}>Activitate</p>
            <ChevronRight size={12} className="text-muted-foreground" />
          </div>
          <div className="space-y-2.5">
            {dashboardActivity.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.35 }}
                className="flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: item.bg, fontSize: 8, fontWeight: 700, color: item.fg }}>
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ fontSize: 10, color: "hsl(var(--foreground))", fontWeight: 500 }}>{item.action}</p>
                  <p style={{ fontSize: 9, color: "hsl(var(--muted-foreground))" }}>{item.time} ago</p>
                </div>
                {item.amount && (
                  <span style={{ fontSize: 9, fontWeight: 600, color: "hsl(160 60% 45%)" }}>{item.amount}</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Users Tab ── */
function UsersTab() {
  const stats = [
    { label: "Total utilizatori", target: 1247, prefix: "", suffix: "", decimals: 0, change: "+42 luna asta" },
    { label: "Activi acum", target: 312, prefix: "", suffix: "", decimals: 0, change: "25% din total" },
    { label: "Rata retenție", target: 942, prefix: "", suffix: "%", decimals: 1, change: "+2.1%" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-3 gap-2.5">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.08, duration: 0.4 }}
            className="rounded-xl p-3"
            style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border) / 0.5)" }}
          >
            <p style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{stat.label}</p>
            <p className="font-heading font-bold text-foreground" style={{ fontSize: 17 }}>
              <AnimatedValue target={stat.target} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
            </p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight size={10} style={{ color: "hsl(160 60% 45%)" }} />
              <span style={{ fontSize: 10, color: "hsl(160 60% 45%)", fontWeight: 500 }}>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border) / 0.5)" }}>
        <div className="flex items-center justify-between px-3 py-2.5" style={{ borderBottom: "1px solid hsl(var(--border) / 0.3)" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--foreground))" }}>Utilizatori recenți</p>
          <div className="flex items-center gap-1.5 rounded-md px-2 py-1" style={{ background: "hsl(var(--background))", fontSize: 10, color: "hsl(var(--muted-foreground))" }}>
            <Search size={9} /> Caută...
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 px-3 py-1.5" style={{ fontSize: 9, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid hsl(var(--border) / 0.2)" }}>
          <span>Nume</span><span>Email</span><span>Plan</span><span>Status</span>
        </div>
        {usersData.map((user, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.06, duration: 0.3 }}
            className="grid grid-cols-4 gap-2 px-3 py-2 items-center"
            style={{ borderBottom: i < usersData.length - 1 ? "1px solid hsl(var(--border) / 0.1)" : "none" }}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.15)", fontSize: 7, fontWeight: 700, color: "hsl(var(--primary))" }}>
                {user.name.charAt(0)}
              </div>
              <span className="truncate" style={{ fontSize: 10, color: "hsl(var(--foreground))", fontWeight: 500 }}>{user.name}</span>
            </div>
            <span className="truncate" style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>{user.email}</span>
            <span className="inline-flex items-center rounded-full px-1.5 py-0.5 w-fit" style={{ fontSize: 9, fontWeight: 500, background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>{user.plan}</span>
            <span style={{
              fontSize: 9, fontWeight: 500,
              color: user.status === "Activ" ? "hsl(160 60% 45%)" : user.status === "Trial" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
            }}>● {user.status}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Orders Tab ── */
function OrdersTab() {
  const stats = [
    { label: "Comenzi azi", target: 23, prefix: "", suffix: "", decimals: 0, change: "+5 vs ieri", up: true },
    { label: "Valoare totală", target: 8420, prefix: "€", suffix: "", decimals: 0, change: "+22%", up: true },
    { label: "Rata anulare", target: 12, prefix: "", suffix: "%", decimals: 1, change: "-0.3%", up: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-3 gap-2.5">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.08, duration: 0.4 }}
            className="rounded-xl p-3"
            style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border) / 0.5)" }}
          >
            <p style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{stat.label}</p>
            <p className="font-heading font-bold text-foreground" style={{ fontSize: 17 }}>
              <AnimatedValue target={stat.target} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
            </p>
            <div className="flex items-center gap-1 mt-1">
              {stat.up
                ? <ArrowUpRight size={10} style={{ color: "hsl(160 60% 45%)" }} />
                : <ArrowDownRight size={10} style={{ color: "hsl(160 60% 45%)" }} />
              }
              <span style={{ fontSize: 10, color: "hsl(160 60% 45%)", fontWeight: 500 }}>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border) / 0.5)" }}>
        <div className="flex items-center justify-between px-3 py-2.5" style={{ borderBottom: "1px solid hsl(var(--border) / 0.3)" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--foreground))" }}>Comenzi recente</p>
          <MoreHorizontal size={13} className="text-muted-foreground" />
        </div>
        <div className="grid grid-cols-5 gap-2 px-3 py-1.5" style={{ fontSize: 9, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid hsl(var(--border) / 0.2)" }}>
          <span>ID</span><span>Client</span><span>Total</span><span>Status</span><span>Dată</span>
        </div>
        {ordersData.map((order, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.06, duration: 0.3 }}
            className="grid grid-cols-5 gap-2 px-3 py-2 items-center"
            style={{ borderBottom: i < ordersData.length - 1 ? "1px solid hsl(var(--border) / 0.1)" : "none" }}
          >
            <span style={{ fontSize: 10, color: "hsl(var(--primary))", fontWeight: 600, fontFamily: "monospace" }}>{order.id}</span>
            <span style={{ fontSize: 10, color: "hsl(var(--foreground))", fontWeight: 500 }}>{order.client}</span>
            <span style={{ fontSize: 10, color: "hsl(var(--foreground))", fontWeight: 600 }}>{order.total}</span>
            <div className="flex items-center gap-1" style={{ color: statusColor(order.status) }}>
              {statusIcon(order.status)}
              <span style={{ fontSize: 9, fontWeight: 500, textTransform: "capitalize" }}>{order.status === "completed" ? "Finalizat" : order.status === "processing" ? "Procesare" : "Pending"}</span>
            </div>
            <span style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>{order.date}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
