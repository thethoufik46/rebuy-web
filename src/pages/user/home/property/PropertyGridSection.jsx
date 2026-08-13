// src/pages/user/home/property/PropertyGridSection.jsx

import React, {
  memo,
  useCallback,
  useMemo,
} from "react";

import { useNavigate } from "react-router-dom";

import PropertyCard from "@/components/PropertyCard";

/* =========================================================
   VISIBILITY
========================================================= */

const isVisible = (property) => {
  const status = String(
    property?.status || ""
  ).toLowerCase();

  return (
    status !== "draft" &&
    status !== "drift"
  );
};

/* =========================================================
   PROPERTY ITEM
   ---------------------------------------------------------
   Memoized so unchanged cards don't re-render.
========================================================= */

const PropertyGridItem = memo(
  function PropertyGridItem({
    property,
    onOpen,
  }) {
    const id =
      property?._id;

    if (!id) {
      return null;
    }

    return (
      <div
        className="
          min-w-0
          cursor-pointer
          aspect-[0.72]
          xl:aspect-[0.78]
        "
        onClick={() =>
          onOpen(
            id,
            property
          )
        }
      >
        <PropertyCard
          propertyId={id}
          mainType={
            property?.mainType
          }
          category={
            property?.category
          }
          price={
            property?.price
          }
          imageUrl={
            property?.bannerImage
          }
          status={
            property?.status
          }
          district={
            property?.district
          }
          city={
            property?.city
          }
          bedrooms={
            property?.bedrooms
          }
          landArea={
            property?.landArea
          }
          direction={
            property?.direction
          }
        />
      </div>
    );
  }
);

/* =========================================================
   STATIC LOADING
   ---------------------------------------------------------
   No shimmer.
   No animation.
   No Framer Motion.
========================================================= */

const PropertyLoading = memo(
  function PropertyLoading({
    showViewAllButton,
    onViewAll,
  }) {
    return (
      <div className="space-y-3">
        <div
          className="
            grid
            grid-cols-2
            gap-x-3
            gap-y-3.5
            md:grid-cols-4
            lg:grid-cols-6
          "
        >
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="
                aspect-[0.72]
                overflow-hidden
                rounded-[22px]
                bg-white
                shadow-[0_5px_18px_rgba(15,23,42,0.05)]
                xl:aspect-[0.78]
              "
            >
              <div
                className="
                  h-[62%]
                  w-full
                  bg-slate-100
                "
              />

              <div
                className="
                  space-y-2
                  px-3
                  py-3
                "
              >
                <div
                  className="
                    h-4
                    w-24
                    rounded-full
                    bg-slate-100
                  "
                />

                <div
                  className="
                    h-3
                    w-[72%]
                    rounded-full
                    bg-slate-100
                  "
                />

                <div
                  className="
                    h-2.5
                    w-[58%]
                    rounded-full
                    bg-slate-100
                  "
                />

                <div
                  className="
                    h-2.5
                    w-[68%]
                    rounded-full
                    bg-slate-100
                  "
                />
              </div>
            </div>
          ))}
        </div>

        {showViewAllButton && (
          <ViewAllButton
            onClick={onViewAll}
          />
        )}
      </div>
    );
  }
);

/* =========================================================
   VIEW ALL
========================================================= */

const ViewAllButton = memo(
  function ViewAllButton({
    onClick,
  }) {
    return (
      <div className="py-[14px]">
        <button
          type="button"
          onClick={onClick}
          className="
            flex
            h-[42px]
            w-full
            items-center
            justify-between
            rounded-[18px]
            bg-white/45
            px-[25px]
            active:scale-[0.99]
          "
        >
          <span
            className="
              text-xs
              font-semibold
              text-black
            "
          >
            View All Properties
            {" "}
            (வீடு & நிலம்)
          </span>

          <span
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white/60
              text-sm
              text-black
            "
          >
            →
          </span>
        </button>
      </div>
    );
  }
);

/* =========================================================
   MAIN COMPONENT
========================================================= */

function PropertyGridSection({
  properties = [],
  showViewAllButton = false,
  onViewAll,
  loading = false,
}) {
  const navigate =
    useNavigate();

  /* =======================================================
     FIRST 6 VISIBLE PROPERTIES
     -------------------------------------------------------
     Avoids filtering the entire array + slice separately.
  ======================================================= */

  const visibleProperties =
    useMemo(() => {
      if (
        !Array.isArray(
          properties
        )
      ) {
        return [];
      }

      const result = [];

      for (
        let index = 0;
        index <
          properties.length &&
        result.length < 6;
        index++
      ) {
        const property =
          properties[index];

        if (
          isVisible(
            property
          )
        ) {
          result.push(
            property
          );
        }
      }

      return result;
    }, [properties]);

  /* =======================================================
     NAVIGATION
     -------------------------------------------------------
     Stable callback.
  ======================================================= */

  const handleOpen =
    useCallback(
      (
        propertyId,
        property
      ) => {
        navigate(
          `/property/${propertyId}`,
          {
            state: {
              property,
            },
          }
        );
      },
      [navigate]
    );

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <PropertyLoading
        showViewAllButton={
          showViewAllButton
        }
        onViewAll={
          onViewAll
        }
      />
    );
  }

  /* =======================================================
     EMPTY
  ======================================================= */

  if (
    visibleProperties.length ===
    0
  ) {
    return null;
  }

  /* =======================================================
     GRID
     -------------------------------------------------------
     NO:
     - Framer Motion
     - stagger
     - opacity animation
     - translate animation
     - shimmer
  ======================================================= */

  return (
    <div className="space-y-3">
      <div
        className="
          grid
          grid-cols-2
          gap-x-3
          gap-y-3.5
          md:grid-cols-4
          lg:grid-cols-6
        "
      >
        {visibleProperties.map(
          (property) => {
            const id =
              property?._id;

            if (!id) {
              return null;
            }

            return (
              <PropertyGridItem
                key={id}
                property={
                  property
                }
                onOpen={
                  handleOpen
                }
              />
            );
          }
        )}
      </div>

      {/* =================================================
          VIEW ALL
      ================================================= */}

      {showViewAllButton && (
        <ViewAllButton
          onClick={onViewAll}
        />
      )}
    </div>
  );
}

/* =========================================================
   FINAL EXPORT
========================================================= */

export default memo(
  PropertyGridSection
);