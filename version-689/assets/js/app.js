
(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  ready(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');
    if (menuButton && mobilePanel) {
      menuButton.addEventListener('click', function () {
        mobilePanel.classList.toggle('open');
      });
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = form.querySelector('input[name="q"]');
        if (!input || !input.value.trim()) {
          event.preventDefault();
          input && input.focus();
        }
      });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var index = 0;
      var timer = null;
      var show = function (next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === index);
        });
      };
      var play = function () {
        clearInterval(timer);
        timer = setInterval(function () {
          show(index + 1);
        }, 5000);
      };
      var previous = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');
      previous && previous.addEventListener('click', function () {
        show(index - 1);
        play();
      });
      next && next.addEventListener('click', function () {
        show(index + 1);
        play();
      });
      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          show(Number(dot.getAttribute('data-hero-dot')));
          play();
        });
      });
      play();
    }

    function filterCards(scope, query) {
      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
      var empty = scope.querySelector('[data-empty-state]');
      var q = normalize(query);
      var visible = 0;
      cards.forEach(function (card) {
        var text = normalize(card.textContent + ' ' + (card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-tags') || '') + ' ' + (card.getAttribute('data-region') || '') + ' ' + (card.getAttribute('data-year') || ''));
        var match = !q || text.indexOf(q) !== -1;
        card.style.display = match ? '' : 'none';
        if (match) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
      var input = scope.querySelector('[data-card-filter]');
      if (input) {
        input.addEventListener('input', function () {
          filterCards(scope, input.value);
        });
      }
    });

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    var searchInput = document.querySelector('[data-search-input]');
    if (searchInput && initialQuery) {
      searchInput.value = initialQuery;
    }
    var searchPage = document.querySelector('[data-search-page]');
    if (searchPage) {
      var filterInput = searchPage.querySelector('[data-card-filter]');
      if (filterInput && initialQuery) {
        filterInput.value = initialQuery;
      }
      filterCards(searchPage, initialQuery);
      if (searchInput) {
        searchInput.addEventListener('input', function () {
          if (filterInput) {
            filterInput.value = searchInput.value;
          }
          filterCards(searchPage, searchInput.value);
        });
      }
    }

    document.querySelectorAll('.movie-player').forEach(function (player) {
      var video = player.querySelector('video');
      var cover = player.querySelector('.player-cover');
      var stream = player.getAttribute('data-stream');
      var started = false;
      var hls = null;
      var start = function () {
        if (!video || !stream) {
          return;
        }
        player.classList.add('is-playing');
        if (!started) {
          started = true;
          if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({ autoStartLoad: true });
            hls.loadSource(stream);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
              video.play().catch(function () {});
            });
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
            video.play().catch(function () {});
          } else {
            video.src = stream;
            video.play().catch(function () {});
          }
        } else {
          video.play().catch(function () {});
        }
      };
      if (cover) {
        cover.addEventListener('click', start);
      }
      if (video) {
        video.addEventListener('click', function () {
          if (!started) {
            start();
          }
        });
      }
      window.addEventListener('beforeunload', function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  });
})();
