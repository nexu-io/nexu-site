interface World {
  theta: number;
  phi: number;
  radius: number;
  size: number;
  delay: number;
  blur: number;
  shape: "circle" | "pill";
}

const worlds: World[] = [
  { theta: 14, phi: 60, radius: 46, size: 178, delay: -0.4, blur: 0.8, shape: "pill" },
  { theta: 56, phi: 104, radius: 44, size: 118, delay: -1.7, blur: 1.2, shape: "circle" },
  { theta: 100, phi: 74, radius: 39, size: 84, delay: -2.3, blur: 1.8, shape: "pill" },
  { theta: 142, phi: 124, radius: 48, size: 132, delay: -0.9, blur: 1.1, shape: "circle" },
  { theta: 192, phi: 92, radius: 44, size: 208, delay: -2.6, blur: 0.7, shape: "pill" },
  { theta: 236, phi: 130, radius: 47, size: 136, delay: -1.2, blur: 1.3, shape: "pill" },
  { theta: 286, phi: 72, radius: 43, size: 94, delay: -2.1, blur: 1.9, shape: "circle" },
  { theta: 334, phi: 102, radius: 45, size: 154, delay: -0.6, blur: 1.1, shape: "pill" },
  { theta: 32, phi: 138, radius: 28, size: 56, delay: -2.8, blur: 3.8, shape: "circle" },
  { theta: 84, phi: 46, radius: 26, size: 66, delay: -1.1, blur: 4.4, shape: "pill" },
  { theta: 156, phi: 54, radius: 25, size: 60, delay: -1.8, blur: 4.1, shape: "circle" },
  { theta: 214, phi: 146, radius: 30, size: 74, delay: -2.4, blur: 3.6, shape: "pill" },
  { theta: 298, phi: 52, radius: 27, size: 58, delay: -1.4, blur: 4.3, shape: "circle" },
  { theta: 348, phi: 128, radius: 29, size: 80, delay: -2.9, blur: 3.7, shape: "pill" },
];

const palettes: [string, string, string][] = [
  ["rgba(217,236,255,0.82)", "rgba(249,187,216,0.72)", "rgba(54,103,198,0.92)"],
  ["rgba(220,241,255,0.84)", "rgba(255,208,187,0.7)", "rgba(37,76,173,0.9)"],
  ["rgba(233,246,255,0.82)", "rgba(186,214,255,0.72)", "rgba(20,42,104,0.94)"],
  ["rgba(230,245,255,0.8)", "rgba(255,198,223,0.7)", "rgba(74,123,214,0.92)"],
  ["rgba(214,236,255,0.84)", "rgba(255,214,225,0.72)", "rgba(19,34,84,0.95)"],
];

const orbit = document.querySelector<HTMLElement>("#worlds")!;
const introCard = document.querySelector<HTMLElement>(".intro-card")!;
const footerElement = document.querySelector<HTMLElement>("#footer");
const footerRevealSpace = document.querySelector<HTMLElement>(".footer-reveal-space");
const BASE = import.meta.env.BASE_URL.replace(/\/?$/, "/");
const logos = [`${BASE}assets/logo.png`, `${BASE}assets/logo2.png`, `${BASE}assets/logo3.png`, `${BASE}assets/logo4.png`, `${BASE}assets/logo5.png`];
let enterCount = 0;
let wasInView = false;

const worldNodes = worlds.map((world, index) => {
  const palette = palettes[index % palettes.length];
  const node = document.createElement("span");
  node.className = "world";
  node.style.setProperty("--size", `${world.size}px`);
  node.style.setProperty("--delay", `${world.delay}s`);
  node.style.setProperty("--tone-a", palette[0]);
  node.style.setProperty("--tone-b", palette[1]);
  node.style.setProperty("--tone-c", palette[2]);
  node.style.setProperty("--radius", "999px");
  if (world.shape === "pill") {
    node.style.width = `${Math.round(world.size * 1.95)}px`;
    node.style.height = `${Math.round(world.size * 0.68)}px`;
  }
  orbit.appendChild(node);
  return node;
});

let rotation = 0;
let targetRotation = 0;
let pointer = { x: 0, y: 0 };

function projectWorld(world: World) {
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
    opacity: 0.56 + (1 - normalizedDepth) * 0.38,
  };
}

function renderWorlds(): void {
  worlds.forEach((world, index) => {
    const projected = projectWorld(world);
    const node = worldNodes[index];
    node.style.setProperty("--x", `${projected.x}%`);
    node.style.setProperty("--y", `${projected.y}%`);
    node.style.setProperty("--z", String(projected.z));
    node.style.setProperty("--scale", projected.scale.toFixed(3));
    node.style.setProperty("--blur", `${projected.blur.toFixed(2)}px`);
    node.style.setProperty("--opacity", projected.opacity.toFixed(2));
  });
}

function animate(): void {
  rotation += (targetRotation - rotation) * 0.18;
  renderWorlds();
  requestAnimationFrame(animate);
}

const faviconLink = document.querySelector<HTMLLinkElement>("link[rel='icon']");
const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");

function updateFavicon(): void {
  if (faviconLink) {
    faviconLink.href = darkScheme.matches ? `${BASE}assets/0901-white.svg` : `${BASE}assets/0901.svg`;
  }
}
updateFavicon();
darkScheme.addEventListener("change", updateFavicon);

function updatePage(): void {
  introCard.classList.toggle("is-compact", window.innerHeight < 1000 || window.innerWidth < 640);
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  targetRotation = (window.scrollY / maxScroll - 0.5) * 120;

  if (footerElement) {
    const footerTop = footerElement.getBoundingClientRect().top;
    document.body.classList.toggle("footer-tint", footerTop < window.innerHeight * 0.78);
  }

  const triggerRect = footerRevealSpace?.getBoundingClientRect();
  if (triggerRect) {
    const inView = triggerRect.top < window.innerHeight && triggerRect.bottom > 0;
    if (inView && !wasInView) {
      wasInView = true;
      setLogo(logos[enterCount % logos.length]);
      const footerVideo = document.getElementById("footer-video") as HTMLVideoElement | null;
      if (footerVideo) {
        footerVideo.currentTime = 0;
        footerVideo.play();
      }
      enterCount++;
    } else if (!inView) {
      wasInView = false;
    }
  }
}

window.addEventListener("mousemove", (event: MouseEvent) => {
  const x = event.clientX / window.innerWidth - 0.5;
  const y = event.clientY / window.innerHeight - 0.5;
  pointer = { x: x * 3, y: y * 3 };
});

window.addEventListener("scroll", updatePage, { passive: true });
window.addEventListener("resize", updatePage);
updatePage();
animate();

const ctaBtn = document.getElementById("cta-early-access");
ctaBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  const target = document.querySelector(".footer-reveal-space") as HTMLElement | null;
  if (target) {
    const top = target.offsetTop + target.offsetHeight;
    window.scrollTo({ top, behavior: "smooth" });
  }
});

const logoSvg = document.getElementById("logo-svg");
const logoAnim = document.getElementById("logo-anim") as SVGAnimateTransformElement | null;
if (logoSvg && logoAnim) {
  logoSvg.addEventListener("mouseenter", () => logoAnim.beginElement());
}


function setLogo(src: string): void {
  const img = new Image();
  img.onload = () => {
    const ids = ["footer-logo-desktop", "footer-logo-mobile"] as const;
    ids.forEach((id) => {
      const el = document.getElementById(id) as HTMLImageElement | null;
      if (!el) return;
      const parent = el.parentElement;
      if (!parent) return;

      const next = el.cloneNode() as HTMLImageElement;
      next.src = src;
      next.style.cssText = `position:absolute;top:0;left:0;width:${el.offsetWidth}px;height:${el.offsetHeight}px;opacity:0;transition:opacity 0.7s ease;`;
      parent.appendChild(next);

      requestAnimationFrame(() => requestAnimationFrame(() => {
        next.style.opacity = "1";
        el.style.transition = "opacity 0.7s ease";
        el.style.opacity = "0";
      }));

      setTimeout(() => {
        el.src = src;
        el.style.opacity = "1";
        el.style.transition = "";
        next.remove();
      }, 750);
    });
  };
  img.src = src;
}

const signupEmail = document.getElementById("footer-email") as HTMLInputElement | null;
const signupChips = Array.from(document.querySelectorAll<HTMLButtonElement>(".signup-chip"));
const signupSubmit = document.querySelector<HTMLButtonElement>(".signup-submit");

function updateSignupState(): void {
  if (!signupEmail || !signupSubmit) return;
  const hasEmail = signupEmail.value.trim().length > 0;
  const hasRole = signupChips.some((chip) => chip.classList.contains("is-active"));
  const isReady = hasEmail && hasRole;
  signupSubmit.disabled = !isReady;
  signupSubmit.classList.toggle("is-ready", isReady);
}

signupChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    signupChips.forEach((item) => {
      const active = item === chip;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    updateSignupState();
  });
});

signupEmail?.addEventListener("input", updateSignupState);
updateSignupState();

signupSubmit?.addEventListener("click", () => {
  const toast = document.createElement("div");
  toast.textContent = "✓ You're on the list — we'll be in touch soon.";
  toast.style.cssText =
    "position:fixed;top:24px;left:50%;transform:translateX(-50%) translateY(-16px);background:#1a1a1a;color:#fff;padding:14px 24px;border-radius:999px;font-size:14px;opacity:0;transition:opacity 0.3s ease,transform 0.3s ease;z-index:9999;white-space:nowrap;";
  document.body.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  }));
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(-16px)";
    setTimeout(() => toast.remove(), 350);
  }, 3000);
});

export {};
