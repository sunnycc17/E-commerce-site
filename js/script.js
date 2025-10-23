

// ----- Elements -----
const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const modal = document.getElementById("productModal");
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

// ----- Cart -----
let cart = JSON.parse(localStorage.getItem("cart")) || [];
cart.forEach((item) => {
  item.price = Number(item.price);
  item.quantity = Number(item.quantity) || 1;
});
updateCartCount();

function updateCartCount() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id, name, price) {
  const existing = cart.find((i) => i.id === id);
  if (existing) existing.quantity++;
  else cart.push({ id, name, price, quantity: 1 });
  saveCart();
}

function removeFromCart(index) {
  if (cart[index].quantity > 1) cart[index].quantity--;
  else cart.splice(index, 1);
  saveCart();
  showCart();
}

// ----- Products -----
let products = [];

async function fetchCandies() {
  try {
    const res = await fetch("candies.json");
    products = await res.json();
    renderProducts();
  } catch (err) {
    console.error("Error fetching candies:", err);
  }
}

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (p) => `
      <div class="bg-rose-400/50 p-4 rounded-lg shadow-md hover:shadow-lg transition">
        <img src="${p.image}" alt="${
        p.name
      }" class="w-full h-40 object-cover rounded-md mb-3">
        <h2 class="text-lg font-bold text-gray-800">${p.name}</h2>
        <p class="text-rose-600 font-semibold">$${p.price.toFixed(2)}</p>
        <button class="add-to-cart mt-3 bg-rose-600/80 text-white px-3 py-1 rounded hover:bg-rose-700 cursor-pointer" 
          data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">
          Add to Cart
        </button>
        <button class="view-product mt-3 border border-rose-600 text-rose-600 bg-pink-50 px-3 py-1 rounded hover:bg-rose-700 hover:text-white cursor-pointer" 
          data-id="${p.id}">
          View Product
        </button>
      </div>`
    )
    .join("");
}

function showProductInfo(id) {
  const p = products.find((p) => p.id === id);
  if (!p) return;
  modalImage.src = p.image;
  modalTitle.textContent = p.name;
  modalDescription.textContent = p.description || "No description available.";
  modalPrice.textContent = `$${p.price.toFixed(2)}`;
  addToCartButton.onclick = () => addToCart(p.id, p.name, p.price);
  showModal(modal);
}

// ----- Cart Modal -----
function showCart() {
  cartItems.innerHTML = cart
    .map(
      (i, idx) => `
      <div class="flex justify-between items-center border-b py-2">
        <span>${i.name} [${i.quantity}] - $${(i.price * i.quantity).toFixed(
        2
      )}</span>
        <button class="remove-from-cart border cursor-pointer border-rose-600 text-rose-600 bg-pink-50 px-3 py-1 rounded hover:bg-rose-700 hover:text-white" data-index="${idx}">Remove</button>
      </div>`
    )
    .join("");

  cartTotal.textContent = `Total: $${cart
    .reduce((s, i) => s + i.price * i.quantity, 0)
    .toFixed(2)}`;

  showModal(cartContainer);
}

// ----- Modal control -----
function showModal(element) {
  modal.classList.add("hidden");
  cartContainer.classList.add("hidden");
  element.classList.remove("hidden");
  element.classList.add("flex");
  document.body.style.overflow = "hidden";
}

function closeModalHandler() {
  modal.classList.add("hidden");
  cartContainer.classList.add("hidden");
  document.body.style.overflow = "auto";
}

// ----- Events -----
cartButton.addEventListener("click", showCart);
closeModal.addEventListener("click", closeModalHandler);
closeCart.addEventListener("click", closeModalHandler);
window.addEventListener("click", (e) => {
  if (e.target === modal || e.target === cartContainer) closeModalHandler();
});

productGrid.addEventListener("click", (e) => {
  const t = e.target;
  if (t.classList.contains("add-to-cart")) {
    const { id, name, price } = t.dataset;
    addToCart(Number(id), name, Number(price));
  } else if (t.classList.contains("view-product")) {
    showProductInfo(Number(t.dataset.id));
  }
});

cartContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-from-cart"))
    removeFromCart(Number(e.target.dataset.index));
});

// ----- Algolia Search -----
const client = algoliasearch("I8UR8SORU4", "8e2b8f50ac6866baf076264cd5554d51");
const index = client.initIndex("candies");

const searchInputs = document.querySelectorAll("#searchbox, #mobile-searchbox");
const dropdowns = document.querySelectorAll(
  "#hits-dropdown, #mobile-hits-dropdown"
);

let debounceTimer;
const debounce = (func, delay = 300) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(func, delay);
};

searchInputs.forEach((input, i) => {
  const dropdown = dropdowns[i];
  input.addEventListener("input", (e) => {
    const query = e.target.value.trim();

    debounce(async () => {
      if (!query) {
        dropdown.innerHTML = "";
        dropdown.classList.add("hidden");
        return;
      }

      const { hits } = await index.search(query, { hitsPerPage: 5 });
      if (hits.length === 0) {
        dropdown.innerHTML =
          '<li class="p-2 text-gray-500">No results found</li>';
        dropdown.classList.remove("hidden");
        return;
      }

      dropdown.innerHTML = hits
        .map(
          (hit) =>
            `<li class="p-2 hover:bg-gray-200 cursor-pointer">${hit.name}</li>`
        )
        .join("");

      dropdown.classList.remove("hidden");
    });
  });

  dropdown.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    const name = li.textContent.trim();
    const product = products.find((p) => p.name === name);
    if (!product) return;

    const card = [...productGrid.children].find(
      (el) => el.querySelector("h2")?.textContent === product.name
    );
    if (!card) return;

    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("ring-4", "ring-rose-500", "ring-offset-2");
    setTimeout(() => {
      card.classList.remove("ring-4", "ring-rose-500", "ring-offset-2");
    }, 2000);

    dropdown.classList.add("hidden");
    input.value = "";

    // only close sidebar if the clicked input was mobile
    const toggleButton = document.querySelector(
      'button[aria-label="Toggle menu"]'
    );
    if (toggleButton && input.id === "mobile-searchbox") toggleButton.click();
  });
});

document.addEventListener("click", (e) => {
  if (
    !e.target.closest("#search") &&
    !e.target.closest("#hits-dropdown") &&
    !e.target.closest("#mobile-search") &&
    !e.target.closest("#mobile-hits-dropdown")
  ) {
    dropdowns.forEach((d) => d.classList.add("hidden"));
  }
});

fetchCandies();
