import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapboxRoute from "~/components/MapboxRoute";
import { getHost } from "../utils/utils";

interface Coords {
  lat: number;
  lng: number;
}

interface TripEntry {
    id: string;
    created_at: string;
    current_location: string;
    pickup_location: string;
    dropoff_location: string;
    current_cycle_used: number;
    current_coordinates: Coords | null;
    pickup_coordinates: Coords | null;
    dropoff_coordinates: Coords | null;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function Trip() {
  const { id } = useParams();
  const [trip, setTrip] = useState<TripEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [startCoords, setStartCoords] = useState<number[] | null>(null);
  const [endCoords, setEndCoords] = useState<number[] | null>(null);
  const [pickupCoords, setPickupCoords] = useState<number[] | null>(null);
  const [loadingRoutes, setLoadingRoutes] = useState<boolean>(false);

  const fetchTrip = async () => {
    setLoading(true);
    try {
      const response = await fetch(getHost() + `/api/trips/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      //console.log('Trip data:', data);
      setTrip(data);
      setStartCoords([data.current_coordinates?.lng || 0, data.current_coordinates?.lat || 0]);
      setPickupCoords([data.pickup_coordinates?.lng || 0, data.pickup_coordinates?.lat || 0]);
      setEndCoords([data.dropoff_coordinates?.lng || 0, data.dropoff_coordinates?.lat || 0]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trip:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xs shadow-md p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-gray-800">Trip Details</h2>
          <Link
            to="/trips"
            className="text-sm text-[#043f51] hover:text-[#008080] flex items-center"
          >
            ← Go to Trips
          </Link>
        </div>

        <div className="space-y-6">

            {/* Trip Information */}
            <div key={trip?.id} className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Trip Information</h3>
                <div className="max-w-xl mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="mb-0">
                      <p className="text-xs mb-2">
                        <span className="text-gray-700">Starting Location: </span>
                        <span className="font-bold">{trip?.current_location}</span>
                      </p>
                      <p className="text-xs mb-2">
                        <span className="text-gray-700">Pickup Location: </span>
                        <span className="font-bold">{trip?.pickup_location}</span>
                      </p>
                    </div>
                    <div className="mb-0">
                      <p className="text-xs mb-2">
                        <span className="text-gray-700">Dropoff Location: </span>
                        <span className="font-bold">{trip?.dropoff_location}</span>
                      </p>
                      <p className="text-xs">
                        <span className="text-gray-700"> Current Cycle Used: </span>
                        <span className="font-bold">{trip?.current_cycle_used}</span>
                      </p>
                    </div>
                  </div>
                </div>
            </div>

            <hr className="mb-6 mt-0" />

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Route Map</h3>
              <div className="max-w-3xl mx-auto px-0">

              {/* Trip Metrics */}
              {(!loading && startCoords && pickupCoords) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  
                    <div className="mb-2">
                      <p className="text-xs mb-2">
                        <span className="text-gray-700">Start to Pickup: </span>
                        (Distance: <span className="font-bold">{217} km</span>, Duration: <span className="font-bold">{3} hours</span>)
                      </p>
                      <p className="text-xs mb-2">
                        <span className="text-gray-700">Pickup to Dropoff: </span>
                        (Distance: <span className="font-bold">{105} km</span>, Duration: <span className="font-bold">{2} hours</span>)
                      </p>
                      <p className="text-xs mb-2">
                        <span className="text-gray-700">Whole Trip: </span>
                        (Distance: <span className="font-bold">{105} km</span>, Duration: <span className="font-bold">{2} hours</span>)
                      </p>
                    </div>

                </div>
              )}
              </div>

              {/* Route Map */}
              {loading || !startCoords || !pickupCoords || !endCoords ? 
                (
                  <p>Loading...</p>
                ) : 
                (
                  <MapboxRoute
                    startCoords={startCoords}
                    pickupCoords={pickupCoords}
                    endCoords={endCoords}
                    zoom={9}
                  />
                )
              }
            </div>
          </div>

        </div>
      </div>
  );
}