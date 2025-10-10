new Swiper(".swiper", {
  spaceBetween: 12,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: 2500, // time between slides in ms
    disableOnInteraction: false, // keeps autoplay even after manual interaction
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    640: { slidesPerView: 1.5, spaceBetween: 16 },
    768: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 24 },
  },
});

AOS.init({ once: true });

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const modal = document.getElementById("productModal");
const modalContent = document.getElementById("modalContent");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const addToCartButton = document.getElementById("addToCartButton");
const cartButton = document.getElementById("cartButton");
const cartContainer = document.getElementById("cartContainer");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const closeModal = document.getElementById("closeModal");
const closeCart = document.getElementById("closeCart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
cart.forEach((item) => {
  item.price = Number(item.price);
  item.quantity = Number(item.quantity) || 1;
});
updateCartCount();

let products = [];

// Fetch candies once and store them
async function fetchCandies() {
  try {
    const res = await fetch("candies.json");
    products = await res.json();
    renderProducts();
  } catch (error) {
    console.error("Error fetching candies:", error);
  }
}

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
      <div class="bg-rose-400/50 p-4 rounded-lg shadow-md hover:shadow-lg transition">
        <img src="${product.image}" alt="${product.name}" 
          class="w-full h-40 object-cover rounded-md mb-3">
        <h2 class="text-lg font-bold text-gray-800">${product.name}</h2>
        <p class="text-rose-600 font-semibold">$${product.price.toFixed(2)}</p>
        <button class="add-to-cart mt-3 bg-rose-600/80 text-white px-3 py-1 rounded hover:bg-rose-700 hover:cursor-pointer"
          data-id="${product.id}" data-name="${product.name}" data-price="${
        product.price
      }">
          Add to Cart
        </button>
        <button class="view-product mt-3 hover:cursor-pointer border border-rose-600 text-rose-600 bg-pink-50  px-3 py-1 rounded hover:bg-rose-700 hover:text-white"
          data-id="${product.id}">
          View Product
        </button>
      </div>`
    )
    .join("");
}

// Add to cart
function addToCart(id, name, price) {
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  saveCart();
}

function updateCartCount() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Show product details in modal
function showProductInfo(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  modalImage.src = product.image;
  modalTitle.textContent = product.name;
  modalDescription.textContent =
    product.description || "No description available.";
  modalPrice.textContent = `$${product.price.toFixed(2)}`;
  addToCartButton.onclick = () =>
    addToCart(product.id, product.name, product.price);

  showModal(modal);
}

// Show cart items
function showCart() {
  cartItems.innerHTML = cart
    .map(
      (item, index) => `
      <div class="flex justify-between items-center border-b py-2">
        <span>${item.name} [${item.quantity}] - $${(
        item.price * item.quantity
      ).toFixed(2)}</span>
        <button class="remove-from-cart  hover:cursor-pointer border border-rose-600 text-rose-600 bg-pink-50  px-3 py-1 rounded hover:bg-rose-700 hover:text-white" data-index="${index}">Remove</button>
      </div>`
    )
    .join("");

  cartTotal.textContent = `Total: $${cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2)}`;

  showModal(cartContainer);
}

// Remove from cart
function removeFromCart(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }

  saveCart();
  showCart();
}

// Show modal and prevent scrolling
function showModal(element) {
  modal.classList.add("hidden");
  cartContainer.classList.add("hidden");

  element.classList.remove("hidden");
  element.classList.add("flex");

  document.body.style.overflow = "hidden";
}

// Close modals
function closeModalHandler() {
  modal.classList.add("hidden");
  cartContainer.classList.add("hidden");
  document.body.style.overflow = "auto";
}

// Event Listeners
cartButton.addEventListener("click", showCart);
closeModal.addEventListener("click", closeModalHandler);
closeCart.addEventListener("click", closeModalHandler);

window.addEventListener("click", (e) => {
  if (e.target === modal || e.target === cartContainer) {
    closeModalHandler();
  }
});

// Delegate event handling to the product grid (for better performance)
productGrid.addEventListener("click", (e) => {
  const target = e.target;

  if (target.classList.contains("add-to-cart")) {
    const { id, name, price } = target.dataset;
    addToCart(Number(id), name, Number(price));
  } else if (target.classList.contains("view-product")) {
    showProductInfo(Number(target.dataset.id));
  }
});

// Delegate event handling to the cart (removing items)
cartContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-from-cart")) {
    removeFromCart(Number(e.target.dataset.index));
  }
});

fetchCandies();
