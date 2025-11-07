import DashboardHeader from '../dashboard/components/DashboardHeader';
import DiceRoller from './components/DiceRoller';
import InitiativeTracker from './components/InitiativeTracker';

/**
 * Render the Session Tools page layout for the dashboard.
 *
 * Displays a dashboard header, a page title and subtitle, and a responsive grid
 * that hosts the dice roller and initiative tracker components.
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
          <p className="text-gray-400">Dice roller and initiative tracker</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DiceRoller />
          <InitiativeTracker />
        </div>
      </main>
    </div>
  );
}