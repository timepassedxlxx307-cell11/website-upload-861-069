(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function initMobileMenu() {
        var button = qs('[data-mobile-toggle]');
        var panel = qs('[data-mobile-panel]');
        if (!button || !panel) {
            return;
        }
        button.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    function initHero() {
        var hero = qs('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = qsa('[data-hero-slide]', hero);
        var dots = qsa('[data-hero-dot]', hero);
        var prev = qs('[data-hero-prev]', hero);
        var next = qs('[data-hero-next]', hero);
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                start();
            });
        });
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function initFilters() {
        qsa('[data-card-filter]').forEach(function (input) {
            var target = document.getElementById(input.getAttribute('data-card-filter'));
            var empty = qs('[data-empty-state]');
            if (!target) {
                return;
            }
            var cards = qsa('[data-card]', target);
            function applyFilter() {
                var keyword = input.value.trim().toLowerCase();
                var visibleCount = 0;
                cards.forEach(function (card) {
                    var text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
                    var visible = !keyword || text.indexOf(keyword) !== -1;
                    card.style.display = visible ? '' : 'none';
                    if (visible) {
                        visibleCount += 1;
                    }
                });
                if (empty) {
                    empty.style.display = visibleCount ? 'none' : 'block';
                }
            }
            input.addEventListener('input', applyFilter);
            var query = new URLSearchParams(window.location.search).get('q');
            if (query) {
                input.value = query;
            }
            applyFilter();
        });
    }

    function initPlayers() {
        qsa('[data-player]').forEach(function (player) {
            var video = qs('video', player);
            var button = qs('[data-play-button]', player);
            if (!video) {
                return;
            }
            var source = video.getAttribute('data-src');
            var initialized = false;

            function loadAndPlay() {
                if (button) {
                    button.classList.add('is-hidden');
                }
                if (!initialized && source) {
                    if (window.Hls && window.Hls.isSupported()) {
                        var hls = new window.Hls({ enableWorker: true });
                        hls.loadSource(source);
                        hls.attachMedia(video);
                    } else {
                        video.src = source;
                    }
                    initialized = true;
                }
                var promise = video.play();
                if (promise && typeof promise.catch === 'function') {
                    promise.catch(function () {});
                }
            }

            if (button) {
                button.addEventListener('click', loadAndPlay);
            }
            video.addEventListener('click', loadAndPlay);
            video.addEventListener('play', function () {
                if (button) {
                    button.classList.add('is-hidden');
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMobileMenu();
        initHero();
        initFilters();
        initPlayers();
    });
})();
