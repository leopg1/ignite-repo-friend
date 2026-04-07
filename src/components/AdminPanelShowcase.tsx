import { motion } from "framer-motion";
import { BarChart3, Users, TrendingUp, ArrowUpRight, Bell, Search, MoreHorizontal, ChevronRight } from "lucide-react";

const miniBarData = [35, 55, 40, 70, 50, 85, 65, 90, 75, 95, 80, 60];
const recentActivity = [
  { name: "Andrei M.", action: "Comandă nouă", amount: "+€1,240", time: "2m", bg: "hsl(160 60% 45% / 0.15)", fg: "hsl(160 60% 45%)" },
  { name: "Maria P.", action: "Cont creat", amount: "", time: "5m", bg: "hsl(var(--primary) / 0.15)", fg: "hsl(var(--primary))" },
  { name: "Ion V.", action: "Plată procesată", amount: "+€890", time: "12m", bg: "hsl(var(--accent) / 0.15)", fg: "hsl(var(--accent))" },
  { name: "Elena D.", action: "Abonament upgrade", amount: "+€49/lună", time: "18m", bg: "hsl(160 60% 45% / 0.15)", fg: "hsl(160 60% 45%)" },
];

export default function AdminPanelShowcase() {
  return (
    <div
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
          app.nexora.ro/dashboard
        </div>
        <div className="flex items-center gap-2">
          <Bell size={13} className="text-muted-foreground" />
          <div className="w-5 h-5 rounded-full" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }} />
        </div>
      </div>

      {/* Dashboard content */}
      <div className="flex" style={{ minHeight: 320 }}>
        {/* Mini sidebar */}
        <div className="hidden sm:flex flex-col items-center gap-3 py-4 px-2.5" style={{ borderRight: "1px solid hsl(var(--border))", width: 48 }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.15)" }}>
            <BarChart3 size={14} className="text-primary" />
          </div>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Users size={14} />
          </div>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <TrendingUp size={14} />
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 p-4 sm:p-5 space-y-4">
          {/* Top stats */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "Venituri", value: "€24,580", change: "+18.2%", up: true },
              { label: "Utilizatori", value: "1,247", change: "+12.5%", up: true },
              { label: "Conversie", value: "4.8%", change: "+0.6%", up: true },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="rounded-xl p-3"
                style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border) / 0.5)" }}
              >
                <p style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{stat.label}</p>
                <p className="font-heading font-bold text-foreground" style={{ fontSize: 17 }}>{stat.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight size={10} style={{ color: "hsl(160 60% 45%)" }} />
                  <span style={{ fontSize: 10, color: "hsl(160 60% 45%)", fontWeight: 500 }}>{stat.change}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Chart area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex-1 rounded-xl p-3"
              style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border) / 0.5)" }}
            >
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
                    transition={{ delay: 0.7 + i * 0.04, duration: 0.5, ease: "easeOut" }}
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
            </motion.div>

            {/* Activity feed */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="sm:w-[200px] rounded-xl p-3"
              style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border) / 0.5)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <p style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--foreground))" }}>Activitate</p>
                <ChevronRight size={12} className="text-muted-foreground" />
              </div>
              <div className="space-y-2.5">
                {recentActivity.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }}
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
            </motion.div>
          </div>
        </div>
      </div>

      {/* Reflection/glow overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, hsl(var(--primary) / 0.03) 0%, transparent 40%)" }} />
    </div>
  );
}
