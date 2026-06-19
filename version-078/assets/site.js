(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function text(value) {
    return String(value == null ? '' : value).toLowerCase();
  }

  function htmlEscape(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = selectAll('[data-hero-slide]', hero);
    var dots = selectAll('[data-hero-dot]', hero);
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }
    function start() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(current + 1);
      }, 5000);
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
        start();
      });
    });
    show(0);
    start();
  }

  function setupPageFilter() {
    var list = document.querySelector('[data-filter-list]');
    if (!list) {
      return;
    }
    var input = document.querySelector('[data-filter-input]');
    var year = document.querySelector('[data-filter-year]');
    var type = document.querySelector('[data-filter-type]');
    var items = selectAll('.searchable-item', list);
    function apply() {
      var keyword = text(input && input.value);
      var yearValue = year && year.value;
      var typeValue = text(type && type.value);
      items.forEach(function (item) {
        var haystack = text([
          item.getAttribute('data-title'),
          item.getAttribute('data-region'),
          item.getAttribute('data-type'),
          item.getAttribute('data-tags'),
          item.getAttribute('data-year')
        ].join(' '));
        var yearOk = !yearValue || item.getAttribute('data-year') === yearValue;
        var typeOk = !typeValue || text(item.getAttribute('data-type')) === typeValue;
        var keywordOk = !keyword || haystack.indexOf(keyword) !== -1;
        item.style.display = yearOk && typeOk && keywordOk ? '' : 'none';
      });
    }
    [input, year, type].forEach(function (el) {
      if (el) {
        el.addEventListener('input', apply);
        el.addEventListener('change', apply);
      }
    });
  }

  function createOption(value) {
    var option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    return option;
  }

  function setupSearch() {
    var results = document.querySelector('[data-search-results]');
    var input = document.querySelector('[data-search-input]');
    var form = document.querySelector('[data-search-form]');
    var typeSelect = document.querySelector('[data-search-type]');
    var yearSelect = document.querySelector('[data-search-year]');
    var regionSelect = document.querySelector('[data-search-region]');
    if (!results || !input || !window.MOVIES) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    input.value = initial;
    var types = [];
    var years = [];
    var regions = [];
    window.MOVIES.forEach(function (movie) {
      if (movie.type && types.indexOf(movie.type) === -1) {
        types.push(movie.type);
      }
      if (movie.year && years.indexOf(String(movie.year)) === -1) {
        years.push(String(movie.year));
      }
      if (movie.region && regions.indexOf(movie.region) === -1) {
        regions.push(movie.region);
      }
    });
    types.sort().slice(0, 60).forEach(function (value) {
      typeSelect.appendChild(createOption(value));
    });
    years.sort(function (a, b) { return Number(b) - Number(a); }).slice(0, 40).forEach(function (value) {
      yearSelect.appendChild(createOption(value));
    });
    regions.sort().slice(0, 80).forEach(function (value) {
      regionSelect.appendChild(createOption(value));
    });
    function render() {
      var keyword = text(input.value);
      var typeValue = typeSelect.value;
      var yearValue = yearSelect.value;
      var regionValue = regionSelect.value;
      var matched = window.MOVIES.filter(function (movie) {
        var haystack = text([movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags, movie.oneLine].join(' '));
        var keywordOk = !keyword || haystack.indexOf(keyword) !== -1;
        var typeOk = !typeValue || movie.type === typeValue;
        var yearOk = !yearValue || String(movie.year) === yearValue;
        var regionOk = !regionValue || movie.region === regionValue;
        return keywordOk && typeOk && yearOk && regionOk;
      }).slice(0, 120);
      if (!matched.length) {
        results.innerHTML = '<div class="detail-block"><h2>暂无匹配内容</h2><p>可以尝试更换片名、类型、年份或地区继续搜索。</p></div>';
        return;
      }
      results.innerHTML = matched.map(function (movie) {
        var meta = [movie.year, movie.region, movie.type, movie.genre].filter(Boolean).map(function (item) {
          return '<span>' + htmlEscape(item) + '</span>';
        }).join('');
        var tags = (movie.tags || []).slice(0, 3).map(function (item) {
          return '<span>' + htmlEscape(item) + '</span>';
        }).join('');
        return '<a class="movie-card" href="' + htmlEscape(movie.url) + '">' +
          '<span class="poster-wrap">' +
          '<img src="' + htmlEscape(movie.cover) + '" alt="' + htmlEscape(movie.title) + '" loading="lazy">' +
          '<span class="play-mark">▶</span>' +
          '<span class="score-badge">热度 ' + htmlEscape(movie.score) + '</span>' +
          '</span>' +
          '<span class="card-body">' +
          '<strong>' + htmlEscape(movie.title) + '</strong>' +
          '<em>' + htmlEscape(movie.oneLine) + '</em>' +
          '<span class="meta-line">' + meta + '</span>' +
          '<span class="tag-line">' + tags + '</span>' +
          '</span>' +
          '</a>';
      }).join('');
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      render();
    });
    [input, typeSelect, yearSelect, regionSelect].forEach(function (el) {
      el.addEventListener('input', render);
      el.addEventListener('change', render);
    });
    render();
  }

  window.initHlsPlayer = function (videoId, coverId, stream) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    if (!video || !stream) {
      return;
    }
    var ready = false;
    function attach() {
      if (ready) {
        return;
      }
      ready = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls();
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    }
    function start() {
      attach();
      if (cover) {
        cover.classList.add('is-hidden');
      }
      var play = video.play();
      if (play && typeof play.catch === 'function') {
        play.catch(function () {});
      }
    }
    if (cover) {
      cover.addEventListener('click', start);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupPageFilter();
    setupSearch();
  });
})();
