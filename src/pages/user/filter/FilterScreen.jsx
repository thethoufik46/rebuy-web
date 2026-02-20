import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {
  FaCar,
  FaCog,
  FaGasPump,
  FaUserFriends,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaTruck,
  FaCheck,
  FaArrowLeft,
} from 'react-icons/fa';

// Use the correct API imports
import { getBrands } from "@/services/carBrandApi";
import { getVariantsByBrand } from "@/services/carVariantApi";
import { getFilteredCars } from "@/services/carFilterApi";

const ALL_BRANDS = '__ALL__';

const FilterScreen = () => {
  const navigate = useNavigate();

  // State
  const [selectedBrandId, setSelectedBrandId] = useState(ALL_BRANDS);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedFuel, setSelectedFuel] = useState(null);
  const [selectedTransmission, setSelectedTransmission] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [priceRange, setPriceRange] = useState({ start: 0, end: 30 });
  const [yearRange, setYearRange] = useState({ start: 1995, end: 2025 });
  const [isLoading, setIsLoading] = useState(false);
  const [isVariantLoading, setIsVariantLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [variants, setVariants] = useState([]);

  // Predefined filter options
  const filterOptions = {
    fuel: [
      { value: 'petrol', label: 'Petrol' },
      { value: 'diesel', label: 'Diesel' },
      { value: 'cng', label: 'CNG' },
      { value: 'lpg', label: 'LPG' },
      { value: 'electric', label: 'Electric' },
      { value: 'hybrid', label: 'Hybrid' },
    ],
    transmission: [
      { value: 'manual', label: 'Manual' },
      { value: 'automatic', label: 'Automatic' },
    ],
    owner: Array.from({ length: 5 }, (_, i) => ({
      value: `${i + 1}`,
      label: `${i + 1}${['st', 'nd', 'rd', 'th', 'th'][i]} Owner`,
    })),
  };

  // Fetch brands on mount
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await getBrands();
      setBrands(data);
    } catch (error) {
      alert('Failed to load brands');
    }
  };

  const fetchVariants = async (brandId) => {
    setIsVariantLoading(true);
    setVariants([]);
    setSelectedVariantId(null);

    try {
      const data = await getVariantsByBrand(brandId);
      setVariants(data);
      console.log('Variants fetched:', data);
    } catch (error) {
      console.error('Error fetching variants:', error);
    } finally {
      setIsVariantLoading(false);
    }
  };

  // Helper to get variant display name
  const getVariantName = (variant) => {
    return variant.title || variant.name || variant.variantName || variant.model || 'Unknown Variant';
  };

  // Apply filters
  const applyFilters = async () => {
    setIsLoading(true);
    try {
      const cars = await getFilteredCars({
        brand: selectedBrandId !== ALL_BRANDS ? selectedBrandId : null,
        variant: selectedVariantId,
        fuel: selectedFuel,
        transmission: selectedTransmission,
        owner: selectedOwner,
        board: selectedBoard,
        minPrice: priceRange.start > 0 ? priceRange.start * 100000 : null,
        maxPrice: priceRange.end < 30 ? priceRange.end * 100000 : null,
        minYear: yearRange.start > 1995 ? yearRange.start : null,
        maxYear: yearRange.end < 2025 ? yearRange.end : null,
      });

      if (cars.length === 0) {
        alert('No cars found');
      } else {
        navigate('/filter-result', { state: { filteredCars: cars } });
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedBrandId(ALL_BRANDS);
    setSelectedVariantId(null);
    setVariants([]);
    setSelectedFuel(null);
    setSelectedTransmission(null);
    setSelectedOwner(null);
    setSelectedBoard(null);
    setPriceRange({ start: 0, end: 30 });
    setYearRange({ start: 1995, end: 2025 });
  };

  // ========== UI Components ==========
  const FilterRow = ({ title, icon, selectedValue, options, onChanged, isBrand = false, isVariant = false }) => {
    let dropdownContent;

    if (isVariantLoading && isVariant) {
      dropdownContent = (
        <div style={styles.dropdownLoader}>
          <div style={styles.spinner} />
        </div>
      );
    } else {
      dropdownContent = (
        <select
          value={selectedValue || ''}
          onChange={(e) => onChanged(e.target.value || null)}
          style={styles.select}
        >
          {/* All / default option */}
          {!isBrand && !isVariant && <option value="">All</option>}
          {isBrand && <option value={ALL_BRANDS}>All Brands</option>}
          {isVariant && <option value="">All Variants</option>}

          {/* Predefined options (fuel, transmission, owner) */}
          {!isBrand && !isVariant &&
            options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}

          {/* Brand options */}
          {isBrand &&
            brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name || 'Unknown'}
              </option>
            ))}

          {/* Variant options */}
          {isVariant &&
            variants.map((variant) => (
              <option key={variant._id} value={variant._id}>
                {getVariantName(variant)}
              </option>
            ))}
        </select>
      );
    }

    return (
      <div style={styles.filterRow}>
        <div style={styles.iconContainer}>{icon}</div>
        <div style={styles.filterTitle}>{title}</div>
        <div style={styles.dropdownContainer}>{dropdownContent}</div>
      </div>
    );
  };

  const RangeCard = ({ title, icon, values, min, max, labelPrefix, labelSuffix, onChanged }) => {
    const handleSliderChange = (range) => {
      onChanged({ start: range[0], end: range[1] });
    };

    return (
      <div style={styles.rangeCard}>
        <div style={styles.rangeHeader}>
          <div style={styles.iconContainer}>{icon}</div>
          <div style={styles.rangeTitle}>{title}</div>
        </div>
        <div style={styles.sliderContainer}>
          <Slider
            range
            min={min}
            max={max}
            step={1}
            value={[values.start, values.end]}
            onChange={handleSliderChange}
            allowCross={false}
            trackStyle={[styles.trackStyle]}
            handleStyle={[styles.handleStyle, styles.handleStyle]}
            railStyle={styles.railStyle}
          />
          <div style={styles.sliderLabels}>
            <span style={styles.labelText}>
              {labelPrefix}
              {values.start}
              {labelSuffix}
            </span>
            <span style={styles.labelText}>
              {values.end === max ? `${max}${labelSuffix}+` : `${labelPrefix}${values.end}${labelSuffix}`}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const BoardFilter = () => (
    <div style={styles.boardRow}>
      {/* OWN BOARD */}
      <div
        style={{
          ...styles.boardButton,
          backgroundColor: selectedBoard === 'own' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
          borderColor: selectedBoard === 'own' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
        }}
        onClick={() => setSelectedBoard(selectedBoard === 'own' ? null : 'own')}
      >
        <div style={styles.boardIcon}>
          <FaCar size={18} color="#000" />
        </div>
        <div style={styles.boardText}>
          <div style={styles.boardTitle}>OWN BOARD</div>
          <div style={styles.boardSubtitle}>White boards</div>
        </div>
        <div style={styles.boardCheck}>
          {selectedBoard === 'own' ? <FaCheck size={12} color="#fff" /> : <div style={styles.checkEmpty} />}
        </div>
      </div>

      {/* T BOARD */}
      <div
        style={{
          ...styles.boardButton,
          backgroundColor: selectedBoard === 't board' ? 'rgba(255,243,205,0.8)' : 'rgba(255,243,205,0.5)',
          borderColor: selectedBoard === 't board' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
        }}
        onClick={() => setSelectedBoard(selectedBoard === 't board' ? null : 't board')}
      >
        <div style={styles.boardIcon}>
          <FaTruck size={18} color="#000" />
        </div>
        <div style={styles.boardText}>
          <div style={styles.boardTitle}>T BOARD</div>
          <div style={styles.boardSubtitle}>Taxi Travels</div>
        </div>
        <div style={styles.boardCheck}>
          {selectedBoard === 't board' ? <FaCheck size={12} color="#fff" /> : <div style={styles.checkEmpty} />}
        </div>
      </div>
    </div>
  );

  // ========== Main Render ==========
  return (
    <div style={styles.container}>
      {/* App Bar */}
      <div style={styles.appBar}>
        <div style={styles.appBarLeading} onClick={() => navigate(-1)}>
          <FaArrowLeft size={18} color="#000" />
        </div>
        <div style={styles.appBarTitle}>Filter Cars</div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        <BoardFilter />

        {/* Brand */}
        <FilterRow
          title="Brand"
          icon={<FaCar size={18} color="#000" />}
          selectedValue={selectedBrandId}
          options={[]}
          onChanged={(val) => {
            if (val !== null) {
              setSelectedBrandId(val);
              if (val !== ALL_BRANDS) {
                fetchVariants(val);
              } else {
                setVariants([]);
                setSelectedVariantId(null);
              }
            }
          }}
          isBrand
        />

        {/* Variant (conditional) */}
        {selectedBrandId !== ALL_BRANDS && variants.length > 0 && (
          <FilterRow
            title="Variant"
            icon={<FaCog size={18} color="#000" />}
            selectedValue={selectedVariantId}
            options={[]}
            onChanged={setSelectedVariantId}
            isVariant
          />
        )}

        {/* Variant loading */}
        {selectedBrandId !== ALL_BRANDS && isVariantLoading && (
          <div style={styles.filterRow}>
            <div style={styles.iconContainer}>
              <FaCog size={18} color="#000" />
            </div>
            <div style={styles.filterTitle}>Variant</div>
            <div style={styles.dropdownContainer}>
              <div style={styles.dropdownLoader}>
                <div style={styles.spinner} />
              </div>
            </div>
          </div>
        )}

        {/* No variants message */}
        {selectedBrandId !== ALL_BRANDS && !isVariantLoading && variants.length === 0 && (
          <div style={styles.filterRow}>
            <div style={styles.iconContainer}>
              <FaCog size={18} color="#000" />
            </div>
            <div style={styles.filterTitle}>Variant</div>
            <div style={styles.dropdownContainer}>
              <span style={styles.noVariants}>No variants available</span>
            </div>
          </div>
        )}

        {/* Fuel */}
        <FilterRow
          title="Fuel Type"
          icon={<FaGasPump size={18} color="#000" />}
          selectedValue={selectedFuel}
          options={filterOptions.fuel}
          onChanged={setSelectedFuel}
        />

        {/* Transmission */}
        <FilterRow
          title="Transmission"
          icon={<FaCar size={18} color="#000" />}
          selectedValue={selectedTransmission}
          options={filterOptions.transmission}
          onChanged={setSelectedTransmission}
        />

        {/* Owner */}
        <FilterRow
          title="Owner"
          icon={<FaUserFriends size={18} color="#000" />}
          selectedValue={selectedOwner}
          options={filterOptions.owner}
          onChanged={setSelectedOwner}
        />

        {/* Price Range */}
        <RangeCard
          title="Price Range (in Lakhs)"
          icon={<FaMoneyBillWave size={18} color="#000" />}
          values={priceRange}
          min={0}
          max={30}
          labelPrefix="₹"
          labelSuffix="L"
          onChanged={setPriceRange}
        />

        {/* Year Range */}
        <RangeCard
          title="Year Range"
          icon={<FaCalendarAlt size={18} color="#000" />}
          values={yearRange}
          min={1995}
          max={2025}
          labelPrefix=""
          labelSuffix=""
          onChanged={setYearRange}
        />

        {/* Action Buttons */}
        <div style={styles.actionRow}>
          <div style={styles.clearButton} onClick={resetFilters}>
            Clear All
          </div>
          <div style={styles.applyButton} onClick={isLoading ? null : applyFilters}>
            {isLoading ? <div style={styles.buttonSpinner} /> : 'Show Cars'}
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== Styles ==========
const styles = {
  container: {
    backgroundColor: '#F5F5FF',
    minHeight: '100vh',
    fontFamily: 'sans-serif',
  },
  appBar: {
    backgroundColor: '#E9E9FF',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  appBarLeading: {
    width: 38,
    height: 38,
    backgroundColor: '#fff',
    borderRadius: 19,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 600,
    color: '#000',
    marginRight: 38, // balance leading width
  },
  body: {
    padding: 14,
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    border: '1px solid #E0E0FF',
    padding: '10px 14px',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#F5F5FF',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  filterTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: '#000',
    flex: 1,
  },
  dropdownContainer: {
    flex: 2,
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    fontSize: 13,
    border: '1px solid #E0E0FF',
    borderRadius: 10,
    backgroundColor: '#F5F5FF',
    outline: 'none',
    color: '#000',
    cursor: 'pointer',
  },
  dropdownLoader: {
    padding: '0 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 20,
    height: 20,
    border: '2px solid #ccc',
    borderTopColor: '#000',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  buttonSpinner: {
    width: 20,
    height: 20,
    border: '2px solid #fff',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  noVariants: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
    padding: '0 12px',
  },
  rangeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    border: '1px solid #E0E0FF',
    padding: 14,
    marginBottom: 12,
  },
  rangeHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 12,
  },
  rangeTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: '#000',
    marginLeft: 10,
  },
  sliderContainer: {
    padding: '0 4px',
  },
  trackStyle: {
    backgroundColor: '#000',
    height: 4,
  },
  handleStyle: {
    borderColor: '#000',
    backgroundColor: '#fff',
    borderWidth: 2,
    width: 16,
    height: 16,
    marginTop: -6,
  },
  railStyle: {
    backgroundColor: '#ccc',
    height: 4,
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 8,
    fontSize: 11,
    color: '#000',
  },
  labelText: {
    fontSize: 11,
    color: '#000',
  },
  boardRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 12,
  },
  boardButton: {
    flex: 1,
    height: 56,
    padding: '0 12px',
    borderRadius: 16,
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.06)',
    cursor: 'pointer',
  },
  boardIcon: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  boardText: {
    flex: 1,
  },
  boardTitle: {
    fontWeight: 600,
    fontSize: 12,
    color: '#000',
  },
  boardSubtitle: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.7)',
  },
  boardCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    border: '1.5px solid rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkEmpty: {
    width: 18,
    height: 18,
  },
  actionRow: {
    display: 'flex',
    gap: 10,
    marginTop: 24,
  },
  clearButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    border: '1.5px solid #000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: 15,
    color: '#000',
    cursor: 'pointer',
  },
  applyButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#000',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: 15,
    color: '#fff',
    boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
    cursor: 'pointer',
  },
};

// Add global keyframes for spinner (if not using CSS modules, you can inject a style tag or use a library)
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default FilterScreen;