import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

// Custom Leaflet marker icon
const customIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapView() {
  const [pins, setPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchPins = async () => {
      const { data, error } = await supabase.from('submissions').select('*');
      if (error) {
        console.error('Error fetching pins:', error.message);
      } else {
        setPins(data);
      }
    };
    fetchPins();
  }, []);

  const handlePinClick = (pin) => {
    setSelectedPin(pin);
    if (collapsed) setCollapsed(false);
  };

  return (
    <div className="relative h-full w-full z-0">
      {/* Sidebar */}
      <div
        className={`absolute left-0 top-0 bottom-0 z-40 bg-white shadow-md border-r border-gray-200 transition-all duration-300
        ${collapsed ? 'w-12' : 'w-72 p-4'}`}
      >
        {/* Collapse/Expand Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '»' : '×'}
        </button>

        {/* Sidebar Content */}
        {!collapsed && selectedPin ? (
          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-bold">{selectedPin.title || selectedPin.song_name}</h2>
            {selectedPin.image_url && (
              <img
                src={selectedPin.image_url}
                alt={selectedPin.title || selectedPin.song_name}
                className="rounded"
              />
            )}
            <p className="text-sm text-gray-700">
              <strong>{selectedPin.artist_name}</strong>
              <br />
              {selectedPin.description}
            </p>
            <table className="w-full text-sm border mt-2">
              <tbody>
                {selectedPin.album && (
                  <tr className="border-b">
                    <td className="font-semibold px-2 py-1">Album</td>
                    <td className="px-2 py-1">{selectedPin.album}</td>
                  </tr>
                )}
                {selectedPin.song_name && (
                  <tr className="border-b">
                    <td className="font-semibold px-2 py-1">Song</td>
                    <td className="px-2 py-1">{selectedPin.song_name}</td>
                  </tr>
                )}
                {selectedPin.latitude && selectedPin.longitude && (
                  <tr>
                    <td className="font-semibold px-2 py-1">Street View</td>
                    <td className="px-2 py-1">
                      <a
                        href={`https://www.google.com/maps?q=&layer=c&cbll=${selectedPin.latitude},${selectedPin.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 underline"
                      >
                        View on Google Maps
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : !collapsed ? (
          <p className="text-gray-500 mt-8 text-sm italic">Click a pin to view details</p>
        ) : null}
      </div>

      {/* Map */}
      <MapContainer
        center={[40, -20]}
        zoom={2}
        className="h-full w-full z-10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />

        <MapMarkers pins={pins} onPinClick={handlePinClick} />
      </MapContainer>
    </div>
  );
}

// Child component with access to Leaflet map instance
function MapMarkers({ pins, onPinClick }) {
  const map = useMap();

  const handleMarkerClick = (pin) => {
    onPinClick(pin);
    if (pin.latitude && pin.longitude) {
      map.setView([pin.latitude, pin.longitude], 17, {
        animate: true,
      });
    }
  };

  return (
    <>
      {pins
        .filter((pin) => pin.latitude && pin.longitude)
        .map((pin) => (
          <Marker
            key={pin.id}
            position={[parseFloat(pin.latitude), parseFloat(pin.longitude)]}
            icon={customIcon}
            eventHandlers={{
              click: () => handleMarkerClick(pin),
            }}
          >
            <Popup>
              <strong>{pin.title || pin.song_name}</strong>
              <br />
              {pin.artist_name}
            </Popup>
          </Marker>
        ))}
    </>
  );
}
