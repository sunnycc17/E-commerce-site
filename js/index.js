document.addEventListener("DOMContentLoaded", () => {
  const client = algoliasearch(
    "I8UR8SORU4",
    "8e2b8f50ac6866baf076264cd5554d51"
  );
  const index = client.initIndex("candies");

  const newContainer = document.getElementById("newProducts");
  const bestSellerContainer = document.getElementById("bestSellers");

  if (!newContainer && !bestSellerContainer) return;

  let currentProducts = [];

  function renderProducts(container, hits) {
    if (!container) return;

    currentProducts = hits;

    container.innerHTML = hits.length
      ? `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      ${hits
        .map(
          (p) => `
        <div class="bg-white flex flex-col rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden border border-rose-100">
          
          <!-- Image -->
          <img src="${p.image}" alt="Product image of ${p.name}"
            class="w-full h-40 sm:h-44 object-cover transition-transform duration-300 hover:scale-105" />
          
          <!-- Content -->
          <div class="p-3 flex flex-col flex-1">
            <h2 class="text-lg sm:text-lg font-semibold text-gray-700 mb-1">${
              p.name
            }</h2>
            <p class="text-gray-700 font-medium text-sm">$${p.price.toFixed(
              2
            )}</p>
          </div>
          
          <!-- Buttons -->
          <div class="p-2 flex flex-col sm:flex-row justify-between gap-2 border-t border-rose-100 bg-rose-50">
            <button 
              class="add-to-cart px-3 py-1.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition w-full sm:w-auto"
              data-id="${p.objectID}" data-name="${p.name}" data-price="${
            p.price
          }">
              Add to Cart
            </button>
            <button 
              class="view-product px-3 py-1.5 text-rose-700 font-semibold hover:underline transition w-full sm:w-auto"
              data-id="${p.objectID}">
              View Product →
            </button>
          </div>
        </div>`
        )
        .join("")}
    </div>`
      : `<p class="text-gray-700 text-center col-span-full">No products available.</p>`;
  }

  // Fetch "New Products"
  index
    .search("", { filters: "new:true", hitsPerPage: 1000 })
    .then(({ hits }) => renderProducts(newContainer, hits))
    .catch(() => {
      if (newContainer)
        newContainer.innerHTML =
          '<p class="text-gray-700 text-center">Failed to load new products.</p>';
    });

  // Fetch "Best Sellers"
  index
    .search("", { filters: "bestSeller:true", hitsPerPage: 1000 })
    .then(({ hits }) => renderProducts(bestSellerContainer, hits))
    .catch(() => {
      if (bestSellerContainer)
        bestSellerContainer.innerHTML =
          '<p class="text-gray-700 text-center">Failed to load best sellers.</p>';
    });

  // Delegated button actions
  [newContainer, bestSellerContainer].forEach((container) => {
    if (!container) return;

    container.addEventListener("click", (e) => {
      const t = e.target;
      if (t.classList.contains("view-product")) {
        const product = currentProducts.find(
          (p) => p.objectID === t.dataset.id
        );
        if (product && typeof window.showProductInfo === "function") {
          window.showProductInfo(product);
        }
      }

      if (t.classList.contains("add-to-cart")) {
        const { id, name, price } = t.dataset;
        if (typeof window.addToCart === "function") {
          window.addToCart(id, name, Number(price));
        }
      }
    });
  });
});
