import DMHeader from '../components/DMHeader';
import DMMapViewer from './components/DMMapViewer';
import MapUploader from './components/MapUploader';
import FogOfWarControl from './components/FogOfWarControl';

export default function MapControlPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <DMHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Map Control</h1>
          <p className="text-gray-400">Upload and manage campaign maps</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <MapUploader />
            <FogOfWarControl />
          </div>
          <div className="lg:col-span-3">
            <DMMapViewer />
          </div>
        </div>
      </main>
    </div>
  );
}
