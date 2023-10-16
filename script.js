'use strict';

const body = document.querySelector('body');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnSrocllTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.plans__tab');
const tabsContainer = document.querySelector('.plans__tab-container');
const tabsContent = document.querySelectorAll('.plans__content');
const header = document.querySelector('.header');
const slides = document.querySelectorAll('.slide');
const silderBtnLeft = document.querySelector('.slider__btn--left');
const silderBtnRight = document.querySelector('.slider__btn--right');
const dots = document.querySelector('.dots');

///////////////////////////////////////
// Cookie prompt

(function () {
  const message = document.createElement('div');
  message.classList.add('cookie');
  message.innerHTML =
    'We use cookie to improve <button class = "btn btn--close-cooie"> Got it! </button>';
  header.append(message);

  document
    .querySelector('.btn--close-cooie')
    .addEventListener('click', function () {
      message.remove();
      overlay.classList.add('hidden');
      body.classList.remove('stop-scrolling');
    });
  message.style.backgroundColor = '#37383d';
  message.style.width = '120%';

  console.log(getComputedStyle(message).color);

  message.style.height =
    Number.parseFloat(getComputedStyle(message).height, 10) + 20 + 'px';
  message.style.height = '80px';
})();

///////////////////////////////////////
// Modal window

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');

  body.classList.add('stop-scrolling');
  body.bind('touchmove', function (e) {
    e.preventDefault();
  });
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  body.classList.remove('stop-scrolling');
  body.unbind('touchmove');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
//// Scroling

btnSrocllTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' }); //
});

///////////////////////////////////////
//// Page navigation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbs section

tabsContainer.addEventListener('click', function (event) {
  const clicked = event.target.closest('.plans__tab');

  if (!clicked) return; // narprawia klikanie obok przyciksu

  // clicked tab animation
  tabs.forEach(tab => tab.classList.remove('plans__tab--active'));
  clicked.classList.add('plans__tab--active');

  // active content area
  tabsContent.forEach(con => con.classList.remove('plans__content--active'));

  document
    .querySelector(`.plans__content--${clicked.dataset.tab}`)
    .classList.add('plans__content--active');
});

//// nav fade animation
const handleHover = function (event) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const syblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    syblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// sticky navbar
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const entry = entries[0];

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections

const allSections = document.querySelectorAll('.section');

const sectionReveal = function (entries, observer) {
  const entry = entries[0];

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(sectionReveal, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImgs = function (entries, observer) {
  const entry = entries[0];

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImgs, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// slider
let curSlide = 0;
const maxSlide = slides.length;

// functions
const createDots = function () {
  slides.forEach(function (_, i) {
    dots.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activeDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const slideFunc = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const nextSlide = function () {
  if (curSlide == maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  slideFunc(curSlide);
  activeDot(curSlide);
};

const previusSlide = function () {
  if (curSlide == 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  slideFunc(curSlide);
  activeDot(curSlide);
};

// function initialization
const init = function () {
  createDots();
  activeDot(0);
  slideFunc(0);
};

init();

// event handlers
silderBtnRight.addEventListener('click', nextSlide);
silderBtnLeft.addEventListener('click', previusSlide);

document.addEventListener('keydown', function (e) {
  if (e.key == 'ArrowLeft') previusSlide();
  if (e.key == 'ArrowRight') nextSlide();
});

dots.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    //const slide = e.target.dataset.slide;
    const { slide } = e.target.dataset;
    slideFunc(slide);
    activeDot(slide);
  }
});

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};
