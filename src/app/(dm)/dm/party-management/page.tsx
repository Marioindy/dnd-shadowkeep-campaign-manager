import DMHeader from '../components/DMHeader';
import PlayerList from './components/PlayerList';
import CharacterDetails from './components/CharacterDetails';

export default function PartyManagementPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <DMHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Party Management</h1>
          <p className="text-gray-400">Manage players and their characters</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PlayerList />
          </div>
          <div className="lg:col-span-2">
            <CharacterDetails />
          </div>
        </div>
      </main>
    </div>
  );
}
