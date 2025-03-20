import { Link } from "react-router-dom";
import { mockTrips } from "../../mocks/mockData";

export default function Trip() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xs shadow-md p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-gray-800">Trip</h2>
          <Link
            to="/"
            className="text-sm text-blue-800 hover:text-blue-700 flex items-center"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="space-y-6">
            {/* Trip Details */}
            {mockTrips.map((trip) => (
                <div key={trip.id} className="border-t pt-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Trip Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                Date
                            </label>
                            <input
                                type="text"
                                required
                                className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={trip.date}
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
                                placeholder={trip.currentLocation}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}