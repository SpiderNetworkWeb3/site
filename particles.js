// particles.js
document.addEventListener("DOMContentLoaded", () => {
  tsParticles.load("tsparticles", {
    fullScreen: { enable: true, zIndex: 0 },
    background: { color: "#0d0d17" },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
        resize: true
      },
      modes: {
        grab: {
          distance: 180,
          links: { opacity: 0.6 }
        }
      }
    },
    particles: {
      color: { value: ["#00FFA3", "#DC1FFF", "#00FFFB"] },
      links: {
        color: "#9945ff",
        distance: 120,
        enable: true,
        opacity: 0.4,
        width: 1.5
      },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "bounce" },
        random: false,
        speed: 0.8,
        straight: false
      },
      number: {
        density: { enable: true, area: 800 },
        value: 60
      },
      opacity: {
        value: 0.5
      },
      shape: {
        type: "circle"
      },
      size: {
        value: { min: 1, max: 3 }
      }
    },
    detectRetina: true
  });
});
