import DashboardHeader from './components/DashboardHeader';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';
import CharacterOverview from './components/CharacterOverview';

/**
 * Renders the dashboard page layout composed of the header, main content (character overview and recent activity), and sidebar quick actions.
 *
 * @returns The JSX element for the dashboard page.
 */
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            <CharacterOverview />
            <RecentActivity />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}