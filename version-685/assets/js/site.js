document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenu();
    setupHeroCarousel();
    setupMovieFilters();
});

function setupMobileMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");

    if (!toggle || !nav) {
        return;
    }

    toggle.addEventListener("click", function () {
        nav.classList.toggle("is-open");
    });
}

function setupHeroCarousel() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));

    if (slides.length === 0) {
        return;
    }

    var currentIndex = 0;
    var timer = null;

    function showSlide(index) {
        currentIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === currentIndex);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === currentIndex);
        });
    }

    function startTimer() {
        if (timer) {
            window.clearInterval(timer);
        }

        timer = window.setInterval(function () {
            showSlide(currentIndex + 1);
        }, 5600);
    }

    dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
            var index = Number(dot.getAttribute("data-hero-dot"));
            showSlide(index);
            startTimer();
        });
    });

    showSlide(0);
    startTimer();
}

function setupMovieFilters() {
    var cardList = document.querySelector("[data-card-list]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var searchInput = document.querySelector("[data-search-input]");
    var typeSelect = document.querySelector("[data-filter-type]");
    var regionSelect = document.querySelector("[data-filter-region]");
    var yearSelect = document.querySelector("[data-filter-year]");
    var categorySelect = document.querySelector("[data-filter-category]");
    var resetButton = document.querySelector("[data-filter-reset]");
    var countTarget = document.querySelector("[data-result-count]");
    var emptyState = document.querySelector("[data-empty-state]");

    if (!cardList || cards.length === 0) {
        return;
    }

    var params = new URLSearchParams(window.location.search);
    var queryFromUrl = params.get("q");

    if (queryFromUrl && searchInput) {
        searchInput.value = queryFromUrl;
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function cardMatches(card, search, type, region, year, category) {
        var keywords = normalize([
            card.dataset.title,
            card.dataset.region,
            card.dataset.type,
            card.dataset.year,
            card.dataset.category,
            card.dataset.keywords
        ].join(" "));

        if (search && keywords.indexOf(search) === -1) {
            return false;
        }

        if (type && normalize(card.dataset.type) !== type) {
            return false;
        }

        if (region && normalize(card.dataset.region) !== region) {
            return false;
        }

        if (year && normalize(card.dataset.year) !== year) {
            return false;
        }

        if (category && normalize(card.dataset.category) !== category) {
            return false;
        }

        return true;
    }

    function applyFilters() {
        var search = normalize(searchInput ? searchInput.value : "");
        var type = normalize(typeSelect ? typeSelect.value : "");
        var region = normalize(regionSelect ? regionSelect.value : "");
        var year = normalize(yearSelect ? yearSelect.value : "");
        var category = normalize(categorySelect ? categorySelect.value : "");
        var visibleCount = 0;

        cards.forEach(function (card) {
            var visible = cardMatches(card, search, type, region, year, category);
            card.hidden = !visible;
            if (visible) {
                visibleCount += 1;
            }
        });

        if (countTarget) {
            countTarget.textContent = String(visibleCount);
        }

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }
    }

    [searchInput, typeSelect, regionSelect, yearSelect, categorySelect].forEach(function (field) {
        if (!field) {
            return;
        }

        field.addEventListener("input", applyFilters);
        field.addEventListener("change", applyFilters);
    });

    if (resetButton) {
        resetButton.addEventListener("click", function () {
            if (searchInput) {
                searchInput.value = "";
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
            if (categorySelect) {
                categorySelect.value = "";
            }
            applyFilters();
        });
    }

    applyFilters();
}
