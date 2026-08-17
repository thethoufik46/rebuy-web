// src/pages/user/home/Pages/RealEstatePage.jsx

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import PropertyGridSection from "../property/PropertyGridSection";

// =========================================================
// SURVEY BANNER IMAGE
// =========================================================

import surveyImage from "../../../../assets/images/servey.webp";

const BASE_URL =
  "https://rebuy-api.onrender.com/api";

let propertiesCache = null;
let propertiesPromise = null;

// =========================================================
// PROPERTIES API
// =========================================================

async function getPropertiesFast() {
  if (Array.isArray(propertiesCache)) {
    return propertiesCache;
  }

  if (propertiesPromise) {
    return propertiesPromise;
  }

  propertiesPromise = fetch(
    `${BASE_URL}/properties`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "default",
    }
  )
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(
          `Properties API ${response.status}`
        );
      }

      const data =
        await response.json();

      const result =
        Array.isArray(
          data?.properties
        )
          ? data.properties
          : [];

      propertiesCache = result;

      return result;
    })
    .catch((error) => {
      console.error(
        "Properties fetch error:",
        error
      );

      return [];
    })
    .finally(() => {
      propertiesPromise = null;
    });

  return propertiesPromise;
}

/* =========================================================
   HEADER
========================================================= */

function SectionHeader({
  title,
  subtitle,
  onViewAll,
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        px-4
      "
    >
      <div
        className="
          min-w-0
          flex-1
        "
      >
        <h2
          className="
            text-base
            font-semibold
            tracking-wide
          "
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className="
              mt-0.5
              text-xs
              font-medium
              text-black/60
              font-tamil
            "
          >
            {subtitle}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onViewAll}
        className="
          ml-3
          flex
          shrink-0
          items-center
          gap-1
          text-sm
          font-medium
          text-black/70
          active:text-black
        "
      >
        <span>
          View All
        </span>

        <ArrowIcon />
      </button>
    </div>
  );
}

/* =========================================================
   STATIC ARROW
========================================================= */

function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/* =========================================================
   SURVEY SERVICE BANNER
========================================================= */

function SurveyServiceBanner({
  onClick,
}) {
  return (
    <section className="w-full px-2 sm:px-4">

      <button
        type="button"
        onClick={onClick}
        aria-label="Open Land Survey Service"
        className="
          group
          relative
          block
          w-full
          overflow-hidden
          rounded-[26px]
          border
          border-white/80
          bg-white
          text-left
          shadow-[0_10px_35px_rgba(0,0,0,0.08)]
          transition-all
          duration-300
          hover:-translate-y-[2px]
          hover:shadow-[0_16px_45px_rgba(91,33,182,0.13)]
          active:scale-[0.99]
        "
      >

        {/* =================================================
            INNER BANNER
        ================================================= */}

        <div
          className="
            relative
            flex
            min-h-[190px]
            w-full
            overflow-hidden
            sm:min-h-[220px]
            md:min-h-[240px]
          "
        >

          {/* =================================================
              BACKGROUND
          ================================================= */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-[#faf9ff]
              via-white
              to-[#eef5ff]
            "
          />

          {/* Purple Glow */}

          <div
            className="
              pointer-events-none
              absolute
              -left-20
              -top-20
              h-48
              w-48
              rounded-full
              bg-[#A78BFA]/15
              blur-[70px]
            "
          />

          {/* Blue Glow */}

          <div
            className="
              pointer-events-none
              absolute
              right-[25%]
              -top-20
              h-48
              w-48
              rounded-full
              bg-[#3B82F6]/10
              blur-[70px]
            "
          />

          {/* =================================================
              CONTENT
          ================================================= */}

          <div
            className="
              relative
              z-10
              flex
              min-h-[190px]
              w-full
              items-center
              sm:min-h-[220px]
              md:min-h-[240px]
            "
          >

            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div
              className="
                flex
                min-w-0
                flex-1
                flex-col
                justify-center
                px-5
                py-6
                sm:px-7
                md:px-9
                lg:px-10
              "
            >

              {/* SERVICE BADGE */}

              <div
                className="
                  mb-3
                  flex
                  w-fit
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-[#7C3AED]/10
                  bg-[#7C3AED]/[0.06]
                  px-3
                  py-1.5
                "
              >
                <ShieldCheck
                  size={14}
                  className="text-[#3B82F6]"
                  strokeWidth={2.4}
                />

                <span
                  className="
                    text-[10px]
                    font-bold
                    text-[#5B21B6]
                    sm:text-[11px]
                  "
                >
                  Professional Survey Service
                </span>
              </div>

              {/* HEADING */}

              <h3
                className="
                  max-w-[560px]
                  text-[23px]
                  font-bold
                  leading-[1.12]
                  tracking-tight
                  text-[#171717]
                  sm:text-[28px]
                  md:text-[32px]
                  lg:text-[35px]
                "
              >
                Land Survey
                <span className="text-[#7C3AED]">
                  {" "}
                  & Measurement
                </span>
              </h3>

              {/* TAMIL TITLE */}

              <p
                className="
                  mt-1
                  text-[15px]
                  font-semibold
                  text-black/55
                  sm:text-[17px]
                "
              >
                நில அளவீட்டு சேவை
              </p>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-2
                  max-w-[520px]
                  text-[11px]
                  font-medium
                  leading-5
                  text-black/45
                  sm:text-[12px]
                  sm:leading-6
                "
              >
                தமிழ்நாடு முழுவதும் Land, Plot &
                Property Survey மற்றும் Measurement
                தேவைகளுக்கு Service Enquiry செய்யலாம்.
              </p>

              {/* CTA */}

              <div
                className="
                  mt-4
                  flex
                  items-center
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-[12px]
                    bg-gradient-to-r
                    from-[#7C3AED]
                    via-[#3B82F6]
                    to-[#06B6D4]
                    px-4
                    py-2.5
                    text-[11px]
                    font-bold
                    text-white
                    shadow-[0_8px_22px_rgba(124,58,237,0.20)]
                    transition-all
                    duration-200
                    group-hover:gap-2.5
                    group-hover:shadow-[0_10px_28px_rgba(124,58,237,0.28)]
                    sm:px-5
                    sm:py-3
                    sm:text-[12px]
                  "
                >
                  Survey Service

                  <ArrowRight
                    size={15}
                    strokeWidth={2.4}
                  />
                </span>
              </div>

            </div>

            {/* =================================================
                RIGHT IMAGE
            ================================================= */}

            <div
              className="
                relative
                hidden
                h-full
                w-[38%]
                shrink-0
                overflow-hidden
                sm:block
                md:w-[40%]
                lg:w-[38%]
              "
            >

              <img
                src={surveyImage}
                alt="Land Survey Service"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  object-center
                  transition-transform
                  duration-500
                  group-hover:scale-[1.035]
                "
              />

              {/* LEFT IMAGE FADE */}

              <div
                className="
                  absolute
                  inset-y-0
                  left-0
                  w-20
                  bg-gradient-to-r
                  from-white
                  via-white/45
                  to-transparent
                "
              />

              {/* IMAGE OVERLAY */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-[#7C3AED]/[0.04]
                  via-transparent
                  to-[#3B82F6]/[0.08]
                "
              />

            </div>

          </div>

        </div>
      </button>

    </section>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function RealEstatePage() {

  const navigate =
    useNavigate();

  const [
    properties,
    setProperties,
  ] = useState(
    Array.isArray(
      propertiesCache
    )
      ? propertiesCache
      : []
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(
    !Array.isArray(
      propertiesCache
    )
  );

  /* =======================================================
     LOAD PROPERTIES
  ======================================================= */

  useEffect(() => {

    let mounted = true;

    getPropertiesFast()
      .then((result) => {

        if (!mounted) return;

        setProperties(
          result
        );

        setIsLoading(
          false
        );
      });

    return () => {
      mounted = false;
    };

  }, []);

  /* =======================================================
     VIEW ALL
  ======================================================= */

  const handleViewAll =
    useCallback(() => {

      navigate(
        "/property-list",
        {
          state: {
            properties,
          },
        }
      );

    }, [
      navigate,
      properties,
    ]);

  /* =======================================================
     SURVEY LINK
  ======================================================= */

  const handleSurveyClick =
    useCallback(() => {

      navigate(
        "/survey"
      );

    }, [
      navigate,
    ]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="w-full">

      {/* =================================================
          PROPERTY SECTION
      ================================================= */}

      <div className="space-y-4">

        <SectionHeader
          title="Property Sections"
          subtitle="வீடு & நிலங்கள்"
          onViewAll={
            handleViewAll
          }
        />

        <PropertyGridSection
          properties={
            properties
          }
          showViewAllButton={
            true
          }
          onViewAll={
            handleViewAll
          }
          loading={
            isLoading
          }
        />

      </div>

      {/* =================================================
          SURVEY SERVICE BANNER
      ================================================= */}

      <div
        className="
          mt-7
          w-full
        "
      >
        <SurveyServiceBanner
          onClick={
            handleSurveyClick
          }
        />
      </div>

      {/* =================================================
          BOTTOM SPACING
      ================================================= */}

      <div className="h-5" />

    </div>
  );
}