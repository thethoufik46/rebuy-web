// C:\flutter_projects\rebuy-web\src\pages\user\car_sections\car_details\CarGallery.jsx
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Thumbs } from 'swiper/modules';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

export default function CarGallery({ galleryImages, isLoading, currentIndex, onPageChange }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const handleImageClick = (index) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  if (isLoading) {
    return <div className="h-96 flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <div className="px-4 relative">
        <Swiper
          modules={[Pagination, Thumbs]}
          pagination={{ clickable: true, dynamicBullets: true }}
          thumbs={{ swiper: thumbsSwiper }}
          onSlideChange={(swiper) => onPageChange(swiper.activeIndex)}
          className="rounded-2xl h-96"
        >
          {galleryImages.map((img, idx) => (
            <SwiperSlide key={idx} onClick={() => handleImageClick(idx)}>
              <img src={img} alt="" className="w-full h-full object-contain" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom dot indicator */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {galleryImages.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-250 ${
                currentIndex === i ? 'w-4.5 bg-black' : 'w-2 bg-black/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails strip */}
      <div className="px-4 mt-4">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          className="h-20"
        >
          {galleryImages.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img src={img} alt="" className="w-full h-full object-cover rounded-lg border border-black/10" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Zoom Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <Swiper
            initialSlide={modalIndex}
            onSlideChange={(swiper) => setModalIndex(swiper.activeIndex)}
            className="flex-1"
          >
            {galleryImages.map((img, idx) => (
              <SwiperSlide key={idx}>
                <TransformWrapper
                  initialScale={1}
                  minScale={1}
                  maxScale={4}
                  wheel={{ step: 0.2 }}
                  doubleClick={{ disabled: false }}
                >
                  <TransformComponent>
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </TransformComponent>
                </TransformWrapper>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnails in modal */}
          <div className="h-20 px-4 pb-4">
            <Swiper
              spaceBetween={8}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              onSlideChange={(swiper) => setModalIndex(swiper.activeIndex)}
            >
              {galleryImages.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img src={img} alt="" className="w-full h-full object-cover rounded-lg border border-black/10" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
}