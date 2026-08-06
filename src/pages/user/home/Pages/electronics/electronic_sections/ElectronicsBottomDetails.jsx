// src/pages/user/home/Pages/electronics/electronics_details/ElectronicsBottomDetails.jsx
import React from 'react';

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

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-1.5">
    <span className="text-black/60">{label}</span>
    <span className="font-bold text-right max-w-[60%] truncate">{value}</span>
  </div>
);

export default function ElectronicsBottomDetails({ electronics }) {
  const v = (key) => asString(electronics[key]);
  const price = v('price');
  const brand = v('brand');
  const title = v('title');
  const category = v('category');
  const model = v('model');
  const color = v('color');
  const condition = v('condition');
  const warranty = v('warranty');
  const district = v('district');
  const city = v('city');
  const sellerInfo = v('sellerinfo');
  const status = v('status');
  const description = v('description');

  return (
    <div className="px-0.5">
      <div className="flex justify-between">
        <PriceBlock label="Price" value={`₹${price}`} />
        <PriceBlock label="Down Payment" value="CIBIL Based" />
      </div>
      <div className="h-4" />
      <div className="bg-[#FFF3CD] rounded-2xl p-1.5">
        <DetailRow label="Brand" value={brand} />
        <DetailRow label="Title" value={title} />
        <DetailRow label="Category" value={category} />
        <DetailRow label="Model" value={model} />
        <DetailRow label="Color" value={color} />
        <DetailRow label="Condition" value={condition} />
        <DetailRow label="Warranty" value={warranty} />
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