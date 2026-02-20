import slide1 from "@/assets/slide/1.webp";
import slide2 from "@/assets/slide/2.webp";
import slide3 from "@/assets/slide/3.webp";
import slide4 from "@/assets/slide/4.webp";
import slide5 from "@/assets/slide/5.webp";
import slide6 from "@/assets/slide/6.webp";
import slide7 from "@/assets/slide/7.webp";
import slide8 from "@/assets/slide/8.webp";
import slide9 from "@/assets/slide/9.webp";

import { useEffect, useRef, useState } from "react";

export default function SlideBanner() {
  const banners = [
    slide1,
    slide2,
    slide3,
    slide4,
    slide5,
    slide6,
    slide7,
    slide8,
    slide9,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(timerRef.current);
  }, []);

  const startAutoSlide = () => {
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    startAutoSlide();
  };

  return (
    <div>
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((img, index) => (
            <div key={index} className="min-w-full px-[14px] box-border">
              <div
                className="h-[170px] rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* DOTS */}
      <div className="flex justify-center mt-2">
        {banners.map((_, i) => (
          <div
            key={i}
            onClick={() => goToSlide(i)}
            className="h-[5px] mx-[4px] rounded-full cursor-pointer transition-all"
            style={{
              width: currentIndex === i ? 16 : 5,
              backgroundColor: currentIndex === i ? "#1976d2" : "#b0b0b0",
            }}
          />
        ))}
      </div>
    </div>
  );
}