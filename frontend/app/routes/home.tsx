import type { Route } from "./+types/home";
import { useState } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [formData, setFormData] = useState({
    currentLocation: '',
    pickupLocation: '',
    dropoffLocation: '',
    cycleHours: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto py-8 px-4">
        <div className="bg-white rounded-xs shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">New Log Entry</h2>
          <hr className="mb-6" />
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Location
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.currentLocation}
                onChange={(e) => setFormData({...formData, currentLocation: e.target.value})}
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dropoff Location
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.dropoffLocation}
                  onChange={(e) => setFormData({...formData, dropoffLocation: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Cycle Hours
              </label>
              <input
                type="number"
                min="0"
                max="24"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.cycleHours}
                onChange={(e) => setFormData({...formData, cycleHours: e.target.value})}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-sm text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit Log
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
