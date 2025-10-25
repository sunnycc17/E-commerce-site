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
<div class="highlight flex flex-col rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all bg-gradient-to-b from-[#FFEEF5] to-[#FFE0EB]">
  
  <!-- Image -->
  <div class="overflow-hidden">
    <img src="${p.image}" alt="Product image of ${p.name}"
      class="w-full h-40 sm:h-48 md:h-52 object-cover rounded-t-3xl transform hover:scale-105 transition duration-300">
  </div>
  
  <!-- Content -->
  <div class="p-4 flex flex-col gap-2">
    <h2 class="text-lg sm:text-xl font-bold text-gray-900">${p.name}</h2>
    <p class="text-[#A80054] font-semibold">$${p.price.toFixed(2)}</p>
  </div>
  
  <!-- Buttons container -->
  <div class="flex flex-col sm:flex-row w-full bg-[#A80054] p-3 gap-2 rounded-b-3xl mt-auto">
    
    <button class="relative group letters overflow-hidden bg-transparent text-white px-3 py-2 flex-1 cursor-pointer font-semibold">
      Add to Cart
      <span class="absolute bottom-0 left-0 w-full h-1 bg-rose-400 rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
    </button>
    
    <button class="relative group letters overflow-hidden bg-transparent text-white px-3 py-2 flex-1 cursor-pointer font-semibold">
      View Product
      <span class="absolute bottom-0 left-0 w-full h-1 bg-rose-400 rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
    </button>
    
  </div>
</div>`
        )
        .join("")
    : `<p class="text-white col-span-full text-center">No products available.</p>`;
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
