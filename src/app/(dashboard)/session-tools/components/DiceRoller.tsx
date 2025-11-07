'use client';

import { useState } from 'react';

export default function DiceRoller() {
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<Array<{ roll: string; result: number }>>([]);

  const diceTypes = [4, 6, 8, 10, 12, 20, 100];

  const rollDice = (sides: number) => {
    const rolled = Math.floor(Math.random() * sides) + 1;
    setResult(rolled);
    setHistory([{ roll: `d${sides}`, result: rolled }, ...history.slice(0, 4)]);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-6">Dice Roller</h2>

      {result !== null && (
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-8 mb-6 text-center">
          <p className="text-sm text-purple-100 mb-2">Result</p>
          <p className="text-6xl font-bold text-white">{result}</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 mb-6">
        {diceTypes.map((sides) => (
          <button
            key={sides}
            onClick={() => rollDice(sides)}
            className="bg-gray-800 hover:bg-purple-600 rounded-lg p-4 transition-colors"
          >
            <p className="text-2xl font-bold text-white">d{sides}</p>
          </button>
        ))}
      </div>

      {history.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Recent Rolls</h3>
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-800 rounded p-2"
              >
                <span className="text-gray-400">{item.roll}</span>
                <span className="text-white font-semibold">{item.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
