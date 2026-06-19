(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var next = parseInt(dot.getAttribute("data-hero-dot"), 10);
        show(Number.isNaN(next) ? 0 : next);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function fillSelect(select, values) {
    if (!select) {
      return;
    }
    values.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function clean(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initSearch() {
    var page = document.querySelector("[data-search-page]");
    if (!page || typeof MOVIES === "undefined" || !Array.isArray(MOVIES)) {
      return;
    }

    var form = page.querySelector("[data-search-form]");
    var input = page.querySelector("#search-keyword");
    var region = page.querySelector("#search-region");
    var type = page.querySelector("#search-type");
    var year = page.querySelector("#search-year");
    var results = page.querySelector("[data-search-results]");
    var status = page.querySelector("[data-search-status]");

    var params = new URLSearchParams(window.location.search);
    var q = params.get("q") || "";
    if (input) {
      input.value = q;
    }

    var regions = Array.from(new Set(MOVIES.map(function (movie) { return movie.region; }).filter(Boolean))).sort();
    var types = Array.from(new Set(MOVIES.map(function (movie) { return movie.type; }).filter(Boolean))).sort();
    var years = Array.from(new Set(MOVIES.map(function (movie) { return movie.year; }).filter(Boolean))).sort().reverse();
    fillSelect(region, regions);
    fillSelect(type, types);
    fillSelect(year, years);

    function movieMatches(movie, keyword) {
      var text = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.oneLine, (movie.tags || []).join(" ")].join(" ").toLowerCase();
      return !keyword || text.indexOf(keyword) !== -1;
    }

    function render() {
      var keyword = (input && input.value ? input.value.trim().toLowerCase() : "");
      var regionValue = region ? region.value : "";
      var typeValue = type ? type.value : "";
      var yearValue = year ? year.value : "";
      var filtered = MOVIES.filter(function (movie) {
        return movieMatches(movie, keyword) &&
          (!regionValue || movie.region === regionValue) &&
          (!typeValue || movie.type === typeValue) &&
          (!yearValue || movie.year === yearValue);
      });
      var visible = filtered.slice(0, 120);
      if (status) {
        status.textContent = filtered.length ? "找到 " + filtered.length + " 个匹配结果" : "未找到匹配结果，请更换关键词或筛选条件";
      }
      if (!results) {
        return;
      }
      results.innerHTML = visible.map(function (movie) {
        var tags = [movie.genre, movie.region + " · " + movie.type].filter(Boolean);
        return "<article class=\"movie-card\">" +
          "<a class=\"card-link\" href=\"" + clean(movie.href) + "\" title=\"" + clean(movie.title) + " 在线观看\">" +
          "<span class=\"poster-wrap\"><img src=\"" + clean(movie.cover) + "\" alt=\"" + clean(movie.title) + "\" loading=\"lazy\"><span class=\"play-float\"><span class=\"play-pill\">▶</span></span><span class=\"year-badge\">" + clean(movie.year) + "</span></span>" +
          "<span class=\"card-body\"><span class=\"card-meta\"><span class=\"meta-pill\">" + clean(tags[0] || "影视") + "</span><span>" + clean(tags[1] || "") + "</span></span>" +
          "<h3 class=\"card-title\">" + clean(movie.title) + "</h3><p class=\"card-desc\">" + clean(movie.oneLine || "") + "</p></span>" +
          "</a></article>";
      }).join("");
    }

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        render();
      });
    }

    [input, region, type, year].forEach(function (element) {
      if (element) {
        element.addEventListener("input", render);
        element.addEventListener("change", render);
      }
    });

    render();
  }

  ready(function () {
    initMenu();
    initHero();
    initSearch();
  });
})();
