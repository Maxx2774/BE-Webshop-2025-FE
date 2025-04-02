import { fetchProducts } from '../utils/api.js'

const homeProductListArr = [
  { selectId: "popular"},
  { selectId: "new"},
]

document.addEventListener('DOMContentLoaded', () => {
  homeProductListArr.forEach(item => loadProducts(item.selectId));
});

const loadProducts = async (sectionId) => {
  const productListUl = document.getElementById(`${sectionId}-product-list`);
  productListUl.innerHTML = "<p>Läser in produkter...</p>";
  
  let products = await fetchProducts();
  productListUl.innerHTML = "";

  if (sectionId === "new") {
    products = products.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8);
  } else {
    products = products.slice(0, 8);
  }

  // Lägg till produktkort för varje produkt
  products.forEach(product => {
    const productList = createProductCard(product);
    productListUl.append(productList);
  });
};

// Skapa produktkort
const createProductCard = (product) => {
  const currencySek = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' });

  const productLi = document.createElement("li");
  productLi.classList.add("list-group-item", "shadow-sm");

  const productLink = document.createElement("a");
  productLink.classList.add("text-decoration-none");
  productLink.setAttribute("data-id", product.id)
  productLink.setAttribute("data-bs-toggle", "modal")
  productLink.setAttribute("data-bs-target", "#productModal")
  productLink.href = "#"

  const divImg = document.createElement("div");
  divImg.classList.add("d-flex", "justify-content-center");

  const productImg = document.createElement("img");
  productImg.classList.add("img-fluid");
  productImg.style.height = "200px";
  productImg.src = product.image_url;

  const divProductInfo = document.createElement("div");
  divProductInfo.classList.add("d-flex", "flex-column", "align-items-center", "fw-semibold", "pt-3");

  const productTitle = document.createElement("p");
  productTitle.classList.add("text-dark");
  productTitle.textContent = product.name;

  const productPrice = document.createElement("p");
  productPrice.classList.add("text-danger", "fs-4");
  productPrice.textContent = currencySek.format(product.price);

  const divProductButton = document.createElement("div");
  divProductButton.classList.add("py-2");
  
  const productButton = document.createElement("button");
  productButton.classList.add("btn", "btn-sky", "w-100", "shadow-sm")
  productButton.textContent = "Köp";

  divImg.append(productImg);
  divProductInfo.append(productTitle, productPrice);
  divProductButton.append(productButton);
  productLink.append(divImg, divProductInfo);
  productLi.append(productLink, divProductButton);

  return productLi;
}

document.getElementById("productModal").addEventListener("show.bs.modal", (event) => {
  const productId = Number(event.relatedTarget.dataset.id);
  const currentProduct = productData.find(product => product.id === productId);

  const img = document.getElementById("img");
  img.src = currentProduct.image_url;
  img.style.height = "200px";

  const stockBadge = document.getElementById("stock");
  const stockClass = currentProduct.in_stock ? "text-bg-success" : "text-bg-danger";
  const stockText = currentProduct.in_stock ? "I lager" : "Ej i lager";
  stockBadge.classList.add("badge", stockClass);
  stockBadge.textContent = stockText;

  document.getElementById("name").textContent = currentProduct.name;
});

// ----------------------------------------------------------------------
document.querySelectorAll(".category-link").forEach(item => {
  item.addEventListener("click", function(event) {
      event.preventDefault();
      document.querySelectorAll(".category-link").forEach(link => {
          link.classList.remove("bg-white", "rounded", "px-2");
      });
      this.classList.add("bg-white", "rounded", "px-2");
      this.style.borderColor = "#0d47a1";
  });
});

document.querySelectorAll(".category-link").forEach(item => {
item.addEventListener("mouseover", function() {
  this.style.backgroundColor = "white";
});

item.addEventListener("mouseout", function() {
  this.style.backgroundColor = "transparent";
});
});