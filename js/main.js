(function () {
  function initCarousel(root) {
    if (!root) return;

    var slides = [].slice.call(root.querySelectorAll('.carousel__slide'));
    if (!slides.length) return;

    var idx = 0;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var delay = parseInt(root.getAttribute('data-interval'), 10) || 5000;
    var timer;

    function syncDots() {
      var dots = root.querySelectorAll('.carousel__dot');
      for (var d = 0; d < dots.length; d++) {
        var on = d === idx;
        dots[d].classList.toggle('is-active', on);
        dots[d].setAttribute('aria-current', on ? 'true' : 'false');
      }
    }

    function go(n) {
      slides[idx].classList.remove('is-active');
      slides[idx].setAttribute('aria-hidden', 'true');
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add('is-active');
      slides[idx].setAttribute('aria-hidden', 'false');
      syncDots();
    }
 
    function next() {
      go(idx + 1);
    }

    function prev() {
      go(idx - 1);
    }

    function arm() {
      clearInterval(timer);
      if (slides.length < 2) return;
      var ms = reduce ? Math.max(delay * 2, 9000) : delay;
      timer = setInterval(next, ms);
    }

    var btnPrev = root.querySelector('.carousel__btn--prev');
    var btnNext = root.querySelector('.carousel__btn--next');
    if (btnPrev) {
      btnPrev.addEventListener('click', function () {
        prev();
        arm();
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', function () {
        next();
        arm();
      });
    }

    var dotNodes = root.querySelectorAll('.carousel__dot');
    for (var i = 0; i < dotNodes.length; i++) {
      (function (index) {
        dotNodes[index].addEventListener('click', function () {
          go(index);
          arm();
        });
      })(i);
    }

    root.addEventListener('mouseenter', function () {
      clearInterval(timer);
    });
    root.addEventListener('mouseleave', arm);

    syncDots();
    arm();
  }

  function initAllCarousels() {
    var roots = document.querySelectorAll('.js-carousel');
    for (var i = 0; i < roots.length; i++) {
      initCarousel(roots[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllCarousels);
  } else {
    initAllCarousels();
  }
})();
