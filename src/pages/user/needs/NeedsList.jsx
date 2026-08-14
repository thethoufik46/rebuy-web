// src/pages/user/needs/NeedsList.jsx

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaTag,
  FaMoneyBillWave,
  FaClock,
  FaCreditCard,
  FaTrash,
  FaCar,
  FaMotorcycle,
  FaHome,
  FaMobileAlt,
  FaClipboardList,
  FaChevronRight,
} from "react-icons/fa";

import {
  getMyNeeds,
  deleteNeed,
  getNeedId,
  isVisibleNeed,
} from "@/services/need";

/* =========================================================
   HELPERS
========================================================= */

function text(value, fallback = "-") {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  if (typeof value === "object") {
    if (value.name) {
      return String(value.name);
    }

    if (value.$oid) {
      return String(value.$oid);
    }
  }

  return String(value);
}

function typeIcon(type) {
  switch (String(type).toLowerCase()) {
    case "car":
      return FaCar;

    case "bike":
      return FaMotorcycle;

    case "property":
      return FaHome;

    case "electronics":
      return FaMobileAlt;

    default:
      return FaClipboardList;
  }
}

function getTypeTitle(type) {
  switch (String(type).toLowerCase()) {
    case "car":
      return "Car";

    case "bike":
      return "Bike";

    case "property":
      return "Property";

    case "electronics":
      return "Electronics";

    default:
      return "Request";
  }
}

/* =========================================================
   PAGE
========================================================= */

export default function NeedsList() {
  const navigate = useNavigate();

  const [needs, setNeeds] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] =
    useState("");

  const [error, setError] =
    useState("");

  /* =======================================================
     FETCH
  ======================================================= */

  const fetchNeeds = useCallback(
    async () => {
      try {
        setError("");

        const data =
          await getMyNeeds();

        setNeeds(
          Array.isArray(data)
            ? data.filter(isVisibleNeed)
            : []
        );
      } catch (err) {
        console.error(
          "Needs fetch error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load your requests."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchNeeds();
  }, [fetchNeeds]);

  /* =======================================================
     DELETE
  ======================================================= */

  async function handleDelete(id) {
    if (!id || deletingId) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this request?"
      );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      const success =
        await deleteNeed(id);

      if (success) {
        setNeeds((prev) =>
          prev.filter(
            (item) =>
              getNeedId(item) !== id
          )
        );
      } else {
        window.alert(
          "Delete failed. Please try again."
        );
      }
    } catch (err) {
      console.error(
        "Delete need error:",
        err
      );

      window.alert(
        err?.message ||
          "Something went wrong."
      );
    } finally {
      setDeletingId("");
    }
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main
        className="
          min-h-screen
          bg-[#F2F2FF]
          px-4 py-6
        "
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 flex items-center justify-between">
            <div className="h-10 w-10 animate-pulse rounded-full bg-white/70" />

            <div className="space-y-2 text-center">
              <div className="mx-auto h-4 w-28 animate-pulse rounded-full bg-black/10" />
              <div className="mx-auto h-2.5 w-20 animate-pulse rounded-full bg-black/5" />
            </div>

            <div className="h-10 w-10 animate-pulse rounded-2xl bg-white/70" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                  h-48 animate-pulse
                  rounded-[22px]
                  bg-white/60
                "
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-[#F2F2FF]
        px-3 py-4
        sm:px-5
        lg:px-8
      "
    >
      <div className="mx-auto max-w-4xl">
        {/* HEADER */}

        <header
          className="
            mb-5 flex
            items-center
            justify-between
          "
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-full
              bg-white/70
              shadow-sm
              backdrop-blur-xl
              transition
              hover:bg-white
              active:scale-95
            "
          >
            <FaArrowLeft size={14} />
          </button>

          <div className="text-center">
            <h1 className="text-base font-bold">
              My Requests
            </h1>

            <p className="mt-0.5 text-[10px] font-medium text-black/50">
              என் தேவைகள்
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/needs")}
            className="
              flex h-10
              items-center gap-2
              rounded-2xl
              bg-white/70
              px-3
              shadow-sm
              backdrop-blur-xl
              transition
              hover:bg-white
              active:scale-95
            "
          >
            <FaClipboardList size={13} />

            <span className="text-[10px] font-bold">
              New
            </span>
          </button>
        </header>

        {/* ERROR */}

        {error && (
          <div
            className="
              mb-4 rounded-2xl
              bg-red-500/10
              px-4 py-3
              text-xs font-semibold
              text-red-600
            "
          >
            {error}
          </div>
        )}

        {/* EMPTY */}

        {!error && needs.length === 0 && (
          <div
            className="
              flex min-h-[55vh]
              flex-col
              items-center
              justify-center
              rounded-[28px]
              border border-white/70
              bg-white/35
              px-6
              text-center
              backdrop-blur-xl
            "
          >
            <div
              className="
                flex h-16 w-16
                items-center justify-center
                rounded-2xl
                bg-white
                shadow-sm
              "
            >
              <FaClipboardList
                size={23}
                className="text-black/35"
              />
            </div>

            <h2 className="mt-4 text-sm font-bold">
              No Requests
            </h2>

            <p className="mt-1 text-xs text-black/45">
              தேவைகள் இல்லை
            </p>

            <button
              type="button"
              onClick={() => navigate("/needs")}
              className="
                mt-5 rounded-2xl
                bg-black
                px-6 py-3
                text-xs font-bold
                text-white
                transition
                hover:bg-black/90
                active:scale-95
              "
            >
              Add Request
            </button>
          </div>
        )}

        {/* LIST */}

        <div className="space-y-3">
          {needs.map((item) => (
            <NeedCard
              key={getNeedId(item)}
              item={item}
              deleting={
                deletingId ===
                getNeedId(item)
              }
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   NEED CARD
========================================================= */

function NeedCard({
  item,
  deleting,
  onDelete,
}) {
  const type = text(
    item?.type,
    "request"
  ).toLowerCase();

  const TypeIcon = typeIcon(type);

  const titleType =
    getTypeTitle(type);

  const status =
    text(item?.status, "pending")
      .toLowerCase();

  const car =
    item?.car || {};

  const bike =
    item?.bike || {};

  const property =
    item?.property || {};

  const electronics =
    item?.electronics || {};

  let title = "-";
  let budget = "-";
  let sub1 = "-";
  let sub2 = "-";
  let timeline = "-";

  /* CAR */

  if (type === "car") {
    title = text(car.model);
    budget = text(car.budget);
    sub1 = text(car.paymentType);
    sub2 = text(car.boardType);
    timeline = text(car.timeline);
  }

  /* BIKE */

  if (type === "bike") {
    title = text(bike.model);
    budget = text(bike.budget);
    sub1 = text(bike.paymentType);
    timeline = text(bike.timeline);
  }

  /* PROPERTY */

  if (type === "property") {
    title = text(property.category);
    budget = text(property.budget);
    sub1 = text(
      property.preferredLocation
    );
    timeline = text(property.timeline);
  }

  /* ELECTRONICS */

  if (type === "electronics") {
    title = text(
      electronics.category
    );
    budget = text(electronics.budget);
    timeline = text(
      electronics.timeline
    );
  }

  const formattedBudget =
    budget === "-"
      ? "-"
      : `₹ ${Number(
          String(budget).replace(
            /[^0-9]/g,
            ""
          )
        ).toLocaleString("en-IN")}`;

  return (
    <article
      className="
        relative overflow-hidden
        rounded-[24px]
        border border-white/70
        bg-white/40
        p-4
        shadow-[0_8px_30px_rgba(15,23,42,0.06)]
        backdrop-blur-2xl
        sm:p-5
      "
    >
      {/* TOP */}

      <div className="flex items-start gap-3 pr-10">
        <div
          className="
            flex h-10 w-10
            shrink-0
            items-center justify-center
            rounded-xl
            bg-black
            text-white
          "
        >
          <TypeIcon size={15} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold">
            {titleType} • {title}
          </div>

          <div className="mt-0.5 text-[10px] text-black/40">
            Request
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* USER */}

      <div className="mt-4 space-y-2">
        <InfoRow
          icon={FaUser}
          text={text(item?.name)}
        />

        <InfoRow
          icon={FaPhone}
          text={text(item?.phone)}
        />

        <InfoRow
          icon={FaMapMarkerAlt}
          text={text(item?.location)}
        />
      </div>

      <div className="my-4 h-px bg-black/[0.06]" />

      {/* REQUEST DETAILS */}

      <div className="space-y-2">
        <InfoRow
          icon={FaTag}
          text={title}
        />

        <InfoRow
          icon={FaMoneyBillWave}
          text={formattedBudget}
        />

        {sub1 !== "-" && (
          <InfoRow
            icon={
              type === "property"
                ? FaMapMarkerAlt
                : FaCreditCard
            }
            text={sub1}
          />
        )}

        {sub2 !== "-" && (
          <InfoRow
            icon={FaCreditCard}
            text={sub2}
          />
        )}

        {timeline !== "-" && (
          <InfoRow
            icon={FaClock}
            text={timeline}
          />
        )}
      </div>

      {/* DESCRIPTION */}

      {item?.description && (
        <div
          className="
            mt-4 rounded-2xl
            bg-black/[0.035]
            px-3 py-3
          "
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-black/35">
            Additional Details
          </p>

          <p className="mt-1 text-xs leading-5 text-black/65">
            {text(item.description)}
          </p>
        </div>
      )}

      {/* AUDIO */}

      {item?.audioNote && (
        <div className="mt-4">
          <audio
            controls
            preload="none"
            src={item.audioNote}
            className="h-9 w-full"
          />
        </div>
      )}

      {/* DELETE */}

      <button
        type="button"
        disabled={deleting}
        onClick={() =>
          onDelete(
            getNeedId(item)
          )
        }
        aria-label="Delete request"
        className="
          absolute right-3 top-3
          flex h-8 w-8
          items-center justify-center
          rounded-full
          bg-red-500
          text-white
          shadow-lg
          transition
          hover:bg-red-600
          active:scale-90
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {deleting ? (
          <span
            className="
              h-3.5 w-3.5
              animate-spin
              rounded-full
              border-2
              border-white/40
              border-t-white
            "
          />
        ) : (
          <FaTrash size={11} />
        )}
      </button>
    </article>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  icon: Icon,
  text: value,
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Icon
        size={12}
        className="shrink-0 text-black/40"
      />

      <span className="truncate text-xs font-medium text-black/70">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({
  status,
}) {
  let color =
    "bg-orange-500/10 text-orange-600";

  if (status === "approved") {
    color =
      "bg-green-500/10 text-green-600";
  }

  if (status === "rejected") {
    color =
      "bg-red-500/10 text-red-600";
  }

  return (
    <span
      className={`
        shrink-0 rounded-full
        px-3 py-1.5
        text-[9px] font-extrabold
        uppercase
        ${color}
      `}
    >
      {status}
    </span>
  );
}