// particles.js
document.addEventListener("DOMContentLoaded", () => {
  tsParticles.load("tsparticles", {
    fullScreen: { enable: true },
    background: { color: "#0d0d17" },
    particles: {
      color: { value: ["#00FFA3", "#DC1FFF", "#00FFFB"] },
      links: { enable: true, color: "#9945ff", distance: 130 },
      move: { enable: true, speed: 0.75 },
      size: { value: 2 },
      opacity: { value: 0.4 },
      number: { value: 50 },
    }
  });
});
