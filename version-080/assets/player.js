(function () {
    "use strict";

    function loadHls() {
        if (window.Hls) {
            return Promise.resolve(window.Hls);
        }
        return new Promise(function (resolve, reject) {
            var script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js";
            script.onload = function () {
                resolve(window.Hls);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    window.initMoviePlayer = function (options) {
        var video = document.querySelector(options.selector);
        var cover = document.querySelector(options.coverSelector);
        var button = document.querySelector(options.buttonSelector);
        var source = options.source;
        var attached = false;
        var attachPromise = null;

        if (!video || !source) {
            return;
        }

        function attach() {
            if (attachPromise) {
                return attachPromise;
            }

            attachPromise = new Promise(function (resolve) {
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                    attached = true;
                    resolve();
                    return;
                }

                loadHls().then(function (Hls) {
                    if (Hls && Hls.isSupported()) {
                        var hls = new Hls({
                            enableWorker: true,
                            lowLatencyMode: true
                        });
                        hls.loadSource(source);
                        hls.attachMedia(video);
                        hls.on(Hls.Events.MANIFEST_PARSED, function () {
                            attached = true;
                            resolve();
                        });
                        hls.on(Hls.Events.ERROR, function () {
                            if (!attached) {
                                video.src = source;
                                attached = true;
                                resolve();
                            }
                        });
                    } else {
                        video.src = source;
                        attached = true;
                        resolve();
                    }
                }).catch(function () {
                    video.src = source;
                    attached = true;
                    resolve();
                });
            });

            return attachPromise;
        }

        function showVideo() {
            if (cover) {
                cover.classList.add("is-hidden");
            }
            video.controls = true;
        }

        function start() {
            showVideo();
            attach().then(function () {
                var playPromise = video.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch(function () {
                        video.controls = true;
                    });
                }
            });
        }

        attach();

        if (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                start();
            });
        }

        if (cover) {
            cover.addEventListener("click", function () {
                start();
            });
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
    };
})();
