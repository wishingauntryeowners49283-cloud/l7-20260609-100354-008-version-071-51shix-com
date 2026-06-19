(function () {
    function onReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");

        if (!button || !nav) {
            return;
        }

        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");

        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }

            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                restart();
            });
        }

        restart();
    }

    function setupSearch() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input]"));

        inputs.forEach(function (input) {
            var targetSelector = input.getAttribute("data-search-target");
            var target = targetSelector ? document.querySelector(targetSelector) : document;

            if (!target) {
                return;
            }

            var cards = Array.prototype.slice.call(target.querySelectorAll("[data-card], .sitemap-links a"));

            input.addEventListener("input", function () {
                var keyword = input.value.trim().toLowerCase();

                cards.forEach(function (card) {
                    var source = card.getAttribute("data-search-text") || card.textContent || "";
                    card.classList.toggle("is-hidden", keyword.length > 0 && source.toLowerCase().indexOf(keyword) === -1);
                });
            });
        });
    }

    function setupPlayers() {
        var shells = Array.prototype.slice.call(document.querySelectorAll("[data-video-player]"));

        shells.forEach(function (shell) {
            var video = shell.querySelector("video");
            var curtain = shell.querySelector("[data-play-curtain]");
            var button = shell.querySelector("[data-play-button]");
            var prepared = false;
            var hlsInstance = null;

            if (!video) {
                return;
            }

            function prepare() {
                var stream = video.getAttribute("data-stream");

                if (prepared || !stream) {
                    return;
                }

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                    prepared = true;
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(stream);
                    hlsInstance.attachMedia(video);
                    prepared = true;
                    return;
                }

                video.src = stream;
                prepared = true;
            }

            function start() {
                prepare();

                if (curtain) {
                    curtain.classList.add("is-hidden");
                }

                video.controls = true;

                var attempt = video.play();

                if (attempt && typeof attempt.catch === "function") {
                    attempt.catch(function () {});
                }
            }

            if (curtain) {
                curtain.addEventListener("click", start);
            }

            if (button) {
                button.addEventListener("click", start);
            }

            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                }
            });

            window.addEventListener("beforeunload", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        });
    }

    onReady(function () {
        setupMenu();
        setupHero();
        setupSearch();
        setupPlayers();
    });
})();
