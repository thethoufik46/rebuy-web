import React, { useState } from "react";

const PRIVACY_URL =
  "https://rebuy-api.onrender.com/privacy-policy";

export default function PrivacyPolicy() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="min-h-screen bg-[#f7f7f8] text-black">
      {/* Header */}
      <header
        className="
          sticky top-0 z-40
          border-b border-black/[0.06]
          bg-white/85
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto flex min-h-[64px]
            max-w-6xl items-center
            justify-between
            px-4 sm:px-6 lg:px-8
          "
        >
          <div>
            <h1 className="text-base font-bold tracking-tight sm:text-lg">
              Privacy Policy
            </h1>

            <p className="mt-0.5 text-[10px] text-black/45 sm:text-xs">
              Re2Buy
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-full
              border border-black/[0.06]
              bg-black/[0.03]
              text-black/70
              transition
              hover:bg-black/[0.07]
              active:scale-95
            "
            aria-label="Go back"
          >
            ←
          </button>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-3 py-3 sm:px-5 sm:py-5 lg:px-8">
        <div
          className="
            relative min-h-[calc(100vh-100px)]
            overflow-hidden
            rounded-2xl
            border border-black/[0.06]
            bg-white
            shadow-[0_8px_35px_rgba(15,23,42,0.05)]
          "
        >
          {loading && (
            <div
              className="
                absolute inset-0 z-10
                flex items-center justify-center
                bg-white
              "
            >
              <div
                className="
                  h-7 w-7
                  animate-spin
                  rounded-full
                  border-2
                  border-black/10
                  border-t-black
                "
              />
            </div>
          )}

          <iframe
            src={PRIVACY_URL}
            title="Re2Buy Privacy Policy"
            className="
              block
              h-[calc(100vh-100px)]
              min-h-[600px]
              w-full
              border-0
            "
            loading="eager"
            onLoad={() => setLoading(false)}
          />
        </div>
      </section>
    </main>
  );
}