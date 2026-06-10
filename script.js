const revealTargets = document.querySelectorAll(
  ".chapter-cover, .project-sequence, .spread, .text-page"
);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

revealTargets.forEach((target) => target.classList.add("reveal"));

if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

const quickIndex = document.querySelector(".quick-index");
const quickIndexToggle = document.querySelector(".quick-index-toggle");
const navMenu = document.querySelector(".nav-menu");
const navMenuToggle = document.querySelector(".nav-menu-toggle");
const siteHeader = document.querySelector(".site-header");

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    glideTo(target);
    history.pushState(null, "", targetId);
  });
});

function glideTo(target) {
  const current = window.scrollY;
  const targetTop = target.getBoundingClientRect().top + current;
  const noOffset = target.classList.contains("text-page") || target.classList.contains("chapter-cover");
  const finalTop = Math.max(0, targetTop - (noOffset ? 0 : 64));
  if (prefersReducedMotion.matches) {
    window.scrollTo(0, finalTop);
    return;
  }

  const fullDistance = finalTop - current;
  const direction = fullDistance >= 0 ? 1 : -1;
  const stagingDistance = Math.min(620, Math.max(260, Math.abs(fullDistance) * 0.32));
  const start = Math.abs(fullDistance) > 760
    ? Math.max(0, finalTop - direction * stagingDistance)
    : current;
  const distance = finalTop - start;
  const duration = Math.min(720, Math.max(360, Math.abs(distance) * 1.15));

  if (start !== current) {
    window.scrollTo(0, start);
  }

  const startTime = performance.now();

  function tick(now) {
    const elapsed = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    window.scrollTo(0, start + distance * eased);

    if (elapsed < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

document.querySelectorAll(".video-combo").forEach((combo) => {
  const video = combo.querySelector("video");

  if (!video) return;

  video.addEventListener("ended", () => {
    video.pause();
  });

  video.addEventListener("click", () => {
    if (!combo.classList.contains("is-video-open")) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  });
});

if ("IntersectionObserver" in window) {
  const videoOpenObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const combo = entry.target;
        const video = combo.querySelector("video");
        if (!video || combo.dataset.played === "true") return;

        combo.dataset.played = "true";
        window.setTimeout(() => {
          combo.classList.add("is-video-open");
          video.currentTime = 0;
          video.play().catch(() => {});
        }, prefersReducedMotion.matches ? 0 : 520);
      });
    },
    { threshold: 0.58 }
  );

  document.querySelectorAll(".video-combo").forEach((combo) => {
    videoOpenObserver.observe(combo);
  });
}

const darkSections = document.querySelectorAll(".dark-sequence");

function syncHeaderTheme() {
  if (!siteHeader) return;

  const probeY = Math.min(120, window.innerHeight * 0.18);
  const isDark = Array.from(darkSections).some((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= probeY && rect.bottom >= probeY;
  });

  siteHeader.classList.toggle("is-dark", isDark);
}

window.addEventListener("scroll", syncHeaderTheme, { passive: true });
window.addEventListener("resize", syncHeaderTheme);
syncHeaderTheme();

function closeMenus() {
  if (navMenu && navMenuToggle) {
    navMenu.classList.remove("is-open");
    navMenuToggle.setAttribute("aria-expanded", "false");
  }

  if (quickIndex && quickIndexToggle) {
    quickIndex.classList.remove("is-open");
    quickIndexToggle.setAttribute("aria-expanded", "false");
  }
}

if (navMenu && navMenuToggle) {
  navMenuToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = navMenu.classList.toggle("is-open");
    navMenuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navMenuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (quickIndex && quickIndexToggle) {
  quickIndexToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = quickIndex.classList.toggle("is-open");
    quickIndexToggle.setAttribute("aria-expanded", String(isOpen));
  });

  quickIndex.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    closeMenus();
  });

  quickIndex.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      quickIndex.classList.remove("is-open");
      quickIndexToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenus();
  }
});
