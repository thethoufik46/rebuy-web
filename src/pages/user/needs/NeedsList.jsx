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
  restoreMyNeed,
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

function AudioPlayer({ item }) {
  const url = getAudioUrl(item);

  /*
   * Always reserve the same audio area.
   * If there is no usable audio URL, show an empty audio state
   * instead of removing the section and changing card height.
   */
  if (!url) {
    return (
      <div
        className="
          mt-auto pt-5
        "
      >
        <div
          className="
            flex min-h-[82px] items-center gap-3
            rounded-2xl
            border border-dashed border-black/10
            bg-[#f4f4f6]
            px-4
          "
        >
          <div
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-full bg-black/[0.06]
              text-black/35
            "
          >
            <span className="text-lg">♪</span>
          </div>

          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-black/40">
              Voice Note
            </div>
            <div className="mt-1 text-xs font-medium text-black/35">
              No audio available
            </div>
            <div className="text-[10px] text-black/25">
              ஆடியோ பதிவு இல்லை
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-auto pt-5">
      <div className="rounded-2xl bg-[#e7ffdb] p-3">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-black/50">
          Voice Note
        </div>

        <audio
          controls
          preload="metadata"
          src={url}
          className="block h-10 w-full"
          onClick={(e) => e.stopPropagation()}
          onPlay={(e) => e.stopPropagation()}
          onPause={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

function NeedCard({
  item,
  onDelete,
  onRestore,
  isDeleted = false,
  restoring = false,
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
        h-full
        flex flex-col
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

        {isDeleted && (
          <div className="absolute inset-0 bg-red-600/55" />
        )}

        <div className="absolute bottom-3 left-4">
          <div className="text-lg font-black text-white">
            {config.title}
          </div>

          <div className="text-[10px] font-medium text-white/75">
            {config.tamil}
          </div>
        </div>

        <div className="absolute right-3 top-3">
          {isDeleted ? (
            <span
              className="
                inline-flex items-center gap-1.5
                rounded-full bg-red-700 px-3 py-1.5
                text-[10px] font-black uppercase text-white
                shadow-lg
              "
            >
              <Trash2 size={13} />
              Recently Deleted
            </span>
          ) : (
            <Status
              value={item?.status}
            />
          )}
        </div>
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black">
              {details.title}
            </h2>

            <div className="mt-1 text-sm font-bold text-black/55">
              {details.budget}
            </div>
          </div>

          {id && !isDeleted && (
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
              aria-label="Delete request"
              title="Move to Recently Deleted"
            >
              <Trash2 size={15} />
            </button>
          )}

          {id && isDeleted && (
            <button
              type="button"
              disabled={restoring}
              onClick={() =>
                onRestore(id)
              }
              className="
                rounded-2xl
                bg-emerald-600
                px-3 py-2
                text-[10px] font-black
                text-white
                shadow-sm
                transition
                hover:bg-emerald-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              title="Recover within 24 hours"
            >
              {restoring ? "Recovering..." : "Recover"}
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
              min-h-[68px]
              max-h-[96px]
              overflow-hidden
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

  const [deletedNeeds, setDeletedNeeds] =
    useState([]);

  const [restoringId, setRestoringId] =
    useState("");

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

      const result =
        await getMyNeeds();

      // Supports the new API shape:
      // { active: [...], deleted: [...] }
      // and keeps backward compatibility if the API still returns an array.
      if (Array.isArray(result)) {
        setNeeds(result);
        setDeletedNeeds([]);
      } else {
        setNeeds(
          Array.isArray(result?.active)
            ? result.active
            : []
        );

        setDeletedNeeds(
          Array.isArray(result?.deleted)
            ? result.deleted
            : []
        );
      }
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
        "Move this request to Recently Deleted?\n\nYou can recover it within 24 hours."
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
        "Delete request failed. Please try again."
      );
      return;
    }

    const deletedItem =
      needs.find(
        (item) =>
          getNeedId(item) === id
      );

    setNeeds((current) =>
      current.filter(
        (item) =>
          getNeedId(item) !== id
      )
    );

    if (deletedItem) {
      setDeletedNeeds((current) => [
        {
          ...deletedItem,
          isDeleted: true,
          deletedAt:
            new Date().toISOString(),
        },
        ...current.filter(
          (item) =>
            getNeedId(item) !== id
        ),
      ]);
    }
  };

  const handleRestore = async (
    id
  ) => {
    if (!id) return;

    const confirmRestore =
      window.confirm(
        "Recover this request?\n\nIt will be moved back to My Needs."
      );

    if (!confirmRestore) {
      return;
    }

    setRestoringId(id);

    const result =
      await restoreMyNeed(id);

    setRestoringId("");

    if (!result?.success) {
      window.alert(
        result?.message ||
          "Recover failed. Please try again."
      );
      return;
    }

    const restored =
      result?.data ||
      result?.need ||
      deletedNeeds.find(
        (item) =>
          getNeedId(item) === id
      );

    setDeletedNeeds((current) =>
      current.filter(
        (item) =>
          getNeedId(item) !== id
      )
    );

    if (restored) {
      setNeeds((current) => [
        restored,
        ...current.filter(
          (item) =>
            getNeedId(item) !== id
        ),
      ]);
    }
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
                    {needs.length} active request
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

                {needs.length > 0 && (
                  <div
                    className="
                      grid
                      grid-cols-1
                      items-stretch
                      gap-5
                      sm:grid-cols-2
                      xl:grid-cols-4
                    "
                  >
                    {needs.map(
                      (item) => {
                        const id =
                          getNeedId(item);

                        return (
                          <div
                            key={
                              id ||
                              `${item.type}-${item.createdAt}`
                            }
                            className={
                              deletingId === id
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          >
                            <NeedCard
                              item={item}
                              onDelete={handleDelete}
                            />
                          </div>
                        );
                      }
                    )}
                  </div>
                )}

                {deletedNeeds.length > 0 && (
                  <section className="mt-12">
                    <div
                      className="
                        mb-5 rounded-3xl
                        border border-red-200
                        bg-red-50
                        p-5
                      "
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-lg font-black text-red-800">
                            Recently Deleted
                          </div>
                          <div className="mt-1 text-xs font-medium text-red-700/70">
                            சமீபத்தில் நீக்கப்பட்டவை
                          </div>
                          <div className="mt-2 text-xs text-red-700">
                            Recover within 24 hours. After 24 hours,
                            the request is permanently removed automatically.
                          </div>
                        </div>

                        <div className="rounded-full bg-red-600 px-4 py-2 text-[10px] font-black uppercase text-white">
                          24 Hours Recovery
                        </div>
                      </div>
                    </div>

                    <div
                      className="
                        grid
                        grid-cols-1
                        items-stretch
                        gap-5
                        sm:grid-cols-2
                        xl:grid-cols-4
                      "
                    >
                      {deletedNeeds.map(
                        (item) => {
                          const id =
                            getNeedId(item);

                          return (
                            <div
                              key={
                                `deleted-${id || item.createdAt}`
                              }
                              className={
                                restoringId === id
                                  ? "pointer-events-none opacity-60"
                                  : ""
                              }
                            >
                              <NeedCard
                                item={item}
                                isDeleted
                                restoring={
                                  restoringId === id
                                }
                                onDelete={
                                  handleDelete
                                }
                                onRestore={
                                  handleRestore
                                }
                              />
                            </div>
                          );
                        }
                      )}
                    </div>
                  </section>
                )}
              </>
            )}
        </div>
      </section>
    </main>
  );
}