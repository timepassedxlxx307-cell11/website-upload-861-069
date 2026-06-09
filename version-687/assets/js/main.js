(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var mobilePanel = document.querySelector(".mobile-panel");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var previous = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    function startTimer() {
      if (timer) {
        clearInterval(timer);
      }

      timer = setInterval(function () {
        showSlide(index + 1);
      }, 5000);
    }

    if (previous) {
      previous.addEventListener("click", function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showSlide(dotIndex);
        startTimer();
      });
    });

    showSlide(0);
    startTimer();
  }

  var filterForm = document.querySelector("[data-filter-form]");

  if (filterForm) {
    var keywordInput = filterForm.querySelector("[data-filter-keyword]");
    var typeSelect = filterForm.querySelector("[data-filter-type]");
    var regionSelect = filterForm.querySelector("[data-filter-region]");
    var yearSelect = filterForm.querySelector("[data-filter-year]");
    var clearButton = filterForm.querySelector("[data-filter-clear]");
    var emptyState = filterForm.querySelector("[data-empty-state]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-title]"));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";

    if (keywordInput && initialQuery) {
      keywordInput.value = initialQuery;
    }

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function cardText(card) {
      return [
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year,
        card.dataset.genre,
        card.dataset.tags
      ].join(" ").toLowerCase();
    }

    function applyFilters() {
      var keyword = normalize(keywordInput ? keywordInput.value : "");
      var type = normalize(typeSelect ? typeSelect.value : "");
      var region = normalize(regionSelect ? regionSelect.value : "");
      var year = normalize(yearSelect ? yearSelect.value : "");
      var visible = 0;

      cards.forEach(function (card) {
        var text = cardText(card);
        var matched = true;

        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }

        if (type && normalize(card.dataset.type) !== type) {
          matched = false;
        }

        if (region && normalize(card.dataset.region) !== region) {
          matched = false;
        }

        if (year && normalize(card.dataset.year) !== year) {
          matched = false;
        }

        card.hidden = !matched;

        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visible !== 0;
      }
    }

    [keywordInput, typeSelect, regionSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
      }
    });

    if (clearButton) {
      clearButton.addEventListener("click", function () {
        if (keywordInput) {
          keywordInput.value = "";
        }

        if (typeSelect) {
          typeSelect.value = "";
        }

        if (regionSelect) {
          regionSelect.value = "";
        }

        if (yearSelect) {
          yearSelect.value = "";
        }

        applyFilters();
      });
    }

    applyFilters();
  }
})();
