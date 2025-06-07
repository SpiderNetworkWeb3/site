// Initialize Animate On Scroll
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true
});

// Navbar shrink effect on scroll
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  if (window.scrollY > 50) {
    nav.style.padding = "0.8rem 2rem";
    nav.style.background = "rgba(11, 11, 18, 0.98)";
  } else {
    nav.style.padding = "1.2rem 2rem";
    nav.style.background = "#0b0b12"; // solid to match logo background
  }
});

// Load particles.js background (Solana-inspired)
tsParticles.load("tsparticles", {
  fullScreen: { enable: true, zIndex: -2 },
  particles: {
    number: { value: 80, density: { enable: true, area: 800 } },
    color: { value: ["#9945ff", "#19fb9b", "#00ffa3"] }, // spider-accent colors
    shape: { type: "circle" },
    opacity: { value: 0.4 },
    size: { value: 2.5 },
    links: {
      enable: true,
      distance: 130,
      color: "#9945ff",
      opacity: 0.3,
      width: 1
    },
    move: {
      enable: true,
      speed: 1.2,
      outModes: { default: "bounce" }
    }
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      onClick: { enable: true, mode: "push" }
    },
    modes: {
      repulse: { distance: 100 },
      push: { quantity: 4 }
    }
  },
  detectRetina: true
});

// Rotating slogan logic
const slogans = [
  "Empowering Builders.",
  "Web3 dApps. Real Utility.",
  "Grants. Governance. Growth.",
  "Built on Solana. Designed for Scale."
];
const rotator = document.querySelector(".rotator");
let current = 0;

function rotateSlogan() {
  if (!rotator) return;
  rotator.innerHTML = `<span>${slogans[current]}</span>`;
  current = (current + 1) % slogans.length;
}
rotateSlogan();
setInterval(rotateSlogan, 3500);
