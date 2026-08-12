
import React, {
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
   CACHE
========================================================= */

let cachedVariants = [];

let cacheTime = null;

const CACHE_DURATION =
  10 * 60 * 1000;

/* =========================================================
   CONSTANTS
========================================================= */

const SUBTITLE =
  "Filtered by";

/* =========================================================
   HELPERS
========================================================= */

const s = (value) =>
  value
    ? value.toString()
    : "";

/* =========================================================
   HOME ROUND BUTTONS
========================================================= */


/* =========================================================
   LOADING ANIMATION
   ONLY skeleton shimmer — no card entrance/hover animation
========================================================= */

function SkeletonShimmerStyles() {
  return (
    <style>{`
      @keyframes homeOwnCardSkeletonShimmer {
        0% {
          transform: translateX(-180%) rotate(12deg);
        }

        100% {
          transform: translateX(380%) rotate(12deg);
        }
      }

      .skeleton-shimmer {
        animation:
          homeOwnCardSkeletonShimmer
          1.25s
          linear
          infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .skeleton-shimmer {
          animation: none;
        }
      }
    `}</style>
  );
}

export default function HomeRoundButtons() {
  const navigate =
    useNavigate();

  /* =======================================================
     STATES
  ======================================================= */

  const [
    variants,
    setVariants,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    hasError,
    setHasError,
  ] = useState(false);

  const [
    maxVariants,
    setMaxVariants,
  ] = useState(17);


  /* =======================================================
     REFS
  ======================================================= */

  const scrollRef =
    useRef(null);

  const autoScrollRef =
    useRef(null);

  const resetTimeoutRef =
    useRef(null);

  const userInteractingRef =
    useRef(false);

  const resumeTimeoutRef =
    useRef(null);


  /* =======================================================
     RESPONSIVE COUNT
  ======================================================= */

  useEffect(() => {
    const updateCount = () => {
      const width =
        window.innerWidth;

      /*
       * Mobile:
       * show fewer items
       *
       * Desktop:
       * show more items
       */

      if (width < 480) {
        setMaxVariants(6);
      } else if (width < 768) {
        setMaxVariants(8);
      } else {
        setMaxVariants(17);
      }
    };

    updateCount();

    window.addEventListener(
      "resize",
      updateCount
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateCount
      );
    };
  }, []);


  /* =======================================================
     LOAD VARIANTS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadVariants =
      async () => {

        /*
         * Cached data
         */

        if (
          cacheTime &&
          Date.now() - cacheTime <
            CACHE_DURATION &&
          cachedVariants.length > 0
        ) {
          if (mounted) {
            setVariants(
              cachedVariants
            );

            setLoading(false);
            setHasError(false);
          }

          return;
        }


        /*
         * Start loading
         */

        if (mounted) {
          setLoading(true);
          setHasError(false);
        }


        try {
          const response =
            await fetch(
              `${BASE_URL}/variants/visible`
            );


          if (!response.ok) {
            throw new Error(
              `Variants request failed: ${response.status}`
            );
          }


          const data =
            await response.json();


          const fetched =
            Array.isArray(
              data?.variants
            )
              ? data.variants
              : [];


          /*
           * Cache
           */

          cachedVariants =
            fetched;

          cacheTime =
            Date.now();


          if (mounted) {
            setVariants(
              fetched
            );

            setLoading(false);
            setHasError(false);
          }

        } catch (error) {

          console.error(
            "Variants error:",
            error
          );


          if (mounted) {
            setLoading(false);
            setHasError(true);

            /*
             * Don't destroy already
             * available cached data.
             */

            if (
              cachedVariants.length > 0
            ) {
              setVariants(
                cachedVariants
              );
            }
          }
        }
      };


    loadVariants();


    return () => {
      mounted = false;
    };
  }, []);


  /* =======================================================
     STOP AUTO SCROLL
  ======================================================= */

  const stopAutoScroll =
    () => {

      if (
        autoScrollRef.current
      ) {
        cancelAnimationFrame(
          autoScrollRef.current
        );

        autoScrollRef.current =
          null;
      }

      if (
        resetTimeoutRef.current
      ) {
        clearTimeout(
          resetTimeoutRef.current
        );

        resetTimeoutRef.current =
          null;
      }
    };


  /* =======================================================
     START AUTO SCROLL
  ======================================================= */

  const startAutoScroll =
    () => {

      stopAutoScroll();


      /*
       * Don't auto-scroll while
       * loading / empty.
       */

      if (
        loading ||
        !variants.length
      ) {
        return;
      }


      const animate = () => {

        const element =
          scrollRef.current;


        if (
          !element ||
          userInteractingRef.current
        ) {
          autoScrollRef.current =
            requestAnimationFrame(
              animate
            );

          return;
        }


        /*
         * Very smooth movement.
         */

        const maxScroll =
          element.scrollWidth -
          element.clientWidth;


        /*
         * No overflow.
         */

        if (
          maxScroll <= 2
        ) {
          stopAutoScroll();
          return;
        }


        const nextPosition =
          element.scrollLeft +
          0.35;


        /*
         * Reached end
         */

        if (
          nextPosition >=
          maxScroll - 1
        ) {

          stopAutoScroll();


          resetTimeoutRef.current =
            setTimeout(() => {

              if (
                !scrollRef.current
              ) {
                return;
              }


              /*
               * Smoothly reset
               */

              scrollRef.current.scrollTo(
                {
                  left: 0,
                  behavior:
                    "smooth",
                }
              );


              /*
               * Wait before
               * starting again.
               */

              resetTimeoutRef.current =
                setTimeout(() => {
                  startAutoScroll();
                }, 900);

            }, 1600);


          return;
        }


        element.scrollLeft =
          nextPosition;


        autoScrollRef.current =
          requestAnimationFrame(
            animate
          );
      };


      autoScrollRef.current =
        requestAnimationFrame(
          animate
        );
    };


  /* =======================================================
     AUTO SCROLL EFFECT
  ======================================================= */

  useEffect(() => {

    /*
     * Wait until real data exists.
     */

    if (
      loading ||
      !variants.length
    ) {
      stopAutoScroll();

      return;
    }


    /*
     * Small delay after cards
     * appear.
     */

    const timer =
      setTimeout(() => {
        startAutoScroll();
      }, 1200);


    return () => {
      clearTimeout(timer);
      stopAutoScroll();
    };

  }, [
    loading,
    variants.length,
    maxVariants,
  ]);


  /* =======================================================
     USER INTERACTION
  ======================================================= */

  const pauseAutoScroll =
    () => {

      userInteractingRef.current =
        true;

      stopAutoScroll();


      if (
        resumeTimeoutRef.current
      ) {
        clearTimeout(
          resumeTimeoutRef.current
        );
      }
    };


  const resumeAutoScroll =
    () => {

      userInteractingRef.current =
        false;


      /*
       * Delay resume so the user
       * can finish swiping.
       */

      resumeTimeoutRef.current =
        setTimeout(() => {

          if (
            variants.length &&
            !loading
          ) {
            startAutoScroll();
          }

        }, 1800);
    };


  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {

    return () => {

      stopAutoScroll();

      if (
        resumeTimeoutRef.current
      ) {
        clearTimeout(
          resumeTimeoutRef.current
        );
      }

    };

  }, []);


  /* =======================================================
     DISPLAY DATA
  ======================================================= */

  const showVariants =
    variants.slice(
      0,
      maxVariants
    );


  /* =======================================================
     SKELETON LOADING
  ======================================================= */

  if (loading) {
    return (
      <VariantSkeletonRow />
    );
  }


  /* =======================================================
     ERROR + NO DATA
  ======================================================= */

  if (
    hasError &&
    !variants.length
  ) {
    return (
      <VariantEmptyState />
    );
  }


  /* =======================================================
     EMPTY DATA
  ======================================================= */

  if (
    !showVariants.length
  ) {
    return (
      <VariantEmptyState />
    );
  }


  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <>
      <SkeletonShimmerStyles />
      <section
      className="
        relative
        w-full
        overflow-hidden
        py-1
      "
    >

      {/* =================================================
          FADE LEFT
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          z-20
          h-full
          w-5
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
        onMouseDown={
          pauseAutoScroll
        }
        onMouseUp={
          resumeAutoScroll
        }
        onMouseLeave={
          resumeAutoScroll
        }
        onTouchStart={
          pauseAutoScroll
        }
        onTouchEnd={
          resumeAutoScroll
        }
        onWheel={
          pauseAutoScroll
        }
      >

        {/* =================================================
            VARIANT CARDS
        ================================================= */}

        {showVariants.map(
          (
            variant,
            index
          ) => (

            <div
              key={
                variant?._id ||
                variant?.id ||
                `${variant?.variantName}-${index}`
              }
              className="
                shrink-0
              "
              style={{
                scrollSnapAlign:
                  "start",
              }}
            >

              <TapScaleCard
                title={s(
                  variant?.variantName
                )}
                imageUrl={s(
                  variant?.variantImage
                )}
                onTap={() =>
                  navigate(
                    `/variant/${encodeURIComponent(
                      s(
                        variant?.variantName
                      )
                    )}`
                  )
                }
              />

            </div>
          )
        )}


        {/* =================================================
            VIEW ALL
        ================================================= */}

        <div
          className="
            shrink-0
          "
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


      {/* =================================================
          FADE RIGHT
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          right-0
          top-0
          z-20
          h-full
          w-5
          bg-gradient-to-l
          from-[#d6cef3]
          to-transparent
        "
      />

    </section>
    </>
  );
}


/* =========================================================
   VARIANT CARD
========================================================= */

function TapScaleCard({
  title,
  imageUrl,
  onTap,
}) {

  const [
    imageLoaded,
    setImageLoaded,
  ] = useState(false);

  const [
    imageError,
    setImageError,
  ] = useState(false);


  return (
    <button
      type="button"
      onClick={onTap}
      className="
        group
        relative
        h-[126px]
        w-[92px]
        shrink-0
        overflow-hidden
        rounded-[24px]
        border
        border-white/50
        bg-white/20
        text-left
        shadow-[0_10px_28px_rgba(60,45,100,0.13)]
        backdrop-blur-xl
        outline-none

        sm:h-[134px]
        sm:w-[96px]

        focus-visible:ring-2
        focus-visible:ring-black/20
      "
    >

      {/* =================================================
          IMAGE SKELETON
      ================================================= */}

      {!imageLoaded &&
        !imageError && (
          <div
            className="
              absolute
              inset-0
              
              bg-gradient-to-br
              from-white/50
              via-white/20
              to-black/5
            "
          />
        )}


      {/* =================================================
          IMAGE
      ================================================= */}

      {!imageError &&
        imageUrl && (
          <img
            src={imageUrl}
            alt=""
            draggable="false"
            loading="lazy"
            onLoad={() =>
              setImageLoaded(
                true
              )
            }
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
        )}


      {/* =================================================
          IMAGE FALLBACK
      ================================================= */}

      {(imageError ||
        !imageUrl) && (
        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            bg-gradient-to-br
            from-white/55
            via-white/25
            to-black/5
          "
        >

          <span
            className="
              text-2xl
              font-bold
              text-black/20
            "
          >
            R
          </span>

        </div>
      )}


      {/* =================================================
          DARK IMAGE GRADIENT
      ================================================= */}

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


      {/* =================================================
          GLASS TITLE
      ================================================= */}

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
          backdrop-blur-xl
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
          {title || "Variant"}
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
          {SUBTITLE}
        </div>

      </div>


      {/* =================================================
          TOP GLASS HIGHLIGHT
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          left-2
          right-2
          top-2
          h-8
          rounded-full
          bg-white/20
          blur-md
        "
      />

    </button>
  );
}


/* =========================================================
   VIEW ALL CARD
========================================================= */

function ViewAllCard({
  onTap,
}) {

  return (
    <button
      type="button"
      onClick={onTap}
      className="
        relative
        flex
        h-[126px]
        w-[92px]
        shrink-0
        flex-col
        items-center
        justify-center
        overflow-hidden
        rounded-[24px]
        border
        border-white/60
        bg-white/35
        shadow-[0_10px_28px_rgba(60,45,100,0.10)]
        backdrop-blur-2xl
        transition-all

        sm:h-[134px]
        sm:w-[96px]
      "
    >

      {/* =================================================
          GLASS BACKGROUND
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-br
          from-white/60
          via-white/20
          to-transparent
        "
      />


      {/* =================================================
          ARROW
      ================================================= */}

      <div
        className="
          relative
          z-10
          mb-2
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
          backdrop-blur-xl
        "
      >
        →
      </div>


      {/* =================================================
          TEXT
      ================================================= */}

      <span
        className="
          relative
          z-10
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
          relative
          z-10
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


/* =========================================================
   SKELETON ROW
   ---------------------------------------------------------
   YouTube / Amazon style loading.
========================================================= */

function VariantSkeletonRow() {

  /*
   * Keep skeleton count responsive.
   */

  const [
    count,
    setCount,
  ] = useState(6);


  useEffect(() => {

    const update =
      () => {

        const width =
          window.innerWidth;

        if (width < 480) {
          setCount(4);
        } else if (
          width < 768
        ) {
          setCount(5);
        } else {
          setCount(8);
        }
      };


    update();

    window.addEventListener(
      "resize",
      update
    );


    return () => {
      window.removeEventListener(
        "resize",
        update
      );
    };

  }, []);


  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        py-1
      "
    >

      <div
        className="
          flex
          gap-3
          overflow-hidden
          px-3
          py-2

          sm:gap-4
          sm:px-4
        "
      >

        {Array.from({
          length: count,
        }).map(
          (_, index) => (

            <SkeletonCard
              key={index}
            />

          )
        )}

      </div>

    </section>
  );
}


/* =========================================================
   SKELETON CARD
========================================================= */

function SkeletonCard() {

  return (
    <div
      className="
        relative
        h-[126px]
        w-[92px]
        shrink-0
        overflow-hidden
        rounded-[24px]
        border
        border-white/40
        bg-white/25
        shadow-[0_8px_24px_rgba(60,45,100,0.07)]
        backdrop-blur-xl

        sm:h-[134px]
        sm:w-[96px]
      "
    >

      {/* =================================================
          SHIMMER
      ================================================= */}

      <div
        className="
          skeleton-shimmer
          pointer-events-none
          absolute
          inset-y-0
          -left-1/2
          w-1/2
          rotate-12
          bg-gradient-to-r
          from-transparent
          via-white/55
          to-transparent
          blur-md
        "
      />


      {/* =================================================
          IMAGE PLACEHOLDER
      ================================================= */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-white/45
          via-white/20
          to-black/5
        "
      />


      {/* =================================================
          BOTTOM SKELETON
      ================================================= */}

      <div
        className="
          absolute
          bottom-2
          left-2
          right-2
          space-y-1.5
          rounded-[15px]
          border
          border-white/30
          bg-white/40
          p-2
          backdrop-blur-lg
        "
      >

        <div
          className="
            h-2
            w-3/4
            
            rounded-full
            bg-black/10
          "
        />

        <div
          className="
            h-1.5
            w-1/2
            
            rounded-full
            bg-black/5
          "
        />

      </div>

    </div>
  );
}


/* =========================================================
   EMPTY STATE
========================================================= */

function VariantEmptyState() {

  return (
    <section
      className="
        w-full
        px-3
        py-2
      "
    >

      <div
        className="
          flex
          h-[100px]
          items-center
          justify-center
          rounded-[26px]
          border
          border-white/40
          bg-white/15
          px-5
          text-center
          shadow-sm
          backdrop-blur-xl
        "
      >

        <span
          className="
            text-xs
            font-medium
            text-black/45
          "
        >
          No variants available
        </span>

      </div>

    </section>
  );
}