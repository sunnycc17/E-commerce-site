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

AOS.init({
  once: true, // Ensures animations happen only once
});

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");

// Load cart count from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartCount();

async function fetchCandies() {
  try {
    const res = await fetch("candies.json"); // Change this to your hosted JSON URL if needed
    const products = await res.json();

    productGrid.innerHTML = ""; // Clear previous content

    products.forEach((product) => {
      productGrid.innerHTML += `
        <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
          <img src="${product.image}" alt="${
        product.name
      }" class="w-full h-40 object-contain mb-3">
          <h2 class="text-lg font-bold text-gray-800">${product.name}</h2>
          <p class="text-pink-600 font-semibold">$${product.price.toFixed(
            2
          )}</p>
          <button onclick="addToCart(${product.id}, '${product.name}', ${
        product.price
      })" 
            class="mt-3 bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-700">
            Add to Cart
          </button>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error fetching candies:", error);
  }
}

function addToCart(id, name, price) {
  cart.push({ id, name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  cartCount.textContent = cart.length;
}

// Fetch candies on page load
fetchCandies();
