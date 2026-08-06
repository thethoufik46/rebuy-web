// src/pages/user/home/Pages/car/car_details/SimilarFilterScreen.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CarCard from '@/components/CarCard';
import { getFilteredCars } from '@/services/carFilterApi';

const brandName = (car) => {
  const brandData = car?.brand;
  if (brandData && typeof brandData === 'object' && brandData.name) return brandData.name.toString();
  if (typeof brandData === 'string') return brandData;
  return '';
};

export default function SimilarFilterScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const car = location.state?.car;

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSimilar = async () => {
      if (!car) return;
      try {
        const brand = brandName(car);
        const result = await getFilteredCars({ brand });
        const currentId = car._id?.toString();
        setCars(result.filter(c => c._id?.toString() !== currentId));
      } catch (e) {
        console.error('Similar Cars Error', e);
      } finally {
        setLoading(false);
      }
    };
    loadSimilar();
  }, [car]);

  if (!car) return <div>No car data</div>;

  const brand = brandName(car);

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white flex items-center px-4 h-16 border-b">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg">{brand} Cars</h1>
        <div className="w-10" />
      </div>

      {loading ? (
        <div className="flex justify-center mt-10">Loading...</div>
      ) : cars.length === 0 ? (
        <div className="text-center text-black/60 mt-10">No Similar Cars Found</div>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3.5">
            {cars.map(c => {
              const id = c._id?.toString() || '';
              return (
                <div
                  key={id}
                  onClick={() => navigate(`/car/${id}`, { state: { car: c } })}
                >
                  <CarCard
                    carId={id}
                    brandName={c.brand?.name}
                    brandLogoUrl={c.brand?.logo}
                    variant={c.variantName}
                    model={c.model}
                    imageUrl={c.bannerImage}
                    price={c.price}
                    fuel={c.fuel}
                    year={c.year}
                    status={c.status}
                    km={c.km}
                    owner={c.owner}
                    transmission={c.transmission}
                    district={c.district}
                    city={c.city}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}