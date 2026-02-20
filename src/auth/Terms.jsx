import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* 🎥 Video Background */}
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

      {/* 🌫 Bottom Blur Layer */}
      <div className="absolute inset-0">

        {/* Top 25% CLEAR */}
        <div className="h-[25vh]" />

        {/* Bottom 75% BLUR */}
        <div className="h-[75vh] backdrop-blur-3xl bg-black/75" />
      </div>

      {/* 📄 Content */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* 🔝 TOP CLEAR AREA */}
        <div className="h-[25vh] flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold"
          >
            Terms & Conditions
          </motion.h1>
        </div>

        {/* 🔻 BOTTOM CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 md:px-20 pb-10">

          <Section
            title="General"
            text="These Terms and Conditions outline the rules and guidelines governing the use of our platform and related services for buying, selling, or exchanging vehicles. By accessing our application or completing any transaction, you acknowledge and agree to abide by these terms."
          />

          <Section
            title="Vehicle Information"
            text="All vehicle listings are subject to availability at the time of inquiry or purchase. Specifications, features, mileage, and pricing details are provided for informational purposes only and may change without prior notice."
          />

          <Section
            title="Pricing & Payment"
            text="Vehicle prices may be revised at any time without advance notification. Applicable taxes, registration fees, insurance charges, and other related costs shall be borne by the customer."
          />

          <Section
            title="Booking & Cancellation"
            text="A booking amount may be required to reserve a vehicle and is generally non-refundable unless otherwise specified."
          />

          <Section
            title="Delivery & Ownership"
            text="Estimated delivery timelines depend on vehicle availability and completion of registration formalities."
          />

          <Section
            title="Warranty & After-Sales"
            text="Pre-owned vehicles may include limited warranty coverage, where applicable."
          />

          <Section
            title="Liability"
            text="The company shall not be responsible for indirect or consequential losses."
          />

          <Section
            title="Privacy & Data Protection"
            text="Personal information collected will be used strictly for service-related purposes."
          />

          <Section
            title="Governing Law"
            text="These Terms shall be governed in accordance with the laws of India."
          />

          {/* Back Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate(-1)}
              className="w-48 h-12 rounded-full bg-white/90 text-black font-semibold shadow-lg hover:scale-105 transition"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable Section */
function Section({ title, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 text-center"
    >
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      <p className="text-sm text-white/90 leading-relaxed">{text}</p>
    </motion.div>
  );
}
