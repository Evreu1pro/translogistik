// Über uns — scroll-driven story chapters + fleet video (HEUTE).
// Header/menu are handled by site-nav.js.

const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const desktop = matchMedia("(min-width: 801px)");
const story = document.querySelector(".story-shell");
const items = [...document.querySelectorAll(".story-item")];
const dots = [...document.querySelectorAll(".progress-dot")];
const counter = document.querySelector(".story-counter");
const fleet = document.querySelector(".fleet");
const video = document.querySelector("#fleetVideo");

if (!story || !fleet || !items.length) {
  // Page structure incomplete — skip animation setup.
} else {
  let fleetOn = false;
  let fleetDesired = false;

  function setFleetActive(on) {
    if (on === fleetOn) return;
    fleetOn = on;
    fleet.classList.toggle("active", on);
    story.style.setProperty("--burst", on ? "1" : "0");
    syncVideo(on);
  }

  function syncVideo(shouldPlay) {
    if (!video) return;
    if (reduced) {
      if (!video.paused) video.pause();
      return;
    }
    if (shouldPlay) {
      // Only call play when actually paused — avoids restart glitches on every scroll tick
      if (video.paused) {
        const play = video.play();
        if (play && typeof play.catch === "function") play.catch(() => {});
      }
    } else if (!video.paused) {
      video.pause();
    }
  }

  function sync() {
    if (desktop.matches) {
      const r = story.getBoundingClientRect();
      const travel = story.offsetHeight - innerHeight;
      const p = clamp(-r.top / Math.max(1, travel));
      const phase = p * 4;
      const active = Math.min(3, Math.floor(phase));
      items.forEach((el, i) => el.classList.toggle("active", i === active));
      dots.forEach((d, i) => d.classList.toggle("on", i === active));
      if (counter) counter.textContent = `0${Math.min(active + 1, 4)} / 04`;
      story.style.setProperty("--line-progress", `${Math.min(100, p * 133)}%`);
      // Hysteresis: enter HEUTE early, leave only when clearly back on chapter 03
      if (phase >= 2.92) fleetDesired = true;
      else if (phase < 2.75) fleetDesired = false;
      setFleetActive(fleetDesired);
    } else {
      const r = fleet.getBoundingClientRect();
      const visible = r.top < innerHeight * 0.85 && r.bottom > innerHeight * 0.15;
      fleetDesired = visible;
      setFleetActive(visible);
    }
  }

  if (video) {
    // Keep playback continuous across loop boundaries (no pause/restart churn)
    video.addEventListener("ended", () => {
      if (!fleetOn || reduced) return;
      try {
        video.currentTime = 0;
        video.play().catch(() => {});
      } catch (_) {}
    });
  }

  addEventListener("scroll", sync, { passive: true });
  addEventListener("resize", sync);
  desktop.addEventListener("change", sync);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && fleetOn) syncVideo(true);
  });

  sync();
}
