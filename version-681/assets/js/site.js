(function () {
    var ready = function (callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    };

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-mobile-menu]");

        if (toggle && menu) {
            toggle.addEventListener("click", function () {
                menu.classList.toggle("is-open");
            });
        }

        var slider = document.querySelector("[data-hero-slider]");
        if (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
            var current = 0;

            var show = function (index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                });
            };

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    show(index);
                });
            });

            if (slides.length > 1) {
                window.setInterval(function () {
                    show(current + 1);
                }, 5600);
            }
        }

        var params = new URLSearchParams(window.location.search);
        var queryValue = params.get("q") || "";
        var filterForms = Array.prototype.slice.call(document.querySelectorAll("[data-filter-form]"));

        filterForms.forEach(function (form) {
            var input = form.querySelector("[data-filter-input]");
            var year = form.querySelector("[data-filter-year]");
            var list = document.querySelector("[data-movie-list]");
            var empty = document.querySelector("[data-empty-state]");

            if (!input || !list) {
                return;
            }

            if (queryValue) {
                input.value = queryValue;
            }

            var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
            var apply = function () {
                var text = (input.value || "").trim().toLowerCase();
                var selectedYear = year ? year.value : "";
                var shown = 0;

                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-year")
                    ].join(" ").toLowerCase();
                    var okText = !text || haystack.indexOf(text) !== -1;
                    var okYear = !selectedYear || card.getAttribute("data-year") === selectedYear;
                    var visible = okText && okYear;
                    card.hidden = !visible;
                    if (visible) {
                        shown += 1;
                    }
                });

                if (empty) {
                    empty.hidden = shown !== 0;
                }
            };

            form.addEventListener("submit", function (event) {
                event.preventDefault();
                apply();
            });
            input.addEventListener("input", apply);
            if (year) {
                year.addEventListener("change", apply);
            }
            apply();
        });
    });
})();
