// ============================================================
// src/pages/user/home/property/survery/SurveyList.jsx
// RE2BUY - USER SURVEY LIST
// ============================================================

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Loader2,
  MapPin,
  Phone,
  RefreshCw,
  Ruler,
  Search,
  UserRound,
} from "lucide-react";

import {
  getSurveyCoordinates,
  getSurveyId,
  getSurveyStatus,
  getSurveys,
} from "../../../../../services/survey";


/* ============================================================
   STATUS FILTERS
============================================================ */

const STATUS_FILTERS = [
  {
    value: "all",
    label: "All",
    tamil: "அனைத்தும்",
  },
  {
    value: "pending",
    label: "Pending",
    tamil: "நிலுவையில்",
  },
  {
    value: "approved",
    label: "Approved",
    tamil: "அங்கீகரிக்கப்பட்டது",
  },
  {
    value: "completed",
    label: "Completed",
    tamil: "முடிக்கப்பட்டது",
  },
  {
    value: "rejected",
    label: "Rejected",
    tamil: "நிராகரிக்கப்பட்டது",
  },
];


/* ============================================================
   STATUS CONFIG
============================================================ */

function getStatusConfig(
  status
) {

  switch (
    String(
      status || "pending"
    ).toLowerCase()
  ) {

    case "approved":
      return {
        label: "Approved",
        tamil:
          "அங்கீகரிக்கப்பட்டது",
        className:
          "border-green-200 bg-green-50 text-green-700",
        dot:
          "bg-green-500",
      };

    case "completed":
      return {
        label: "Completed",
        tamil:
          "முடிக்கப்பட்டது",
        className:
          "border-cyan-200 bg-cyan-50 text-cyan-700",
        dot:
          "bg-cyan-500",
      };

    case "rejected":
      return {
        label: "Rejected",
        tamil:
          "நிராகரிக்கப்பட்டது",
        className:
          "border-red-200 bg-red-50 text-red-700",
        dot:
          "bg-red-500",
      };

    default:
      return {
        label: "Pending",
        tamil:
          "நிலுவையில்",
        className:
          "border-amber-200 bg-amber-50 text-amber-700",
        dot:
          "bg-amber-500",
      };
  }
}


/* ============================================================
   DATE
============================================================ */

function formatDate(
  value
) {

  if (!value) {
    return "—";
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value);
  }


  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


/* ============================================================
   SURVEY CARD
============================================================ */

function SurveyCard({
  survey,
}) {

  const id =
    getSurveyId(
      survey
    );


  const status =
    getSurveyStatus(
      survey
    );


  const statusConfig =
    getStatusConfig(
      status
    );


  const coordinates =
    getSurveyCoordinates(
      survey
    );


  return (
    <article
      className="
        overflow-hidden
        rounded-[28px]
        border
        border-white/80
        bg-white/70
        shadow-[0_18px_60px_rgba(91,33,182,0.08)]
        backdrop-blur-2xl
      "
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
          border-b
          border-black/[0.04]
          px-5
          py-5
          sm:px-6
        "
      >

        <div className="flex min-w-0 items-center gap-3">

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
            <Ruler size={20} />
          </div>


          <div className="min-w-0">

            <h2 className="truncate text-base font-black text-[#171717] sm:text-lg">
              {survey?.surveyType ||
                "Property Survey"}
            </h2>

            <p className="mt-1 truncate text-xs font-medium text-gray-500">
              {survey?.propertyType ||
                "Property"}
            </p>

          </div>

        </div>


        <div
          className={`
            flex
            shrink-0
            items-center
            gap-1.5
            rounded-full
            border
            px-3
            py-1.5
            text-[10px]
            font-black
            ${statusConfig.className}
          `}
        >

          <span
            className={`
              h-1.5
              w-1.5
              rounded-full
              ${statusConfig.dot}
            `}
          />

          <span className="hidden sm:inline">
            {statusConfig.label}
          </span>

          <span className="sm:hidden">
            {statusConfig.tamil}
          </span>

        </div>

      </div>


      {/* ======================================================
          BODY
      ====================================================== */}

      <div className="space-y-4 px-5 py-5 sm:px-6">

        {/* LOCATION + DATE */}

        <div className="grid gap-3 sm:grid-cols-2">

          <div
            className="
              rounded-2xl
              border
              border-white
              bg-white/60
              p-4
            "
          >

            <div className="flex items-center gap-2">

              <MapPin
                size={16}
                className="text-violet-600"
              />

              <span className="text-[11px] font-bold text-gray-500">
                Location / இடம்
              </span>

            </div>


            <div className="mt-2 text-sm font-black text-[#171717]">
              {survey?.district ||
                "—"}
            </div>


            {coordinates && (
              <div className="mt-1 text-[10px] text-gray-500">

                {coordinates.latitude.toFixed(
                  6
                )}

                {" , "}

                {coordinates.longitude.toFixed(
                  6
                )}

              </div>
            )}

          </div>


          <div
            className="
              rounded-2xl
              border
              border-white
              bg-white/60
              p-4
            "
          >

            <div className="flex items-center gap-2">

              <CalendarDays
                size={16}
                className="text-blue-600"
              />

              <span className="text-[11px] font-bold text-gray-500">
                Requested / கோரியது
              </span>

            </div>


            <div className="mt-2 text-sm font-black text-[#171717]">
              {formatDate(
                survey?.createdAt
              )}
            </div>


            {survey?.preferredDate && (
              <div className="mt-1 text-[10px] text-gray-500">
                Visit / வருகை:{" "}
                {formatDate(
                  survey.preferredDate
                )}
              </div>
            )}

          </div>

        </div>


        {/* DETAILS */}

        <div className="grid gap-3 sm:grid-cols-3">

          <div className="rounded-2xl bg-violet-500/5 p-3">

            <div className="text-[10px] font-bold text-gray-500">
              Survey Type / சர்வே
            </div>

            <div className="mt-1 text-xs font-bold text-[#171717]">
              {survey?.surveyType ||
                "—"}
            </div>

          </div>


          <div className="rounded-2xl bg-blue-500/5 p-3">

            <div className="text-[10px] font-bold text-gray-500">
              Area / பரப்பளவு
            </div>

            <div className="mt-1 text-xs font-bold text-[#171717]">

              {survey?.approximateArea ??
                "—"}

              {survey?.areaUnit
                ? ` ${survey.areaUnit}`
                : ""}

            </div>

          </div>


          <div className="rounded-2xl bg-cyan-500/5 p-3">

            <div className="text-[10px] font-bold text-gray-500">
              Preferred Time / நேரம்
            </div>

            <div className="mt-1 flex items-center gap-1 text-xs font-bold text-[#171717]">

              <Clock3 size={12} />

              {survey?.preferredTime ||
                "Any time"}

            </div>

          </div>

        </div>


        {/* DOCUMENT */}

        <div className="grid gap-3 sm:grid-cols-3">

          <div className="rounded-2xl bg-gray-500/5 p-3">

            <div className="text-[10px] font-bold text-gray-500">
              Survey No / சர்வே எண்
            </div>

            <div className="mt-1 text-xs font-bold text-[#171717]">
              {survey?.surveyNumber ||
                "—"}
            </div>

          </div>


          <div className="rounded-2xl bg-gray-500/5 p-3">

            <div className="text-[10px] font-bold text-gray-500">
              Subdivision / உட்பிரிவு
            </div>

            <div className="mt-1 text-xs font-bold text-[#171717]">
              {survey?.subdivisionNumber ||
                "—"}
            </div>

          </div>


          <div className="rounded-2xl bg-gray-500/5 p-3">

            <div className="text-[10px] font-bold text-gray-500">
              Patta / பட்டா
            </div>

            <div className="mt-1 text-xs font-bold text-[#171717]">
              {survey?.pattaNumber ||
                "—"}
            </div>

          </div>

        </div>


        {/* BOUNDARY */}

        <div className="grid gap-3 sm:grid-cols-2">

          <div className="rounded-2xl bg-amber-500/5 p-3">

            <div className="text-[10px] font-bold text-gray-500">
              Boundary / எல்லை
            </div>

            <div className="mt-1 text-xs font-bold text-[#171717]">
              {survey?.boundaryStatus ||
                "—"}
            </div>

          </div>


          <div className="rounded-2xl bg-violet-500/5 p-3">

            <div className="text-[10px] font-bold text-gray-500">
              Requirement / தேவை
            </div>

            <div className="mt-1 text-xs font-bold text-[#171717]">
              {survey?.requirement ||
                "—"}
            </div>

          </div>

        </div>


        {/* DESCRIPTION */}

        {survey?.description && (
          <div
            className="
              rounded-2xl
              border
              border-white
              bg-white/50
              p-4
            "
          >

            <div className="text-[10px] font-black text-gray-500">
              Details / கூடுதல் தகவல்
            </div>

            <p className="mt-2 whitespace-pre-wrap text-xs font-medium leading-5 text-gray-600">
              {survey.description}
            </p>

          </div>
        )}


        {/* USER */}

        <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-gray-500">

          <span className="flex items-center gap-1.5">
            <UserRound size={13} />
            {survey?.name ||
              "—"}
          </span>


          <span className="flex items-center gap-1.5">
            <Phone size={13} />
            {survey?.phone ||
              "—"}
          </span>

        </div>


        {/* ADMIN NOTE */}

        {survey?.adminNote && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">

            <div className="text-[10px] font-black text-blue-600">
              RE2BUY Note / நிர்வாக குறிப்புகள்
            </div>

            <p className="mt-2 whitespace-pre-wrap text-xs font-medium leading-5 text-blue-700">
              {survey.adminNote}
            </p>

          </div>
        )}

      </div>


      {/* ======================================================
          FOOTER
      ====================================================== */}

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-2
          border-t
          border-black/[0.04]
          bg-white/30
          px-5
          py-4
          sm:px-6
        "
      >

        {coordinates && (
          <a
            href={`https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex
              min-h-10
              items-center
              gap-2
              rounded-xl
              border
              border-white
              bg-white/80
              px-4
              text-xs
              font-bold
              text-gray-800
              shadow-sm
              transition
              hover:bg-white
            "
          >
            <MapPin
              size={14}
              className="text-violet-600"
            />
            Map / வரைபடம்
          </a>
        )}


        <div className="ml-auto text-[10px] font-medium text-gray-400">

          ID:

          <span className="ml-1 max-w-[180px] truncate">
            {id || "—"}
          </span>

        </div>

      </div>

    </article>
  );
}


/* ============================================================
   PAGE
============================================================ */

export default function SurveyList() {

  const [
    surveys,
    setSurveys,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");


  /* ==========================================================
     LOAD USER SURVEYS
  ========================================================== */

  const loadSurveys =
    useCallback(
      async (
        refresh = false
      ) => {

        if (refresh) {
          setRefreshing(
            true
          );
        } else {
          setLoading(true);
        }


        setError("");


        try {

          /*
            IMPORTANT:
            getSurveys() now calls:

            GET /api/survey/my

            so only current logged-in user's
            survey data is returned.
          */

          const result =
            await getSurveys();


          if (
            !result?.success
          ) {

            setError(
              result?.message ||
                "Unable to load your surveys."
            );

            setSurveys([]);

            return;
          }


          setSurveys(
            Array.isArray(
              result.surveys
            )
              ? result.surveys
              : []
          );

        } catch (err) {

          setError(
            err?.message ||
              "Unable to load surveys."
          );

        } finally {

          setLoading(false);

          setRefreshing(
            false
          );
        }

      },
      []
    );


  useEffect(() => {

    loadSurveys();

  }, [
    loadSurveys,
  ]);


  /* ==========================================================
     FILTER
  ========================================================== */

  const filteredSurveys =
    useMemo(() => {

      const term =
        search
          .trim()
          .toLowerCase();


      return surveys.filter(
        (survey) => {

          const status =
            getSurveyStatus(
              survey
            );


          if (
            statusFilter !==
              "all" &&
            status !==
              statusFilter
          ) {
            return false;
          }


          if (!term) {
            return true;
          }


          const text = [
            survey?.name,
            survey?.phone,
            survey?.district,
            survey?.propertyType,
            survey?.surveyType,
            survey?.surveyNumber,
            survey?.subdivisionNumber,
            survey?.pattaNumber,
            survey?.description,
            survey?.requirement,
            survey?.boundaryStatus,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


          return text.includes(
            term
          );
        }
      );

    }, [
      surveys,
      search,
      statusFilter,
    ]);


  /* ==========================================================
     COUNTS
  ========================================================== */

  const counts =
    useMemo(() => {

      return {

        all:
          surveys.length,

        pending:
          surveys.filter(
            (item) =>
              getSurveyStatus(
                item
              ) ===
              "pending"
          ).length,

        approved:
          surveys.filter(
            (item) =>
              getSurveyStatus(
                item
              ) ===
              "approved"
          ).length,

        completed:
          surveys.filter(
            (item) =>
              getSurveyStatus(
                item
              ) ===
              "completed"
          ).length,

        rejected:
          surveys.filter(
            (item) =>
              getSurveyStatus(
                item
              ) ===
              "rejected"
          ).length,

      };

    }, [
      surveys,
    ]);


  /* ==========================================================
     BACK
  ========================================================== */

  const goBack =
    () => {
      window.history.back();
    };


  /* ==========================================================
     NEW SURVEY
  ========================================================== */

  const openNewSurvey =
    () => {

      window.location.href =
        "/user/home/property/survery/survery";
    };


  /* ==========================================================
     UI
  ========================================================== */

  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-br
        from-violet-50
        via-white
        to-blue-50
        px-4
        py-6
        sm:px-6
        sm:py-10
      "
    >

      <section className="mx-auto max-w-6xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-6 flex items-center justify-between gap-3">

          <div className="flex min-w-0 items-center gap-3">

            <button
              type="button"
              onClick={
                goBack
              }
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-white
                bg-white/80
                text-gray-700
                shadow-sm
              "
            >
              <ArrowLeft size={19} />
            </button>


            <div className="min-w-0">

              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-500">
                RE2BUY
              </div>

              <h1 className="truncate text-xl font-black text-[#171717] sm:text-2xl">
                Survey தேவைகள்
              </h1>

              <p className="mt-1 truncate text-xs text-gray-500">
                உங்கள் Survey Requests / உங்கள் சர்வே கோரிக்கைகள்
              </p>

            </div>

          </div>


          <div className="flex shrink-0 items-center gap-2">

            <button
              type="button"
              onClick={
                openNewSurvey
              }
              className="
                hidden
                min-h-11
                items-center
                gap-2
                rounded-2xl
                bg-gradient-to-r
                from-violet-600
                to-blue-600
                px-4
                text-xs
                font-black
                text-white
                shadow-[0_10px_25px_rgba(124,58,237,0.22)]
                sm:flex
              "
            >
              <Ruler size={16} />
              New Survey
            </button>


            <button
              type="button"
              onClick={() =>
                loadSurveys(
                  true
                )
              }
              disabled={
                refreshing
              }
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                border
                border-white
                bg-white/80
                text-violet-600
                shadow-sm
                disabled:opacity-50
              "
            >

              {refreshing ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <RefreshCw
                  size={18}
                />
              )}

            </button>

          </div>

        </div>


        {/* MOBILE NEW SURVEY */}

        <button
          type="button"
          onClick={
            openNewSurvey
          }
          className="
            mb-4
            flex
            min-h-12
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-gradient-to-r
            from-violet-600
            to-blue-600
            px-4
            text-sm
            font-black
            text-white
            shadow-[0_10px_25px_rgba(124,58,237,0.20)]
            sm:hidden
          "
        >
          <Ruler size={17} />
          New Survey / புதிய சர்வே
        </button>


        {/* ==================================================
            SUMMARY
        ================================================== */}

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">

          {STATUS_FILTERS.map(
            (item) => {

              const count =
                counts[
                  item.value
                ] || 0;


              const active =
                statusFilter ===
                item.value;


              return (
                <button
                  key={
                    item.value
                  }
                  type="button"
                  onClick={() =>
                    setStatusFilter(
                      item.value
                    )
                  }
                  className={`
                    rounded-2xl
                    border
                    px-4
                    py-3
                    text-left
                    transition
                    ${
                      active
                        ? "border-violet-300 bg-violet-100/80"
                        : "border-white bg-white/65"
                    }
                  `}
                >

                  <div className="text-[10px] font-bold text-gray-500">
                    {item.label}
                  </div>

                  <div className="mt-1 text-xl font-black text-[#171717]">
                    {count}
                  </div>

                  <div className="text-[9px] text-gray-400">
                    {item.tamil}
                  </div>

                </button>
              );
            }
          )}

        </div>


        {/* ==================================================
            SEARCH
        ================================================== */}

        <div
          className="
            mb-6
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-white
            bg-white/70
            px-4
            py-2
            shadow-sm
            backdrop-blur-xl
          "
        >

          <Search
            size={18}
            className="shrink-0 text-gray-400"
          />


          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search survey / பெயர் / மொபைல் / மாவட்டம்..."
            className="
              h-10
              w-full
              bg-transparent
              text-sm
              font-medium
              text-[#171717]
              outline-none
              placeholder:text-gray-400
            "
          />


          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              className="text-xs font-bold text-gray-400"
            >
              Clear
            </button>
          )}

        </div>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div
            className="
              mb-5
              rounded-2xl
              border
              border-red-200
              bg-red-50
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


        {/* ==================================================
            LOADING
        ================================================== */}

        {loading ? (

          <div
            className="
              flex
              min-h-[320px]
              items-center
              justify-center
              rounded-[30px]
              border
              border-white
              bg-white/60
              shadow-sm
              backdrop-blur-xl
            "
          >

            <div className="text-center">

              <Loader2
                size={30}
                className="mx-auto animate-spin text-violet-600"
              />

              <p className="mt-3 text-sm font-bold text-gray-500">
                Loading Your Survey Requests...
              </p>

              <p className="mt-1 text-xs text-gray-400">
                உங்கள் சர்வே கோரிக்கைகள் ஏற்றப்படுகிறது...
              </p>

            </div>

          </div>

        ) : filteredSurveys.length ===
          0 ? (

          <div
            className="
              flex
              min-h-[350px]
              items-center
              justify-center
              rounded-[30px]
              border
              border-white
              bg-white/60
              px-6
              text-center
              shadow-sm
              backdrop-blur-xl
            "
          >

            <div>

              <div
                className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-3xl
                  bg-violet-100
                  text-violet-600
                "
              >
                <Ruler size={28} />
              </div>


              <h2 className="mt-5 text-lg font-black text-[#171717]">
                No Survey Requests
              </h2>


              <p className="mt-1 text-xs text-gray-500">
                Survey தேவைகள் எதுவும் இல்லை
              </p>


              {search ? (

                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="
                    mt-5
                    rounded-xl
                    bg-violet-600
                    px-5
                    py-2.5
                    text-xs
                    font-black
                    text-white
                  "
                >
                  Clear Search
                </button>

              ) : (

                <button
                  type="button"
                  onClick={
                    openNewSurvey
                  }
                  className="
                    mt-5
                    rounded-xl
                    bg-gradient-to-r
                    from-violet-600
                    to-blue-600
                    px-5
                    py-2.5
                    text-xs
                    font-black
                    text-white
                  "
                >
                  Submit Survey
                </button>

              )}

            </div>

          </div>

        ) : (

          <div className="grid gap-5">

            {filteredSurveys.map(
              (survey) => (

                <SurveyCard
                  key={
                    getSurveyId(
                      survey
                    )
                  }
                  survey={
                    survey
                  }
                />

              )
            )}

          </div>

        )}


        {/* ==================================================
            FOOTER
        ================================================== */}

        {!loading &&
          filteredSurveys.length >
            0 && (

          <div className="mt-6 text-center text-[10px] font-medium text-gray-400">

            Showing{" "}
            {
              filteredSurveys.length
            }{" "}
            survey request
            {filteredSurveys.length !==
            1
              ? "s"
              : ""}

          </div>

        )}

      </section>

    </main>
  );
}