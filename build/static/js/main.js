//-----vars---------------------------------------
const header = document.querySelector(".h2o-header");
const overlay = document.querySelector("[data-overlay]");
const mobileMenu = document.querySelector(".h2o-mobile");
const burgers = document.querySelectorAll(".h2o-burger");
const accParrent = [...document.querySelectorAll("[data-accordion-init]")];
const htmlEl = document.documentElement;
const bodyEl = document.body;
const timers = document.querySelectorAll('.h2o-timer');
const cards = document.querySelectorAll('.h2o-game-card');
const slotsSliders = document.querySelectorAll('.h2o-slots-slider');
const coinsSliders = document.querySelectorAll('.h2o-coins-slider');
//------------------------------------------------

//----customFunction------------------------------
const toggleCustomClass = (item, customClass = "active") => {
  item.classList.toggle(customClass);
};

const toggleClassInArray = (arr, customClass = "active") => {
  arr.forEach((item) => {
    item.classList.toggle(customClass);
  });
};

const removeClassInArray = (arr, customClass = "active") => {
  arr.forEach((item) => {
    item.classList.remove(customClass);
  });
};

const addCustomClass = (item, customClass = "active") => {
  item.classList.add(customClass);
};

const addClassInArray = (arr, customClass) => {
  arr.forEach((item) => {
    item.classList.add(customClass);
  });
}

const removeCustomClass = (item, customClass = "active") => {
  item.classList.remove(customClass);
};

const disableScroll = () => {
  const fixBlocks = document?.querySelectorAll(".fixed-block");
  const pagePosition = window.scrollY;
  const paddingOffset = `${window.innerWidth - bodyEl.offsetWidth}px`;

  htmlEl.style.scrollBehavior = "none";
  fixBlocks.forEach((el) => {
    el.style.paddingRight = paddingOffset;
  });
  bodyEl.style.paddingRight = paddingOffset;
  bodyEl.classList.add("dis-scroll");
  bodyEl.dataset.position = pagePosition;
  bodyEl.style.top = `-${pagePosition}px`;
};

const enableScroll = () => {
  const fixBlocks = document?.querySelectorAll(".fixed-block");
  const body = document.body;
  const pagePosition = parseInt(bodyEl.dataset.position, 10);
  fixBlocks.forEach((el) => {
    el.style.paddingRight = "0px";
  });
  bodyEl.style.paddingRight = "0px";

  bodyEl.style.top = "auto";
  bodyEl.classList.remove("dis-scroll");
  window.scroll({
    top: pagePosition,
    left: 0,
  });
};

const elementHeight = (el, variableName) => {
  if(el) {
    function initListener(){
      const elementHeight = el.offsetHeight;
      document.querySelector(':root').style.setProperty(`--${variableName}`, `${elementHeight}px`);
    }
    window.addEventListener('DOMContentLoaded', initListener)
    window.addEventListener('resize', initListener)
  }
}
//------------------------------------------------

//----accordion----------------------------------
window.addEventListener("DOMContentLoaded", () => {
  accParrent &&
    accParrent.map(function (accordionParrent) {
      if (accordionParrent) {
        let multipleSetting = false;
        let breakpoinSetting = false;
        let defaultOpenSetting;

        if (
          accordionParrent.dataset.single &&
          accordionParrent.dataset.breakpoint
        ) {
          multipleSetting = accordionParrent.dataset.single; // true - включает сингл аккордион
          breakpoinSetting = accordionParrent.dataset.breakpoint; // брейкпоинт сингл режима (если он true)
        }

        const getAccordions = function (dataName = "[data-id]") {
          return accordionParrent.querySelectorAll(dataName);
        };

        const accordions = getAccordions();
        let openedAccordion = null;

        const closeAccordion = function (accordion, className = "active") {
          accordion.style.maxHeight = 0;
          removeCustomClass(accordion, className);
        };

        const openAccordion = function (accordion, className = "active") {
          accordion.style.maxHeight = accordion.scrollHeight + "px";
          addCustomClass(accordion, className);
        };

        const toggleAccordionButton = function (button, className = "active") {
          toggleCustomClass(button, className);
        };

        const checkIsAccordionOpen = function (accordion) {
          return accordion.classList.contains("active");
        };

        const accordionClickHandler = function (e) {
          e.preventDefault();
          let curentDataNumber = this.dataset.id;

          toggleAccordionButton(this);
          const accordionContent = accordionParrent.querySelector(
            `[data-content="${curentDataNumber}"]`
          );
          const isAccordionOpen = checkIsAccordionOpen(accordionContent);

          if (isAccordionOpen) {
            closeAccordion(accordionContent);
            openedAccordion = null;
          } else {
            if (openedAccordion != null) {
              const mobileSettings = () => {
                let containerWidth = document.documentElement.clientWidth;
                if (
                  containerWidth <= breakpoinSetting &&
                  multipleSetting === "true"
                ) {
                  closeAccordion(openedAccordion);
                  toggleAccordionButton(
                    accordionParrent.querySelector(
                      `[data-id="${openedAccordion.dataset.content}"]`
                    )
                  );
                }
              };

              window.addEventListener("resize", () => {
                mobileSettings();
              });
              mobileSettings();
            }

            openAccordion(accordionContent);
            openedAccordion = accordionContent;
          }
        };

        const activateAccordion = function (accordions, handler) {
          for (const accordion of accordions) {
            accordion.addEventListener("click", handler);
          }
        };
        const accordionDefaultOpen = (currentId) => {
          const defaultOpenContent = accordionParrent.querySelector(
            `[data-content="${currentId}"]`
          );
          const defaultOpenButton = accordionParrent.querySelector(
            `[data-id="${currentId}"]`
          );
          openedAccordion = defaultOpenContent;

          toggleAccordionButton(defaultOpenButton);
          openAccordion(defaultOpenContent);
        };

        if (accordionParrent.dataset.default) {
          defaultOpenSetting = accordionParrent.dataset.default; // получает id аккордиона который будет открыт по умолчанию
          accordionDefaultOpen(defaultOpenSetting);
        }

        activateAccordion(accordions, accordionClickHandler);
      }
    });
});

//----burger------------------------------------
const mobileMenuHandler = function (overlay, mobileMenu, burgers) {
  burgers.forEach((burger) => {
    burger.addEventListener("click", function (e) {
      e.preventDefault();
      toggleCustomClass(header, "active");
      toggleCustomClass(mobileMenu);
      toggleClassInArray(burgers);
      toggleCustomClass(overlay);
      burger.classList.contains("active") ? disableScroll() : enableScroll();
    });
  });
};

const hideMenuHandler = function (overlay, mobileMenu, burgers) {
  removeCustomClass(mobileMenu);
  removeClassInArray(burgers);
  removeCustomClass(header, "active");
  removeCustomClass(overlay);
  enableScroll();
};

if (overlay) {
  mobileMenuHandler(overlay, mobileMenu, burgers);
  overlay.addEventListener("click", function (e) {
    e.target.classList.contains("h2o-overlay")
      ? hideMenuHandler(overlay, mobileMenu, burgers)
      : null;
  });
}

//----stickyHeader------------------------------

let lastScroll = 0;
const defaultOffset = 40;

function stickyHeaderFunction(breakpoint){
  let containerWidth = document.documentElement.clientWidth;
  if (containerWidth > `${breakpoint}`) {
    const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
    const containHide = () => header.classList.contains('sticky');

    window.addEventListener('scroll', () => {
        if(scrollPosition() > lastScroll && !containHide() && scrollPosition() > defaultOffset) {
            addCustomClass(header, "sticky")
        }
        else if(scrollPosition() < defaultOffset){
            removeCustomClass(header, "sticky")
        }

        lastScroll = scrollPosition();
    })
  }
}

stickyHeaderFunction(320);
elementHeight(header, "header-height");

//--------------slider----------------------------

slotsSliders && slotsSliders.forEach(function(slotsSlider){
  new Splide( slotsSlider, {
    speed      : 1800,
    pagination : false,
    arrows     : false,
    perPage    : 3,
    gap        : 20,
   
    breakpoints: {
      1024: {
        perPage: 'auto',
      }
    },
  } ).mount(); 
});

coinsSliders && coinsSliders.forEach(function(coinSlider){
  new Splide( coinSlider, {
    speed      : 1800,
    pagination : false,
    arrows     : false,
    perPage    : 6,
    gap        : 20,
    drag       : false,
    updateOnMove: true,
   
    breakpoints: {
      1024: {
        perPage    : 3,
        drag       : true,
        type       : 'loop',
        focus  : 'center',
        fixedWidth: 180,
      }
    },
  } ).mount(); 
});

//------timer-----------------------------------

timers && timers.forEach(function(item) {  
  const itemDate = item.getAttribute('data-time');
  const countDownDate = new Date(itemDate).getTime();
  
  const x = setInterval(function() {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    if (distance <= 0) {
      item.querySelector('.h2o-timer__days').innerText = '00';
      item.querySelector('.h2o-timer__hours').innerText = '00';
      item.querySelector('.h2o-timer__minutes').innerText = '00';
      item.querySelector('.h2o-timer__seconds').innerText = '00';

      item.classList.add('stop');
      clearInterval(x);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (!item.classList.contains('stop')) {
      item.querySelector('.h2o-timer__days').innerText = formatedValue(days, 10);
      item.querySelector('.h2o-timer__hours').innerText = formatedValue(hours, 10);
      item.querySelector('.h2o-timer__minutes').innerText = formatedValue(minutes, 10);
      item.querySelector('.h2o-timer__seconds').innerText = formatedValue(seconds, 10);
    }
  }, 1000);
});

function formatedValue(value, countValue) {
  return value < countValue ? '0' + value : '' + value;
}

//------animate-border--------------------------

cards && cards.forEach(function(card){
  let animationFrame;
  let angle = 125;

  const animateGradient = (start, end, duration) => {
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentAngle = start + progress * (end - start);

      card.style.setProperty('--gradient-angle', `${currentAngle}deg`);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(step);
  };

  card.addEventListener('mouseenter', () => {
    animateGradient(angle, 496, 1000);
  });

  card.addEventListener('mouseleave', () => {
    animateGradient(angle, 125, 1000);
  });
})

//------to-top----------------------------------

document.addEventListener("DOMContentLoaded", function () {
  const upButton = document.querySelector(".h2o-up-btn");
  
  if (upButton) {
      upButton.addEventListener("click", function () {
          window.scrollTo({
              top: 0,
              behavior: "smooth",
          });
      });
  }
});