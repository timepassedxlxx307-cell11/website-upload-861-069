(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function applyFilters(scope) {
    var root = scope || document;
    var input = root.querySelector("[data-filter-input]");
    var year = root.querySelector("[data-filter-year]");
    var region = root.querySelector("[data-filter-region]");
    var cards = root.querySelectorAll(".movie-card");
    var empty = root.querySelector("[data-empty-result]");
    var keyword = normalize(input && input.value);
    var yearValue = normalize(year && year.value);
    var regionValue = normalize(region && region.value);
    var shown = 0;

    cards.forEach(function (card) {
      var text = normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-tags"),
        card.getAttribute("data-region"),
        card.getAttribute("data-year")
      ].join(" "));
      var okKeyword = !keyword || text.indexOf(keyword) !== -1;
      var okYear = !yearValue || normalize(card.getAttribute("data-year")) === yearValue;
      var okRegion = !regionValue || normalize(card.getAttribute("data-region")).indexOf(regionValue) !== -1;
      var visible = okKeyword && okYear && okRegion;
      card.style.display = visible ? "" : "none";
      if (visible) {
        shown += 1;
      }
    });

    if (empty) {
      empty.classList.toggle("show", shown === 0);
    }
  }

  function initFilters() {
    document.querySelectorAll("[data-filter-area]").forEach(function (area) {
      area.querySelectorAll("[data-filter-input], [data-filter-year], [data-filter-region]").forEach(function (control) {
        control.addEventListener("input", function () {
          applyFilters(area);
        });
        control.addEventListener("change", function () {
          applyFilters(area);
        });
      });
      var params = new URLSearchParams(window.location.search);
      var keyword = params.get("keyword") || params.get("q");
      var input = area.querySelector("[data-filter-input]");
      if (keyword && input) {
        input.value = keyword;
        applyFilters(area);
      }
    });
  }

  function initSearchForms() {
    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input");
        var keyword = input ? input.value.trim() : "";
        var target = form.getAttribute("data-search-target") || "all.html";
        if (keyword) {
          window.location.href = target + "?keyword=" + encodeURIComponent(keyword);
        } else {
          window.location.href = target;
        }
      });
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var thumbs = Array.prototype.slice.call(hero.querySelectorAll(".hero-thumb"));
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      thumbs.forEach(function (thumb, i) {
        thumb.classList.toggle("active", i === index);
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

    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener("click", function () {
        show(i);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initMobileMenu() {
    var button = document.querySelector("[data-mobile-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
  }

  ready(function () {
    initMobileMenu();
    initSearchForms();
    initFilters();
    initHero();
  });
})();
