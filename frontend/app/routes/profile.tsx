import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHost } from "../utils/utils";
import { get } from "http";

interface Driver {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    driver_id: string;
    license_number: string;
    trailer_number: string;
    carrier: string;
    main_office_address: string;
    home_terminal_address: string;
}

export default function Profile() {
    const [driver, setDriver] = useState<Driver | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const id = 1;

    useEffect(() => {
        const fetchDriver = async () => {
          setLoading(true);
          try {
            const response = await fetch(getHost() + `/api/drivers/${id}`);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setDriver(data);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching driver:', error);
            setLoading(false);
          }
        };
        fetchDriver();
      }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xs shadow-md p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-gray-800">Driver Profile</h2>
          <Link
            to="/"
            className="text-sm text-[#043f51] hover:text-[#008080] flex items-center"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="space-y-6">
          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Driver Number
              </label>
              <input
                type="text"
                required
                value={driver?.driver_id || ''}
                className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="D-123456"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={driver?.first_name || '' + ' ' + driver?.last_name || ''}
                className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Michael Driver"
              />
            </div>
          </div>

          {/* Carrier Information */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Carrier Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Carrier Name
                </label>
                <input
                  type="text"
                  required
                  value={driver?.carrier || ''}
                  className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="National Freight Services Inc."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  USDOT Number
                </label>
                <input
                  type="text"
                  required
                  className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123456789"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Vehicle Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  License Plate Number
                </label>
                <input
                  type="text"
                  required
                  value={driver?.license_number || ''}
                  className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ABC-1234"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Trailer Number
                </label>
                <input
                  type="text"
                  required
                  value={driver?.trailer_number || ''}
                  className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="TRL-5678"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Addresses</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Main Office Address
                </label>
                <textarea
                  className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                  value={driver?.main_office_address || ''}
                  placeholder="123 Main Street, Suite 400\nAnytown, ST 12345"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Home Terminal Address
                </label>
                <textarea
                  className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                  value={driver?.home_terminal_address || ''}
                  placeholder="456 Home Terminal Road\nHometown, ST 67890"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}