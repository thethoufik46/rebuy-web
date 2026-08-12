// src/pages/user/home/Pages/car/car_details/CarGallery.jsx

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Keyboard,
  Navigation,
  Pagination,
} from "swiper/modules";

import {
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/* =========================================================
   PREMIUM LUXURY CAR GALLERY

   Layout:
   Desktop:
     ┌────────────────┬───────────────┬───────────────┐
     │                │               │               │
     │    MAIN IMAGE  │   IMAGE 2     │   IMAGE 3     │
     │                │               │               │
     │                ├───────────────┼───────────────┤
     │                │   IMAGE 4     │   IMAGE 5 +9  │
     │                │               │               │
     └────────────────┴───────────────┴───────────────┘

   Mobile:
     Main image
     ┌──────────┬──────────┐
     │ image 2  │ image 3  │
     ├──────────┼──────────┤
     │ image 4  │ image 5  │
     └──────────┴──────────┘

   Viewer:
     Dark luxury fullscreen
     Main zoomable image
     Left / right controls
     Bottom thumbnail rail
     ESC / click outside close
========================================================= */

const FALLBACK_IMAGE =
  "https://via.placeholder.com/1200x800?text=No+Image";

const getSafeImages = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item) return "";

      if (typeof item === "string") {
        return item.trim();
      }

      if (typeof item === "object") {
        return String(
          item.url ||
            item.secure_url ||
            item.src ||
            item.path ||
            item.imageUrl ||
            ""
        ).trim();
      }

      return "";
    })
    .filter(Boolean);
};

/* =========================================================
   IMAGE TILE
========================================================= */

function ImageTile({
  src,
  index,
  onOpen,
  className = "",
  showOverlay = false,
  overlayText = "",
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className={`
        group
        relative
        block
        h-full
        w-full
        overflow-hidden
        rounded-[20px]
        bg-[#F3F3F3]
        outline-none
        focus-visible:ring-2
        focus-visible:ring-black/50
        ${className}
      `}
      aria-label={`Open car image ${index + 1}`}
    >
      <img
        src={src}
        alt={`Car image ${index + 1}`}
        draggable="false"
        className="
          h-full
          w-full
          select-none
          object-cover
          transition-transform
          duration-700
          ease-[cubic-bezier(.22,1,.36,1)]
          group-hover:scale-[1.035]
        "
        loading={index === 0 ? "eager" : "lazy"}
        onError={(event) => {
          if (
            event.currentTarget.src !==
            FALLBACK_IMAGE
          ) {
            event.currentTarget.src =
              FALLBACK_IMAGE;
          }
        }}
      />

      <span
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-t
          from-black/[0.10]
          via-transparent
          to-white/[0.05]
          opacity-80
        "
      />

      {showOverlay && (
        <span
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            bg-white/35
            text-xl
            font-bold
            text-white
            backdrop-blur-[1px]
          "
        >
          {overlayText}
        </span>
      )}
    </button>
  );
}

/* =========================================================
   FULLSCREEN ZOOM IMAGE
   Important: TransformComponent gets explicit dimensions.
   This prevents the mobile "image stuck at bottom" issue
   and keeps the image centered on desktop/mobile.
========================================================= */

function ViewerZoomImage({ src, index }) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div
      className="
        relative
        flex
        h-full
        w-full
        items-center
        justify-center
        overflow-hidden
      "
      onDoubleClick={(event) => {
        event.stopPropagation();
      }}
    >
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={5}
        centerOnInit
        limitToBounds
        centerZoomedOut
        wheel={{
          disabled: false,
          step: 0.18,
        }}
        pinch={{
          disabled: false,
        }}
        doubleClick={{
          disabled: false,
          mode: "toggle",
          step: 2,
        }}
        panning={{
          disabled: false,
          velocityDisabled: false,
        }}
        alignmentAnimation={{
          disabled: false,
          sizeX: 100,
          sizeY: 100,
        }}
        velocityAnimation={{
          disabled: false,
        }}
        onZoomStart={() => setZoomed(true)}
        onZoomStop={(ref) => {
          const scale = ref?.state?.scale ?? 1;
          setZoomed(scale > 1.01);
        }}
        onPinchingStop={(ref) => {
          const scale = ref?.state?.scale ?? 1;
          setZoomed(scale > 1.01);
        }}
        onPanningStop={() => {}}
        wrapperStyle={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        contentStyle={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
          contentStyle={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={src}
            alt={`Car image ${index + 1}`}
            draggable="false"
            className="
              block
              max-h-full
              max-w-full
              select-none
              object-contain
              touch-none
              will-change-transform
            "
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
        </TransformComponent>
      </TransformWrapper>

      {/* Zoom hint */}
      <div
        className={`
          pointer-events-none
          absolute
          bottom-3
          left-1/2
          z-20
          -translate-x-1/2
          rounded-full
          border
          border-white/15
          bg-white/45
          px-3
          py-1.5
          text-[10px]
          font-medium
          text-white/80
          backdrop-blur-md
          transition-all
          duration-300
          ${zoomed ? "opacity-0" : "opacity-100"}
        `}
      >
        Double-click / pinch to zoom
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CarGallery({
  galleryImages = [],
  isLoading = false,
  currentIndex = 0,
  onPageChange = () => {},
}) {
  const images = getSafeImages(
    galleryImages
  );

  const [viewerOpen, setViewerOpen] =
    useState(false);

  const [viewerIndex, setViewerIndex] =
    useState(
      Math.max(
        0,
        Math.min(
          currentIndex || 0,
          Math.max(images.length - 1, 0)
        )
      )
    );

  const viewerSwiperRef = useRef(null);

  /* =======================================================
     SYNC CURRENT INDEX
  ======================================================= */

  useEffect(() => {
    if (
      typeof currentIndex === "number" &&
      currentIndex >= 0 &&
      currentIndex < images.length
    ) {
      setViewerIndex(currentIndex);
    }
  }, [currentIndex, images.length]);

  /* =======================================================
     OPEN VIEWER
  ======================================================= */

  const openViewer = useCallback(
    (index = 0) => {
      const safeIndex = Math.max(
        0,
        Math.min(
          index,
          Math.max(images.length - 1, 0)
        )
      );

      setViewerIndex(safeIndex);
      setViewerOpen(true);

      document.body.style.overflow =
        "hidden";

      requestAnimationFrame(() => {
        if (
          viewerSwiperRef.current &&
          !viewerSwiperRef.current.destroyed
        ) {
          viewerSwiperRef.current.slideTo(
            safeIndex,
            0
          );
        }
      });
    },
    [images.length]
  );

  /* =======================================================
     CLOSE VIEWER
  ======================================================= */

  const closeViewer = useCallback(() => {
    setViewerOpen(false);
    document.body.style.overflow = "";
  }, []);

  /* =======================================================
     KEYBOARD
  ======================================================= */

  useEffect(() => {
    if (!viewerOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeViewer();
      }

      if (
        event.key === "ArrowRight" &&
        viewerSwiperRef.current
      ) {
        viewerSwiperRef.current.slideNext();
      }

      if (
        event.key === "ArrowLeft" &&
        viewerSwiperRef.current
      ) {
        viewerSwiperRef.current.slidePrev();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [viewerOpen, closeViewer]);

  /* =======================================================
     CLEAN BODY LOCK
  ======================================================= */

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1420px] px-4 sm:px-6 lg:px-8">
        <div
          className="
            h-[330px]
            w-full
            animate-pulse
            rounded-[22px]
            bg-white/[0.06]
            sm:h-[460px]
            lg:h-[530px]
          "
        />
      </div>
    );
  }

  /* =======================================================
     EMPTY
  ======================================================= */

  if (!images.length) {
    return (
      <div className="mx-auto w-full max-w-[1420px] px-4 sm:px-6 lg:px-8">
        <div
          className="
            flex
            h-[330px]
            items-center
            justify-center
            rounded-[22px]
            bg-white/[0.04]
            text-sm
            text-black/40
            sm:h-[460px]
          "
        >
          No images available
        </div>
      </div>
    );
  }

  const visibleImages = images.slice(
    0,
    5
  );

  const extraCount = Math.max(
    images.length - 5,
    0
  );

  return (
    <>
      {/* =====================================================
          PREMIUM MOSAIC GALLERY
      ===================================================== */}

      <section
        className="
          mx-auto
          w-full
          max-w-[1420px]
          px-3
          sm:px-5
          lg:px-7
          xl:px-8
        "
      >
        {/* ---------------------------------------------------
            DESKTOP MOSAIC
        --------------------------------------------------- */}

        <div
          className="
            hidden
            h-[430px]
            grid-cols-[minmax(0,1.55fr)_minmax(0,0.65fr)_minmax(0,0.65fr)]
            grid-rows-2
            gap-3
            lg:grid
            xl:h-[525px]
          "
        >
          {/* MAIN */}
          <div className="relative row-span-2 min-w-0">
            <ImageTile
              src={visibleImages[0]}
              index={0}
              onOpen={openViewer}
              className="rounded-[22px]"
            />

            {/* Location pill */}
            <div
              className="
                pointer-events-none
                absolute
                bottom-5
                left-5
                z-10
                flex
                items-center
                gap-3
                rounded-[18px]
                border
                border-white/70
                bg-[#FFFDF8]
                px-4
                py-3
                shadow-[0_10px_30px_rgba(0,0,0,0.10)]
              "
            >
              <span
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FFE7A0]
                  text-black
                "
              >
                ↑
              </span>

              <span className="text-sm font-medium text-black">
                View showroom
              </span>
            </div>
          </div>

          {/* IMAGE 2 */}
          {visibleImages[1] && (
            <ImageTile
              src={visibleImages[1]}
              index={1}
              onOpen={openViewer}
            />
          )}

          {/* IMAGE 3 */}
          {visibleImages[2] && (
            <ImageTile
              src={visibleImages[2]}
              index={2}
              onOpen={openViewer}
            />
          )}

          {/* IMAGE 4 */}
          {visibleImages[3] && (
            <ImageTile
              src={visibleImages[3]}
              index={3}
              onOpen={openViewer}
            />
          )}

          {/* IMAGE 5 + COUNT */}
          {visibleImages[4] && (
            <ImageTile
              src={visibleImages[4]}
              index={4}
              onOpen={openViewer}
              showOverlay={extraCount > 0}
              overlayText={
                extraCount > 0
                  ? `+${extraCount}`
                  : ""
              }
            />
          )}
        </div>

        {/* ---------------------------------------------------
            MOBILE MOSAIC
        --------------------------------------------------- */}

        <div className="lg:hidden">
          <div
            className="
              relative
              h-[330px]
              sm:h-[440px]
            "
          >
            <ImageTile
              src={visibleImages[0]}
              index={0}
              onOpen={openViewer}
              className="
                rounded-[20px]
                sm:rounded-[24px]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                bottom-3
                left-3
                z-10
                flex
                items-center
                gap-2.5
                rounded-[16px]
                bg-[#FFFDF8]
                px-3
                py-2.5
                shadow-[0_8px_24px_rgba(0,0,0,0.12)]
                sm:bottom-5
                sm:left-5
                sm:px-4
                sm:py-3
              "
            >
              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FFE7A0]
                  text-sm
                  text-black
                "
              >
                ↑
              </span>

              <span className="text-xs font-medium text-black sm:text-sm">
                View showroom
              </span>
            </div>
          </div>

          <div
            className="
              mt-2
              grid
              grid-cols-2
              gap-2
            "
          >
            {visibleImages
              .slice(1, 5)
              .map((img, offset) => {
                const index =
                  offset + 1;

                const isLast =
                  index === 4 &&
                  extraCount > 0;

                return (
                  <ImageTile
                    key={`${img}-${index}`}
                    src={img}
                    index={index}
                    onOpen={openViewer}
                    showOverlay={isLast}
                    overlayText={
                      isLast
                        ? `+${extraCount}`
                        : ""
                    }
                    className="
                      h-[118px]
                      rounded-[18px]
                      sm:h-[155px]
                    "
                  />
                );
              })}
          </div>
        </div>

        {/* ---------------------------------------------------
            MOBILE DOT / COUNT
        --------------------------------------------------- */}

        <div className="mt-2 flex items-center justify-center gap-2 lg:hidden">
          <span className="text-[11px] font-medium text-black/45">
            {Math.min(
              currentIndex + 1,
              images.length
            )}{" "}
            / {images.length}
          </span>

          <span className="h-1 w-1 rounded-full bg-white/20" />

          <button
            type="button"
            onClick={() =>
              openViewer(currentIndex)
            }
            className="
              text-[11px]
              font-semibold
              text-black
              underline-offset-2
              hover:underline
            "
          >
            View all photos
          </button>
        </div>
      </section>

      {/* =====================================================
          FULLSCREEN LUXURY VIEWER
      ===================================================== */}

      {viewerOpen && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            overflow-hidden
            bg-[#151516]
            text-white
            animate-[galleryFadeIn_.22s_ease-out]
          "
          role="dialog"
          aria-modal="true"
          aria-label="Car photo viewer"
        >
          {/* =================================================
              TOP BAR
          ================================================= */}

          <div
            className="
              pointer-events-none
              absolute
              left-0
              right-0
              top-0
              z-[60]
              flex
              h-[64px]
              items-center
              justify-end
              gap-1
              bg-gradient-to-b
              from-black/70
              via-black/25
              to-transparent
              px-3
              sm:h-[76px]
              sm:gap-2
              sm:px-5
            "
          >
            <div
              className="
                pointer-events-auto
                rounded-full
                bg-white/10
                px-3
                py-1.5
                text-[11px]
                font-semibold
                tabular-nums
                backdrop-blur-xl
              "
            >
              {viewerIndex + 1}/{images.length}
            </div>

            <button
              type="button"
              onClick={closeViewer}
              className="
                pointer-events-auto
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                text-white/90
                transition
                hover:bg-white/10
                active:scale-90
              "
              aria-label="Close"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  strokeLinecap="round"
                  strokeWidth="1.7"
                />
              </svg>
            </button>
          </div>

          {/* =================================================
              FULL HEIGHT ZOOM STAGE
              The stage explicitly fills the viewport area.
              This fixes mobile/desktop vertical centering.
          ================================================= */}

          <div
            className="
              absolute
              inset-x-0
              top-0
              bottom-[104px]
              flex
              items-center
              justify-center
              sm:bottom-[120px]
            "
          >
            <Swiper
              onSwiper={(swiper) => {
                viewerSwiperRef.current = swiper;
              }}
              initialSlide={viewerIndex}
              modules={[
                Keyboard,
                Navigation,
                Pagination,
              ]}
              navigation
              keyboard={{
                enabled: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              observer
              observeParents
              resizeObserver
              speed={520}
              className="
                luxury-viewer-main
                !h-full
                !w-full
              "
              onSlideChange={(swiper) => {
                const nextIndex =
                  swiper.activeIndex;

                setViewerIndex(nextIndex);
                onPageChange(nextIndex);
              }}
            >
              {images.map((img, index) => (
                <SwiperSlide
                  key={`viewer-${img}-${index}`}
                  className="
                    !flex
                    !h-full
                    !w-full
                    items-center
                    justify-center
                  "
                >
                  <ViewerZoomImage
                    src={img}
                    index={index}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* =================================================
              BOTTOM THUMBNAIL RAIL
          ================================================= */}

          <div
            className="
              luxury-viewer-thumbs
              absolute
              bottom-0
              left-0
              right-0
              z-[70]
              h-[104px]
              bg-gradient-to-t
              from-[#151516]
              via-[#151516]/95
              to-transparent
              px-3
              pb-3
              pt-6
              sm:h-[120px]
              sm:px-8
              sm:pb-5
              sm:pt-8
            "
          >
            <div
              className="
                mx-auto
                h-full
                max-w-[1360px]
              "
            >
              <Swiper
                spaceBetween={8}
                slidesPerView={5}
                freeMode
                modules={[]}
                className="h-full w-full"
                breakpoints={{
                  480: {
                    slidesPerView: 6,
                  },
                  640: {
                    slidesPerView: 8,
                  },
                  1024: {
                    slidesPerView: 12,
                  },
                  1280: {
                    slidesPerView: 14,
                  },
                }}
              >
                {images.map((img, index) => (
                  <SwiperSlide
                    key={`thumb-${img}-${index}`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setViewerIndex(index);

                        if (
                          viewerSwiperRef.current &&
                          !viewerSwiperRef.current.destroyed
                        ) {
                          viewerSwiperRef.current.slideTo(
                            index
                          );
                        }
                      }}
                      className={`
                        relative
                        h-full
                        w-full
                        overflow-hidden
                        rounded-[7px]
                        border
                        bg-white
                        transition-all
                        duration-300
                        ${
                          viewerIndex === index
                            ? "scale-[1.02] border-[#FFE08A] shadow-[0_0_0_1px_#FFE08A]"
                            : "border-white/10 opacity-60 hover:opacity-100"
                        }
                      `}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${
                          index + 1
                        }`}
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                        loading="lazy"
                      />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          COMPONENT STYLES
      ===================================================== */}

      <style>{`
        @keyframes galleryFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .luxury-viewer-main,
        .luxury-viewer-main .swiper-wrapper,
        .luxury-viewer-main .swiper-slide {
          width: 100% !important;
          height: 100% !important;
        }

        .luxury-viewer-main .swiper-slide {
          overflow: hidden;
        }

        .luxury-viewer-main
          .swiper-button-prev,
        .luxury-viewer-main
          .swiper-button-next {
          width: 44px;
          height: 44px;
          margin-top: -22px;
          border-radius: 9999px;
          color: rgba(255,255,255,0.95);
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(14px);
          transition:
            transform 220ms ease,
            background 220ms ease,
            opacity 220ms ease;
        }

        .luxury-viewer-main
          .swiper-button-prev:hover,
        .luxury-viewer-main
          .swiper-button-next:hover {
          transform: scale(1.08);
          background: rgba(255,255,255,0.16);
        }

        .luxury-viewer-main
          .swiper-button-prev:after,
        .luxury-viewer-main
          .swiper-button-next:after {
          font-size: 16px;
          font-weight: 700;
        }

        .luxury-viewer-main
          .swiper-button-prev {
          left: 14px;
        }

        .luxury-viewer-main
          .swiper-button-next {
          right: 14px;
        }

        .luxury-viewer-main
          .swiper-pagination {
          bottom: 8px !important;
        }

        .luxury-viewer-main
          .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: #fff;
          opacity: 0.35;
        }

        .luxury-viewer-main
          .swiper-pagination-bullet-active {
          width: 20px;
          border-radius: 999px;
          opacity: 1;
        }

        .luxury-viewer-thumbs
          .swiper,
        .luxury-viewer-thumbs
          .swiper-wrapper,
        .luxury-viewer-thumbs
          .swiper-slide {
          height: 100%;
        }

        @media (max-width: 639px) {
          .luxury-viewer-main
            .swiper-button-prev,
          .luxury-viewer-main
            .swiper-button-next {
            width: 36px;
            height: 36px;
            margin-top: -18px;
          }

          .luxury-viewer-main
            .swiper-button-prev {
            left: 5px;
          }

          .luxury-viewer-main
            .swiper-button-next {
            right: 5px;
          }

          .luxury-viewer-main
            .swiper-pagination {
            bottom: 7px !important;
          }
        }

        @keyframes galleryShimmer {
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes galleryImageIn {
          from {
            opacity: 0;
            transform: scale(0.985);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes galleryViewerIn {
          from {
            opacity: 0;
            transform: scale(0.985);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .luxury-viewer-main .swiper-slide-active img {
          animation: galleryViewerIn 0.45s cubic-bezier(.22,1,.36,1);
        }

        .luxury-viewer-main .swiper-slide {
          background: #fff;
        }

        .luxury-viewer-thumbs {
          border-top: 1px solid rgba(0,0,0,0.06);
        }

        @media (prefers-reduced-motion: reduce) {
          .luxury-viewer-main *,
          .luxury-viewer-thumbs * {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}