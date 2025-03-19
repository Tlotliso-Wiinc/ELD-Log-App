import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xs shadow-md p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-gray-800">Driver Profile</h2>
          <Link
            to="/"
            className="text-sm text-blue-800 hover:text-blue-700 flex items-center"
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
                  placeholder="123 Main Street, Suite 400\nAnytown, ST 12345"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Home Terminal Address
                </label>
                <textarea
                  className="text-sm w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
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