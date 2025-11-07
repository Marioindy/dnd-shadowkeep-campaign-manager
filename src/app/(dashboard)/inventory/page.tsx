import DashboardHeader from '../dashboard/components/DashboardHeader';
import InventoryGrid from './components/InventoryGrid';
import EquipmentSlots from './components/EquipmentSlots';

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Inventory</h1>
          <p className="text-gray-400">Manage your items and equipment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <EquipmentSlots />
          </div>
          <div className="lg:col-span-2">
            <InventoryGrid />
          </div>
        </div>
      </main>
    </div>
  );
}
