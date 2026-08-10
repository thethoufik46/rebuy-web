
// src/auth/Forgot.jsx

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
   BACKGROUND VIDEO
========================================================= */

const VIDEO_URL =
  "https://res.cloudinary.com/dtqxc3rmt/video/upload/v1767108059/car_vid_kiee4t.mp4";

/* =========================================================
   FORGOT PASSWORD
========================================================= */

export default function Forgot() {
  const navigate = useNavigate();

  const videoRef = useRef(null);

  const phoneAudioRef = useRef(null);
  const passwordAudioRef = useRef(null);

  /* =======================================================
     FORM
  ======================================================= */

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  /* =======================================================
     UI
  ======================================================= */

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [showMessage, setShowMessage] =
    useState(false);

  const [videoReady, setVideoReady] =
    useState(false);

  /* =======================================================
     ANIMATION
  ======================================================= */

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  /* =======================================================
     VIDEO
  ======================================================= */

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;

    video.setAttribute(
      "playsinline",
      ""
    );

    video.setAttribute(
      "webkit-playsinline",
      ""
    );

    const playVideo = async () => {
      try {
        video.muted = true;

        await video.play();
      } catch (error) {
        console.log(
          "Video autoplay blocked:",
          error
        );
      }
    };

    const handleReady = () => {
      setVideoReady(true);

      playVideo();
    };

    video.addEventListener(
      "loadeddata",
      handleReady
    );

    video.addEventListener(
      "canplay",
      handleReady
    );

    playVideo();

    return () => {
      video.removeEventListener(
        "loadeddata",
        handleReady
      );

      video.removeEventListener(
        "canplay",
        handleReady
      );

      video.pause();
    };
  }, []);

  /* =======================================================
     AUDIO
  ======================================================= */

  useEffect(() => {
    phoneAudioRef.current =
      new Audio("/audio/mobile.mp3");

    passwordAudioRef.current =
      new Audio("/audio/newpassword.mp3");

    return () => {
      if (phoneAudioRef.current) {
        phoneAudioRef.current.pause();
        phoneAudioRef.current.currentTime = 0;
      }

      if (passwordAudioRef.current) {
        passwordAudioRef.current.pause();
        passwordAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  /* =======================================================
     PLAY AUDIO
  ======================================================= */

  const playAudio = (
    audioRef
  ) => {
    const audio =
      audioRef.current;

    if (!audio) {
      return;
    }

    try {
      audio.pause();

      audio.currentTime = 0;

      const promise =
        audio.play();

      if (
        promise &&
        typeof promise.catch ===
          "function"
      ) {
        promise.catch(() => {});
      }
    } catch {
      // Ignore autoplay/audio errors
    }
  };

  /* =======================================================
     PHONE FOCUS
  ======================================================= */

  const handlePhoneFocus = () => {
    playAudio(phoneAudioRef);
  };

  /* =======================================================
     PASSWORD FOCUS
  ======================================================= */

  const handlePasswordFocus = () => {
    playAudio(passwordAudioRef);
  };

  /* =======================================================
     SNACK / MESSAGE
  ======================================================= */

  const showToast = (message) => {
    const toast =
      document.createElement("div");

    toast.className =
      "re2buy-forgot-toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add(
        "re2buy-forgot-toast-show"
      );
    });

    setTimeout(() => {
      toast.classList.remove(
        "re2buy-forgot-toast-show"
      );

      setTimeout(() => {
        toast.remove();
      }, 250);
    }, 2800);
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const cleanPhone =
      phone.trim();

    const cleanPassword =
      password.trim();

    /* -----------------------------------------------
       VALIDATION
    ----------------------------------------------- */

    if (
      !cleanPhone ||
      !cleanPassword
    ) {
      showToast(
        "Enter all fields"
      );

      return;
    }

    if (
      cleanPassword.length < 6
    ) {
      showToast(
        "Password too short"
      );

      return;
    }

    /* -----------------------------------------------
       LOADING
    ----------------------------------------------- */

    setLoading(true);

    try {
      const response =
        await fetch(
          `${BASE_URL}/auth/forgot-request`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            body: JSON.stringify({
              phone: cleanPhone,
              newPassword:
                cleanPassword,
            }),
          }
        );

      const text =
        await response.text();

      let data = {};

      try {
        data = text
          ? JSON.parse(text)
          : {};
      } catch {
        data = {
          success: false,
          message:
            "Invalid server response",
        };
      }

      /* ---------------------------------------------
         SUCCESS
      --------------------------------------------- */

      if (
        response.ok &&
        data.success === true
      ) {
        setShowMessage(true);

        showToast(
          "Request sent successfully"
        );

        /*
         * Same Flutter behavior:
         * Show message for 10 seconds,
         * then go back to login.
         */

        setTimeout(() => {
          navigate("/login");
        }, 10000);

        return;
      }

      /* ---------------------------------------------
         USER NOT FOUND
      --------------------------------------------- */

      if (
        response.status === 404
      ) {
        showToast(
          "❌ User not found"
        );

        return;
      }

      /* ---------------------------------------------
         SERVER ERROR
      --------------------------------------------- */

      showToast(
        data.message ||
          "Request failed"
      );
    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      showToast(
        "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     BACK TO LOGIN
  ======================================================= */

  const backToLogin = () => {
    navigate("/login");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="re2buy-forgot-page">

      {/* =================================================
          VIDEO BACKGROUND
      ================================================= */}

      <div className="re2buy-forgot-video-layer">

        <video
          ref={videoRef}

          className={`
            re2buy-forgot-video
            ${
              videoReady
                ? "re2buy-forgot-video-ready"
                : ""
            }
          `}

          src={VIDEO_URL}

          autoPlay

          muted

          loop

          playsInline

          preload="auto"

          controls={false}

          disablePictureInPicture

          disableRemotePlayback
        />

      </div>

      {/* =================================================
          DARK / BLUR OVERLAY
      ================================================= */}

      <div className="re2buy-forgot-overlay" />

      {/* =================================================
          CONTENT
      ================================================= */}

      <main
        className={`
          re2buy-forgot-content
          ${
            mounted
              ? "re2buy-forgot-content-visible"
              : ""
          }
        `}
      >

        <div className="re2buy-forgot-inner">

          {/* =================================================
              TITLE
          ================================================= */}

          <h1 className="re2buy-forgot-title">
            Forgot Password?
          </h1>

          {/* =================================================
              SUBTITLE
          ================================================= */}

          <p className="re2buy-forgot-subtitle">
            Enter details
          </p>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={
              handleSubmit
            }
            className="re2buy-forgot-form"
          >

            {/* =============================================
                PHONE
            ============================================= */}

            <div className="re2buy-forgot-field-wrapper">

              <input
                type="tel"

                inputMode="numeric"

                autoComplete="tel"

                value={phone}

                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }

                onFocus={
                  handlePhoneFocus
                }

                placeholder="Phone Number (மொபைல் எண்)"

                className="
                  re2buy-forgot-field
                "
              />

            </div>

            {/* =============================================
                PASSWORD
            ============================================= */}

            <div className="re2buy-forgot-field-wrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }

                autoComplete="new-password"

                value={password}

                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }

                onFocus={
                  handlePasswordFocus
                }

                placeholder="New Password (புதிய பாஸ்வேர்ட்)"

                className="
                  re2buy-forgot-field
                  re2buy-forgot-password-field
                "
              />

              {/* =========================================
                  PASSWORD TOGGLE
              ========================================= */}

              <button
                type="button"

                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }

                onClick={() =>
                  setShowPassword(
                    (value) => !value
                  )
                }

                className="
                  re2buy-forgot-eye
                "
              >
                {showPassword
                  ? "◉"
                  : "◌"}
              </button>

            </div>

            {/* =============================================
                SEND BUTTON
            ============================================= */}

            <div className="re2buy-forgot-button-wrapper">

              <button
                type="submit"

                disabled={loading}

                className="
                  re2buy-forgot-submit
                "
              >

                {loading ? (
                  <span className="re2buy-spinner" />
                ) : (
                  "SEND REQUEST"
                )}

              </button>

            </div>

          </form>

          {/* =================================================
              SUCCESS MESSAGE
          ================================================= */}

          {showMessage && (
            <div
              className="
                re2buy-forgot-success
              "
            >
              <div className="re2buy-forgot-success-icon">
                ✓
              </div>

              <div>
                <p>
                  Re2buy team updating soon
                </p>

                <span>
                  சில நிமிடங்களில் புதுப்பிக்கப்படும்
                </span>
              </div>
            </div>
          )}

          {/* =================================================
              SPACER
          ================================================= */}

          <div className="re2buy-forgot-spacer" />

          {/* =================================================
              BACK TO LOGIN
          ================================================= */}

          <button
            type="button"

            onClick={
              backToLogin
            }

            className="
              re2buy-forgot-back
            "
          >
            Back to Login
          </button>

          <div className="re2buy-forgot-bottom-space" />

        </div>

      </main>

      {/* =================================================
          FULL SCREEN LOADING
      ================================================= */}

      {loading && (
        <div
          className="
            re2buy-forgot-loading
          "
        >
          <div className="re2buy-loading-spinner" />
        </div>
      )}

      {/* =================================================
          STYLES
      ================================================= */}

      <style>{`

        /* ===================================================
           PAGE
        =================================================== */

        .re2buy-forgot-page {
          position: relative;

          width: 100%;

          min-height: 100vh;

          min-height: 100svh;

          overflow: hidden;

          background: #111;

          color: #fff;

          isolation: isolate;

          font-family:
            "AnekTamil",
            "Noto Sans Tamil",
            "Segoe UI",
            Arial,
            sans-serif;
        }

        /* ===================================================
           VIDEO
        =================================================== */

        .re2buy-forgot-video-layer {
          position: fixed;

          inset: 0;

          z-index: 0;

          width: 100%;

          height: 100%;

          overflow: hidden;

          background: #111;
        }

        .re2buy-forgot-video {
          position: absolute;

          inset: 0;

          width: 100%;

          height: 100%;

          min-width: 100%;

          min-height: 100%;

          object-fit: cover;

          object-position: center;

          display: block;

          opacity: 1;

          background: #111;

          pointer-events: none;

          transform:
            scale(1.025);
        }

        .re2buy-forgot-video-ready {
          opacity: 1;

          transform:
            scale(1);
        }

        /* ===================================================
           OVERLAY
        =================================================== */

        .re2buy-forgot-overlay {
          position: fixed;

          inset: 0;

          z-index: 1;

          pointer-events: none;

          background:
            linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.48),
              rgba(0, 0, 0, 0.38)
            );

          backdrop-filter:
            blur(20px);

          -webkit-backdrop-filter:
            blur(20px);
        }

        /* ===================================================
           CONTENT
        =================================================== */

        .re2buy-forgot-content {
          position: relative;

          z-index: 5;

          width: 100%;

          min-height: 100vh;

          min-height: 100svh;

          padding:
            0 30px;

          opacity: 0;

          transform:
            translateY(40px);

          transition:
            opacity 0.9s ease,
            transform 0.9s
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              );
        }

        .re2buy-forgot-content-visible {
          opacity: 1;

          transform:
            translateY(0);
        }

        /* ===================================================
           INNER
        =================================================== */

        .re2buy-forgot-inner {
          width: 100%;

          max-width: 620px;

          min-height: 100vh;

          min-height: 100svh;

          margin: 0 auto;

          padding-top: 50px;

          padding-bottom: 30px;

          display: flex;

          flex-direction: column;

          align-items: stretch;
        }

        /* ===================================================
           TITLE
        =================================================== */

        .re2buy-forgot-title {
          margin: 0;

          font-size:
            clamp(
              34px,
              5vw,
              48px
            );

          line-height: 1.05;

          font-weight: 500;

          letter-spacing:
            -0.04em;

          color: #fff;
        }

        /* ===================================================
           SUBTITLE
        =================================================== */

        .re2buy-forgot-subtitle {
          margin:
            20px 0 0;

          font-size: 15px;

          line-height: 1.5;

          font-weight: 400;

          color:
            rgba(255, 255, 255, 0.72);
        }

        /* ===================================================
           FORM
        =================================================== */

        .re2buy-forgot-form {
          width: 100%;

          margin-top: 50px;
        }

        /* ===================================================
           FIELD
        =================================================== */

        .re2buy-forgot-field-wrapper {
          position: relative;

          width: 100%;

          margin-bottom: 20px;
        }

        .re2buy-forgot-field {
          width: 100%;

          height: 58px;

          padding:
            0 20px;

          border: none;

          outline: none;

          border-radius: 12px;

          background:
            rgba(255, 255, 255, 0.96);

          color: #111;

          font-family:
            "AnekTamil",
            "Noto Sans Tamil",
            "Segoe UI",
            Arial,
            sans-serif;

          font-size: 15px;

          font-weight: 500;

          letter-spacing:
            0.1px;

          box-shadow:
            0 8px 30px
            rgba(0, 0, 0, 0.08);

          transition:
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .re2buy-forgot-field::placeholder {
          color:
            rgba(0, 0, 0, 0.48);

          opacity: 1;
        }

        .re2buy-forgot-field:focus {
          box-shadow:
            0 0 0 2px
            rgba(255, 255, 255, 0.9),
            0 12px 35px
            rgba(0, 0, 0, 0.14);
        }

        /* ===================================================
           PASSWORD
        =================================================== */

        .re2buy-forgot-password-field {
          padding-right: 58px;
        }

        /* ===================================================
           EYE
        =================================================== */

        .re2buy-forgot-eye {
          position: absolute;

          top: 50%;

          right: 8px;

          width: 44px;

          height: 44px;

          transform:
            translateY(-50%);

          border: none;

          background:
            transparent;

          color: #222;

          font-size: 21px;

          cursor: pointer;

          display: flex;

          align-items: center;

          justify-content: center;
        }

        .re2buy-forgot-eye:hover {
          opacity: 0.55;
        }

        /* ===================================================
           BUTTON
        =================================================== */

        .re2buy-forgot-button-wrapper {
          width: 100%;

          display: flex;

          justify-content: center;

          margin-top: 15px;
        }

        .re2buy-forgot-submit {
          width: 200px;

          height: 55px;

          border: none;

          border-radius: 30px;

          background:
            rgba(255, 255, 255, 0.95);

          color: #111;

          font-family:
            "AnekTamil",
            "Noto Sans Tamil",
            "Segoe UI",
            Arial,
            sans-serif;

          font-size: 13px;

          font-weight: 700;

          letter-spacing:
            1.4px;

          cursor: pointer;

          box-shadow:
            0 8px 30px
            rgba(255, 255, 255, 0.16);

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
        }

        .re2buy-forgot-submit:hover:not(:disabled) {
          transform:
            translateY(-2px);

          background: #fff;

          box-shadow:
            0 12px 38px
            rgba(255, 255, 255, 0.25);
        }

        .re2buy-forgot-submit:active:not(:disabled) {
          transform:
            translateY(0);
        }

        .re2buy-forgot-submit:disabled {
          cursor: not-allowed;

          opacity: 0.72;
        }

        /* ===================================================
           BUTTON SPINNER
        =================================================== */

        .re2buy-spinner {
          width: 20px;

          height: 20px;

          display: inline-block;

          border:
            2px solid
            rgba(0, 0, 0, 0.18);

          border-top-color:
            #111;

          border-radius: 50%;

          animation:
            re2buyForgotSpin
            0.7s linear infinite;
        }

        /* ===================================================
           SUCCESS
        =================================================== */

        .re2buy-forgot-success {
          width: 100%;

          margin-top: 30px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 12px;

          text-align: left;

          color:
            rgba(255, 255, 255, 0.72);

          animation:
            re2buyForgotSuccess
            0.45s ease;
        }

        .re2buy-forgot-success-icon {
          width: 28px;

          height: 28px;

          flex: 0 0 28px;

          border-radius: 50%;

          display: flex;

          align-items: center;

          justify-content: center;

          background:
            rgba(255, 255, 255, 0.16);

          color: #fff;

          font-size: 14px;
        }

        .re2buy-forgot-success p {
          margin: 0;

          font-size: 13px;

          line-height: 1.5;

          color:
            rgba(255, 255, 255, 0.76);
        }

        .re2buy-forgot-success span {
          display: block;

          margin-top: 3px;

          font-size: 12px;

          line-height: 1.5;

          color:
            rgba(255, 255, 255, 0.58);
        }

        /* ===================================================
           SPACER
        =================================================== */

        .re2buy-forgot-spacer {
          flex: 1;
        }

        /* ===================================================
           BACK LOGIN
        =================================================== */

        .re2buy-forgot-back {
          align-self: center;

          padding: 8px 12px;

          border: none;

          background: transparent;

          color:
            rgba(255, 255, 255, 0.70);

          font-family:
            "AnekTamil",
            "Noto Sans Tamil",
            "Segoe UI",
            Arial,
            sans-serif;

          font-size: 13px;

          cursor: pointer;

          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .re2buy-forgot-back:hover {
          color: #fff;

          transform:
            translateY(-1px);
        }

        .re2buy-forgot-bottom-space {
          height: 22px;
        }

        /* ===================================================
           FULL SCREEN LOADING
        =================================================== */

        .re2buy-forgot-loading {
          position: fixed;

          inset: 0;

          z-index: 50;

          display: flex;

          align-items: center;

          justify-content: center;

          background:
            rgba(0, 0, 0, 0.50);

          backdrop-filter:
            blur(4px);

          -webkit-backdrop-filter:
            blur(4px);
        }

        .re2buy-loading-spinner {
          width: 38px;

          height: 38px;

          border:
            3px solid
            rgba(255, 255, 255, 0.30);

          border-top-color:
            #fff;

          border-radius: 50%;

          animation:
            re2buyForgotSpin
            0.75s linear infinite;
        }

        /* ===================================================
           TOAST
        =================================================== */

        .re2buy-forgot-toast {
          position: fixed;

          z-index: 100;

          left: 50%;

          bottom: 30px;

          transform:
            translate(-50%, 20px);

          max-width:
            calc(100vw - 32px);

          padding:
            12px 18px;

          border-radius: 12px;

          background:
            rgba(20, 20, 20, 0.92);

          color: #fff;

          font-family:
            "AnekTamil",
            "Noto Sans Tamil",
            "Segoe UI",
            Arial,
            sans-serif;

          font-size: 13px;

          line-height: 1.4;

          box-shadow:
            0 10px 30px
            rgba(0, 0, 0, 0.22);

          opacity: 0;

          pointer-events: none;

          transition:
            opacity 0.25s ease,
            transform 0.25s ease;
        }

        .re2buy-forgot-toast-show {
          opacity: 1;

          transform:
            translate(-50%, 0);
        }

        /* ===================================================
           ANIMATIONS
        =================================================== */

        @keyframes re2buyForgotSpin {
          to {
            transform:
              rotate(360deg);
          }
        }

        @keyframes re2buyForgotSuccess {
          from {
            opacity: 0;

            transform:
              translateY(8px);
          }

          to {
            opacity: 1;

            transform:
              translateY(0);
          }
        }

        /* ===================================================
           TABLET
        =================================================== */

        @media (max-width: 900px) {

          .re2buy-forgot-content {
            padding:
              0 28px;
          }

          .re2buy-forgot-inner {
            max-width: 560px;
          }
        }

        /* ===================================================
           MOBILE
        =================================================== */

        @media (max-width: 600px) {

          .re2buy-forgot-content {
            padding:
              0 30px;
          }

          .re2buy-forgot-inner {
            max-width: none;

            padding-top: 50px;

            padding-bottom: 25px;
          }

          .re2buy-forgot-title {
            font-size: 34px;

            letter-spacing:
              -0.035em;
          }

          .re2buy-forgot-subtitle {
            margin-top: 20px;

            font-size: 14px;
          }

          .re2buy-forgot-form {
            margin-top: 50px;
          }

          .re2buy-forgot-field {
            height: 56px;

            padding:
              0 18px;

            font-size: 14px;

            border-radius: 12px;
          }

          .re2buy-forgot-password-field {
            padding-right: 55px;
          }

          .re2buy-forgot-button-wrapper {
            margin-top: 15px;
          }

          .re2buy-forgot-submit {
            width: 200px;

            height: 55px;
          }

          .re2buy-forgot-success {
            padding:
              0 4px;
          }

          .re2buy-forgot-video {
            object-position:
              55% center;
          }
        }

        /* ===================================================
           SMALL MOBILE
        =================================================== */

        @media (max-width: 420px) {

          .re2buy-forgot-content {
            padding:
              0 22px;
          }

          .re2buy-forgot-inner {
            padding-top: 38px;
          }

          .re2buy-forgot-title {
            font-size: 32px;
          }

          .re2buy-forgot-subtitle {
            font-size: 13px;
          }

          .re2buy-forgot-form {
            margin-top: 42px;
          }

          .re2buy-forgot-field {
            height: 54px;

            font-size: 13px;
          }

          .re2buy-forgot-submit {
            width: 190px;

            height: 53px;

            font-size: 12px;
          }

          .re2buy-forgot-back {
            font-size: 12px;
          }

          .re2buy-forgot-video {
            object-position:
              56% center;
          }
        }

        /* ===================================================
           VERY SMALL MOBILE
        =================================================== */

        @media (max-width: 360px) {

          .re2buy-forgot-content {
            padding:
              0 18px;
          }

          .re2buy-forgot-title {
            font-size: 29px;
          }

          .re2buy-forgot-form {
            margin-top: 36px;
          }

          .re2buy-forgot-field {
            height: 52px;

            font-size: 12px;
          }

          .re2buy-forgot-submit {
            width: 180px;

            height: 51px;
          }
        }

      `}</style>
    </div>
  );
}
