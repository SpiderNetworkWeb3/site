<script src="https://cdn.jsdelivr.net/npm/tsparticles@2.11.1/tsparticles.bundle.min.js"></script>
<script>
  const particlesConfig = {
    fullScreen: { enable: true, zIndex: 0 },
    background: { color: "#0d0d17" },
    fpsLimit: 60,
    interactivity: {
      detectsOn: "canvas",
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "grab" },
        resize: true
      },
      modes: {
        grab: {
          distance: 150,
          links: { opacity: 0.7 }
        },
        push: { quantity: 1 }
      }
    },
    particles: {
      number: {
        value: 75,
        density: { enable: true, area: 800 }
      },
      color: {
        value: ["#00FFA3", "#DC1FFF", "#00FFFB", "#9945ff"]
      },
      shape: { type: "circle" },
      opacity: { value: 0.6, random: true },
      size: { value: { min: 1, max: 4 }, random: true },
      links: {
        enable: true,
        distance: 130,
        color: "#00FFA3",
        opacity: 0.5,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: false,
        straight: false,
        outModes: { default: "bounce" }
      }
    },
    detectRetina: true
  };

  let spawnCount = 0;
  tsParticles.load("tsparticles", particlesConfig).then(container => {
    container.interactivity.element.addEventListener("click", () => {
      spawnCount++;
      if (spawnCount >= 75) {
        container.refresh();
        spawnCount = 0;
      }
    });
  });
</script>
