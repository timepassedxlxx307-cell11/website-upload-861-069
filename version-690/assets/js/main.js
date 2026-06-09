(function () {
    var nav = document.querySelector('.main-nav');
    var toggle = document.querySelector('.menu-toggle');

    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            nav.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var thumbs = Array.prototype.slice.call(document.querySelectorAll('.hero-thumb'));
    var current = 0;
    var timer = null;

    function showSlide(next) {
        if (!slides.length) {
            return;
        }

        current = (next + slides.length) % slides.length;

        slides.forEach(function (slide, index) {
            slide.classList.toggle('active', index === current);
        });

        thumbs.forEach(function (thumb, index) {
            thumb.classList.toggle('active', index === current);
        });
    }

    function startSlider() {
        if (slides.length < 2) {
            return;
        }

        clearInterval(timer);
        timer = setInterval(function () {
            showSlide(current + 1);
        }, 5000);
    }

    var prev = document.querySelector('.hero-prev');
    var next = document.querySelector('.hero-next');

    if (prev) {
        prev.addEventListener('click', function () {
            showSlide(current - 1);
            startSlider();
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            showSlide(current + 1);
            startSlider();
        });
    }

    thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            var target = parseInt(thumb.getAttribute('data-target-slide') || '0', 10);
            showSlide(target);
            startSlider();
        });
    });

    showSlide(0);
    startSlider();

    var filterForms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));

    filterForms.forEach(function (form) {
        var input = form.querySelector('input[type="search"]');
        var scopeId = form.getAttribute('data-filter-scope');
        var scope = document.getElementById(scopeId);
        var cards = scope ? Array.prototype.slice.call(scope.querySelectorAll('.movie-card')) : [];

        function filterCards() {
            var value = (input.value || '').trim().toLowerCase();

            cards.forEach(function (card) {
                var text = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-category') || '',
                    card.getAttribute('data-tags') || '',
                    card.textContent || ''
                ].join(' ').toLowerCase();

                card.classList.toggle('hidden-by-filter', value && text.indexOf(value) === -1);
            });
        }

        if (input) {
            input.addEventListener('input', filterCards);
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            filterCards();
        });
    });

    if (window.SEARCH_DATA) {
        var params = new URLSearchParams(window.location.search);
        var q = (params.get('q') || '').trim();
        var input = document.getElementById('searchInput');
        var results = document.getElementById('searchResults');
        var title = document.getElementById('searchTitle');
        var hint = document.getElementById('searchHint');

        if (input) {
            input.value = q;
        }

        function cardHTML(item) {
            return [
                '<article class="movie-card">',
                '    <a class="poster-link" href="' + item.url + '" aria-label="' + escapeHTML(item.title) + '">',
                '        <img src="' + item.cover + '" alt="' + escapeHTML(item.title) + '" loading="lazy">',
                '        <span class="play-mark">▶</span>',
                '    </a>',
                '    <div class="movie-card-body">',
                '        <div class="movie-meta-line"><span>' + escapeHTML(item.year) + '</span><span>' + escapeHTML(item.region) + '</span><span>' + escapeHTML(item.type) + '</span></div>',
                '        <h3><a href="' + item.url + '">' + escapeHTML(item.title) + '</a></h3>',
                '        <p>' + escapeHTML(item.desc) + '</p>',
                '        <div class="chip-row"><span>' + escapeHTML(item.category) + '</span><span>' + escapeHTML(item.genre) + '</span></div>',
                '    </div>',
                '</article>'
            ].join('\n');
        }

        function escapeHTML(value) {
            return String(value || '').replace(/[&<>"]/g, function (char) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;'
                }[char];
            });
        }

        function runSearch(value) {
            var keyword = String(value || '').trim().toLowerCase();
            var source = window.SEARCH_DATA;
            var matched = keyword ? source.filter(function (item) {
                return [item.title, item.region, item.type, item.year, item.genre, item.tags, item.category, item.desc].join(' ').toLowerCase().indexOf(keyword) !== -1;
            }) : source.slice(0, 36);

            if (title) {
                title.textContent = keyword ? '“' + value + '”相关影片' : '热门影片推荐';
            }

            if (hint) {
                hint.textContent = keyword ? '已为你筛选出相关影片。' : '可通过上方搜索框查找更多内容。';
            }

            if (results) {
                results.innerHTML = matched.slice(0, 120).map(cardHTML).join('\n');
            }
        }

        runSearch(q);
    }
})();
