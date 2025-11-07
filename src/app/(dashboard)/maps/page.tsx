import DashboardHeader from '../dashboard/components/DashboardHeader';
import MapViewer from './components/MapViewer';
import MapList from './components/MapList';

/**
 * Render the Campaign Maps page showing a header, a sidebar list of maps, and a map viewer.
 *
 * @returns The page's React element containing the dashboard header, a title/subtitle, and a responsive two-column layout with a map list and map viewer.
 */
export default function MapsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Campaign Maps</h1>
          <p className="text-gray-400">View and interact with campaign maps</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <MapList />
          </div>
          <div className="lg:col-span-3">
            <MapViewer />
          </div>
        </div>
      </main>
    </div>
  );
}