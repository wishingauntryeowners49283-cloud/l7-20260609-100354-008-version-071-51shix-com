const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
    return;
  }
  callback();
};

function initMobileMenu() {
  const button = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (!button || !menu) {
    return;
  }
  button.addEventListener("click", () => {
    menu.classList.toggle("is-open");
  });
}

function initHero() {
  const root = document.querySelector("[data-hero]");
  if (!root) {
    return;
  }
  const slides = Array.from(root.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(root.querySelectorAll("[data-hero-dot]"));
  const previous = root.querySelector("[data-hero-prev]");
  const next = root.querySelector("[data-hero-next]");
  if (slides.length < 2) {
    return;
  }
  let index = 0;
  let timer = null;
  const show = (target) => {
    index = (target + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  };
  const stop = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };
  const start = () => {
    stop();
    timer = window.setInterval(() => show(index + 1), 5000);
  };
  previous?.addEventListener("click", () => {
    show(index - 1);
    start();
  });
  next?.addEventListener("click", () => {
    show(index + 1);
    start();
  });
  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      show(dotIndex);
      start();
    });
  });
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  start();
}

function normalizeText(value) {
  return (value || "").toString().trim().toLowerCase();
}

function initFilters() {
  document.querySelectorAll("[data-filter-area]").forEach((area) => {
    const input = area.querySelector("[data-filter='query']");
    const year = area.querySelector("[data-filter='year']");
    const type = area.querySelector("[data-filter='type']");
    const category = area.querySelector("[data-filter='category']");
    const cards = Array.from(area.querySelectorAll("[data-card]"));
    const apply = () => {
      const queryValue = normalizeText(input?.value);
      const yearValue = year?.value || "";
      const typeValue = type?.value || "";
      const categoryValue = category?.value || "";
      cards.forEach((card) => {
        const text = normalizeText(card.getAttribute("data-search"));
        const matchesQuery = !queryValue || text.includes(queryValue);
        const matchesYear = !yearValue || card.getAttribute("data-year") === yearValue;
        const matchesType = !typeValue || card.getAttribute("data-type") === typeValue;
        const matchesCategory = !categoryValue || card.getAttribute("data-category") === categoryValue;
        card.hidden = !(matchesQuery && matchesYear && matchesType && matchesCategory);
      });
    };
    [input, year, type, category].forEach((item) => {
      item?.addEventListener("input", apply);
      item?.addEventListener("change", apply);
    });
  });
}

async function attachStream(video, stream) {
  if (!video || !stream || video.dataset.ready === "1") {
    return;
  }
  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = stream;
  } else if (window.Hls && window.Hls.isSupported()) {
    const hls = new window.Hls({
      enableWorker: true,
      lowLatencyMode: true
    });
    hls.loadSource(stream);
    hls.attachMedia(video);
    video.hlsInstance = hls;
  } else {
    video.src = stream;
  }
  video.dataset.ready = "1";
}

function initPlayers() {
  document.querySelectorAll("[data-player]").forEach((player) => {
    const video = player.querySelector("video");
    const cover = player.querySelector("[data-cover]");
    if (!video || !cover) {
      return;
    }
    const stream = video.getAttribute("data-stream");
    const start = async () => {
      await attachStream(video, stream);
      player.classList.add("is-playing");
      video.setAttribute("controls", "controls");
      try {
        await video.play();
      } catch (error) {
        video.focus();
      }
    };
    cover.addEventListener("click", start);
    video.addEventListener("click", () => {
      if (video.paused) {
        start();
      }
    });
  });
}

ready(() => {
  initMobileMenu();
  initHero();
  initFilters();
  initPlayers();
});
