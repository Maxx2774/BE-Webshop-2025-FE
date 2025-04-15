import { fetchData } from "../utils/api.js";
import {
  createProductCard,
  currencySek,
  updateCartCount,
  addToCart,
} from "./services.js";

const homeProductListArr = [{ selectId: "popular" }, { selectId: "new" }];
const homeCategoryListArr = [
  { selectId: "categories-mobile-list" },
  { selectId: "categories-list" },
];

document.addEventListener("DOMContentLoaded", () => {
  homeProductListArr.forEach((item) => loadProducts(item.selectId));
  homeCategoryListArr.forEach((item) => loadCategories(item.selectId));
});

const loadProducts = async (sectionId) => {
  const productListUl = document.getElementById(`${sectionId}-product-list`);
  productListUl.innerHTML = "<p>Läser in produkter...</p>";

  let products = await fetchData("products");
  productListUl.innerHTML = "";

  if (sectionId === "new") {
    products = products
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 8);
  } else {
    products = products.slice(0, 8);
  }

  products.forEach((product) => {
    const productList = createProductCard(product);
    productListUl.append(productList);
  });
};

document
  .getElementById("productModal")
  .addEventListener("show.bs.modal", async (event) => {
    const productModal = document.getElementById("modal-product-details");
    productModal.innerHTML = "";

    const productId = Number(event.relatedTarget.dataset.id);
    let products = await fetchData("products");
    const currentProduct = products.find((product) => product.id === productId);

    const isOutOfStock = currentProduct.stock_quantity <= 0;

    const modalProductRowDiv = document.createElement("div");
    modalProductRowDiv.classList.add("row");

    const modalImageDiv = document.createElement("div");
    modalImageDiv.classList.add(
      "col-md-6",
      "mb-4",
      "d-flex",
      "justify-content-center",
      "align-items-center"
    );

    const modalProductImg = document.createElement("img");
    modalProductImg.src = currentProduct.image_url;
    modalProductImg.alt = currentProduct.name;
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
    productCategory.classList.add("text-secondary", "mb-3");
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
    const stockClass =
      Number(currentProduct.stock_quantity) > 0
        ? "text-bg-success"
        : "text-bg-danger";
    const stockText =
      Number(currentProduct.stock_quantity) > 0 ? "I lager" : "Ej i lager";
    productStockBadge.classList.add(
      "badge",
      "mb-4",
      "p-2",
      "px-4",
      "fs-6",
      stockClass
    );
    productStockBadge.style.opacity = "75%";
    productStockBadge.textContent = stockText;

    const productCartButton = document.createElement("button");

    if (isOutOfStock) {
      productCartButton.classList.add("btn", "btn-secondary", "w-100");
      productCartButton.textContent = "Tillfälligt slut";
      productCartButton.disabled = true;
    } else {
      productCartButton.classList.add("btn", "btn-sky", "w-100");
      productCartButton.textContent = "Köp";
      productCartButton.addEventListener("click", () => {
        addToCart(currentProduct);
      });
    }

    modalProductDetails.append(
      productName,
      productCategory,
      priceDiv,
      productStockBadge,
      productDescription,
      productCartButton
    );
    modalProductRowDiv.append(modalImageDiv, modalProductDetails);
    productModal.append(modalProductRowDiv);
  });

//Hämtas alla kategorier
const loadCategories = async (sectionId) => {
  const categoriesListUl = document.getElementById(sectionId);
  let categories = await fetchData("categories");

  categoriesListUl.innerHTML = "";

  categories.forEach((category) => {
    const li = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.classList.add(
      "d-flex",
      "align-items-center",
      "text-decoration-none",
      "text-dark",
      "py-2",
      "category-link"
    );
    anchor.href = "#";
    anchor.setAttribute("data-category-id", category.id);

    const i = document.createElement("i");

    let icon = category.icon.split(" ");
    i.classList.add(...icon, "me-2");

    anchor.append(i, category.name);
    li.append(anchor);
    categoriesListUl.append(li);
  });
};

// ----------------------------------------------------------------------
document.querySelectorAll(".category-link").forEach((item) => {
  item.addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelectorAll(".category-link").forEach((link) => {
      link.classList.remove("bg-white", "rounded", "px-2");
    });
    this.classList.add("bg-white", "rounded", "px-2");
    this.style.borderColor = "#0d47a1";
  });
});

document.querySelectorAll(".category-link").forEach((item) => {
  item.addEventListener("mouseover", function () {
    this.style.backgroundColor = "white";
  });

  item.addEventListener("mouseout", function () {
    this.style.backgroundColor = "transparent";
  });
});

// Automatisk uppdatering varje halvsekund (ifall något ändras manuellt eller från annan vy)
setInterval(updateCartCount, 500);

// Kör uppdatering vid sidladdning
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});
