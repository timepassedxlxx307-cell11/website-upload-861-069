(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('.player-shell'));

    players.forEach(function (shell) {
        var video = shell.querySelector('.js-player');
        var button = shell.querySelector('.js-player-start');
        var source = shell.getAttribute('data-video-url');
        var hls = null;
        var prepared = false;

        function prepare() {
            if (!video || !source || prepared) {
                return;
            }

            prepared = true;

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else {
                video.src = source;
            }
        }

        function play() {
            prepare();
            shell.classList.add('playing');
            var action = video.play();

            if (action && typeof action.catch === 'function') {
                action.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener('click', play);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (!prepared || video.paused) {
                    play();
                }
            });

            video.addEventListener('play', function () {
                shell.classList.add('playing');
            });

            video.addEventListener('ended', function () {
                shell.classList.remove('playing');
            });
        }
    });
})();
