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

function fetchCandies() {
  fetch("candies.json")
    .then((res) => res.json())
    .then((products) => {
      productGrid.innerHTML = "";
      products.forEach((product) => {
        productGrid.innerHTML += `
          <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <img src="${product.image}" alt="${
          product.name
        }" class="w-full h-40 object-cover rounded-md mb-3">
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
            <button onclick="showProductInfo(${product.id})"
              class="mt-3 ml-2 border border-pink-600 text-pink-600 px-3 py-1 rounded hover:bg-pink-700 hover:text-white">
              View Product
            </button>
          </div>
        `;
      });
    })
    .catch((error) => console.error("Error fetching candies:", error));
}

function addToCart(id, name, price) {
  // Add product to cart
  const product = { id, name, price };
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart)); // Save to localStorage
  updateCartCount();
}

function updateCartCount() {
  cartCount.textContent = cart.length;
}

// Fetch candies on page load
fetchCandies();

const modal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const closeModal = document.getElementById("closeModal");
const addToCartButton = document.getElementById("addToCartButton");

function showProductInfo(id) {
  fetch("candies.json")
    .then((res) => res.json())
    .then((products) => {
      const product = products.find((p) => p.id === id);
      if (product) {
        modalImage.src = product.image;
        modalTitle.textContent = product.name;
        modalDescription.textContent =
          product.description || "No description available.";
        modalPrice.textContent = `$${product.price.toFixed(2)}`;

        // Update Add to Cart button to call addToCart with correct product
        addToCartButton.onclick = () =>
          addToCart(product.id, product.name, product.price);

        modal.classList.remove("hidden");

        // Disable scrolling when modal is open
        document.body.style.overflow = "hidden"; // Disable scroll
      }
    });
}

// Close modal on button click
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");

  // Re-enable scrolling when modal is closed
  document.body.style.overflow = "auto"; // Enable scroll
});

// Close modal when clicking outside of it
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");

    // Re-enable scrolling when modal is closed
    document.body.style.overflow = "auto"; // Enable scroll
  }
});
