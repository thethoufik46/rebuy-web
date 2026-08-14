// ============================================================
// src/pages/user/needs/NeedsList.jsx
// FINAL - MY NEEDS LIST
// ============================================================

import React, {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  Trash2,
  User,
  XCircle,
} from "lucide-react";

import {
  deleteMyNeed,
  getAudioUrl,
  getMyNeeds,
  getNeedId,
} from "@/services/need";

import carImage from "@/assets/needs/own board.jpeg";
import bikeImage from "@/assets/needs/bike.webp";
import propertyImage from "@/assets/needs/home.webp";
import electronicsImage from "@/assets/needs/electronics.jpeg";

const TYPE_CONFIG = {
  car: {
    title: "Car",
    tamil: "கார்",
    image: carImage,
  },

  bike: {
    title: "Bike",
    tamil: "பைக்",
    image: bikeImage,
  },

  property: {
    title: "Property",
    tamil: "சொத்து",
    image: propertyImage,
  },

  electronics: {
    title: "Electronics",
    tamil: "எலக்ட்ரானிக்ஸ்",
    image: electronicsImage,
  },
};

function text(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  return String(value);
}

function money(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  const number =
    Number(value);

  if (Number.isNaN(number)) {
    return String(value);
  }

  return `₹${number.toLocaleString(
    "en-IN"
  )}`;
}

function getTypeDetails(item) {
  const type =
    String(
      item?.type || ""
    ).toLowerCase();

  if (type === "car") {
    const data =
      item?.car || {};

    return {
      title: text(
        data.model
      ),
      budget: money(
        data.budget
      ),
      timeline:
        data.timeline,
      extra1:
        data.paymentType,
      extra2:
        data.boardType,
    };
  }

  if (type === "bike") {
    const data =
      item?.bike || {};

    return {
      title: text(
        data.model
      ),
      budget: money(
        data.budget
      ),
      timeline:
        data.timeline,
      extra1:
        data.paymentType,
      extra2: null,
    };
  }

  if (type === "property") {
    const data =
      item?.property || {};

    return {
      title: text(
        data.category
      ),
      budget: money(
        data.budget
      ),
      timeline:
        data.timeline,
      extra1:
        data.preferredLocation,
      extra2: null,
    };
  }

  if (type === "electronics") {
    const data =
      item?.electronics || {};

    return {
      title: text(
        data.category
      ),
      budget: money(
        data.budget
      ),
      timeline:
        data.timeline,
      extra1: null,
      extra2: null,
    };
  }

  return {
    title: "-",
    budget: "-",
    timeline: null,
    extra1: null,
    extra2: null,
  };
}

function Status({ value }) {
  const status =
    String(
      value || "pending"
    ).toLowerCase();

  if (status === "approved") {
    return (
      <span
        className="
          inline-flex items-center
          gap-1.5
          rounded-full
          bg-emerald-50
          px-3 py-1.5
          text-[10px]
          font-bold
          uppercase
          text-emerald-700
        "
      >
        <CheckCircle2
          size={13}
        />
        Approved
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span
        className="
          inline-flex items-center
          gap-1.5
          rounded-full
          bg-red-50
          px-3 py-1.5
          text-[10px]
          font-bold
          uppercase
          text-red-700
        "
      >
        <XCircle
          size={13}
        />
        Rejected
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex items-center
        gap-1.5
        rounded-full
        bg-amber-50
        px-3 py-1.5
        text-[10px]
        font-bold
        uppercase
        text-amber-700
      "
    >
      <Clock3 size={13} />
      Pending
    </span>
  );
}

function AudioPlayer({
  item,
}) {
  const url =
    getAudioUrl(item);

  /*
   * OLD DATA:
   * /data/user/...
   *
   * Browser cannot access that.
   */

  if (!url) {
    return null;
  }

  return (
    <div
      className="
        mt-5
        rounded-2xl
        bg-[#e7ffdb]
        p-3
      "
    >
      <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-black/50">
        Voice Note
      </div>

      <audio
        controls
        preload="metadata"
        src={url}
        className="block w-full"
        onClick={(e) => {
          /*
           * IMPORTANT:
           * Stop click bubbling.
           * Prevent parent card/navigation
           * from receiving audio click.
           */
          e.stopPropagation();
        }}
        onPlay={(e) =>
          e.stopPropagation()
        }
        onPause={(e) =>
          e.stopPropagation()
        }
      />
    </div>
  );
}

function NeedCard({
  item,
  onDelete,
}) {
  const type =
    String(
      item?.type || ""
    ).toLowerCase();

  const config =
    TYPE_CONFIG[type] ||
    TYPE_CONFIG.car;

  const details =
    getTypeDetails(item);

  const id =
    getNeedId(item);

  return (
    <article
      className="
        overflow-hidden
        rounded-[26px]
        border border-black/[0.07]
        bg-white
        shadow-[0_12px_45px_rgba(15,23,42,0.06)]
        transition
        hover:-translate-y-0.5
        hover:shadow-[0_18px_55px_rgba(15,23,42,0.09)]
      "
    >
      {/* ======================================================
          ONLY ONE IMAGE TOP
      ====================================================== */}

      <div className="relative h-36 w-full overflow-hidden sm:h-40">
        <img
          src={config.image}
          alt={config.title}
          className="
            h-full w-full
            object-cover
          "
        />

        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-black/50
            via-black/5
            to-transparent
          "
        />

        <div className="absolute bottom-3 left-4">
          <div className="text-lg font-black text-white">
            {config.title}
          </div>

          <div className="text-[10px] font-medium text-white/75">
            {config.tamil}
          </div>
        </div>

        <div className="absolute right-3 top-3">
          <Status
            value={item?.status}
          />
        </div>
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black">
              {details.title}
            </h2>

            <div className="mt-1 text-sm font-bold text-black/55">
              {details.budget}
            </div>
          </div>

          {id && (
            <button
              type="button"
              onClick={() =>
                onDelete(id)
              }
              className="
                flex h-9 w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-red-50
                text-red-600
                transition
                hover:bg-red-100
              "
              aria-label="Delete"
            >
              <Trash2
                size={15}
              />
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm text-black/65">
            <User
              size={15}
              className="shrink-0"
            />
            <span className="truncate">
              {text(
                item?.name
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-black/65">
            <Phone
              size={15}
              className="shrink-0"
            />
            <span>
              {text(
                item?.phone
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-black/65">
            <MapPin
              size={15}
              className="shrink-0"
            />
            <span className="truncate">
              {text(
                item?.location
              )}
            </span>
          </div>

          {details.extra1 && (
            <div className="rounded-xl bg-black/[0.03] px-3 py-2 text-xs font-medium text-black/60">
              {text(
                details.extra1
              )}
            </div>
          )}

          {details.extra2 && (
            <div className="rounded-xl bg-black/[0.03] px-3 py-2 text-xs font-medium text-black/60">
              {text(
                details.extra2
              )}
            </div>
          )}

          {details.timeline && (
            <div className="flex items-center gap-2 text-xs font-semibold text-black/55">
              <CalendarDays
                size={14}
              />
              {details.timeline}
            </div>
          )}
        </div>

        {item?.description && (
          <div
            className="
              mt-4
              rounded-2xl
              bg-[#f7f7fa]
              p-3
              text-sm
              leading-6
              text-black/60
            "
          >
            {item.description}
          </div>
        )}

        {/* ====================================================
            AUDIO
        ==================================================== */}

        <AudioPlayer item={item} />
      </div>
    </article>
  );
}

export default function NeedsList() {
  const [needs, setNeeds] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState("");

  // ==========================================================
  // LOAD
  // ==========================================================

  const loadNeeds = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getMyNeeds();

      setNeeds(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "Unable to load needs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNeeds();
  }, []);

  // ==========================================================
  // BACK
  // ==========================================================

  const goBack = () => {
    window.history.back();
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (
    id
  ) => {
    if (!id) return;

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this request?"
      );

    if (!confirmDelete) {
      return;
    }

    setDeletingId(id);

    const success =
      await deleteMyNeed(id);

    setDeletingId("");

    if (!success) {
      window.alert(
        "Delete failed. Please try again."
      );
      return;
    }

    setNeeds((current) =>
      current.filter(
        (item) =>
          getNeedId(item) !== id
      )
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
          HEADER
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
            px-4
            sm:px-8
            lg:px-12
            xl:px-16
          "
        >
          <button
            type="button"
            onClick={
              goBack
            }
            className="
              flex h-10 w-10
              items-center
              justify-center
              rounded-full
              border border-black/10
              bg-white
              transition
              hover:bg-black
              hover:text-white
            "
          >
            <ArrowLeft
              size={19}
            />
          </button>

          <div className="text-center">
            <div className="text-base font-black sm:text-lg">
              My Needs
            </div>

            <div className="mt-0.5 text-[11px] text-black/45">
              என் தேவைகள்
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              (window.location.href =
                "/needs")
            }
            className="
              rounded-2xl
              bg-black
              px-4 py-2
              text-xs
              font-bold
              text-white
              transition
              hover:opacity-90
            "
          >
            + Need
          </button>
        </div>
      </header>

      {/* ======================================================
          BODY
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
          {loading && (
            <div
              className="
                flex min-h-[55vh]
                items-center
                justify-center
              "
            >
              <div className="text-center">
                <div
                  className="
                    mx-auto mb-4
                    h-9 w-9
                    animate-spin
                    rounded-full
                    border-2
                    border-black/10
                    border-t-black
                  "
                />

                <div className="text-sm font-semibold text-black/55">
                  Loading your needs...
                </div>
              </div>
            </div>
          )}

          {!loading &&
            error && (
              <div
                className="
                  rounded-3xl
                  border border-red-200
                  bg-red-50
                  p-6
                  text-center
                  text-sm
                  font-medium
                  text-red-700
                "
              >
                {error}

                <button
                  type="button"
                  onClick={
                    loadNeeds
                  }
                  className="
                    ml-3
                    font-bold
                    underline
                  "
                >
                  Retry
                </button>
              </div>
            )}

          {!loading &&
            !error &&
            needs.length === 0 && (
              <div
                className="
                  flex min-h-[55vh]
                  items-center
                  justify-center
                "
              >
                <div
                  className="
                    max-w-sm
                    rounded-[30px]
                    border border-black/[0.07]
                    bg-white
                    p-8
                    text-center
                    shadow-xl
                  "
                >
                  <div className="text-2xl font-black">
                    No Needs Yet
                  </div>

                  <div className="mt-2 text-sm text-black/45">
                    இன்னும் எந்த தேவையும் பதிவு செய்யவில்லை.
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      (window.location.href =
                        "/needs")
                    }
                    className="
                      mt-6
                      rounded-2xl
                      bg-black
                      px-6 py-3
                      text-sm
                      font-bold
                      text-white
                    "
                  >
                    Create Need
                  </button>
                </div>
              </div>
            )}

          {!loading &&
            !error &&
            needs.length > 0 && (
              <>
                <div className="mb-6">
                  <div className="text-xl font-black">
                    Your Requests
                  </div>

                  <div className="mt-1 text-sm text-black/45">
                    {needs.length} request
                    {needs.length !== 1
                      ? "s"
                      : ""}{" "}
                    found
                  </div>
                </div>

                {/* =================================================
                    DESKTOP: 4 CARDS
                    TABLET: 2
                    MOBILE: 1
                ================================================= */}

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-5
                    sm:grid-cols-2
                    xl:grid-cols-4
                  "
                >
                  {needs.map(
                    (item) => {
                      const id =
                        getNeedId(
                          item
                        );

                      return (
                        <div
                          key={
                            id ||
                            `${item.type}-${item.createdAt}`
                          }
                          className={
                            deletingId ===
                            id
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        >
                          <NeedCard
                            item={
                              item
                            }
                            onDelete={
                              handleDelete
                            }
                          />
                        </div>
                      );
                    }
                  )}
                </div>
              </>
            )}
        </div>
      </section>
    </main>
  );
}