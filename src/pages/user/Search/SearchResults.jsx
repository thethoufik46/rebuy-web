import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import CarGridSection from "@/pages/user/home/Pages/car/CarGridSection";

export default function SearchResults() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const query =
    location.state?.query ||
    "";

  const filteredCars =
    Array.isArray(
      location.state?.filteredCars
    )
      ? location.state.filteredCars
      : [];

  return (
    <div
      className="
        min-h-screen
        w-full
        bg-[#F5F2FF]
      "
    >
      {/* HEADER */}

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-black/[0.05]
          bg-white/90
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            h-[68px]
            max-w-[1400px]
            items-center
            gap-3
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-black/[0.04]
              hover:bg-black/[0.08]
            "
          >
            ←
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold">
              Search Results
            </h1>

            {query && (
              <p className="truncate text-[11px] text-black/40">
                "{query}"
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/home")
            }
            className="
              rounded-full
              border
              border-black/[0.06]
              bg-white
              px-4
              py-2.5
              text-xs
              font-medium
              shadow-sm
            "
          >
            🏠 Home
          </button>
        </div>
      </header>

      {/* CONTENT */}

      <main
        className="
          mx-auto
          w-full
          max-w-[1400px]
          px-3
          py-5
          sm:px-5
          lg:px-8
        "
      >
        <div
          className="
            mb-5
            flex
            items-end
            justify-between
            gap-3
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-bold
                sm:text-xl
              "
            >
              Results for{" "}
              <span>
                "{query}"
              </span>
            </h2>

            <p className="mt-1 text-xs text-black/45">
              {filteredCars.length}{" "}
              {filteredCars.length === 1
                ? "vehicle"
                : "vehicles"}{" "}
              found
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/home")
            }
            className="
              rounded-full
              bg-black
              px-5
              py-2.5
              text-xs
              font-semibold
              text-white
            "
          >
            Search Again
          </button>
        </div>

        {filteredCars.length ===
        0 ? (
          <div
            className="
              flex
              min-h-[55vh]
              flex-col
              items-center
              justify-center
              rounded-3xl
              bg-white/60
              text-center
            "
          >
            <div className="text-4xl">
              🔍
            </div>

            <h3 className="mt-4 text-lg font-bold">
              No vehicles found
            </h3>

            <p className="mt-1 text-sm text-black/40">
              Try another brand,
              model or variant.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/home")
              }
              className="
                mt-5
                rounded-full
                bg-black
                px-6
                py-3
                text-sm
                font-semibold
                text-white
              "
            >
              Back to Home
            </button>
          </div>
        ) : (
          <CarGridSection
            cars={filteredCars}
            showViewAllButton={false}
          />
        )}
      </main>
    </div>
  );
}