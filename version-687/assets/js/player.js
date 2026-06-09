(function () {
  function setupMoviePlayer(options) {
    var video = document.getElementById(options.videoId);
    var button = document.getElementById(options.buttonId);
    var streamUrl = options.streamUrl;
    var hlsInstance = null;

    if (!video || !button || !streamUrl) {
      return;
    }

    function hideButton() {
      button.classList.add("is-hidden");
    }

    function ensureReady() {
      if (video.dataset.ready === "1") {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        video.dataset.ready = "1";
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        video.dataset.ready = "1";
        return;
      }

      video.src = streamUrl;
      video.dataset.ready = "1";
    }

    function startPlayback() {
      ensureReady();
      hideButton();
      var playPromise = video.play();

      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {});
      }
    }

    button.addEventListener("click", startPlayback);

    video.addEventListener("click", function () {
      if (video.dataset.ready !== "1") {
        startPlayback();
      }
    });

    video.addEventListener("play", hideButton);

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }

  window.setupMoviePlayer = setupMoviePlayer;
})();
