(function () {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
  }

  const hero = document.querySelector("[data-hero]");

  if (hero) {
    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    const prev = hero.querySelector("[data-hero-prev]");
    const next = hero.querySelector("[data-hero-next]");
    let current = 0;
    let timer = null;

    const setSlide = function (index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    };

    const play = function () {
      clearInterval(timer);
      timer = setInterval(function () {
        setSlide(current + 1);
      }, 5200);
    };

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        setSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        play();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        setSlide(current - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        setSlide(current + 1);
        play();
      });
    }

    setSlide(0);
    play();
  }

  document.querySelectorAll("[data-filter-page]").forEach(function (page) {
    const input = page.querySelector("[data-search-input]");
    const type = page.querySelector("[data-type-filter]");
    const year = page.querySelector("[data-year-filter]");
    const cards = Array.from(page.querySelectorAll(".movie-card"));

    const apply = function () {
      const query = input ? input.value.trim().toLowerCase() : "";
      const typeValue = type ? type.value : "";
      const yearValue = year ? year.value : "";

      cards.forEach(function (card) {
        const text = [
          card.dataset.title,
          card.dataset.genre,
          card.dataset.region,
          card.dataset.year,
          card.dataset.type,
          card.dataset.tags
        ].join(" ").toLowerCase();

        const matchedQuery = !query || text.indexOf(query) !== -1;
        const matchedType = !typeValue || card.dataset.type === typeValue;
        const matchedYear = !yearValue || card.dataset.year === yearValue;
        card.classList.toggle("is-filter-hidden", !(matchedQuery && matchedType && matchedYear));
      });
    };

    [input, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });
  });
})();

function setupMoviePlayer(source) {
  const video = document.querySelector("[data-movie-video]");
  const button = document.querySelector("[data-play-button]");

  if (!video || !button || !source) {
    return;
  }

  let attached = false;

  const attach = function () {
    if (attached) {
      return;
    }

    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }

    video.src = source;
  };

  const start = function () {
    attach();
    button.classList.add("is-hidden");
    video.play().catch(function () {});
  };

  button.addEventListener("click", start);
  video.addEventListener("click", function () {
    if (!attached || video.paused) {
      start();
    }
  });
}
