'use client';

import { useState } from 'react';

/**
 * Document item structure
 */
interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

/**
 * Props for the DocumentList component
 */
interface DocumentListProps {
  /**
   * Optional callback when a document is viewed
   * If not provided, the View button will be disabled
   */
  onView?: (document: Document) => void;
  /**
   * Optional callback when a document is deleted
   * If not provided, the Delete button will be disabled
   */
  onDelete?: (document: Document) => void;
}

/**
 * Renders a searchable list of documents with type badges, metadata, and action buttons.
 *
 * The list is produced from a predefined in-component array. The search input filters
 * documents by name in real-time as the user types. Action buttons (View/Delete) accept
 * optional handler props - if not provided, they will be disabled with tooltips indicating
 * they are awaiting backend integration.
 *
 * @param props - Component props containing optional onView and onDelete handlers
 * @returns The rendered documents list as a JSX element
 */
export default function DocumentList({ onView, onDelete }: DocumentListProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');

  const documents = [
    { id: '1', name: 'Campaign Outline', type: 'PDF', size: '2.4 MB', uploadedAt: '2025-11-01' },
    { id: '2', name: 'NPC Roster', type: 'PDF', size: '1.8 MB', uploadedAt: '2025-10-28' },
    { id: '3', name: 'Session Notes - Week 1', type: 'TXT', size: '45 KB', uploadedAt: '2025-10-15' },
    { id: '4', name: 'Lore Document', type: 'PDF', size: '5.2 MB', uploadedAt: '2025-10-10' },
    { id: '5', name: 'Monster Stats', type: 'PDF', size: '3.1 MB', uploadedAt: '2025-10-05' },
  ];

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PDF':
        return 'bg-red-500/10 text-red-400';
      case 'TXT':
        return 'bg-blue-500/10 text-blue-400';
      case 'IMG':
        return 'bg-green-500/10 text-green-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">All Documents</h2>
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search documents"
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none w-64"
        />
      </div>

      <div className="space-y-2">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded text-xs font-medium ${getTypeColor(doc.type)}`}>
                {doc.type}
              </div>
              <div>
                <h3 className="font-medium text-white">{doc.name}</h3>
                <p className="text-sm text-gray-400">
                  {doc.size} • Uploaded {doc.uploadedAt}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onView?.(doc)}
                disabled={!onView}
                aria-disabled={!onView}
                title={!onView ? 'View functionality pending backend integration' : 'View document'}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  onView
                    ? 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
                    : 'bg-gray-700/50 text-gray-500 cursor-not-allowed opacity-60'
                }`}
              >
                View
              </button>
              <button
                onClick={() => onDelete?.(doc)}
                disabled={!onDelete}
                aria-disabled={!onDelete}
                title={!onDelete ? 'Delete functionality pending backend integration' : 'Delete document'}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  onDelete
                    ? 'bg-red-600 hover:bg-red-700 cursor-pointer'
                    : 'bg-red-600/50 text-red-400/50 cursor-not-allowed opacity-60'
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
