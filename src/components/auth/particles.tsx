'use client';

import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import type { Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';

function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    console.log('Particles engine loaded:', engine);
    await loadSlim(engine); // Load slim version of tsparticles
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true },
        background: {
          color: '#ffff',
        },
        fpsLimit: 120,
        particles: {
          number: {
            value: 70,
            density: {
              enable: true,
              area: 800,
            },
          },
          shape: {
            type: 'circle',
          },
          opacity: {
            value: 0.5,
          },
          size: {
            value: 3,
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            outModes: {
              default: 'bounce',
            },
          },
          links: {
            enable: true,
            distance: 150,
            color: '#000000',
            opacity: 0.5,
            width: 1,
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true, // ✅ Enable hover effect
              mode: 'repulse', // ✅ Change this to "grab" or "bubble" if you want different effects
            },
            onClick: {
              enable: true, // ✅ Enable click interaction
              mode: 'push', // ✅ Change this to "remove" to remove particles on click
            },
          },
          modes: {
            repulse: {
              distance: 100, // ✅ Set repulsion distance
              duration: 0.4,
            },
            grab: {
              distance: 200,
              links: {
                opacity: 0.8,
              },
            },
            push: {
              quantity: 4,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
}

export default ParticlesBackground;
