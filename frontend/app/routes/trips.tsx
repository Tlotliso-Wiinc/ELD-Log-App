import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
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

export default function Trips() {
  const [trips, setTrips] = useState<TripEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/trips/');
        const data = await response.json();
        setTrips(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xs shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Trips History</h2>
          <Link
            to="/add-trip"
            className="bg-[#008080] text-white px-4 py-2 rounded-sm hover:bg-[#043f51] transition-colors text-sm"
          >
            <Plus size={15} className="inline-block" /> Add New Trip
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dropoff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cycle Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">Loading...</td>
                </tr>
              ) : trips.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">No trips found</td>
                </tr>
              ) : (
                trips.map((trip) => (
                  <tr key={trip.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateTime(trip.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.current_location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.pickup_location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.dropoff_location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.current_cycle_used}h</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Link
                        to={`/trip/${trip.id}`}
                        className="bg-transparent hover:bg-[#008080] text-[#008080] font-semibold hover:text-white py-2 px-4 border border-[#008080] hover:border-transparent rounded"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
