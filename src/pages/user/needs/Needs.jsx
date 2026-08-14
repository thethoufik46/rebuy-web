// src/pages/user/needs/Needs.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaCar,
  FaMotorcycle,
  FaHome,
  FaMobileAlt,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaCreditCard,
  FaCheck,
  FaChevronDown,
  FaClipboardList,
} from "react-icons/fa";

import { addNeed } from "@/services/need";

/* =========================================================
   TYPE CONFIG
========================================================= */

const TYPE_CONFIG = {
  car: {
    label: "Car",
    tamil: "கார்",
    icon: FaCar,
  },

  bike: {
    label: "Bike",
    tamil: "பைக்",
    icon: FaMotorcycle,
  },

  property: {
    label: "Property",
    tamil: "சொத்து",
    icon: FaHome,
  },

  electronics: {
    label: "Electronics",
    tamil: "எலக்ட்ரானிக்ஸ்",
    icon: FaMobileAlt,
  },
};

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
  {
    value: "Own Board",
    title: "Own",
    subtitle: "Private",
  },
  {
    value: "T Board",
    title: "Taxi",
    subtitle: "Commercial",
  },
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

/* =========================================================
   HELPERS
========================================================= */

function clean(value) {
  return String(value ?? "").trim();
}

function createEmptyForm() {
  return {
    type: "car",

    name: "",
    phone: "",
    location: "",

    model: "",
    budget: "",

    paymentType: "Cash",
    boardType: "Own Board",
    timeline: "Immediate",

    propertyCategory: "Home",
    propertyLocation: "",

    electronicsCategory: "Mobile",

    description: "",
  };
}

/* =========================================================
   PAGE
========================================================= */

export default function Needs() {
  const navigate = useNavigate();

  const [form, setForm] = useState(createEmptyForm);

  const [loading, setLoading] = useState(false);

  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const selectedType =
    TYPE_CONFIG[form.type] || TYPE_CONFIG.car;

  const SelectedIcon = selectedType.icon;

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  function updateField(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  /* =======================================================
     CHANGE TYPE
  ======================================================= */

  function changeType(type) {
    setForm((prev) => ({
      ...prev,
      type,
      model: "",
      budget: "",
      propertyLocation: "",
    }));

    setShowTypeMenu(false);
    clearMessage();
  }

  /* =======================================================
     MESSAGE
  ======================================================= */

  function clearMessage() {
    setMessage({
      type: "",
      text: "",
    });
  }

  function showError(text) {
    setMessage({
      type: "error",
      text,
    });
  }

  function showSuccess(text) {
    setMessage({
      type: "success",
      text,
    });
  }

  /* =======================================================
     VALIDATION
  ======================================================= */

  function validate() {
    if (!clean(form.name)) {
      showError("Please enter your name.");
      return false;
    }

    if (!clean(form.phone)) {
      showError("Please enter your phone number.");
      return false;
    }

    if (!clean(form.location)) {
      showError("Please enter your location.");
      return false;
    }

    if (
      form.type === "property" &&
      !clean(form.propertyLocation)
    ) {
      showError("Please enter your preferred property location.");
      return false;
    }

    if (
      form.type === "car" &&
      !clean(form.model)
    ) {
      showError("Please enter the car model.");
      return false;
    }

    if (
      form.type === "bike" &&
      !clean(form.model)
    ) {
      showError("Please enter the bike model.");
      return false;
    }

    if (!clean(form.budget)) {
      showError("Please enter your budget.");
      return false;
    }

    return true;
  }

  /* =======================================================
     BUILD PAYLOAD
  ======================================================= */

  function buildPayload() {
    let car = null;
    let bike = null;
    let property = null;
    let electronics = null;

    const budget =
      Number(
        String(form.budget).replace(/[^0-9]/g, "")
      ) || 0;

    if (form.type === "car") {
      car = {
        model: clean(form.model),
        budget,
        paymentType: form.paymentType,
        boardType: form.boardType,
        timeline: form.timeline,
      };
    }

    if (form.type === "bike") {
      bike = {
        model: clean(form.model),
        budget,
        paymentType: form.paymentType,
        timeline: form.timeline,
      };
    }

    if (form.type === "property") {
      property = {
        category: form.propertyCategory,
        preferredLocation: clean(
          form.propertyLocation
        ),
        budget,
        timeline: form.timeline,
      };
    }

    if (form.type === "electronics") {
      electronics = {
        category: form.electronicsCategory,
        budget,
        timeline: form.timeline,
      };
    }

    return {
      type: form.type,

      name: clean(form.name),
      phone: clean(form.phone),
      location: clean(form.location),

      description: clean(form.description),

      audioNote: null,

      car,
      bike,
      property,
      electronics,
    };
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    clearMessage();

    if (!validate()) return;

    setLoading(true);

    try {
      const payload = buildPayload();

      const result = await addNeed(payload);

      if (result.success) {
        showSuccess(
          "Your request has been submitted successfully."
        );

        setForm(createEmptyForm());

        setTimeout(() => {
          navigate("/needs");
        }, 700);
      } else {
        showError(
          result.message ||
            "Post failed. Please try again."
        );
      }
    } catch (error) {
      console.error(error);

      showError(
        error?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     INPUT
  ======================================================= */

  function Input({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    icon: Icon,
  }) {
    return (
      <div className="space-y-1.5">
        <label className="px-1 text-xs font-semibold text-black/65">
          {label}
        </label>

        <div
          className="
            flex min-h-[50px]
            items-center gap-3
            rounded-2xl
            border border-white/80
            bg-white/65
            px-4
            shadow-[0_4px_20px_rgba(15,23,42,0.04)]
            backdrop-blur-xl
            transition
            focus-within:border-black/20
            focus-within:bg-white/85
          "
        >
          {Icon && (
            <Icon
              className="shrink-0 text-black/45"
              size={15}
            />
          )}

          <input
            type={type}
            value={value}
            onChange={(e) =>
              onChange(e.target.value)
            }
            placeholder={placeholder}
            className="
              min-w-0 flex-1
              bg-transparent
              text-sm font-medium
              text-black
              outline-none
              placeholder:text-black/35
            "
          />
        </div>
      </div>
    );
  }

  /* =======================================================
     SELECT
  ======================================================= */

  function SelectBox({
    label,
    value,
    options,
    onChange,
    icon: Icon,
  }) {
    return (
      <div className="space-y-1.5">
        <label className="px-1 text-xs font-semibold text-black/65">
          {label}
        </label>

        <div className="relative">
          <select
            value={value}
            onChange={(e) =>
              onChange(e.target.value)
            }
            className="
              min-h-[50px]
              w-full
              appearance-none
              rounded-2xl
              border border-white/80
              bg-white/65
              px-11 pr-10
              text-sm font-semibold
              text-black
              outline-none
              shadow-[0_4px_20px_rgba(15,23,42,0.04)]
              backdrop-blur-xl
              transition
              focus:border-black/20
              focus:bg-white
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

          {Icon && (
            <Icon
              size={15}
              className="
                pointer-events-none
                absolute left-4 top-1/2
                -translate-y-1/2
                text-black/45
              "
            />
          )}

          <FaChevronDown
            size={11}
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

  /* =======================================================
     TYPE SELECTOR
  ======================================================= */

  function TypeSelector() {
    return (
      <div className="relative">
        <label className="mb-1.5 block px-1 text-xs font-semibold text-black/65">
          Type
        </label>

        <button
          type="button"
          onClick={() =>
            setShowTypeMenu((prev) => !prev)
          }
          className="
            flex min-h-[58px]
            w-full items-center
            gap-3 rounded-2xl
            border border-white/80
            bg-white/70
            px-4
            text-left
            shadow-[0_4px_20px_rgba(15,23,42,0.04)]
            backdrop-blur-xl
            transition
            hover:bg-white/85
            active:scale-[0.995]
          "
        >
          <div
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-xl bg-black
              text-white
            "
          >
            <SelectedIcon size={15} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold">
              {selectedType.label}
            </div>

            <div className="text-[10px] text-black/45">
              {selectedType.tamil}
            </div>
          </div>

          <FaChevronDown
            size={11}
            className="text-black/45"
          />
        </button>

        {showTypeMenu && (
          <div
            className="
              absolute left-0 right-0
              top-[82px] z-50
              overflow-hidden
              rounded-2xl
              border border-black/[0.06]
              bg-white/95
              p-1.5
              shadow-[0_18px_50px_rgba(15,23,42,0.16)]
              backdrop-blur-2xl
            "
          >
            {Object.entries(TYPE_CONFIG).map(
              ([key, config]) => {
                const Icon = config.icon;
                const selected =
                  form.type === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      changeType(key)
                    }
                    className={`
                      flex w-full items-center
                      gap-3 rounded-xl
                      px-3 py-3
                      text-left
                      transition
                      ${
                        selected
                          ? "bg-black text-white"
                          : "hover:bg-black/[0.05]"
                      }
                    `}
                  >
                    <div
                      className={`
                        flex h-8 w-8
                        items-center justify-center
                        rounded-lg
                        ${
                          selected
                            ? "bg-white/15"
                            : "bg-black/[0.05]"
                        }
                      `}
                    >
                      <Icon size={14} />
                    </div>

                    <div className="flex-1">
                      <div className="text-xs font-bold">
                        {config.label}
                      </div>

                      <div
                        className={`
                          text-[9px]
                          ${
                            selected
                              ? "text-white/60"
                              : "text-black/40"
                          }
                        `}
                      >
                        {config.tamil}
                      </div>
                    </div>

                    {selected && (
                      <FaCheck size={11} />
                    )}
                  </button>
                );
              }
            )}
          </div>
        )}
      </div>
    );
  }

  /* =======================================================
     BOARD SELECTOR
  ======================================================= */

  function BoardSelector() {
    return (
      <div className="space-y-1.5">
        <label className="px-1 text-xs font-semibold text-black/65">
          Board Type
        </label>

        <div className="grid grid-cols-2 gap-2.5">
          {BOARD_TYPES.map((board) => {
            const selected =
              form.boardType === board.value;

            return (
              <button
                key={board.value}
                type="button"
                onClick={() =>
                  updateField(
                    "boardType",
                    board.value
                  )
                }
                className={`
                  rounded-2xl border
                  px-3 py-3
                  text-left
                  transition
                  ${
                    selected
                      ? "border-black bg-black text-white shadow-lg"
                      : "border-white/80 bg-white/65 text-black hover:bg-white"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  {board.value === "Own Board" ? (
                    <FaUser size={13} />
                  ) : (
                    <FaCar size={13} />
                  )}

                  <span className="text-xs font-bold">
                    {board.title}
                  </span>
                </div>

                <div
                  className={`
                    mt-1 text-[9px]
                    ${
                      selected
                        ? "text-white/55"
                        : "text-black/40"
                    }
                  `}
                >
                  {board.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* =======================================================
     TYPE FIELDS
  ======================================================= */

  function TypeFields() {
    if (form.type === "car") {
      return (
        <div className="space-y-3">
          <Input
            label="Car Model"
            value={form.model}
            onChange={(value) =>
              updateField("model", value)
            }
            placeholder="e.g. Toyota Innova"
            icon={FaCar}
          />

          <Input
            label="Budget"
            value={form.budget}
            onChange={(value) =>
              updateField("budget", value)
            }
            placeholder="e.g. 800000"
            type="number"
            icon={FaMoneyBillWave}
          />

          <SelectBox
            label="Payment"
            value={form.paymentType}
            options={PAYMENT_TYPES}
            onChange={(value) =>
              updateField(
                "paymentType",
                value
              )
            }
            icon={FaCreditCard}
          />

          <BoardSelector />

          <SelectBox
            label="Timeline"
            value={form.timeline}
            options={TIMELINES}
            onChange={(value) =>
              updateField(
                "timeline",
                value
              )
            }
            icon={FaClock}
          />
        </div>
      );
    }

    if (form.type === "bike") {
      return (
        <div className="space-y-3">
          <Input
            label="Bike Model"
            value={form.model}
            onChange={(value) =>
              updateField("model", value)
            }
            placeholder="e.g. Yamaha R15"
            icon={FaMotorcycle}
          />

          <Input
            label="Budget"
            value={form.budget}
            onChange={(value) =>
              updateField("budget", value)
            }
            placeholder="e.g. 150000"
            type="number"
            icon={FaMoneyBillWave}
          />

          <SelectBox
            label="Payment"
            value={form.paymentType}
            options={PAYMENT_TYPES}
            onChange={(value) =>
              updateField(
                "paymentType",
                value
              )
            }
            icon={FaCreditCard}
          />

          <SelectBox
            label="Timeline"
            value={form.timeline}
            options={TIMELINES}
            onChange={(value) =>
              updateField(
                "timeline",
                value
              )
            }
            icon={FaClock}
          />
        </div>
      );
    }

    if (form.type === "property") {
      return (
        <div className="space-y-3">
          <SelectBox
            label="Category"
            value={form.propertyCategory}
            options={PROPERTY_CATEGORIES}
            onChange={(value) =>
              updateField(
                "propertyCategory",
                value
              )
            }
            icon={FaHome}
          />

          <Input
            label="Preferred Location"
            value={form.propertyLocation}
            onChange={(value) =>
              updateField(
                "propertyLocation",
                value
              )
            }
            placeholder="e.g. Thanjavur"
            icon={FaMapMarkerAlt}
          />

          <Input
            label="Budget"
            value={form.budget}
            onChange={(value) =>
              updateField("budget", value)
            }
            placeholder="e.g. 5000000"
            type="number"
            icon={FaMoneyBillWave}
          />

          <SelectBox
            label="Timeline"
            value={form.timeline}
            options={TIMELINES}
            onChange={(value) =>
              updateField(
                "timeline",
                value
              )
            }
            icon={FaClock}
          />
        </div>
      );
    }

    if (form.type === "electronics") {
      return (
        <div className="space-y-3">
          <SelectBox
            label="Category"
            value={form.electronicsCategory}
            options={ELECTRONICS_CATEGORIES}
            onChange={(value) =>
              updateField(
                "electronicsCategory",
                value
              )
            }
            icon={FaMobileAlt}
          />

          <Input
            label="Budget"
            value={form.budget}
            onChange={(value) =>
              updateField("budget", value)
            }
            placeholder="e.g. 50000"
            type="number"
            icon={FaMoneyBillWave}
          />

          <SelectBox
            label="Timeline"
            value={form.timeline}
            options={TIMELINES}
            onChange={(value) =>
              updateField(
                "timeline",
                value
              )
            }
            icon={FaClock}
          />
        </div>
      );
    }

    return null;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-[#E9E9FF]
        px-3 py-4
        sm:px-5
        lg:px-8
      "
    >
      <div className="mx-auto w-full max-w-4xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="mb-4 flex items-center justify-between">

          {/* BACK */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-full
              bg-white/70
              text-black
              shadow-sm
              backdrop-blur-xl
              transition
              hover:bg-white
              active:scale-95
            "
            aria-label="Back"
          >
            <FaArrowLeft size={14} />
          </button>

          {/* TITLE */}
          <div className="text-center">
            <h1 className="text-base font-bold tracking-tight">
              Any Need Please Fill
            </h1>

            <p className="mt-0.5 text-[10px] font-medium text-black/50">
              தேவைகளை குறிப்பிடவும்
            </p>
          </div>

          {/* =================================================
              NEEDS LIST BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() => navigate("/needs")}
            aria-label="Open Needs List"
            className="
              group
              flex items-center gap-2
              rounded-2xl
              border border-white
              bg-white/70
              px-3 py-2
              text-left
              shadow-sm
              backdrop-blur-xl
              transition-all duration-200
              hover:bg-white
              hover:shadow-md
              active:scale-95
            "
          >
            <div
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-xl
                bg-black
                text-white
                transition-transform duration-200
                group-hover:scale-105
              "
            >
              <FaClipboardList size={13} />
            </div>

            <div className="min-w-0">
              <div className="text-[11px] font-bold leading-none">
                Needs
              </div>

              <div className="mt-1 text-[8px] font-medium text-black/45">
                தேவைகள்
              </div>
            </div>
          </button>
        </header>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="
            rounded-[28px]
            border border-white/70
            bg-white/30
            p-4
            shadow-[0_12px_45px_rgba(15,23,42,0.06)]
            backdrop-blur-2xl
            sm:p-6
          "
        >
          <div className="space-y-4">

            {/* BASIC INFO */}

            <div className="grid gap-3 sm:grid-cols-2">

              <Input
                label="Name"
                value={form.name}
                onChange={(value) =>
                  updateField("name", value)
                }
                placeholder="Your name"
                icon={FaUser}
              />

              <Input
                label="Phone"
                value={form.phone}
                onChange={(value) =>
                  updateField("phone", value)
                }
                placeholder="Your phone number"
                type="tel"
                icon={FaPhone}
              />

            </div>

            <Input
              label="Your Location"
              value={form.location}
              onChange={(value) =>
                updateField(
                  "location",
                  value
                )
              }
              placeholder="Your current location"
              icon={FaMapMarkerAlt}
            />

            {/* TYPE */}

            <TypeSelector />

            {/* TYPE FIELDS */}

            <TypeFields />

            {/* DESCRIPTION */}

            <div className="space-y-1.5">

              <label className="px-1 text-xs font-semibold text-black/65">
                Additional Details
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  updateField(
                    "description",
                    e.target.value
                  )
                }
                rows={6}
                placeholder="Additional details..."
                className="
                  w-full resize-none
                  rounded-2xl
                  border border-white/80
                  bg-white/65
                  px-4 py-3
                  text-sm font-medium
                  text-black
                  outline-none
                  shadow-[0_4px_20px_rgba(15,23,42,0.04)]
                  backdrop-blur-xl
                  placeholder:text-black/35
                  transition
                  focus:border-black/20
                  focus:bg-white
                "
              />

            </div>

            {/* MESSAGE */}

            {message.text && (
              <div
                className={`
                  rounded-2xl
                  px-4 py-3
                  text-xs font-semibold
                  ${
                    message.type === "success"
                      ? "bg-green-500/10 text-green-700"
                      : "bg-red-500/10 text-red-600"
                  }
                `}
              >
                {message.text}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="
                flex h-[52px]
                w-full items-center
                justify-center
                gap-2
                rounded-2xl
                bg-black
                text-sm font-bold
                text-white
                shadow-[0_10px_30px_rgba(0,0,0,0.16)]
                transition
                hover:bg-black/90
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <span
                    className="
                      h-4 w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-white/30
                      border-t-white
                    "
                  />

                  Submitting...
                </>
              ) : (
                <>
                  Submit
                  <FaCheck size={12} />
                </>
              )}
            </button>

          </div>
        </form>

      </div>
    </main>
  );
}