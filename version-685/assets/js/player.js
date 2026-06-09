import { H as Hls } from "./hls-vendor-dru42stk.js";

document.addEventListener("DOMContentLoaded", function () {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

    players.forEach(function (player) {
        setupPlayer(player);
    });
});

function setupPlayer(player) {
    var video = player.querySelector("video[data-hls-src]");
    var button = player.querySelector("[data-play-button]");
    var note = player.querySelector("[data-player-note]");

    if (!video || !button) {
        return;
    }

    var source = video.getAttribute("data-hls-src");
    var started = false;
    var hlsInstance = null;

    function updateNote(message) {
        if (note) {
            note.textContent = message;
        }
    }

    function playVideo() {
        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () {
                updateNote("浏览器阻止了自动播放，请再次点击视频控件播放。");
            });
        }
    }

    function startPlayer() {
        if (started) {
            playVideo();
            return;
        }

        started = true;
        button.classList.add("is-hidden");
        updateNote("正在加载播放源，请稍候。");

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            video.addEventListener("loadedmetadata", playVideo, { once: true });
            updateNote("已使用浏览器原生 HLS 能力播放。");
            return;
        }

        if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });

            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);

            hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
                updateNote("播放源已加载，正在开始播放。");
                playVideo();
            });

            hlsInstance.on(Hls.Events.ERROR, function (eventName, data) {
                if (data && data.fatal) {
                    updateNote("播放源加载失败，请刷新页面或更换网络后重试。");
                    if (hlsInstance) {
                        hlsInstance.destroy();
                        hlsInstance = null;
                    }
                }
            });

            return;
        }

        video.src = source;
        updateNote("当前浏览器不支持 HLS.js，已尝试直接加载播放源。");
        playVideo();
    }

    button.addEventListener("click", startPlayer);

    video.addEventListener("click", function () {
        if (!started) {
            startPlayer();
        }
    });

    window.addEventListener("pagehide", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
    });
}
