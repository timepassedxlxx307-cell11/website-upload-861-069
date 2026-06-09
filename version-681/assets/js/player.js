(function () {
    var ready = function (callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    };

    ready(function () {
        var boxes = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

        boxes.forEach(function (box) {
            var video = box.querySelector("video");
            var button = box.querySelector(".player-cover");
            var stream = video ? video.getAttribute("data-stream") : "";
            var hls = null;

            if (!video || !button || !stream) {
                return;
            }

            var attach = function () {
                if (video.getAttribute("data-ready") === "1") {
                    return;
                }

                video.setAttribute("data-ready", "1");

                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                } else {
                    video.src = stream;
                }
            };

            var start = function () {
                attach();
                box.classList.add("is-playing");
                button.setAttribute("hidden", "hidden");
                var promise = video.play();
                if (promise && promise.catch) {
                    promise.catch(function () {
                        button.removeAttribute("hidden");
                        box.classList.remove("is-playing");
                    });
                }
            };

            button.addEventListener("click", start);
            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                }
            });
            video.addEventListener("play", function () {
                box.classList.add("is-playing");
                button.setAttribute("hidden", "hidden");
            });
            window.addEventListener("pagehide", function () {
                if (hls) {
                    hls.destroy();
                }
            });
        });
    });
})();
