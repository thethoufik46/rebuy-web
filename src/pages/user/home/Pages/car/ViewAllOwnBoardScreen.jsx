// src/pages/user/home/Pages/car/ViewAllOwnBoardScreen.jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CarCard from '@/components/CarCard';
import API from '@/services/api';
import { getAllVariants } from '@/services/carVariantApi';
import AppBar from '@/components/AppBar';

// ─── Helpers ──────────────────────────────────────────────
const extractId = (value) => {
  if (!value) return '';
  if (typeof value === 'object') {
    if (value.$oid) return value.$oid.toString();
    if (value._id) return value._id.toString();
    if (Array.isArray(value) && value.length) return extractId(value[0]);
    if (value.id) return value.id.toString();
  }
  return value.toString();
};

export default function ViewAllOwnBoardScreen() {
  const navigate = useNavigate();

  // ─── State ──────────────────────────────────────────────
  const [allCars, setAllCars] = useState([]);
  const [allVariants, setAllVariants] = useState([]);      // full list from API
  const [filteredVariants, setFilteredVariants] = useState([]); // filtered by brand
  const [variantsMap, setVariantsMap] = useState({});
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const brandScrollRef = useRef(null);
  const variantScrollRef = useRef(null);

  // ─── Fetch cars (ONLY "own" board) ─────────────────────
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await API.get('/cars', { params: { board: 'own' } });
        const cars = response.data?.cars || [];
        setAllCars(cars);
      } catch (err) {
        console.error('Error fetching own board cars:', err);
        setAllCars([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCars();
  }, []);

  // ─── Fetch all variants and build map ──────────────────
  useEffect(() => {
    const loadVariants = async () => {
      try {
        const list = await getAllVariants();
        const map = {};
        list.forEach((v) => {
          const id = extractId(v._id);
          if (id) {
            map[id] = {
              name: v.variantName || v.title || '',
              image: v.variantImage || '',
              brandId: extractId(v.brand),
            };
          }
        });
        setVariantsMap(map);
        setAllVariants(list);               // store full list
        setFilteredVariants(list);          // initially show all (but we'll filter by brand later)
      } catch (err) {
        console.error('Error loading variants:', err);
        setAllVariants([]);
        setFilteredVariants([]);
      }
    };
    loadVariants();
  }, []);

  // ─── Filter variants when brand changes ─────────────────
  useEffect(() => {
    if (selectedBrand === 'All') {
      setFilteredVariants(allVariants);   // show all variants
      setSelectedVariant(null);
      return;
    }

    const brandId = getSelectedBrandId();
    if (!brandId) {
      setFilteredVariants([]);
      setSelectedVariant(null);
      return;
    }

    setIsLoadingVariants(true);
    try {
      const filtered = allVariants.filter(
        (v) => extractId(v.brand) === brandId
      );
      setFilteredVariants(filtered);
      setSelectedVariant(null);
    } catch (err) {
      console.error('Filter variants error:', err);
      setFilteredVariants([]);
    } finally {
      setIsLoadingVariants(false);
    }
  }, [selectedBrand, allVariants]); // ✅ only depends on brand and full list

  // ─── Brand map from own‑board cars ─────────────────────
  const brandMap = useMemo(() => {
    const map = {};
    allCars.forEach((car) => {
      const brand = car.brand;
      if (brand && brand.name) {
        map[brand.name] = { ...brand };
      }
    });
    return map;
  }, [allCars]);

  const brands = useMemo(() => ['All', ...Object.keys(brandMap)], [brandMap]);

  const getSelectedBrandId = useCallback(() => {
    if (selectedBrand === 'All') return null;
    const brand = brandMap[selectedBrand];
    return brand ? extractId(brand._id) : null;
  }, [selectedBrand, brandMap]);

  // ─── Robust variant name extractor ──────────────────────
  const getVariantNameFromCar = useCallback(
    (car) => {
      if (car.variantName) return car.variantName;
      const variantField = car.variant;
      if (variantField) {
        if (variantField.variantName) return variantField.variantName;
        if (variantField.title) return variantField.title;
        if (variantField.name) return variantField.name;
        if (typeof variantField === 'string') {
          const id = extractId(variantField);
          if (id && variantsMap[id]) return variantsMap[id].name;
        }
        if (typeof variantField === 'object' && variantField._id) {
          const id = extractId(variantField._id);
          if (id && variantsMap[id]) return variantsMap[id].name;
        }
        if (variantField.id) {
          const id = extractId(variantField.id);
          if (id && variantsMap[id]) return variantsMap[id].name;
        }
      }
      return car.model || 'Unknown';
    },
    [variantsMap]
  );

  const getVariantImageFromCar = useCallback(
    (car) => {
      const variantField = car.variant;
      if (variantField) {
        if (variantField.variantImage) return variantField.variantImage;
        if (variantField.imageUrl) return variantField.imageUrl;
        if (typeof variantField === 'string') {
          const id = extractId(variantField);
          if (id && variantsMap[id]) return variantsMap[id].image;
        }
        if (typeof variantField === 'object' && variantField._id) {
          const id = extractId(variantField._id);
          if (id && variantsMap[id]) return variantsMap[id].image;
        }
      }
      return '';
    },
    [variantsMap]
  );

  // ─── Variant names from cars (for selected brand) ──────
  const variantNamesFromCars = useMemo(() => {
    if (selectedBrand === 'All') return [];
    const brandCars = allCars.filter((c) => c.brand?.name === selectedBrand);
    const names = new Set();
    brandCars.forEach((car) => {
      const name = getVariantNameFromCar(car);
      if (name && name !== 'Unknown') names.add(name);
    });
    return Array.from(names).sort();
  }, [selectedBrand, allCars, getVariantNameFromCar]);

  // ─── Get variant image for name ──────────────────────
  const getVariantImageForName = useCallback(
    (name) => {
      for (const v of filteredVariants) {
        const vName = v.variantName || v.title;
        if (vName === name) {
          return v.variantImage || v.imageUrl;
        }
      }
      for (const car of allCars) {
        if (car.brand?.name === selectedBrand) {
          const carVariant = getVariantNameFromCar(car);
          if (carVariant === name) {
            return getVariantImageFromCar(car);
          }
        }
      }
      return null;
    },
    [filteredVariants, allCars, selectedBrand, getVariantNameFromCar, getVariantImageFromCar]
  );

  // ─── Filtered cars ──────────────────────────────────────
  const filteredCars = useMemo(() => {
    let cars = allCars;

    if (selectedBrand !== 'All') {
      cars = cars.filter((c) => c.brand?.name === selectedBrand);
    }

    if (selectedVariant) {
      cars = cars.filter((car) => {
        const carVariantName = getVariantNameFromCar(car);
        return carVariantName === selectedVariant;
      });
    }

    return cars;
  }, [allCars, selectedBrand, selectedVariant, getVariantNameFromCar]);

  // ─── Handlers ──────────────────────────────────────────
  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setSelectedVariant(null);
    if (brandScrollRef.current) {
      brandScrollRef.current.scrollLeft = 0;
    }
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant((prev) => (prev === variant ? null : variant));
  };

  const handleClearFilters = () => {
    setSelectedBrand('All');
    setSelectedVariant(null);
  };

  // ─── Responsive grid ──────────────────────────────────
  const getGridConfig = () => {
    const width = window.innerWidth;
    if (width >= 1200) return { cols: 4, aspect: 0.78 };
    if (width >= 900) return { cols: 3, aspect: 0.75 };
    return { cols: 2, aspect: 0.72 };
  };

  const [gridConfig, setGridConfig] = useState(getGridConfig);

  useEffect(() => {
    const handleResize = () => setGridConfig(getGridConfig());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#D6CEF3] to-[#F3EFFF]">
        <div className="w-10 h-10 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#D6CEF3] to-[#F3EFFF]">
      <AppBar
        title={`${filteredCars.length} cars`}
        actions={
          <button
            onClick={() => navigate('/filter')}
            className="p-2 rounded-full bg-white/70 shadow-sm hover:bg-white"
          >
            ⚙
          </button>
        }
      />

      <div className="px-3 pt-3 pb-6">
        {/* Brand selection */}
        <div className="mb-2">
          <div
            ref={brandScrollRef}
            className="flex overflow-x-auto scrollbar-hide gap-3 pb-2"
          >
            {brands.map((brand) => {
              const isActive = brand === selectedBrand;
              const logoUrl =
                brand === 'All'
                  ? '/assets/logo/logo.webp'
                  : brandMap[brand]?.logoUrl || '';
              return (
                <button
                  key={brand}
                  onClick={() => handleBrandSelect(brand)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-black text-white'
                      : 'bg-white/70 text-gray-800'
                  }`}
                >
                  <img
                    src={logoUrl}
                    alt={brand}
                    className="w-7 h-7 rounded-full object-cover bg-white"
                    onError={(e) => (e.target.src = '/assets/logo/logo.webp')}
                  />
                  <span className="text-sm font-semibold">{brand}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Variant selection */}
        {selectedBrand !== 'All' && (
          <div className="mb-3">
            {isLoadingVariants ? (
              <div className="flex items-center justify-center h-10 bg-white/70 rounded-full px-4">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                <span className="text-sm font-semibold">Loading variants...</span>
              </div>
            ) : variantNamesFromCars.length > 0 ? (
              <div
                ref={variantScrollRef}
                className="flex overflow-x-auto scrollbar-hide gap-3 pb-2"
              >
                {variantNamesFromCars.map((variant) => {
                  const isActive = variant === selectedVariant;
                  const image = getVariantImageForName(variant);
                  return (
                    <button
                      key={variant}
                      onClick={() => handleVariantSelect(variant)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-black text-white'
                          : 'bg-white/70 text-gray-800'
                      }`}
                    >
                      <img
                        src={image || '/assets/logo/logo.webp'}
                        alt={variant}
                        className="w-7 h-7 rounded-full object-cover bg-white"
                        onError={(e) => (e.target.src = '/assets/logo/logo.webp')}
                      />
                      <span className="text-sm font-semibold">{variant}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-10 bg-white/70 rounded-full px-4">
                <span className="text-sm font-semibold text-gray-600">
                  No variants available
                </span>
              </div>
            )}
          </div>
        )}

        {/* Car grid */}
        {filteredCars.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-6xl text-gray-300 mb-4">🚗</div>
            <p className="text-gray-500 font-medium">No cars found</p>
            {(selectedBrand !== 'All' || selectedVariant) && (
              <button
                onClick={handleClearFilters}
                className="mt-3 text-blue-500 text-sm font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
            }}
          >
            {filteredCars.map((car) => {
              const id = extractId(car._id);
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/car/${id}`, { state: { car } })
                  }
                >
                  <CarCard
                    carId={id}
                    brandName={car.brand?.name || ''}
                    brandLogoUrl={car.brand?.logo || ''}
                    variant={getVariantNameFromCar(car)}
                    model={car.model || ''}
                    imageUrl={car.bannerImage || ''}
                    price={`₹${car.price || 0}`}
                    fuel={car.fuel || ''}
                    year={car.year?.toString() || '-'}
                    status={car.status || 'available'}
                    km={car.km?.toString() || '0'}
                    owner={car.owner?.toString() || '1'}
                    transmission={car.transmission || 'Manual'}
                    district={car.district || ''}
                    city={car.city || ''}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}