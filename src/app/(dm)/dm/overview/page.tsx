import DMHeader from '../components/DMHeader';
import PartyOverview from './components/PartyOverview';
import QuickStats from './components/QuickStats';
import ActiveSession from './components/ActiveSession';

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
          <div>
            <ActiveSession />
          </div>
        </div>
      </main>
    </div>
  );
}
