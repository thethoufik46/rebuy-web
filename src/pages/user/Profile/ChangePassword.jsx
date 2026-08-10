
// src/pages/user/Profile/ChangePassword.jsx

import React, {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import {
  changePassword,
} from "@/services/userApi";


export default function ChangePassword() {
  const navigate =
    useNavigate();

  /* =========================================================
     STATE
  ========================================================= */

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirm,
    setShowConfirm,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState(false);


  /* =========================================================
     CHANGE PASSWORD
     ---------------------------------------------------------
     Uses:
     src/services/userApi.js

     changePassword(newPassword)
  ========================================================= */

  const handleChangePassword =
    async (event) => {
      event.preventDefault();

      if (loading) {
        return;
      }

      /* -----------------------------------------------
         CLEAR OLD MESSAGE
      ------------------------------------------------ */

      setMessage("");
      setSuccess(false);


      /* -----------------------------------------------
         EMPTY VALIDATION
      ------------------------------------------------ */

      if (
        !password.trim() ||
        !confirmPassword.trim()
      ) {
        setMessage(
          "Please fill all fields"
        );

        return;
      }


      /* -----------------------------------------------
         PASSWORD LENGTH
      ------------------------------------------------ */

      if (
        password.length < 6
      ) {
        setMessage(
          "Password must be at least 6 characters"
        );

        return;
      }


      /* -----------------------------------------------
         PASSWORD MATCH
      ------------------------------------------------ */

      if (
        password !==
        confirmPassword
      ) {
        setMessage(
          "Passwords do not match"
        );

        return;
      }


      /* -----------------------------------------------
         API
      ------------------------------------------------ */

      setLoading(true);

      try {
        const ok =
          await changePassword(
            password
          );


        /* =============================================
           SUCCESS
        ============================================= */

        if (ok) {
          setSuccess(true);

          setMessage(
            "Password updated successfully"
          );

          setPassword("");
          setConfirmPassword("");


          /*
           * Return to previous screen
           * after showing success message.
           */

          window.setTimeout(() => {
            navigate(-1);
          }, 1200);

          return;
        }


        /* =============================================
           FAILED
        ============================================= */

        setSuccess(false);

        setMessage(
          "Failed to update password"
        );
      } catch (error) {
        console.error(
          "❌ Change password error 👉",
          error
        );

        setSuccess(false);

        setMessage(
          "Failed to update password"
        );
      } finally {
        setLoading(false);
      }
    };


  /* =========================================================
     BACK
  ========================================================= */

  const handleBack = () => {
    if (loading) {
      return;
    }

    navigate(-1);
  };


  /* =========================================================
     UI
  ========================================================= */

  return (
    <div
      className="
        min-h-screen
        w-full

        bg-gradient-to-br
        from-[#EEF2FF]
        via-[#F5F3FF]
        to-[#EDE9FE]

        px-4
        py-6

        sm:px-6
        sm:py-8
      "
    >

      {/* =====================================================
          PAGE CONTAINER
      ===================================================== */}

      <div
        className="
          mx-auto

          flex
          min-h-[calc(100vh-48px)]

          w-full
          max-w-[520px]

          flex-col
        "
      >

        {/* ===================================================
            BACK BUTTON
        =================================================== */}

        <button
          type="button"
          disabled={loading}
          onClick={
            handleBack
          }
          className="
            mb-6

            flex
            w-fit

            items-center
            gap-2

            rounded-full

            px-2
            py-2

            text-sm
            font-semibold

            text-slate-600

            transition

            hover:text-violet-600

            active:scale-95

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <ArrowLeft
            size={19}
            strokeWidth={2}
          />

          Back
        </button>


        {/* ===================================================
            MAIN CARD
        =================================================== */}

        <div
          className="
            relative

            overflow-hidden

            rounded-[32px]

            border
            border-white/80

            bg-white/85

            p-6

            shadow-[0_20px_70px_rgba(15,23,42,0.10)]

            backdrop-blur-2xl

            sm:p-8
          "
        >

          {/* =================================================
              DECORATIVE LAVENDER LIGHT
          ================================================= */}

          <div
            className="
              pointer-events-none

              absolute
              -right-20
              -top-20

              h-48
              w-48

              rounded-full

              bg-violet-300/30

              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none

              absolute
              -bottom-24
              -left-20

              h-52
              w-52

              rounded-full

              bg-indigo-300/20

              blur-3xl
            "
          />


          {/* =================================================
              CONTENT
          ================================================= */}

          <div
            className="
              relative
              z-10
            "
          >

            {/* =================================================
                ICON
            ================================================= */}

            <div
              className="
                flex
                h-16
                w-16

                items-center
                justify-center

                rounded-[20px]

                bg-gradient-to-br
                from-violet-600
                to-violet-400

                text-white

                shadow-lg
                shadow-violet-500/25
              "
            >
              <KeyRound
                size={27}
                strokeWidth={2}
              />
            </div>


            {/* =================================================
                TITLE
            ================================================= */}

            <h1
              className="
                mt-6

                text-2xl
                font-extrabold

                tracking-tight

                text-slate-900

                sm:text-3xl
              "
            >
              Change Password
            </h1>


            <p
              className="
                mt-2

                max-w-[420px]

                text-sm
                leading-6

                text-slate-500
              "
            >
              Create a new password
              for your Re2Buy account.
            </p>


            {/* =================================================
                SECURITY INFO
            ================================================= */}

            <div
              className="
                mt-5

                flex
                items-start
                gap-3

                rounded-2xl

                border
                border-violet-100

                bg-violet-50/70

                px-4
                py-3
              "
            >
              <ShieldCheck
                size={19}
                className="
                  mt-0.5
                  shrink-0
                  text-violet-600
                "
              />

              <p
                className="
                  text-xs
                  leading-5

                  text-violet-700
                "
              >
                Use at least 6 characters
                for your new password.
              </p>
            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={
                handleChangePassword
              }
              className="
                mt-7

                space-y-4
              "
            >

              {/* ===============================================
                  NEW PASSWORD
              =============================================== */}

              <div
                className="
                  relative
                "
              >
                <label
                  htmlFor="new-password"
                  className="
                    mb-2

                    block

                    text-xs
                    font-bold

                    text-slate-600
                  "
                >
                  New Password
                </label>

                <div
                  className="
                    relative
                  "
                >
                  <input
                    id="new-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      password
                    }
                    onChange={(event) =>
                      setPassword(
                        event.target
                          .value
                      )
                    }
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="
                      h-14
                      w-full

                      rounded-2xl

                      border
                      border-slate-200

                      bg-white

                      px-4
                      pr-12

                      text-sm
                      font-medium

                      text-slate-800

                      outline-none

                      shadow-sm

                      transition

                      placeholder:text-slate-400

                      focus:border-violet-400
                      focus:ring-4
                      focus:ring-violet-100

                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      setShowPassword(
                        (value) =>
                          !value
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="
                      absolute
                      right-2
                      top-1/2

                      flex
                      h-10
                      w-10

                      -translate-y-1/2

                      items-center
                      justify-center

                      rounded-full

                      text-slate-500

                      transition

                      hover:bg-slate-100
                      hover:text-slate-800

                      active:scale-90
                    "
                  >
                    {showPassword ? (
                      <EyeOff
                        size={19}
                      />
                    ) : (
                      <Eye
                        size={19}
                      />
                    )}
                  </button>
                </div>
              </div>


              {/* ===============================================
                  CONFIRM PASSWORD
              =============================================== */}

              <div
                className="
                  relative
                "
              >
                <label
                  htmlFor="confirm-password"
                  className="
                    mb-2

                    block

                    text-xs
                    font-bold

                    text-slate-600
                  "
                >
                  Confirm Password
                </label>

                <div
                  className="
                    relative
                  "
                >
                  <input
                    id="confirm-password"
                    type={
                      showConfirm
                        ? "text"
                        : "password"
                    }
                    value={
                      confirmPassword
                    }
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target
                          .value
                      )
                    }
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="
                      h-14
                      w-full

                      rounded-2xl

                      border
                      border-slate-200

                      bg-white

                      px-4
                      pr-12

                      text-sm
                      font-medium

                      text-slate-800

                      outline-none

                      shadow-sm

                      transition

                      placeholder:text-slate-400

                      focus:border-violet-400
                      focus:ring-4
                      focus:ring-violet-100

                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      setShowConfirm(
                        (value) =>
                          !value
                      )
                    }
                    aria-label={
                      showConfirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="
                      absolute
                      right-2
                      top-1/2

                      flex
                      h-10
                      w-10

                      -translate-y-1/2

                      items-center
                      justify-center

                      rounded-full

                      text-slate-500

                      transition

                      hover:bg-slate-100
                      hover:text-slate-800

                      active:scale-90
                    "
                  >
                    {showConfirm ? (
                      <EyeOff
                        size={19}
                      />
                    ) : (
                      <Eye
                        size={19}
                      />
                    )}
                  </button>
                </div>
              </div>


              {/* =================================================
                  MESSAGE
              ================================================= */}

              {message && (
                <div
                  className={`
                    flex
                    items-start
                    gap-2

                    rounded-2xl

                    px-4
                    py-3

                    text-sm
                    font-semibold

                    ${
                      success
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-500"
                    }
                  `}
                >
                  {success && (
                    <CheckCircle2
                      size={18}
                      className="
                        mt-0.5
                        shrink-0
                      "
                    />
                  )}

                  <span>
                    {message}
                  </span>
                </div>
              )}


              {/* =================================================
                  UPDATE BUTTON
              ================================================= */}

              <button
                type="submit"
                disabled={loading}
                className="
                  mt-2

                  flex
                  h-14
                  w-full

                  items-center
                  justify-center

                  rounded-2xl

                  bg-gradient-to-r
                  from-violet-600
                  to-violet-500

                  text-sm
                  font-bold

                  tracking-wide

                  text-white

                  shadow-lg
                  shadow-violet-500/25

                  transition

                  hover:from-violet-700
                  hover:to-violet-600

                  hover:shadow-xl

                  active:scale-[0.99]

                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <span
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <span
                      className="
                        h-5
                        w-5

                        animate-spin

                        rounded-full

                        border-2
                        border-white/30
                        border-t-white
                      "
                    />

                    Updating...
                  </span>
                ) : (
                  "UPDATE PASSWORD"
                )}
              </button>
            </form>

          </div>
        </div>


        {/* ===================================================
            FOOTER TEXT
        =================================================== */}

        <p
          className="
            mt-5

            text-center

            text-[11px]

            leading-5

            text-slate-400
          "
        >
          Your password is securely
          updated through Re2Buy.
        </p>

      </div>
    </div>
  );
}
