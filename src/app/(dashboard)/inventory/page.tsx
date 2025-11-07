import DashboardHeader from '../dashboard/components/DashboardHeader';
import InventoryGrid from './components/InventoryGrid';
import EquipmentSlots from './components/EquipmentSlots';

/**
 * Render the Inventory page with a dashboard header, equipment slots, and an inventory grid arranged responsively.
 *
 * The layout centers content within a max width, shows a title and subtitle, and uses a 1-column grid on small
 * screens that becomes a 3-column grid on large screens (equipment slots span 1 column, inventory grid spans 2).
 *
 * @returns A JSX element containing the inventory page layout
 */
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