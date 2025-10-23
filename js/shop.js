document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("productGrid");
  const modal = document.getElementById("productModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalPrice = document.getElementById("modalPrice");
  const closeModal = document.getElementById("closeModal");

  const client = algoliasearch(
    "I8UR8SORU4",
    "8e2b8f50ac6866baf076264cd5554d51"
  );
  const index = client.initIndex("candies");

  let currentProducts = [];

  function renderProducts(hits) {
    currentProducts = hits;
    productGrid.innerHTML = hits.length
      ? hits
          .map(
            (p) => `
      <div class="bg-rose-400/50 p-4 rounded-lg shadow-md hover:shadow-lg transition">
        <img src="${p.image}" alt="${
              p.name
            }" class="w-full h-40 object-cover rounded-md mb-3">
        <h2 class="text-lg font-bold text-gray-800">${p.name}</h2>
        <p class="text-rose-600 font-semibold">$${p.price.toFixed(2)}</p>
        <button class="add-to-cart mt-3 bg-rose-600/80 text-white px-3 py-1 rounded hover:bg-rose-700 cursor-pointer"
          data-id="${p.objectID}" data-name="${p.name}" data-price="${p.price}">
          Add to Cart
        </button>
        <button class="view-product mt-3 border border-rose-600 text-rose-600 bg-pink-50 px-3 py-1 rounded hover:bg-rose-700 hover:text-white cursor-pointer"
          data-id="${p.objectID}">
          View Product
        </button>
      </div>`
          )
          .join("")
      : `<p class="text-center col-span-full text-gray-700">No products found.</p>`;
  }

  window.showProductInfo = function (objectID) {
    const p = currentProducts.find((prod) => prod.objectID === objectID);
    if (!p) return;

    modalImage.src = p.image;
    modalTitle.textContent = p.name;
    modalDescription.textContent = p.description || "No description available.";
    modalPrice.textContent = `$${p.price.toFixed(2)}`;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";

    const addToCartButton = document.getElementById("addToCartButton");
    addToCartButton.onclick = () =>
      window.addToCart?.(p.objectID, p.name, p.price);
  };

  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  });

  productGrid.addEventListener("click", (e) => {
    const t = e.target;
    if (t.classList.contains("view-product")) {
      showProductInfo(t.dataset.id);
    } else if (t.classList.contains("add-to-cart")) {
      const { id, name, price } = t.dataset;
      window.addToCart?.(id, name, Number(price));
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("query") || "";
  document.querySelector("#searchbox").value = initialQuery;
  document.querySelector("#mobile-searchbox").value = initialQuery;

  function searchProducts(query) {
    if (!query) return;
    index
      .search(query, { hitsPerPage: 50 })
      .then(({ hits }) => renderProducts(hits));
  }

  if (initialQuery) searchProducts(initialQuery);

  document
    .querySelectorAll("#searchbox, #mobile-searchbox")
    .forEach((input) => {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const query = input.value.trim();
          if (!query) return;
          window.location.href = `shop.html?query=${encodeURIComponent(query)}`;
        }
      });
    });
});
