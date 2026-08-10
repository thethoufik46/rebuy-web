
// src/pages/user/Location.jsx

import React from "react";

export default function Location() {
  return (
    <section className="location-section">
      <div className="location-wrapper">

        {/* =================================================
            HEADING
        ================================================= */}

        <div className="location-heading">
          <h2>
            FIND YOUR <span>SHOWROOM</span>
          </h2>

          <p>
            Visit Re2buy and experience our collection in person.
          </p>
        </div>

        {/* =================================================
            LOCATION CARD
        ================================================= */}

        <div className="location-list">
          <a
            href="https://maps.app.goo.gl/kuCvcFBcWNHrYWvx5"
            target="_blank"
            rel="noopener noreferrer"
            className="location-card"
          >
            <span className="location-icon">
              <span className="location-pin-dot"></span>
              <span className="location-pin-line"></span>
            </span>

            <span className="location-content">
              <span className="location-name">
                Re2buy
              </span>

              <span className="location-subtitle">
                Visit our showroom
              </span>
            </span>

            <span className="location-arrow">
              ↗
            </span>
          </a>
        </div>

        {/* =================================================
            GOOGLE MAP
        ================================================= */}

        <div className="location-map-wrapper">

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.835229982223!2d78.3966224!3d10.194032799999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0091ef52419f6d%3A0x357642441621f9ce!2sRe2buy!5e0!3m2!1sen!2sin!4v1786343920514!5m2!1sen!2sin"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Re2buy Location"
          />

          {/* =================================================
              OPEN GOOGLE MAPS
          ================================================= */}

          <a
            href="https://maps.app.goo.gl/kuCvcFBcWNHrYWvx5"
            target="_blank"
            rel="noopener noreferrer"
            className="open-map-button"
          >
            <span>
              OPEN IN GOOGLE MAPS
            </span>

            <span className="open-map-arrow">
              ↗
            </span>
          </a>

        </div>

      </div>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* ===================================================
           LAVENDER COLOR SYSTEM
        =================================================== */

        .location-section {
          --lavender-main: #9B7EDE;
          --lavender-dark: #7256B8;
          --lavender-light: #EDE6FF;
          --lavender-soft: #F5F1FF;
          --lavender-pale: #FAF8FF;
          --lavender-border: #DDD2F7;
          --lavender-hover: #DCCEFF;

          width: 100%;

          position: relative;

          background:
            linear-gradient(
              to bottom,
              #EDE6FF 0%,
              #EDE6FF 79%,
              #FFFFFF 79%,
              #FFFFFF 100%
            );

          padding:
            0 0 70px 0;

          overflow: hidden;
        }

        /* ===================================================
           SUBTLE LAVENDER GLOW
        =================================================== */

        .location-section::before {
          content: "";

          position: absolute;

          width: 420px;
          height: 420px;

          top: -220px;
          left: -180px;

          border-radius: 50%;

          background:
            rgba(155, 126, 222, 0.12);

          filter: blur(70px);

          pointer-events: none;
        }

        .location-section::after {
          content: "";

          position: absolute;

          width: 360px;
          height: 360px;

          right: -180px;
          bottom: 80px;

          border-radius: 50%;

          background:
            rgba(155, 126, 222, 0.10);

          filter: blur(70px);

          pointer-events: none;
        }

        /* ===================================================
           WRAPPER
        =================================================== */

        .location-wrapper {
          width:
            min(
              1415px,
              calc(100% - 40px)
            );

          margin: 0 auto;

          position: relative;

          z-index: 2;
        }

        /* ===================================================
           HEADING
        =================================================== */

        .location-heading {
          text-align: center;

          padding-top: 0;

          margin-bottom: 38px;
        }

        /* ===================================================
           HEADING TITLE
        =================================================== */

        .location-heading h2 {
          margin: 0;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size:
            clamp(
              42px,
              5vw,
              72px
            );

          line-height: 0.95;

          font-weight: 800;

          letter-spacing: -3px;

          color: #7256B8;

          text-transform: uppercase;
        }

        /* Highlight */

        .location-heading h2 span {
          color: #9B7EDE;
        }

        /* ===================================================
           DESCRIPTION
        =================================================== */

        .location-heading p {
          margin:
            18px auto 0;

          max-width: 620px;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size: 15px;

          line-height: 1.6;

          color: #403B4C;
        }

        /* ===================================================
           LOCATION LIST
        =================================================== */

        .location-list {
          width: 100%;

          display: flex;

          align-items: center;

          justify-content: center;

          margin-bottom: 48px;
        }

        /* ===================================================
           LOCATION CARD
        =================================================== */

        .location-card {
          width: 100%;

          max-width: 420px;

          height: 80px;

          border:
            1px solid
            rgba(155, 126, 222, 0.18);

          outline: none;

          border-radius: 20px;

          background:
            rgba(255, 255, 255, 0.92);

          padding:
            0 24px;

          display: flex;

          align-items: center;

          gap: 17px;

          cursor: pointer;

          text-decoration: none;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          box-shadow:
            0 8px 28px
            rgba(114, 86, 184, 0.08);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease,
            border-color 0.25s ease;
        }

        /* ===================================================
           CARD HOVER
        =================================================== */

        .location-card:hover {
          transform:
            translateY(-3px);

          background:
            #FFFFFF;

          border-color:
            rgba(155, 126, 222, 0.38);

          box-shadow:
            0 16px 35px
            rgba(114, 86, 184, 0.14);
        }

        .location-card:active {
          transform:
            translateY(-1px)
            scale(0.99);
        }

        /* ===================================================
           LOCATION ICON
        =================================================== */

        .location-icon {
          width: 32px;

          height: 32px;

          flex:
            0 0 32px;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #EDE6FF,
              #DCCEFF
            );

          border:
            1px solid
            rgba(155, 126, 222, 0.18);

          position: relative;

          display: flex;

          align-items: center;

          justify-content: center;
        }

        /* ===================================================
           PIN DOT
        =================================================== */

        .location-pin-dot {
          width: 6px;

          height: 6px;

          border-radius: 50%;

          background:
            #7256B8;

          position: absolute;

          top: 7px;
        }

        /* ===================================================
           PIN LINE
        =================================================== */

        .location-pin-line {
          width: 2px;

          height: 11px;

          background:
            #7256B8;

          position: absolute;

          top: 10px;

          border-radius: 4px;
        }

        /* ===================================================
           LOCATION CONTENT
        =================================================== */

        .location-content {
          display: flex;

          flex-direction: column;

          align-items: flex-start;

          justify-content: center;

          flex: 1;

          min-width: 0;
        }

        /* ===================================================
           LOCATION NAME
        =================================================== */

        .location-name {
          font-size: 15px;

          font-weight: 600;

          color: #16131D;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;
        }

        /* ===================================================
           LOCATION SUBTITLE
        =================================================== */

        .location-subtitle {
          margin-top: 4px;

          font-size: 12px;

          color: #777180;

          white-space: nowrap;
        }

        /* ===================================================
           CARD ARROW
        =================================================== */

        .location-arrow {
          width: 34px;

          height: 34px;

          flex:
            0 0 34px;

          border-radius: 50%;

          background:
            #EDE6FF;

          border:
            1px solid
            rgba(155, 126, 222, 0.14);

          display: flex;

          align-items: center;

          justify-content: center;

          color:
            #7256B8;

          font-size: 17px;

          transition:
            transform 0.25s ease,
            background 0.25s ease,
            color 0.25s ease;
        }

        /* ===================================================
           ARROW HOVER
        =================================================== */

        .location-card:hover
        .location-arrow {
          transform:
            translate(2px, -2px);

          background:
            #9B7EDE;

          color:
            #FFFFFF;
        }

        /* ===================================================
           MAP WRAPPER
        =================================================== */

        .location-map-wrapper {
          width: 100%;

          height: 500px;

          border-radius: 20px;

          overflow: hidden;

          position: relative;

          background:
            #E8E3F0;

          border:
            1px solid
            rgba(155, 126, 222, 0.16);

          box-shadow:
            0 20px 45px
            rgba(114, 86, 184, 0.10);
        }

        /* ===================================================
           MAP
        =================================================== */

        .location-map-wrapper iframe {
          width: 100%;

          height: 100%;

          display: block;

          border: 0;
        }

        /* ===================================================
           OPEN MAP BUTTON
        =================================================== */

        .open-map-button {
          position: absolute;

          left: 20px;

          bottom: 20px;

          height: 48px;

          padding:
            0 18px;

          border-radius: 12px;

          background:
            rgba(255, 255, 255, 0.96);

          color:
            #3D334F;

          display: flex;

          align-items: center;

          gap: 12px;

          text-decoration: none;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size: 11px;

          font-weight: 700;

          letter-spacing: 0.8px;

          border:
            1px solid
            rgba(155, 126, 222, 0.18);

          box-shadow:
            0 8px 25px
            rgba(114, 86, 184, 0.16);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease,
            color 0.25s ease;
        }

        /* ===================================================
           OPEN MAP HOVER
        =================================================== */

        .open-map-button:hover {
          transform:
            translateY(-2px);

          background:
            #9B7EDE;

          color:
            #FFFFFF;

          box-shadow:
            0 12px 30px
            rgba(114, 86, 184, 0.25);
        }

        /* ===================================================
           MAP ARROW
        =================================================== */

        .open-map-arrow {
          font-size: 17px;

          line-height: 1;
        }

        /* ===================================================
           TABLET
        =================================================== */

        @media (max-width: 1100px) {

          .location-wrapper {
            width:
              min(
                calc(100% - 32px),
                1000px
              );
          }

          .location-card {
            max-width: 380px;
          }

          .location-map-wrapper {
            height: 450px;
          }
        }

        /* ===================================================
           MOBILE
        =================================================== */

        @media (max-width: 768px) {

          .location-section {
            background:
              linear-gradient(
                to bottom,
                #EDE6FF 0%,
                #EDE6FF 68%,
                #FFFFFF 68%,
                #FFFFFF 100%
              );

            padding-bottom: 45px;
          }

          .location-wrapper {
            width:
              calc(100% - 28px);
          }

          .location-heading {
            margin-bottom: 28px;
          }

          .location-heading h2 {
            font-size: 42px;

            letter-spacing: -2px;
          }

          .location-heading p {
            font-size: 14px;

            padding:
              0 10px;

            color:
              #514A5D;
          }

          /* LOCATION CARD */

          .location-list {
            justify-content:
              flex-start;

            margin-bottom: 30px;
          }

          .location-card {
            width: 100%;

            max-width: none;

            height: 68px;

            border-radius: 17px;

            padding:
              0 16px;
          }

          .location-icon {
            width: 30px;

            height: 30px;

            flex-basis: 30px;
          }

          .location-name {
            font-size: 14px;
          }

          .location-subtitle {
            font-size: 11px;
          }

          /* MAP */

          .location-map-wrapper {
            height: 400px;

            border-radius: 18px;
          }

          .open-map-button {
            left: 12px;

            bottom: 12px;

            height: 44px;

            padding:
              0 14px;

            border-radius: 10px;

            font-size: 10px;
          }
        }

        /* ===================================================
           SMALL MOBILE
        =================================================== */

        @media (max-width: 480px) {

          .location-section {
            background:
              linear-gradient(
                to bottom,
                #EDE6FF 0%,
                #EDE6FF 65%,
                #FFFFFF 65%,
                #FFFFFF 100%
              );
          }

          .location-heading h2 {
            font-size: 34px;

            letter-spacing:
              -1.5px;
          }

          .location-heading p {
            font-size: 13px;

            line-height: 1.5;

            margin-top: 12px;
          }

          .location-card {
            height: 64px;

            border-radius: 16px;
          }

          .location-map-wrapper {
            height: 350px;

            border-radius: 16px;
          }

          .open-map-button {
            left: 10px;

            bottom: 10px;

            height: 42px;

            padding:
              0 12px;

            gap: 8px;
          }
        }

        /* ===================================================
           EXTRA SMALL
        =================================================== */

        @media (max-width: 360px) {

          .location-heading h2 {
            font-size: 31px;
          }

          .location-heading p {
            font-size: 12px;
          }

          .location-card {
            padding:
              0 13px;
          }

          .location-map-wrapper {
            height: 320px;
          }

          .open-map-button {
            font-size: 9px;
          }
        }

      `}</style>
    </section>
  );
}
