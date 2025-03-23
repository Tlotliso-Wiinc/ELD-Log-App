import { useState } from 'react';
import type { Route } from "./+types/home";
import { useNavigate } from 'react-router-dom';
import { getHost } from "../utils/utils";

interface Coords {
  lat: number;
  lng: number;
}

interface SaveTripPayload {
  driver: number;
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  current_cycle_used: string;
  current_coordinates: Coords | null;
  pickup_coordinates: Coords | null;
  dropoff_coordinates: Coords | null;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function AddTrip() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentLocation: '',
    pickupLocation: '',
    dropoffLocation: '',
    cycleHours: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setSubmitting(true);
    e.preventDefault();

    // Geocode addresses
    const currentLocationCoords = await googleMapsGeocode(formData.currentLocation);
    const pickupLocationCoords = await googleMapsGeocode(formData.pickupLocation);
    const dropoffLocationCoords = await googleMapsGeocode(formData.dropoffLocation);

    if (!currentLocationCoords) {
      alert('Invalid current location address');
      return;
    }

    if (!pickupLocationCoords) {
      alert('Invalid pickup location address');
      return;
    }

    if (!dropoffLocationCoords) {
      alert('Invalid dropoff location address');
      return;
    }

    // Handle form submission
    saveTrip(currentLocationCoords, pickupLocationCoords, dropoffLocationCoords);
  };

  const googleMapsGeocode = async (address: string) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data["status"] !== "OK" || data["results"].length === 0) {
        console.log("No results found for address:", address);
        console.log(data);
        return null;
      }
      const coords = data["results"][0]["geometry"]["location"];
      console.log("Coordinates:", coords);
      return coords;
    } catch (error) {
      console.error('Error in googleMapsGeocode:', error);
      return null;
    }
  };

  const saveTrip = async (currentLocationCoords: Coords | null, pickupLocationCoords: Coords | null, dropoffLocationCoords: Coords | null): Promise<void> => {
    // Send data to backend
    try {
      const response = await fetch(getHost() + '/api/trips/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driver: 1,
          current_location: formData.currentLocation,
          pickup_location: formData.pickupLocation,
          dropoff_location: formData.dropoffLocation,
          current_cycle_used: formData.cycleHours,
          current_coordinates: currentLocationCoords,
          pickup_coordinates: pickupLocationCoords,
          dropoff_coordinates: dropoffLocationCoords,
        } as SaveTripPayload),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result: any = await response.json();
      console.log('Trip saved:', result);

      // Redirect to trips page
      navigate('/trips');

    } catch (err: unknown) {
      console.error('Error saving trip:', err);
    } finally {
      setSubmitting(false);
    }

  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-lg mx-auto py-8 px-4">
        <div className="bg-white rounded-xs shadow-md p-6">
          <h2 className="text-lg font-bold mb-6 text-gray-800 text-center">New Trip Entry</h2>
          {/*<hr className="mb-6" />*/}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Current Location
              </label>
              <input
                type="text"
                required
                className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.currentLocation}
                onChange={(e) => setFormData({...formData, currentLocation: e.target.value})}
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Pickup Location
                </label>
                <input
                  type="text"
                  required
                  className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Dropoff Location
                </label>
                <input
                  type="text"
                  required
                  className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.dropoffLocation}
                  onChange={(e) => setFormData({...formData, dropoffLocation: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Current Cycle Used (Hours)
              </label>
              <input
                type="number"
                min="0"
                max="24"
                required
                className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.cycleHours}
                onChange={(e) => setFormData({...formData, cycleHours: e.target.value})}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#008080] text-xs font-medium text-white py-2 px-4 rounded-sm hover:bg-[#043f51] transition-colors cursor-pointer"
            >
              {submitting ? 'Processing...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
