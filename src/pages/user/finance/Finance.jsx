// src/pages/user/finance/Finance.jsx

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaMinus,
} from "react-icons/fa";

import AppBar from "@/components/AppBar";
import Footer from "@/pages/user/home/Footer";

/* =========================================================
   ASSETS / REMOTE MEDIA
========================================================= */

const FINANCE_VIDEO =
  "https://pub-73dec08cb6464c74a1b1bb96b4279b12.r2.dev/uploadimg/Comment%20(1)%20(1).mp4";

/* =========================================================
   FAQ DATA
========================================================= */

const FAQS = [
  {
    category: "Finance / பைனான்ஸ்",
    q:
      "Do you provide car loan facilities for used cars?\nபயன்படுத்திய (Used) கார்கள் மீது கடன் வசதி வழங்குகிறீர்களா?",
    a:
      "Yes, we provide car loan assistance for used cars through our trusted finance partners with attractive interest rates.\n" +
      "ஆம், எங்களின் நம்பகமான ஃபைனான்ஸ் கூட்டாளர்களின் மூலம் பயன்படுத்திய (Used) கார்கள் மீது குறைந்த வட்டி விகிதத்தில் கடன் வசதியை வழங்குகிறோம்.",
  },

  {
    q:
      "What is the minimum down payment required?\nகுறைந்தபட்ச முன்பணம் எவ்வளவு செலுத்த வேண்டும்?",
    a:
      "Down payment depends on the car IDV value and the finance partner. Typically, it starts from 10% of the car price.\n" +
      "முன்பணம் என்பது கார் IDV மதிப்பையும் (Insurance Declared Value) மற்றும் ஃபைனான்ஸ் நிறுவனத்தையும் பொறுத்தது. " +
      "பொதுவாக கார் விலையின் 10% முதல் முன்பணம் செலுத்த வேண்டும். " +
      "உதாரணமாக, Swift கார் போன்றவற்றுக்கு ₹1.5 லட்சம் முதல் ₹2 லட்சம் வரை முன்பணம் இருக்கலாம்.",
  },

  {
    q:
      "What documents are required for car finance?\nகார் ஃபைனான்ஸ்க்கு தேவையான ஆவணங்கள் என்ன?",
    a:
      "Basic documents include ID proof, address proof, income proof, bank statements, and passport size photographs.\n" +
      "கார் ஃபைனான்ஸ்க்கு பொதுவாக கீழ்கண்ட ஆவணங்கள் தேவை:\n" +
      "1. பயனர் ஆதார் கார்டு (User Aadhar Card)\n" +
      "2. பயனர் PAN கார்டு (User PAN Card)\n" +
      "3. வீட்டின் EB ரசீது (House EB Receipt)\n" +
      "4. உத்தரவாததாரர் ஆதார் கார்டு (Guarantor Aadhar Card)\n" +
      "5. உத்தரவாததாரர் PAN கார்டு (Guarantor PAN Card)\n" +
      "மேற்கண்ட அனைத்து ஆவணங்களும் நகல்கள் (All copies) ஆக வழங்க வேண்டும்.",
  },

  {
    q:
      "How long does loan approval take?\nகடன் அனுமதி பெற எவ்வளவு நேரம் ஆகும்?",
    a:
      "Loan approval usually takes 24 to 48 hours after document verification. Approval time also depends on your CIBIL score.\n" +
      "ஆவணங்கள் சரிபார்ப்பு முடிந்த பின், பொதுவாக 24 முதல் 48 மணி நேரத்திற்குள் கடன் அனுமதி வழங்கப்படும். " +
      "இதன் கால அளவு உங்கள் CIBIL ஸ்கோர் மற்றும் தகுதியையும் பொறுத்தது.",
  },

  {
    q:
      "From which year used cars are eligible for finance?\nஎந்த வருட மாடல் பயன்படுத்திய கார்கள் முதல் ஃபைனான்ஸ் கிடைக்கும்?",
    a:
      "Used car finance is generally available for vehicles from 2013 model year onwards.\n" +
      "பொதுவாக 2013 மற்றும் அதற்குப் பிறகு உள்ள (2013+ மாடல்) பயன்படுத்திய கார்கள் மீது ஃபைனான்ஸ் வழங்கப்படுகிறது.",
  },

  {
    q:
      "Can I buy a car without a down payment? Is full finance available?\nமுன்பணம் இல்லாமல் கார் வாங்க முடியுமா? முழு ஃபைனான்ஸ் கிடைக்குமா?",
    a:
      "Yes, but full finance is available only for Own Board cars and only for selected latest models.\n" +
      "ஆம், ஆனால் முழு ஃபைனான்ஸ் Own Board கார்கள் மீது மட்டுமே கிடைக்கும். அதுவும் சில தேர்ந்தெடுக்கப்பட்ட லேட்டஸ்ட் மாடல் கார்கள் மட்டுமே வழங்கப்படும்.",
  },

  {
    q:
      "How can I approach a nearby finance company for a car loan?\nஎங்களது அருகாமையில் இருக்கும் ஃபைனான்ஸ் நிறுவனத்தை எவ்வாறு அணுகலாம்?",
    a:
      "You can approach the finance company by submitting the car RC and car insurance details. Based on the car IDV value, they will assess and provide finance.\n" +
      "கார் ஃபைனான்ஸ் பெற, கார் RC மற்றும் கார் இன்சூரன்ஸ் விவரங்களை வழங்கி அருகிலுள்ள ஃபைனான்ஸ் நிறுவனத்திடம் கேட்டுக்கொள்ளலாம். " +
      "அவர்கள் கார் IDV மதிப்பை அடிப்படையாகக் கொண்டு ஃபைனான்ஸ் தொகையை நிர்ணயித்து வழங்குவார்கள். " +
      "(உதாரணமாக: Sriram, Cholamandalam போன்ற ஃபைனான்ஸ் நிறுவனங்கள்).",
  },

  {
    q:
      "What are the steps involved in your finance process?\nஉங்களிடம் ஃபைனான்ஸ் செயல்முறை (Process) எவ்வாறு நடைபெறும்?",
    a:
      "Once you pay the advance amount for the car, we will immediately start the finance process.\n" +
      "காருக்கான முன்பணம் (Advance) செலுத்தியவுடன், ஃபைனான்ஸ் செயல்முறையை உடனடியாக தொடங்குவோம்.\n\n" +
      "Step 1: Your documents will be verified and your CIBIL score will be checked.\n" +
      "படி 1: உங்கள் ஆவணங்கள் சரிபார்க்கப்பட்டு, உங்கள் CIBIL ஸ்கோர் சரிபார்க்கப்படும்.\n\n" +
      "Step 2: The financier will evaluate the car and decide the eligible finance amount. During this stage, a validation fee of around ₹700 may be charged. This amount is not fixed and may vary.\n" +
      "படி 2: ஃபைனான்சியர் கார் மதிப்பீடு செய்து எவ்வளவு ஃபைனான்ஸ் வழங்கலாம் என்பதை தீர்மானிப்பார். இந்த கட்டத்தில் சுமார் ₹700 வரை வேலிடேஷன் கட்டணம் கேட்கப்படலாம். இது நிரந்தர தொகை அல்ல.\n\n" +
      "Step 3: Home verification will be done by the finance company branch.\n" +
      "படி 3: ஃபைனான்ஸ் நிறுவனத்தின் கிளையிலிருந்து வீட்டுச் சரிபார்ப்பு (Home Verification) நடைபெறும்.\n\n" +
      "Step 4: If all verifications are completed successfully, the finance will be approved.\n" +
      "படி 4: அனைத்து சரிபார்ப்புகளும் சரியாக இருந்தால், ஃபைனான்ஸ் அனுமதி வழங்கப்படும்.\n\n" +
      "Step 5: After finance approval, the balance amount settlement will be completed and the car delivery can be taken along with original documents such as RC and NOC.\n" +
      "படி 5: ஃபைனான்ஸ் அனுமதி கிடைத்த பின், மீதமுள்ள தொகை (Balance Settlement) செலுத்தி, RC, NOC போன்ற அசல் ஆவணங்களுடன் காரை டெலிவரி பெற்றுக்கொள்ளலாம்.",
  },

  {
    q:
      "Is there an option to get finance through a bank loan without private finance? Is a backload option available?\nபிரைவேட் ஃபைனான்ஸ் இல்லாமல் பேங்க் லோன் மூலம் கடன் பெற முடியுமா?",
    a:
      "Yes, bank loan finance is available without private finance.\n" +
      "ஆம், பிரைவேட் ஃபைனான்ஸ் இல்லாமல் பேங்க் லோன் மூலம் ஃபைனான்ஸ் பெறலாம்.",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function Finance() {
  const [openFaq, setOpenFaq] = useState(-1);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#f3efff] text-slate-900">
      <FinanceStyles />

      {/* =====================================================
          APP BAR
      ===================================================== */}

      <AppBar title="Finance" />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <motion.main
        initial={{
          opacity: 0,
          y: 60,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative flex-1"
      >
        {/* BACKGROUND */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-[#d6cef3] via-[#eee9ff] to-[#f3efff]" />

        {/* CONTENT */}
        <div className="relative mx-auto w-full max-w-[1180px] px-4 pb-16 pt-5 sm:px-6 lg:px-8">

          {/* =================================================
              HERO
          ================================================= */}

          <FinanceHero />

          {/* =================================================
              FAQ
          ================================================= */}

          <section className="mt-10">
            <div className="mb-5 text-center">
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 shadow-sm">
                Finance / பைனான்ஸ்
              </span>

              <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl">
                Car Finance Questions
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Everything you need to know about used-car finance,
                documents, approval and the finance process.
              </p>
            </div>

            <FinanceFaq
              openFaq={openFaq}
              setOpenFaq={setOpenFaq}
            />
          </section>
        </div>
      </motion.main>

      {/* =====================================================
          FULL WIDTH FOOTER
      ===================================================== */}

      <motion.footer
        initial={{
          opacity: 0,
          y: 70,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          delay: 0.18,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mt-auto w-full shrink-0"
      >
        <Footer />
      </motion.footer>
    </div>
  );
}

/* =========================================================
   HERO VIDEO
========================================================= */

function FinanceHero() {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
        delay: 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="overflow-hidden rounded-[30px] border border-white/80 bg-white/55 p-3 shadow-[0_18px_55px_rgba(65,45,130,0.10)] backdrop-blur-xl"
    >
      <div className="relative aspect-video max-h-[520px] overflow-hidden rounded-[24px] bg-black">
        <video
          src={FINANCE_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          controls
          className="h-full w-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md">
          Re2Buy Finance
        </div>
      </div>

      <div className="px-2 pb-2 pt-6 text-center sm:px-6">
        <h2 className="text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl">
          Car Finance{" "}
          <span className="text-slate-500">
            ( கார் பைனான்ஸ் )
          </span>
        </h2>

        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Get easy finance options with flexible EMI plans and quick approvals.
        </p>
      </div>
    </motion.section>
  );
}

/* =========================================================
   FAQ
========================================================= */

function FinanceFaq({ openFaq, setOpenFaq }) {
  return (
    <div className="space-y-3">
      {FAQS.map((faq, index) => {
        const isOpen = openFaq === index;

        return (
          <motion.div
            key={index}
            layout
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
              delay: 0.12 + index * 0.035,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden rounded-[18px] border border-black/10 bg-white shadow-[0_5px_18px_rgba(15,23,42,0.045)]"
          >
            <button
              type="button"
              onClick={() =>
                setOpenFaq(isOpen ? -1 : index)
              }
              className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
            >
              <span className="flex-1 whitespace-pre-line text-[14px] font-semibold leading-6 text-slate-900 sm:text-[15px]">
                {faq.q}
              </span>

              <span
                className={`
                  flex h-8 w-8 shrink-0 items-center justify-center
                  rounded-full transition-all
                  ${
                    isOpen
                      ? "bg-black text-white"
                      : "bg-slate-100 text-slate-800"
                  }
                `}
              >
                {isOpen ? (
                  <FaMinus size={12} />
                ) : (
                  <FaPlus size={12} />
                )}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0,
                  }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.28,
                    ease: "easeOut",
                  }}
                >
                  <div className="border-t border-black/5 px-4 pb-5 pt-4 sm:px-5">
                    <TypewriterText
                      text={faq.a}
                      speed={12}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

/* =========================================================
   TYPEWRITER
========================================================= */

function TypewriterText({
  text,
  speed = 15,
}) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");

    let index = 0;

    const timer = window.setInterval(() => {
      if (index >= text.length) {
        window.clearInterval(timer);
        return;
      }

      setDisplayed(
        (previous) =>
          previous + text[index]
      );

      index += 1;
    }, speed);

    return () => {
      window.clearInterval(timer);
    };
  }, [text, speed]);

  return (
    <p className="whitespace-pre-line text-[14px] leading-7 text-slate-500">
      {displayed}
    </p>
  );
}

/* =========================================================
   SMALL CSS
========================================================= */

function FinanceStyles() {
  return (
    <style>{`
      @keyframes financeShimmer {
        0% {
          background-position: 200% 0;
        }

        100% {
          background-position: -200% 0;
        }
      }

      .finance-scrollbar::-webkit-scrollbar {
        width: 6px;
      }

      .finance-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,.12);
        border-radius: 999px;
      }
    `}</style>
  );
}