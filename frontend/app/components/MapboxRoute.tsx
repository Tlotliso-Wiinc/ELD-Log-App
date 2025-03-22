import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface MapboxRouteProps {
  startCoords: number[]; // [longitude, latitude]
  endCoords: number[];   // [longitude, latitude]
  pickupCoords: number[]; // [longitude, latitude]
  zoom?: number;
}

interface RouteGeoJSON {
  type: 'Feature';
  properties: Record<string, any>;
  geometry: {
    type: 'LineString';
    coordinates: number[][];
  };
}

// Create a custom marker with a colored circle
const createCustomMarker = (label: string, text: string) => {
  const el = document.createElement('div');
  el.className = 'custom-marker';
  el.innerHTML = `
                  <div class="marker-pin-${label.toLowerCase()}">
                    <div class="marker-circle"></div>
                  </div>
                  <span class="marker-text">${text}</span>
                `;
  return el;
}
  
const MapboxRoute: React.FC<MapboxRouteProps> = ({ startCoords, pickupCoords, endCoords, zoom = 12 }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapInitialized, setMapInitialized] = useState<boolean>(false);
  const [route, setRoute] = useState<RouteGeoJSON | null>(null);
  const [route2, setRoute2] = useState<RouteGeoJSON | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure coordinates are valid
  const validateCoords = (coords: number[]): [number, number] => {
    // Make sure we have at least two elements
    if (!coords || coords.length < 2) {
      console.warn('Invalid coordinates provided, using default');
      return [-122.4194, 37.7749]; // Default to San Francisco
    }
    // Return just the first two elements as a tuple
    return [coords[0], coords[1]];
  };

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return; // Map already initialized or container not ready
    
    const validStartCoords = validateCoords(startCoords);
    
    try {
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: validStartCoords,
        zoom: zoom
      });

      // Add navigation controls
      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Only set map and initialized state after map has loaded
      newMap.on('load', () => {
        map.current = newMap;
        setMapInitialized(true);
        console.log('Map initialized successfully');
      });

      // Clean up on unmount
      return () => {
        newMap.remove();
        map.current = null;
        setMapInitialized(false);
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }
  }, [mapContainer.current]); // Only re-run when the container ref changes

  // Add markers and fetch route when coordinates change and map is ready
  useEffect(() => {
    if (!mapInitialized || !map.current) return;
    
    try {
      console.log('Adding markers to map');
      const validStartCoords = validateCoords(startCoords);
      const validEndCoords = validateCoords(endCoords);
      const validPickupCoords = validateCoords(pickupCoords);

      // Clear previous markers
      const markers = document.getElementsByClassName('mapboxgl-marker');
      while(markers[0]) {
        markers[0].parentNode?.removeChild(markers[0]);
      }

      const startMarker = createCustomMarker('start', 'Start'); // #3887be'
      const pickupMarker = createCustomMarker('pickup', 'Pickup'); 
      const endMarker = createCustomMarker('dropoff', 'Dropoff'); // #f30

      // Add start marker
      new mapboxgl.Marker({ element: startMarker })
      .setLngLat(validStartCoords)
      .addTo(map.current);

      // Add pickup marker
      new mapboxgl.Marker({ element: pickupMarker })
        .setLngLat(validPickupCoords)
        .addTo(map.current);

      // Add end marker
      new mapboxgl.Marker({ element: endMarker })
        .setLngLat(validEndCoords)
        .addTo(map.current);

      // Fetch the routes
      fetchRoute(validStartCoords, validPickupCoords);
      fetchRoute(validPickupCoords, validEndCoords, 'route2');

      // Fit bounds to include all the points
      const bounds = new mapboxgl.LngLatBounds()
        .extend(validStartCoords)
        .extend(validPickupCoords)
        .extend(validEndCoords);
      
      map.current.fitBounds(bounds, {
        padding: 80,
        duration: 1000
      });
    } catch (err) {
      console.error('Error adding markers:', err);
      setError('Failed to add markers to map');
    }
  }, [startCoords, endCoords, mapInitialized]); // Include mapInitialized in dependencies

  const addRouteLayer = (routeId: string = 'route', routeObj: RouteGeoJSON | null = route) => {
    if (!map.current || !routeObj) return;
    
    try {
      // Add route source
      map.current.addSource(routeId, {
        type: 'geojson',
        data: routeObj as any
      });

      // Add route layer
      map.current.addLayer({
        id: routeId,
        type: 'line',
        source: routeId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 6,
          'line-opacity': 0.85
        }
      });
    } catch (err) {
      console.error('Error adding route layer:', err);
      setError('Failed to add route layer to map');
    }
  };

  const fetchRoute = async (start: [number, number], end: [number, number], routeId: string = 'route') => {
    try {
      setLoading(true);
      setError(null);

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
            properties: {},
            geometry: data.routes[0].geometry
          });
        }
        else if (routeId === 'route2') {
          setRoute2({
            type: 'Feature',
            properties: {},
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

  // Add route to map when route data changes
  useEffect(() => {
    if (!mapInitialized || !map.current || !route || !route2) {
      return;
    }

    try {
      // Check if route already exists
      if (map.current.getSource('route')) {
        const source = map.current.getSource('route') as mapboxgl.GeoJSONSource;
        source.setData(route as any);
      } else {
        addRouteLayer();
      }
      
      // Check if route2 already exists
      if (map.current.getSource('route2')) {
        const source = map.current.getSource('route2') as mapboxgl.GeoJSONSource;
        source.setData(route2 as any);
      }
      else {
        addRouteLayer('route2', route2);
      }

    } catch (err) {
      console.error('Error updating route:', err);
      setError('Failed to update route on map');
    }
  }, [route, mapInitialized]);

  return (
    <div className="map-container">
      {error && <div className="error-message">Error: {error}</div>}
      {loading && <div className="loading-indicator">Loading route...</div>}
      <div ref={mapContainer} style={{ width: '100%', height: '500px', borderRadius: '8px' }} />
    </div>
  );
};

export default MapboxRoute;