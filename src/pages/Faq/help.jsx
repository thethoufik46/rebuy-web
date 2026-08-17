// ======================= src/pages/Faq/help.jsx =======================

import React from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Car,
  Route,
  Heart,
  Wallet2,
  Receipt,
  Headphones,
  Phone,
  Instagram,
  Mail,
  X,
  MessageCircle,
  Youtube,
  Send,
  MapPin,
  Facebook,
  AlertTriangle,
} from "lucide-react";

/* =========================================================
   CONSTANTS
========================================================= */

const WHATSAPP_GROUP_LINK =
  "https://chat.whatsapp.com/B8q3mQvvohPHKaIJuxzcHj";

const WHATSAPP_GROUP_IMAGE =
  "https://res.cloudinary.com/dtqxc3rmt/image/upload/v1767812754/dp_d1zwri.jpg";

const INSTAGRAM_LINK =
  "https://www.instagram.com/re2buy.in?igsh=MWl1c2NlcTZ4bm00bw==";

const YOUTUBE_LINK =
  "https://www.youtube.com/@Re2buycars";

const WHATSAPP_LINK =
  "https://wa.me/918270149856";

const PHONE_LINK =
  "tel:8270149856";

const MAIL_LINK =
  "mailto:re2buyall@gmail.com";

const MAP_LINK =
  "https://share.google/mOGsGED4jCmI84n1H";

/* =========================================================
   HELP TOPICS
========================================================= */

const helpTopics = [
  {
    icon: Car,
    title: "Buying a Car",
    subtitle: "Car search, pricing & booking",
    gradient: "from-[#ffe6f0] to-[#f3efff]",
    align: "left",
  },
  {
    icon: Route,
    title: "Buying a Bike",
    subtitle: "Bike availability & purchase",
    gradient: "from-[#e6f8ff] to-[#effaff]",
    align: "right",
  },
  {
    icon: Heart,
    title: "Wishlist",
    subtitle: "Save & manage favourites",
    gradient: "from-[#e8fff3] to-[#f0fff9]",
    align: "left",
  },
  {
    icon: Wallet2,
    title: "Finance & EMI",
    subtitle: "Loan & EMI support",
    gradient: "from-[#fff2e6] to-[#fffaf0]",
    align: "right",
  },
  {
    icon: Receipt,
    title: "Orders & Payments",
    subtitle: "Order status & payment issues",
    gradient: "from-[#ede7ff] to-[#f6f2ff]",
    align: "left",
  },
  {
    icon: Headphones,
    title: "Contact Support",
    subtitle: "Talk to customer care",
    gradient: "from-[#e6f0ff] to-[#f2f6ff]",
    align: "right",
  },
];

/* =========================================================
   QUICK ACTIONS
========================================================= */

const quickActions = [
  {
    icon: Phone,
    label: "Call",
    href: PHONE_LINK,
  },
  {
    icon: Instagram,
    label: "Instagram",
    href: INSTAGRAM_LINK,
  },
  {
    icon: Mail,
    label: "Gmail",
    href: MAIL_LINK,
  },
  {
    icon: X,
    label: "X",
    href: null,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: WHATSAPP_LINK,
  },
  {
    icon: Youtube,
    label: "YouTube",
    href: YOUTUBE_LINK,
  },
  {
    icon: Send,
    label: "Telegram",
    href: null,
  },
  {
    icon: MapPin,
    label: "Location",
    href: MAP_LINK,
  },
  {
    icon: Facebook,
    label: "Facebook",
    href: null,
  },
];

/* =========================================================
   WHATSAPP GROUPS
========================================================= */

const whatsappGroups = [
  "Jobs",
  "Business",
  "Education",
  "Offers",
  "News",
  "Tech",
  "Crypto",
  "Movies",
  "Sports",
];

/* =========================================================
   HELP PAGE
========================================================= */

export default function Help() {
  const navigate = useNavigate();

  /* =======================================================
     OPEN EXTERNAL LINK
  ======================================================= */

  const openLink = (href) => {
    if (!href) return;

    window.open(
      href,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =======================================================
     REPORT PAGE
  ======================================================= */

  const openReport = () => {
    navigate("/report");
  };

  return (
    <div className="min-h-screen w-full bg-[#f3efff] text-black">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          sticky top-0 z-50
          w-full
          border-b border-black/5
          bg-[#e9e9ff]/95
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex h-[68px]
            w-full
            items-center
            px-4
            sm:px-6
            lg:px-10
            xl:px-14
          "
        >

          {/* BACK */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white
              text-black
              shadow-sm
              transition-all
              duration-200
              hover:scale-105
              hover:bg-black
              hover:text-white
              active:scale-95
            "
          >
            <ArrowLeft
              size={19}
              strokeWidth={2.2}
            />
          </button>

          {/* TITLE */}

          <div className="flex flex-1 justify-center pr-10">
            <h1
              className="
                text-[18px]
                font-semibold
                tracking-tight
                text-black/90
              "
            >
              Help & Support
            </h1>
          </div>

        </div>
      </header>

      {/* =====================================================
          PAGE BODY
      ===================================================== */}

      <main
        className="
          min-h-[calc(100vh-68px)]
          bg-gradient-to-b
          from-[#d6cef3]
          to-[#f3efff]
        "
      >

        <div
          className="
            mx-auto
            w-full
            max-w-[1200px]
            px-4
            py-6
            sm:px-6
            sm:py-8
            lg:px-8
            lg:py-10
            xl:px-10
          "
        >

          {/* =================================================
              HERO
          ================================================= */}

          <section className="mb-7">

            <h2
              className="
                text-[25px]
                font-bold
                tracking-tight
                text-black/90
                sm:text-[30px]
                lg:text-[34px]
              "
            >
              How can we help you?
            </h2>

            <p
              className="
                mt-2
                text-[14px]
                text-black/55
                sm:text-[15px]
              "
            >
              Choose a topic to get quick support
            </p>

          </section>

          {/* =================================================
              HELP TOPICS
          ================================================= */}

          <section className="flex flex-col gap-0">

            {helpTopics.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`
                    flex
                    w-full
                    ${
                      item.align === "right"
                        ? "justify-end"
                        : "justify-start"
                    }
                  `}
                >

                  <button
                    type="button"
                    className="
                      group
                      mb-[18px]
                      flex
                      w-[85%]
                      items-center
                      rounded-[22px]
                      border
                      border-white/50
                      bg-gradient-to-br
                      px-4
                      py-4
                      text-left
                      shadow-[0_12px_30px_rgba(0,0,0,0.07)]
                      backdrop-blur-xl
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:shadow-[0_16px_35px_rgba(0,0,0,0.10)]
                      active:scale-[0.99]
                      sm:w-[78%]
                      md:w-[72%]
                      lg:w-[68%]
                      xl:w-[65%]
                    "
                    style={{
                      backgroundImage:
                        `linear-gradient(135deg, ${
                          index === 0
                            ? "#FFE6F0"
                            : index === 1
                            ? "#E6F8FF"
                            : index === 2
                            ? "#E8FFF3"
                            : index === 3
                            ? "#FFF2E6"
                            : index === 4
                            ? "#EDE7FF"
                            : "#E6F0FF"
                        }, ${
                          index === 0
                            ? "#F3EFFF"
                            : index === 1
                            ? "#EFFAFF"
                            : index === 2
                            ? "#F0FFF9"
                            : index === 3
                            ? "#FFFAF0"
                            : index === 4
                            ? "#F6F2FF"
                            : "#F2F6FF"
                        })`,
                    }}
                  >

                    {/* ICON */}

                    <span
                      className="
                        flex
                        h-[46px]
                        w-[46px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-white/90
                        shadow-sm
                      "
                    >
                      <Icon
                        size={22}
                        strokeWidth={2}
                        className="text-purple-700"
                      />
                    </span>

                    {/* TEXT */}

                    <span className="ml-[14px] min-w-0 flex-1">

                      <span
                        className="
                          block
                          text-[16px]
                          font-semibold
                          leading-tight
                          text-black/90
                        "
                      >
                        {item.title}
                      </span>

                      <span
                        className="
                          mt-1
                          block
                          text-[13px]
                          leading-5
                          text-black/55
                        "
                      >
                        {item.subtitle}
                      </span>

                    </span>

                    {/* ARROW */}

                    <ArrowRight
                      size={18}
                      className="
                        shrink-0
                        text-black/45
                        transition-transform
                        duration-200
                        group-hover:translate-x-1
                      "
                    />

                  </button>

                </div>
              );
            })}

          </section>

          {/* =================================================
              REPORT PROBLEM
          ================================================= */}

          <section className="mt-2">

            <button
              type="button"
              onClick={openReport}
              className="
                group
                flex
                w-full
                items-center
                rounded-[22px]
                border
                border-white/50
                bg-gradient-to-br
                from-[#e6f0ff]
                to-[#f2f6ff]
                px-4
                py-4
                text-left
                shadow-[0_12px_30px_rgba(0,0,0,0.07)]
                backdrop-blur-xl
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-[0_16px_35px_rgba(0,0,0,0.10)]
                active:scale-[0.99]
                sm:w-[78%]
                md:w-[72%]
              "
            >

              <span
                className="
                  flex
                  h-[46px]
                  w-[46px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-white/90
                  shadow-sm
                "
              >
                <AlertTriangle
                  size={22}
                  className="text-purple-700"
                />
              </span>

              <span className="ml-[14px] min-w-0 flex-1">

                <span
                  className="
                    block
                    text-[16px]
                    font-semibold
                    text-black/90
                  "
                >
                  Report a Problem
                </span>

                <span
                  className="
                    mt-1
                    block
                    text-[13px]
                    text-black/55
                  "
                >
                  (புகார் அனுப்புங்கள்) Re2buy team
                </span>

              </span>

              <ArrowRight
                size={18}
                className="
                  shrink-0
                  text-black/45
                  transition-transform
                  duration-200
                  group-hover:translate-x-1
                "
              />

            </button>

          </section>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section className="mt-8">

            <h3
              className="
                text-[20px]
                font-semibold
                text-black/90
              "
            >
              Quick Actions
            </h3>

            <p
              className="
                mt-1
                text-[13px]
                text-black/50
              "
            >
              Contact Re2buy through your preferred platform
            </p>

            <div
              className="
                mt-4
                overflow-hidden
                rounded-[22px]
                border
                border-white/50
                bg-white/55
                p-5
                shadow-[0_15px_40px_rgba(0,0,0,0.07)]
                backdrop-blur-xl
              "
            >

              <div
                className="
                  grid
                  grid-cols-5
                  gap-x-2
                  gap-y-6
                  sm:grid-cols-5
                  md:grid-cols-9
                "
              >

                {quickActions.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => openLink(item.href)}
                      className="
                        group
                        flex
                        min-w-0
                        flex-col
                        items-center
                        justify-center
                        transition-transform
                        duration-200
                        hover:-translate-y-1
                        active:scale-95
                      "
                    >

                      <span
                        className="
                          flex
                          h-[56px]
                          w-[56px]
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          shadow-[0_8px_20px_rgba(0,0,0,0.12)]
                        "
                      >
                        <Icon
                          size={23}
                          strokeWidth={1.9}
                          className="text-black/80"
                        />
                      </span>

                      <span
                        className="
                          mt-2
                          max-w-[70px]
                          truncate
                          text-center
                          text-[12px]
                          font-medium
                          text-black/70
                        "
                      >
                        {item.label}
                      </span>

                    </button>
                  );
                })}

              </div>

            </div>

          </section>

          {/* =================================================
              WHATSAPP GROUPS
          ================================================= */}

          <section className="mt-6">

            <div
              className="
                overflow-hidden
                rounded-[22px]
                border
                border-white/50
                bg-white/55
                p-5
                shadow-[0_15px_40px_rgba(0,0,0,0.07)]
                backdrop-blur-xl
              "
            >

              <h3
                className="
                  text-[20px]
                  font-semibold
                  text-black/90
                "
              >
                WhatsApp Groups
              </h3>

              <p
                className="
                  mt-1
                  text-[13px]
                  text-black/50
                "
              >
                Join groups by category
              </p>

              <div
                className="
                  mt-5
                  grid
                  grid-cols-5
                  gap-x-2
                  gap-y-6
                  sm:grid-cols-5
                  md:grid-cols-9
                "
              >

                {whatsappGroups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() =>
                      openLink(WHATSAPP_GROUP_LINK)
                    }
                    className="
                      group
                      flex
                      min-w-0
                      flex-col
                      items-center
                      transition-transform
                      duration-200
                      hover:-translate-y-1
                      active:scale-95
                    "
                  >

                    <span
                      className="
                        flex
                        h-[56px]
                        w-[56px]
                        overflow-hidden
                        rounded-full
                        bg-white
                        shadow-[0_8px_20px_rgba(0,0,0,0.12)]
                      "
                    >
                      <img
                        src={WHATSAPP_GROUP_IMAGE}
                        alt={group}
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                        loading="lazy"
                      />
                    </span>

                    <span
                      className="
                        mt-2
                        max-w-[70px]
                        truncate
                        text-center
                        text-[12px]
                        font-medium
                        text-black/70
                      "
                    >
                      {group}
                    </span>

                  </button>
                ))}

              </div>

            </div>

          </section>

          {/* =================================================
              BOTTOM SPACE
          ================================================= */}

          <div className="h-8" />

        </div>

      </main>

    </div>
  );
}