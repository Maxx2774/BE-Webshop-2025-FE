import { fetchProducts } from "../utils/api.js"

const homeProductListArr = [
  { selectId: "popular"},
  { selectId: "new"},
]

document.addEventListener("DOMContentLoaded", () => {
  homeProductListArr.forEach(item => loadProducts(item.selectId));
});

const currencySek = new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" });

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

  // Add event listener to the "Köp" button
  productButton.addEventListener("click", (e) => {
    e.preventDefault();
    addToCart(product); // Add product to cart when clicked
  });

  divImg.append(productImg);
  divProductInfo.append(productTitle, productPrice);
  divProductButton.append(productButton);
  productLink.append(divImg, divProductInfo);
  productLi.append(productLink, divProductButton);

  return productLi;
}

// // Function to add the product to cart in localStorage
// const addToCart = (product) => {
//   // Get existing cart from localStorage or initialize an empty array
//   let cart = JSON.parse(localStorage.getItem('cart')) || [];

//   // Add the product to the cart
//   cart.push(product);
//   console.log(cart.quantity);
  

//   // Save the updated cart back to localStorage
//   localStorage.setItem('cart', JSON.stringify(cart));

//   // Optionally, show a confirmation message or update UI
//   alert(`${product.name} has been added to your cart!`);
// }

// Uppdaterad addToCart funktion
const addToCart = (product) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let existingProduct = cart.find(item => item.id === product.id);

  if (existingProduct) {
      existingProduct.quantity += 1;
  } else {
      product.quantity = 1;
      cart.push(product);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart(); // Uppdatera UI
};

document.getElementById("productModal").addEventListener("show.bs.modal", async (event) => {
  const productId = Number(event.relatedTarget.dataset.id);
  const products = await fetchProducts();
  const currentProduct = products.find(product => product.id === productId);

  const modalProductRowDiv = document.createElement("div");
  modalProductRowDiv.classList.add("row");

  const modalImageDiv = document.createElement("div");
  modalImageDiv.classList.add("col-md-6", "mb-4", "d-flex", "align-items-center");

  const modalProductImg = document.createElement("img");
  modalProductImg.src = currentProduct.image_url;
  modalProductImg.alt = currentProduct.name;;
  modalProductImg.classList.add("img-fluid", "rounded", "mb-3");
  modalProductImg.style.height = "400px";
  modalProductImg.style.width = "auto";

  modalImageDiv.append(modalProductImg);

  const modalProductDetails = document.createElement("div");
  modalProductDetails.classList.add("col-md-6");

  const productName = document.createElement("p");
  productName.classList.add("mb-0", "fs-2", "fw-semibold");
  productName.textContent = currentProduct.name;

  const productCategory = document.createElement("p");
  productCategory.classList.add("text-secondary", "mb-3",);
  productCategory.textContent = `${currentProduct.categories.name} | ${currentProduct.weight} ${currentProduct.weight_unit}`;

  const priceDiv = document.createElement("div");
  priceDiv.classList.add("mb-3");

  const productPrice = document.createElement("span");
  productPrice.classList.add("text-danger", "fs-4", "me-2", "fw-semibold");
  productPrice.textContent = currencySek.format(currentProduct.price);

  priceDiv.append(productPrice);

  const productDescription = document.createElement("p");
  productDescription.classList.add("mb-3");
  productDescription.textContent = currentProduct.description;

  const productStockBadge = document.createElement("span");
  const stockClass = Number(currentProduct.stock_quantity) > 0 ? "text-bg-success" : "text-bg-danger";
  const stockText = Number(currentProduct.stock_quantity) > 0 ? "I lager" : "Ej i lager";
  productStockBadge.classList.add("badge", "mb-4", "p-2", "px-4", "fs-6", stockClass);
  productStockBadge.style.opacity = "75%";
  productStockBadge.textContent = stockText;

  const productCartButton = document.createElement("button");
  productCartButton.classList.add("btn", "btn-sky", "w-25", "shadow-sm")
  productCartButton.textContent = "Köp";

  modalProductDetails.append(productName, productCategory, priceDiv, productStockBadge, productDescription, productCartButton);
  modalProductRowDiv.append(modalImageDiv, modalProductDetails);
  productModal.append(modalProductRowDiv);
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
