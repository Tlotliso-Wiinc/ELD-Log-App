import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../utils/utils';
import MapboxRoute from "~/components/MapboxRoute";
import MapboxThreePointRoute from "~/components/MapboxThreePointRoute";
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
  const [dropoffCoords, setDropoffCoords] = useState<number[] | null>(null);

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            Current/Starting Location
                        </label>
                        <input
                            type="text"
                            required
                            className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={trip?.current_location}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            Pickup Location
                        </label>
                        <input
                            type="text"
                            required
                            className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={trip?.pickup_location}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            Dropoff Location
                        </label>
                        <input
                            type="text"
                            required
                            className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={trip?.dropoff_location}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            Current Cycle Used
                        </label>
                        <input
                            type="number"
                            required
                            className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={trip?.current_cycle_used}
                            readOnly
                        />
                    </div>
                </div>
            </div>

            <hr className="my-10 mb-6" />

            <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Route Map</h3>
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
            {/*
               <MapboxThreePointRoute 
                  startLocation={
                    {
                      coordinates: startCoords,
                      label: "Driver Start",
                      type: 'start' as const
                    }
                  }
                  pickupLocation={
                    {
                      coordinates: pickupCoords,
                      label: "Pickup Location",
                      type: 'pickup' as const
                    }
                  }
                  dropoffLocation={
                    {
                      coordinates: endCoords,
                      label: "Dropoff Location",
                      type: 'dropoff' as const
                    }
                  }
                />
            */}
            </div>

        </div>
      </div>
  );
}