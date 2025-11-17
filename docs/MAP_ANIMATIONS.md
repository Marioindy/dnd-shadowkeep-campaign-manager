# Map Animations System

This document describes the GSAP-based animation system implemented for interactive maps in the D&D Shadowkeep Campaign Manager.

## Overview

The animation system provides smooth, performant animations for all map interactions using [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/). All animations are centralized in utility modules for consistency and reusability.

## Architecture

### Core Files

- **`src/utils/mapAnimations.ts`** - Central animation utilities module
- **`src/app/(dashboard)/maps/components/MapMarker.tsx`** - Animated marker component
- **`src/app/(dashboard)/maps/components/MapViewer.tsx`** - Map viewer with viewport animations
- **`src/app/(dashboard)/maps/components/FogOfWarLayer.tsx`** - Fog of war with reveal/hide animations
- **`src/app/(dashboard)/maps/components/AnimatedStatDisplay.tsx`** - Stat display with count-up animations
- **`src/app/(dashboard)/maps/components/MapEffectsDemo.tsx`** - Particle effects demo component

### Animation Categories

The `mapAnimations.ts` module exports five main categories:

1. **MarkerAnimations** - Marker placement, removal, movement, and effects
2. **FogAnimations** - Fog of war reveal/hide transitions
3. **ViewportAnimations** - Pan, zoom, and camera movements
4. **StatAnimations** - UI stat displays and counters
5. **ParticleEffects** - Spell, ability, and combat effects

## Usage Guide

### 1. Marker Animations

```typescript
import { MarkerAnimations } from '@/utils/mapAnimations';

// Place a marker with pop-in effect
MarkerAnimations.placeMarker(element, {
  duration: 0.5,
  ease: 'back.out(1.7)',
  onComplete: () => console.log('Marker placed'),
});

// Remove a marker with pop-out effect
MarkerAnimations.removeMarker(element, {
  duration: 0.4,
  onComplete: () => element.remove(),
});

// Move marker to new position
MarkerAnimations.moveMarker(element, newX, newY, {
  duration: 0.8,
  ease: 'power2.out',
});

// Pulse marker for highlighting
MarkerAnimations.pulseMarker(element);

// Shake marker for damage indication
MarkerAnimations.shakeMarker(element, { duration: 0.5 });
```

### 2. Viewport Animations

```typescript
import { ViewportAnimations } from '@/utils/mapAnimations';

// Smooth pan to position
ViewportAnimations.panTo(mapElement, x, y, {
  duration: 0.8,
  ease: 'power2.out',
});

// Smooth zoom
ViewportAnimations.zoomTo(mapElement, scale, {
  duration: 0.6,
  ease: 'power2.inOut',
});

// Combined pan and zoom
ViewportAnimations.panAndZoom(mapElement, x, y, scale, {
  duration: 1.0,
});

// Reset to default view
ViewportAnimations.resetView(mapElement, {
  duration: 0.7,
  onComplete: () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  },
});

// Focus on a specific point
ViewportAnimations.focusOnPoint(mapElement, x, y, zoomLevel, {
  duration: 1.2,
});
```

### 3. Fog of War Animations

```typescript
import { FogAnimations } from '@/utils/mapAnimations';

// Reveal area with ripple effect
FogAnimations.rippleReveal(fogElement, {
  duration: 1.5,
  onComplete: () => console.log('Area revealed'),
});

// Hide area with fog
FogAnimations.hideArea(fogElement, {
  duration: 1.0,
});

// Reveal all fog layers
FogAnimations.revealAll(fogElements, {
  duration: 1.5,
  ease: 'power2.inOut',
});

// Change fog opacity
FogAnimations.setOpacity(fogElements, 0.6, {
  duration: 0.5,
});
```

### 4. Particle Effects

```typescript
import { ParticleEffects } from '@/utils/mapAnimations';

// Spell cast effect
ParticleEffects.spellCast(container, x, y, '#8b5cf6');

// Ability burst
ParticleEffects.abilityBurst(container, x, y, '#10b981');

// Damage effect
ParticleEffects.damageEffect(container, x, y);

// Heal effect
ParticleEffects.healEffect(container, x, y);

// Radial pulse for AOE
ParticleEffects.radialPulse(container, x, y, radius, '#8b5cf6');

// Custom particle effect
ParticleEffects.createParticles(container, x, y, {
  color: '#ff0000',
  count: 20,
  spread: 100,
  duration: 1.5,
  type: 'spell',
});
```

### 5. Stat Display Animations

```typescript
import { StatAnimations } from '@/utils/mapAnimations';

// Count up animation
StatAnimations.countUp(element, fromValue, toValue, {
  duration: 1.0,
  ease: 'power1.out',
});

// Slide in from side
StatAnimations.slideIn(element, {
  duration: 0.5,
  delay: 0.2,
});

// Fade in
StatAnimations.fadeIn(element, {
  duration: 0.4,
});

// Highlight value change
StatAnimations.highlightChange(element, '#10b981');

// Progress bar fill
StatAnimations.fillProgressBar(element, percentage, {
  duration: 0.8,
});
```

## Component Integration Examples

### Animated Marker Component

```typescript
'use client';

import { useRef, useEffect } from 'react';
import { MarkerAnimations } from '@/utils/mapAnimations';

export default function MapMarker({ marker }) {
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (markerRef.current) {
      MarkerAnimations.placeMarker(markerRef.current);
    }
  }, []);

  useEffect(() => {
    if (markerRef.current) {
      if (marker.visible) {
        MarkerAnimations.placeMarker(markerRef.current);
      } else {
        MarkerAnimations.removeMarker(markerRef.current);
      }
    }
  }, [marker.visible]);

  return <div ref={markerRef}>{/* marker content */}</div>;
}
```

### Map Viewer with Viewport Animations

```typescript
'use client';

import { useRef } from 'react';
import { ViewportAnimations } from '@/utils/mapAnimations';

export default function MapViewer() {
  const mapRef = useRef<HTMLDivElement>(null);

  const handleZoom = (scale: number) => {
    if (mapRef.current) {
      ViewportAnimations.zoomTo(mapRef.current, scale);
    }
  };

  const handleReset = () => {
    if (mapRef.current) {
      ViewportAnimations.resetView(mapRef.current);
    }
  };

  return (
    <div>
      <div ref={mapRef}>{/* map content */}</div>
      <button onClick={() => handleZoom(1.5)}>Zoom In</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
```

## Animation Options

All animation functions accept an optional `AnimationOptions` object:

```typescript
interface AnimationOptions {
  duration?: number;      // Animation duration in seconds (default varies)
  ease?: string;          // GSAP easing function (default varies)
  delay?: number;         // Delay before animation starts (default: 0)
  onComplete?: () => void; // Callback when animation completes
}
```

### Common Easing Functions

- `'power1.out'` - Gentle deceleration
- `'power2.out'` - Medium deceleration
- `'power2.inOut'` - Smooth start and end
- `'back.out(1.7)'` - Overshoot effect (great for pop-ins)
- `'back.in(1.7)'` - Undershoot effect (great for pop-outs)
- `'elastic.out(1, 0.3)'` - Bouncy effect

See [GSAP Easing Documentation](https://greensock.com/docs/v3/Eases) for more options.

## Performance Considerations

1. **Hardware Acceleration**: All animations use transform properties (`scale`, `x`, `y`, `opacity`) which are GPU-accelerated.

2. **Animation Cleanup**: Use `killAnimations()` to stop animations when components unmount:
   ```typescript
   useEffect(() => {
     return () => {
       if (elementRef.current) {
         killAnimations(elementRef.current);
       }
     };
   }, []);
   ```

3. **Particle Limits**: Particle effects automatically clean up after completion. Limit concurrent particle effects to maintain performance.

4. **Stagger Effects**: Use stagger for animating multiple elements efficiently:
   ```typescript
   gsap.to(elements, {
     opacity: 0,
     stagger: 0.1, // 0.1s delay between each element
   });
   ```

## Testing

A comprehensive demo page is available at `/maps/animations-demo` showcasing all animation features:

- Marker placement/removal
- Viewport controls
- Particle effects
- Stat displays
- Real-time controls for testing

## Future Enhancements

Potential additions to the animation system:

1. **Path Animations**: Animate markers along predefined paths
2. **Custom Easing Curves**: Project-specific easing functions
3. **Animation Presets**: Named animation sets for common scenarios
4. **Timeline Sequences**: Complex multi-step animation sequences
5. **Morph Animations**: Shape transformations for fog layers
6. **Sound Integration**: Audio cues synchronized with animations

## Dependencies

- **gsap**: ^3.12.5 - Core animation library
- **react**: ^18.3.0 - Component framework
- **typescript**: ^5.3.0 - Type safety

## Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [GSAP Easing Visualizer](https://greensock.com/ease-visualizer/)
- [React + GSAP Guide](https://greensock.com/react/)

## License

This animation system is part of the D&D Shadowkeep Campaign Manager project.
