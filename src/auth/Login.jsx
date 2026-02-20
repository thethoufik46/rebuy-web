import { motion } from "framer-motion";

export default function Login({
  form,
  loading,
  obscure,
  setObscure,
  handleChange,
  handleLogin,
  playAudio,
}) {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* 🎥 Video Background */}
      <video autoPlay loop muted className="absolute w-full h-full object-cover">
        <source
          src="https://res.cloudinary.com/dtqxc3rmt/video/upload/v1767108059/car_vid_kiee4t.mp4"
          type="video/mp4"
        />
      </video>

      {/* 🌫 Overlay */}
      <div className="absolute inset-0 backdrop-blur-xl bg-black/40" />

      <div className="relative z-10 min-h-screen px-6 md:px-20">
        {/* REGISTER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex justify-end pt-10"
        >
          <button className="tracking-widest text-sm hover:text-blue-400 transition">
            REGISTER
          </button>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-light mt-16 mb-16 drop-shadow-lg"
        >
          Please sign in.
        </motion.h1>

        {/* Form */}
        <div className="max-w-md space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <InputBox
              placeholder="Email / Phone"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              onFocus={() => playAudio("mobile")}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative">
              <InputBox
                placeholder="Password"
                name="password"
                type={obscure ? "password" : "text"}
                value={form.password}
                onChange={handleChange}
                onFocus={() => playAudio("password")}
              />

              <button
                type="button"
                onClick={() => setObscure(!obscure)}
                className="absolute right-4 top-4 text-black"
              >
                👁
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <div className="flex justify-center pt-6">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="
                  w-44 h-14 rounded-full
                  bg-white/90 text-black font-bold tracking-wider
                  shadow-lg hover:scale-105 transition
                  disabled:opacity-50
                "
              >
                {loading ? "Loading..." : "LOGIN"}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="
            absolute bottom-10 left-0 right-0
            px-6 md:px-20 flex justify-between text-sm text-white/70
          "
        >
          <button className="hover:text-white transition">
            Forgot password?
          </button>

          <button className="hover:text-white transition">
            Create account
          </button>
        </motion.div>
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

function InputBox({ placeholder, ...props }) {
  return (
    <input
      {...props}
      placeholder={placeholder}
      className="
        w-full bg-white/95 text-black
        rounded-xl px-5 py-4 font-medium
        outline-none shadow-md
      "
    />
  );
}