import DashboardHeader from '../dashboard/components/DashboardHeader';
import DiceRoller3D from './components/DiceRoller3D';
import RollHistory from './components/RollHistory';
import DiceStats from './components/DiceStats';
import InitiativeTracker from './components/InitiativeTracker';

/**
 * Render the Session Tools page layout for the dashboard.
 *
 * Displays a dashboard header, a page title and subtitle, and a responsive grid
 * that hosts the advanced 3D dice roller with physics simulation, roll history,
 * statistics, and initiative tracker components.
 *
 * Features:
 * - 3D dice roller with physics simulation
 * - Roll history with database persistence
 * - Statistics and analytics
 * - Initiative tracker for combat
 *
 * @returns A JSX element containing the session tools page layout.
 */
export default function SessionToolsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Session Tools</h1>
          <p className="text-gray-400">
            Advanced dice roller with 3D physics, initiative tracker, and statistics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Dice Roller - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <DiceRoller3D />
          </div>

          {/* Sidebar - History and Stats */}
          <div className="space-y-6">
            <RollHistory />
            <DiceStats />
          </div>

          {/* Initiative Tracker - Full width */}
          <div className="lg:col-span-3">
            <InitiativeTracker />
          </div>
        </div>
      </main>
    </div>
  );
}