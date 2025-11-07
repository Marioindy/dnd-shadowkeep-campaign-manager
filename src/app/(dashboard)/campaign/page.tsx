import DashboardHeader from '../dashboard/components/DashboardHeader';
import CampaignInfo from './components/CampaignInfo';
import SessionLog from './components/SessionLog';
import CampaignNotes from './components/CampaignNotes';

/**
 * Renders the Campaign page composed of a dashboard header, campaign details, session log, and notes.
 *
 * Displays a full-screen layout with a centered main container, a title/subtitle block, and a responsive grid
 * where campaign information and session log occupy the main area and campaign notes appear in the sidebar.
 *
 * @returns The JSX element representing the Campaign page layout.
 */
export default function CampaignPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Campaign</h1>
          <p className="text-gray-400">View campaign details and session history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CampaignInfo />
            <SessionLog />
          </div>
          <div>
            <CampaignNotes />
          </div>
        </div>
      </main>
    </div>
  );
}