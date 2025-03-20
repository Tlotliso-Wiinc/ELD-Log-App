import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../utils/utils';

interface TripEntry {
    id: string;
    created_at: string;
    current_location: string;
    pickup_location: string;
    dropoff_location: string;
    current_cycle_used: number;
}

export default function Trip() {
  const { id } = useParams();
  const [trip, setTrip] = useState<TripEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrip = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/trips/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTrip(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trip:', error);
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xs shadow-md p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-gray-800">Trip Details</h2>
          <Link
            to="/trips"
            className="text-sm text-blue-800 hover:text-blue-700 flex items-center"
          >
            ← Back to Trips
          </Link>
        </div>

        <div className="space-y-6">

            {/* Trip Information */}
            <div key={trip?.id} className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Trip Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            Added Date
                        </label>
                        <input
                            type="text"
                            required
                            className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={formatDateTime(trip?.created_at)}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            Current Location
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
            </div>

        </div>
      </div>
    </div>
  );
}