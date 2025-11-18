'use client';

import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { DiceSceneManager } from '@/lib/diceScene';
import { DicePhysicsWorld, DicePhysicsBody } from '@/lib/dicePhysics';
import { DiceType } from '@/types';

export interface DiceRollResult {
  diceType: DiceType;
  result: number;
}

export interface PhysicsDiceCanvasRef {
  rollDice: (diceType: DiceType, count: number) => Promise<DiceRollResult[]>;
  clearDice: () => void;
}

interface PhysicsDiceCanvasProps {
  onRollComplete?: (results: DiceRollResult[]) => void;
  className?: string;
}

const PhysicsDiceCanvas = forwardRef<PhysicsDiceCanvasRef, PhysicsDiceCanvasProps>(
  ({ onRollComplete, className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneManagerRef = useRef<DiceSceneManager | null>(null);
    const physicsWorldRef = useRef<DicePhysicsWorld | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const isRollingRef = useRef(false);

    useEffect(() => {
      if (!canvasRef.current) return;

      // Initialize scene and physics
      sceneManagerRef.current = new DiceSceneManager(canvasRef.current);
      physicsWorldRef.current = new DicePhysicsWorld();

      // Start animation loop
      let lastTime = performance.now();

      const animate = (currentTime: number) => {
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        if (physicsWorldRef.current && sceneManagerRef.current) {
          physicsWorldRef.current.step(deltaTime);
          sceneManagerRef.current.render();
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate(performance.now());

      // Handle resize
      const handleResize = () => {
        if (canvasRef.current && sceneManagerRef.current) {
          const { clientWidth, clientHeight } = canvasRef.current;
          sceneManagerRef.current.resize(clientWidth, clientHeight);
        }
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener('resize', handleResize);
        sceneManagerRef.current?.dispose();
        physicsWorldRef.current?.destroy();
      };
    }, []);

    const rollDice = async (
      diceType: DiceType,
      count: number
    ): Promise<DiceRollResult[]> => {
      if (
        !sceneManagerRef.current ||
        !physicsWorldRef.current ||
        isRollingRef.current
      ) {
        return [];
      }

      isRollingRef.current = true;

      // Clear previous dice
      physicsWorldRef.current.clearAllDice();

      const diceBodies: DicePhysicsBody[] = [];

      // Create and throw dice
      for (let i = 0; i < count; i++) {
        const mesh = sceneManagerRef.current.createDiceMesh(diceType);
        const diceBody = physicsWorldRef.current.createDiceBody(diceType, mesh);
        physicsWorldRef.current.throwDice(diceBody);
        diceBodies.push(diceBody);
      }

      // Wait for dice to settle
      return new Promise((resolve) => {
        const checkSettled = setInterval(() => {
          if (physicsWorldRef.current?.isDiceSettled()) {
            clearInterval(checkSettled);

            // Get results
            const results: DiceRollResult[] = diceBodies.map((diceBody) => ({
              diceType,
              result: physicsWorldRef.current!.getDiceResult(diceBody),
            }));

            isRollingRef.current = false;

            if (onRollComplete) {
              onRollComplete(results);
            }

            resolve(results);
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkSettled);
          isRollingRef.current = false;

          // Return random results as fallback
          const fallbackResults: DiceRollResult[] = diceBodies.map((diceBody) => ({
            diceType,
            result: physicsWorldRef.current!.getDiceResult(diceBody),
          }));

          resolve(fallbackResults);
        }, 10000);
      });
    };

    const clearDice = () => {
      if (physicsWorldRef.current) {
        physicsWorldRef.current.clearAllDice();
      }
    };

    useImperativeHandle(ref, () => ({
      rollDice,
      clearDice,
    }));

    return (
      <canvas
        ref={canvasRef}
        className={className}
        style={{ width: '100%', height: '100%' }}
      />
    );
  }
);

PhysicsDiceCanvas.displayName = 'PhysicsDiceCanvas';

export default PhysicsDiceCanvas;
