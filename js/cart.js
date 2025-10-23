function initCart() {
  const cartCount = document.getElementById("cartCount");
  const cartContainer = document.getElementById("cartContainer");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const closeCart = document.getElementById("closeCart");
  const cartButton = document.getElementById("cartButton");
  const modal = document.getElementById("productModal"); // optional: hide product modal if open

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.forEach(i => { i.price = Number(i.price); i.quantity = Number(i.quantity) || 1; });

  function updateCartCount() {
    if (!cartCount) return;
    cartCount.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  function addToCart(id, name, price) {
    const existing = cart.find(i => i.id === id);
    if (existing) existing.quantity++;
    else cart.push({ id, name, price, quantity: 1 });
    saveCart();
  }

  function removeFromCart(idx) {
    if (cart[idx].quantity > 1) cart[idx].quantity--;
    else cart.splice(idx, 1);
    saveCart();
    showCart();
  }

  function showCart() {
    if (!cartItems || !cartTotal) return;
    cartItems.innerHTML = cart.map((i, idx) => `
      <div class="flex justify-between items-center border-b py-2">
        <span>${i.name} [${i.quantity}] - $${(i.price*i.quantity).toFixed(2)}</span>
        <button class="remove-from-cart border cursor-pointer border-rose-600 text-rose-600 bg-pink-50 px-3 py-1 rounded hover:bg-rose-700 hover:text-white" data-index="${idx}">Remove</button>
      </div>
    `).join("");
    cartTotal.textContent = `$${cart.reduce((s,i)=>s+i.price*i.quantity,0).toFixed(2)}`;
    if (cartContainer) showModal(cartContainer);
  }

  function showModal(el) {
    if (!modal || !cartContainer) return;
    modal.classList.add("hidden");
    cartContainer.classList.add("hidden");
    if (!el) return;
    el.classList.remove("hidden");
    el.classList.add("flex");
    document.body.style.overflow = "hidden";
  }

  function closeModalHandler() {
    if (!modal || !cartContainer) return;
    modal.classList.add("hidden");
    cartContainer.classList.add("hidden");
    document.body.style.overflow = "auto";
  }

  if (cartButton) cartButton.addEventListener("click", showCart);
  if (closeCart) closeCart.addEventListener("click", closeModalHandler);

  window.addEventListener("click", (e) => {
    if (e.target === cartContainer || e.target === modal) closeModalHandler();
  });

  if (cartContainer) {
    cartContainer.addEventListener("click", e => {
      if (e.target.classList.contains("remove-from-cart")) {
        removeFromCart(Number(e.target.dataset.index));
      }
    });
  }

  document.addEventListener("click", e => {
    if (e.target.classList.contains("add-to-cart")) {
      const {id, name, price} = e.target.dataset;
      addToCart(Number(id), name, Number(price));
    }
  });

  updateCartCount();
}
