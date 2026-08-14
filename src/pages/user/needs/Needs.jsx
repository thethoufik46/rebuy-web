// ============================================================
// src/pages/user/needs/Needs.jsx
// FINAL NEED FORM
// ============================================================

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleStop,
  Loader2,
  Mic,
  Pause,
  Play,
  Send,
  Square,
  X,
} from "lucide-react";

import {
  addNeed,
} from "@/services/need";

import carImage from "@/assets/needs/own board.jpeg";
import bikeImage from "@/assets/needs/bike.webp";
import propertyImage from "@/assets/needs/home.webp";
import electronicsImage from "@/assets/needs/electronics.jpeg";

const TYPES = [
  {
    id: "car",
    title: "Car",
    tamil: "கார்",
    image: carImage,
  },
  {
    id: "bike",
    title: "Bike",
    tamil: "பைக்",
    image: bikeImage,
  },
  {
    id: "property",
    title: "Property",
    tamil: "சொத்து",
    image: propertyImage,
  },
  {
    id: "electronics",
    title: "Electronics",
    tamil: "எலக்ட்ரானிக்ஸ்",
    image: electronicsImage,
  },
];

const TIMELINES = [
  "Immediate",
  "One Week",
  "15 Days",
];

const PAYMENT_TYPES = [
  "Cash",
  "Finance",
];

const BOARD_TYPES = [
  "Own Board",
  "T Board",
];

const PROPERTY_CATEGORIES = [
  "Home",
  "Land",
];

const ELECTRONICS_CATEGORIES = [
  "Mobile",
  "Laptop",
  "PC",
];

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  maxLength,
}) {
  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-semibold text-black/75">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        autoComplete="off"
        className="
          h-12 w-full
          rounded-2xl
          border border-black/10
          bg-white
          px-4
          text-[15px]
          text-black
          outline-none
          transition
          placeholder:text-black/30
          focus:border-black/30
          focus:ring-4
          focus:ring-black/[0.04]
        "
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-semibold text-black/75">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="
            h-12 w-full
            appearance-none
            rounded-2xl
            border border-black/10
            bg-white
            px-4 pr-11
            text-[15px]
            outline-none
            focus:border-black/30
            focus:ring-4
            focus:ring-black/[0.04]
          "
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="
            pointer-events-none
            absolute right-4 top-1/2
            -translate-y-1/2
            text-black/45
          "
        />
      </div>
    </div>
  );
}

function TypeCard({
  item,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative
        overflow-hidden
        rounded-3xl
        border
        text-left
        transition-all
        duration-200
        ${
          selected
            ? "border-black bg-black shadow-xl"
            : "border-black/10 bg-white hover:-translate-y-0.5 hover:shadow-lg"
        }
      `}
    >
      <div className="h-32 w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="
            h-full w-full
            object-cover
            transition
            duration-500
            group-hover:scale-105
          "
        />
      </div>

      <div className="p-4">
        <div
          className={`text-base font-bold ${
            selected
              ? "text-white"
              : "text-black"
          }`}
        >
          {item.title}
        </div>

        <div
          className={`mt-1 text-xs ${
            selected
              ? "text-white/55"
              : "text-black/45"
          }`}
        >
          {item.tamil}
        </div>
      </div>

      {selected && (
        <div
          className="
            absolute right-3 top-3
            flex h-7 w-7
            items-center justify-center
            rounded-full
            bg-white
            text-black
          "
        >
          <Check size={16} />
        </div>
      )}
    </button>
  );
}

export default function Needs() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("car");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] =
    useState("");

  const [model, setModel] =
    useState("");

  const [budget, setBudget] =
    useState("");

  const [paymentType, setPaymentType] =
    useState("Cash");

  const [boardType, setBoardType] =
    useState("Own Board");

  const [timeline, setTimeline] =
    useState("Immediate");

  const [propertyCategory, setPropertyCategory] =
    useState("Home");

  const [propertyLocation, setPropertyLocation] =
    useState("");

  const [electronicsCategory, setElectronicsCategory] =
    useState("Mobile");

  const [description, setDescription] =
    useState("");

  const [audioFile, setAudioFile] =
    useState(null);

  const [audioUrl, setAudioUrl] =
    useState("");

  const [recording, setRecording] =
    useState(false);

  const [audioPaused, setAudioPaused] =
    useState(false);

  const [recordSeconds, setRecordSeconds] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const mediaRecorderRef =
    useRef(null);

  const audioChunksRef =
    useRef([]);

  const audioPreviewRef =
    useRef(null);

  const timerRef =
    useRef(null);

  // ==========================================================
  // CLEANUP
  // ==========================================================

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // ==========================================================
  // RESET TYPE-SPECIFIC FIELDS
  // ==========================================================

  useEffect(() => {
    setModel("");
    setBudget("");
    setPropertyLocation("");
    setDescription("");
  }, [type]);

  // ==========================================================
  // PHONE
  // ==========================================================

  const handlePhone = (value) => {
    const digits =
      value.replace(/\D/g, "");

    setPhone(digits.slice(0, 10));
  };

  // ==========================================================
  // BUDGET
  // ==========================================================

  const handleBudget = (value) => {
    const digits =
      value.replace(/\D/g, "");

    setBudget(digits);
  };

  // ==========================================================
  // BACK
  // ==========================================================

  const goBack = () => {
    if (loading) return;

    if (step === 2) {
      setStep(1);
      setError("");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    window.history.back();
  };

  // ==========================================================
  // STEP 1 VALIDATION
  // ==========================================================

  const validateStep1 = () => {
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError(
        "Please enter a valid 10 digit phone number."
      );
      return false;
    }

    if (!location.trim()) {
      setError(
        "Please enter your location."
      );
      return false;
    }

    return true;
  };

  // ==========================================================
  // STEP 2 VALIDATION
  // ==========================================================

  const validateStep2 = () => {
    setError("");

    if (type === "car") {
      if (!model.trim()) {
        setError(
          "Please enter car model."
        );
        return false;
      }
    }

    if (type === "bike") {
      if (!model.trim()) {
        setError(
          "Please enter bike model."
        );
        return false;
      }
    }

    if (type === "property") {
      if (!propertyLocation.trim()) {
        setError(
          "Please enter preferred property location."
        );
        return false;
      }
    }

    if (!budget) {
      setError(
        "Please enter your budget."
      );
      return false;
    }

    return true;
  };

  // ==========================================================
  // RECORD AUDIO
  // ==========================================================

  const startRecording = async () => {
    try {
      setError("");

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setError(
          "Audio recording is not supported in this browser."
        );
        return;
      }

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl("");
      }

      setAudioFile(null);

      const stream =
        await navigator.mediaDevices.getUserMedia(
          { audio: true }
        );

      const preferredMime =
        MediaRecorder.isTypeSupported(
          "audio/webm;codecs=opus"
        )
          ? "audio/webm;codecs=opus"
          : "audio/webm";

      const recorder =
        new MediaRecorder(
          stream,
          {
            mimeType: preferredMime,
          }
        );

      audioChunksRef.current = [];

      recorder.ondataavailable = (
        event
      ) => {
        if (
          event.data &&
          event.data.size > 0
        ) {
          audioChunksRef.current.push(
            event.data
          );
        }
      };

      recorder.onstop = () => {
        const blob =
          new Blob(
            audioChunksRef.current,
            {
              type:
                recorder.mimeType ||
                "audio/webm",
            }
          );

        const extension =
          blob.type.includes("mp4")
            ? "m4a"
            : "webm";

        const file =
          new File(
            [blob],
            `need-audio-${Date.now()}.${extension}`,
            {
              type:
                blob.type ||
                "audio/webm",
            }
          );

        const url =
          URL.createObjectURL(blob);

        setAudioFile(file);
        setAudioUrl(url);
        setRecording(false);
        setAudioPaused(false);

        stream
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      };

      mediaRecorderRef.current =
        recorder;

      recorder.start();

      setRecording(true);
      setAudioPaused(false);
      setRecordSeconds(0);

      timerRef.current =
        setInterval(() => {
          setRecordSeconds(
            (seconds) =>
              seconds + 1
          );
        }, 1000);
    } catch (err) {
      console.error(
        "Recording error:",
        err
      );

      setError(
        "Microphone permission denied or unavailable."
      );
    }
  };

  // ==========================================================
  // STOP RECORDING
  // ==========================================================

  const stopRecording = () => {
    const recorder =
      mediaRecorderRef.current;

    if (
      recorder &&
      recorder.state !== "inactive"
    ) {
      recorder.stop();
    }

    if (timerRef.current) {
      clearInterval(
        timerRef.current
      );
      timerRef.current = null;
    }
  };

  // ==========================================================
  // PAUSE RECORDING
  // ==========================================================

  const toggleRecordingPause = () => {
    const recorder =
      mediaRecorderRef.current;

    if (!recorder) return;

    if (recorder.state === "recording") {
      recorder.pause();
      setAudioPaused(true);

      if (timerRef.current) {
        clearInterval(
          timerRef.current
        );
        timerRef.current = null;
      }
    } else if (
      recorder.state === "paused"
    ) {
      recorder.resume();
      setAudioPaused(false);

      timerRef.current =
        setInterval(() => {
          setRecordSeconds(
            (seconds) =>
              seconds + 1
          );
        }, 1000);
    }
  };

  // ==========================================================
  // REMOVE AUDIO
  // ==========================================================

  const removeAudio = () => {
    if (recording) {
      stopRecording();
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioUrl("");
    setAudioFile(null);
    setRecordSeconds(0);
    setAudioPaused(false);
  };

  // ==========================================================
  // AUDIO TIME
  // ==========================================================

  const formatSeconds = (seconds) => {
    const min =
      Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");

    const sec =
      (seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${min}:${sec}`;
  };

  // ==========================================================
  // NEXT
  // ==========================================================

  const nextStep = () => {
    if (!validateStep1()) return;

    setStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const submit = async () => {
    if (loading) return;

    if (!validateStep2()) return;

    setLoading(true);
    setError("");

    let car = null;
    let bike = null;
    let property = null;
    let electronics = null;

    if (type === "car") {
      car = {
        model: model.trim(),
        budget: Number(budget) || 0,
        paymentType,
        boardType,
        timeline,
      };
    }

    if (type === "bike") {
      bike = {
        model: model.trim(),
        budget: Number(budget) || 0,
        paymentType,
        timeline,
      };
    }

    if (type === "property") {
      property = {
        category: propertyCategory,
        preferredLocation:
          propertyLocation.trim(),
        budget: Number(budget) || 0,
        timeline,
      };
    }

    if (type === "electronics") {
      electronics = {
        category:
          electronicsCategory,
        budget: Number(budget) || 0,
        timeline,
      };
    }

    const result =
      await addNeed({
        type,
        name,
        phone,
        location,
        description,
        audioFile,
        car,
        bike,
        property,
        electronics,
      });

    setLoading(false);

    if (!result.success) {
      setError(
        result.message ||
          "Request submission failed."
      );
      return;
    }

    // ========================================================
    // SUCCESS → NEEDS LIST
    // ========================================================

    window.location.href =
      "/needs-list";
  };

  // ==========================================================
  // TYPE FIELDS
  // ==========================================================

  const renderTypeFields = () => {
    if (type === "car") {
      return (
        <div className="space-y-5">
          <Field
            label="Car Model"
            value={model}
            onChange={(e) =>
              setModel(e.target.value)
            }
            placeholder="Enter car model"
          />

          <Field
            label="Budget"
            value={budget}
            onChange={(e) =>
              handleBudget(
                e.target.value
              )
            }
            placeholder="Enter budget"
            inputMode="numeric"
          />

          <SelectField
            label="Payment"
            value={paymentType}
            onChange={setPaymentType}
            options={
              PAYMENT_TYPES
            }
          />

          <div>
            <label className="mb-2 block text-sm font-semibold text-black/75">
              Board Type
            </label>

            <div className="grid grid-cols-2 gap-3">
              {BOARD_TYPES.map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setBoardType(
                        item
                      )
                    }
                    className={`
                      rounded-2xl
                      border
                      px-4 py-3
                      text-sm font-semibold
                      transition
                      ${
                        boardType ===
                        item
                          ? "border-black bg-black text-white"
                          : "border-black/10 bg-white text-black hover:bg-black/[0.03]"
                      }
                    `}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>

          <SelectField
            label="Timeline"
            value={timeline}
            onChange={setTimeline}
            options={
              TIMELINES
            }
          />
        </div>
      );
    }

    if (type === "bike") {
      return (
        <div className="space-y-5">
          <Field
            label="Bike Model"
            value={model}
            onChange={(e) =>
              setModel(e.target.value)
            }
            placeholder="Enter bike model"
          />

          <Field
            label="Budget"
            value={budget}
            onChange={(e) =>
              handleBudget(
                e.target.value
              )
            }
            placeholder="Enter budget"
            inputMode="numeric"
          />

          <SelectField
            label="Payment"
            value={paymentType}
            onChange={setPaymentType}
            options={
              PAYMENT_TYPES
            }
          />

          <SelectField
            label="Timeline"
            value={timeline}
            onChange={setTimeline}
            options={
              TIMELINES
            }
          />
        </div>
      );
    }

    if (type === "property") {
      return (
        <div className="space-y-5">
          <SelectField
            label="Property Type"
            value={
              propertyCategory
            }
            onChange={
              setPropertyCategory
            }
            options={
              PROPERTY_CATEGORIES
            }
          />

          <Field
            label="Preferred Location"
            value={
              propertyLocation
            }
            onChange={(e) =>
              setPropertyLocation(
                e.target.value
              )
            }
            placeholder="Enter preferred location"
          />

          <Field
            label="Budget"
            value={budget}
            onChange={(e) =>
              handleBudget(
                e.target.value
              )
            }
            placeholder="Enter budget"
            inputMode="numeric"
          />

          <SelectField
            label="Timeline"
            value={timeline}
            onChange={setTimeline}
            options={
              TIMELINES
            }
          />
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <SelectField
          label="Category"
          value={
            electronicsCategory
          }
          onChange={
            setElectronicsCategory
          }
          options={
            ELECTRONICS_CATEGORIES
          }
        />

        <Field
          label="Budget"
          value={budget}
          onChange={(e) =>
            handleBudget(
              e.target.value
            )
          }
          placeholder="Enter budget"
          inputMode="numeric"
        />

        <SelectField
          label="Timeline"
          value={timeline}
          onChange={setTimeline}
          options={
            TIMELINES
          }
        />
      </div>
    );
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <main
      className="
        min-h-screen
        w-full
        bg-[#eeeefe]
        text-black
      "
    >
      {/* ======================================================
          TOP BAR
      ====================================================== */}

      <header
        className="
          sticky top-0 z-50
          border-b border-black/[0.06]
          bg-[#eeeefe]/90
          backdrop-blur-2xl
        "
      >
        <div
          className="
            flex min-h-[70px]
            w-full items-center
            justify-between
            px-4 sm:px-8
            lg:px-12
            xl:px-16
          "
        >
          <button
            type="button"
            onClick={goBack}
            disabled={loading}
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-full
              border border-black/10
              bg-white
              transition
              hover:bg-black
              hover:text-white
              disabled:opacity-40
            "
            aria-label="Back"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="text-center">
            <div className="text-base font-black sm:text-lg">
              Any Need Please Fill
            </div>

            <div className="mt-0.5 text-[11px] font-medium text-black/45">
              தேவைகளை குறிப்பிடவும்
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              (window.location.href =
                "/needs-list")
            }
            className="
              rounded-2xl
              border border-black/10
              bg-white
              px-4 py-2
              text-center
              shadow-sm
              transition
              hover:bg-black
              hover:text-white
            "
          >
            <div className="text-xs font-bold">
              Needs
            </div>

            <div className="text-[9px] text-black/45 group-hover:text-white/70">
              தேவைகள்
            </div>
          </button>
        </div>
      </header>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <section
        className="
          w-full
          px-4 py-6
          sm:px-8 sm:py-8
          lg:px-12
          xl:px-16
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1500px]
          "
        >
          {/* ==================================================
              PROGRESS
          ================================================== */}

          <div className="mb-6 flex items-center gap-3">
            <div
              className={`
                h-2 flex-1 rounded-full
                ${
                  step >= 1
                    ? "bg-black"
                    : "bg-black/10"
                }
              `}
            />

            <div
              className={`
                h-2 flex-1 rounded-full
                ${
                  step >= 2
                    ? "bg-black"
                    : "bg-black/10"
                }
              `}
            />
          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div
              className="
                mb-5
                rounded-2xl
                border border-red-200
                bg-red-50
                px-4 py-3
                text-sm
                font-medium
                text-red-700
              "
            >
              {error}
            </div>
          )}

          {/* ==================================================
              STEP 1
          ================================================== */}

          {step === 1 && (
            <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.85fr)]">
              <section
                className="
                  rounded-[30px]
                  border border-black/[0.07]
                  bg-white
                  p-5
                  shadow-[0_15px_60px_rgba(15,23,42,0.06)]
                  sm:p-7
                  lg:p-9
                "
              >
                <div className="mb-7">
                  <div className="text-2xl font-black">
                    Choose what you need
                  </div>

                  <div className="mt-1 text-sm text-black/45">
                    உங்களுக்கு தேவையான category-யை தேர்வு செய்யவும்
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {TYPES.map(
                    (item) => (
                      <TypeCard
                        key={item.id}
                        item={item}
                        selected={
                          type ===
                          item.id
                        }
                        onClick={() =>
                          setType(
                            item.id
                          )
                        }
                      />
                    )
                  )}
                </div>
              </section>

              <section
                className="
                  rounded-[30px]
                  border border-black/[0.07]
                  bg-white
                  p-5
                  shadow-[0_15px_60px_rgba(15,23,42,0.06)]
                  sm:p-7
                  lg:p-9
                "
              >
                <div className="mb-7">
                  <div className="text-2xl font-black">
                    Your Information
                  </div>

                  <div className="mt-1 text-sm text-black/45">
                    உங்கள் தகவல்கள்
                  </div>
                </div>

                <div className="space-y-5">
                  <Field
                    label="Name"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    placeholder="Enter your name"
                  />

                  <Field
                    label="Phone Number"
                    value={phone}
                    onChange={(e) =>
                      handlePhone(
                        e.target.value
                      )
                    }
                    placeholder="10 digit mobile number"
                    inputMode="numeric"
                    maxLength={10}
                  />

                  <Field
                    label="Your Location"
                    value={location}
                    onChange={(e) =>
                      setLocation(
                        e.target.value
                      )
                    }
                    placeholder="Enter your location"
                  />

                  <button
                    type="button"
                    onClick={
                      nextStep
                    }
                    className="
                      mt-2
                      flex h-13
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      bg-black
                      px-5
                      py-3.5
                      text-sm
                      font-bold
                      text-white
                      transition
                      hover:opacity-90
                      active:scale-[0.99]
                    "
                  >
                    Continue
                    <ArrowRight
                      size={18}
                    />
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* ==================================================
              STEP 2
          ================================================== */}

          {step === 2 && (
            <section
              className="
                w-full
                rounded-[30px]
                border border-black/[0.07]
                bg-white
                p-5
                shadow-[0_15px_60px_rgba(15,23,42,0.06)]
                sm:p-7
                lg:p-10
              "
            >
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <div className="text-2xl font-black">
                    {TYPES.find(
                      (item) =>
                        item.id ===
                        type
                    )?.title}{" "}
                    Details
                  </div>

                  <div className="mt-1 text-sm text-black/45">
                    தேவையான முழு தகவல்களை உள்ளிடவும்
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setStep(1)
                  }
                  className="
                    hidden items-center
                    gap-2 rounded-xl
                    border border-black/10
                    px-4 py-2
                    text-sm font-semibold
                    sm:flex
                  "
                >
                  <ArrowLeft
                    size={16}
                  />
                  Back
                </button>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  {renderTypeFields()}
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-black/75">
                      Additional Details
                    </label>

                    <textarea
                      value={
                        description
                      }
                      onChange={(e) =>
                        setDescription(
                          e.target.value
                        )
                      }
                      rows={8}
                      placeholder="Tell us anything else you need..."
                      className="
                        min-h-[190px]
                        w-full
                        resize-y
                        rounded-2xl
                        border border-black/10
                        bg-white
                        p-4
                        text-[15px]
                        outline-none
                        placeholder:text-black/30
                        focus:border-black/30
                        focus:ring-4
                        focus:ring-black/[0.04]
                      "
                    />
                  </div>

                  {/* ==========================================
                      AUDIO RECORD
                  ========================================== */}

                  <div
                    className="
                      rounded-3xl
                      border border-black/10
                      bg-[#f7f7fa]
                      p-5
                    "
                  >
                    <div className="mb-4">
                      <div className="text-sm font-bold">
                        Voice Note
                      </div>

                      <div className="mt-1 text-xs text-black/45">
                        குரல் மூலம் கூடுதல் தகவல் சொல்லலாம்
                      </div>
                    </div>

                    {!recording &&
                      !audioFile && (
                        <button
                          type="button"
                          onClick={
                            startRecording
                          }
                          className="
                            flex w-full
                            items-center
                            justify-center
                            gap-3
                            rounded-2xl
                            bg-black
                            px-5 py-4
                            text-sm
                            font-bold
                            text-white
                            transition
                            hover:opacity-90
                          "
                        >
                          <Mic
                            size={19}
                          />
                          Record Voice
                        </button>
                      )}

                    {recording && (
                      <div className="space-y-4">
                        <div
                          className="
                            flex items-center
                            justify-between
                            rounded-2xl
                            bg-white
                            p-4
                          "
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                h-3 w-3
                                animate-pulse
                                rounded-full
                                bg-red-500
                              "
                            />

                            <div>
                              <div className="text-sm font-bold">
                                Recording...
                              </div>

                              <div className="text-xs text-black/45">
                                {
                                  formatSeconds(
                                    recordSeconds
                                  )
                                }
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={
                                toggleRecordingPause
                              }
                              className="
                                flex h-10 w-10
                                items-center
                                justify-center
                                rounded-full
                                bg-black
                                text-white
                              "
                            >
                              {audioPaused ? (
                                <Play
                                  size={16}
                                />
                              ) : (
                                <Pause
                                  size={16}
                                />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={
                                stopRecording
                              }
                              className="
                                flex h-10 w-10
                                items-center
                                justify-center
                                rounded-full
                                bg-red-500
                                text-white
                              "
                            >
                              <Square
                                size={15}
                                fill="currentColor"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {!recording &&
                      audioFile &&
                      audioUrl && (
                        <div className="space-y-3">
                          <audio
                            ref={
                              audioPreviewRef
                            }
                            controls
                            preload="metadata"
                            src={audioUrl}
                            className="w-full"
                            onPlay={() =>
                              setAudioPaused(
                                false
                              )
                            }
                            onPause={() =>
                              setAudioPaused(
                                true
                              )
                            }
                          />

                          <button
                            type="button"
                            onClick={
                              removeAudio
                            }
                            className="
                              flex items-center
                              gap-2
                              text-xs
                              font-semibold
                              text-red-600
                            "
                          >
                            <X
                              size={14}
                            />
                            Remove audio
                          </button>
                        </div>
                      )}
                  </div>

                  {/* ==========================================
                      SUBMIT
                  ========================================== */}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() =>
                        setStep(1)
                      }
                      disabled={loading}
                      className="
                        flex h-13
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        border border-black/10
                        bg-white
                        px-5 py-3.5
                        text-sm
                        font-bold
                        disabled:opacity-40
                      "
                    >
                      <ArrowLeft
                        size={17}
                      />
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={submit}
                      disabled={loading}
                      className="
                        flex h-13
                        flex-[2]
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-black
                        px-5 py-3.5
                        text-sm
                        font-bold
                        text-white
                        transition
                        hover:opacity-90
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {loading ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send
                            size={17}
                          />
                          Submit Request
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}