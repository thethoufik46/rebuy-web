import React, { useState } from "react";

const TERMS_URL =
  "https://rebuy-api.onrender.com/terms";

export default function TermsConditions() {
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/home";
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f8] text-black">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          sticky top-0 z-40
          border-b border-black/[0.06]
          bg-white/90
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex min-h-[64px]
            max-w-6xl
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
          "
        >

          {/* TITLE */}

          <div className="min-w-0">

            <h1
              className="
                truncate
                text-base
                font-bold
                tracking-tight
                sm:text-lg
              "
            >
              Terms & Conditions
            </h1>

            <p
              className="
                mt-0.5
                text-[10px]
                font-medium
                text-black/40
                sm:text-xs
              "
            >
              Re2Buy
            </p>

          </div>


          {/* BACK BUTTON */}

          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="
              ml-4
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-black/[0.06]
              bg-black/[0.03]
              text-black/70
              transition-all
              duration-200
              hover:bg-black/[0.07]
              hover:text-black
              active:scale-90
            "
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>

        </div>
      </header>


      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <section
        className="
          mx-auto
          w-full
          max-w-6xl
          px-3
          py-3
          sm:px-5
          sm:py-5
          lg:px-8
        "
      >

        <div
          className="
            relative
            min-h-[calc(100vh-100px)]
            overflow-hidden
            rounded-2xl
            border
            border-black/[0.06]
            bg-white
            shadow-[0_8px_35px_rgba(15,23,42,0.05)]
          "
        >

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div
              className="
                absolute
                inset-0
                z-20
                flex
                items-center
                justify-center
                bg-white
              "
            >

              <div className="flex flex-col items-center">

                {/* Spinner */}

                <div
                  className="
                    h-7
                    w-7
                    animate-spin
                    rounded-full
                    border-2
                    border-black/[0.08]
                    border-t-black
                  "
                />

                <span
                  className="
                    mt-3
                    text-[10px]
                    font-medium
                    text-black/35
                  "
                >
                  Loading...
                </span>

              </div>

            </div>
          )}


          {/* =================================================
              TERMS PAGE
          ================================================= */}

          <iframe
            src={TERMS_URL}
            title="Re2Buy Terms & Conditions"
            loading="eager"
            className="
              block
              h-[calc(100vh-100px)]
              min-h-[600px]
              w-full
              border-0
              bg-white
            "
            onLoad={() => setLoading(false)}
            allow="fullscreen"
          />

        </div>

      </section>

    </main>
  );
}