import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapboxRoute from "~/components/MapboxRoute";
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

interface RouteGeoJSON {
  type: 'Feature';
  properties: Record<string, any>;
  geometry: {
    type: 'LineString';
    coordinates: number[][];
  };
}

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function Trip() {
  const { id } = useParams();
  const [trip, setTrip] = useState<TripEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [startCoords, setStartCoords] = useState<number[] | null>(null);
  const [endCoords, setEndCoords] = useState<number[] | null>(null);
  const [pickupCoords, setPickupCoords] = useState<number[] | null>(null);
  const [loadingRoutes, setLoadingRoutes] = useState<boolean>(false);
  const [route, setRoute] = useState<RouteGeoJSON | null>(null);
  const [route2, setRoute2] = useState<RouteGeoJSON | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [routesError, setRoutesError] = useState<string | null>(null);

  const fetchTrip = async () => {
    setLoading(true);
    try {
      const response = await fetch(getHost() + `/api/trips/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      //console.log('Trip data:', data);
      fetchRoutes(
        [data.current_coordinates?.lng || 0, data.current_coordinates?.lat || 0], 
        [data.pickup_coordinates?.lng || 0, data.pickup_coordinates?.lat || 0], 
        [data.dropoff_coordinates?.lng || 0, data.dropoff_coordinates?.lat || 0]
      );
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

  const fetchRoute = async (start: [number, number], end: [number, number], routeId: string = 'route') => {
    try {
      // Convert coordinates to "longitude,latitude" format
      const startStr = `${start[0]},${start[1]}`;
      const endStr = `${end[0]},${end[1]}`;

      // Fetch route from Mapbox Directions API
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${startStr};${endStr}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch route');
      }

      const data = await response.json();
      console.log('Route data:', data['routes']);
      console.log('Route geometry data:', data['routes'][0].geometry);
      console.log('Route distance:', data['routes'][0].distance);
      console.log('Route duration:', data['routes'][0].duration);
      
      if (data.routes && data.routes.length > 0) {
        // Create GeoJSON object from the route
        if (routeId === 'route') {
          setRoute({
            type: 'Feature',
            properties: {
              distance: data.routes[0].distance,
              duration: data.routes[0].duration
            },
            geometry: data.routes[0].geometry
          });
        }
        else if (routeId === 'route2') {
          setRoute2({
            type: 'Feature',
            properties: {
              distance: data.routes[0].distance,
              duration: data.routes[0].duration
            },
            geometry: data.routes[0].geometry
          });
        }
      } else {
        throw new Error('No route found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching route:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async (_startCoords: number[], _pickupCoords: number[], _endCoords: number[]) => {
    if (!_startCoords || !_pickupCoords || !_endCoords) return;
    setLoadingRoutes(true);
    try {
      await fetchRoute([_startCoords[0], _startCoords[1]], [_pickupCoords[0], _pickupCoords[1]], 'route');
      await fetchRoute([_pickupCoords[0], _pickupCoords[1]], [_endCoords[0], _endCoords[1]], 'route2');
      setLoadingRoutes(false);
    }
    catch (err: any) {  
      setRoutesError(err.message);
      setLoadingRoutes(false);
      console.error('Error fetching routes:', err);
    }
  };

  const convertToKm = (meters: number) => {
    return (meters / 1000).toFixed(2);
  };

  const convertToHoursAndMinutes = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours === 0) {
      return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
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
                <div className="max-w-xl mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="mb-0">
                      <p className="text-xs mb-2">
                        <span className="text-gray-700">Starting Location: </span>
                        <span className="font-bold">{trip?.current_location}</span>
                      </p>
                      <p className="text-xs mb-2">
                        <span className="text-gray-700">Pickup Location: </span>
                        <span className="font-bold">{trip?.pickup_location}</span>
                      </p>
                    </div>
                    <div className="mb-0">
                      <p className="text-xs mb-2">
                        <span className="text-gray-700">Dropoff Location: </span>
                        <span className="font-bold">{trip?.dropoff_location}</span>
                      </p>
                      <p className="text-xs">
                        <span className="text-gray-700"> Current Cycle Used: </span>
                        <span className="font-bold">{trip?.current_cycle_used}</span>
                      </p>
                    </div>
                  </div>
                </div>
            </div>

            <hr className="mb-6 mt-0" />

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Route Map</h3>
              <div className="max-w-3xl mx-auto px-0">

              {/* Trip Metrics */}
              {(route && route2) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  
                    <div className="mb-2">
                      <p className="text-xs mb-2">
                        <span className="text-gray-700">Start to Pickup: </span>
                        (Distance: <span className="font-bold">{convertToKm(route.properties.distance)} km</span>, 
                        Duration: <span className="font-bold">{convertToHoursAndMinutes(route.properties.duration)}</span>)
                      </p>
                      <p className="text-xs mb-2">
                        <span className="text-gray-700">Pickup to Dropoff: </span>
                        (Distance: <span className="font-bold">{convertToKm(route2.properties.distance)} km</span>, 
                        Duration: <span className="font-bold">{convertToHoursAndMinutes(route2.properties.duration)}</span>)
                      </p>
                      <p className="text-xs mb-2">
                        <span className="text-gray-700">Whole Trip: </span>
                        (Distance: <span className="font-bold">{convertToKm(route2.properties.distance + route.properties.distance)} km</span>, 
                        Duration: <span className="font-bold">{convertToHoursAndMinutes(route2.properties.duration + route.properties.duration)}</span>)
                      </p>
                    </div>

                </div>
              )}
              </div>

              {/* Route Map */}
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
          </div>

        </div>
      </div>
  );
}