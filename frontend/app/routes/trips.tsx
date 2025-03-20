import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";

interface TripEntry {
  id: string;
  date: string;
  currentLocation: string;
  pickup: string;
  dropoff: string;
  cycleHours: number;
}

const mockTrips: TripEntry[] = [
  {
    id: "1",
    date: "2025-03-19 14:30",
    currentLocation: "Warehouse A",
    pickup: "Client X",
    dropoff: "Client Y",
    cycleHours: 8
  }
];

export default function Trips() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xs shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Trips History</h2>
          <Link
            to="/"
            className="bg-blue-800 text-white px-4 py-2 rounded-sm hover:bg-blue-700 transition-colors text-sm"
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockTrips.map((trip) => (
                <tr key={trip.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.currentLocation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.pickup}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.dropoff}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trip.cycleHours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
