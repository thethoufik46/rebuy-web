// src/pages/user/home/Pages/car/VariantAll.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllVariants } from '@/services/carVariantApi';
import API from '@/services/api';
import AppBar from '@/components/AppBar'; // ✅ reusable AppBar

const safeString = (value) => (value?.toString() || '').toLowerCase();

const brandColors = [
  'bg-blue-100 text-blue-800',
  'bg-pink-100 text-pink-800',
  'bg-green-100 text-green-800',
  'bg-orange-100 text-orange-800',
  'bg-purple-100 text-purple-800',
  'bg-teal-100 text-teal-800',
];

const VariantAll = () => {
  const navigate = useNavigate();

  const [variants, setVariants] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBrands, setExpandedBrands] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [variantsData, carsResponse] = await Promise.all([
          getAllVariants(),
          API.get('/cars'),
        ]);
        setVariants(variantsData);
        setAllCars(carsResponse.data?.cars || []);
      } catch (err) {
        console.error('VariantAll fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const variantCount = (variantName) => {
    const key = variantName.toLowerCase();
    return allCars.filter((car) => {
      const brand = safeString(car.brand?.name ?? car.brand);
      const model = safeString(car.model);
      const variant = safeString(car.variant);
      return brand.includes(key) || model.includes(key) || variant.includes(key);
    }).length;
  };

  const openResult = (keyword) => {
    const key = keyword.toLowerCase();
    const filtered = allCars.filter((car) => {
      const brand = safeString(car.brand?.name ?? car.brand);
      const model = safeString(car.model);
      const variant = safeString(car.variant);
      return brand.includes(key) || model.includes(key) || variant.includes(key);
    });
    navigate('/filter-result', { state: { filteredCars: filtered } });
  };

  const toggleBrand = (brandName) => {
    setExpandedBrands((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(brandName)) newSet.delete(brandName);
      else newSet.add(brandName);
      return newSet;
    });
  };

  const grouped = variants.reduce((acc, v) => {
    const brand = v.brandName || 'Unknown';
    if (!acc[brand]) acc[brand] = [];
    acc[brand].push(v);
    return acc;
  }, {});
  const brandEntries = Object.entries(grouped);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="w-10 h-10 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!variants.length) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p className="text-gray-500">No variants found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E9E9FF]">
      {/* ✅ Reusable AppBar */}
      <AppBar title="Variants" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 pb-6">
        {brandEntries.map(([brandName, brandVariants], brandIndex) => {
          const filteredVariants = brandVariants.filter(
            (v) => variantCount(v.variantName) > 0
          );
          if (!filteredVariants.length) return null;

          const isExpanded = expandedBrands.has(brandName);
          const visibleVariants = isExpanded
            ? filteredVariants
            : filteredVariants.slice(0, 4);

          const colorClass = brandColors[brandIndex % brandColors.length];

          return (
            <div key={brandName} className="mb-6 sm:mb-8">
              {/* Brand header */}
              <div
                className={`flex items-center p-3 sm:p-4 rounded-2xl mx-0 sm:mx-1 mb-2 sm:mb-3 ${colorClass}`}
              >
                <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white rounded-xl p-1.5 flex items-center justify-center mr-3 sm:mr-4">
                  <img
                    src={brandVariants[0]?.brandLogo || ''}
                    alt={brandName}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <span className="font-semibold text-gray-800 text-base sm:text-lg">
                  {brandName}
                </span>
              </div>

              {/* Horizontal scroll – responsive card sizes */}
              <div className="overflow-x-auto pb-3 px-0 scrollbar-hide">
                <div className="flex gap-3 sm:gap-4 w-max">
                  {visibleVariants.map((variant) => {
                    const count = variantCount(variant.variantName);
                    return (
                      <div
                        key={variant._id}
                        onClick={() => openResult(variant.variantName)}
                        className="relative flex-shrink-0 rounded-2xl overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105"
                      >
                        <div className="w-[115px] h-[160px] sm:w-[140px] sm:h-[190px] md:w-[160px] md:h-[210px]">
                          <img
                            src={variant.variantImage || ''}
                            alt={variant.variantName}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full">
                            {count} cars
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 bg-white/75 backdrop-blur-sm rounded-full py-1 text-center">
                            <span className="text-xs sm:text-sm font-semibold truncate block px-1">
                              {variant.variantName}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {filteredVariants.length > 4 && (
                <div className="px-1 mt-1">
                  <button
                    onClick={() => toggleBrand(brandName)}
                    className="text-blue-600 text-xs sm:text-sm font-semibold hover:underline"
                  >
                    {isExpanded ? 'Show Less' : 'View All'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VariantAll;