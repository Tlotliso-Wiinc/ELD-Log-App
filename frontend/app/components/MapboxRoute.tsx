import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Replace this with your actual Mapbox access token
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoidGxvdGxpc28xOTkxIiwiYSI6ImNtOGhvNmczbzAzemIyanF5aGJ4MzcycTMifQ.srM8EiwddIzpHRGpvGTo5g';
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

// More flexible type that accepts both tuples and arrays
interface MapboxRouteProps {
    startCoords: number[]; // [longitude, latitude]
    endCoords: number[];   // [longitude, latitude]
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
  
  const MapboxRoute: React.FC<MapboxRouteProps> = ({ startCoords, endCoords, zoom = 12 }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [route, setRoute] = useState<RouteGeoJSON | null>(null);
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
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: validStartCoords,
        zoom: zoom
      });
  
      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  
      // Clean up on unmount
      return () => {
        if (map.current) {
          map.current.remove();
        }
      };
    }, []);
  
    // Add markers and fetch route when coordinates change
    useEffect(() => {
      if (!map.current || !startCoords || !endCoords) return;
  
      const validStartCoords = validateCoords(startCoords);
      const validEndCoords = validateCoords(endCoords);
  
      // Clear previous markers
      const markers = document.getElementsByClassName('mapboxgl-marker');
      while(markers[0]) {
        markers[0].parentNode?.removeChild(markers[0]);
      }
  
      // Add start marker
      new mapboxgl.Marker({ color: '#3887be' })
        .setLngLat(validStartCoords)
        .addTo(map.current);
  
      // Add end marker
      new mapboxgl.Marker({ color: '#f30' })
        .setLngLat(validEndCoords)
        .addTo(map.current);
  
      // Fetch the route
      fetchRoute(validStartCoords, validEndCoords);
  
      // Fit bounds to include both points
      const bounds = new mapboxgl.LngLatBounds()
        .extend(validStartCoords)
        .extend(validEndCoords);
      
      map.current.fitBounds(bounds, {
        padding: 80,
        duration: 1000
      });
    }, [startCoords, endCoords]);
  
    // Add route to map when route data changes
    useEffect(() => {
      if (!map.current || !route) return;
  
      // Check if route layer already exists
      if (map.current.getSource('route')) {
        const source = map.current.getSource('route') as mapboxgl.GeoJSONSource;
        source.setData(route as any);
      } else {
        map.current.on('load', () => {
          // Make sure the map is loaded
          addRouteLayer();
        });
  
        // If the map is already loaded, add the route layer directly
        if (map.current.loaded()) {
          addRouteLayer();
        }
      }
    }, [route]);
  
    const addRouteLayer = () => {
      if (!map.current || !route) return;
      
      // Add route source and layer
      map.current.addSource('route', {
        type: 'geojson',
        data: route as any
      });
  
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    };
  
    const fetchRoute = async (start: [number, number], end: [number, number]) => {
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
        
        if (data.routes && data.routes.length > 0) {
          // Create GeoJSON object from the route
          setRoute({
            type: 'Feature',
            properties: {},
            geometry: data.routes[0].geometry
          });
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
  
    return (
      <div className="map-container">
        {error && <div className="error-message">Error: {error}</div>}
        {loading && <div className="loading-indicator">Loading route...</div>}
        <div ref={mapContainer} style={{ width: '100%', height: '500px', borderRadius: '8px' }} />
      </div>
    );
  };
  
  export default MapboxRoute;