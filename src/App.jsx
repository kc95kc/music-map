import { useState } from 'react';
import MapView from './components/MapView';
import SignupForm from './components/SignupForm';

export default function App() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Top Banner */}
      <div className="bg-black text-white px-6 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🎵</span>
          <h1 className="text-lg font-bold">Music Map</h1>
        </div>
        <button
  onClick={() => setShowSignup(true)}
  className="text-black border border-white px-4 py-1 rounded hover:bg-white hover:text-black transition"
>
  Sign Up
</button>

      </div>

      {/* Map Area (fills remaining screen) */}
      <div className="flex-1 relative">
        <MapView />

        {/* Sign Up Modal Overlay */}
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
    </div>
  );
}
