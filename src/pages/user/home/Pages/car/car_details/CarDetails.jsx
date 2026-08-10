import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import CarTopbar from "./CarTopbar";
import CarGallery from "./CarGallery";
import CarBottomDetails from "./CarBottomDetails";
import CarActionButton from "./CarActionButton";

import CarCard from "@/components/CarCard";

import {
  getCarById,
  getFilteredCars,
} from "@/services/carFilterApi";

/* =========================================================
   SAFE STRING
========================================================= */

const asString = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  if (
    typeof value === "object"
  ) {
    if (value.name) {
      return String(value.name);
    }

    if (value.title) {
      return String(value.title);
    }

    if (value.variantName) {
      return String(value.variantName);
    }

    if (value.$oid) {
      return String(value.$oid);
    }

    if (value._id) {
      return String(value._id);
    }

    if (
      Array.isArray(value) &&
      value.length > 0
    ) {
      return asString(value[0]);
    }

    return "";
  }

  return String(value);
};

/* =========================================================
   EXTRACT ID
========================================================= */

const extractId = (value) => {
  if (!value) {
    return "";
  }

  if (
    typeof value === "object"
  ) {
    if (value.$oid) {
      return String(value.$oid);
    }

    if (value._id) {
      return String(value._id);
    }

    if (value.id) {
      return String(value.id);
    }
  }

  return String(value);
};

/* =========================================================
   BRAND NAME
========================================================= */

const getBrandName = (car) => {
  const brand = car?.brand;

  if (
    brand &&
    typeof brand === "object"
  ) {
    return String(
      brand.name ||
      brand.brandName ||
      ""
    );
  }

  return brand
    ? String(brand)
    : "";
};

/* =========================================================
   IMAGE URL
========================================================= */

const getImageUrl = (value) => {
  if (!value) {
    return "";
  }

  if (
    typeof value === "string"
  ) {
    return value.trim();
  }

  if (
    typeof value === "object"
  ) {
    return String(
      value.url ||
      value.secure_url ||
      value.src ||
      value.path ||
      value.imageUrl ||
      ""
    );
  }

  return "";
};

/* =========================================================
   COMPONENT
========================================================= */

export default function CarDetails() {
  const navigate = useNavigate();

  const location = useLocation();

  const { carId } = useParams();

  const [searchParams] =
    useSearchParams();

  /* =======================================================
     TAB
  ======================================================= */

  const tab =
    searchParams.get("tab") || "0";

  /* =======================================================
     SEARCH CONTEXT

     SearchResults -> CarDetails
     stores these values in location.state
  ======================================================= */

  const fromSearch =
    location.state?.fromSearch === true;

  const searchQuery =
    location.state?.searchQuery || "";

  const searchCars =
    Array.isArray(
      location.state?.searchCars
    )
      ? location.state.searchCars
      : [];

  /* =======================================================
     CAR STATE
  ======================================================= */

  const [car, setCar] =
    useState(
      location.state?.car || null
    );

  const [loading, setLoading] =
    useState(
      !location.state?.car
    );

  /* =======================================================
     GALLERY
  ======================================================= */

  const [
    galleryImages,
    setGalleryImages,
  ] = useState([]);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  /* =======================================================
     SIMILAR CARS
  ======================================================= */

  const [
    similarCars,
    setSimilarCars,
  ] = useState([]);

  const [
    similarLoading,
    setSimilarLoading,
  ] = useState(true);

  /* =======================================================
     AUTO SLIDE TIMER
  ======================================================= */

  const autoTimerRef =
    useRef(null);

  /* =======================================================
     FETCH CAR
  ======================================================= */

  useEffect(() => {
    let active = true;

    if (car) {
      setLoading(false);
      return;
    }

    const loadCar =
      async () => {
        try {
          setLoading(true);

          const result =
            await getCarById(carId);

          if (active) {
            setCar(
              result || null
            );
          }
        } catch (error) {
          console.error(
            "Car details fetch error:",
            error
          );
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

    loadCar();

    return () => {
      active = false;
    };
  }, [carId, car]);

  /* =======================================================
     STOP AUTO SLIDE
  ======================================================= */

  const stopAutoSlide =
    useCallback(() => {
      if (
        autoTimerRef.current
      ) {
        clearInterval(
          autoTimerRef.current
        );

        autoTimerRef.current = null;
      }
    }, []);

  /* =======================================================
     START AUTO SLIDE
  ======================================================= */

  const startAutoSlide =
    useCallback(
      (length) => {
        stopAutoSlide();

        if (length <= 1) {
          return;
        }

        autoTimerRef.current =
          setInterval(() => {
            setCurrentIndex(
              (previous) =>
                (previous + 1) %
                length
            );
          }, 4000);
      },
      [stopAutoSlide]
    );

  /* =======================================================
     BUILD GALLERY
  ======================================================= */

  useEffect(() => {
    if (!car) {
      return;
    }

    const banner =
      getImageUrl(
        car.bannerImage
      );

    const rawGallery =
      Array.isArray(
        car.galleryImages
      )
        ? car.galleryImages
        : [];

    const gallery =
      rawGallery
        .map(getImageUrl)
        .filter(Boolean);

    const images = [];

    if (banner) {
      images.push(banner);
    }

    gallery.forEach(
      (image) => {
        if (
          image &&
          image !== banner
        ) {
          images.push(image);
        }
      }
    );

    /* No image fallback */

    if (images.length === 0) {
      images.push(
        "https://via.placeholder.com/800x500?text=No+Image"
      );
    }

    setGalleryImages(
      images
    );

    setCurrentIndex(0);

    startAutoSlide(
      images.length
    );

    return () => {
      stopAutoSlide();
    };
  }, [
    car,
    startAutoSlide,
    stopAutoSlide,
  ]);

  /* =======================================================
     CLEAN TIMER
  ======================================================= */

  useEffect(() => {
    return () => {
      stopAutoSlide();
    };
  }, [stopAutoSlide]);

  /* =======================================================
     LOAD SIMILAR CARS
  ======================================================= */

  const loadSimilarCars =
    useCallback(
      async () => {
        if (!car) {
          return;
        }

        setSimilarLoading(true);

        try {
          const brand =
            getBrandName(car);

          const currentId =
            extractId(
              car?._id ||
              car?.id ||
              car?.carId
            );

          if (!brand) {
            setSimilarCars([]);
            return;
          }

          const result =
            await getFilteredCars({
              brand,
            });

          const list =
            Array.isArray(result)
              ? result
              : [];

          const filtered =
            list.filter(
              (item) => {
                const id =
                  extractId(
                    item?._id ||
                    item?.id ||
                    item?.carId
                  );

                return id !== currentId;
              }
            );

          setSimilarCars(
            filtered.slice(0, 10)
          );
        } catch (error) {
          console.error(
            "Similar cars error:",
            error
          );

          setSimilarCars([]);
        } finally {
          setSimilarLoading(false);
        }
      },
      [car]
    );

  useEffect(() => {
    loadSimilarCars();
  }, [loadSimilarCars]);

  /* =======================================================
     BACK HANDLER

     SEARCH:
       Search Results
            ↓
        Car Details
            ↓
           Back
            ↓
       Search Results

     NORMAL:
       Home
         ↓
      Details
         ↓
        Back
         ↓
       Home
  ======================================================= */

  const handleBack = () => {
    if (fromSearch) {
      navigate(
        "/search-results",
        {
          state: {
            query: searchQuery,
            filteredCars: searchCars,
          },
        }
      );

      return;
    }

    navigate(
      `/home?tab=${tab}`
    );
  };

  /* =======================================================
     SIMILAR CAR OPEN
  ======================================================= */

  const openSimilarCar =
    (similarCar) => {
      const id =
        extractId(
          similarCar?._id ||
          similarCar?.id ||
          similarCar?.carId
        );

      if (!id) {
        console.error(
          "Similar car ID missing:",
          similarCar
        );

        return;
      }

      navigate(
        `/car/${encodeURIComponent(
          id
        )}?tab=${tab}`,
        {
          state: {
            car: similarCar,

            /*
             * Keep search context.
             * This means:
             *
             * Search Result
             *      ↓
             * Details A
             *      ↓
             * Similar B
             *      ↓
             * Back
             *      ↓
             * Search Results
             */

            fromSearch,

            searchQuery,

            searchCars,
          },
        }
      );
    };

  /* =======================================================
     LOADING UI
  ======================================================= */

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          w-full
          bg-white
          flex
          items-center
          justify-center
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            gap-3
          "
        >
          <div
            className="
              h-8
              w-8
              rounded-full
              border-2
              border-black/10
              border-t-black
              animate-spin
            "
          />

          <p
            className="
              text-sm
              text-black/50
            "
          >
            Loading car...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!car) {
    return (
      <div
        className="
          min-h-screen
          w-full
          bg-white
          flex
          flex-col
          items-center
          justify-center
          text-center
          px-5
        "
      >
        <div className="text-5xl">
          🚗
        </div>

        <h2
          className="
            mt-4
            text-xl
            font-bold
          "
        >
          Car not found
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-black/45
          "
        >
          This car may have been
          removed or is no longer
          available.
        </p>

        <button
          type="button"
          onClick={handleBack}
          className="
            mt-6
            rounded-full
            bg-black
            px-7
            py-3
            text-sm
            font-semibold
            text-white
            active:scale-95
          "
        >
          Go Back
        </button>
      </div>
    );
  }

  /* =======================================================
     BRAND
  ======================================================= */

  const brand =
    getBrandName(car);

  /* =======================================================
     FINAL UI
  ======================================================= */

  return (
    <div
      className="
        min-h-screen
        w-full
        bg-white
      "
    >

      {/* ===================================================
          BACK BAR
      =================================================== */}

      <div
        className="
          sticky
          top-0
          z-[100]
          flex
          min-h-[56px]
          items-center
          gap-2
          border-b
          border-black/[0.05]
          bg-white/90
          px-3
          backdrop-blur-xl
        "
      >

        {/* BACK */}

        <button
          type="button"
          onClick={handleBack}
          aria-label="Back"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-black/[0.05]
            text-xl
            text-black
            transition
            hover:bg-black/[0.09]
            active:scale-95
          "
        >
          ←
        </button>

        {/* SEARCH CONTEXT */}

        {fromSearch ? (
          <div
            className="
              min-w-0
              flex-1
            "
          >
            <p
              className="
                truncate
                text-xs
                font-semibold
                text-black/60
              "
            >
              Search Results
            </p>

            {searchQuery && (
              <p
                className="
                  truncate
                  text-[10px]
                  text-black/35
                "
              >
                "{searchQuery}"
              </p>
            )}
          </div>
        ) : (
          <div className="flex-1" />
        )}

      </div>

      {/* ===================================================
          EXISTING CAR TOP BAR
      =================================================== */}

      <CarTopbar car={car} />

      {/* ===================================================
          PAGE BODY
      =================================================== */}

      <div className="pb-10">

        {/* =================================================
            GALLERY
        ================================================= */}

        <CarGallery
          galleryImages={
            galleryImages
          }
          isLoading={false}
          currentIndex={
            currentIndex
          }
          onPageChange={
            setCurrentIndex
          }
        />

        {/* SPACE */}

        <div className="mt-5" />

        {/* =================================================
            DETAILS BOX
        ================================================= */}

        <div
          className="
            mx-4
            rounded-2xl
            bg-[#FFF3CD]
            p-5
          "
        >

          <CarBottomDetails
            car={car}
          />

          <div className="h-5" />

          <CarActionButton />

        </div>

        {/* SPACE */}

        <div className="h-7" />

        {/* =================================================
            SIMILAR TITLE
        ================================================= */}

        <div className="px-4">

          <h2
            className="
              text-lg
              font-extrabold
              text-black
            "
          >
            More{" "}
            {brand || "Cars"}{" "}
            Cars
          </h2>

        </div>

        {/* =================================================
            SIMILAR CARS
        ================================================= */}

        <div className="mt-3">

          {similarLoading ? (
            <div
              className="
                flex
                justify-center
                py-10
                text-sm
                text-black/45
              "
            >
              Loading...
            </div>
          ) : similarCars.length === 0 ? (
            <div
              className="
                py-10
                text-center
                text-sm
                text-black/50
              "
            >
              No Similar Cars Found
            </div>
          ) : (
            <div
              className="
                overflow-x-auto
                px-4
                pb-4
                scrollbar-hide
              "
            >

              <div
                className="
                  flex
                  gap-3
                "
                style={{
                  width:
                    "max-content",
                }}
              >

                {similarCars.map(
                  (
                    similarCar,
                    index
                  ) => {

                    const id =
                      extractId(
                        similarCar?._id ||
                        similarCar?.id ||
                        similarCar?.carId
                      );

                    if (!id) {
                      return null;
                    }

                    return (
                      <div
                        key={
                          id ||
                          `similar-${index}`
                        }
                        className="
                          w-44
                          shrink-0
                        "
                      >

                        <CarCard
                          carId={id}

                          brandName={
                            getBrandName(
                              similarCar
                            )
                          }

                          brandLogoUrl={
                            similarCar
                              ?.brand
                              ?.logo ||
                            ""
                          }

                          variant={
                            similarCar
                              ?.variant
                              ?.variantName ||
                            similarCar
                              ?.variant
                              ?.name ||
                            similarCar
                              ?.variantName ||
                            similarCar
                              ?.variant ||
                            ""
                          }

                          model={
                            similarCar
                              ?.model
                              ?.name ||
                            similarCar
                              ?.model
                              ?.modelName ||
                            similarCar
                              ?.model ||
                            ""
                          }

                          imageUrl={
                            getImageUrl(
                              similarCar
                                ?.bannerImage
                            ) ||
                            getImageUrl(
                              similarCar
                                ?.imageUrl
                            ) ||
                            getImageUrl(
                              similarCar
                                ?.image
                            )
                          }

                          price={
                            similarCar?.price ??
                            "0"
                          }

                          fuel={
                            similarCar?.fuel ||
                            similarCar?.fuelType ||
                            ""
                          }

                          year={
                            similarCar?.year ||
                            "-"
                          }

                          status={
                            similarCar?.status ||
                            "available"
                          }

                          km={
                            similarCar?.km ??
                            similarCar?.kilometers ??
                            "0"
                          }

                          owner={
                            similarCar?.owner ||
                            "1"
                          }

                          transmission={
                            similarCar
                              ?.transmission ||
                            "Manual"
                          }

                          district={
                            similarCar?.district ||
                            ""
                          }

                          city={
                            similarCar?.city ||
                            ""
                          }

                          onTap={() =>
                            openSimilarCar(
                              similarCar
                            )
                          }
                        />

                      </div>
                    );
                  }
                )}

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}