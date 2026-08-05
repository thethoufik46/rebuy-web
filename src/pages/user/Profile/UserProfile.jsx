// src/pages/user/Profile/UserProfile.jsx

import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserDetails,
  updateUserDetails,
  uploadProfileImage,
  profileImageUrl,
  logout,
} from "@/services/apiService";
import districtsData from "@/assets/data/tamilnadu_locations.json";
import BottomGlassNavBar from "@/components/BottomGlassNavBar";
import AccountSettingsSection from "./AccountSettingsSection"; // local import

// ─── Cache ─────────────────────────────────────────────────
let cachedUser = null;
let cacheTime = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const UserProfile = () => {
  const navigate = useNavigate();

  // ─── State ────────────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Edit modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editDistrict, setEditDistrict] = useState("");

  // Image
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // ─── Load districts ──────────────────────────────────────
  useEffect(() => {
    setDistricts(Object.keys(districtsData));
  }, []);

  // ─── Load user (with caching) ────────────────────────────
  const loadUser = useCallback(async () => {
    // Check cache
    if (cachedUser && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
      setUser(cachedUser);
      setSelectedDistrict(cachedUser.district || "");
      setIsLoading(false);
      return;
    }

    try {
      const data = await getUserDetails();
      if (data) {
        cachedUser = data;
        cacheTime = Date.now();
        setUser(data);
        setSelectedDistrict(data.district || "");
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // ─── Image helpers ────────────────────────────────────────
  const getProfileImageUrl = () => {
    if (imagePreview) return imagePreview;
    if (user?.profileImage) return profileImageUrl(user.profileImage);
    return "https://cdn-icons-png.flaticon.com/512/1144/1144709.png";
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  // ─── Open edit modal ──────────────────────────────────────
  const openEditModal = () => {
    if (!user) return;
    setEditName(user.name || "");
    setEditPhone(user.phone || "");
    setEditEmail(user.email || "");
    setEditAddress(user.address || "");
    setEditDistrict(user.district || "");
    setIsEditing(true);
  };

  // ─── Save profile ─────────────────────────────────────────
  const saveProfile = async () => {
    try {
      await updateUserDetails({
        name: editName,
        phone: editPhone,
        email: editEmail,
        district: editDistrict,
        address: editAddress,
      });

      if (imageFile) {
        await uploadProfileImage({ imageFile });
      }

      cachedUser = null;
      cacheTime = null;
      await loadUser();

      setImageFile(null);
      setImagePreview(null);
      setIsEditing(false);

      alert("✅ Profile updated successfully");
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to update profile");
    }
  };

  // ─── Change password navigation ──────────────────────────
  const goToChangePassword = () => {
    navigate("/change-password");
  };

  // ─── Logout ──────────────────────────────────────────────
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ─── Render ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EEF2FF]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF2FF] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-32 -left-24 w-64 h-64 rounded-full bg-blue-400/25 blur-2xl" />
      <div className="absolute -top-16 -right-20 w-56 h-56 rounded-full bg-purple-400/30 blur-2xl" />
      <div className="absolute bottom-40 right-0 w-44 h-44 rounded-full bg-purple-300/20 blur-2xl" />

      {/* Main content */}
      <div className="relative z-10">
        {/* Gradient header */}
        <div className="bg-gradient-to-br from-[#7C5CFC] via-[#9F7AEA] to-[#C4B5FD] rounded-b-[42px] px-6 pt-16 pb-12 shadow-lg">
          <div className="flex flex-col items-center">
            {/* Profile image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <div className="p-1 rounded-full border-2 border-white/60 shadow-xl">
                <div className="w-28 h-28 rounded-full bg-white p-1">
                  <img
                    src={getProfileImageUrl()}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <button
                onClick={triggerFileInput}
                className="absolute bottom-1 right-1 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] p-2 rounded-full shadow-md hover:scale-105 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImagePick}
              />
            </motion.div>

            {/* Name */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-extrabold text-white mt-4 tracking-wide"
            >
              {user?.name || "User"}
            </motion.h2>

            {/* Phone & Email */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-3 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30"
            >
              <span className="text-white font-semibold text-sm">
                {user?.phone || "N/A"} • {user?.email || "N/A"}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Address Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-4 -mt-6"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 border border-white/60 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] p-3 rounded-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Address
                </p>
                <p className="text-base font-bold text-gray-800 mt-1 leading-relaxed">
                  {user?.address || "No address"}, {user?.district || ""}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mx-4 mt-4"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-sm overflow-hidden">
            <AccountSettingsSection
              onEditProfile={openEditModal}
              onChangePassword={goToChangePassword}
              onLogout={handleLogout}
            />
          </div>
        </motion.div>

        <div className="h-32" />
      </div>

      {/* Bottom Navigation */}
      <BottomGlassNavBar currentIndex={4} />

      {/* ====================================================
          EDIT MODAL (Bottom Sheet)
          ==================================================== */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="w-full max-w-md bg-[#F8FAFC] rounded-t-3xl p-6 pb-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-14 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

            {/* Profile image (click to change) */}
            <div className="flex justify-center mb-6">
              <button onClick={triggerFileInput} className="relative">
                <div className="w-24 h-24 rounded-full bg-white shadow-md overflow-hidden">
                  <img
                    src={getProfileImageUrl()}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] p-2 rounded-full shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagePick}
                />
              </button>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <TextField
                label="Full Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                icon={
                  <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />
              <TextField
                label="Phone"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                icon={
                  <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />
              <TextField
                label="Email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                type="email"
                icon={
                  <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              <DropdownField
                label="District"
                value={editDistrict}
                options={districts}
                onChange={(val) => setEditDistrict(val)}
                icon={
                  <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />
              <TextField
                label="Address"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                icon={
                  <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                }
              />
            </div>

            <button
              onClick={saveProfile}
              className="w-full mt-8 py-4 bg-[#8B5CF6] hover:bg-[#7C5CFC] text-white font-bold rounded-2xl transition"
            >
              SAVE CHANGES
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Reusable TextField ────────────────────────────────────
const TextField = ({ label, value, onChange, type = "text", icon }) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2">{icon}</div>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={label}
      className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#8B5CF6] text-gray-800"
    />
  </div>
);

// ─── Reusable Dropdown ─────────────────────────────────────
const DropdownField = ({ label, value, options, onChange, icon }) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2">{icon}</div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#8B5CF6] text-gray-800 appearance-none"
    >
      <option value="">Select {label}</option>
      {options.map((d) => (
        <option key={d} value={d}>
          {d}
        </option>
      ))}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

export default UserProfile;