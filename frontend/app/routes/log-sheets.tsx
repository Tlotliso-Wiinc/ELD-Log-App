import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapboxRoute from "~/components/MapboxRoute";
import { getHost } from "../utils/utils";
import LogSheet from "~/components/LogSheet";

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

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function LogSheets() {
  const { id } = useParams();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [trip, setTrip] = useState<TripEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [startCoords, setStartCoords] = useState<number[] | null>(null);
  const [endCoords, setEndCoords] = useState<number[] | null>(null);
  const [pickupCoords, setPickupCoords] = useState<number[] | null>(null);
  const [loadingRoutes, setLoadingRoutes] = useState<boolean>(false);
  const [route, setRoute] = useState<RouteGeoJSON | null>(null);
  const [route2, setRoute2] = useState<RouteGeoJSON | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [routesError, setRoutesError] = useState<string | null>(null);
  const [logData, setLogData] = useState<any | null>(null);

  const fetchDriver = async (driverId: string) => {
    try {
      const response = await fetch(getHost() + `/api/drivers/${driverId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Driver data:', data);
      setDriver(data);
    } catch (error) {
      console.error('Error fetching driver:', error);
    }
  };

  const fetchTrip = async () => {
    setLoading(true);
    try {
      const response = await fetch(getHost() + `/api/trips/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Trip data:', data);
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

  const fetchTimeLogData = async () => {
    try {
      const response = await fetch(getHost() + `/api/v2/trips/${id}/time-log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driver: 1,
          route1_duration: route?.properties.duration,
          route1_distance: route?.properties.distance,
          route2_duration: route2?.properties.duration,
          route2_distance: route2?.properties.distance,
        }),
      });
      if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
      const data = await response.json();
      console.log('Time log sheet data:', data);
      setLogData(data);
    } catch (error) {
      console.error('Error fetching time log sheet:', error);
    }
  };
  

  const convertToKm = (meters: number) => {
    return (meters / 1000).toFixed(2);
  };

  const convertToMiles = (meters: number) => {
    return (meters / 1609.34);
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
    fetchDriver('1');
    fetchTrip();
  }, [id]);

  useEffect(() => {
    if (route && route2) {
      console.log('Lets get the time log sheet data!! Nikka!');
      fetchTimeLogData();
    }
  }, [route, route2]);
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xs shadow-md p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-gray-800">Log Sheets</h2>
          <Link
            to={`/trip/${id}`}
            className="text-sm text-[#043f51] hover:text-[#008080] flex items-center"
          >
            ← Back to Trip Information
          </Link>
        </div>
      {loading || !route || !route2 || !driver || !trip || !logData ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
            <hr className="mb-6 mt-0" />

            <div className="">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Day 1</h3>
                <div className="">
                  <LogSheet 
                    date={
                      { 
                        day: new Date(trip.created_at).getDate().toString(), 
                        month: (new Date(trip.created_at).getMonth() + 1).toString(), 
                        year: new Date().getFullYear().toString()
                      }
                    }
                    from={trip.current_location}
                    to={trip.dropoff_location}
                    carrierName={driver?.carrier}
                    homeTerminalAddress={driver?.home_terminal_address}
                    truckNumberInfo={driver?.license_number + ' / ' + driver?.trailer_number}
                    totalMilesDrivingToday={convertToMiles(route.properties.distance + route2.properties.distance).toFixed(0)}
                    totalMileageToday={convertToMiles(route2.properties.distance + route.properties.distance).toFixed(0)}
                    logData={logData}
                  />
                </div>
            </div>

            <hr className="mb-6 mt-0" />

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Day 2</h3>
              <div className="">

              </div>
            </div>
        </div>
      )}

      </div>
    </div>
  );
}