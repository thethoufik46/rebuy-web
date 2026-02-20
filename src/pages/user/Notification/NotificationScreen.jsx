import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getNotifications } from "@/services/notificationApi";

export default function NotificationScreen() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const phoneNumber = "8270149856";
  const email = "re2buyall@gmail.com";

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.log("Notification error 👉", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  function timeAgo(date) {
    if (!date) return "";

    const d = new Date(date);
    const diff = Date.now() - d.getTime();

    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 60) return `${mins} min ago`;
    if (hrs < 24) return `${hrs} hrs ago`;
    return `${days} days ago`;
  }

  function callPhone() {
    window.location.href = `tel:${phoneNumber}`;
  }

  function openMail() {
    window.location.href = `mailto:${email}`;
  }

  function openLink(link) {
    if (!link) return;
    window.open(link, "_blank");
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-white/40">
        <div className="h-[70px] px-4 flex items-center gap-3">

          <GlassButton onClick={() => window.history.back()}>
            ←
          </GlassButton>

          <h1 className="text-xl font-bold text-slate-800">
            Notifications
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 max-w-2xl mx-auto">

        {loading ? (
          <Loader />
        ) : notifications.length === 0 ? (
          <div className="text-center mt-20 text-slate-500">
            No notifications found
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n, i) => (
              <NotificationCard
                key={n._id}
                notification={n}
                showContact={i === 0}
                timeAgo={timeAgo}
                onCall={callPhone}
                onMail={openMail}
                onOpen={openLink}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Loader() {
  return (
    <div className="flex justify-center mt-20">
      <div className="w-10 h-10 border-4 border-slate-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function NotificationCard({
  notification,
  showContact,
  timeAgo,
  onCall,
  onMail,
  onOpen,
}) {
  const hasLink = notification.link && notification.link.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        bg-white/70
        backdrop-blur-xl
        border border-white/40
        rounded-2xl
        p-4
        shadow-sm
      "
    >
      <div className="flex gap-3">

        {/* IMAGE */}
        <div className="
          w-14 h-14
          rounded-full
          bg-slate-200
          overflow-hidden
          flex items-center justify-center
        ">
          {notification.image ? (
            <img
              src={notification.image}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl">🔔</span>
          )}
        </div>

        {/* TEXT */}
        <div className="flex-1">

          <h2 className="text-sm font-bold text-slate-800">
            {notification.title}
          </h2>

          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {notification.description}
          </p>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 mt-2 text-xs">

            {showContact && (
              <>
                <button onClick={onCall} className="text-blue-600 font-semibold">
                  📞 8270149856
                </button>

                <span className="text-slate-400">|</span>

                <button onClick={onMail} className="text-blue-600 font-semibold">
                  📧 re2buyall@gmail.com
                </button>

                <span className="text-slate-400">|</span>
              </>
            )}

            <button
              onClick={() => hasLink && onOpen(notification.link)}
              className={`font-bold ${
                hasLink ? "text-indigo-600" : "text-slate-400"
              }`}
            >
              Open
            </button>
          </div>

          {/* TIME */}
          <div className="text-[10px] text-slate-400 mt-1">
            {timeAgo(notification.createdAt)}
          </div>

        </div>
      </div>
    </motion.div>
  );
}

function GlassButton({ children, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="
        w-10 h-10
        rounded-xl
        bg-white/70
        backdrop-blur-lg
        border border-white/40
        shadow-sm
      "
    >
      {children}
    </motion.button>
  );
}
