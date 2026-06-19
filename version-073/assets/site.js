(function () {
  var navToggle = document.querySelector("[data-nav-toggle]");
  var mainNav = document.querySelector("[data-main-nav]");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      mainNav.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;

    function showHero(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        showHero(current - 1);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showHero(current + 1);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showHero(Number(dot.getAttribute("data-hero-dot")) || 0);
      });
    });

    window.setInterval(function () {
      showHero(current + 1);
    }, 5000);
  }

  var filterBoxes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-box]"));

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  filterBoxes.forEach(function (box) {
    var scope = box.parentElement || document;
    var searchInput = box.querySelector(".js-search");
    var typeFilter = box.querySelector(".js-type-filter");
    var regionFilter = box.querySelector(".js-region-filter");
    var yearFilter = box.querySelector(".js-year-filter");
    var items = Array.prototype.slice.call(scope.querySelectorAll(".filter-item"));

    function applyFilters() {
      var keyword = normalize(searchInput && searchInput.value);
      var typeValue = normalize(typeFilter && typeFilter.value);
      var regionValue = normalize(regionFilter && regionFilter.value);
      var yearValue = normalize(yearFilter && yearFilter.value);

      items.forEach(function (item) {
        var text = normalize(item.getAttribute("data-search"));
        var title = normalize(item.getAttribute("data-title"));
        var type = normalize(item.getAttribute("data-type"));
        var region = normalize(item.getAttribute("data-region"));
        var year = normalize(item.getAttribute("data-year"));
        var keywordOk = !keyword || text.indexOf(keyword) > -1 || title.indexOf(keyword) > -1;
        var typeOk = !typeValue || type === typeValue;
        var regionOk = !regionValue || region === regionValue;
        var yearOk = !yearValue || year === yearValue;

        item.classList.toggle("is-hidden", !(keywordOk && typeOk && regionOk && yearOk));
      });
    }

    [searchInput, typeFilter, regionFilter, yearFilter].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
      }
    });
  });
})();
