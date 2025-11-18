/**
 * MapAnimations - GSAP-based animation utilities for map interactions
 *
 * This module provides smooth, performant animations for:
 * - Marker placements and removals
 * - Fog of war transitions
 * - Pan and zoom operations
 * - Stat displays
 * - Particle effects for spells/abilities
 */

import gsap from 'gsap';

export interface AnimationOptions {
  duration?: number;
  ease?: string;
  delay?: number;
  onComplete?: () => void;
}

export interface ParticleConfig {
  color: string;
  count: number;
  spread: number;
  duration: number;
  type: 'spell' | 'ability' | 'damage' | 'heal';
}

/**
 * Marker Animations
 */
export const MarkerAnimations = {
  /**
   * Animate marker placement with a pop-in effect
   */
  placeMarker(element: HTMLElement, options: AnimationOptions = {}) {
    const {
      duration = 0.5,
      ease = 'back.out(1.7)',
      delay = 0,
      onComplete,
    } = options;

    gsap.fromTo(
      element,
      {
        scale: 0,
        opacity: 0,
        rotation: -180,
      },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration,
        ease,
        delay,
        onComplete,
      }
    );
  },

  /**
   * Animate marker removal with a pop-out effect
   */
  removeMarker(element: HTMLElement, options: AnimationOptions = {}) {
    const {
      duration = 0.4,
      ease = 'back.in(1.7)',
      delay = 0,
      onComplete,
    } = options;

    gsap.to(element, {
      scale: 0,
      opacity: 0,
      rotation: 180,
      duration,
      ease,
      delay,
      onComplete,
    });
  },

  /**
   * Pulse animation for highlighting a marker
   */
  pulseMarker(element: HTMLElement, options: AnimationOptions = {}) {
    const { duration = 0.6, ease = 'power1.inOut' } = options;

    gsap.to(element, {
      scale: 1.3,
      duration: duration / 2,
      ease,
      yoyo: true,
      repeat: 1,
    });
  },

  /**
   * Move marker to new position smoothly
   */
  moveMarker(
    element: HTMLElement,
    toX: number,
    toY: number,
    options: AnimationOptions = {}
  ) {
    const { duration = 0.8, ease = 'power2.out', onComplete } = options;

    gsap.to(element, {
      left: toX,
      top: toY,
      duration,
      ease,
      onComplete,
    });
  },

  /**
   * Shake marker (for damage/hit indication)
   */
  shakeMarker(element: HTMLElement, options: AnimationOptions = {}) {
    const { duration = 0.5 } = options;

    gsap.to(element, {
      x: '+=3',
      duration: 0.05,
      repeat: Math.floor(duration / 0.1),
      yoyo: true,
      ease: 'power1.inOut',
    });
  },
};

/**
 * Fog of War Animations
 */
export const FogAnimations = {
  /**
   * Reveal fog area with a fade-out effect
   */
  revealArea(element: HTMLElement | SVGElement, options: AnimationOptions = {}) {
    const {
      duration = 1.2,
      ease = 'power2.inOut',
      onComplete,
    } = options;

    gsap.to(element, {
      opacity: 0,
      duration,
      ease,
      onComplete,
    });
  },

  /**
   * Hide area with fog using fade-in effect
   */
  hideArea(element: HTMLElement | SVGElement, options: AnimationOptions = {}) {
    const {
      duration = 1.0,
      ease = 'power2.inOut',
      onComplete,
    } = options;

    gsap.to(element, {
      opacity: 0.8,
      duration,
      ease,
      onComplete,
    });
  },

  /**
   * Reveal entire map by fading out all fog layers
   */
  revealAll(elements: HTMLElement[], options: AnimationOptions = {}) {
    const { duration = 1.5, ease = 'power2.inOut', onComplete } = options;

    gsap.to(elements, {
      opacity: 0,
      duration,
      ease,
      stagger: 0.1,
      onComplete,
    });
  },

  /**
   * Hide entire map with fog
   */
  hideAll(elements: HTMLElement[], options: AnimationOptions = {}) {
    const { duration = 1.2, ease = 'power2.inOut', onComplete } = options;

    gsap.to(elements, {
      opacity: 0.8,
      duration,
      ease,
      stagger: 0.1,
      onComplete,
    });
  },

  /**
   * Animate fog opacity change
   */
  setOpacity(
    elements: HTMLElement | SVGElement | (HTMLElement | SVGElement)[],
    opacity: number,
    options: AnimationOptions = {}
  ) {
    const { duration = 0.5, ease = 'power1.inOut', onComplete } = options;

    gsap.to(elements, {
      opacity,
      duration,
      ease,
      onComplete,
    });
  },

  /**
   * Ripple effect when revealing fog
   */
  rippleReveal(element: HTMLElement | SVGElement, options: AnimationOptions = {}) {
    const { duration = 1.5, ease = 'power2.out', onComplete } = options;

    // Create expanding circle effect
    gsap.fromTo(
      element,
      {
        clipPath: 'circle(0% at 50% 50%)',
        opacity: 0.8,
      },
      {
        clipPath: 'circle(100% at 50% 50%)',
        opacity: 0,
        duration,
        ease,
        onComplete,
      }
    );
  },
};

/**
 * Pan and Zoom Animations
 */
export const ViewportAnimations = {
  /**
   * Smooth pan to position
   */
  panTo(
    element: HTMLElement,
    x: number,
    y: number,
    options: AnimationOptions = {}
  ) {
    const { duration = 0.8, ease = 'power2.out', onComplete } = options;

    gsap.to(element, {
      x,
      y,
      duration,
      ease,
      onComplete,
    });
  },

  /**
   * Smooth zoom to scale
   */
  zoomTo(element: HTMLElement, scale: number, options: AnimationOptions = {}) {
    const { duration = 0.6, ease = 'power2.inOut', onComplete } = options;

    gsap.to(element, {
      scale,
      duration,
      ease,
      onComplete,
    });
  },

  /**
   * Combined pan and zoom animation
   */
  panAndZoom(
    element: HTMLElement,
    x: number,
    y: number,
    scale: number,
    options: AnimationOptions = {}
  ) {
    const { duration = 1.0, ease = 'power2.inOut', onComplete } = options;

    gsap.to(element, {
      x,
      y,
      scale,
      duration,
      ease,
      onComplete,
    });
  },

  /**
   * Reset view to default position and zoom
   */
  resetView(element: HTMLElement, options: AnimationOptions = {}) {
    const { duration = 0.7, ease = 'power2.inOut', onComplete } = options;

    gsap.to(element, {
      x: 0,
      y: 0,
      scale: 1,
      duration,
      ease,
      onComplete,
    });
  },

  /**
   * Focus on a specific point with zoom
   */
  focusOnPoint(
    element: HTMLElement,
    x: number,
    y: number,
    zoomLevel: number = 2,
    options: AnimationOptions = {}
  ) {
    const { duration = 1.2, ease = 'power2.inOut', onComplete } = options;

    // Calculate center offset
    const offsetX = window.innerWidth / 2 - x * zoomLevel;
    const offsetY = window.innerHeight / 2 - y * zoomLevel;

    gsap.to(element, {
      x: offsetX,
      y: offsetY,
      scale: zoomLevel,
      duration,
      ease,
      onComplete,
    });
  },
};

/**
 * Stat Display Animations
 */
export const StatAnimations = {
  /**
   * Count up animation for numeric stats
   */
  countUp(
    element: HTMLElement,
    from: number,
    to: number,
    options: AnimationOptions = {}
  ) {
    const { duration = 1.0, ease = 'power1.out', onComplete } = options;

    const obj = { value: from };
    gsap.to(obj, {
      value: to,
      duration,
      ease,
      onUpdate: () => {
        element.textContent = Math.round(obj.value).toString();
      },
      onComplete,
    });
  },

  /**
   * Slide in stat display from the side
   */
  slideIn(element: HTMLElement, options: AnimationOptions = {}) {
    const { duration = 0.5, ease = 'power2.out', delay = 0, onComplete } = options;

    gsap.fromTo(
      element,
      {
        x: -50,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration,
        ease,
        delay,
        onComplete,
      }
    );
  },

  /**
   * Fade in stat display
   */
  fadeIn(element: HTMLElement, options: AnimationOptions = {}) {
    const { duration = 0.4, ease = 'power1.inOut', delay = 0, onComplete } = options;

    gsap.fromTo(
      element,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration,
        ease,
        delay,
        onComplete,
      }
    );
  },

  /**
   * Highlight stat change with color flash
   */
  highlightChange(element: HTMLElement, color: string = '#10b981') {
    const originalColor = window.getComputedStyle(element).color;

    gsap.fromTo(
      element,
      {
        color,
        scale: 1.1,
      },
      {
        color: originalColor,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
      }
    );
  },

  /**
   * Progress bar fill animation
   */
  fillProgressBar(
    element: HTMLElement,
    percentage: number,
    options: AnimationOptions = {}
  ) {
    const { duration = 0.8, ease = 'power2.out', onComplete } = options;

    gsap.to(element, {
      width: `${percentage}%`,
      duration,
      ease,
      onComplete,
    });
  },
};

/**
 * Particle Effects System
 */
export const ParticleEffects = {
  /**
   * Create and animate particles for spell/ability effects
   */
  createParticles(
    container: HTMLElement,
    x: number,
    y: number,
    config: ParticleConfig
  ) {
    const { color, count, spread, duration, type } = config;
    const particles: HTMLElement[] = [];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'map-particle';
      particle.style.position = 'absolute';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = type === 'spell' ? '6px' : '4px';
      particle.style.height = type === 'spell' ? '6px' : '4px';
      particle.style.borderRadius = '50%';
      particle.style.backgroundColor = color;
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '1000';

      container.appendChild(particle);
      particles.push(particle);

      // Random direction and distance
      const angle = (Math.PI * 2 * i) / count;
      const distance = spread * (0.5 + Math.random() * 0.5);
      const targetX = x + Math.cos(angle) * distance;
      const targetY = y + Math.sin(angle) * distance;

      // Animate particle
      gsap.to(particle, {
        x: targetX - x,
        y: targetY - y,
        opacity: 0,
        scale: 0,
        duration: duration * (0.5 + Math.random() * 0.5),
        ease: 'power2.out',
        onComplete: () => {
          particle.remove();
        },
      });
    }

    return particles;
  },

  /**
   * Spell cast effect (radiating particles)
   */
  spellCast(container: HTMLElement, x: number, y: number, color: string = '#8b5cf6') {
    return this.createParticles(container, x, y, {
      color,
      count: 20,
      spread: 80,
      duration: 1.5,
      type: 'spell',
    });
  },

  /**
   * Ability activation effect (burst)
   */
  abilityBurst(container: HTMLElement, x: number, y: number, color: string = '#10b981') {
    return this.createParticles(container, x, y, {
      color,
      count: 15,
      spread: 60,
      duration: 1.0,
      type: 'ability',
    });
  },

  /**
   * Damage effect (red particles)
   */
  damageEffect(container: HTMLElement, x: number, y: number) {
    return this.createParticles(container, x, y, {
      color: '#ef4444',
      count: 12,
      spread: 40,
      duration: 0.8,
      type: 'damage',
    });
  },

  /**
   * Heal effect (green glow)
   */
  healEffect(container: HTMLElement, x: number, y: number) {
    return this.createParticles(container, x, y, {
      color: '#22c55e',
      count: 16,
      spread: 50,
      duration: 1.2,
      type: 'heal',
    });
  },

  /**
   * Radial pulse effect (for AOE spells)
   */
  radialPulse(container: HTMLElement, x: number, y: number, radius: number, color: string = '#8b5cf6') {
    const pulse = document.createElement('div');
    pulse.style.position = 'absolute';
    pulse.style.left = `${x}px`;
    pulse.style.top = `${y}px`;
    pulse.style.width = '0px';
    pulse.style.height = '0px';
    pulse.style.borderRadius = '50%';
    pulse.style.border = `2px solid ${color}`;
    pulse.style.transform = 'translate(-50%, -50%)';
    pulse.style.pointerEvents = 'none';
    pulse.style.zIndex = '999';

    container.appendChild(pulse);

    gsap.to(pulse, {
      width: radius * 2,
      height: radius * 2,
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out',
      onComplete: () => {
        pulse.remove();
      },
    });

    return pulse;
  },
};

/**
 * Utility function to kill all animations on an element
 */
export const killAnimations = (element: HTMLElement) => {
  gsap.killTweensOf(element);
};

/**
 * Utility function to kill all animations
 */
export const killAllAnimations = () => {
  gsap.killTweensOf('*');
};
