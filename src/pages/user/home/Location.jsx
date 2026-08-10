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

          {/* Open Google Maps */}

          <a
            href="https://maps.app.goo.gl/kuCvcFBcWNHrYWvx5"
            target="_blank"
            rel="noopener noreferrer"
            className="open-map-button"
          >
            <span>OPEN IN GOOGLE MAPS</span>
            <span className="open-map-arrow">↗</span>
          </a>

        </div>

      </div>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`

        /* ===================================================
           SECTION
        =================================================== */

        .location-section {
          width: 100%;
          position: relative;

          background:
            linear-gradient(
              to bottom,
              #FFE4A1 0%,
              #FFE4A1 79%,
              #FFFFFF 79%,
              #FFFFFF 100%
            );

          padding: 0 0 70px 0;

          overflow: hidden;
        }


        /* ===================================================
           WRAPPER
        =================================================== */

        .location-wrapper {
          width: min(1415px, calc(100% - 40px));

          margin: 0 auto;

          position: relative;
        }


        /* ===================================================
           HEADING
        =================================================== */

        .location-heading {
          text-align: center;

          padding-top: 0;

          margin-bottom: 38px;
        }


        .location-heading h2 {
          margin: 0;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size: clamp(42px, 5vw, 72px);

          line-height: 0.95;

          font-weight: 800;

          letter-spacing: -3px;

          color: #EBA900;

          text-transform: uppercase;
        }


        .location-heading h2 span {
          color: #EBA900;
        }


        .location-heading p {
          margin: 18px auto 0;

          max-width: 620px;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size: 15px;

          line-height: 1.6;

          color: #171717;
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

          border: none;

          outline: none;

          border-radius: 20px;

          background: #FFFFFF;

          padding: 0 24px;

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
            0 1px 0 rgba(0, 0, 0, 0.01);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease;
        }


        .location-card:hover {
          transform: translateY(-3px);

          box-shadow:
            0 10px 25px rgba(0, 0, 0, 0.07);
        }


        .location-card:active {
          transform: translateY(-1px) scale(0.99);
        }


        /* ===================================================
           LOCATION ICON
        =================================================== */

        .location-icon {
          width: 32px;
          height: 32px;

          flex: 0 0 32px;

          border-radius: 50%;

          background: #FFE29A;

          position: relative;

          display: flex;

          align-items: center;

          justify-content: center;
        }


        .location-pin-dot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #171717;

          position: absolute;

          top: 7px;
        }


        .location-pin-line {
          width: 2px;
          height: 11px;

          background: #171717;

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


        .location-name {
          font-size: 15px;

          font-weight: 600;

          color: #101010;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;
        }


        .location-subtitle {
          margin-top: 4px;

          font-size: 12px;

          color: #777777;

          white-space: nowrap;
        }


        /* ===================================================
           CARD ARROW
        =================================================== */

        .location-arrow {
          width: 34px;
          height: 34px;

          flex: 0 0 34px;

          border-radius: 50%;

          background: #FFE4A1;

          display: flex;

          align-items: center;

          justify-content: center;

          color: #151515;

          font-size: 17px;

          transition:
            transform 0.25s ease,
            background 0.25s ease;
        }


        .location-card:hover .location-arrow {
          transform: translate(2px, -2px);

          background: #FFD875;
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

          background: #D7DDE0;

          box-shadow:
            0 20px 45px rgba(0, 0, 0, 0.04);
        }


        /* ===================================================
           GOOGLE MAP IFRAME
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

          padding: 0 18px;

          border-radius: 12px;

          background: #FFFFFF;

          color: #151515;

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

          box-shadow:
            0 8px 25px rgba(0, 0, 0, 0.14);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease;
        }


        .open-map-button:hover {
          transform: translateY(-2px);

          background: #FFE4A1;

          box-shadow:
            0 12px 30px rgba(0, 0, 0, 0.18);
        }


        .open-map-arrow {
          font-size: 17px;

          line-height: 1;
        }


        /* ===================================================
           TABLET
        =================================================== */

        @media (max-width: 1100px) {

          .location-wrapper {
            width: min(
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
                #FFE4A1 0%,
                #FFE4A1 68%,
                #FFFFFF 68%,
                #FFFFFF 100%
              );

            padding-bottom: 45px;
          }


          .location-wrapper {
            width: calc(100% - 28px);
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

            padding: 0 10px;
          }


          /* LOCATION CARD */

          .location-list {
            justify-content: flex-start;

            margin-bottom: 30px;
          }


          .location-card {
            width: 100%;

            max-width: none;

            height: 68px;

            border-radius: 17px;

            padding: 0 16px;
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

            padding: 0 14px;

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
                #FFE4A1 0%,
                #FFE4A1 65%,
                #FFFFFF 65%,
                #FFFFFF 100%
              );
          }


          .location-heading h2 {
            font-size: 34px;

            letter-spacing: -1.5px;
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

            padding: 0 12px;

            gap: 8px;
          }

        }

      `}</style>
    </section>
  );
}