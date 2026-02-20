import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = "https://rebuy-api.onrender.com/api";

const s = (v) => (v ? v.toString() : "");

const withComma = (num) =>
  parseInt(num || 0).toLocaleString("en-IN");

export default function HomeOwnCardButtonsFilter() {
  const { variant } = useParams();
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!variant) return;
    fetchCars();
  }, [variant]);

  const fetchCars = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${BASE_URL}/cars/variant-board?variant=${variant}&board=own`
      );

      const data = await res.json();

      setCars(data.cars || []);
    } catch (e) {
      console.log("Variant filter error 👉", e);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5FF]">
      {/* APP BAR */}
      <div className="sticky top-0 bg-white px-4 py-3 shadow-sm z-10 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-sm"
        >
          ←
        </button>

        <h1 className="text-base font-semibold">
          {s(variant).toUpperCase()}
        </h1>
      </div>

      {/* BODY */}
      <div className="p-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="loader" />
          </div>
        ) : cars.length === 0 ? (
          <div className="flex justify-center py-10 text-black/60">
            No cars found
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cars.map((car) => {
              const variantTitle = s(car.variant?.title);

              return (
                <div
                  key={car._id}
                  className="bg-white rounded-xl shadow-sm flex items-center p-2.5"
                  style={{
                    boxShadow:
                      "0 4px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="w-[70px] h-[60px] rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={s(car.bannerImage)}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.target.style.display = "none")
                      }
                    />
                  </div>

                  <div className="flex-1 px-3">
                    <div className="text-sm font-semibold truncate">
                      {variantTitle}
                    </div>

                    <div className="text-xs text-black/60 mt-1">
                      {s(car.fuel)} •{" "}
                      {s(car.transmission)}
                    </div>
                  </div>

                  <div className="text-sm font-bold">
                    ₹{withComma(car.price)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .loader {
          width: 26px;
          height: 26px;
          border: 2px solid rgba(0,0,0,0.15);
          border-top: 2px solid black;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}