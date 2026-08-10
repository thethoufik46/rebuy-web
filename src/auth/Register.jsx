import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/services/apiService";

import districtsData from "@/assets/data/tamilnadu_locations.json";

/* =========================================================
   🎥 BACKGROUND VIDEO
========================================================= */

const REGISTER_VIDEO =
  "https://res.cloudinary.com/dtqxc3rmt/video/upload/v1767108059/car_vid_kiee4t.mp4";

/* =========================================================
   REGISTER
========================================================= */

export default function Register() {
  const navigate = useNavigate();

  /* =======================================================
     FORM
  ======================================================= */

  /* =======================================================
     FORM
     -------------------------------------------------------
     Keep register data in sessionStorage so when the user
     opens Terms & Conditions and comes back, the form is
     restored instead of becoming empty.
  ======================================================= */

  const REGISTER_DRAFT_KEY = "re2buy_register_draft";

  const getSavedRegisterDraft = () => {
    try {
      const saved = sessionStorage.getItem(REGISTER_DRAFT_KEY);

      if (!saved) return null;

      const parsed = JSON.parse(saved);

      if (!parsed || typeof parsed !== "object") {
        return null;
      }

      return parsed;
    } catch (error) {
      console.error(
        "❌ register draft restore error 👉",
        error
      );

      return null;
    }
  };

  const savedDraft = getSavedRegisterDraft();

  const [form, setForm] = useState(
    savedDraft?.form || {
      name: "",
      phone: "",
      password: "",
      district: "",
      category: "buyer",
    }
  );

  const [districts, setDistricts] = useState([]);

  const [obscure, setObscure] = useState(true);

  const [agree, setAgree] = useState(
    savedDraft?.agree === true
  );

  const [loading, setLoading] = useState(false);

  /* =======================================================
     LOAD DISTRICTS
  ======================================================= */

  useEffect(() => {
    try {
      const districtList = Object.keys(districtsData || {});
      setDistricts(districtList);
    } catch (error) {
      console.error("❌ loadDistricts error 👉", error);
    }
  }, []);

  /* =======================================================
     SAVE REGISTER DRAFT
     -------------------------------------------------------
     This runs whenever the user changes the form or the
     Terms checkbox. It survives route navigation to Terms.
  ======================================================= */

  useEffect(() => {
    try {
      sessionStorage.setItem(
        REGISTER_DRAFT_KEY,
        JSON.stringify({
          form,
          agree,
        })
      );
    } catch (error) {
      console.error(
        "❌ register draft save error 👉",
        error
      );
    }
  }, [form, agree]);

  /* =======================================================
     CHANGE
  ======================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    /* Phone → only digits, max 10 */
    if (name === "phone") {
      const digits = value
        .replace(/\D/g, "")
        .slice(0, 10);

      setForm((prev) => ({
        ...prev,
        phone: digits,
      }));

      return;
    }

    /* Password → only digits */
    if (name === "password") {
      const digits = value.replace(/\D/g, "");

      setForm((prev) => ({
        ...prev,
        password: digits,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =======================================================
     REGISTER
  ======================================================= */

  const handleRegister = async () => {
    if (loading) return;

    /* Terms */
    if (!agree) {
      alert("Please accept Terms & Conditions");
      return;
    }

    /* Required fields */
    if (
      !form.name.trim() ||
      !form.phone ||
      !form.password ||
      !form.district
    ) {
      alert("All fields required");
      return;
    }

    /* Phone */
    if (form.phone.length !== 10) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    /* Password */
    if (form.password.length < 6) {
      alert("Password must be at least 6 digits");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        phone: form.phone,
        password: form.password,
        category: form.category,
        district: form.district,
        address: "NA",
      };

      const res = await registerUser(payload);

      if (res?.success) {
        /* Registration completed — remove saved draft */
        try {
          sessionStorage.removeItem(
            REGISTER_DRAFT_KEY
          );
        } catch (error) {
          console.error(
            "❌ register draft clear error 👉",
            error
          );
        }

        navigate("/disclaimer", {
          replace: true,
        });
      } else {
        alert(
          res?.message ||
            "Registration failed"
        );
      }
    } catch (err) {
      console.error(
        "❌ Register error 👉",
        err
      );

      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-black
        text-white
      "
    >

      {/* =====================================================
          🎥 VIDEO BACKGROUND
          CLEAR VIDEO — NO FULL PAGE BLUR
      ===================================================== */}

      <video
        src={REGISTER_VIDEO}
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
          🌑 VIDEO OVERLAY
      ===================================================== */}

      <div
        className="
          absolute
          inset-0
          bg-black/25
        "
      />

      {/* =====================================================
          LOGIN BUTTON
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
          onClick={() =>
            navigate("/login")
          }
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
          LOGIN
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
          py-20

          sm:px-6
          sm:py-24

          md:px-8
        "
      >

        {/* ===================================================
            GLASSMORPHISM REGISTER CARD
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
            max-w-[470px]

            overflow-hidden

            rounded-[28px]

            border
            border-white/30

            bg-white/[0.12]

            p-5

            shadow-[0_25px_80px_rgba(0,0,0,0.35)]

            backdrop-blur-2xl

            sm:rounded-[32px]
            sm:p-7

            md:p-8
          "
        >

          {/* =================================================
              GLASS LIGHT EFFECT
          ================================================= */}

          <div
            className="
              pointer-events-none

              absolute
              -left-24
              -top-24

              h-48
              w-48

              rounded-full

              bg-white/10

              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none

              absolute
              -bottom-24
              -right-24

              h-48
              w-48

              rounded-full

              bg-white/10

              blur-3xl
            "
          />

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="relative z-10">

            {/* ===============================================
                TITLE
            =============================================== */}

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
                mb-6
                text-center

                sm:mb-7
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

                  md:text-[40px]
                "
              >
                Create account.
              </h1>

              <p
                className="
                  mt-2
                  text-xs
                  text-white/65

                  sm:text-sm
                "
              >
                Join Re2Buy today
              </p>
            </motion.div>

            {/* ===============================================
                FORM
            =============================================== */}

            <div className="space-y-3.5 sm:space-y-4">

              {/* =============================================
                  NAME
              ============================================= */}

              <AnimatedField delay={0.15}>
                <InputBox
                  placeholder="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </AnimatedField>

              {/* =============================================
                  PHONE
              ============================================= */}

              <AnimatedField delay={0.25}>
                <InputBox
                  placeholder="Phone Number (10 digits)"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  autoComplete="tel"
                />
              </AnimatedField>

              {/* =============================================
                  PASSWORD
              ============================================= */}

              <AnimatedField delay={0.35}>
                <div className="relative">

                  <InputBox
                    placeholder="Password (6+ digits)"
                    name="password"
                    type={
                      obscure
                        ? "password"
                        : "text"
                    }
                    value={form.password}
                    onChange={handleChange}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setObscure(
                        !obscure
                      )
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
                    {obscure
                      ? "👁️"
                      : "🙈"}
                  </button>

                </div>
              </AnimatedField>

              {/* =============================================
                  DISTRICT
              ============================================= */}

              <AnimatedField delay={0.45}>
                <SelectBox
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                >
                  <option value="">
                    Select District
                  </option>

                  {districts.map(
                    (district) => (
                      <option
                        key={district}
                        value={district}
                      >
                        {district}
                      </option>
                    )
                  )}
                </SelectBox>
              </AnimatedField>

              {/* =============================================
                  CATEGORY
              ============================================= */}

              <AnimatedField delay={0.55}>
                <SelectBox
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="buyer">
                    Buyer
                  </option>

                  <option value="seller">
                    Seller
                  </option>

                  <option value="driver">
                    Driver
                  </option>
                </SelectBox>
              </AnimatedField>

              {/* =============================================
                  TERMS
              ============================================= */}

              <AnimatedField delay={0.65}>
                <div
                  className="
                    flex
                    items-center
                    justify-center

                    gap-2.5

                    pt-1

                    text-center
                  "
                >

                  <button
                    type="button"
                    onClick={() =>
                      setAgree(
                        !agree
                      )
                    }
                    className={`
                      flex
                      h-5
                      w-5
                      shrink-0

                      items-center
                      justify-center

                      rounded-md

                      border

                      transition

                      ${
                        agree
                          ? "border-white bg-white text-black"
                          : "border-white/50 bg-white/10"
                      }
                    `}
                    aria-label="Accept terms"
                  >
                    {agree && (
                      <span className="text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/terms"
                      )
                    }
                    className="
                      text-[11px]

                      text-white/75

                      transition

                      hover:text-white

                      sm:text-xs
                    "
                  >
                    I agree to the{" "}
                    <span
                      className="
                        font-semibold
                        underline
                        underline-offset-2
                      "
                    >
                      Terms & Conditions
                    </span>
                  </button>

                </div>
              </AnimatedField>

              {/* =============================================
                  SEND OTP
              ============================================= */}

              <AnimatedField delay={0.75}>
                <div
                  className="
                    flex
                    justify-center

                    pt-2
                  "
                >
                  <button
                    type="button"
                    onClick={
                      handleRegister
                    }
                    disabled={
                      !agree ||
                      loading
                    }
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
                      tracking-[0.14em]

                      text-black

                      shadow-xl

                      transition

                      hover:scale-105
                      hover:bg-white
                      hover:shadow-2xl

                      active:scale-95

                      disabled:cursor-not-allowed
                      disabled:opacity-40
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
                      "SEND OTP"
                    )}
                  </button>
                </div>
              </AnimatedField>

            </div>

            {/* =================================================
                BOTTOM LOGIN
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
                delay: 0.9,
              }}
              className="
                mt-6

                border-t
                border-white/15

                pt-4

                text-center
              "
            >
              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="
                  text-[11px]

                  text-white/65

                  transition

                  hover:text-white

                  sm:text-xs
                "
              >
                Already have an account?{" "}
                <span
                  className="
                    font-semibold
                    text-white/90
                  "
                >
                  Login
                </span>
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
   ANIMATED FIELD
========================================================= */

function AnimatedField({
  children,
  delay = 0,
}) {
  return (
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
        duration: 0.55,
        delay,
      }}
    >
      {children}
    </motion.div>
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
        h-13
        min-h-[52px]
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

        sm:min-h-[56px]
      "
    />
  );
}

/* =========================================================
   SELECT BOX
========================================================= */

function SelectBox({
  children,
  ...props
}) {
  return (
    <select
      {...props}
      className="
        min-h-[52px]
        w-full

        cursor-pointer

        appearance-none

        rounded-2xl

        border
        border-white/30

        bg-white/85

        px-5
        pr-10

        font-medium

        text-black

        shadow-lg

        outline-none

        backdrop-blur-xl

        transition

        focus:border-white/60
        focus:bg-white/95

        focus:ring-2
        focus:ring-white/20

        sm:min-h-[56px]
      "
    >
      {children}
    </select>
  );
}