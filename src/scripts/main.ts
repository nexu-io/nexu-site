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
  { theta: 192, phi: 92, radius: 44, size: 84, delay: -2.3, blur: 1.8, shape: "pill" },
  { theta: 142, phi: 124, radius: 48, size: 132, delay: -0.9, blur: 1.1, shape: "circle" },
  { theta: 100, phi: 74, radius: 39, size: 208, delay: -2.6, blur: 0.7, shape: "pill" },
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
const logos = ["/assets/logo.png", "/assets/logo2.png", "/assets/logo3.png", "/assets/logo4.png", "/assets/logo5.png"];
let enterCount = 1;
let wasInView = false;
let currentLogoIndex = 0;

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
  if (index === 0) {
    node.classList.add("world--image");
    node.style.background = "none";
    node.style.backgroundImage = "url('/assets/0202.png')";
    node.style.backgroundSize = "100% 106%";
    node.style.backgroundPosition = "center center";
    node.style.backgroundRepeat = "no-repeat";
    node.style.boxShadow = "none";
    node.style.border = "none";
    node.style.backdropFilter = "none";
    node.style.borderRadius = "12px";
    node.style.cursor = "zoom-in";
    node.style.marginTop = "30px";
    node.style.pointerEvents = "auto";
    node.addEventListener("click", () => openLightbox("/assets/0202.png"));
  }
  if (index === 2) {
    node.classList.add("world--image");
    node.style.width = "340px";
    node.style.height = "242px";
    node.style.background = "none";
    node.style.backgroundImage = "url('/assets/desktop3.png')";
    node.style.backgroundSize = "cover";
    node.style.backgroundPosition = "top left";
    node.style.backgroundRepeat = "no-repeat";
    node.style.boxShadow = "none";
    node.style.border = "none";
    node.style.backdropFilter = "none";
    node.style.borderRadius = "6px";
    node.style.cursor = "zoom-in";
    node.style.pointerEvents = "auto";
    node.addEventListener("click", () => openLightbox("/assets/desktop3.png"));
  }
  if (index === 4) {
    node.classList.add("world--image");
    node.style.width = "340px";
    node.style.height = "242px";
    node.style.background = "none";
    node.style.backgroundImage = "url('/assets/desktop4.png')";
    node.style.backgroundSize = "cover";
    node.style.backgroundPosition = "center center";
    node.style.backgroundRepeat = "no-repeat";
    node.style.boxShadow = "none";
    node.style.border = "none";
    node.style.backdropFilter = "none";
    node.style.borderRadius = "6px";
    node.style.cursor = "zoom-in";
    node.style.pointerEvents = "auto";
    node.addEventListener("click", () => openLightbox("/assets/desktop4.png"));
  }

  orbit.appendChild(node);
  return node;
});

let rotation = 0;
let targetRotation = 0;
let pointer = { x: 0, y: 0 };

const DRAGGABLE = [0, 2, 3, 4];
const OFFSET_DEFAULTS: Record<number, { x: number; y: number }> = {
  0: { x: -15.55, y: -18.11 },
  2: { x: -5.33, y: -2.87 },
  3: { x: -5.36, y: 3.53 },
  4: { x: 5.43, y: 25.52 },
};
const OFFSET_KEY = "nexu-drag-offsets";
function loadOffsets(): Map<number, { x: number; y: number }> {
  try {
    const saved = JSON.parse(localStorage.getItem(OFFSET_KEY) || "{}");
    return new Map(DRAGGABLE.map(i => [i, saved[i] ?? OFFSET_DEFAULTS[i] ?? { x: 0, y: 0 }]));
  } catch {
    return new Map(DRAGGABLE.map(i => [i, OFFSET_DEFAULTS[i] ?? { x: 0, y: 0 }]));
  }
}
const dragOffsets: Map<number, { x: number; y: number }> = loadOffsets();
let drag: { idx: number; mx0: number; my0: number; ox0: number; oy0: number; moved: boolean } | null = null;

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
    opacity: 1,
  };
}

function renderWorlds(): void {
  worlds.forEach((world, index) => {
    const projected = projectWorld(world);
    const node = worldNodes[index];
    const off = dragOffsets.get(index);
    node.style.setProperty("--x", `${projected.x + (off?.x ?? 0)}%`);
    node.style.setProperty("--y", `${projected.y + (off?.y ?? 0)}%`);
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
    faviconLink.href = darkScheme.matches ? "/assets/0901-white.svg" : "/assets/0901.svg";
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
      const nextIndex = enterCount % logos.length;
      if (nextIndex !== currentLogoIndex) {
        currentLogoIndex = nextIndex;
        setLogo(logos[nextIndex]);
      }
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
  if (drag) {
    const stage = document.querySelector<HTMLElement>(".world-stage");
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const dx = ((event.clientX - drag.mx0) / r.width) * 100;
    const dy = ((event.clientY - drag.my0) / r.height) * 100;
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) drag.moved = true;
    const off = dragOffsets.get(drag.idx)!;
    off.x = drag.ox0 + dx;
    off.y = drag.oy0 + dy;
  }
});

let justDragged = false;

window.addEventListener("mouseup", () => {
  if (!drag) return;
  worldNodes[drag.idx].style.cursor = "grab";
  if (drag.moved) {
    justDragged = true;
    const positions: Record<number, { x: number; y: number }> = {};
    DRAGGABLE.forEach(i => {
      const o = dragOffsets.get(i)!;
      positions[i] = { x: +o.x.toFixed(2), y: +o.y.toFixed(2) };
    });
    console.log("dragOffsets:", JSON.stringify(positions));
    localStorage.setItem(OFFSET_KEY, JSON.stringify(positions));
  }
  drag = null;
});

DRAGGABLE.forEach(idx => {
  const node = worldNodes[idx];
  node.style.cursor = "grab";
  node.style.pointerEvents = "auto";
  node.addEventListener("mousedown", (e: MouseEvent) => {
    e.preventDefault();
    const off = dragOffsets.get(idx)!;
    drag = { idx, mx0: e.clientX, my0: e.clientY, ox0: off.x, oy0: off.y, moved: false };
    node.style.cursor = "grabbing";
  });
  node.addEventListener("click", (e: MouseEvent) => {
    if (justDragged) { justDragged = false; e.stopImmediatePropagation(); e.preventDefault(); }
  }, true);
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
  const preload = new Image();
  preload.onload = () => {
    (["footer-logo-desktop", "footer-logo-mobile"] as const).forEach((id) => {
      const el = document.getElementById(id) as HTMLImageElement | null;
      if (!el) return;
      el.style.transition = "opacity 0.2s ease";
      el.style.opacity = "0";
      setTimeout(() => {
        el.src = src;
        el.style.opacity = "1";
      }, 220);
    });
  };
  preload.src = src;
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
  const email = signupEmail?.value.trim() ?? "";
  const toast = document.createElement("div");
  toast.style.cssText =
    "position:fixed;top:24px;left:50%;transform:translateX(-50%) translateY(-16px);background:#1a1a1a;color:#fff;padding:12px 12px 12px 20px;border-radius:999px;font-size:14px;opacity:0;transition:opacity 0.3s ease,transform 0.3s ease;z-index:9999;white-space:nowrap;display:flex;align-items:center;gap:12px;";

  const text = document.createElement("span");
  text.textContent = "We've sent a confirmation to your email";
  toast.appendChild(text);

  const btn = document.createElement("a");
  btn.textContent = "View";
  btn.href = getMailboxUrl(email);
  btn.target = "_blank";
  btn.rel = "noopener";
  btn.style.cssText =
    "background:#fff;color:#1a1a1a;padding:6px 14px;border-radius:999px;font-size:13px;font-weight:500;text-decoration:none;flex-shrink:0;";
  toast.appendChild(btn);

  document.body.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  }));
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(-16px)";
    setTimeout(() => toast.remove(), 350);
  }, 5000);
});

function openLightbox(src: string): void {
  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";

  const wrapper = document.createElement("div");
  wrapper.className = "lightbox-wrapper";

  const frame = document.createElement("div");
  frame.className = "lightbox-frame";

  const img = document.createElement("img");
  img.src = src;
  img.alt = "Preview";

  const closeBtn = document.createElement("button");
  closeBtn.className = "lightbox-close";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.innerHTML = `<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  frame.appendChild(img);
  wrapper.appendChild(frame);
  wrapper.appendChild(closeBtn);
  overlay.appendChild(wrapper);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add("is-open")));

  function close(): void {
    overlay.classList.remove("is-open");
    overlay.addEventListener("transitionend", () => overlay.remove(), { once: true });
  }

  closeBtn.addEventListener("click", (e) => { e.stopPropagation(); close(); });
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", function onKey(e) {
    if (e.key === "Escape") { close(); document.removeEventListener("keydown", onKey); }
  });
}

function getMailboxUrl(email: string): string {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    "gmail.com":        `https://mail.google.com/mail/u/?authuser=${encodeURIComponent(email)}`,
    "googlemail.com":   `https://mail.google.com/mail/u/?authuser=${encodeURIComponent(email)}`,
    "outlook.com":      "https://outlook.live.com/mail/",
    "hotmail.com":      "https://outlook.live.com/mail/",
    "live.com":         "https://outlook.live.com/mail/",
    "msn.com":          "https://outlook.live.com/mail/",
    "yahoo.com":        "https://mail.yahoo.com/",
    "yahoo.co.uk":      "https://mail.yahoo.com/",
    "yahoo.co.jp":      "https://mail.yahoo.co.jp/",
    "icloud.com":       "https://www.icloud.com/mail/",
    "me.com":           "https://www.icloud.com/mail/",
    "mac.com":          "https://www.icloud.com/mail/",
    "qq.com":           "https://mail.qq.com/",
    "163.com":          "https://mail.163.com/",
    "126.com":          "https://mail.126.com/",
    "yeah.net":         "https://mail.yeah.net/",
    "sina.com":         "https://mail.sina.com.cn/",
    "sohu.com":         "https://mail.sohu.com/",
    "foxmail.com":      "https://mail.qq.com/",
    "protonmail.com":   "https://mail.proton.me/",
    "proton.me":        "https://mail.proton.me/",
    "zoho.com":         "https://mail.zoho.com/",
  };
  return map[domain] ?? `https://mail.${domain}`;
}

export {};
