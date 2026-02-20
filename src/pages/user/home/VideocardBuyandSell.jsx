import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function VideocardBuyandSell({ allCars = [] }) {
  return (
    <div className="flex gap-3 px-3">
      <VideoActionCard
        videoUrl="https://res.cloudinary.com/dtqxc3rmt/video/upload/v1767690859/2vid_awhokj.mp4"
        thumbnail="/assets/vid/videobanner1.webp"
        isBuy
        allCars={allCars}
      />

      <VideoActionCard
        videoUrl="https://res.cloudinary.com/dtqxc3rmt/video/upload/v1767690859/1vid_rdtu5i.mp4"
        thumbnail="/assets/vid/videobanner2.webp"
        isBuy={false}
        allCars={allCars}
      />
    </div>
  );
}

/* ================= VIDEO CARD ================= */

function VideoActionCard({
  videoUrl,
  thumbnail,
  isBuy,
  allCars,
}) {
  const navigate = useNavigate();
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    if (isBuy) {
      navigate("/view-all", { state: { cars: allCars } });
    } else {
      // SELL PAGE
      // navigate("/sell");
    }
  };

  return (
    <div
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={handleClick}
      className={`
        relative flex-1 h-[130px]
        rounded-2xl overflow-hidden
        cursor-pointer select-none
        transition-transform duration-150
        ${pressed ? "scale-[0.96]" : "scale-100"}
      `}
    >
      {/* THUMBNAIL */}
      <img
        src={thumbnail}
        alt="thumbnail"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* VIDEO */}
      <video
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="
          absolute inset-0
          w-full h-full object-cover
        "
      />

      {/* TEXT */}
      <div className="absolute top-3 left-3 text-white">
        <div className="text-xs font-semibold">
          {isBuy ? "Your Dream Cars" : "Sell Your Cars"}
        </div>
        <div className="text-[10px] text-white/70">
          {isBuy ? "Buy Cars" : "Post Your Cars"}
        </div>
      </div>

      {/* BUTTON */}
      <div className="absolute bottom-3 left-3">
        <div
          className={`
            px-3 py-2 rounded-lg
            text-[10px] font-bold
            flex items-center gap-2
            ${isBuy ? "bg-green-300" : "bg-orange-300"}
          `}
        >
          <span className="text-black">
            {isBuy ? "🛍" : "💰"}
          </span>

          <span className="text-black">
            {isBuy ? "BUY" : "SELL"}
          </span>
        </div>
      </div>
    </div>
  );
}