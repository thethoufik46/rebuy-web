// ======================= src/pages/Faq/Cashback.jsx =======================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus } from "lucide-react";

/* =========================================================
   FAQ DATA
========================================================= */

const faqs = [
  {
    q: `What is Re2Buy Cashback offer?
Re2Buy Cashback offer என்றால் என்ன?`,
    a: `Re2Buy offers cashback ranging from ₹500 to ₹5,000 based on the car model, deal type, and applicable terms & conditions.

Re2Buy நிறுவனத்தின் Cashback offer என்பது ₹500 முதல் ₹5,000 வரை வழங்கப்படும். இது கார் மாடல், டீல் வகை மற்றும் விதிமுறைகள் (Terms & Conditions) அடிப்படையில் மாறுபடும்.`,
  },
  {
    q: `Is cashback guaranteed for all cars?
எல்லா கார்களுக்கும் Cashback கிடைக்குமா?`,
    a: `No, cashback is not guaranteed for all cars. It is applicable only for selected cars and demo / trusted board vehicles based on internal eligibility.

இல்லை, எல்லா கார்களுக்கும் Cashback கிடைக்காது. Demo Cars மற்றும் Trusted Board (T Board) Cars போன்ற தேர்ந்தெடுக்கப்பட்ட கார்களுக்கு மட்டுமே Cashback வழங்கப்படும்.`,
  },
  {
    q: `When will I receive the cashback?
Cashback எப்போது வழங்கப்படும்?`,
    a: `Cashback will be provided at the time of car delivery through a cashback card or direct settlement based on the offer.

கார் டெலிவரி பெறும் போது Cashback Card மூலமாக அல்லது நேரடி Settlement மூலம் Cashback வழங்கப்படும்.`,
  },
  {
    q: `Who is eligible to refer a car and get cashback?
Cashback பெற கார் Refer செய்ய யார் தகுதி உடையவர்?`,
    a: `Only customers who have personally visited and verified the car directly are eligible to refer that car.

காரை நேரில் வந்து பார்த்து சரிபார்த்தவர்கள் மட்டுமே அந்த காரை Refer செய்ய தகுதி உடையவர்கள்.`,
  },
  {
    q: `Can cashback be transferred as cash or bank transfer?
Cashback-ஐ Cash அல்லது Bank Transfer ஆக பெற முடியுமா?`,
    a: `Yes, cashback can be provided either as cash or transferred directly to your bank account based on Re2Buy policies.

ஆம், Re2Buy விதிமுறைகளின் படி Cashback-ஐ Cash ஆகவோ அல்லது உங்கள் Bank Account-க்கு Transfer செய்யவோ முடியும்.`,
  },
  {
    q: `Are there any terms and conditions for cashback?
Cashback-க்கு விதிமுறைகள் உள்ளதா?`,
    a: `Yes, all cashback offers are strictly subject to terms and conditions. Final approval depends on car eligibility, deal completion, and Re2Buy confirmation.

ஆம், Cashback offers அனைத்தும் Terms & Conditions அடிப்படையில் மட்டுமே வழங்கப்படும். கார் தகுதி, டீல் நிறைவு மற்றும் Re2Buy உறுதிப்படுத்தல் ஆகியவற்றைப் பொறுத்து Cashback வழங்கப்படும்.`,
  },
  {
    q: `Which cars usually have higher cashback offers?
எந்த கார்கள் அதிக Cashback வழங்கும்?`,
    a: `Premium and high-demand cars like Innova Crysta, Demo Cars, and selected Board Cars usually have higher cashback offers.

Innova Crysta போன்ற Premium Cars, Demo Cars மற்றும் சில Board Cars-க்கு அதிக Cashback வழங்கப்படும்.`,
  },
];

/* =========================================================
   VIDEO
========================================================= */

const VIDEO_URL =
  "https://pub-73dec08cb6464c74a1b1bb96b4279b12.r2.dev/uploadimg/Comment%20(1)%20(1).mp4";

/* =========================================================
   CASHBACK PAGE
========================================================= */

export default function Cashback() {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(-1);

  const toggleFaq = (index) => {
    setExpandedIndex((current) =>
      current === index ? -1 : index
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#f3efff] text-black">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-[#e9e9ff]/95 backdrop-blur-xl">
        <div className="flex h-[68px] w-full items-center px-4 sm:px-6 lg:px-10">

          {/* BACK */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-full bg-white
              text-black shadow-sm
              transition-all duration-200
              hover:bg-black hover:text-white
              hover:scale-105
              active:scale-95
            "
          >
            <ArrowLeft size={19} strokeWidth={2.2} />
          </button>

          {/* CENTER TITLE */}

          <div className="flex flex-1 justify-center pr-10">
            <h1 className="text-[18px] font-semibold text-black/90">
              Cashback
            </h1>
          </div>

        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* ===================================================
            VIDEO
        =================================================== */}

        <section className="w-full">

          <div
            className="
              relative mx-auto w-full max-w-[1000px]
              overflow-hidden rounded-[22px]
              border border-white/60
              bg-white/40
              shadow-[0_18px_50px_rgba(0,0,0,0.08)]
              backdrop-blur-xl
            "
          >
            <video
              className="
                block
                h-[220px]
                w-full
                object-cover
                sm:h-[280px]
                md:h-[360px]
                lg:h-[430px]
                xl:h-[470px]
              "
              src={VIDEO_URL}
              controls
              playsInline
              preload="metadata"
            />
          </div>

        </section>

        {/* ===================================================
            TITLE
        =================================================== */}

        <section className="mx-auto mt-7 max-w-[900px] text-center">

          <h2
            className="
              text-[22px]
              font-bold
              leading-tight
              tracking-tight
              text-black
              sm:text-[25px]
              lg:text-[28px]
            "
          >
            Car Cashback{" "}
            <span className="font-semibold">
              ( கார் கேஷ்பேக் )
            </span>
          </h2>

          <p
            className="
              mx-auto mt-2 max-w-[700px]
              text-[13px] leading-6
              text-black/55 sm:text-[14px]
            "
          >
            Earn cashback on selected cars based on eligibility
            and terms &amp; conditions.
          </p>

        </section>

        {/* ===================================================
            FAQ
        =================================================== */}

        <section className="mx-auto mt-7 w-full max-w-[1000px] pb-10">

          <div className="flex flex-col gap-3">

            {faqs.map((faq, index) => {
              const isOpen = expandedIndex === index;

              return (
                <article
                  key={index}
                  className="
                    overflow-hidden
                    rounded-[15px]
                    border border-black/[0.04]
                    bg-white
                    shadow-[0_5px_18px_rgba(0,0,0,0.045)]
                  "
                >

                  {/* QUESTION */}

                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="
                      flex w-full items-center
                      gap-4 px-4 py-4
                      text-left
                      transition-colors
                      hover:bg-black/[0.015]
                      sm:px-5 sm:py-[17px]
                    "
                  >

                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          whitespace-pre-line
                          text-[14px]
                          font-semibold
                          leading-[1.45]
                          text-black/90
                          sm:text-[15px]
                        "
                      >
                        {faq.q}
                      </p>
                    </div>

                    {/* PLUS / MINUS */}

                    <span
                      className="
                        flex h-8 w-8 shrink-0
                        items-center justify-center
                        rounded-full
                        bg-black text-white
                      "
                    >
                      {isOpen ? (
                        <Minus
                          size={16}
                          strokeWidth={2.4}
                        />
                      ) : (
                        <Plus
                          size={16}
                          strokeWidth={2.4}
                        />
                      )}
                    </span>

                  </button>

                  {/* ANSWER */}

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5">

                      <div className="mb-4 h-px w-full bg-black/[0.05]" />

                      <p
                        className="
                          whitespace-pre-line
                          text-[13px]
                          leading-[1.7]
                          text-black/55
                          sm:text-[14px]
                        "
                      >
                        {faq.a}
                      </p>

                    </div>
                  )}

                </article>
              );
            })}

          </div>

        </section>

      </main>
    </div>
  );
}