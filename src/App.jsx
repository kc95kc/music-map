import MapView from './components/MapView';

export default function App() {
  return (
    <div className="relative h-screen w-screen">
      <MapView />

      {/* Optional overlay example (delete or customize later) */}
      {/* <div className="absolute top-4 left-4 z-50 bg-white p-4 rounded shadow-md">
        <h1 className="text-lg font-bold">Overlay Content</h1>
      </div> */}
    </div>
  );
}
