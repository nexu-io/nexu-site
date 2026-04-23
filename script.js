const worlds = [
  { theta: 12, phi: 66, radius: 42, size: 54, delay: -0.1, blur: 1.2 },
  { theta: 46, phi: 112, radius: 47, size: 66, delay: -1.4, blur: 1.8 },
  { theta: 85, phi: 74, radius: 40, size: 48, delay: -2.1, blur: 2.5 },
  { theta: 126, phi: 132, radius: 48, size: 70, delay: -0.8, blur: 1.4 },
  { theta: 164, phi: 94, radius: 45, size: 56, delay: -2.8, blur: 2.2 },
  { theta: 202, phi: 122, radius: 49, size: 64, delay: -1.1, blur: 1.6 },
  { theta: 238, phi: 68, radius: 41, size: 46, delay: -2.4, blur: 2.8 },
  { theta: 278, phi: 108, radius: 46, size: 60, delay: -0.5, blur: 1.7 },
  { theta: 318, phi: 86, radius: 44, size: 52, delay: -1.9, blur: 2.3 },
  { theta: 22, phi: 140, radius: 31, size: 34, delay: -2.7, blur: 5.5 },
  { theta: 72, phi: 44, radius: 26, size: 30, delay: -0.9, blur: 5.8 },
  { theta: 142, phi: 50, radius: 28, size: 36, delay: -1.6, blur: 4.8 },
  { theta: 214, phi: 146, radius: 30, size: 38, delay: -2.2, blur: 5.2 },
  { theta: 292, phi: 48, radius: 27, size: 32, delay: -1.2, blur: 5.6 },
  { theta: 344, phi: 134, radius: 29, size: 34, delay: -2.9, blur: 5.4 },
  { theta: 104, phi: 96, radius: 20, size: 26, delay: -0.4, blur: 6.4 },
  { theta: 188, phi: 84, radius: 22, size: 28, delay: -1.7, blur: 6 },
  { theta: 254, phi: 118, radius: 23, size: 30, delay: -2.5, blur: 5.9 },
  { theta: 326, phi: 104, radius: 21, size: 27, delay: -0.7, blur: 6.2 }
];

const palettes = [
  ["#d7e2db", "#b6c8ce", "#f3eee2"],
  ["#dedbd1", "#b9cad8", "#f5f0e7"],
  ["#d9e0ea", "#d3c6bd", "#f5f4ee"],
  ["#cfded7", "#e0c9bd", "#f7f2e9"],
  ["#e4dfd1", "#bfcfd4", "#f6f2ec"]
];

const orbit = document.querySelector("#worlds");
const introCard = document.querySelector(".intro-card");
const footerElement = document.querySelector("#footer");
let rotation = 0;
let targetRotation = 0;
let pointer = { x: 0, y: 0 };

function projectWorld(world) {
  const theta = ((world.theta + rotation) * Math.PI) / 180;
  const phi = (world.phi * Math.PI) / 180;
  const x3 = world.radius * Math.sin(phi) * Math.cos(theta);
  const y3 = world.radius * Math.cos(phi);
  const z3 = world.radius * Math.sin(phi) * Math.sin(theta);
  const normalizedDepth = (-z3 + world.radius) / (2 * world.radius);
  return {
    x: 50 + x3 * 0.92 + pointer.x * 1.7,
    y: 50 - y3 * 0.86 + pointer.y * 1.2,
    scale: 1 + z3 * 0.006,
    z: Math.round(z3 + 100),
    blur: Math.max(0, normalizedDepth * world.blur),
    opacity: 0.56 + (1 - normalizedDepth) * 0.38
  };
}

function renderWorlds() {
  orbit.innerHTML = "";
  worlds.forEach((world, index) => {
    const projected = projectWorld(world);
    const palette = palettes[index % palettes.length];
    const node = document.createElement("span");
    node.className = "world";
    node.style.setProperty("--x", `${projected.x}%`);
    node.style.setProperty("--y", `${projected.y}%`);
    node.style.setProperty("--z", projected.z);
    node.style.setProperty("--size", `${world.size}px`);
    node.style.setProperty("--scale", projected.scale.toFixed(3));
    node.style.setProperty("--blur", `${projected.blur.toFixed(2)}px`);
    node.style.setProperty("--opacity", projected.opacity.toFixed(2));
    node.style.setProperty("--delay", `${world.delay}s`);
    node.style.setProperty("--tone-a", palette[0]);
    node.style.setProperty("--tone-b", palette[1]);
    node.style.setProperty("--tone-c", palette[2]);
    orbit.appendChild(node);
  });
}

function animate() {
  rotation += (targetRotation - rotation) * 0.075;
  renderWorlds();
  requestAnimationFrame(animate);
}

const faviconLink = document.querySelector("link[rel='icon']");

const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");
function updateFavicon() {
  if (faviconLink) {
    faviconLink.href = darkScheme.matches ? "assets/0901-white.svg" : "assets/0901.svg";
  }
}
updateFavicon();
darkScheme.addEventListener("change", updateFavicon);

function updatePage() {
  introCard.classList.toggle("is-compact", window.innerHeight < 1000 || window.innerWidth < 640);
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  targetRotation = (window.scrollY / maxScroll - 0.5) * 120;

  if (footerElement) {
    const footerTop = footerElement.getBoundingClientRect().top;
    const tintStartsAt = window.innerHeight * 0.78;
    document.body.classList.toggle("footer-tint", footerTop < tintStartsAt);
  }
}

window.addEventListener("mousemove", (event) => {
  const x = event.clientX / window.innerWidth - 0.5;
  const y = event.clientY / window.innerHeight - 0.5;
  pointer = { x: x * 3, y: y * 3 };
});

window.addEventListener("scroll", updatePage, { passive: true });
window.addEventListener("resize", updatePage);
updatePage();
animate();

const logoSvg = document.getElementById("logo-svg");
const logoAnim = document.getElementById("logo-anim");
if (logoSvg && logoAnim) {
  logoSvg.addEventListener("mouseenter", () => logoAnim.beginElement());
}
