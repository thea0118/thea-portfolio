const chapters = [
  {
    id: "chapter-01",
    cover: "chapter-01",
    firstProject: "olay-white-bottle",
    projects: ["olay-white-bottle", "olay-agile-testing", "olay-v", "romano"],
  },
  {
    id: "chapter-02",
    cover: "chapter-02",
    firstProject: "grain-rain",
    projects: ["grain-rain", "olay-cny", "ecommerce-ued", "prox-detail", "mentholatum", "members-mark"],
  },
  {
    id: "chapter-03",
    cover: "chapter-03",
    firstProject: "olay-35",
    projects: ["olay-35", "timson-c", "liby", "mengniu"],
  },
  {
    id: "chapter-04",
    cover: "chapter-04",
    firstProject: "olay-gift-box",
    projects: ["olay-gift-box", "olay-mothers-day", "urban-hunter", "chimelong"],
  },
];

const projectToChapter = new Map();
const coverToChapter = new Map();
const firstProjectByChapter = new Map();

chapters.forEach((chapter) => {
  coverToChapter.set(chapter.cover, chapter.id);
  firstProjectByChapter.set(chapter.id, chapter.firstProject);
  chapter.projects.forEach((projectId) => {
    projectToChapter.set(projectId, chapter.id);
    const project = document.getElementById(projectId);
    if (project) project.dataset.chapter = chapter.id;
  });

  const cover = document.getElementById(chapter.cover);
  if (cover) cover.dataset.chapter = chapter.id;
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const quickIndex = document.querySelector(".quick-index");
const quickIndexToggle = document.querySelector(".quick-index-toggle");
const navMenu = document.querySelector(".nav-menu");
const navMenuToggle = document.querySelector(".nav-menu-toggle");
const siteHeader = document.querySelector(".site-header");
const works = document.getElementById("works");
const workItems = document.querySelectorAll(".chapter-cover, .project-sequence");
const deferredImages = document.querySelectorAll("img[data-src]");

function hydrateImage(image) {
  if (!image || image.getAttribute("src")) return;
  if (image.dataset.srcset) {
    image.setAttribute("srcset", image.dataset.srcset);
  }
  if (image.dataset.sizes) {
    image.setAttribute("sizes", image.dataset.sizes);
  }
  image.setAttribute("src", image.dataset.src);
}

function hydrateScope(scope) {
  if (!scope) return;
  scope.querySelectorAll("img[data-src]").forEach(hydrateImage);
  scope.querySelectorAll("video[data-src]").forEach((video) => {
    if (video.getAttribute("src")) return;
    video.setAttribute("src", video.dataset.src);
    video.load();
  });
}

if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        hydrateImage(entry.target);
        imageObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "900px 0px", threshold: 0.01 }
  );

  deferredImages.forEach((image) => imageObserver.observe(image));
} else {
  deferredImages.forEach(hydrateImage);
}

const revealTargets = document.querySelectorAll(
  ".chapter-cover, .project-sequence, .spread, .text-page, .chapter-group, .project-thumb"
);

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
    { threshold: 0.08 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

function setDirectoryMode() {
  document.body.classList.add("is-directory-mode");
  document.body.classList.remove("is-project-mode", "is-all-projects-mode");
  workItems.forEach((item) => item.classList.remove("work-hidden"));
  closeMenus();
  syncHeaderTheme();
}

function setAllProjectsMode() {
  document.body.classList.remove("is-directory-mode");
  document.body.classList.add("is-project-mode", "is-all-projects-mode");
  workItems.forEach((item) => item.classList.remove("work-hidden"));
  hydrateScope(document.getElementById("chapter-01"));
  hydrateScope(document.getElementById("olay-white-bottle"));
  closeMenus();
  syncHeaderTheme();
}

function setChapterMode(chapterId) {
  document.body.classList.remove("is-directory-mode", "is-all-projects-mode");
  document.body.classList.add("is-project-mode");

  workItems.forEach((item) => {
    const isProjectInChapter = item.classList.contains("project-sequence") && item.dataset.chapter === chapterId;
    item.classList.toggle("work-hidden", !isProjectInChapter);
  });

  chapters
    .find((chapter) => chapter.id === chapterId)
    ?.projects.forEach((projectId) => hydrateScope(document.getElementById(projectId)));

  closeMenus();
  syncHeaderTheme();
}

function modeForTarget(targetId) {
  if (projectToChapter.has(targetId)) {
    return { mode: "chapter", chapterId: projectToChapter.get(targetId), scrollId: targetId };
  }

  if (coverToChapter.has(targetId)) {
    const chapterId = coverToChapter.get(targetId);
    return { mode: "chapter", chapterId, scrollId: firstProjectByChapter.get(chapterId) };
  }

  if (targetId === "works") {
    return { mode: "all", scrollId: "works" };
  }

  return { mode: "directory", scrollId: targetId || "contents" };
}

function navigateTo(targetId, shouldPushState = true) {
  const route = modeForTarget(targetId);

  if (route.mode === "all") {
    setAllProjectsMode();
  } else if (route.mode === "chapter") {
    setChapterMode(route.chapterId);
  } else {
    setDirectoryMode();
  }

  const scrollTarget = document.getElementById(route.scrollId);
  if (scrollTarget) {
    glideTo(scrollTarget);
  }

  if (shouldPushState) {
    history.pushState(null, "", `#${route.scrollId}`);
  }
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href")?.slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target && targetId !== "works") return;

    event.preventDefault();
    navigateTo(targetId);
  });
});

function glideTo(target) {
  const current = window.scrollY;
  const targetTop = target.getBoundingClientRect().top + current;
  const isProjectMode = document.body.classList.contains("is-project-mode");
  const noOffset = target.classList.contains("text-page") || target.classList.contains("chapter-cover") || isProjectMode;
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
        if (!entry.isIntersecting || entry.target.classList.contains("work-hidden")) return;

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
    if (section.classList.contains("work-hidden")) return false;
    const rect = section.getBoundingClientRect();
    return rect.top <= probeY && rect.bottom >= probeY;
  });

  siteHeader.classList.toggle("is-dark", isDark);
}

window.addEventListener("scroll", syncHeaderTheme, { passive: true });
window.addEventListener("resize", syncHeaderTheme);

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

window.addEventListener("popstate", () => {
  const targetId = location.hash.slice(1);
  if (targetId) {
    navigateTo(targetId, false);
  } else {
    setDirectoryMode();
    window.scrollTo(0, 0);
  }
});

if (location.hash) {
  navigateTo(location.hash.slice(1), false);
} else {
  setDirectoryMode();
}
