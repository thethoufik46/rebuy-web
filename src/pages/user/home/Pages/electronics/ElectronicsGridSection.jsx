// src/pages/user/home/Pages/electronics/ElectronicsGridSection.jsx

import React, {
  memo,
  useCallback,
  useMemo,
} from "react";

import { useNavigate } from "react-router-dom";

import ElectronicsCard from "@/components/ElectronicsCard";

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

const isVisible = (item) => {
  const status = String(
    item?.status || ""
  ).toLowerCase();

  return (
    status !== "draft" &&
    status !== "drift"
  );
};

const getElectronicsId = (
  item
) => {
  return extractId(
    item?.electronicsId ||
      item?._id
  );
};

const getImageUrl = (
  item
) => {
  if (
    item?.bannerImage
  ) {
    return item.bannerImage;
  }

  const gallery =
    item?.galleryImages;

  if (
    Array.isArray(gallery) &&
    gallery.length > 0
  ) {
    return gallery[0];
  }

  return "";
};

/* =========================================================
   ELECTRONICS ITEM
   ---------------------------------------------------------
   Memoized card wrapper.
========================================================= */

const ElectronicsGridItem =
  memo(
    function ElectronicsGridItem({
      item,
      onOpen,
    }) {
      const id =
        getElectronicsId(
          item
        );

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
              item
            )
          }
        >
          <ElectronicsCard
            electronicsId={id}
            brand={
              item?.brand
            }
            title={
              item?.title
            }
            imageUrl={getImageUrl(
              item
            )}
            price={
              item?.price
            }
            category={
              item?.category
            }
            status={
              item?.status
            }
            sellerInfo={
              item?.sellerinfo
            }
            district={
              item?.district
            }
            city={
              item?.city
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

const ElectronicsLoading =
  memo(
    function ElectronicsLoading({
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
            }).map(
              (_, index) => (
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
                        w-[76%]
                        rounded-full
                        bg-slate-100
                      "
                    />

                    <div
                      className="
                        h-2.5
                        w-[66%]
                        rounded-full
                        bg-slate-100
                      "
                    />
                  </div>
                </div>
              )
            )}
          </div>

          {showViewAllButton && (
            <ViewAllButton
              onClick={
                onViewAll
              }
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
            View All Electronics
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
   MAIN GRID
========================================================= */

function ElectronicsGridSection({
  electronics = [],
  showViewAllButton = false,
  onViewAll,
  loading = false,
}) {
  const navigate =
    useNavigate();

  /* =======================================================
     ONLY FIRST 6 VISIBLE ITEMS
     -------------------------------------------------------
     Avoids creating unnecessary card components.
  ======================================================= */

  const displayedItems =
    useMemo(() => {
      if (
        !Array.isArray(
          electronics
        )
      ) {
        return [];
      }

      const result = [];

      for (
        let index = 0;
        index <
          electronics.length &&
        result.length < 6;
        index++
      ) {
        const item =
          electronics[index];

        if (
          isVisible(item)
        ) {
          result.push(
            item
          );
        }
      }

      return result;
    }, [electronics]);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const handleOpen =
    useCallback(
      (
        id
      ) => {
        navigate(
          `/electronics/${id}`
        );
      },
      [navigate]
    );

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <ElectronicsLoading
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
    displayedItems.length ===
    0
  ) {
    return null;
  }

  /* =======================================================
     RENDER
     -------------------------------------------------------
     NO:
     - Framer Motion
     - stagger
     - shimmer
     - blur
     - fade
     - translate animation
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
        {displayedItems.map(
          (item) => {
            const id =
              getElectronicsId(
                item
              );

            if (!id) {
              return null;
            }

            return (
              <ElectronicsGridItem
                key={id}
                item={item}
                onOpen={
                  handleOpen
                }
              />
            );
          }
        )}
      </div>

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
  ElectronicsGridSection
);