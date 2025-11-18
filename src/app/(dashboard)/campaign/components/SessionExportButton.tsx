'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import Button from '@/components/ui/Button';
import {
  exportAsJSON,
  exportAsCSV,
  exportAsMarkdown,
  exportAsText,
} from '@/lib/exportSession';

interface SessionExportButtonProps {
  sessionId?: string;
  sessionName?: string;
}

/**
 * Button component for exporting session data including dice rolls
 * Supports JSON, CSV, Markdown, and Plain Text formats
 */
export default function SessionExportButton({
  sessionId,
  sessionName = 'Session',
}: SessionExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);

  // Get dice rolls for the session
  const diceRolls = useQuery(
    sessionId
      ? api.diceRolls.getDiceRollsBySession
      : api.diceRolls.getRecentDiceRolls,
    sessionId ? { sessionId: sessionId as any } : { limit: 100 }
  );

  const handleExport = (format: 'json' | 'csv' | 'markdown' | 'text') => {
    if (!diceRolls) {
      alert('No data to export');
      return;
    }

    const exportData = {
      sessionName,
      sessionDate: new Date().toISOString(),
      diceRolls: diceRolls as any[],
    };

    switch (format) {
      case 'json':
        exportAsJSON(exportData);
        break;
      case 'csv':
        exportAsCSV(exportData);
        break;
      case 'markdown':
        exportAsMarkdown(exportData);
        break;
      case 'text':
        exportAsText(exportData);
        break;
    }

    setShowMenu(false);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setShowMenu(!showMenu)}
        variant="secondary"
        disabled={!diceRolls || diceRolls.length === 0}
      >
        Export Session
      </Button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => handleExport('json')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              Export as JSON
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              Export as CSV
            </button>
            <button
              onClick={() => handleExport('markdown')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              Export as Markdown
            </button>
            <button
              onClick={() => handleExport('text')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              Export as Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
