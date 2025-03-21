import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Replace this with your actual Mapbox access token
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoidGxvdGxpc28xOTkxIiwiYSI6ImNtOGhvNmczbzAzemIyanF5aGJ4MzcycTMifQ.srM8EiwddIzpHRGpvGTo5g';
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface Location {
    coordinates: number[];
    label: string;
    type: 'start' | 'pickup' | 'dropoff';
  }
  
  interface MapboxThreePointRouteProps {
    startLocation: Location;
    pickupLocation: Location;
    dropoffLocation: Location;
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
  
  const MapboxThreePointRoute: React.FC<MapboxThreePointRouteProps> = ({
    startLocation,
    pickupLocation,
    dropoffLocation,
    zoom = 12
  }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [mapInitialized, setMapInitialized] = useState<boolean>(false);
    const [firstRouteData, setFirstRouteData] = useState<RouteGeoJSON | null>(null);
    const [secondRouteData, setSecondRouteData] = useState<RouteGeoJSON | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    // Ensure coordinates are valid
    const validateCoords = (coords: number[]): [number, number] => {
      if (!coords || coords.length < 2) {
        console.warn('Invalid coordinates provided, using default');
        return [-122.4194, 37.7749]; // Default to San Francisco
      }
      return [coords[0], coords[1]];
    };
  
    // Get marker color based on location type
    const getMarkerColor = (type: 'start' | 'pickup' | 'dropoff'): string => {
      switch (type) {
        case 'start':
          return '#3887be'; // Blue
        case 'pickup':
          return '#f7b731'; // Yellow/Orange
        case 'dropoff':
          return '#e74c3c'; // Red
        default:
          return '#3887be';
      }
    };
  
    // Create a custom marker element with label
    const createCustomMarker = (location: Location): HTMLElement => {
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.position = 'relative';
      
      // Marker dot
      const dot = document.createElement('div');
      dot.style.width = '24px';
      dot.style.height = '24px';
      dot.style.borderRadius = '50%';
      dot.style.backgroundColor = getMarkerColor(location.type);
      dot.style.border = '2px solid white';
      dot.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      // Label container
      const labelContainer = document.createElement('div');
      labelContainer.style.position = 'absolute';
      labelContainer.style.top = '30px';
      labelContainer.style.left = '50%';
      labelContainer.style.transform = 'translateX(-50%)';
      labelContainer.style.backgroundColor = 'white';
      labelContainer.style.padding = '4px 8px';
      labelContainer.style.borderRadius = '4px';
      labelContainer.style.boxShadow = '0 1px 2px rgba(0,0,0,0.2)';
      labelContainer.style.whiteSpace = 'nowrap';
      labelContainer.style.color = '#333';
      labelContainer.style.fontWeight = 'bold';
      labelContainer.style.fontSize = '12px';
      
      // Label text
      const label = document.createTextNode(location.label);
      labelContainer.appendChild(label);
      
      markerElement.appendChild(dot);
      markerElement.appendChild(labelContainer);
      
      return markerElement;
    };
  
    // Initialize map
    useEffect(() => {
      if (map.current || !mapContainer.current) return;
      
      const validStartCoords = validateCoords(startLocation.coordinates);
      
      try {
        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: validStartCoords,
          zoom: zoom
        });
  
        newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
  
        newMap.on('load', () => {
          map.current = newMap;
          setMapInitialized(true);
          console.log('Map initialized successfully');
        });
  
        return () => {
          newMap.remove();
          map.current = null;
          setMapInitialized(false);
        };
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map');
      }
    }, [mapContainer.current]);
  
    // Add markers and fetch routes when map is ready
    useEffect(() => {
      if (!mapInitialized || !map.current) return;
      
      try {
        console.log('Adding markers to map');
        const validStartCoords = validateCoords(startLocation.coordinates);
        const validPickupCoords = validateCoords(pickupLocation.coordinates);
        const validDropoffCoords = validateCoords(dropoffLocation.coordinates);
  
        // Clear previous markers
        const markers = document.getElementsByClassName('mapboxgl-marker');
        while(markers[0]) {
          markers[0].parentNode?.removeChild(markers[0]);
        }
  
        // Add custom markers with labels
        new mapboxgl.Marker({ element: createCustomMarker(startLocation) })
          .setLngLat(validStartCoords)
          .addTo(map.current);
  
        new mapboxgl.Marker({ element: createCustomMarker(pickupLocation) })
          .setLngLat(validPickupCoords)
          .addTo(map.current);
          
        new mapboxgl.Marker({ element: createCustomMarker(dropoffLocation) })
          .setLngLat(validDropoffCoords)
          .addTo(map.current);
  
        // Fetch routes
        fetchRoute(validStartCoords, validPickupCoords, 'first');
        fetchRoute(validPickupCoords, validDropoffCoords, 'second');
  
        // Fit bounds to include all points
        const bounds = new mapboxgl.LngLatBounds()
          .extend(validStartCoords)
          .extend(validPickupCoords)
          .extend(validDropoffCoords);
        
        map.current.fitBounds(bounds, {
          padding: 100,
          duration: 1000
        });
      } catch (err) {
        console.error('Error adding markers:', err);
        setError('Failed to add markers to map');
      }
    }, [startLocation, pickupLocation, dropoffLocation, mapInitialized]);
  
    // Add routes to map when route data changes
    useEffect(() => {
      if (!mapInitialized || !map.current) return;
  
      try {
        // Handle first route (start to pickup)
        if (firstRouteData) {
          if (map.current.getSource('route-first')) {
            const source = map.current.getSource('route-first') as mapboxgl.GeoJSONSource;
            source.setData(firstRouteData as any);
          } else if (map.current.loaded()) {
            addRouteLayer(firstRouteData, 'first', '#3887be'); // Blue
          } else {
            map.current.on('load', () => {
              addRouteLayer(firstRouteData, 'first', '#3887be');
            });
          }
        }
  
        // Handle second route (pickup to dropoff)
        if (secondRouteData) {
          if (map.current.getSource('route-second')) {
            const source = map.current.getSource('route-second') as mapboxgl.GeoJSONSource;
            source.setData(secondRouteData as any);
          } else if (map.current.loaded()) {
            addRouteLayer(secondRouteData, 'second', '#e74c3c'); // Red
          } else {
            map.current.on('load', () => {
              addRouteLayer(secondRouteData, 'second', '#e74c3c');
            });
          }
        }
      } catch (err) {
        console.error('Error updating routes:', err);
        setError('Failed to update routes on map');
      }
    }, [firstRouteData, secondRouteData, mapInitialized]);
  
    const addRouteLayer = (routeData: RouteGeoJSON, id: string, color: string) => {
      if (!map.current) return;
      
      try {
        // Add route source and layer
        map.current.addSource(`route-${id}`, {
          type: 'geojson',
          data: routeData as any
        });
  
        map.current.addLayer({
          id: `route-${id}`,
          type: 'line',
          source: `route-${id}`,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': color,
            'line-width': 5,
            'line-opacity': 0.75,
            'line-dasharray': id === 'second' ? [2, 1] : [1] // Make second route dashed
          }
        });
      } catch (err) {
        console.error(`Error adding route layer ${id}:`, err);
        setError(`Failed to add route layer ${id} to map`);
      }
    };
  
    const fetchRoute = async (
      start: [number, number], 
      end: [number, number], 
      routeType: 'first' | 'second'
    ) => {
      try {
        setLoading(true);
  
        // Convert coordinates to "longitude,latitude" format
        const startStr = `${start[0]},${start[1]}`;
        const endStr = `${end[0]},${end[1]}`;
  
        // Fetch route from Mapbox Directions API
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${startStr};${endStr}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
        );
  
        if (!response.ok) {
          throw new Error(`Failed to fetch ${routeType} route`);
        }
  
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          // Create GeoJSON object from the route
          const routeData: RouteGeoJSON = {
            type: 'Feature',
            properties: {},
            geometry: data.routes[0].geometry
          };
          
          if (routeType === 'first') {
            setFirstRouteData(routeData);
          } else {
            setSecondRouteData(routeData);
          }
        } else {
          throw new Error(`No ${routeType} route found`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error(`Error fetching ${routeType} route:`, err);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="map-container">
        {error && (
          <div className="error-message" style={{ color: 'red', padding: '8px 0' }}>
            Error: {error}
          </div>
        )}
        {loading && (
          <div className="loading-indicator" style={{ padding: '8px 0' }}>
            Loading routes...
          </div>
        )}
        <div ref={mapContainer} style={{ width: '100%', height: '500px', borderRadius: '8px' }} />
      </div>
    );
  };
  
  export default MapboxThreePointRoute;