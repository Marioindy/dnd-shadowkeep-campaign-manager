import { DiceRoll } from '@/types';

/**
 * Export session data including dice rolls to various formats
 */

export interface SessionExportData {
  sessionName: string;
  sessionDate: string;
  diceRolls: DiceRoll[];
  notes?: string;
}

/**
 * Export session data as JSON
 */
export function exportAsJSON(data: SessionExportData): void {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `session-${data.sessionName}-${Date.now()}.json`, 'application/json');
}

/**
 * Export session data as CSV
 */
export function exportAsCSV(data: SessionExportData): void {
  const headers = [
    'Timestamp',
    'Dice Type',
    'Dice Count',
    'Modifier',
    'Roll Type',
    'Results',
    'Total',
    'Purpose',
    'Target DC',
    'Success',
    'Character',
  ];

  const rows = data.diceRolls.map((roll) => [
    new Date(roll.timestamp).toISOString(),
    roll.diceType,
    roll.diceCount.toString(),
    roll.modifier.toString(),
    roll.rollType,
    roll.results.join('+'),
    roll.total.toString(),
    roll.purpose || '',
    roll.targetDC?.toString() || '',
    roll.success !== undefined ? (roll.success ? 'Yes' : 'No') : '',
    roll.characterName || '',
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  downloadFile(csv, `session-${data.sessionName}-${Date.now()}.csv`, 'text/csv');
}

/**
 * Export session data as Markdown
 */
export function exportAsMarkdown(data: SessionExportData): void {
  let markdown = `# ${data.sessionName}\n\n`;
  markdown += `**Date:** ${data.sessionDate}\n\n`;

  if (data.notes) {
    markdown += `## Notes\n\n${data.notes}\n\n`;
  }

  markdown += `## Dice Rolls\n\n`;
  markdown += `Total Rolls: ${data.diceRolls.length}\n\n`;

  // Group by purpose
  const rollsByPurpose = data.diceRolls.reduce(
    (acc, roll) => {
      const purpose = roll.purpose || 'General Rolls';
      if (!acc[purpose]) {
        acc[purpose] = [];
      }
      acc[purpose].push(roll);
      return acc;
    },
    {} as Record<string, DiceRoll[]>
  );

  Object.entries(rollsByPurpose).forEach(([purpose, rolls]) => {
    markdown += `### ${purpose}\n\n`;
    rolls.forEach((roll) => {
      const timestamp = new Date(roll.timestamp).toLocaleTimeString();
      const rollDetails = `${roll.diceCount}${roll.diceType}${
        roll.modifier !== 0 ? `${roll.modifier >= 0 ? '+' : ''}${roll.modifier}` : ''
      }`;
      const results = roll.results.join(' + ');
      const successText =
        roll.success !== undefined
          ? ` - ${roll.success ? '✅ SUCCESS' : '❌ FAILURE'} (DC ${roll.targetDC})`
          : '';

      markdown += `- **${timestamp}** - ${rollDetails}: ${results} = **${roll.total}**${successText}`;

      if (roll.rollType !== 'normal') {
        markdown += ` *(${roll.rollType})*`;
      }

      if (roll.characterName) {
        markdown += ` - ${roll.characterName}`;
      }

      markdown += '\n';
    });
    markdown += '\n';
  });

  // Statistics
  const totalRolls = data.diceRolls.length;
  const successfulRolls = data.diceRolls.filter((r) => r.success === true).length;
  const failedRolls = data.diceRolls.filter((r) => r.success === false).length;
  const averageRoll =
    data.diceRolls.reduce((sum, r) => sum + r.total, 0) / totalRolls;

  markdown += `## Statistics\n\n`;
  markdown += `- **Total Rolls:** ${totalRolls}\n`;
  markdown += `- **Average Result:** ${averageRoll.toFixed(2)}\n`;

  if (successfulRolls > 0 || failedRolls > 0) {
    markdown += `- **Successful Checks:** ${successfulRolls}\n`;
    markdown += `- **Failed Checks:** ${failedRolls}\n`;
    markdown += `- **Success Rate:** ${((successfulRolls / (successfulRolls + failedRolls)) * 100).toFixed(1)}%\n`;
  }

  // Critical hits/fails
  const d20Rolls = data.diceRolls.filter((r) => r.diceType === 'd20');
  const nat20s = d20Rolls.filter((r) => r.results.includes(20)).length;
  const nat1s = d20Rolls.filter((r) => r.results.includes(1)).length;

  if (nat20s > 0 || nat1s > 0) {
    markdown += `\n### D20 Criticals\n\n`;
    markdown += `- **Natural 20s:** ${nat20s}\n`;
    markdown += `- **Natural 1s:** ${nat1s}\n`;
  }

  downloadFile(
    markdown,
    `session-${data.sessionName}-${Date.now()}.md`,
    'text/markdown'
  );
}

/**
 * Export session data as plain text
 */
export function exportAsText(data: SessionExportData): void {
  let text = `${data.sessionName}\n`;
  text += `${'='.repeat(data.sessionName.length)}\n\n`;
  text += `Date: ${data.sessionDate}\n\n`;

  if (data.notes) {
    text += `NOTES\n-----\n${data.notes}\n\n`;
  }

  text += `DICE ROLLS\n----------\n\n`;

  data.diceRolls.forEach((roll) => {
    const timestamp = new Date(roll.timestamp).toLocaleString();
    const rollDetails = `${roll.diceCount}${roll.diceType}${
      roll.modifier !== 0 ? `${roll.modifier >= 0 ? '+' : ''}${roll.modifier}` : ''
    }`;
    const results = roll.results.join(' + ');

    text += `[${timestamp}] ${rollDetails}\n`;
    text += `  Results: ${results} = ${roll.total}\n`;

    if (roll.purpose) {
      text += `  Purpose: ${roll.purpose}\n`;
    }

    if (roll.targetDC !== undefined) {
      text += `  vs DC ${roll.targetDC}: ${roll.success ? 'SUCCESS' : 'FAILURE'}\n`;
    }

    if (roll.rollType !== 'normal') {
      text += `  Type: ${roll.rollType}\n`;
    }

    if (roll.characterName) {
      text += `  Character: ${roll.characterName}\n`;
    }

    text += '\n';
  });

  downloadFile(text, `session-${data.sessionName}-${Date.now()}.txt`, 'text/plain');
}

/**
 * Helper function to download a file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
