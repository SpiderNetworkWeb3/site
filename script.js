// Animate on scroll
AOS.init();

// Shrink nav on scroll
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  if (window.scrollY > 50) {
    nav.style.padding = "0.8rem 2rem";
    nav.style.background = "rgba(15,15,25,0.98)";
  } else {
    nav.style.padding = "1.2rem 2rem";
    nav.style.background = "rgba(15,15,25,0.95)";
  }
});

// Load particles
tsParticles.load("tsparticles", {
  fullScreen: {
    enable: true,
    zIndex: -2
  },
  particles: {
    number: {
      value: 70,
      density: {
        enable: true,
        area: 800
      }
    },
    color: {
      value: "#f94d1c"
    },
    shape: {
      type: "circle"
    },
    opacity: {
      value: 0.5
    },
    size: {
      value: 2.5
    },
    move: {
      enable: true,
      speed: 1.2,
      direction: "none",
      outModes: {
        default: "bounce"
      }
    },
    links: {
      enable: true,
      distance: 140,
      color: "#f94d1c",
      opacity: 0.4,
      width: 1
    }
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse"
      },
      onClick: {
        enable: true,
        mode: "push"
      }
    },
    modes: {
      repulse: {
        distance: 100
      },
      push: {
        quantity: 4
      }
    }
  },
  detectRetina: true
});
