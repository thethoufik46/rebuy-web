// C:\flutter_projects\rebuy-web\src\pages\user\car_sections\car_details\CarBottomDetails.jsx
import React from 'react';
import { FaCalendarAlt, FaGasPump, FaTachometerAlt, FaUser } from 'react-icons/fa';

const asString = (v) => {
  if (v == null) return '-';
  if (typeof v === 'object') {
    if (v.name) return v.name.toString();
    if (v.title) return v.title.toString();
    if (Array.isArray(v) && v.length > 0) return asString(v[0]);
  }
  return v.toString();
};

const PriceBlock = ({ label, value }) => (
  <div>
    <p className="text-black/60">{label}</p>
    <p className="text-2xl font-extrabold">{value}</p>
  </div>
);

const SpecItem = ({ icon, label, value }) => (
  <div className="text-center">
    <div className="w-11 h-11 bg-black rounded-full flex items-center justify-center text-white mx-auto">
      {React.cloneElement(icon, { className: 'w-5 h-5' })}
    </div>
    <p className="text-black/60 text-xs mt-2">{label}</p>
    <p className="font-bold text-sm">{value}</p>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-1.5">
    <span className="text-black/60">{label}</span>
    <span className="font-bold text-right max-w-[60%] truncate">{value}</span>
  </div>
);

export default function CarBottomDetails({ car }) {
  const value = (key) => asString(car[key]);
  const brand = value('brand');
  const variant = value('variant');
  const model = value('model');
  const year = value('year');
  const km = value('km');
  const fuel = value('fuel');
  const transmission = value('transmission');
  const color = value('color');
  const board = value('board');
  const insurance = value('insurance');
  const district = value('district');
  const city = value('city');
  const sellerInfo = value('sellerinfo');
  const status = value('status');
  const description = value('description');
  const price = value('price');

  return (
    <div className="px-0.5">
      {/* TOP PRICE ROW */}
      <div className="flex justify-between">
        <PriceBlock label="Price" value={`₹${price}`} />
        <PriceBlock label="Down Payment" value="CIBIL Based" />
      </div>

      <div className="h-6" />

      {/* SPECS CARD */}
      <div className="bg-white rounded-2xl shadow-md py-2.5 px-1.5 flex justify-between" style={{ boxShadow: '0 5px 12px rgba(0,0,0,0.08)' }}>
        <SpecItem icon={<FaCalendarAlt />} label="Year" value={year} />
        <SpecItem icon={<FaGasPump />} label="Fuel" value={fuel} />
        <SpecItem icon={<FaTachometerAlt />} label="KM" value={km} />
        <SpecItem icon={<FaUser />} label="Owner" value={value('owner')} />
      </div>

      <div className="h-4.5" />

      {/* DETAILS LIST */}
      <div className="bg-[#FFF3CD] rounded-2xl p-1.5">
        <DetailRow label="Brand" value={brand} />
        <DetailRow label="Variant" value={variant} />
        <DetailRow label="Model" value={model} />
        <DetailRow label="Year" value={year} />
        <DetailRow label="Kilometers" value={km} />
        <DetailRow label="Fuel" value={fuel} />
        <DetailRow label="Transmission" value={transmission} />
        <DetailRow label="Color" value={color} />
        <DetailRow label="Board" value={board} />
        <DetailRow label="Insurance" value={insurance} />
        <DetailRow label="Location" value={`${district}, ${city}`} />
        <DetailRow label="Seller Info" value={sellerInfo} />
        <DetailRow label="Status" value={status} />
      </div>

      <div className="h-4" />

      {/* DESCRIPTION + FINAL PRICE */}
      <div className="bg-white rounded-2xl border border-black/10 px-5 py-4">
        <p className="text-black/60 font-medium">Description</p>
        <p className="text-black font-bold leading-relaxed mt-1.5">{description}</p>
        <div className="border-t border-black/10 my-3" />
        <div className="flex justify-between">
          <span className="text-black/60 font-medium">Final Price</span>
          <span className="text-black text-2xl font-extrabold">₹{price}</span>
        </div>
      </div>
    </div>
  );
}