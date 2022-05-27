
const burgerBtns = [...document.querySelectorAll(".burger-btn")];
const replaceElement = [...document.querySelectorAll("[data-replace]")];
const replaceSelect = [...document.querySelectorAll("[data-replace-select]")];
const leftInner = document.querySelector("[left-inner]");
const desktopInner = document.querySelector("[data-desktop-inner]");
const mobileInner = document.querySelector("[data-mobile-inner]");
const breakpoint = 1024;

const body = document.body


const changeLocation = (elements, parentMobile, parentDesktop) => {
  const containerWidth = document.documentElement.clientWidth;
  for (const element of elements) {
    if (containerWidth < breakpoint) {
      parentMobile.insertAdjacentElement("beforeend", element);
    };
    if (containerWidth > breakpoint) {
      parentDesktop.insertAdjacentElement("beforeend", element);
    }
  }
};

window.addEventListener("DOMContentLoaded", () => {
  changeLocation(replaceElement, mobileInner, desktopInner);
  changeLocation(replaceSelect, leftInner, desktopInner);
  setHeaderHeight();
});

window.addEventListener("resize", () => {
  changeLocation(replaceElement, mobileInner, desktopInner);
  changeLocation(replaceSelect, leftInner, desktopInner);
  setHeaderHeight();

});




const toggleClassOnClick = function(element,button) {
  element.classList.toggle('active');
  button.classList.toggle('active');
};


for (const burgerBtn of burgerBtns) {
  burgerBtn.addEventListener('click', function(){
    toggleClassOnClick(mobileInner,burgerBtn)
  });
}



function setHeaderHeight() {
  let header = document.querySelector('header'),
      headerHeight = header.clientHeight + 'px';
  body.style.setProperty('--header-min-height', headerHeight)
}

let slider = new Swiper(".logo-section__slider", {
  slidesPerView: "auto",
  spaceBetween: 30,
  loop: true,
  observer: true,
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
      slideToClickedSlide: true,
      observer: true,
      speed: 8000,
      autoplay: {
        delay: 0,
      },
      pagination: {
        el: ".about__pagination",
        type: "bullets",
        clickable: true,
      },
      on: {
        init() {
          this.el.addEventListener('mouseleave', () => {
            this.autoplay.start();
          });
        }
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
      spaceBetween: 0,
      observer: true,
      centeredSlides: true,
      loop: true,
      loopedSlides: 2,
      slideToClickedSlide: true,
      speed: 1500,
      autoplay: {
        delay: 4000,
      },
      pagination: {
        el: ".our-team__pagination",
        type: "bullets",
        clickable: true,
      },
      on: {
        init() {
          this.el.addEventListener('mouseleave', () => {
            this.autoplay.start();
          });
        }
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
    document.addEventListener("click", function (event) {
      if (!item.contains(event.target)) {
        item.classList.remove("active");
      }
    });
  });
}

if (document.querySelector('.nav__list')) {
  document.querySelector('.nav__list').addEventListener('click', function(e){
    if (e.target.classList.contains('nav__link--anhor')) {
      e.preventDefault();
      mobileInner.classList.remove('active');
      const id = e.target.getAttribute('href').replace('#', '');
      let headerHeight = document.querySelector('header').clientHeight;
      window.scrollTo({
        top: document.getElementById(id).offsetTop,
        behavior:"smooth"
      })
    }
  })
}

if (document.documentElement.clientWidth < 1200) {
  AOS.init({
    once: true,
    throttleDelay: 0,
    anchorPlacement: 'top-top',
    delay: 0,
    offset: 10,
  });
} else {
  AOS.init({
    // once: true,
    // throttleDelay: 10,

  });
}





const ethereumButton = document.querySelector('.connect-btn');
const showAccount = document.querySelector('.connect-btn span');

ethereumButton.addEventListener('click', () => {

  if (typeof window.ethereum === 'undefined') {
    alert('установите metamask');
    return;
  }

  getAccount();
});

async function getAccount() {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];
  showAccount.innerHTML = account;
  ethereumButton.classList.add('connected');
}



