(function () {
    function onReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    onReady(function () {
        var menuButton = document.querySelector("[data-menu-toggle]");
        var mobilePanel = document.querySelector("[data-mobile-panel]");

        if (menuButton && mobilePanel) {
            menuButton.addEventListener("click", function () {
                mobilePanel.classList.toggle("is-open");
            });
        }

        var hero = document.querySelector("[data-hero]");

        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var prev = hero.querySelector("[data-hero-prev]");
            var next = hero.querySelector("[data-hero-next]");
            var activeIndex = 0;
            var timer = null;

            function showSlide(index) {
                if (!slides.length) {
                    return;
                }

                activeIndex = (index + slides.length) % slides.length;

                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === activeIndex);
                });

                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === activeIndex);
                });
            }

            function nextSlide() {
                showSlide(activeIndex + 1);
            }

            function prevSlide() {
                showSlide(activeIndex - 1);
            }

            function restartTimer() {
                if (timer) {
                    clearInterval(timer);
                }

                timer = setInterval(nextSlide, 5000);
            }

            if (next) {
                next.addEventListener("click", function () {
                    nextSlide();
                    restartTimer();
                });
            }

            if (prev) {
                prev.addEventListener("click", function () {
                    prevSlide();
                    restartTimer();
                });
            }

            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    var index = Number(dot.getAttribute("data-hero-dot"));
                    showSlide(index);
                    restartTimer();
                });
            });

            restartTimer();
        }

        var filterBar = document.querySelector("[data-filter-bar]");
        var filterList = document.querySelector("[data-filter-list]");

        if (filterBar && filterList) {
            var input = filterBar.querySelector(".page-filter-input");
            var chips = Array.prototype.slice.call(filterBar.querySelectorAll("[data-filter-value]"));
            var cards = Array.prototype.slice.call(filterList.querySelectorAll(".movie-card"));
            var activeChip = "";
            var query = "";
            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get("q") || "";

            function normalize(value) {
                return String(value || "").trim().toLowerCase();
            }

            function applyFilter() {
                var normalizedQuery = normalize(query);
                var normalizedChip = normalize(activeChip);

                cards.forEach(function (card) {
                    var text = normalize(card.getAttribute("data-search"));
                    var matchedQuery = !normalizedQuery || text.indexOf(normalizedQuery) !== -1;
                    var matchedChip = !normalizedChip || text.indexOf(normalizedChip) !== -1;
                    card.classList.toggle("is-hidden", !(matchedQuery && matchedChip));
                });
            }

            if (input) {
                if (initialQuery) {
                    input.value = initialQuery;
                    query = initialQuery;
                }

                input.addEventListener("input", function () {
                    query = input.value;
                    applyFilter();
                });
            }

            chips.forEach(function (chip) {
                chip.addEventListener("click", function () {
                    chips.forEach(function (item) {
                        item.classList.remove("is-active");
                    });

                    chip.classList.add("is-active");
                    activeChip = chip.getAttribute("data-filter-value") || "";
                    applyFilter();
                });
            });

            applyFilter();
        }
    });
})();
