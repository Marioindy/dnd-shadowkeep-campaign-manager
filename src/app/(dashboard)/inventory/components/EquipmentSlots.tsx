'use client';

export default function EquipmentSlots() {
  const slots = [
    { id: 'head', label: 'Head', equipped: null },
    { id: 'chest', label: 'Chest', equipped: 'Chain Mail' },
    { id: 'mainHand', label: 'Main Hand', equipped: 'Longsword +1' },
    { id: 'offHand', label: 'Off Hand', equipped: 'Shield' },
    { id: 'legs', label: 'Legs', equipped: null },
    { id: 'feet', label: 'Feet', equipped: 'Boots of Speed' },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-6">Equipment</h2>

      <div className="space-y-3">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`rounded-lg p-4 border-2 transition-all ${
              slot.equipped
                ? 'bg-gray-800 border-purple-500'
                : 'bg-gray-800/50 border-dashed border-gray-700'
            }`}
          >
            <p className="text-xs text-gray-400 mb-1">{slot.label}</p>
            {slot.equipped ? (
              <p className="text-white font-medium">{slot.equipped}</p>
            ) : (
              <p className="text-gray-600 text-sm italic">Empty</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
