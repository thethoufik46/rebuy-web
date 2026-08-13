// src/components/BikeGridSection.jsx

import React, {
  memo,
  useCallback,
  useMemo,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import BikeCard from "@/components/BikeCard";

/* =========================================================
   HELPERS
========================================================= */

const extractId = (value) => {
  if (!value) return "";

  if (
    typeof value === "object"
  ) {
    if (value.$oid) {
      return String(
        value.$oid
      );
    }

    if (value._id) {
      return String(
        value._id
      );
    }
  }

  return String(value);
};

const getBrandName = (
  bike
) => {
  const brand =
    bike?.brand;

  if (
    typeof brand ===
      "object" &&
    brand?.name
  ) {
    return String(
      brand.name
    );
  }

  if (
    typeof brand ===
    "string"
  ) {
    return brand;
  }

  return "";
};

const getBrandLogo = (
  bike
) => {
  const brand =
    bike?.brand;

  if (
    typeof brand ===
      "object" &&
    brand?.logo
  ) {
    return String(
      brand.logo
    );
  }

  return "";
};

const isVisible = (
  bike
) => {
  const status =
    String(
      bike?.status || ""
    ).toLowerCase();

  return (
    status !== "draft" &&
    status !== "drift"
  );
};

const getModelName = (
  bike
) => {
  const model =
    bike?.model;

  if (!model) {
    return "";
  }

  if (
    typeof model ===
    "string"
  ) {
    return model;
  }

  if (
    typeof model ===
    "object"
  ) {
    if (
      model.modelName
    ) {
      return String(
        model.modelName
      );
    }

    if (model.name) {
      return String(
        model.name
      );
    }
  }

  return extractId(
    model
  );
};

/* =========================================================
   BIKE ITEM
   ---------------------------------------------------------
   Memo prevents unrelated grid renders.
========================================================= */

const BikeGridItem = memo(
  function BikeGridItem({
    bike,
    currentTab,
    onOpen,
  }) {
    const bikeId =
      extractId(
        bike?._id
      );

    if (!bikeId) {
      return null;
    }

    return (
      <div
        onClick={() =>
          onOpen(
            bikeId,
            bike
          )
        }
        className="
          min-w-0
          cursor-pointer
          aspect-[0.72]
          xl:aspect-[0.78]
        "
      >
        <BikeCard
          bikeId={bikeId}
          brandName={getBrandName(
            bike
          )}
          brandLogoUrl={getBrandLogo(
            bike
          )}
          model={getModelName(
            bike
          )}
          variant={
            bike?.variant ||
            ""
          }
          imageUrl={
            bike?.bannerImage ||
            ""
          }
          price={
            bike?.price != null
              ? String(
                  bike.price
                )
              : "0"
          }
          year={
            bike?.year != null
              ? String(
                  bike.year
                )
              : "-"
          }
          status={
            bike?.status ||
            "available"
          }
          km={
            bike?.km != null
              ? String(
                  bike.km
                )
              : "0"
          }
          owner={
            bike?.owner != null
              ? String(
                  bike.owner
                )
              : "1"
          }
          district={
            bike?.district ||
            ""
          }
          city={
            bike?.city ||
            ""
          }
        />
      </div>
    );
  }
);

/* =========================================================
   VIEW ALL BUTTON
   ---------------------------------------------------------
   Memoized to avoid unnecessary renders.
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
            View All Bikes
          </span>

          <span
            className="
              flex
              h-7
              w-7
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
   MAIN
========================================================= */

function BikeGridSection({
  bikes = [],
  onViewAll,
  showViewAllButton = false,
}) {
  const navigate =
    useNavigate();

  const [
    searchParams,
  ] = useSearchParams();

  const currentTab =
    searchParams.get(
      "tab"
    ) || "1";

  /* =======================================================
     ONLY FIRST 6
     -------------------------------------------------------
     No unnecessary cards in DOM.
  ======================================================= */

  const bikesToShow =
    useMemo(() => {
      if (
        !Array.isArray(
          bikes
        )
      ) {
        return [];
      }

      const visible =
        [];

      for (
        let i = 0;
        i < bikes.length &&
        visible.length < 6;
        i++
      ) {
        const bike =
          bikes[i];

        if (
          isVisible(bike)
        ) {
          visible.push(
            bike
          );
        }
      }

      return visible;
    }, [bikes]);

  /* =======================================================
     NAVIGATION
     -------------------------------------------------------
     useCallback keeps the function stable.
  ======================================================= */

  const handleOpen =
    useCallback(
      (
        bikeId,
        bike
      ) => {
        navigate(
          `/bike/${bikeId}?tab=${encodeURIComponent(
            currentTab
          )}`,
          {
            state: {
              bike,
            },
          }
        );
      },
      [
        navigate,
        currentTab,
      ]
    );

  /* =======================================================
     EMPTY
  ======================================================= */

  if (
    bikesToShow.length ===
    0
  ) {
    return null;
  }

  /* =======================================================
     GRID
     -------------------------------------------------------
     No Framer Motion.
     No stagger.
     No opacity animation.
     No transform animation.
  ======================================================= */

  return (
    <section className="w-full">
      <div
        className="
          grid
          grid-cols-2
          gap-x-3
          gap-y-[14px]
          md:grid-cols-4
          lg:grid-cols-6
        "
      >
        {bikesToShow.map(
          (bike) => {
            const id =
              extractId(
                bike?._id
              );

            if (!id) {
              return null;
            }

            return (
              <BikeGridItem
                key={id}
                bike={bike}
                currentTab={
                  currentTab
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
          onClick={
            onViewAll
          }
        />
      )}
    </section>
  );
}

/* =========================================================
   FINAL EXPORT
========================================================= */

export default memo(
  BikeGridSection
);