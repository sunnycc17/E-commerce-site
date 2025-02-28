window.onload = function () {
  const swiper = new Swiper(".swiper", {
    direction: "horizontal",
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
  });
};

AOS.init({ once: true });

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const modal = document.getElementById("productModal");
const modalContent = document.getElementById("modalContent");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const closeModal = document.getElementById("closeModal");
const addToCartButton = document.getElementById("addToCartButton");
const cartButton = document.getElementById("cartButton");
const cartContainer = document.getElementById("cartContainer");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const closeCart = document.getElementById("closeCart");

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
  cart.push({ id, name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  cartCount.textContent = cart.length;
}

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
        addToCartButton.onclick = () =>
          addToCart(product.id, product.name, product.price);

        modal.classList.remove("hidden");
        modal.classList.add("flex", "z-50"); // Ensure it's above everything

        document.body.style.overflow = "hidden";
      }
    })
    .catch((error) => console.error("Error fetching product data:", error));
}

function showCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    cartItems.innerHTML += `
      <div class="flex justify-between items-center border-b py-2">
        <span>${item.name} - $${item.price.toFixed(2)}</span>
        <button onclick="removeFromCart(${index})" class="text-red-500">Remove</button>
      </div>
    `;
  });
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;

  // Show only cart modal
  cartContainer.classList.remove("hidden");
  cartContainer.classList.add("flex");
  document.body.style.overflow = "hidden"; // Disable scrolling when cart is open
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showCart();
}

function showModal(type) {
  // Hide both modals before showing the desired one
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  cartContainer.classList.add("hidden");
  cartContainer.classList.remove("flex");

  if (type === "product") {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  } else if (type === "cart") {
    cartContainer.classList.remove("hidden");
    cartContainer.classList.add("flex");
  }

  document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
}

cartButton.addEventListener("click", () => {
  showCart();
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "auto"; // Restore scroll
});

closeCart.addEventListener("click", () => {
  cartContainer.classList.add("hidden");
  cartContainer.classList.remove("flex");
  document.body.style.overflow = "auto"; // Restore scroll
});

window.addEventListener("click", (e) => {
  if (e.target === modal || e.target === cartContainer) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    cartContainer.classList.add("hidden");
    cartContainer.classList.remove("flex");
    document.body.style.overflow = "auto"; // Restore scroll
  }
});

fetchCandies();
