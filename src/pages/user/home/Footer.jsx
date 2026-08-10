// src/pages/user/home/Footer.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   LOGOS
   ---------------------------------------------------------
   Change these paths if your actual logo files are
   located somewhere else.
========================================================= */

import re2buyLogo from "@/assets/logo/logo_1.webp";

/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
  const navigate = useNavigate();

  /* =======================================================
     NAVIGATION HELPER
  ======================================================= */

  const go = (path) => {
    navigate(path);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     SOCIAL LINKS
  ======================================================= */

  const openExternal = (url) => {
    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <footer className="w-full bg-white text-black">

      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div className="w-full bg-[#FAFAFA]">

        <div
          className="
            max-w-[1420px]
            mx-auto
            px-6
            md:px-10
            lg:px-12
            xl:px-0
            py-16
            lg:py-20
          "
        >

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-[1.7fr_0.8fr_0.8fr_1fr]
              gap-x-12
              gap-y-12
            "
          >

            {/* =================================================
                BRAND / CONTACT
            ================================================= */}

            <div>

              {/* LOGO */}

              <button
                type="button"
                onClick={() => go("/")}
                className="
                  block
                  p-0
                  border-0
                  bg-transparent
                  cursor-pointer
                "
              >
                <img
                  src={re2buyLogo}
                  alt="Re2Buy"
                  className="
                    h-[42px]
                    md:h-[50px]
                    w-auto
                    object-contain
                  "
                />
              </button>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-7
                  max-w-[350px]
                  text-[14px]
                  leading-6
                  text-black/65
                "
              >
                Trusted used cars, bikes, property
                and electronics marketplace built
                for modern buyers.
              </p>

              {/* PHONE */}

              <div className="mt-7">

                <button
                  type="button"
                  onClick={() => {
                    window.location.href =
                      "tel:+918270149856";
                  }}
                  className="
                    block
                    text-left
                    text-[14px]
                    text-black
                    hover:text-black/60
                    transition
                  "
                >
                  <span className="font-medium">
                    Telefon:
                  </span>{" "}
                  +91 82701 49856
                </button>

                {/* EMAIL */}

                <button
                  type="button"
                  onClick={() => {
                    window.location.href =
                      "mailto:re2buyall@gmail.com?subject=Re2Buy Support";
                  }}
                  className="
                    block
                    mt-3
                    text-left
                    text-[14px]
                    text-black
                    hover:text-black/60
                    transition
                  "
                >
                  <span className="font-medium">
                    Email:
                  </span>{" "}
                  re2buyall@gmail.com
                </button>

              </div>

              {/* ADDRESS */}

              <div className="mt-7">

                <p
                  className="
                    text-[13px]
                    leading-6
                    text-black/65
                  "
                >
                  5/77, Pallivasal Street,
                  <br />
                  Chockalingaburam,
                  <br />
                  Melur 625 103,
                  <br />
                  Madurai, Tamil Nadu
                </p>

              </div>

              {/* SOCIAL ICONS */}

              <div
                className="
                  flex
                  items-center
                  gap-4
                  mt-8
                "
              >

                {/* FACEBOOK */}

                <button
                  type="button"
                  aria-label="Facebook"
                  onClick={() =>
                    openExternal(
                      "https://www.facebook.com/"
                    )
                  }
                  className="
                    w-12
                    h-12
                    rounded-full
                    bg-white
                    border
                    border-black/5
                    flex
                    items-center
                    justify-center
                    text-[17px]
                    font-bold
                    shadow-sm
                    hover:-translate-y-1
                    hover:shadow-md
                    transition-all
                  "
                >
                  f
                </button>

                {/* INSTAGRAM */}

                <button
                  type="button"
                  aria-label="Instagram"
                  onClick={() =>
                    openExternal(
                      "https://www.instagram.com/"
                    )
                  }
                  className="
                    w-12
                    h-12
                    rounded-full
                    bg-white
                    border
                    border-black/5
                    flex
                    items-center
                    justify-center
                    text-[17px]
                    font-bold
                    shadow-sm
                    hover:-translate-y-1
                    hover:shadow-md
                    transition-all
                  "
                >
                  ◎
                </button>

                {/* YOUTUBE */}

                <button
                  type="button"
                  aria-label="YouTube"
                  onClick={() =>
                    openExternal(
                      "https://www.youtube.com/"
                    )
                  }
                  className="
                    w-12
                    h-12
                    rounded-full
                    bg-white
                    border
                    border-black/5
                    flex
                    items-center
                    justify-center
                    text-[15px]
                    font-bold
                    shadow-sm
                    hover:-translate-y-1
                    hover:shadow-md
                    transition-all
                  "
                >
                  ▶
                </button>

                {/* LINKEDIN */}

                <button
                  type="button"
                  aria-label="LinkedIn"
                  onClick={() =>
                    openExternal(
                      "https://www.linkedin.com/"
                    )
                  }
                  className="
                    w-12
                    h-12
                    rounded-full
                    bg-white
                    border
                    border-black/5
                    flex
                    items-center
                    justify-center
                    text-[15px]
                    font-bold
                    shadow-sm
                    hover:-translate-y-1
                    hover:shadow-md
                    transition-all
                  "
                >
                  in
                </button>

              </div>

            </div>

            {/* =================================================
                COMPANY
            ================================================= */}

            <FooterColumn
              title="Company"
              items={[
                {
                  label: "About Us",
                  onClick: () =>
                    go("/about"),
                },
                {
                  label: "Contact",
                  onClick: () =>
                    go("/contact"),
                },
                {
                  label: "Careers",
                  onClick: () =>
                    go("/careers"),
                },
                {
                  label: "Partners",
                  onClick: () =>
                    go("/partners"),
                },
                {
                  label: "News",
                  onClick: () =>
                    go("/news"),
                },
                {
                  label: "Events",
                  onClick: () =>
                    go("/events"),
                },
              ]}
            />

            {/* =================================================
                SERVICES
            ================================================= */}

            <FooterColumn
              title="Services"
              items={[
                {
                  label: "Buy Car",
                  onClick: () =>
                    go("/?tab=0"),
                },
                {
                  label: "Sell Car",
                  onClick: () =>
                    go("/post/car"),
                },
                {
                  label: "Buy Bike",
                  onClick: () =>
                    go("/?tab=1"),
                },
                {
                  label: "Sell Bike",
                  onClick: () =>
                    go("/post/bike"),
                },
                {
                  label: "Property",
                  onClick: () =>
                    go("/?tab=2"),
                },
                {
                  label: "Electronics",
                  onClick: () =>
                    go("/?tab=3"),
                },
              ]}
            />

            {/* =================================================
                SUPPORT / LEGAL
            ================================================= */}

            <div className="grid grid-cols-1 gap-10">

              <FooterColumn
                title="Support"
                items={[
                  {
                    label: "Help",
                    onClick: () =>
                      go("/help"),
                  },
                  {
                    label: "Finance",
                    onClick: () =>
                      go("/finance"),
                  },
                  {
                    label: "My Orders",
                    onClick: () =>
                      go("/orders"),
                  },
                  {
                    label: "Cashback",
                    onClick: () =>
                      go("/cashback"),
                  },
                ]}
              />

              <FooterColumn
                title="Legal"
                items={[
                  {
                    label: "Privacy Policy",
                    onClick: () =>
                      go("/privacy"),
                  },
                  {
                    label: "Terms & Conditions",
                    onClick: () =>
                      go("/terms"),
                  },
                  {
                    label: "Refund Policy",
                    onClick: () =>
                      go("/refund"),
                  },
                ]}
              />

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          GROUP / COMPANY LOGOS
      ===================================================== */}

      <GroupLogos />

      {/* =====================================================
          COPYRIGHT
      ===================================================== */}

      <div
        className="
          border-t
          border-black/5
          bg-white
        "
      >

        <div
          className="
            max-w-[1420px]
            mx-auto
            px-6
            md:px-10
            lg:px-12
            xl:px-0
            py-5
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-3
          "
        >

          <p
            className="
              text-[12px]
              text-black/45
              text-center
              md:text-left
            "
          >
            © {new Date().getFullYear()} Re2Buy.
            All rights reserved.
          </p>

          <div
            className="
              flex
              items-center
              gap-2
              text-[12px]
              text-black/50
            "
          >
            <span
              className="
                w-5
                h-5
                rounded-full
                bg-[#E8F7E8]
                text-[#258A35]
                flex
                items-center
                justify-center
                text-[10px]
              "
            >
              ✓
            </span>

            India Verified Marketplace
          </div>

        </div>

      </div>

    </footer>
  );
}

/* =========================================================
   FOOTER COLUMN
========================================================= */

function FooterColumn({
  title,
  items = [],
}) {
  return (
    <div>

      <h3
        className="
          text-[14px]
          font-semibold
          text-black
          mb-6
        "
      >
        {title}
      </h3>

      <div
        className="
          flex
          flex-col
          items-start
          gap-4
        "
      >

        {items.map(
          (item, index) => (
            <button
              key={`${item.label}-${index}`}
              type="button"
              onClick={item.onClick}
              className="
                text-[14px]
                leading-5
                text-black/70
                text-left
                hover:text-black
                hover:translate-x-0.5
                transition-all
                cursor-pointer
              "
            >
              {item.label}
            </button>
          )
        )}

      </div>

    </div>
  );
}

/* =========================================================
   GROUP LOGOS
========================================================= */

function GroupLogos() {
  const logos = [
    {
      name: "Re2Buy Group",
      src: "https://res.cloudinary.com/dtqxc3rmt/image/upload/v1767278603/logo1_jisgdr.jpg",
    },
    {
      name: "Re2Buy Leasing",
      src: "https://res.cloudinary.com/dtqxc3rmt/image/upload/v1767278603/logo2_cranby.jpg",
    },
    {
      name: "Re2Buy Collection",
      src: "https://res.cloudinary.com/dtqxc3rmt/image/upload/v1767278603/logo3_spwour.jpg",
    },
    {
      name: "Re2Buy Investment",
      src: "https://res.cloudinary.com/dtqxc3rmt/image/upload/v1767278603/logo4_vj6lzx.jpg",
    },
  ];

  return (
    <div
      className="
        w-full
        bg-white
        border-t
        border-black/5
      "
    >

      <div
        className="
          max-w-[1420px]
          mx-auto
          px-6
          md:px-10
          lg:px-12
          xl:px-0
          py-10
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            gap-8
          "
        >

          {/* GROUP TEXT */}

          <div
            className="
              shrink-0
              lg:w-[240px]
            "
          >

            <p
              className="
                text-[14px]
                leading-5
                text-black/50
                font-medium
              "
            >
              A part of
              <br />
              <span className="font-bold text-black/60">
                Re2Buy Group
              </span>
            </p>

          </div>

          {/* LOGOS */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-8
              gap-y-7
              flex-1
            "
          >

            {logos.map(
              (logo) => (
                <div
                  key={logo.name}
                  className="
                    h-[48px]
                    min-w-[125px]
                    flex
                    items-center
                    justify-center
                  "
                >

                  <img
                    src={logo.src}
                    alt={logo.name}
                    loading="lazy"
                    className="
                      max-h-[48px]
                      max-w-[145px]
                      w-auto
                      h-auto
                      object-contain
                      opacity-90
                      hover:opacity-100
                      transition
                    "
                  />

                </div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}