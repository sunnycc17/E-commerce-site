// ----- Elements -----
const cartCount = document.getElementById("cartCount");
const cartContainer = document.getElementById("cartContainer");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const closeCart = document.getElementById("closeCart");
const cartButton = document.getElementById("cartButton");
const modal = document.getElementById("productModal");

// ----- Cart State -----
let cart = JSON.parse(localStorage.getItem("cart")) || [];
cart.forEach((item) => {
  item.price = Number(item.price);
  item.quantity = Number(item.quantity) || 1;
});
updateCartCount();

// ----- Cart Helpers -----
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

// ----- Modal Control -----
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

// ----- Event Listeners -----
// Open cart modal
cartButton.addEventListener("click", showCart);

// Close cart modal
closeCart.addEventListener("click", closeModalHandler);

// Close modal on outside click
window.addEventListener("click", (e) => {
  if (e.target === cartContainer || e.target === modal) closeModalHandler();
});

// Remove item from cart
cartContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-from-cart")) {
    removeFromCart(Number(e.target.dataset.index));
  }
});

// Add to Cart from dynamic buttons in product grid
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const { id, name, price } = e.target.dataset;
    addToCart(Number(id), name, Number(price));
  }
});
