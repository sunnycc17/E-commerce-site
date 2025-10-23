/* 
async function inject(id, file) {
  const el = document.getElementById(id);
  if (!el) return;
  const res = await fetch(file);
  if (res.ok) el.innerHTML = await res.text();
}

inject("header", "/components/header.html");
inject("footer", "/components/footer.html");
inject("cart", "/components/cart.html");
inject("product", "/components/product.html");  */

async function inject(id, file) {
  const el = document.getElementById(id);
  if (!el) return null;
  const res = await fetch(file);
  if (!res.ok) return null;
  el.innerHTML = await res.text();
  return el;
}

// Example usage with proper async/await
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await inject("header", "/components/header.html");
  } catch {}
  try {
    await inject("footer", "/components/footer.html");
  } catch {}

  const cartEl = await inject("cart", "/components/cart.html");
  if (cartEl) initCart();

  if (window.location.pathname.endsWith("shop.html")) {
    const productEl = await inject("product", "/components/product.html");
    if (productEl) initProducts();
  }
});
