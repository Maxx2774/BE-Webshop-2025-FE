import { getBaseUrl, fetchData } from "../utils/api.js";
import { createProductCard } from "./services.js";

const updateProductContainer = (data, title, containerId) => {
  const productContainer = document.getElementById(containerId);
  productContainer.innerHTML = "";

  if (data.length === 0 || data.status === 404) {
    productContainer.innerHTML = `<p class='fs-4 fw-semibold mb-3'>${title} inga resultat hittades.</p>`;
    return;
  }

  const productResultDiv = document.createElement("div");
  const productResultText = document.createElement("p");
  productResultText.classList.add("fs-4", "fw-semibold", "mb-3");
  productResultText.innerHTML = title;

  const productResultUl = document.createElement("ul");
  productResultUl.classList.add("list-group", "list-group-horizontal");
  productResultUl.setAttribute("id", "result-product-list");

  data.forEach((product) => {
    const resultProducts = createProductCard(product);
    productResultUl.append(resultProducts);
  });

  productResultDiv.append(productResultText, productResultUl);
  productContainer.append(productResultDiv);
};

const fetchProducts = async (endpoint, params) => {
  try {
    const response = await axios.get(
      `${getBaseUrl().replace(/\/$/, "")}${endpoint}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const productSearch = async (searchQ) => {
  if (!searchQ.trim()) {
    document.getElementById("product-container").innerHTML = "";
    return;
  }

  history.pushState(null, "", `?search=${encodeURIComponent(searchQ)}`);
  const data = await fetchProducts("/products", { search: searchQ });
  updateProductContainer(
    data,
    `Resultat för produkt <span class="fw-bold">${searchQ}</span>`,
    "product-container"
  );
};

document
  .getElementById("search-product-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    let searchQ = document.getElementById("search-product-q").value;
    if (searchQ) await productSearch(searchQ);
  });

window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);
  const searchQ = params.get("search");

  if (searchQ) {
    document.getElementById("search-product-q").value = searchQ;
    productSearch(searchQ);
  }
});

const getCategorySlug = async (categoryId) => {
  const categories = await fetchData("categories");
  return categories.find((category) => category.id === Number(categoryId));
};

const productCategory = async (categoryId) => {
  if (!categoryId) {
    document.getElementById("product-container").innerHTML = "";
    return;
  }

  let category = await getCategorySlug(categoryId);
  history.pushState(null, "", `?category=${category.slug}`);
  const data = await fetchProducts("/products", { category_id: categoryId });
  updateProductContainer(
    data,
    `<div class="d-flex flex-column align-items-start mb-3">
    <div class="d-flex align-items-center mb-2">
      <span class="badge bg-dark-subtle text-dark">KATEGORI</span>
      <a href="index.html" class="text-decoration-none text-secondary ms-2">
        <i class="fas fa-times"></i>
      </a>
    </div>
      <h2 class="fs-2 fw-bold text-dark mb-0">${category.name}</h2>
    </div>`,
    "product-container"
  );
};

document.addEventListener("click", async (event) => {
  if (event.target.matches(".category-link")) {
    event.preventDefault();

    document.querySelectorAll(".category-link").forEach((link) => {
      link.classList.remove("active-category");
    });
    event.target.classList.add("active-category");

    const categoryId = event.target.dataset.categoryId;

    if (categoryId) {
      let categorySlug = await getCategorySlug(categoryId);
      history.pushState(null, "", `?category=${categorySlug.slug}`);
      await productCategory(categoryId);
    }
  }
});

window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);
  const categoryId = params.get("category_id");

  if (categoryId) {
    productCategory(categoryId);
  }
});
