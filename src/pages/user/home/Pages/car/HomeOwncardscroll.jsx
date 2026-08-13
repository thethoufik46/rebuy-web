import React, {
  memo,
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

/* =========================================================
   API
========================================================= */

const BASE_URL =
  "https://rebuy-api.onrender.com/api";

/* =========================================================
   MEMORY CACHE
========================================================= */

let variantsCache = null;
let variantsLoading = false;
let variantsListeners = [];

function notifyVariants() {
  variantsListeners.forEach(
    (listener) => {
      try {
        listener(
          variantsCache || []
        );
      } catch {
        // ignore listener errors
      }
    }
  );
}

/* =========================================================
   FETCH
   ---------------------------------------------------------
   Simple request.
   NO AbortController.
   NO shimmer.
   NO loading animation.
========================================================= */

function loadVariants() {
  /* Already loaded */
  if (
    Array.isArray(
      variantsCache
    )
  ) {
    return Promise.resolve(
      variantsCache
    );
  }

  /* Already loading */
  if (variantsLoading) {
    return new Promise(
      (resolve) => {
        variantsListeners.push(
          resolve
        );
      }
    );
  }

  variantsLoading = true;

  return fetch(
    `${BASE_URL}/variants/visible`,
    {
      method: "GET",
      headers: {
        Accept:
          "application/json",
      },
      cache: "default",
    }
  )
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(
          `Variants API failed: ${response.status}`
        );
      }

      const data =
        await response.json();

      const result =
        Array.isArray(
          data?.variants
        )
          ? data.variants
          : [];

      variantsCache = result;

      return result;
    })
    .catch((error) => {
      console.error(
        "Variants fetch error:",
        error
      );

      return [];
    })
    .finally(() => {
      variantsLoading = false;

      const listeners =
        variantsListeners;

      variantsListeners = [];

      listeners.forEach(
        (listener) => {
          try {
            listener(
              variantsCache || []
            );
          } catch {
            // ignore
          }
        }
      );
    });
}

/* =========================================================
   HELPERS
========================================================= */

function text(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value);
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function HomeOwncardscroll() {
  const navigate =
    useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [
    variants,
    setVariants,
  ] = useState(
    Array.isArray(
      variantsCache
    )
      ? variantsCache
      : []
  );

  const [
    loading,
    setLoading,
  ] = useState(
    !Array.isArray(
      variantsCache
    )
  );

  const [
    maxVariants,
    setMaxVariants,
  ] = useState(17);

  /* =======================================================
     SCROLL
  ======================================================= */

  const scrollRef =
    useRef(null);

  const autoScrollRef =
    useRef(null);

  const userTouchingRef =
    useRef(false);

  /* =======================================================
     RESPONSIVE COUNT
  ======================================================= */

  useEffect(() => {
    function updateCount() {
      const width =
        window.innerWidth;

      if (width < 480) {
        setMaxVariants(6);
      } else if (
        width < 768
      ) {
        setMaxVariants(8);
      } else {
        setMaxVariants(17);
      }
    }

    updateCount();

    window.addEventListener(
      "resize",
      updateCount,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateCount
      );
    };
  }, []);

  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    /*
     * CACHE
     */
    if (
      Array.isArray(
        variantsCache
      )
    ) {
      setVariants(
        variantsCache
      );

      setLoading(false);

      return () => {
        mounted = false;
      };
    }

    /*
     * API
     */
    loadVariants().then(
      (result) => {
        if (!mounted) {
          return;
        }

        setVariants(
          Array.isArray(result)
            ? result
            : []
        );

        setLoading(false);
      }
    );

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     AUTO SCROLL
     -------------------------------------------------------
     Lightweight.
     NO requestAnimationFrame.
     NO continuous 60fps animation.
========================================================= */

  useEffect(() => {
    if (
      loading ||
      !variants.length
    ) {
      return;
    }

    const element =
      scrollRef.current;

    if (!element) {
      return;
    }

    const maxScroll =
      element.scrollWidth -
      element.clientWidth;

    if (maxScroll <= 2) {
      return;
    }

    /*
     * Slow lightweight scroll.
     */
    autoScrollRef.current =
      window.setInterval(
        () => {
          const target =
            scrollRef.current;

          if (
            !target ||
            userTouchingRef.current
          ) {
            return;
          }

          const max =
            target.scrollWidth -
            target.clientWidth;

          if (max <= 2) {
            return;
          }

          if (
            target.scrollLeft >=
            max - 1
          ) {
            target.scrollLeft = 0;
            return;
          }

          target.scrollLeft +=
            0.7;
        },
        60
      );

    return () => {
      if (
        autoScrollRef.current
      ) {
        window.clearInterval(
          autoScrollRef.current
        );

        autoScrollRef.current =
          null;
      }
    };
  }, [
    loading,
    variants.length,
    maxVariants,
  ]);

  /* =======================================================
     DISPLAY
  ======================================================= */

  const showVariants =
    variants.slice(
      0,
      maxVariants
    );

  /* =======================================================
     LOADING
     -------------------------------------------------------
     NO ANIMATION.
     Just reserve small space.
========================================================= */

  if (loading) {
    return (
      <div
        className="
          w-full
          overflow-hidden
          px-3
          py-2
        "
      >
        <div
          className="
            flex
            gap-3
            overflow-hidden
          "
        >
          {Array.from({
            length: 5,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="
                  h-[126px]
                  w-[92px]
                  shrink-0
                  rounded-[24px]
                  bg-white/30
                  sm:h-[134px]
                  sm:w-[96px]
                "
              />
            )
          )}
        </div>
      </div>
    );
  }

  /* =======================================================
     EMPTY
  ======================================================= */

  if (
    !showVariants.length
  ) {
    return null;
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        py-1
      "
    >
      {/* LEFT FADE */}

      <div
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          z-20
          h-full
          w-4
          bg-gradient-to-r
          from-[#d6cef3]
          to-transparent
        "
      />

      {/* =================================================
          SCROLL CONTAINER
      ================================================= */}

      <div
        ref={scrollRef}
        className="
          flex
          w-full
          gap-3
          overflow-x-auto
          px-3
          py-2
          scrollbar-hide
          sm:gap-4
          sm:px-4
        "
        style={{
          WebkitOverflowScrolling:
            "touch",
          scrollbarWidth:
            "none",
          overscrollBehaviorX:
            "contain",
          scrollSnapType:
            "x proximity",
        }}
        onTouchStart={() => {
          userTouchingRef.current =
            true;
        }}
        onTouchEnd={() => {
          userTouchingRef.current =
            false;
        }}
        onMouseDown={() => {
          userTouchingRef.current =
            true;
        }}
        onMouseUp={() => {
          userTouchingRef.current =
            false;
        }}
      >
        {/* =================================================
            VARIANT CARDS
        ================================================= */}

        {showVariants.map(
          (
            variant,
            index
          ) => {
            const id =
              variant?._id ||
              variant?.id ||
              `${variant?.variantName}-${index}`;

            const title =
              text(
                variant?.variantName
              );

            const image =
              text(
                variant?.variantImage
              );

            return (
              <div
                key={id}
                className="shrink-0"
                style={{
                  scrollSnapAlign:
                    "start",
                }}
              >
                <VariantCard
                  title={title}
                  imageUrl={image}
                  onTap={() => {
                    navigate(
                      `/variant/${encodeURIComponent(
                        title
                      )}`
                    );
                  }}
                />
              </div>
            );
          }
        )}

        {/* =================================================
            VIEW ALL
        ================================================= */}

        <div
          className="shrink-0"
          style={{
            scrollSnapAlign:
              "start",
          }}
        >
          <ViewAllCard
            onTap={() =>
              navigate(
                "/variants"
              )
            }
          />
        </div>
      </div>

      {/* RIGHT FADE */}

      <div
        className="
          pointer-events-none
          absolute
          right-0
          top-0
          z-20
          h-full
          w-4
          bg-gradient-to-l
          from-[#d6cef3]
          to-transparent
        "
      />
    </section>
  );
}

/* =========================================================
   VARIANT CARD
   ---------------------------------------------------------
   Lightweight:
   - lazy image
   - async decoding
   - no animation
   - no shimmer
========================================================= */

const VariantCard = memo(
  function VariantCard({
    title,
    imageUrl,
    onTap,
  }) {
    const [
      imageError,
      setImageError,
    ] = useState(false);

    return (
      <button
        type="button"
        onClick={onTap}
        className="
          relative
          h-[126px]
          w-[92px]
          shrink-0
          overflow-hidden
          rounded-[24px]
          border
          border-white/50
          bg-white/25
          text-left
          shadow-[0_6px_18px_rgba(60,45,100,0.08)]
          outline-none
          sm:h-[134px]
          sm:w-[96px]
        "
      >
        {/* IMAGE */}

        {!imageError &&
        imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            draggable="false"
            loading="lazy"
            decoding="async"
            onError={() =>
              setImageError(
                true
              )
            }
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              absolute
              inset-0
              bg-slate-100
            "
          />
        )}

        {/* IMAGE DARK GRADIENT */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-16
            bg-gradient-to-t
            from-black/65
            via-black/20
            to-transparent
          "
        />

        {/* TITLE */}

        <div
          className="
            absolute
            bottom-1.5
            left-1.5
            right-1.5
            rounded-[15px]
            border
            border-white/40
            bg-white/70
            px-1.5
            py-1.5
            text-center
            shadow-sm
            backdrop-blur-md
          "
        >
          <div
            className="
              truncate
              text-[10px]
              font-bold
              leading-tight
              text-black
            "
          >
            {title ||
              "Variant"}
          </div>

          <div
            className="
              mt-0.5
              truncate
              text-[7px]
              font-medium
              text-black/55
            "
          >
            Filtered by
          </div>
        </div>
      </button>
    );
  }
);

/* =========================================================
   VIEW ALL
========================================================= */

const ViewAllCard = memo(
  function ViewAllCard({
    onTap,
  }) {
    return (
      <button
        type="button"
        onClick={onTap}
        className="
          flex
          h-[126px]
          w-[92px]
          shrink-0
          flex-col
          items-center
          justify-center
          rounded-[24px]
          border
          border-white/60
          bg-white/35
          shadow-[0_6px_18px_rgba(60,45,100,0.07)]
          sm:h-[134px]
          sm:w-[96px]
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-white/60
            bg-white/60
            text-lg
            shadow-sm
          "
        >
          →
        </div>

        <span
          className="
            mt-2
            text-[10px]
            font-bold
            tracking-[0.08em]
            text-black/80
          "
        >
          VIEW ALL
        </span>

        <span
          className="
            mt-0.5
            text-[7px]
            font-medium
            text-black/45
          "
        >
          Explore variants
        </span>
      </button>
    );
  }
);

/* =========================================================
   EXPORT
========================================================= */

export default memo(
  HomeOwncardscroll
);