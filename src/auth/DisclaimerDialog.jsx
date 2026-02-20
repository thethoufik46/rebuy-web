import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function DisclaimerDialog() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="bg-white rounded-3xl w-full max-w-md p-6 text-center shadow-2xl"
      >
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate(-1)}
            className="text-xl text-black hover:scale-110 transition"
          >
            ✕
          </button>
        </div>

        {/* Heading */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-red-500 text-xl">ℹ</span>
          <h2 className="text-xl font-bold text-black">
            Disclaimer
          </h2>
        </div>

        {/* Body */}
        <p className="text-sm text-gray-700 leading-relaxed mb-6">
          All vehicles listed on Re2Buy are curated and displayed by Re2Buy.
          <br /><br />
          Vehicle specifications may be based on seller-provided data.
          Re2Buy does not guarantee absolute accuracy.
          <br /><br />
          Buyers are strongly advised to independently verify all details.
          Any transaction is entirely at buyer’s own risk.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/home")}   // 🔥 FINAL FLOW
          className="w-full h-12 rounded-2xl bg-indigo-500 text-white font-semibold tracking-wider hover:scale-105 transition"
        >
          UNDERSTAND
        </button>
      </motion.div>
    </div>
  );
}
