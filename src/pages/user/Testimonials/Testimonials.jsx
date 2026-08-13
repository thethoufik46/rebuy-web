// src/pages/user/Testimonials.jsx

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import TestimonialApi from "@/services/testimonialApi";

/* =========================================================
   HELPERS
========================================================= */

const text = (
  value,
  fallback = "-"
) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return String(value);
};

const getImageUrl = (
  value
) => {
  if (!value) return "";

  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  if (value.url) {
    return value.url;
  }

  if (value.secure_url) {
    return value.secure_url;
  }

  return "";
};

const normalizeTestimonial = (
  item = {}
) => {
  const rating =
    Number.parseInt(
      item.rating,
      10
    );

  return {
    _id:
      item._id?.$oid ||
      item._id ||
      item.id ||
      Math.random()
        .toString(36)
        .slice(2),

    name: text(
      item.name,
      ""
    ),

    description: text(
      item.description,
      ""
    ),

    location: text(
      item.location,
      ""
    ),

    rating: Math.max(
      0,
      Math.min(
        5,
        Number.isNaN(
          rating
        )
          ? 0
          : rating
      )
    ),

    phone: text(
      item.phone,
      ""
    ),

    image:
      getImageUrl(
        item.imageUrl ||
          item.image
      ),

    video:
      item.videoUrl ||
      item.video ||
      "",
  };
};

/* =========================================================
   STAR
========================================================= */

function StarIcon({
  filled = false,
  size = 17,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={
        filled
          ? "currentColor"
          : "none"
      }
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        d="
          M12 3.8
          l2.52 5.1
          5.63.82
          -4.08 3.98
          .96 5.62
          L12 16.67
          l-5.03 2.65
          .96-5.62
          -4.08-3.98
          5.63-.82
          L12 3.8
        "
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   LOCATION
========================================================= */

function LocationIcon({
  size = 15,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        d="
          M20 10.5
          c0 5.2-8 10.5-8 10.5
          S4 15.7 4 10.5
          a8 8 0 1 1 16 0Z
        "
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="10.5"
        r="2.5"
      />
    </svg>
  );
}

/* =========================================================
   CLOSE
========================================================= */

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   LOADING
========================================================= */

function TestimonialShimmer() {
  return (
    <div
      className="
        flex
        w-full
        gap-3
        overflow-hidden
      "
    >
      {[0, 1].map(
        (item) => (
          <div
            key={item}
            className="
              h-[320px]
              w-[calc(100vw-36px)]
              max-w-[520px]
              shrink-0
              animate-pulse
              rounded-[22px]
              bg-gradient-to-r
              from-white
              via-[#EDE7F6]
              to-white
              sm:w-[430px]
            "
          />
        )
      )}
    </div>
  );
}

/* =========================================================
   TESTIMONIAL CARD
========================================================= */

function TestimonialCard({
  data,
  onOpen,
}) {
  const image =
    data.image ||
    "/assets/logo/logo.webp";

  return (
    <motion.button
      type="button"
      onClick={() =>
        onOpen(data)
      }
      whileTap={{
        scale: 0.985,
      }}
      className="
        group
        relative
        h-[320px]
        w-[calc(100vw-24px)]
        shrink-0
        overflow-hidden
        rounded-[22px]
        bg-white
        text-left
        shadow-[0_14px_38px_rgba(50,35,90,0.12)]
        sm:w-[430px]
        lg:h-[340px]
        lg:w-[calc((100vw-72px)/5)]
      "
    >
      <img
        src={image}
        alt={
          data.name ||
          "Customer testimonial"
        }
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          transition-transform
          duration-500
          group-hover:scale-[1.025]
        "
        loading="lazy"
        decoding="async"
        onError={(event) => {
          event.currentTarget.src =
            "/assets/logo/logo.webp";
        }}
      />

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          overflow-hidden
          rounded-t-2xl
          border
          border-white/35
          bg-black/55
          p-3
          shadow-[0_8px_28px_rgba(0,0,0,0.18)]
          backdrop-blur-[10px]
        "
      >
        <div
          className="
            flex
            items-center
            gap-0.5
            text-amber-500
          "
        >
          {Array.from({
            length: 5,
          }).map(
            (_, index) => (
              <StarIcon
                key={index}
                size={15}
                filled={
                  index <
                  data.rating
                }
              />
            )
          )}
        </div>

        <div
          className="
            mt-1.5
            flex
            items-center
            gap-2
          "
        >
          <div className="min-w-0 flex-1">
            <h3
              className="
                truncate
                text-[13px]
                font-bold
                text-white
              "
            >
              {data.name ||
                "Customer"}
            </h3>
          </div>

          {data.location && (
            <>
              <LocationIcon
                size={13}
              />

              <span
                className="
                  max-w-[42%]
                  truncate
                  text-[11px]
                  text-white/90
                "
              >
                {
                  data.location
                }
              </span>
            </>
          )}
        </div>

        <p
          className="
            mt-1.5
            line-clamp-3
            text-[12.5px]
            leading-[1.5]
            text-white/95
          "
        >
          {data.description ||
            "No description available."}
        </p>

        <div
          className="
            mt-1
            text-[12px]
            font-semibold
            text-white
          "
        >
          Read more...
        </div>
      </div>
    </motion.button>
  );
}

/* =========================================================
   MODAL
   ---------------------------------------------------------
   Vertical scrolling explicitly enabled.
========================================================= */

function TestimonialModal({
  data,
  onClose,
}) {
  if (!data) return null;

  const image =
    data.image ||
    "/assets/logo/logo.webp";

  return (
    <motion.div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/85
        p-3
        sm:p-5
      "
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Customer testimonial"
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 18,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.96,
          y: 18,
        }}
        transition={{
          duration: 0.22,
          ease: "easeOut",
        }}
        className="
          relative
          max-h-[92vh]
          w-full
          max-w-[620px]
          overflow-hidden
          rounded-[24px]
          bg-white
          shadow-2xl
        "
      >
        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-3
            top-3
            z-20
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-black
            text-white
            shadow-lg
            active:scale-90
          "
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        {/* IMPORTANT:
            Vertical page inside modal */}
        <div
          className="
            max-h-[92vh]
            overflow-y-auto
            overscroll-contain
            touch-pan-y
            [-webkit-overflow-scrolling:touch]
          "
        >
          <img
            src={image}
            alt={
              data.name ||
              "Customer testimonial"
            }
            className="
              block
              h-[260px]
              w-full
              object-cover
              sm:h-[340px]
            "
            loading="lazy"
            decoding="async"
            onError={(event) => {
              event.currentTarget.src =
                "/assets/logo/logo.webp";
            }}
          />

          <div
            className="
              p-5
              sm:p-6
            "
          >
            <div
              className="
                flex
                items-center
                gap-0.5
                text-amber-500
              "
            >
              {Array.from({
                length: 5,
              }).map(
                (_, index) => (
                  <StarIcon
                    key={index}
                    size={18}
                    filled={
                      index <
                      data.rating
                    }
                  />
                )
              )}
            </div>

            <h2
              className="
                mt-3
                text-xl
                font-bold
                text-[#17151B]
                sm:text-2xl
              "
            >
              {data.name}
            </h2>

            {data.location && (
              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-1.5
                  text-sm
                  text-gray-600
                "
              >
                <LocationIcon
                  size={16}
                />

                <span>
                  {
                    data.location
                  }
                </span>
              </div>
            )}

            <p
              className="
                mt-5
                whitespace-pre-wrap
                text-sm
                leading-[1.7]
                text-gray-700
              "
            >
              {
                data.description
              }
            </p>

            {data.phone && (
              <p
                className="
                  mt-4
                  text-sm
                  font-medium
                  text-gray-600
                "
              >
                {data.phone}
              </p>
            )}

            {data.video && (
              <div
                className="
                  mt-5
                  overflow-hidden
                  rounded-2xl
                  bg-black
                "
              >
                <video
                  src={data.video}
                  controls
                  playsInline
                  preload="metadata"
                  className="
                    max-h-[360px]
                    w-full
                  "
                />
              </div>
            )}

            {/* Extra bottom space for easy mobile scroll */}
            <div className="h-6" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function Testimonials() {
  const [
    testimonials,
    setTestimonials,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    selectedTestimonial,
    setSelectedTestimonial,
  ] = useState(null);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const scrollRef =
    useRef(null);

  const autoScrollRef =
    useRef(null);

  /* =======================================================
     FETCH
  ======================================================= */

  const fetchTestimonials =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const list =
            await TestimonialApi.getTestimonials();

          setTestimonials(
            Array.isArray(list)
              ? list.map(
                  normalizeTestimonial
                )
              : []
          );
        } catch (error) {
          console.error(
            "TESTIMONIAL FETCH ERROR:",
            error
          );

          setTestimonials([]);
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    fetchTestimonials();
  }, [
    fetchTestimonials,
  ]);

  /* =======================================================
     AUTO SCROLL
     -------------------------------------------------------
     Doesn't block manual vertical page scrolling.
  ======================================================= */

  useEffect(() => {
    if (
      testimonials.length <=
      1
    ) {
      return undefined;
    }

    autoScrollRef.current =
      window.setInterval(() => {
        const container =
          scrollRef.current;

        if (!container) return;

        const cards =
          container.querySelectorAll(
            "[data-testimonial-card]"
          );

        if (!cards.length) {
          return;
        }

        const next =
          (currentIndex + 1) %
          testimonials.length;

        const target =
          cards[next];

        if (!target) return;

        container.scrollTo({
          left:
            target.offsetLeft,
          behavior: "smooth",
        });

        setCurrentIndex(
          next
        );
      }, 4000);

    return () => {
      if (
        autoScrollRef.current
      ) {
        window.clearInterval(
          autoScrollRef.current
        );
      }
    };
  }, [
    testimonials.length,
    currentIndex,
  ]);

  /* =======================================================
     SCROLL DETECTION
  ======================================================= */

  const handleScroll =
    useCallback(() => {
      const container =
        scrollRef.current;

      if (!container) return;

      const cards =
        container.querySelectorAll(
          "[data-testimonial-card]"
        );

      if (!cards.length) return;

      const center =
        container.scrollLeft +
        container.clientWidth /
          2;

      let closestIndex = 0;

      let closestDistance =
        Infinity;

      cards.forEach(
        (card, index) => {
          const cardCenter =
            card.offsetLeft +
            card.offsetWidth /
              2;

          const distance =
            Math.abs(
              center -
                cardCenter
            );

          if (
            distance <
            closestDistance
          ) {
            closestDistance =
              distance;

            closestIndex =
              index;
          }
        }
      );

      setCurrentIndex(
        closestIndex
      );
    }, []);

  /* =======================================================
     SLIDE
  ======================================================= */

  const goToSlide = useCallback(
    (index) => {
      const container =
        scrollRef.current;

      if (!container) return;

      const cards =
        container.querySelectorAll(
          "[data-testimonial-card]"
        );

      const card =
        cards[index];

      if (!card) return;

      container.scrollTo({
        left:
          card.offsetLeft,
        behavior: "smooth",
      });

      setCurrentIndex(
        index
      );
    },
    []
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        w-full
        overflow-x-hidden
        overflow-y-visible
        bg-transparent
      "
    >
      <main
        className="
          w-full
          max-w-none
          px-0
          py-0
        "
      >
        {/* LOADING */}

        {loading && (
          <div className="mt-0">
            <TestimonialShimmer />
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          testimonials.length ===
            0 && (
            <div
              className="
                mt-2
                flex
                flex-col
                items-center
                justify-center
                rounded-[24px]
                bg-white/55
                px-6
                py-8
                text-center
                backdrop-blur-xl
              "
            >
              <div className="text-4xl">
                💬
              </div>

              <p
                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-gray-600
                "
              >
                No testimonials
                available
              </p>

              <button
                type="button"
                onClick={
                  fetchTestimonials
                }
                className="
                  mt-4
                  rounded-full
                  bg-black
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  active:scale-95
                "
              >
                Try again
              </button>
            </div>
          )}

        {/* =================================================
            TESTIMONIAL SLIDER

            IMPORTANT FIX:
            overflow-y-visible
            touch-pan-x + touch-pan-y
            overscroll-y-auto

            So horizontal card swipe works AND
            vertical page scroll works.
        ================================================= */}

        {!loading &&
          testimonials.length >
            0 && (
            <div
              ref={scrollRef}
              onScroll={
                handleScroll
              }
              className="
                testimonial-scrollbar-hidden

                mt-0
                flex
                w-full
                gap-2

                overflow-x-auto
                overflow-y-visible

                scroll-smooth
                pb-0

                overscroll-x-contain
                overscroll-y-auto

                touch-pan-x
                touch-pan-y

                select-none

                lg:overflow-x-hidden
                lg:px-3
              "
              style={{
                WebkitOverflowScrolling:
                  "touch",
              }}
            >
              {testimonials.map(
                (data) => (
                  <div
                    key={
                      data._id
                    }
                    data-testimonial-card
                    className="
                      shrink-0
                    "
                  >
                    <TestimonialCard
                      data={data}
                      onOpen={
                        setSelectedTestimonial
                      }
                    />
                  </div>
                )
              )}
            </div>
          )}
      </main>

      {/* MODAL */}

      <AnimatePresence>
        {selectedTestimonial && (
          <TestimonialModal
            data={
              selectedTestimonial
            }
            onClose={() =>
              setSelectedTestimonial(
                null
              )
            }
          />
        )}
      </AnimatePresence>

      {/* SCROLLBAR */}

      <style>{`
        .testimonial-scrollbar-hidden {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }

        .testimonial-scrollbar-hidden::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        .testimonial-scrollbar-hidden::-webkit-scrollbar-track {
          display: none !important;
        }

        .testimonial-scrollbar-hidden::-webkit-scrollbar-thumb {
          display: none !important;
          background: transparent !important;
        }

        /*
          IMPORTANT:
          Don't disable vertical touch scrolling
          on testimonial cards/container.
        */
        .testimonial-scrollbar-hidden {
          touch-action: pan-x pan-y;
        }
      `}</style>
    </div>
  );
}