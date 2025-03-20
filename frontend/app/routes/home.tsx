import { useState } from 'react';
import type { Route } from "./+types/home";
import { useNavigate } from 'react-router-dom';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentLocation: '',
    pickupLocation: '',
    dropoffLocation: '',
    cycleHours: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    saveTrip();
  };

  const saveTrip = async () => {

    // Send data to backend
    try {
      setSubmitting(true);
      const response = await fetch('http://localhost:8000/api/trips/', {
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
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Trip saved:', result);

      // Redirect to trips page
      navigate('/trips');

    } catch (err) {
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
              className="bg-blue-800 text-sm text-white py-2 px-4 rounded-sm hover:bg-blue-700 transition-colors cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
