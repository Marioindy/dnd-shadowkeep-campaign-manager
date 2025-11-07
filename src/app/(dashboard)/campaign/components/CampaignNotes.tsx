'use client';

/**
 * Renders a styled panel showing a list of predefined campaign notes and a "+ New Note" action button.
 *
 * The panel displays each note as a clickable card with a title and truncated content.
 *
 * @returns A JSX element containing the campaign notes panel.
 */
export default function CampaignNotes() {
  const notes = [
    { id: '1', title: 'Important NPCs', content: 'Lord Blackwood, Merchant Gilda, Sage Orion' },
    { id: '2', title: 'Quest Objectives', content: 'Find the ancient artifact, Rescue prisoners' },
    { id: '3', title: 'Lore', content: 'Shadowkeep was built 1000 years ago by the Ancients' },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-4">Campaign Notes</h2>

      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-750 transition-colors"
          >
            <h3 className="font-medium text-white mb-2 text-sm">{note.title}</h3>
            <p className="text-xs text-gray-400 line-clamp-2">{note.content}</p>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full py-2 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors text-sm">
        + New Note
      </button>
    </div>
  );
}