// src/pages/user/home/Pages/car/car_details/CarGallery.jsx
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Thumbs, FreeMode } from 'swiper/modules';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

export default function CarGallery({ galleryImages, isLoading, currentIndex, onPageChange }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const handleImageClick = (index) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  if (isLoading) return <div className="h-96 flex items-center justify-center">Loading...</div>;

  return (
    <>
      {/* ─── MAIN GALLERY ─────────────────────────────────────── */}
      <div className="px-4 md:px-8 lg:px-12 relative">
        <Swiper
          modules={[Pagination, Thumbs]}
          pagination={{ clickable: true, dynamicBullets: true }}
          thumbs={{ swiper: thumbsSwiper }}
          onSlideChange={(swiper) => onPageChange(swiper.activeIndex)}
          className="rounded-2xl h-80 sm:h-96 md:h-[32rem] lg:h-[36rem]"
        >
          {galleryImages.map((img, idx) => (
            <SwiperSlide key={idx} onClick={() => handleImageClick(idx)}>
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <img src={img} alt="" className="w-full h-full object-contain" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom dot indicator (mobile only) */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 md:hidden">
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

      {/* ─── THUMBNAIL STRIP ──────────────────────────────────── */}
      <div className="px-4 md:px-8 lg:px-12 mt-4">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={4}
          breakpoints={{
            640: { slidesPerView: 5, spaceBetween: 10 },
            768: { slidesPerView: 6, spaceBetween: 12 },
            1024: { slidesPerView: 8, spaceBetween: 12 },
          }}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Thumbs]}
          className="h-20 md:h-24"
        >
          {galleryImages.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="w-full h-full rounded-lg overflow-hidden border-2 border-transparent transition hover:border-black/30 cursor-pointer">
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                  onClick={() => {
                    onPageChange(idx);
                    // Swiper will automatically sync via thumbs
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ─── ZOOM MODAL (Desktop‑friendly) ───────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Close button */}
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center z-10 hover:bg-gray-100 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Main zoomable image */}
          <Swiper
            initialSlide={modalIndex}
            onSlideChange={(swiper) => setModalIndex(swiper.activeIndex)}
            className="flex-1 w-full"
            modules={[Pagination]}
            pagination={{ clickable: true, dynamicBullets: true }}
          >
            {galleryImages.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="w-full h-full flex items-center justify-center bg-white">
                  <TransformWrapper
                    initialScale={1}
                    minScale={1}
                    maxScale={5}
                    wheel={{ step: 0.2 }}
                    doubleClick={{ disabled: false }}
                    panning={{ disabled: false }}
                  >
                    <TransformComponent>
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </TransformComponent>
                  </TransformWrapper>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnails in modal */}
          <div className="h-24 px-4 pb-4 bg-white border-t border-gray-100">
            <Swiper
              spaceBetween={8}
              slidesPerView={4}
              breakpoints={{
                640: { slidesPerView: 6 },
                768: { slidesPerView: 8 },
                1024: { slidesPerView: 10 },
              }}
              freeMode={true}
              watchSlidesProgress={true}
              onSlideChange={(swiper) => setModalIndex(swiper.activeIndex)}
              modules={[FreeMode]}
              className="h-full"
            >
              {galleryImages.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div
                    className={`w-full h-full rounded-lg overflow-hidden border-2 transition ${
                      modalIndex === idx ? 'border-black' : 'border-transparent'
                    }`}
                    onClick={() => setModalIndex(idx)}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
}