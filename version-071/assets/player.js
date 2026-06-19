(function () {
    function boot(root) {
        var video = root.querySelector('video');
        var start = root.querySelector('.player-start');
        var poster = root.querySelector('.player-poster');
        var stream = video ? video.getAttribute('data-stream') : '';
        var loaded = false;

        if (!video || !stream) {
            return;
        }

        function load() {
            if (loaded) {
                return;
            }
            loaded = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                root._hls = hls;
                return;
            }

            video.src = stream;
        }

        function play() {
            load();
            root.classList.add('is-playing');
            video.setAttribute('controls', 'controls');
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        if (start) {
            start.addEventListener('click', play);
        }
        if (poster) {
            poster.addEventListener('click', play);
        }
        video.addEventListener('click', function () {
            if (!root.classList.contains('is-playing')) {
                play();
            }
        });
    }

    function ready() {
        Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(boot);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ready);
    } else {
        ready();
    }
}());
