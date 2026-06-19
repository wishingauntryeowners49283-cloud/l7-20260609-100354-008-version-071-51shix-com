(function () {
  function bootPlayer(source, videoId, buttonId, layerId) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var layer = document.getElementById(layerId);
    var hlsInstance = null;

    if (!video || !source) {
      return;
    }

    function attachMedia() {
      if (layer) {
        layer.classList.add("is-hidden");
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        if (!video.getAttribute("src")) {
          video.setAttribute("src", source);
        }
      } else if (window.Hls && window.Hls.isSupported()) {
        if (!hlsInstance) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        }
      } else if (!video.getAttribute("src")) {
        video.setAttribute("src", source);
      }

      video.controls = true;
      var playResult = video.play();

      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", attachMedia);
    }

    if (layer) {
      layer.addEventListener("click", attachMedia);
    }

    video.addEventListener("click", function () {
      if (!video.getAttribute("src") && !hlsInstance) {
        attachMedia();
      }
    });
  }

  window.bootPlayer = bootPlayer;
})();
