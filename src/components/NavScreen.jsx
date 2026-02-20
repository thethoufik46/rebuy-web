import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function NavScreen() {
  const navigate = useNavigate();

  const go = (path) => navigate(path);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-gray-50 flex justify-center">
      
      <div className="w-full max-w-sm min-h-screen relative">

        {/* 🔹 TOP BAR */}
        <div className="flex items-center justify-between p-4">

          <GlassIcon onClick={() => navigate(-1)}>
            ←
          </GlassIcon>

          <img
            src="/assets/logo/logo_1.webp"
            alt="logo"
            className="h-7"
          />

          <div className="flex gap-2">
            <TopIcon onClick={() => go("/testimonials")}>⭐</TopIcon>
            <TopIcon onClick={() => go("/wishlist")}>🤍</TopIcon>
            <TopIcon onClick={() => go("/chat")}>💬</TopIcon>
            <TopIcon onClick={() => go("/profile")}>👤</TopIcon>
          </div>
        </div>

        {/* 🔥 GLASS PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-3 mt-4 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl"
        >
          <div className="py-3">

            <SectionTitle title="Account" />

            <NavItem label="My Profile" onClick={() => go("/profile")} />
            <NavItem label="My Orders (ஆர்டர்)" onClick={() => go("/orders")} />
            <NavItem label="Finance (பைனான்ஸ்)" onClick={() => go("/finance")} />

            <Divider />

            <SectionTitle title="Services" />
            <SubTitle text="Car Services" />

            <NavItem label="Car Need (கார் வாங்க)" onClick={() => go("/buy-car")} />
            <NavItem label="Car Sell (கார் விற்க)" onClick={() => go("/my-cars")} />
            <NavItem label="Filter Cars (தேடவும்)" onClick={() => go("/filter")} />

            <Divider />

            <SubTitle text="Property Services" />

            <NavItem label="Buy (வீடு வாங்க)" onClick={() => go("/buy-property")} />
            <NavItem label="Sell (வீடு விற்க)" onClick={() => go("/sell-property")} />

            <Divider />

            <SectionTitle title="Support" />

            <NavItem label="Cashback" onClick={() => go("/cashback")} />
            <NavItem label="Partners" onClick={() => go("/partners")} />
            <NavItem label="FAQ (கேள்வி & பதில்)" onClick={() => go("/faq")} />
            <NavItem label="Help & Support (உதவி)" onClick={() => go("/help")} />

            <Divider />

            <SectionTitle title="Legal" />

            <NavItem label="Company" onClick={() => go("/company")} />
            <NavItem label="Careers" onClick={() => go("/careers")} />
            <NavItem label="Privacy Policy" onClick={() => go("/privacy")} />
            <NavItem label="Terms & Conditions" onClick={() => go("/terms")} />
            <NavItem label="Refund & Cancellation" onClick={() => go("/refund")} />

            <Divider />

            <NavItem
              label="Logout"
              danger
              onClick={() => {
                localStorage.clear();
                go("/");
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ================= UI ================= */

function GlassIcon({ children, onClick }) {
  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="w-10 h-10 rounded-xl bg-white/70 backdrop-blur-lg border border-white/40 shadow-sm flex items-center justify-center cursor-pointer"
    >
      {children}
    </motion.div>
  );
}

function TopIcon({ children, onClick }) {
  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-lg border border-white/40 shadow-sm flex items-center justify-center cursor-pointer text-sm"
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="px-4 pt-4 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
      {title}
    </div>
  );
}

function SubTitle({ text }) {
  return (
    <div className="px-4 pt-2 pb-1 text-sm font-semibold text-slate-600">
      {text}
    </div>
  );
}

function NavItem({ label, onClick, danger }) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium cursor-pointer flex justify-between items-center ${
        danger ? "text-red-500" : "text-slate-800"
      } hover:bg-white/40`}
    >
      {label}
      <span className="text-slate-400">›</span>
    </motion.div>
  );
}

function Divider() {
  return (
    <div className="px-3">
      <div className="border-t border-white/40 my-2" />
    </div>
  );
}
