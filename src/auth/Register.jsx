// src/auth/Register.jsx

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/services/apiService";

// ✅ IMPORT JSON directly (no fetch needed)
import districtsData from "@/assets/data/tamilnadu_locations.json";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    district: "",
    category: "buyer",
  });

  const [districts, setDistricts] = useState([]);
  const [obscure, setObscure] = useState(true);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load districts from imported JSON
  useEffect(() => {
    try {
      const districtList = Object.keys(districtsData);
      setDistricts(districtList);
    } catch (error) {
      console.error("❌ loadDistricts error 👉", error);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone: only digits, max 10
    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, [name]: digits });
      return;
    }

    // Password: only digits
    if (name === "password") {
      const digits = value.replace(/\D/g, "");
      setForm({ ...form, [name]: digits });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleRegister = async () => {
  if (loading) return;

  if (!agree) {
    alert("Please accept Terms & Conditions");
    return;
  }

  if (!form.name || !form.phone || !form.password || !form.district) {
    alert("All fields required");
    return;
  }

  if (form.phone.length !== 10) {
    alert("Phone number must be exactly 10 digits");
    return;
  }

  if (form.password.length < 6) {
    alert("Password must be at least 6 digits");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      name: form.name,
      phone: form.phone,
      password: form.password,
      category: form.category,
      district: form.district,
      address: "NA",
    };

    const res = await registerUser(payload);

    setLoading(false);

    if (res.success) {
      navigate("/disclaimer", { replace: true });
    } else {
      alert(res.message || "Registration failed");
    }
  } catch (err) {
    setLoading(false);
    alert("Network error");
  }
};

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
      >
        <source
          src="https://res.cloudinary.com/dtqxc3rmt/video/upload/v1767108059/car_vid_kiee4t.mp4"
          type="video/mp4"
        />
      </video>

      {/* Glassmorphism Overlay – Blue tint */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-blue-900/30" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Login Button – fixed top right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-6 right-6"
        >
          <button
            onClick={() => navigate("/login")}
            className="tracking-widest text-sm hover:text-blue-300 transition text-white"
          >
            LOGIN
          </button>
        </motion.div>

        {/* Main Centered Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-20 py-10">
          <div className="w-full max-w-md">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1 }}
              className="text-4xl md:text-5xl font-bold mb-12 drop-shadow-lg text-white text-center"
            >
              Create account.
            </motion.h1>

            {/* Form */}
            <div className="space-y-4">
              <AnimatedField delay={0.2}>
                <InputBox
                  placeholder="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </AnimatedField>

              <AnimatedField delay={0.35}>
                <InputBox
                  placeholder="Phone Number (10 digits)"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </AnimatedField>

              <AnimatedField delay={0.5}>
                <div className="relative">
                  <InputBox
                    placeholder="Password (6+ digits)"
                    name="password"
                    type={obscure ? "password" : "text"}
                    value={form.password}
                    onChange={handleChange}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <button
                    type="button"
                    onClick={() => setObscure(!obscure)}
                    className="absolute right-4 top-4 text-black"
                  >
                    👁
                  </button>
                </div>
              </AnimatedField>

              <AnimatedField delay={0.65}>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className="w-full bg-white/95 text-black rounded-xl px-5 py-4 font-medium outline-none"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </AnimatedField>

              <AnimatedField delay={0.8}>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-white/95 text-black rounded-xl px-5 py-4 font-medium outline-none"
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="driver">Driver</option>
                </select>
              </AnimatedField>

              {/* Terms */}
              <AnimatedField delay={0.95}>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={() => setAgree(!agree)}
                    className="w-5 h-5"
                  />
                  <span
                    onClick={() => navigate("/terms")}
                    className="text-sm cursor-pointer hover:text-blue-300 transition text-white"
                  >
                    I agree to the Terms & Conditions
                  </span>
                </div>
              </AnimatedField>

              {/* Button */}
              <AnimatedField delay={1.1}>
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleRegister}
                    disabled={!agree || loading}
                    className="w-44 h-14 rounded-full bg-white/90 text-black font-bold tracking-wider shadow-lg hover:scale-105 transition disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "SEND OTP"}
                  </button>
                </div>
              </AnimatedField>
            </div>
          </div>
        </div>
      </div>

      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

/* Animation Wrapper */
function AnimatedField({ children, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/* Input Component */
function InputBox({ placeholder, ...props }) {
  return (
    <input
      {...props}
      placeholder={placeholder}
      className="w-full bg-white/95 text-black rounded-xl px-5 py-4 font-medium outline-none"
    />
  );
}