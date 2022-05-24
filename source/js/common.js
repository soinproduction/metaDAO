let slider = new Swiper(".logo-section__slider", {
  slidesPerView: "auto",
  spaceBetween: 30,
  loop: true,
  speed: 5000,
  autoplay: {
    delay: 0,
  },
});

(function () {
  "use strict";

  const breakpoint = window.matchMedia("(min-width:1024px)");
  let slider;

  const breakpointChecker = function () {
    if (breakpoint.matches === true) {
      if (slider !== undefined) slider.destroy(true, true);

      return;
    } else if (breakpoint.matches === false) {
      return enableSwiper();
    }
  };
  const enableSwiper = function () {
    slider = new Swiper(".about__slider", {
      slidesPerView: "auto",
      spaceBetween: 20,
      loop: true,
      speed: 8000,
      autoplay: {
        delay: 0,
      },
      pagination: {
        el: '.about__pagination',
        type: 'bullets',
      },
    });
  };

  breakpoint.addListener(breakpointChecker);
  breakpointChecker();
})();

(function () {
  "use strict";

  const breakpoint = window.matchMedia("(min-width:1024px)");
  let slider;

  const breakpointChecker = function () {
    if (breakpoint.matches === true) {
      if (slider !== undefined) slider.destroy(true, true);

      return;
    } else if (breakpoint.matches === false) {
      return enableSwiper();
    }
  };
  const enableSwiper = function () {
    slider = new Swiper(".our-team__container", {
      slidesPerView: "auto",
      spaceBetween: 20,
      centeredSlides: true,
      loop: true,
      speed: 1500,
      autoplay: {
        delay: 4000,
      },
      pagination: {
        el: '.our-team__pagination',
        type: 'bullets',
      },
    });
  };

  breakpoint.addListener(breakpointChecker);
  breakpointChecker();
})();




const select = document.querySelectorAll(".select");
if (select.length) {
  select.forEach((item) => {
    const selectCurrent = item.querySelector(".select__current");
    item.addEventListener("click", (event) => {
      const el = event.target.dataset.choice;
      const text = event.target.innerText;
      if (el === "choosen" && selectCurrent.innerText !== text) {
        selectCurrent.innerText = text;
      }
      item.classList.toggle("active");
    });
    document.addEventListener('click', function(event) {
      if (!item.contains(event.target)) {
        item.classList.remove('active')
      }
    });
  });
}
