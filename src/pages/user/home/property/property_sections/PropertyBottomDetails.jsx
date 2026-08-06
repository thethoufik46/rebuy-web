// src/pages/user/home/Pages/property/property_details/PropertyBottomDetails.jsx
import React from 'react';
import { FaBed, FaRulerCombined, FaCompass, FaMapMarkerAlt } from 'react-icons/fa';

const asString = (v) => {
  if (v == null) return '-';
  if (typeof v === 'object') {
    if (v.name) return v.name.toString();
    if (v.title) return v.title.toString();
    if (Array.isArray(v) && v.length) return asString(v[0]);
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

export default function PropertyBottomDetails({ property }) {
  const v = (key) => asString(property[key]);
  const price = v('price');
  const mainType = v('mainType');
  const category = v('category');
  const bedrooms = v('bedrooms');
  const landArea = v('landArea');
  const direction = v('direction');
  const district = v('district');
  const city = v('city');
  const status = v('status');
  const description = v('description');
  const sellerInfo = v('sellerinfo');

  return (
    <div className="px-0.5">
      <div className="flex justify-between">
        <PriceBlock label="Price" value={`₹${price}`} />
        <PriceBlock label="Down Payment" value="CIBIL Based" />
      </div>
      <div className="h-6" />
      <div className="bg-white rounded-2xl shadow-md py-2.5 px-1.5 flex justify-between" style={{ boxShadow: '0 5px 12px rgba(0,0,0,0.08)' }}>
        <SpecItem icon={<FaBed />} label="Bedrooms" value={bedrooms || '-'} />
        <SpecItem icon={<FaRulerCombined />} label="Area" value={landArea || '-'} />
        <SpecItem icon={<FaCompass />} label="Direction" value={direction || '-'} />
        <SpecItem icon={<FaMapMarkerAlt />} label="Location" value={`${district}, ${city}`} />
      </div>
      <div className="h-4.5" />
      <div className="bg-[#FFF3CD] rounded-2xl p-1.5">
        <DetailRow label="Type" value={mainType} />
        <DetailRow label="Category" value={category} />
        <DetailRow label="Bedrooms" value={bedrooms} />
        <DetailRow label="Land Area" value={landArea} />
        <DetailRow label="Direction" value={direction} />
        <DetailRow label="Location" value={`${district}, ${city}`} />
        <DetailRow label="Seller Info" value={sellerInfo} />
        <DetailRow label="Status" value={status} />
      </div>
      <div className="h-4" />
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