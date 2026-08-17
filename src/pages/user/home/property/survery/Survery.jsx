// FINAL FULL CODE
// src/pages/user/home/property/survery/Survery.jsx
//
// After successful form submit:
// → /survey-list
//
// Existing premium glass UI + Leaflet map + 2-step form preserved.

import React, { useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
  MapPin,
  Ruler,
  Send,
  ShieldCheck,
} from "lucide-react";

import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { addSurvey } from "@/services/survey";
import locations from "@/assets/data/tamilnadu_locations.json";

/* ============================================================
   LEAFLET ICON FIX
============================================================ */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* ============================================================
   DEFAULT MAP CENTER
============================================================ */

const DEFAULT_CENTER = [11.1271, 78.6569];

/* ============================================================
   OPTIONS
============================================================ */

const PROPERTY_TYPES = [
  "Residential Plot - வீட்டு மனை",
  "Agricultural Land - விவசாய நிலம்",
  "Vacant Land - காலி நிலம்",
  "House / Building - வீடு / கட்டிடம்",
  "Commercial Property - வணிக சொத்து",
  "Layout / Plot - லேஅவுட் / மனை",
  "Other - மற்றவை",
];

const SURVEY_TYPES = [
  "Land Measurement - நில அளவீடு",
  "Boundary Measurement - எல்லை அளவீடு",
  "Plot Measurement - மனை அளவீடு",
  "Site Measurement - இட அளவீடு",
  "Building Measurement - கட்டிட அளவீடு",
  "Full Property Survey - முழு சொத்து சர்வே",
  "Other - மற்றவை",
];

const AREA_UNITS = [
  "Sq.ft - சதுர அடி",
  "Cent - சென்ட்",
  "Ground - கிரவுண்ட்",
  "Acre - ஏக்கர்",
  "Hectare - ஹெக்டேர்",
];

const BOUNDARY_STATUS = [
  "Boundary Clear - எல்லை தெளிவாக உள்ளது",
  "Boundary Unclear - எல்லை தெளிவாக இல்லை",
  "Boundary Issue - எல்லை பிரச்சனை உள்ளது",
  "Not Sure - தெரியவில்லை",
];

const REQUIREMENTS = [
  "Before Buying - வாங்குவதற்கு முன்",
  "For Sale - விற்பனைக்காக",
  "Boundary Check - எல்லை சரிபார்ப்பு",
  "Construction - கட்டுமானத்திற்காக",
  "Property Division - சொத்து பிரிப்புக்கு",
  "Document Related - ஆவணம் தொடர்பாக",
  "General Measurement - பொதுவான அளவீடு",
  "Other - மற்றவை",
];

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  tamil,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  maxLength,
  required = false,
}) {
  return (
    <div className="w-full">
      <label className="mb-2 block">
        <span className="text-sm font-bold text-[#171717]">
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </span>

        {tamil && (
          <span className="ml-2 text-xs font-medium text-gray-500">
            {tamil}
          </span>
        )}
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
          h-12
          w-full
          rounded-2xl
          border
          border-white/80
          bg-white/80
          px-4
          text-[15px]
          font-medium
          text-[#171717]
          outline-none
          backdrop-blur-xl
          transition
          placeholder:text-gray-400
          focus:border-violet-400
          focus:ring-4
          focus:ring-violet-500/10
        "
      />
    </div>
  );
}

/* ============================================================
   SELECT
============================================================ */

function SelectField({
  label,
  tamil,
  value,
  onChange,
  options,
}) {
  return (
    <div className="w-full">
      <label className="mb-2 block">
        <span className="text-sm font-bold text-[#171717]">
          {label}
        </span>

        {tamil && (
          <span className="ml-2 text-xs font-medium text-gray-500">
            {tamil}
          </span>
        )}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            h-12
            w-full
            appearance-none
            rounded-2xl
            border
            border-white/80
            bg-white/80
            px-4
            pr-11
            text-[14px]
            font-medium
            text-[#171717]
            outline-none
            backdrop-blur-xl
            focus:border-violet-400
            focus:ring-4
            focus:ring-violet-500/10
          "
        >
          <option value="">
            Select / தேர்வு செய்யவும்
          </option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="
            pointer-events-none
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-500
          "
        />
      </div>
    </div>
  );
}

/* ============================================================
   MAP CLICK HANDLER
============================================================ */

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect(
        event.latlng.lat,
        event.latlng.lng
      );
    },
  });

  return null;
}

/* ============================================================
   MAP CENTER
============================================================ */

function MapCenterController({ position }) {
  const map = useMap();

  React.useEffect(() => {
    if (!position) return;

    map.flyTo(position, 16, {
      duration: 0.7,
    });
  }, [position, map]);

  return null;
}

/* ============================================================
   MAP PICKER
============================================================ */

function MapLocationPicker({
  latitude,
  longitude,
  onLocationChange,
}) {
  const [
    locationLoading,
    setLocationLoading,
  ] = useState(false);

  const [
    locationError,
    setLocationError,
  ] = useState("");

  const position =
    latitude !== "" &&
    longitude !== "" &&
    Number.isFinite(Number(latitude)) &&
    Number.isFinite(Number(longitude))
      ? [
          Number(latitude),
          Number(longitude),
        ]
      : null;

  const handleSelect = (lat, lng) => {
    setLocationError("");

    onLocationChange(lat, lng);
  };

  const useCurrentLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(
        "Location support is not available in this browser."
      );

      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (location) => {
        onLocationChange(
          location.coords.latitude,
          location.coords.longitude
        );

        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);

        setLocationError(
          "Location permission கிடைக்கவில்லை. Browser location permission allow செய்யவும்."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div
      className="
        rounded-3xl
        border
        border-white/70
        bg-white/55
        p-4
        shadow-[0_15px_50px_rgba(91,33,182,0.08)]
        backdrop-blur-2xl
        sm:p-5
      "
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            from-violet-600
            via-blue-500
            to-cyan-500
            text-white
          "
        >
          <MapPin size={21} />
        </div>

        <div>
          <div className="text-sm font-black">
            Property Location
          </div>

          <div className="mt-1 text-xs text-gray-500">
            சொத்து இருக்கும் இடத்தை map-ல் pin செய்யவும்
          </div>
        </div>
      </div>

      <div
        className="
          relative
          h-[280px]
          overflow-hidden
          rounded-[24px]
          border
          border-white
          bg-violet-100
          sm:h-[330px]
        "
      >
        <MapContainer
          center={position || DEFAULT_CENTER}
          zoom={position ? 16 : 7}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler
            onSelect={handleSelect}
          />

          {position && (
            <>
              <Marker
                position={position}
                draggable
                eventHandlers={{
                  dragend: (event) => {
                    const marker =
                      event.target;

                    const pos =
                      marker.getLatLng();

                    onLocationChange(
                      pos.lat,
                      pos.lng
                    );
                  },
                }}
              />

              <MapCenterController
                position={position}
              />
            </>
          )}
        </MapContainer>

        {!position && (
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              z-[500]
              -translate-x-1/2
              -translate-y-1/2
            "
          >
            <div
              className="
                rounded-2xl
                border
                border-white
                bg-white/90
                px-5
                py-4
                text-center
                shadow-xl
                backdrop-blur-xl
              "
            >
              <MapPin
                size={24}
                className="mx-auto mb-1 text-violet-600"
              />

              <div className="whitespace-nowrap text-xs font-bold">
                Tap the map to place pin
              </div>

              <div className="mt-1 whitespace-nowrap text-[10px] text-gray-500">
                Map-ல் இடத்தை tap செய்யவும்
              </div>
            </div>
          </div>
        )}

        {position && (
          <div
            className="
              absolute
              left-3
              top-3
              z-[500]
              rounded-full
              bg-white/90
              px-3
              py-2
              text-[11px]
              font-bold
              text-green-700
              shadow-lg
              backdrop-blur-xl
            "
          >
            ✓ Location Selected
          </div>
        )}
      </div>

      {position && (
        <div
          className="
            mt-3
            rounded-2xl
            bg-green-500/5
            px-4
            py-3
          "
        >
          <div className="text-xs font-bold text-green-700">
            ✓ Location selected

            <span className="ml-2 font-medium">
              / இடம் தேர்வு செய்யப்பட்டது
            </span>
          </div>

          <div className="mt-1 text-[11px] text-gray-500">
            {Number(latitude).toFixed(6)}
            {" , "}
            {Number(longitude).toFixed(6)}
          </div>
        </div>
      )}

      {locationError && (
        <div
          className="
            mt-3
            rounded-xl
            bg-red-500/5
            px-3
            py-2
            text-xs
            font-semibold
            text-red-600
          "
        >
          {locationError}
        </div>
      )}

      <button
        type="button"
        onClick={useCurrentLocation}
        disabled={locationLoading}
        className="
          mt-4
          flex
          min-h-12
          w-full
          items-center
          justify-center
          gap-2
          rounded-2xl
          border
          border-violet-500/15
          bg-white/80
          px-4
          py-3
          text-sm
          font-bold
          text-violet-700
          transition
          hover:bg-white
          disabled:opacity-60
        "
      >
        {locationLoading ? (
          <>
            <Loader2
              size={17}
              className="animate-spin"
            />

            Getting Location...
          </>
        ) : (
          <>
            <MapPin size={17} />

            Use My Current Location
          </>
        )}
      </button>

      <div className="mt-3 text-center text-[10px] text-gray-500">
        Map-ல் tap செய்து pin வைக்கலாம் • Pin-ஐ drag செய்தும் location மாற்றலாம்
      </div>
    </div>
  );
}

/* ============================================================
   MAIN SURVEY
============================================================ */

export default function Survey() {
  const [step, setStep] = useState(1);

  /* ==========================================================
     USER
  ========================================================== */

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [district, setDistrict] = useState("");

  /* ==========================================================
     LOCATION
  ========================================================== */

  const [latitude, setLatitude] = useState("");

  const [longitude, setLongitude] = useState("");

  /* ==========================================================
     SURVEY
  ========================================================== */

  const [propertyType, setPropertyType] =
    useState("");

  const [surveyType, setSurveyType] =
    useState("");

  const [approximateArea, setApproximateArea] =
    useState("");

  const [areaUnit, setAreaUnit] =
    useState("");

  const [surveyNumber, setSurveyNumber] =
    useState("");

  const [subdivisionNumber, setSubdivisionNumber] =
    useState("");

  const [pattaNumber, setPattaNumber] =
    useState("");

  const [boundaryStatus, setBoundaryStatus] =
    useState("");

  const [requirement, setRequirement] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [preferredDate, setPreferredDate] =
    useState("");

  const [preferredTime, setPreferredTime] =
    useState("");

  /* ==========================================================
     UI
  ========================================================== */

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  /* ==========================================================
     DISTRICTS
  ========================================================== */

  const districts = useMemo(() => {
    if (
      !locations ||
      typeof locations !== "object"
    ) {
      return [];
    }

    if (Array.isArray(locations)) {
      return locations
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return (
            item?.name ||
            item?.district ||
            item?.label ||
            ""
          );
        })
        .filter(Boolean)
        .sort((a, b) =>
          String(a).localeCompare(
            String(b)
          )
        );
    }

    return Object.keys(locations).sort(
      (a, b) =>
        a.localeCompare(b)
    );
  }, []);

  /* ==========================================================
     PHONE
  ========================================================== */

  const handlePhone = (value) => {
    const digits = String(
      value || ""
    ).replace(/\D/g, "");

    setPhone(
      digits.slice(0, 10)
    );
  };

  /* ==========================================================
     AREA
  ========================================================== */

  const handleArea = (value) => {
    let clean = String(
      value || ""
    ).replace(/[^0-9.]/g, "");

    const parts = clean.split(".");

    if (parts.length > 2) {
      clean =
        parts[0] +
        "." +
        parts
          .slice(1)
          .join("");
    }

    setApproximateArea(clean);
  };

  /* ==========================================================
     MAP LOCATION
  ========================================================== */

  const handleLocationChange = (
    lat,
    lng
  ) => {
    const numericLat =
      Number(lat);

    const numericLng =
      Number(lng);

    if (
      !Number.isFinite(
        numericLat
      ) ||
      !Number.isFinite(
        numericLng
      )
    ) {
      return;
    }

    setLatitude(
      numericLat.toFixed(7)
    );

    setLongitude(
      numericLng.toFixed(7)
    );

    setError("");
  };

  /* ==========================================================
     BACK
  ========================================================== */

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

  /* ==========================================================
     STEP 1 VALIDATION
  ========================================================== */

  const validateStep1 = () => {
    setError("");

    if (!name.trim()) {
      setError(
        "Please enter your name. / உங்கள் பெயரை உள்ளிடவும்."
      );

      return false;
    }

    if (
      !/^[6-9]\d{9}$/.test(
        phone
      )
    ) {
      setError(
        "Please enter a valid 10 digit phone number. / சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்."
      );

      return false;
    }

    if (!district) {
      setError(
        "Please select your district. / உங்கள் மாவட்டத்தை தேர்வு செய்யவும்."
      );

      return false;
    }

    return true;
  };

  /* ==========================================================
     STEP 2 VALIDATION
  ========================================================== */

  const validateStep2 = () => {
    setError("");

    const hasLat =
      latitude !== "";

    const hasLng =
      longitude !== "";

    if (
      hasLat !== hasLng
    ) {
      setError(
        "Please select the location correctly. / Location-ஐ சரியாக தேர்வு செய்யவும்."
      );

      return false;
    }

    if (
      hasLat &&
      (
        !Number.isFinite(
          Number(latitude)
        ) ||
        !Number.isFinite(
          Number(longitude)
        )
      )
    ) {
      setError(
        "Invalid map location. / Map location சரியாக இல்லை."
      );

      return false;
    }

    if (
      approximateArea !== ""
    ) {
      const area =
        Number(
          approximateArea
        );

      if (
        !Number.isFinite(area) ||
        area <= 0
      ) {
        setError(
          "Please enter a valid area."
        );

        return false;
      }
    }

    return true;
  };

  /* ==========================================================
     NEXT
  ========================================================== */

  const nextStep = () => {
    if (!validateStep1()) {
      return;
    }

    setStep(2);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ==========================================================
     SUBMIT
     
     IMPORTANT:
     Successful submit redirects to /survey-list
  ========================================================== */

  const submit = async () => {
    if (loading) return;

    if (!validateStep2()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        name:
          name.trim(),

        phone:
          phone.trim(),

        district:
          district.trim(),

        latitude:
          latitude !== ""
            ? Number(latitude)
            : null,

        longitude:
          longitude !== ""
            ? Number(longitude)
            : null,

        propertyType:
          propertyType.trim(),

        surveyType:
          surveyType.trim(),

        approximateArea:
          approximateArea !== ""
            ? Number(
                approximateArea
              )
            : null,

        areaUnit:
          areaUnit.trim(),

        surveyNumber:
          surveyNumber.trim(),

        subdivisionNumber:
          subdivisionNumber.trim(),

        pattaNumber:
          pattaNumber.trim(),

        boundaryStatus:
          boundaryStatus.trim(),

        requirement:
          requirement.trim(),

        description:
          description.trim(),

        preferredDate:
          preferredDate ||
          null,

        preferredTime:
          preferredTime.trim(),
      };

      const result =
        await addSurvey(
          payload
        );

      if (
        !result?.success
      ) {
        setError(
          result?.message ||
          "Survey request failed. Please try again."
        );

        return;
      }

      /* ======================================================
         SUCCESS
         
         FORM SUBMITTED SUCCESSFULLY
         → REDIRECT TO SURVEY LIST
      ====================================================== */

      setSuccess(true);

      window.setTimeout(() => {
        window.location.replace(
          "/survey-list"
        );
      }, 700);

    } catch (submitError) {
      console.error(
        "SURVEY SUBMIT ERROR 👉",
        submitError
      );

      setError(
        submitError?.message ||
        "Unable to submit survey request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     JSX
  ========================================================== */

  return (
    <main
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-[linear-gradient(135deg,#EDE9FE_0%,#DBEAFE_35%,#FCE7F3_70%,#F3E8FF_100%)]
        text-[#171717]
      "
    >
      {/* BACKGROUND */}

      <div
        className="
          pointer-events-none
          fixed
          -left-24
          top-24
          h-72
          w-72
          rounded-full
          bg-violet-500/15
          blur-[90px]
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          -right-24
          top-44
          h-80
          w-80
          rounded-full
          bg-blue-500/15
          blur-[100px]
        "
      />

      {/* HEADER */}

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-white/60
          bg-white/45
          backdrop-blur-2xl
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[70px]
            w-full
            max-w-[1200px]
            items-center
            justify-between
            gap-3
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <button
            type="button"
            onClick={goBack}
            disabled={loading}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-white/80
              bg-white/70
              shadow-sm
              transition
              hover:bg-white
              disabled:opacity-40
            "
          >
            <ArrowLeft size={19} />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <div className="text-base font-black sm:text-lg">
              Property Survey
            </div>

            <div className="mt-0.5 text-[11px] font-medium text-gray-500">
              நில அளவீட்டு சேவை
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              window.location.href =
                "/survey-list";
            }}
            className="
              flex
              min-h-[48px]
              min-w-[84px]
              shrink-0
              flex-col
              items-center
              justify-center
              rounded-[17px]
              border
              border-black/[0.06]
              bg-white/90
              px-3
              py-2
              text-center
              shadow-[0_4px_12px_rgba(0,0,0,0.08)]
              transition
              hover:bg-white
              active:scale-[0.97]
              disabled:opacity-50
              sm:min-w-[95px]
            "
          >
            <span className="text-[12px] font-black">
              Survey Needs
            </span>

            <span className="mt-1 text-[9px] font-medium text-gray-500">
              சர்வே தேவைகள்
            </span>
          </button>
        </div>
      </header>

      {/* CONTENT */}

      <section
        className="
          relative
          z-10
          w-full
          px-4
          py-6
          sm:px-6
          sm:py-8
          lg:px-8
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1050px]
          "
        >
          {/* HERO */}

          <div
            className="
              mb-6
              rounded-[30px]
              border
              border-white/70
              bg-white/55
              p-5
              shadow-[0_20px_70px_rgba(91,33,182,0.08)]
              backdrop-blur-2xl
              sm:p-7
            "
          >
            <div
              className="
                flex
                flex-col
                gap-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-white/70
                    px-3
                    py-1.5
                    text-[11px]
                    font-bold
                    text-violet-700
                  "
                >
                  <ShieldCheck size={14} />

                  Trusted Survey Service
                </div>

                <h1
                  className="
                    mt-4
                    text-2xl
                    font-black
                    tracking-tight
                    sm:text-3xl
                    lg:text-4xl
                  "
                >
                  Book a Property Survey
                </h1>

                <p
                  className="
                    mt-2
                    max-w-2xl
                    text-sm
                    font-medium
                    leading-6
                    text-gray-500
                  "
                >
                  நில அளவீடு, எல்லை அளவீடு,
                  மனை அளவீடு போன்ற Survey
                  சேவைகளுக்கு உங்கள் தேவையை
                  பதிவு செய்யுங்கள்.
                </p>
              </div>

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/80
                  bg-white/70
                  px-4
                  py-3
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    bg-violet-600
                    text-white
                  "
                >
                  <Ruler size={21} />
                </div>

                <div>
                  <div className="text-xs font-bold text-gray-500">
                    Step
                  </div>

                  <div className="text-lg font-black">
                    {step} / 2
                  </div>
                </div>
              </div>
            </div>

            {/* PROGRESS */}

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-[11px] font-bold text-gray-500">
                <span>
                  Customer Details
                </span>

                <span>
                  Property Details
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/80">
                <div
                  className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-violet-600
                    to-blue-500
                    transition-all
                    duration-500
                  "
                  style={{
                    width:
                      step === 1
                        ? "50%"
                        : "100%",
                  }}
                />
              </div>
            </div>
          </div>

          {/* SUCCESS */}

          {success && (
            <div
              className="
                mb-6
                flex
                items-start
                gap-4
                rounded-3xl
                border
                border-green-500/20
                bg-green-500/10
                p-5
                shadow-sm
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-green-500
                  text-white
                "
              >
                <Check size={22} />
              </div>

              <div>
                <div className="font-black text-green-800">
                  Survey Submitted Successfully
                </div>

                <div className="mt-1 text-sm font-medium text-green-700">
                  உங்கள் சர்வே கோரிக்கை வெற்றிகரமாக பதிவு செய்யப்பட்டது.
                </div>

                <div className="mt-1 text-xs font-semibold text-green-700">
                  Opening Survey Needs...
                </div>
              </div>
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div
              className="
                mb-6
                rounded-2xl
                border
                border-red-500/15
                bg-red-500/5
                px-4
                py-3
                text-sm
                font-semibold
                text-red-600
              "
            >
              {error}
            </div>
          )}

          {/* FORM */}

          <div
            className="
              rounded-[30px]
              border
              border-white/70
              bg-white/50
              p-5
              shadow-[0_20px_70px_rgba(91,33,182,0.08)]
              backdrop-blur-2xl
              sm:p-7
              lg:p-8
            "
          >
            {/* STEP 1 */}

            {step === 1 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-black">
                    Customer Details
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    உங்கள் அடிப்படை தகவல்களை உள்ளிடவும்.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Name"
                    tamil="பெயர்"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    placeholder="Enter your name"
                    required
                  />

                  <Field
                    label="Mobile Number"
                    tamil="மொபைல் எண்"
                    value={phone}
                    onChange={(e) =>
                      handlePhone(
                        e.target.value
                      )
                    }
                    placeholder="10 digit mobile number"
                    inputMode="numeric"
                    maxLength={10}
                    required
                  />
                </div>

                <div className="mt-5">
                  <SelectField
                    label="District"
                    tamil="மாவட்டம்"
                    value={district}
                    onChange={
                      setDistrict
                    }
                    options={districts}
                  />
                </div>

                <div
                  className="
                    mt-6
                    rounded-2xl
                    border
                    border-violet-500/10
                    bg-violet-500/5
                    p-4
                  "
                >
                  <div className="text-xs font-bold text-violet-800">
                    ✓ Login தேவையில்லை
                  </div>

                  <div className="mt-1 text-xs text-violet-700">
                    Survey request submit செய்ய account login தேவையில்லை.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="
                    mt-7
                    flex
                    min-h-13
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-gradient-to-r
                    from-violet-600
                    to-blue-600
                    px-5
                    py-3
                    text-sm
                    font-black
                    text-white
                    shadow-[0_12px_30px_rgba(124,58,237,0.25)]
                    transition
                    hover:-translate-y-0.5
                    active:scale-[0.98]
                  "
                >
                  Continue

                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* STEP 2 */}

            {step === 2 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-black">
                    Property Survey Details
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    சர்வே தொடர்பான சொத்து தகவல்களை உள்ளிடவும்.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <SelectField
                    label="Property Type"
                    tamil="சொத்து வகை"
                    value={
                      propertyType
                    }
                    onChange={
                      setPropertyType
                    }
                    options={
                      PROPERTY_TYPES
                    }
                  />

                  <SelectField
                    label="Survey Type"
                    tamil="சர்வே வகை"
                    value={
                      surveyType
                    }
                    onChange={
                      setSurveyType
                    }
                    options={
                      SURVEY_TYPES
                    }
                  />
                </div>

                <div className="mt-5">
                  <MapLocationPicker
                    latitude={
                      latitude
                    }
                    longitude={
                      longitude
                    }
                    onLocationChange={
                      handleLocationChange
                    }
                  />
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Approximate Area"
                    tamil="தோராயமான பரப்பளவு"
                    value={
                      approximateArea
                    }
                    onChange={(e) =>
                      handleArea(
                        e.target.value
                      )
                    }
                    placeholder="Example: 1200"
                    inputMode="decimal"
                  />

                  <SelectField
                    label="Area Unit"
                    tamil="அளவு அலகு"
                    value={
                      areaUnit
                    }
                    onChange={
                      setAreaUnit
                    }
                    options={
                      AREA_UNITS
                    }
                  />
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-3">
                  <Field
                    label="Survey Number"
                    tamil="சர்வே எண்"
                    value={
                      surveyNumber
                    }
                    onChange={(e) =>
                      setSurveyNumber(
                        e.target.value
                      )
                    }
                    placeholder="Survey No."
                  />

                  <Field
                    label="Subdivision Number"
                    tamil="உட்பிரிவு எண்"
                    value={
                      subdivisionNumber
                    }
                    onChange={(e) =>
                      setSubdivisionNumber(
                        e.target.value
                      )
                    }
                    placeholder="Subdivision No."
                  />

                  <Field
                    label="Patta Number"
                    tamil="பட்டா எண்"
                    value={
                      pattaNumber
                    }
                    onChange={(e) =>
                      setPattaNumber(
                        e.target.value
                      )
                    }
                    placeholder="Patta No."
                  />
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <SelectField
                    label="Boundary Status"
                    tamil="எல்லை நிலை"
                    value={
                      boundaryStatus
                    }
                    onChange={
                      setBoundaryStatus
                    }
                    options={
                      BOUNDARY_STATUS
                    }
                  />

                  <SelectField
                    label="Requirement"
                    tamil="தேவை"
                    value={
                      requirement
                    }
                    onChange={
                      setRequirement
                    }
                    options={
                      REQUIREMENTS
                    }
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block">
                    <span className="text-sm font-bold">
                      Description
                    </span>

                    <span className="ml-2 text-xs text-gray-500">
                      கூடுதல் தகவல்
                    </span>
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
                    placeholder="Tell us about your survey requirement..."
                    rows={5}
                    className="
                      w-full
                      resize-none
                      rounded-2xl
                      border
                      border-white/80
                      bg-white/80
                      px-4
                      py-3
                      text-sm
                      font-medium
                      outline-none
                      backdrop-blur-xl
                      focus:border-violet-400
                      focus:ring-4
                      focus:ring-violet-500/10
                    "
                  />
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Preferred Date"
                    tamil="விருப்பமான தேதி"
                    type="date"
                    value={
                      preferredDate
                    }
                    onChange={(e) =>
                      setPreferredDate(
                        e.target.value
                      )
                    }
                  />

                  <Field
                    label="Preferred Time"
                    tamil="விருப்பமான நேரம்"
                    type="time"
                    value={
                      preferredTime
                    }
                    onChange={(e) =>
                      setPreferredTime(
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* BUTTONS */}

                <div
                  className="
                    mt-7
                    grid
                    gap-3
                    sm:grid-cols-2
                  "
                >
                  <button
                    type="button"
                    onClick={
                      goBack
                    }
                    disabled={
                      loading
                    }
                    className="
                      flex
                      min-h-13
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      border
                      border-white
                      bg-white/80
                      px-5
                      py-3
                      text-sm
                      font-black
                      text-gray-700
                      transition
                      hover:bg-white
                      disabled:opacity-50
                    "
                  >
                    <ArrowLeft
                      size={18}
                    />

                    Back
                  </button>

                  <button
                    type="button"
                    onClick={
                      submit
                    }
                    disabled={
                      loading
                    }
                    className="
                      flex
                      min-h-13
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      bg-gradient-to-r
                      from-violet-600
                      to-blue-600
                      px-5
                      py-3
                      text-sm
                      font-black
                      text-white
                      shadow-[0_12px_30px_rgba(124,58,237,0.25)]
                      transition
                      hover:-translate-y-0.5
                      active:scale-[0.98]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />

                        Sending...
                      </>
                    ) : (
                      <>
                        <Send
                          size={18}
                        />

                        Submit Survey
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* FOOT NOTE */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-center
              gap-2
              text-center
              text-[11px]
              font-medium
              text-gray-500
            "
          >
            <ShieldCheck size={14} />

            Your survey details are securely submitted to RE2BUY.
          </div>
        </div>
      </section>
    </main>
  );
}