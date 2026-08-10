// src/pages/auth/Login.jsx

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LOGIN_VIDEO =
  "https://res.cloudinary.com/dtqxc3rmt/video/upload/v1767108059/car_vid_kiee4t.mp4";

export default function Login({
  form,
  loading,
  obscure,
  setObscure,
  handleChange,
  handleLogin,
  playAudio,
}) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">

      {/* =====================================================
          🎥 CLOUDINARY VIDEO BACKGROUND
      ===================================================== */}

      <video
        src={LOGIN_VIDEO}
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
        "
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
      />

      {/* =====================================================
          🌑 LIGHT OVERLAY
      ===================================================== */}

      <div
        className="
          absolute
          inset-0
          bg-black/25
        "
      />

      {/* =====================================================
          REGISTER BUTTON
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
        }}
        className="
          absolute
          right-5
          top-5
          z-30

          sm:right-8
          sm:top-8

          md:right-14
          md:top-8

          lg:right-20
          lg:top-10
        "
      >
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="
            rounded-full

            border
            border-white/30

            bg-white/10

            px-5
            py-2.5

            text-[11px]
            font-semibold
            tracking-[0.18em]

            text-white

            shadow-lg

            backdrop-blur-xl

            transition

            hover:bg-white/20
            hover:border-white/50

            active:scale-95
          "
        >
          REGISTER
        </button>
      </motion.div>

      {/* =====================================================
          CENTER
      ===================================================== */}

      <div
        className="
          relative
          z-10

          flex
          min-h-screen

          items-center
          justify-center

          px-4
          py-24

          sm:px-6
          md:px-8
        "
      >

        {/* ===================================================
            GLASSMORPHISM LOGIN CARD
        =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="
            relative
            w-full
            max-w-[430px]

            overflow-hidden

            rounded-[28px]

            border
            border-white/30

            bg-white/[0.12]

            p-6

            shadow-[0_25px_80px_rgba(0,0,0,0.35)]

            backdrop-blur-2xl

            sm:rounded-[32px]
            sm:p-8

            md:p-9
          "
        >

          {/* =================================================
              GLASS LIGHT
          ================================================= */}

          <div
            className="
              pointer-events-none
              absolute
              -left-20
              -top-20

              h-40
              w-40

              rounded-full

              bg-white/10

              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              -right-20

              h-40
              w-40

              rounded-full

              bg-white/10

              blur-3xl
            "
          />

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="relative z-10">

            {/* =================================================
                TITLE
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
              className="
                mb-8
                text-center
              "
            >
              <h1
                className="
                  text-3xl
                  font-light
                  tracking-tight
                  text-white
                  drop-shadow-lg

                  sm:text-4xl

                  md:text-[42px]
                "
              >
                Please sign in.
              </h1>

              <p
                className="
                  mt-2
                  text-xs
                  text-white/65

                  sm:text-sm
                "
              >
                Welcome back to Re2Buy
              </p>
            </motion.div>

            {/* =================================================
                FORM
            ================================================= */}

            <div className="space-y-4 sm:space-y-5">

              {/* EMAIL / PHONE */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                }}
              >
                <InputBox
                  placeholder="Email / Phone"
                  name="identifier"
                  value={form?.identifier || ""}
                  onChange={handleChange}
                  onFocus={() =>
                    playAudio("mobile")
                  }
                  autoComplete="username"
                />
              </motion.div>

              {/* PASSWORD */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.35,
                }}
              >
                <div className="relative">

                  <InputBox
                    placeholder="Password"
                    name="password"
                    type={
                      obscure
                        ? "password"
                        : "text"
                    }
                    value={form?.password || ""}
                    onChange={handleChange}
                    onFocus={() =>
                      playAudio("password")
                    }
                    autoComplete="current-password"
                  />

                  {/* PASSWORD TOGGLE */}

                  <button
                    type="button"
                    onClick={() =>
                      setObscure(!obscure)
                    }
                    aria-label={
                      obscure
                        ? "Show password"
                        : "Hide password"
                    }
                    className="
                      absolute
                      right-3
                      top-1/2

                      flex
                      h-10
                      w-10

                      -translate-y-1/2

                      items-center
                      justify-center

                      rounded-full

                      bg-black/10

                      text-base
                      text-black/70

                      backdrop-blur-md

                      transition

                      hover:bg-black/15
                      hover:text-black

                      active:scale-90
                    "
                  >
                    {obscure ? "👁️" : "🙈"}
                  </button>

                </div>
              </motion.div>

              {/* LOGIN BUTTON */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.5,
                }}
                className="
                  flex
                  justify-center
                  pt-3
                "
              >
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                  className="
                    flex

                    min-h-[54px]

                    w-full
                    max-w-[190px]

                    items-center
                    justify-center

                    rounded-full

                    border
                    border-white/40

                    bg-white/90

                    px-8

                    font-bold
                    tracking-[0.16em]

                    text-black

                    shadow-xl

                    transition

                    hover:scale-105
                    hover:bg-white
                    hover:shadow-2xl

                    active:scale-95

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {loading ? (
                    <span
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <span
                        className="
                          h-5
                          w-5

                          animate-spin

                          rounded-full

                          border-2
                          border-black/20
                          border-t-black
                        "
                      />

                      <span>
                        LOADING
                      </span>
                    </span>
                  ) : (
                    "LOGIN"
                  )}
                </button>
              </motion.div>

            </div>

            {/* =================================================
                BOTTOM LINKS
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.6,
                delay: 0.7,
              }}
              className="
                mt-7

                flex
                items-center
                justify-between

                gap-3

                border-t
                border-white/15

                pt-5
              "
            >

              <button
                type="button"
                className="
                  text-[11px]
                  text-white/65

                  transition

                  hover:text-white

                  sm:text-xs
                "
              >
                Forgot password?
              </button>

              {/* CREATE ACCOUNT */}

              <button
                type="button"
                onClick={() =>
                  navigate("/register")
                }
                className="
                  text-[11px]
                  font-medium

                  text-white/75

                  transition

                  hover:text-white

                  sm:text-xs
                "
              >
                Create account
              </button>

            </motion.div>

          </div>
        </motion.div>
      </div>

      {/* =====================================================
          LOADING OVERLAY
      ===================================================== */}

      {loading && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="
            absolute
            inset-0
            z-[100]

            flex
            items-center
            justify-center

            bg-black/25

            backdrop-blur-md
          "
        >
          <div
            className="
              flex
              h-14
              w-14

              items-center
              justify-center

              rounded-full

              border
              border-white/30

              bg-white/10

              shadow-xl

              backdrop-blur-xl
            "
          >
            <div
              className="
                h-7
                w-7

                animate-spin

                rounded-full

                border-[3px]
                border-white/30
                border-t-white
              "
            />
          </div>
        </motion.div>
      )}

    </div>
  );
}

/* =========================================================
   INPUT BOX
========================================================= */

function InputBox({
  placeholder,
  ...props
}) {
  return (
    <input
      {...props}
      placeholder={placeholder}
      className="
        h-14
        w-full

        rounded-2xl

        border
        border-white/30

        bg-white/85

        px-5

        font-medium
        text-black

        shadow-lg

        outline-none

        backdrop-blur-xl

        transition

        placeholder:text-black/35

        focus:border-white/60
        focus:bg-white/95

        focus:ring-2
        focus:ring-white/20

        sm:h-[58px]
      "
    />
  );
}