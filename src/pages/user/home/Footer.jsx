
// src/pages/user/home/Footer.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   LOGO
========================================================= */

import re2buyLogo from "@/assets/logo/logo_1.webp";

/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
  const navigate = useNavigate();

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const go = (path) => {
    navigate(path);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     EXTERNAL LINKS
  ======================================================= */

  const openExternal = (url) => {
    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =======================================================
     CALL
  ======================================================= */

  const callPhone = () => {
    window.location.href =
      "tel:+918270149856";
  };

  /* =======================================================
     EMAIL
  ======================================================= */

  const sendMail = () => {
    window.location.href =
      "mailto:re2buyall@gmail.com?subject=Re2Buy Support";
  };

  /* =======================================================
     CATCHTRA
  ======================================================= */

  const openCatchtra = () => {
    navigate("/catchtra");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <footer className="re2buy-footer">

        {/* ===================================================
            DESKTOP / MAIN FOOTER
        =================================================== */}

        <div className="re2buy-footer-main">

          <div className="re2buy-footer-container">

            {/* =================================================
                BRAND / CONTACT
            ================================================= */}

            <div className="re2buy-footer-brand">

              {/* LOGO */}

              <button
                type="button"
                onClick={() => go("/")}
                className="re2buy-footer-logo-button"
              >
                <img
                  src={re2buyLogo}
                  alt="Re2Buy"
                  className="re2buy-footer-logo"
                />
              </button>

              {/* DESCRIPTION */}

              <p className="re2buy-footer-description">
                Trusted used cars, bikes, property
                and electronics marketplace built
                for modern buyers.
              </p>

              {/* PHONE */}

              <button
                type="button"
                onClick={callPhone}
                className="re2buy-footer-contact"
              >
                <span className="re2buy-footer-contact-label">
                  Telefon:
                </span>{" "}
                +91 82701 49856
              </button>

              {/* EMAIL */}

              <button
                type="button"
                onClick={sendMail}
                className="re2buy-footer-contact re2buy-footer-email"
              >
                <span className="re2buy-footer-contact-label">
                  Email:
                </span>{" "}
                re2buyall@gmail.com
              </button>

              {/* =================================================
                  ADDRESS
              ================================================= */}

              <div className="re2buy-footer-address">

                <div className="re2buy-address-column">
                  <span className="re2buy-address-pin">
                    📍
                  </span>

                  <p>
                    5/77, Pallivasal Street,
                    <br />
                    Chockalingaburam,
                    <br />
                    Melur 625 103,
                    <br />
                    Madurai, Tamil Nadu
                  </p>
                </div>

                <div className="re2buy-address-divider" />

                <div className="re2buy-address-column">
                  <span className="re2buy-address-pin">
                    📍
                  </span>

                  <p>
                    5/77, பள்ளிவாசல் தெரு,
                    <br />
                    சொக்கலிங்கபுரம்,
                    <br />
                    மதுரை - 625 103
                    <br />
                    தமிழ்நாடு
                  </p>
                </div>

              </div>

              {/* =================================================
                  SOCIAL
              ================================================= */}

              <div className="re2buy-footer-social">

                <button
                  type="button"
                  aria-label="Facebook"
                  onClick={() =>
                    openExternal(
                      "https://www.facebook.com/"
                    )
                  }
                  className="re2buy-social-button"
                >
                  f
                </button>

                <button
                  type="button"
                  aria-label="Instagram"
                  onClick={() =>
                    openExternal(
                      "https://www.instagram.com/"
                    )
                  }
                  className="re2buy-social-button"
                >
                  ◎
                </button>

                <button
                  type="button"
                  aria-label="YouTube"
                  onClick={() =>
                    openExternal(
                      "https://www.youtube.com/"
                    )
                  }
                  className="re2buy-social-button"
                >
                  ▶
                </button>

                <button
                  type="button"
                  aria-label="LinkedIn"
                  onClick={() =>
                    openExternal(
                      "https://www.linkedin.com/"
                    )
                  }
                  className="re2buy-social-button"
                >
                  in
                </button>

              </div>

            </div>

            {/* =================================================
                DESKTOP COMPANY
            ================================================= */}

            <FooterColumn
              title="Company"
              items={[
                {
                  label: "About Us",
                  onClick: () => go("/about"),
                },
                {
                  label: "Contact",
                  onClick: () => go("/contact"),
                },
                {
                  label: "Careers",
                  onClick: () => go("/careers"),
                },
                {
                  label: "Partners",
                  onClick: () => go("/partners"),
                },
                {
                  label: "News",
                  onClick: () => go("/news"),
                },
                {
                  label: "Events",
                  onClick: () => go("/events"),
                },
              ]}
            />

            {/* =================================================
                DESKTOP SERVICES
            ================================================= */}

            <FooterColumn
              title="Services"
              items={[
                {
                  label: "Buy Car",
                  onClick: () => go("/?tab=0"),
                },
                {
                  label: "Sell Car",
                  onClick: () => go("/post/car"),
                },
                {
                  label: "Buy Bike",
                  onClick: () => go("/?tab=1"),
                },
                {
                  label: "Sell Bike",
                  onClick: () => go("/post/bike"),
                },
                {
                  label: "Property",
                  onClick: () => go("/?tab=2"),
                },
                {
                  label: "Electronics",
                  onClick: () => go("/?tab=3"),
                },
              ]}
            />

            {/* =================================================
                DESKTOP SUPPORT / LEGAL
            ================================================= */}

            <div className="re2buy-footer-support">

              <FooterColumn
                title="Support"
                items={[
                  {
                    label: "Help",
                    onClick: () => go("/help"),
                  },
                  {
                    label: "Finance",
                    onClick: () => go("/finance"),
                  },
                  {
                    label: "My Orders",
                    onClick: () => go("/orders"),
                  },
                  {
                    label: "Cashback",
                    onClick: () => go("/cashback"),
                  },
                ]}
              />

              <FooterColumn
                title="Legal"
                items={[
                  {
                    label: "Privacy Policy",
                    onClick: () => go("/privacy"),
                  },
                  {
                    label: "Terms & Conditions",
                    onClick: () => go("/terms"),
                  },
                  {
                    label: "Refund Policy",
                    onClick: () => go("/refund"),
                  },
                ]}
              />

            </div>

          </div>

          {/* =================================================
              MOBILE FOOTER CONTENT
              
              This section follows the Flutter design.
          ================================================= */}

          <div className="re2buy-mobile-footer">

            {/* =================================================
                MOBILE BRAND
            ================================================= */}

            <div className="re2buy-mobile-brand">

              <button
                type="button"
                onClick={() => go("/")}
                className="re2buy-mobile-logo-button"
              >
                <img
                  src={re2buyLogo}
                  alt="Re2Buy"
                  className="re2buy-mobile-logo"
                />
              </button>

              <p className="re2buy-mobile-description">
                Trusted used cars & bikes marketplace
                <br />
                built for modern buyers.
              </p>

              {/* =================================================
                  ADDRESS CARD
              ================================================= */}

              <div className="re2buy-mobile-address-card">

                <div className="re2buy-mobile-address-column">
                  <p>
                    📍 5/77, Pallivasal Street,
                    <br />
                    Chockalingaburam,
                    <br />
                    Melur 625 103,
                    <br />
                    Madurai Tamil Nadu
                  </p>
                </div>

                <div className="re2buy-mobile-address-divider" />

                <div className="re2buy-mobile-address-column">
                  <p>
                    📍 5/77, பள்ளிவாசல் தெரு,
                    <br />
                    சொக்கலிங்கபுரம்,
                    <br />
                    மதுரை - 625 103
                    <br />
                    தமிழ்நாடு
                  </p>
                </div>

              </div>

              {/* =================================================
                  MOBILE CONTACT
              ================================================= */}

              <div className="re2buy-mobile-contact">

                <button
                  type="button"
                  onClick={callPhone}
                  className="re2buy-mobile-contact-item"
                >
                  <span className="re2buy-mobile-contact-icon">
                    ☎
                  </span>

                  <span>
                    +91 82701 49856
                  </span>
                </button>

                <button
                  type="button"
                  onClick={sendMail}
                  className="re2buy-mobile-contact-item"
                >
                  <span className="re2buy-mobile-contact-icon">
                    ✉
                  </span>

                  <span>
                    re2buyall@gmail.com
                  </span>
                </button>

              </div>

            </div>

            {/* =================================================
                MOBILE CATEGORY CARDS
            ================================================= */}

            <div className="re2buy-mobile-category-grid">

              <ModernCard
                title="Account"
                accent="#3B82F6"
                items={[
                  {
                    label: "My Profile",
                    onClick: () =>
                      go("/profile"),
                  },
                  {
                    label: "My Orders",
                    onClick: () =>
                      go("/orders"),
                  },
                  {
                    label: "Finance",
                    onClick: () =>
                      go("/finance"),
                  },
                ]}
              />

              <ModernCard
                title="Services"
                accent="#EF4444"
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
                    label: "Filter Cars",
                    onClick: () =>
                      go("/filter"),
                  },
                ]}
              />

              <ModernCard
                title="Support"
                accent="#0EA5E9"
                items={[
                  {
                    label: "Cashback",
                    onClick: () =>
                      go("/cashback"),
                  },
                  {
                    label: "Partners",
                    onClick: () =>
                      go("/partners"),
                  },
                  {
                    label: "Help",
                    onClick: () =>
                      go("/help"),
                  },
                ]}
              />

              <ModernCard
                title="Legal"
                accent="#FACC15"
                items={[
                  {
                    label: "Privacy",
                    onClick: () =>
                      go("/privacy"),
                  },
                  {
                    label: "Terms",
                    onClick: () =>
                      go("/terms"),
                  },
                  {
                    label: "Refund",
                    onClick: () =>
                      go("/refund"),
                  },
                ]}
              />

            </div>

            {/* =================================================
                MOBILE COPYRIGHT
            ================================================= */}

            <div className="re2buy-mobile-copyright">

              <div className="re2buy-mobile-divider" />

              <p className="re2buy-copyright-text">
                © 2026 Re2Buy. All rights reserved.
              </p>

              <div className="re2buy-verified-row">

                <span className="re2buy-verified-icon">
                  ✓
                </span>

                <span>
                  India Verified Marketplace
                </span>

              </div>

              {/* =================================================
                  GROUP LOGOS
              ================================================= */}

              <div className="re2buy-group-section">

                <p className="re2buy-group-title">
                  End, all are
                  <br />
                  Group of Re2buy
                </p>

                <div className="re2buy-group-logo-grid">

                  <GroupLogo
                    name="Re2Buy Group"
                    src="https://res.cloudinary.com/dtqxc3rmt/image/upload/v1767278603/logo1_jisgdr.jpg"
                  />

                  <GroupLogo
                    name="Re2Buy Leasing"
                    src="https://res.cloudinary.com/dtqxc3rmt/image/upload/v1767278603/logo2_cranby.jpg"
                  />

                  <GroupLogo
                    name="Re2Buy Collection"
                    src="https://res.cloudinary.com/dtqxc3rmt/image/upload/v1767278603/logo3_spwour.jpg"
                  />

                  <GroupLogo
                    name="Re2Buy Investment"
                    src="https://res.cloudinary.com/dtqxc3rmt/image/upload/v1767278603/logo4_vj6lzx.jpg"
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                CATCHTRA
            ================================================= */}

            <div className="re2buy-catchtra-wrapper">

              <button
                type="button"
                onClick={openCatchtra}
                className="re2buy-catchtra-button"
              >
                Developed by catchtra
              </button>

            </div>

          </div>

        </div>

      </footer>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* ===================================================
           ROOT
        =================================================== */

        .re2buy-footer {
          width: 100%;
          background: #fff;
          color: #111;
        }

        /* ===================================================
           MAIN
        =================================================== */

        .re2buy-footer-main {
          width: 100%;
          background: #FAFAFA;
        }

        .re2buy-footer-container {
          width: min(
            1420px,
            calc(100% - 40px)
          );

          margin: 0 auto;

          padding:
            64px 0 72px;

          display: grid;

          grid-template-columns:
            1.7fr
            0.8fr
            0.8fr
            1fr;

          column-gap: 48px;

          row-gap: 48px;
        }

        /* ===================================================
           BRAND
        =================================================== */

        .re2buy-footer-brand {
          min-width: 0;
        }

        .re2buy-footer-logo-button {
          display: block;

          padding: 0;

          border: 0;

          background: transparent;

          cursor: pointer;
        }

        .re2buy-footer-logo {
          height: 50px;

          width: auto;

          display: block;

          object-fit: contain;
        }

        .re2buy-footer-description {
          margin:
            28px 0 0;

          max-width: 350px;

          font-size: 14px;

          line-height: 1.7;

          color:
            rgba(0, 0, 0, 0.65);
        }

        /* ===================================================
           CONTACT
        =================================================== */

        .re2buy-footer-contact {
          display: block;

          margin-top: 26px;

          padding: 0;

          border: 0;

          background: transparent;

          font-size: 14px;

          line-height: 1.5;

          color: #111;

          cursor: pointer;

          text-align: left;

          transition:
            opacity 0.2s ease;
        }

        .re2buy-footer-email {
          margin-top: 10px;
        }

        .re2buy-footer-contact:hover {
          opacity: 0.55;
        }

        .re2buy-footer-contact-label {
          font-weight: 600;
        }

        /* ===================================================
           ADDRESS
        =================================================== */

        .re2buy-footer-address {
          display: flex;

          align-items: stretch;

          margin-top: 26px;

          max-width: 540px;

          padding: 16px;

          background: #fff;

          border-radius: 20px;

          gap: 14px;
        }

        .re2buy-address-column {
          flex: 1;

          min-width: 0;
        }

        .re2buy-address-column p {
          margin: 0;

          font-size: 10px;

          line-height: 1.5;

          color: rgba(0, 0, 0, 0.68);
        }

        .re2buy-address-pin {
          display: inline-block;

          margin-bottom: 3px;

          font-size: 11px;
        }

        .re2buy-address-divider {
          width: 1px;

          background:
            rgba(0, 0, 0, 0.16);
        }

        /* ===================================================
           SOCIAL
        =================================================== */

        .re2buy-footer-social {
          display: flex;

          align-items: center;

          gap: 12px;

          margin-top: 28px;
        }

        .re2buy-social-button {
          width: 42px;

          height: 42px;

          border-radius: 50%;

          border:
            1px solid
            rgba(0, 0, 0, 0.05);

          background: #fff;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 15px;

          font-weight: 700;

          cursor: pointer;

          box-shadow:
            0 3px 10px
            rgba(0, 0, 0, 0.05);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .re2buy-social-button:hover {
          transform:
            translateY(-3px);

          box-shadow:
            0 8px 18px
            rgba(0, 0, 0, 0.10);
        }

        /* ===================================================
           FOOTER COLUMNS
        =================================================== */

        .re2buy-footer-column-title {
          margin: 0 0 22px;

          font-size: 14px;

          font-weight: 600;

          color: #111;
        }

        .re2buy-footer-column-items {
          display: flex;

          flex-direction: column;

          align-items: flex-start;

          gap: 14px;
        }

        .re2buy-footer-column-item {
          padding: 0;

          border: 0;

          background: transparent;

          font-size: 14px;

          line-height: 1.4;

          color:
            rgba(0, 0, 0, 0.68);

          text-align: left;

          cursor: pointer;

          transition:
            transform 0.2s ease,
            color 0.2s ease;
        }

        .re2buy-footer-column-item:hover {
          color: #111;

          transform:
            translateX(2px);
        }

        .re2buy-footer-support {
          display: grid;

          grid-template-columns: 1fr;

          gap: 42px;
        }

        /* ===================================================
           MOBILE FLUTTER STYLE
           
           Hidden on desktop.
        =================================================== */

        .re2buy-mobile-footer {
          display: none;
        }

        /* ===================================================
           MOBILE
        =================================================== */

        @media (max-width: 767px) {

          /* -----------------------------------------------
             Hide desktop footer
          ----------------------------------------------- */

          .re2buy-footer-container {
            display: none;
          }

          /* -----------------------------------------------
             Mobile wrapper
          ----------------------------------------------- */

          .re2buy-mobile-footer {
            display: block;

            width: 100%;

            padding:
              34px 22px 26px;

            background:
              linear-gradient(
                to bottom,
                #FFFDF5 0%,
                #FFF6D9 100%
              );

            border-radius:
              32px 32px 0 0;

            overflow: hidden;
          }

          /* -----------------------------------------------
             MOBILE LOGO
          ----------------------------------------------- */

          .re2buy-mobile-logo-button {
            display: block;

            padding: 0;

            border: 0;

            background: transparent;

            cursor: pointer;
          }

          .re2buy-mobile-logo {
            height: 30px;

            width: auto;

            display: block;

            object-fit: contain;
          }

          /* -----------------------------------------------
             DESCRIPTION
          ----------------------------------------------- */

          .re2buy-mobile-description {
            margin:
              12px 0 0;

            font-size: 13px;

            line-height: 1.5;

            color:
              rgba(0, 0, 0, 0.54);
          }

          /* -----------------------------------------------
             ADDRESS CARD
          ----------------------------------------------- */

          .re2buy-mobile-address-card {
            width: 100%;

            margin-top: 18px;

            padding: 16px;

            display: flex;

            align-items: stretch;

            gap: 14px;

            background: #fff;

            border-radius: 20px;

            box-shadow:
              0 3px 15px
              rgba(0, 0, 0, 0.035);
          }

          .re2buy-mobile-address-column {
            flex: 1;

            min-width: 0;
          }

          .re2buy-mobile-address-column p {
            margin: 0;

            font-size: 10px;

            line-height: 1.4;

            color: #222;
          }

          .re2buy-mobile-address-divider {
            width: 1px;

            flex: 0 0 1px;

            background:
              rgba(0, 0, 0, 0.18);
          }

          /* -----------------------------------------------
             MOBILE CONTACT
          ----------------------------------------------- */

          .re2buy-mobile-contact {
            width: 100%;

            margin-top: 20px;

            display: flex;

            align-items: center;

            justify-content: center;

            flex-wrap: wrap;

            column-gap: 26px;

            row-gap: 12px;
          }

          .re2buy-mobile-contact-item {
            display: inline-flex;

            align-items: center;

            justify-content: center;

            gap: 6px;

            padding: 0;

            border: 0;

            background: transparent;

            color: #111;

            font-size: 12px;

            line-height: 1.4;

            cursor: pointer;
          }

          .re2buy-mobile-contact-icon {
            font-size: 15px;

            line-height: 1;
          }

          /* -----------------------------------------------
             CATEGORY GRID
          ----------------------------------------------- */

          .re2buy-mobile-category-grid {
            width: 100%;

            margin-top: 40px;

            display: grid;

            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 18px;
          }

          /* -----------------------------------------------
             MODERN CARD
          ----------------------------------------------- */

          .re2buy-modern-card {
            width: 100%;

            min-width: 0;

            min-height: 188px;

            padding: 16px;

            border-radius: 22px;

            background:
              rgba(255, 255, 255, 0.85);

            border:
              1px solid
              rgba(0, 0, 0, 0.025);

            box-shadow:
              0 10px 25px
              rgba(0, 0, 0, 0.08);

            backdrop-filter:
              blur(12px);

            -webkit-backdrop-filter:
              blur(12px);
          }

          /* -----------------------------------------------
             CARD TITLE
          ----------------------------------------------- */

          .re2buy-modern-card-title {
            display: flex;

            align-items: center;

            gap: 8px;

            margin-bottom: 12px;
          }

          .re2buy-modern-card-accent {
            width: 6px;

            height: 22px;

            flex: 0 0 6px;

            border-radius: 4px;
          }

          .re2buy-modern-card-title-text {
            font-size: 15px;

            line-height: 1.3;

            font-weight: 600;

            color: #111;
          }

          /* -----------------------------------------------
             CARD ITEMS
          ----------------------------------------------- */

          .re2buy-modern-card-items {
            display: flex;

            flex-direction: column;

            align-items: flex-start;

            gap: 8px;
          }

          .re2buy-modern-card-item {
            width: 100%;

            min-height: 22px;

            padding: 0;

            border: 0;

            background: transparent;

            color:
              rgba(0, 0, 0, 0.80);

            font-size: 13px;

            line-height: 1.4;

            text-align: left;

            cursor: pointer;

            border-radius: 6px;

            transition:
              color 0.2s ease,
              transform 0.2s ease;
          }

          .re2buy-modern-card-item:hover {
            color: #111;

            transform:
              translateX(2px);
          }

          /* -----------------------------------------------
             LAST ITEM EXTRA SPACE
          ----------------------------------------------- */

          .re2buy-modern-card-item:last-child {
            margin-bottom: 16px;
          }

          /* -----------------------------------------------
             COPYRIGHT
          ----------------------------------------------- */

          .re2buy-mobile-copyright {
            width: 100%;

            margin-top: 18px;

            padding:
              0 0 0;
          }

          .re2buy-mobile-divider {
            width: 100%;

            height: 1px;

            margin-bottom: 6px;

            background:
              rgba(0, 0, 0, 0.12);
          }

          .re2buy-copyright-text {
            margin: 0;

            font-size: 13px;

            line-height: 1.5;

            color:
              rgba(0, 0, 0, 0.54);
          }

          /* -----------------------------------------------
             VERIFIED
          ----------------------------------------------- */

          .re2buy-verified-row {
            display: flex;

            align-items: center;

            gap: 6px;

            margin-top: 6px;

            font-size: 12.5px;

            line-height: 1.4;

            font-weight: 500;

            color: #111;
          }

          .re2buy-verified-icon {
            width: 20px;

            height: 20px;

            flex: 0 0 20px;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 50%;

            background:
              #E8F7E8;

            color:
              #258A35;

            font-size: 11px;

            font-weight: 700;
          }

          /* -----------------------------------------------
             GROUP SECTION
          ----------------------------------------------- */

          .re2buy-group-section {
            width: 100%;

            margin-top: 20px;
          }

          .re2buy-group-title {
            margin: 0;

            font-size: 14px;

            line-height: 1.3;

            color:
              rgba(0, 0, 0, 0.54);

            font-weight: 500;
          }

          /* -----------------------------------------------
             GROUP LOGOS 2 x 2
          ----------------------------------------------- */

          .re2buy-group-logo-grid {
            width: 100%;

            margin-top: 10px;

            display: grid;

            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            column-gap: 8px;

            row-gap: 10px;
          }

          .re2buy-group-logo {
            width: 100%;

            height: 52px;

            min-width: 0;

            display: flex;

            align-items: center;

            justify-content: center;

            overflow: hidden;

            border-radius: 8px;

            background:
              rgba(255, 255, 255, 0.35);
          }

          .re2buy-group-logo img {
            width: auto;

            max-width: 100%;

            height: auto;

            max-height: 48px;

            object-fit: contain;

            display: block;
          }

          /* -----------------------------------------------
             CATCHTRA
          ----------------------------------------------- */

          .re2buy-catchtra-wrapper {
            width: 100%;

            margin-top: 18px;

            display: flex;

            justify-content: center;
          }

          .re2buy-catchtra-button {
            padding:
              6px 12px;

            border: 0;

            border-radius: 20px;

            background: #000;

            color: #fff;

            font-size: 10px;

            line-height: 1.4;

            font-weight: 500;

            cursor: pointer;

            transition:
              transform 0.2s ease,
              opacity 0.2s ease;
          }

          .re2buy-catchtra-button:hover {
            transform:
              translateY(-2px);

            opacity: 0.82;
          }
        }

        /* ===================================================
           SMALL MOBILE
        =================================================== */

        @media (max-width: 480px) {

          .re2buy-mobile-footer {
            padding:
              30px 16px 24px;

            border-radius:
              28px 28px 0 0;
          }

          .re2buy-mobile-category-grid {
            gap: 14px;
          }

          .re2buy-modern-card {
            min-height: 180px;

            padding: 14px;

            border-radius: 19px;
          }

          .re2buy-modern-card-title-text {
            font-size: 14px;
          }

          .re2buy-modern-card-item {
            font-size: 12px;
          }

          .re2buy-mobile-address-card {
            padding: 13px;

            gap: 10px;
          }

          .re2buy-mobile-address-column p {
            font-size: 9px;

            line-height: 1.4;
          }

          .re2buy-mobile-contact {
            column-gap: 14px;
          }

          .re2buy-mobile-contact-item {
            font-size: 11px;
          }

          .re2buy-group-logo {
            height: 48px;
          }
        }

        /* ===================================================
           VERY SMALL MOBILE
        =================================================== */

        @media (max-width: 360px) {

          .re2buy-mobile-footer {
            padding:
              28px 14px 22px;
          }

          .re2buy-mobile-category-grid {
            gap: 11px;
          }

          .re2buy-modern-card {
            min-height: 174px;

            padding: 12px;

            border-radius: 17px;
          }

          .re2buy-modern-card-title {
            gap: 6px;
          }

          .re2buy-modern-card-accent {
            width: 5px;

            flex-basis: 5px;

            height: 20px;
          }

          .re2buy-modern-card-title-text {
            font-size: 13px;
          }

          .re2buy-modern-card-item {
            font-size: 11px;
          }

          .re2buy-mobile-address-column p {
            font-size: 8.5px;
          }

          .re2buy-mobile-contact-item {
            font-size: 10px;
          }
        }

      `}</style>
    </>
  );
}

/* =========================================================
   DESKTOP FOOTER COLUMN
========================================================= */

function FooterColumn({
  title,
  items = [],
}) {
  return (
    <div className="re2buy-footer-column">

      <h3 className="re2buy-footer-column-title">
        {title}
      </h3>

      <div className="re2buy-footer-column-items">

        {items.map(
          (item, index) => (
            <button
              key={`${item.label}-${index}`}
              type="button"
              onClick={item.onClick}
              className="
                re2buy-footer-column-item
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
   MOBILE MODERN CARD
========================================================= */

function ModernCard({
  title,
  accent,
  items = [],
}) {
  return (
    <div className="re2buy-modern-card">

      {/* TITLE */}

      <div className="re2buy-modern-card-title">

        <span
          className="re2buy-modern-card-accent"
          style={{
            backgroundColor: accent,
          }}
        />

        <span className="re2buy-modern-card-title-text">
          {title}
        </span>

      </div>

      {/* ITEMS */}

      <div className="re2buy-modern-card-items">

        {items.map(
          (item, index) => (
            <button
              key={`${item.label}-${index}`}
              type="button"
              onClick={item.onClick}
              className="
                re2buy-modern-card-item
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
   GROUP LOGO
========================================================= */

function GroupLogo({
  name,
  src,
}) {
  return (
    <div className="re2buy-group-logo">

      <img
        src={src}
        alt={name}
        loading="lazy"
      />

    </div>
  );
}
