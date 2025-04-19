import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import SubmitForm from './SubmitForm';
import SignupForm from './SignupForm';

const customIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectionIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  shadowSize: [45, 45],
  className: 'opacity-70 saturate-200',
});

export default function MapView() {
  const [pins, setPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState(null); // 'submit' or 'view'
  const [clickCoords, setClickCoords] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

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
    setMode('view');
    if (collapsed) setCollapsed(false);
  };

  return (
    <div className="relative h-full w-full z-0">
      {/* Top Nav Bar */}
      <div className="absolute top-0 left-0 w-full z-50 px-6 py-3 flex justify-between items-center bg-black text-white shadow">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🎵</span>
          <h1 className="text-lg font-bold">Music Map</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setMode('submit');
              setSelectedPin(null);
              setCollapsed(false);
            }}
            className="text-sm border border-white px-4 py-1 rounded hover:bg-white hover:text-black"
          >
            Submit
          </button>
          <button
            onClick={() => setShowSignup(true)}
            className="text-sm border border-white px-4 py-1 rounded hover:bg-white hover:text-black"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`absolute left-0 top-[60px] bottom-0 z-40 bg-white shadow-md border-r border-gray-200 transition-all duration-300
        ${collapsed ? 'w-12' : 'w-80 p-4'}`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '»' : '×'}
        </button>

        {!collapsed && mode === 'submit' && (
          <SubmitForm
            coords={clickCoords}
            onSuccess={() => {
              setMode(null);
              setSelectedPin(null);
              setClickCoords(null);
            }}
          />
        )}

        {!collapsed && mode === 'view' && selectedPin && (
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
        )}
      </div>

      {/* Map */}
      <MapContainer center={[40, -20]} zoom={2} className="h-full w-full z-10">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />
        <MapMarkers pins={pins} onPinClick={handlePinClick} />
        <MapClickHandler onClick={setClickCoords} />

        {/* Submission Location Marker */}
        {mode === 'submit' && clickCoords && (
          <Marker
            position={[clickCoords.lat, clickCoords.lng]}
            icon={selectionIcon}
          >
            <Popup>Selected Location</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Signup Modal */}
      {showSignup && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-[350px] relative">
            <button
              onClick={() => setShowSignup(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
            >
              ×
            </button>
            <SignupForm />
          </div>
        </div>
      )}
    </div>
  );
}

function MapMarkers({ pins, onPinClick }) {
  const map = useMap();

  const handleMarkerClick = (pin) => {
    onPinClick(pin);
    if (pin.latitude && pin.longitude) {
      map.setView([pin.latitude, pin.longitude], 17, { animate: true });
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

function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}
