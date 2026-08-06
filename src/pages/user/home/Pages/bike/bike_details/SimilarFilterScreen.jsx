// src/pages/user/home/Pages/bike/bike_details/SimilarFilterScreen.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BikeCard from '@/components/BikeCard';
import { getFilteredBikes } from '@/services/bikeFilterApi';

const brandName = (bike) => {
  const brandData = bike?.brand;
  if (brandData && typeof brandData === 'object' && brandData.name) return brandData.name.toString();
  if (typeof brandData === 'string') return brandData;
  return '';
};

export default function SimilarFilterScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const bike = location.state?.bike;

  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSimilar = async () => {
      if (!bike) return;
      try {
        const brand = brandName(bike);
        const result = await getFilteredBikes({ brand });
        const currentId = bike._id?.toString();
        setBikes(result.filter(b => b._id?.toString() !== currentId));
      } catch (e) {
        console.error('Similar Bikes Error', e);
      } finally {
        setLoading(false);
      }
    };
    loadSimilar();
  }, [bike]);

  if (!bike) return <div>No bike data</div>;

  const brand = brandName(bike);

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white flex items-center px-4 h-16 border-b">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg">{brand} Bikes</h1>
        <div className="w-10" />
      </div>

      {loading ? (
        <div className="flex justify-center mt-10">Loading...</div>
      ) : bikes.length === 0 ? (
        <div className="text-center text-black/60 mt-10">No Similar Bikes Found</div>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3.5">
            {bikes.map(b => {
              const id = b._id?.toString() || '';
              return (
                <div
                  key={id}
                  onClick={() => navigate(`/bike/${id}`, { state: { bike: b } })}
                >
                  <BikeCard
                    bikeId={id}
                    brandName={b.brand?.name}
                    brandLogoUrl={b.brand?.logo}
                    model={b.model}
                    variant={b.variant}
                    imageUrl={b.bannerImage}
                    price={b.price}
                    year={b.year}
                    status={b.status}
                    km={b.km}
                    owner={b.owner}
                    district={b.district}
                    city={b.city}
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