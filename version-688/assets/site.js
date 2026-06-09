(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function initMenu() {
        var button = document.querySelector('[data-menu-button]');
        var menu = document.querySelector('[data-mobile-menu]');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            menu.classList.toggle('open');
        });
    }

    function initHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = selectAll('[data-hero-slide]', hero);
        var dots = selectAll('[data-hero-dot]', hero);
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function play() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                play();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                play();
            });
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                play();
            });
        });
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', play);
        show(0);
        play();
    }

    function initFilters() {
        selectAll('[data-filter-form]').forEach(function (form) {
            var container = document.querySelector(form.getAttribute('data-target'));
            var empty = document.querySelector(form.getAttribute('data-empty'));
            if (!container) {
                return;
            }
            var cards = selectAll('.movie-card', container);
            var keywordInput = form.querySelector('[name="keyword"]');
            var regionInput = form.querySelector('[name="region"]');
            var yearInput = form.querySelector('[name="year"]');

            function apply() {
                var keyword = (keywordInput && keywordInput.value || '').trim().toLowerCase();
                var region = regionInput && regionInput.value || '';
                var year = yearInput && yearInput.value || '';
                var visible = 0;
                cards.forEach(function (card) {
                    var title = (card.getAttribute('data-title') || '').toLowerCase();
                    var genre = (card.getAttribute('data-genre') || '').toLowerCase();
                    var cardRegion = card.getAttribute('data-region') || '';
                    var cardYear = card.getAttribute('data-year') || '';
                    var matchKeyword = !keyword || title.indexOf(keyword) !== -1 || genre.indexOf(keyword) !== -1;
                    var matchRegion = !region || cardRegion === region;
                    var matchYear = !year || cardYear === year;
                    var show = matchKeyword && matchRegion && matchYear;
                    card.style.display = show ? '' : 'none';
                    if (show) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('show', visible === 0);
                }
            }

            form.addEventListener('submit', function (event) {
                event.preventDefault();
                apply();
            });
            [keywordInput, regionInput, yearInput].forEach(function (input) {
                if (input) {
                    input.addEventListener('input', apply);
                    input.addEventListener('change', apply);
                }
            });
            apply();
        });
    }

    function initPlayers() {
        selectAll('[data-player]').forEach(function (player) {
            var video = player.querySelector('video');
            var overlay = player.querySelector('[data-play-overlay]');
            var stream = player.getAttribute('data-stream');
            var ready = false;
            var hls = null;
            if (!video || !stream) {
                return;
            }

            function bind() {
                if (ready) {
                    return;
                }
                ready = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls();
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                } else {
                    video.src = stream;
                }
            }

            function start() {
                bind();
                video.setAttribute('controls', 'controls');
                if (overlay) {
                    overlay.classList.add('hidden');
                }
                var action = video.play();
                if (action && action.catch) {
                    action.catch(function () {});
                }
            }

            if (overlay) {
                overlay.addEventListener('click', start);
            }
            video.addEventListener('click', function () {
                if (!ready) {
                    start();
                }
            });
            video.addEventListener('ended', function () {
                if (hls && hls.destroy) {
                    hls.destroy();
                    hls = null;
                    ready = false;
                }
            });
        });
    }

    function initSearch() {
        var form = document.querySelector('[data-search-form]');
        var results = document.querySelector('[data-search-results]');
        if (!form || !results || !window.SEARCH_MOVIES) {
            return;
        }
        var input = form.querySelector('[name="q"]');
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';
        if (input && initial) {
            input.value = initial;
        }

        function card(movie) {
            return [
                '<article class="search-result-card">',
                '<a href="./' + movie.file + '"><img src="' + movie.cover + '" alt="' + movie.title.replace(/"/g, '&quot;') + '"></a>',
                '<div>',
                '<div class="movie-meta-line"><span>' + movie.year + '</span><span>' + movie.region + '</span><span>' + movie.genre + '</span></div>',
                '<h2><a href="./' + movie.file + '">' + movie.title + '</a></h2>',
                '<p>' + movie.summary + '</p>',
                '</div>',
                '</article>'
            ].join('');
        }

        function render() {
            var keyword = (input && input.value || '').trim().toLowerCase();
            var pool = window.SEARCH_MOVIES;
            var matched = pool.filter(function (movie) {
                if (!keyword) {
                    return true;
                }
                return [movie.title, movie.region, movie.genre, movie.tags, movie.summary]
                    .join(' ')
                    .toLowerCase()
                    .indexOf(keyword) !== -1;
            }).slice(0, 120);
            results.innerHTML = matched.length ? matched.map(card).join('') : '<div class="empty-state show">没有找到匹配内容</div>';
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            render();
        });
        if (input) {
            input.addEventListener('input', render);
        }
        render();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initHero();
        initFilters();
        initPlayers();
        initSearch();
    });
})();
