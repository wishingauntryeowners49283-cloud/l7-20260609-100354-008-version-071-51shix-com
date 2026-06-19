(function () {
    "use strict";

    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector(".menu-toggle");
        if (toggle) {
            toggle.addEventListener("click", function () {
                var open = document.body.classList.toggle("nav-open");
                toggle.setAttribute("aria-expanded", open ? "true" : "false");
            });
        }

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("is-active", i === current);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("is-active", i === current);
                    dot.setAttribute("aria-current", i === current ? "true" : "false");
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5000);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    show(index);
                    start();
                });
            });

            hero.addEventListener("mouseenter", stop);
            hero.addEventListener("mouseleave", start);
            show(0);
            start();
        }

        var filterRoot = document.querySelector("[data-filter-root]");
        if (filterRoot) {
            var queryInput = filterRoot.querySelector("[data-filter-query]");
            var regionSelect = filterRoot.querySelector("[data-filter-region]");
            var typeSelect = filterRoot.querySelector("[data-filter-type]");
            var yearSelect = filterRoot.querySelector("[data-filter-year]");
            var cards = Array.prototype.slice.call(filterRoot.querySelectorAll(".filter-card"));
            var empty = filterRoot.querySelector(".empty-state");
            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get("q") || "";

            if (queryInput && initialQuery) {
                queryInput.value = initialQuery;
            }

            function valueOf(control) {
                return control ? String(control.value || "").trim().toLowerCase() : "";
            }

            function filter() {
                var q = valueOf(queryInput);
                var region = valueOf(regionSelect);
                var type = valueOf(typeSelect);
                var year = valueOf(yearSelect);
                var visible = 0;

                cards.forEach(function (card) {
                    var text = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-tags")
                    ].join(" ").toLowerCase();
                    var ok = true;

                    if (q && text.indexOf(q) === -1) {
                        ok = false;
                    }
                    if (region && String(card.getAttribute("data-region") || "").toLowerCase() !== region) {
                        ok = false;
                    }
                    if (type && String(card.getAttribute("data-type") || "").toLowerCase() !== type) {
                        ok = false;
                    }
                    if (year && String(card.getAttribute("data-year") || "").toLowerCase() !== year) {
                        ok = false;
                    }

                    card.style.display = ok ? "" : "none";
                    if (ok) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.style.display = visible ? "none" : "block";
                }
            }

            [queryInput, regionSelect, typeSelect, yearSelect].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", filter);
                    control.addEventListener("change", filter);
                }
            });

            var submit = filterRoot.querySelector("[data-filter-submit]");
            if (submit) {
                submit.addEventListener("click", function (event) {
                    event.preventDefault();
                    filter();
                });
            }

            filter();
        }
    });
})();
