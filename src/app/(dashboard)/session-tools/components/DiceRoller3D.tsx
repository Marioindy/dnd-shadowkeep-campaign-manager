'use client';

import { useState, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import PhysicsDiceCanvas, {
  PhysicsDiceCanvasRef,
  DiceRollResult,
} from './PhysicsDiceCanvas';
import { DiceType, RollType } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

/**
 * Advanced Dice Roller with 3D physics simulation
 * Features:
 * - 3D visualization of dice rolling
 * - Physics simulation for realistic movement
 * - Multiple dice rolling
 * - Modifiers support
 * - Advantage/Disadvantage mechanics
 * - Roll history logging to database
 */
export default function DiceRoller3D() {
  const canvasRef = useRef<PhysicsDiceCanvasRef>(null);
  const logDiceRoll = useMutation(api.diceRolls.logDiceRoll);

  const [selectedDice, setSelectedDice] = useState<DiceType>('d20');
  const [diceCount, setDiceCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [rollType, setRollType] = useState<RollType>('normal');
  const [purpose, setPurpose] = useState('');
  const [targetDC, setTargetDC] = useState<number | undefined>(undefined);

  const [isRolling, setIsRolling] = useState(false);
  const [currentResult, setCurrentResult] = useState<{
    results: number[];
    total: number;
    success?: boolean;
  } | null>(null);

  const diceTypes: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

  const handleRoll = async () => {
    if (!canvasRef.current || isRolling) return;

    setIsRolling(true);
    setCurrentResult(null);

    try {
      let rollResults: DiceRollResult[];

      // Handle advantage/disadvantage
      if (rollType === 'advantage' || rollType === 'disadvantage') {
        // Roll twice
        const roll1 = await canvasRef.current.rollDice(selectedDice, 1);
        await new Promise((resolve) => setTimeout(resolve, 100));
        const roll2 = await canvasRef.current.rollDice(selectedDice, 1);

        // Take higher or lower based on roll type
        const result1 = roll1[0].result;
        const result2 = roll2[0].result;

        if (rollType === 'advantage') {
          rollResults = result1 >= result2 ? roll1 : roll2;
        } else {
          rollResults = result1 <= result2 ? roll1 : roll2;
        }
      } else {
        // Normal roll
        rollResults = await canvasRef.current.rollDice(selectedDice, diceCount);
      }

      // Calculate total
      const results = rollResults.map((r) => r.result);
      const baseTotal = results.reduce((sum, val) => sum + val, 0);
      const total = baseTotal + modifier;

      // Check success if DC is set
      const success = targetDC !== undefined ? total >= targetDC : undefined;

      setCurrentResult({ results, total, success });

      // Log to database (using dummy user ID for now)
      // In production, get this from auth context
      await logDiceRoll({
        userId: 'user_dummy' as any, // Replace with actual user ID
        diceType: selectedDice,
        diceCount: rollType === 'normal' ? diceCount : 1,
        modifier,
        rollType,
        results,
        total,
        purpose: purpose || undefined,
        targetDC: targetDC,
        success,
      });
    } catch (error) {
      console.error('Error rolling dice:', error);
    } finally {
      setIsRolling(false);
    }
  };

  const handleClear = () => {
    canvasRef.current?.clearDice();
    setCurrentResult(null);
  };

  const getResultColor = () => {
    if (currentResult?.success === true) return 'from-green-600 to-emerald-600';
    if (currentResult?.success === false) return 'from-red-600 to-rose-600';
    return 'from-purple-600 to-pink-600';
  };

  return (
    <div className="space-y-6">
      {/* 3D Canvas */}
      <Card>
        <CardContent className="p-0">
          <div className="w-full h-[400px] bg-gray-950 rounded-lg overflow-hidden">
            <PhysicsDiceCanvas ref={canvasRef} className="w-full h-full" />
          </div>
        </CardContent>
      </Card>

      {/* Result Display */}
      {currentResult && (
        <div
          className={`bg-gradient-to-br ${getResultColor()} rounded-lg p-8 text-center`}
        >
          <p className="text-sm text-white/80 mb-2">Result</p>
          <div className="flex items-center justify-center gap-4">
            <div>
              <p className="text-sm text-white/70 mb-1">Dice</p>
              <p className="text-4xl font-bold text-white">
                {currentResult.results.join(' + ')}
              </p>
            </div>
            {modifier !== 0 && (
              <>
                <p className="text-3xl text-white/70">
                  {modifier >= 0 ? '+' : ''}
                </p>
                <div>
                  <p className="text-sm text-white/70 mb-1">Modifier</p>
                  <p className="text-4xl font-bold text-white">{modifier}</p>
                </div>
              </>
            )}
            <p className="text-3xl text-white/70">=</p>
            <div>
              <p className="text-sm text-white/70 mb-1">Total</p>
              <p className="text-6xl font-bold text-white">
                {currentResult.total}
              </p>
            </div>
          </div>
          {targetDC !== undefined && (
            <p className="mt-4 text-lg text-white/90">
              vs DC {targetDC}:{' '}
              <span className="font-bold">
                {currentResult.success ? 'SUCCESS' : 'FAILURE'}
              </span>
            </p>
          )}
          {rollType !== 'normal' && (
            <p className="mt-2 text-sm text-white/70 uppercase">
              {rollType}
            </p>
          )}
        </div>
      )}

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Roll Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dice Type Selection */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 block">
              Dice Type
            </label>
            <div className="grid grid-cols-7 gap-2">
              {diceTypes.map((dice) => (
                <button
                  key={dice}
                  onClick={() => setSelectedDice(dice)}
                  className={`py-3 px-2 rounded-lg font-bold transition-colors ${
                    selectedDice === dice
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {dice}
                </button>
              ))}
            </div>
          </div>

          {/* Dice Count */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 block">
              Number of Dice
            </label>
            <Input
              type="number"
              min="1"
              max="10"
              value={diceCount}
              onChange={(e) => setDiceCount(parseInt(e.target.value) || 1)}
              disabled={rollType !== 'normal'}
            />
          </div>

          {/* Modifier */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 block">
              Modifier
            </label>
            <Input
              type="number"
              value={modifier}
              onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          {/* Roll Type */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 block">
              Roll Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'advantage', 'disadvantage'] as RollType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setRollType(type)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      rollType === type
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 block">
              Purpose (Optional)
            </label>
            <Input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g., Attack Roll, Skill Check"
            />
          </div>

          {/* Target DC */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 block">
              Target DC (Optional)
            </label>
            <Input
              type="number"
              value={targetDC ?? ''}
              onChange={(e) =>
                setTargetDC(e.target.value ? parseInt(e.target.value) : undefined)
              }
              placeholder="Enter target DC"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleRoll}
              disabled={isRolling}
              className="flex-1"
            >
              {isRolling ? 'Rolling...' : 'Roll Dice'}
            </Button>
            <Button onClick={handleClear} variant="secondary">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
