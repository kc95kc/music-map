import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet-defaulticon-compatibility';
import { useState } from 'react';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';


export default function MapView() {
  const [selectedPin, setSelectedPin] = useState(null);

  // Abbey Road pin data
  const abbeyRoad = {
    id: 1,
    title: 'Abbey Road',
    artist: 'The Beatles',
    album: 'Abbey Road',
    song: 'Come Together',
    coords: [51.53205203427031, -0.17733518220901687],
    image: 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg',
    description: 'The iconic Abbey Road crosswalk, where The Beatles shot their legendary album cover in 1969.',
    link: 'https://en.wikipedia.org/wiki/Abbey_Road_(album)',
    streetView: 'https://www.google.com/maps/@51.53205203427031,-0.17733518220901687,3a,75y,90t/data=!3m6!1e1!3m4!1s0x487610a6b8b4b91b:0x53c26101fdf40b08!8m2!3d51.53205203427031!4d-0.17733518220901687',
  };

  const customIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className="w-72 bg-white p-4 shadow-md border-r border-gray-200 overflow-y-auto">
        {selectedPin ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedPin.title}</h2>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-gray-500 hover:text-black font-bold text-lg leading-none"
              >
                ×
              </button>
            </div>
            <img src={selectedPin.image} alt={selectedPin.title} className="rounded" />
            <p className="text-sm text-gray-700">
              <strong>{selectedPin.artist}</strong>
              <br />
              {selectedPin.description}
            </p>
            <a
              href={selectedPin.link}
              target="_blank"
              className="text-blue-500 underline text-sm"
            >
              More info →
            </a>
            <table className="w-full text-sm border mt-4">
  <tbody>
    <tr className="border-b">
      <td className="font-semibold px-2 py-1">Artist Name</td>
      <td className="px-2 py-1">{selectedPin.artist}</td>
    </tr>
    <tr className="border-b">
      <td className="font-semibold px-2 py-1">Album</td>
      <td className="px-2 py-1">{selectedPin.album}</td>
    </tr>
    <tr className="border-b">
      <td className="font-semibold px-2 py-1">Song Name</td>
      <td className="px-2 py-1">{selectedPin.song}</td>
    </tr>
    <tr>
      <td className="font-semibold px-2 py-1">Street View</td>
      <td className="px-2 py-1">
        <a
          href={selectedPin.streetView}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          View on Google Maps
        </a>
      </td>
    </tr>
  </tbody>
</table>
          </div>
          
        ) : (
          <p className="text-gray-500 text-sm italic">Click a pin to view details</p>
        )}
      </div>

      {/* Map */}
      <div className="flex-1">
        <MapContainer center={abbeyRoad.coords} zoom={17} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          />
          <Marker
  position={abbeyRoad.coords}
  icon={customIcon}
  eventHandlers={{
    click: () => setSelectedPin(abbeyRoad),
  }}
>
  <Popup>
    <strong>{abbeyRoad.title}</strong>
    <br />
    {abbeyRoad.artist}
  </Popup>
</Marker>
        </MapContainer>
      </div>
    </div>
  );
}
