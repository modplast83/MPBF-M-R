import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Navigation, 
  Target, 
  Loader2, 
  RefreshCw,
  MapPinned,
  Crosshair
} from 'lucide-react';

interface GeofenceMapProps {
  latitude: number;
  longitude: number;
  radius: number;
  onLocationSelect: (lat: number, lng: number) => void;
  onRadiusChange?: (radius: number) => void;
  height?: string;
  interactive?: boolean;
  showCurrentLocation?: boolean;
  existingGeofences?: Array<{
    id: number;
    name: string;
    centerLatitude: number;
    centerLongitude: number;
    radius: number;
    isActive: boolean;
  }>;
}

declare global {
  interface Window {
    google: any;
  }
}

export const GeofenceMap: React.FC<GeofenceMapProps> = ({
  latitude,
  longitude,
  radius,
  onLocationSelect,
  onRadiusChange,
  height = '400px',
  interactive = true,
  showCurrentLocation = true,
  existingGeofences = []
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const existingCirclesRef = useRef<any[]>([]);
  const existingMarkersRef = useRef<any[]>([]);
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setMapError(null);

        // Load Google Maps API
        if (!window.google) {
          // Get the API key from environment variable
          const response = await fetch('/api/config/google-maps-key');
          const { apiKey } = await response.json();
          
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
            createMap();
          };
          
          script.onerror = () => {
            setMapError('Failed to load Google Maps API');
            setIsLoading(false);
          };
          
          document.head.appendChild(script);
        } else {
          createMap();
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to initialize map');
        setIsLoading(false);
      }
    };

    const createMap = () => {
      if (!mapRef.current) return;

      try {
        // Create map
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: 16,
          mapTypeId: 'hybrid',
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          scaleControl: true,
          streetViewControl: true,
          rotateControl: true,
          fullscreenControl: true,
        });

        googleMapRef.current = map;

        // Add main geofence circle
        const circle = new window.google.maps.Circle({
          strokeColor: '#3B82F6',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#3B82F6',
          fillOpacity: 0.15,
          map: map,
          center: { lat: latitude, lng: longitude },
          radius: radius,
          editable: interactive && !!onRadiusChange,
          draggable: interactive,
        });

        circleRef.current = circle;

        // Add main marker
        const marker = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
          title: 'Geofence Center',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#3B82F6" stroke="white" stroke-width="2"/>
                <circle cx="16" cy="16" r="6" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
          },
          draggable: interactive,
        });

        markerRef.current = marker;

        // Add existing geofences
        existingCirclesRef.current = [];
        existingMarkersRef.current = [];
        
        existingGeofences.forEach((geofence, index) => {
          const existingCircle = new window.google.maps.Circle({
            strokeColor: geofence.isActive ? '#10B981' : '#6B7280',
            strokeOpacity: 0.6,
            strokeWeight: 1,
            fillColor: geofence.isActive ? '#10B981' : '#6B7280',
            fillOpacity: 0.1,
            map: map,
            center: { lat: geofence.centerLatitude, lng: geofence.centerLongitude },
            radius: geofence.radius,
            editable: false,
            draggable: false,
          });

          const existingMarker = new window.google.maps.Marker({
            position: { lat: geofence.centerLatitude, lng: geofence.centerLongitude },
            map: map,
            title: geofence.name,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="${geofence.isActive ? '#10B981' : '#6B7280'}" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(24, 24),
            },
            draggable: false,
          });

          existingCirclesRef.current.push(existingCircle);
          existingMarkersRef.current.push(existingMarker);
        });

        // Event listeners for interactive mode
        if (interactive) {
          // Circle radius change
          if (onRadiusChange) {
            circle.addListener('radius_changed', () => {
              const newRadius = circle.getRadius();
              onRadiusChange(Math.round(newRadius));
            });
          }

          // Marker drag
          marker.addListener('dragend', () => {
            const position = marker.getPosition();
            const lat = position.lat();
            const lng = position.lng();
            
            circle.setCenter({ lat, lng });
            onLocationSelect(lat, lng);
            
            toast({
              title: "Location Updated",
              description: `New center: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            });
          });

          // Circle drag
          circle.addListener('dragend', () => {
            const center = circle.getCenter();
            const lat = center.lat();
            const lng = center.lng();
            
            marker.setPosition({ lat, lng });
            onLocationSelect(lat, lng);
            
            toast({
              title: "Location Updated",
              description: `New center: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            });
          });

          // Map click for location selection
          map.addListener('click', (event: any) => {
            if (isSelectingLocation) {
              const lat = event.latLng.lat();
              const lng = event.latLng.lng();
              
              marker.setPosition({ lat, lng });
              circle.setCenter({ lat, lng });
              onLocationSelect(lat, lng);
              
              setIsSelectingLocation(false);
              
              toast({
                title: "Location Selected",
                description: `New center: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
              });
            }
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error creating map:', error);
        setMapError('Failed to create map');
        setIsLoading(false);
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      existingCirclesRef.current.forEach(circle => circle.setMap(null));
      existingMarkersRef.current.forEach(marker => marker.setMap(null));
    };
  }, [latitude, longitude, radius, interactive, existingGeofences]);

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setUserLocation({ lat, lng });
          
          if (googleMapRef.current) {
            googleMapRef.current.setCenter({ lat, lng });
            
            // Add user location marker if not already present
            new window.google.maps.Marker({
              position: { lat, lng },
              map: googleMapRef.current,
              title: 'Your Current Location',
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#EF4444" stroke="white" stroke-width="2"/>
                    <circle cx="12" cy="12" r="4" fill="white"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(24, 24),
              },
            });
          }
          
          toast({
            title: "Location Found",
            description: `Your location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Could not get your current location. Please check location permissions.",
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by this browser",
        variant: "destructive",
      });
    }
  };

  // Use current location for geofence
  const useCurrentLocation = () => {
    if (userLocation) {
      if (markerRef.current) {
        markerRef.current.setPosition(userLocation);
      }
      if (circleRef.current) {
        circleRef.current.setCenter(userLocation);
      }
      if (googleMapRef.current) {
        googleMapRef.current.setCenter(userLocation);
      }
      
      onLocationSelect(userLocation.lat, userLocation.lng);
      
      toast({
        title: "Location Set",
        description: "Current location set as geofence center",
      });
    } else {
      getCurrentLocation();
    }
  };

  // Center map on geofence
  const centerOnGeofence = () => {
    if (googleMapRef.current) {
      googleMapRef.current.setCenter({ lat: latitude, lng: longitude });
      googleMapRef.current.setZoom(16);
    }
  };

  if (mapError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <MapPin className="h-5 w-5" />
            Location Selection (Manual Mode)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium mb-2">Manual Location Entry</p>
              <p className="text-xs text-blue-600">
                Enter coordinates manually or use the "Get Current Location" button below.
              </p>
            </div>

            {/* Current Location Display */}
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-6 border-2 border-dashed border-blue-300">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-blue-800 mb-2">Current Geofence Location</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-500">Latitude</p>
                    <p className="font-mono text-blue-600">{latitude.toFixed(6)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-500">Longitude</p>
                    <p className="font-mono text-blue-600">{longitude.toFixed(6)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-500">Radius</p>
                    <p className="font-mono text-blue-600">{radius}m</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Location Controls */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={latitude}
                    onChange={(e) => onLocationSelect(parseFloat(e.target.value) || latitude, longitude)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="26.4011776"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={longitude}
                    onChange={(e) => onLocationSelect(latitude, parseFloat(e.target.value) || longitude)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50.069504"
                  />
                </div>
              </div>

              {/* Location Actions */}
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const lat = position.coords.latitude;
                          const lng = position.coords.longitude;
                          onLocationSelect(lat, lng);
                          toast({
                            title: "Location Updated",
                            description: `Current location set: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                          });
                        },
                        (error) => {
                          toast({
                            title: "Location Error",
                            description: "Could not get your current location. Please check location permissions.",
                            variant: "destructive",
                          });
                        }
                      );
                    } else {
                      toast({
                        title: "Not Supported",
                        description: "Geolocation is not supported by this browser",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="flex-1 sm:flex-none"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Current Location
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Set to Bahrain factory default coordinates
                    onLocationSelect(26.4011776, 50.069504);
                    toast({
                      title: "Location Set",
                      description: "Default factory location set",
                    });
                  }}
                  className="flex-1 sm:flex-none"
                >
                  <MapPinned className="h-4 w-4 mr-2" />
                  Use Default Location
                </Button>
              </div>

              {/* Radius Control */}
              {onRadiusChange && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Radius (meters)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      step="10"
                      value={radius}
                      onChange={(e) => onRadiusChange(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      min="10"
                      max="1000"
                      value={radius}
                      onChange={(e) => onRadiusChange(parseInt(e.target.value) || 100)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span className="text-sm text-gray-500">m</span>
                  </div>
                </div>
              )}
            </div>

            {/* Existing Geofences */}
            {existingGeofences.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Existing Geofences</h4>
                <div className="space-y-2">
                  {existingGeofences.map((geofence, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${geofence.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <div>
                          <p className="text-sm font-medium">{geofence.name}</p>
                          <p className="text-xs text-gray-500">
                            {geofence.centerLatitude.toFixed(6)}, {geofence.centerLongitude.toFixed(6)} • {geofence.radius}m
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onLocationSelect(geofence.centerLatitude, geofence.centerLongitude);
                          if (onRadiusChange) {
                            onRadiusChange(geofence.radius);
                          }
                          toast({
                            title: "Location Copied",
                            description: `Location copied from ${geofence.name}`,
                          });
                        }}
                      >
                        <Target className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> The Google Maps integration is currently unavailable. You can still set geofence locations using the manual controls above.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Geofence Location
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {radius}m radius
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Control buttons */}
          {interactive && (
            <div className="flex flex-wrap gap-2">
              {showCurrentLocation && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Find My Location
                </Button>
              )}
              
              {userLocation && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={useCurrentLocation}
                >
                  <MapPinned className="h-4 w-4 mr-2" />
                  Use Current Location
                </Button>
              )}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsSelectingLocation(!isSelectingLocation)}
                className={isSelectingLocation ? 'bg-blue-50 border-blue-300' : ''}
              >
                <Crosshair className="h-4 w-4 mr-2" />
                {isSelectingLocation ? 'Click on Map' : 'Select Location'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={centerOnGeofence}
              >
                <Target className="h-4 w-4 mr-2" />
                Center Map
              </Button>
            </div>
          )}

          {isSelectingLocation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 font-medium">
                Location Selection Mode Active
              </p>
              <p className="text-xs text-blue-600">
                Click anywhere on the map to set the geofence center location
              </p>
            </div>
          )}

          {/* Map container */}
          <div className="relative">
            <div 
              ref={mapRef} 
              style={{ height, width: '100%' }}
              className="rounded-lg border border-gray-200 overflow-hidden"
            />
            
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
          </div>

          {/* Map legend */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Current Geofence</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Active Geofences</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span>Inactive Geofences</span>
            </div>
            {userLocation && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Your Location</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeofenceMap;