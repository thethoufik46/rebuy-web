// src/pages/user/Profile/AccountSettingsSection.jsx

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AccountSettingsSection = ({
  onEditProfile,
  onChangePassword,
  onLogout,
}) => {
  const navigate = useNavigate();

  const items = [
    {
      icon: (
        <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      label: "Edit Profile",
      onClick: onEditProfile,
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      label: "Change Password",
      onClick: onChangePassword,
    },
    {
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      label: "Logout",
      onClick: onLogout,
      textColor: "text-red-500",
    },
  ];

  return (
    <div className="divide-y divide-gray-100">
      {items.map((item, idx) => (
        <motion.button
          key={idx}
          whileTap={{ scale: 0.97 }}
          onClick={item.onClick}
          className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/20 transition"
        >
          <span className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
            {item.icon}
          </span>
          <span className={`font-medium ${item.textColor || "text-gray-700"}`}>
            {item.label}
          </span>
          <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      ))}
    </div>
  );
};

export default AccountSettingsSection;