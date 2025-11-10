import DMHeader from '../components/DMHeader';
import PartyOverview from './components/PartyOverview';
import QuickStats from './components/QuickStats';
import ActiveSession from './components/ActiveSession';
import AmbientMusicSelector from '@/components/audio/AmbientMusicSelector';

/**
 * Renders the DM Overview page composed of a header, page title/subtitle, and a responsive content grid that presents quick statistics, party details, active session panel, and ambient music controls.
 *
 * @returns The JSX element for the DM overview page.
 */
export default function DMOverviewPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <DMHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">DM Overview</h1>
          <p className="text-gray-400">Campaign management dashboard</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <QuickStats />
            <PartyOverview />
          </div>
          <div className="space-y-6">
            <ActiveSession />
            <AmbientMusicSelector />
          </div>
        </div>
      </main>
    </div>
  );
}