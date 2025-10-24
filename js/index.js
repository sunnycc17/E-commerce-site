document.addEventListener("DOMContentLoaded", () => {
  const client = algoliasearch(
    "I8UR8SORU4",
    "8e2b8f50ac6866baf076264cd5554d51"
  );
  const index = client.initIndex("candies");

  const newContainer = document.getElementById("newProducts");
  const bestSellerContainer = document.getElementById("bestSellers");

  // Make this global inside DOMContentLoaded
  let currentProducts = [];

  function renderProducts(container, hits) {
    currentProducts = hits; // store all hits for modal reference
    container.innerHTML = hits.length
      ? hits
          .map(
            (p) => `
    <div class="bg-rose-400/50 p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition flex flex-col">
      <img src="${p.image}" alt="Product image of ${p.name}"
      class="w-full h-36 sm:h-40 md:h-44 lg:h-48 object-cover rounded-md mb-3 sm:mb-4">
      <h2 class="text-md sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">${
        p.name
      }</h2>
      <p class="text-rose-600 font-semibold mb-2 sm:mb-3">$${p.price.toFixed(
        2
      )}</p>
      <div class="flex flex-col sm:flex-row gap-2">
        <button class="add-to-cart bg-rose-600/80 text-white px-3 py-1 rounded hover:bg-rose-700 cursor-pointer flex-1"
          data-id="${p.objectID}" data-name="${p.name}" data-price="${p.price}">
          Add to Cart
        </button>
        <button class="view-product border border-rose-600 text-rose-600 bg-pink-50 px-3 py-1 rounded hover:bg-rose-700 hover:text-white cursor-pointer flex-1"
          data-id="${p.objectID}">
          View Product
        </button>
      </div>
    </div>`
          )
          .join("")
      : `<p class="text-gray-700 col-span-full text-center">No products available.</p>`;
  }

  index
    .search("", { filters: "new:true", hitsPerPage: 1000 })
    .then(({ hits }) => {
      renderProducts(newContainer, hits);
    });

  index
    .search("", { filters: "bestSeller:true", hitsPerPage: 1000 })
    .then(({ hits }) => {
      renderProducts(bestSellerContainer, hits);
    });

  // Event delegation
  [newContainer, bestSellerContainer].forEach((container) => {
    container.addEventListener("click", (e) => {
      const t = e.target;
      if (t.classList.contains("view-product")) {
        const objectID = t.dataset.id;
        const product = currentProducts.find((p) => p.objectID === objectID);
        if (product && window.showProductInfo) {
          window.showProductInfo(product);
        }
      }
      if (t.classList.contains("add-to-cart")) {
        const { id, name, price } = t.dataset;
        window.addToCart?.(id, name, Number(price));
      }
    });
  });
});
