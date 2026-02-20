import React from 'react';
import { ArrowLeft } from 'lucide-react';

const extractId = (value) => {
  if (!value) return '';
  if (typeof value === 'object') {
    if (value.$oid) return value.$oid.toString();
    if (value._id) return value._id.toString();
    if (Array.isArray(value) && value.length) return extractId(value[0]);
  }
  return value.toString();
};

const brandName = (car) => {
  const brandData = car?.brand;
  if (brandData && typeof brandData === 'object' && brandData.name) return brandData.name.toString();
  return 'Brand';
};

const model = (car) => car?.model?.toString() || 'Car';

export default function CarTopbar({ car, onWishlist }) {
  const brand = brandName(car);
  const modelName = model(car);

  return (
    <div className="bg-white flex items-center justify-between px-4 h-16">
      <button onClick={() => window.history.back()} className="p-2">
        <ArrowLeft className="w-5 h-5 text-black" />
      </button>
      <div className="flex-1 text-center">
        <p className="text-sm text-black/60">{brand}</p>
        <p className="text-base font-bold text-black uppercase">{modelName}</p>
      </div>
      <Wishlist itemId={extractId(car?._id)} itemType="Car" onChanged={onWishlist} />
    </div>
  );
}