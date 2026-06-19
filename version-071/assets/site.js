(function () {
    function ready(callback) {
        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

    ready(function () {
        var menuButton = document.querySelector('[data-mobile-toggle]');
        var menu = document.querySelector('[data-mobile-menu]');
        var searchButton = document.querySelector('[data-search-toggle]');
        var searchPanel = document.querySelector('[data-search-panel]');

        if (menuButton && menu) {
            menuButton.addEventListener('click', function () {
                menu.classList.toggle('is-open');
            });
        }

        if (searchButton && searchPanel) {
            searchButton.addEventListener('click', function () {
                searchPanel.classList.toggle('is-open');
                var input = searchPanel.querySelector('input');
                if (input) {
                    input.focus();
                }
            });
        }

        var hero = document.querySelector('[data-hero]');
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
            var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
            var index = 0;
            var timer = null;

            function show(next) {
                index = (next + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle('is-active', i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle('is-active', i === index);
                });
            }

            function start() {
                if (timer) {
                    clearInterval(timer);
                }
                timer = setInterval(function () {
                    show(index + 1);
                }, 5200);
            }

            dots.forEach(function (dot, i) {
                dot.addEventListener('click', function () {
                    show(i);
                    start();
                });
            });

            show(0);
            start();
        }

        var filterInput = document.querySelector('[data-movie-filter]');
        var filterCount = document.querySelector('[data-filter-count]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

        if (filterInput && cards.length) {
            var update = function () {
                var keyword = filterInput.value.trim().toLowerCase();
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = (card.getAttribute('data-search') || '').toLowerCase();
                    var matched = !keyword || haystack.indexOf(keyword) !== -1;
                    card.classList.toggle('hidden-by-filter', !matched);
                    if (matched) {
                        visible += 1;
                    }
                });

                if (filterCount) {
                    filterCount.textContent = keyword ? '已筛选：' + visible + ' 部' : '输入关键词快速筛选片库';
                }
            };

            filterInput.addEventListener('input', update);
            update();
        }
    });
}());
