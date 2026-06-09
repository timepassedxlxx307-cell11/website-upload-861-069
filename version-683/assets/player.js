(function () {
    function onReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    onReady(function () {
        var video = document.getElementById("movie-player");
        var cover = document.querySelector("[data-player-cover]");
        var config = document.getElementById("player-config");
        var startButtons = Array.prototype.slice.call(document.querySelectorAll("[data-start-player]"));

        if (!video || !config) {
            return;
        }

        var source = "";
        var loaded = false;
        var hls = null;

        try {
            source = JSON.parse(config.textContent || "{}").videoUrl || "";
        } catch (error) {
            source = "";
        }

        function attachSource() {
            if (loaded || !source) {
                return;
            }

            loaded = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function playVideo() {
            attachSource();

            if (cover) {
                cover.classList.add("is-hidden");
            }

            video.controls = true;
            var promise = video.play();

            if (promise && promise.catch) {
                promise.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener("click", playVideo);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            }
        });

        startButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                window.setTimeout(playVideo, 120);
            });
        });

        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();
