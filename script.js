window.onload = function () {
  const swiper = new Swiper(".swiper", {
    direction: "horizontal",
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay: {
      delay: 3000, // Slide change every 3 seconds
      disableOnInteraction: false, // Keep autoplay running even when user interacts
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true, // Only works if Swiper is visible
    },
  });
};
