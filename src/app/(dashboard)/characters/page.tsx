import DashboardHeader from '../dashboard/components/DashboardHeader';
import CharacterList from './components/CharacterList';

export default function CharactersPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Characters</h1>
          <p className="text-gray-400">Manage your campaign characters</p>
        </div>

        <CharacterList />
      </main>
    </div>
  );
}
