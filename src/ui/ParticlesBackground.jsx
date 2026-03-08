import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "#0f172a"
          }
        },
        fpsLimit: 60,
        particles: {
          number: {
            value: 60
          },
          color: {
            value: "#4fd1c5"
          },
          links: {
            enable: true,
            color: "#4fd1c5",
            distance: 150
          },
          move: {
            enable: true,
            speed: 1
          },
          opacity: {
            value: 0.4
          },
          size: {
            value: { min: 1, max: 3 }
          }
        }
      }}
    />
  );
}