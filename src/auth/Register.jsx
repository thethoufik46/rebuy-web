import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/services/apiService";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    category: "buyer",
  });

  const [obscure, setObscure] = useState(true);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {

    if (loading) return;   // ✅ Prevent spam clicks

    if (!agree) {
      alert("Please accept Terms & Conditions");
      return;
    }

    if (!form.name || !form.phone || !form.password) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      const res = await registerUser(form);

      setLoading(false);

      if (res.success) {
        navigate("/disclaimer");   // 👑 FINAL FLOW
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

      {/* 🎥 Video Background */}
      <video autoPlay loop muted className="absolute w-full h-full object-cover">
        <source
          src="https://res.cloudinary.com/dtqxc3rmt/video/upload/v1767108059/car_vid_kiee4t.mp4"
          type="video/mp4"
        />
      </video>

      {/* 🌫 Blur */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-black/50" />

      {/* Content */}
      <div className="relative z-10 min-h-screen px-6 md:px-20 text-white">

        {/* LOGIN */}
      <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="flex justify-end pt-10"
>
  <button
    onClick={() => navigate("/login")}   // 👑 FIXED
    className="tracking-widest text-sm hover:text-blue-400 transition"
  >
    LOGIN
  </button>
</motion.div>


        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-bold mt-10 mb-12 drop-shadow-lg"
        >
          Create account.
        </motion.h1>

        {/* Form */}
        <div className="max-w-md space-y-4">

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
              placeholder="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </AnimatedField>

          <AnimatedField delay={0.5}>
            <div className="relative">
              <InputBox
                placeholder="Password"
                name="password"
                type={obscure ? "password" : "text"}
                value={form.password}
                onChange={handleChange}
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
          <AnimatedField delay={0.8}>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
                className="w-5 h-5"
              />

              <span
                onClick={() => navigate("/terms")}
                className="text-sm cursor-pointer hover:text-blue-400 transition"
              >
                I agree to the Terms & Conditions
              </span>
            </div>
          </AnimatedField>

          {/* Button */}
          <AnimatedField delay={0.95}>
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

      {/* Loader */}
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

/* Input */
function InputBox({ placeholder, ...props }) {
  return (
    <input
      {...props}
      placeholder={placeholder}
      className="w-full bg-white/95 text-black rounded-xl px-5 py-4 font-medium outline-none"
    />
  );
}
