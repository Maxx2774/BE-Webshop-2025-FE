export const addToCart = (product) => {
  toastr.options = {
    timeOut: "1500",
  };

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    if (existingProduct.quantity >= 50) {
      toastr.error(`Max antal för ${product.name} är 50 st.`);
      return;
    }
    existingProduct.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  toastr.success(`${product.name} har lagts till i din kundkorg!`);
  updateCartCount();
};

export function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0); // Summera kvantitet

  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = itemCount;
    cartCountElement.style.display = itemCount === 0 ? "none" : "inline-block";
  }

  const floatingCartCount = document.getElementById("floating-cart-count");
  if (floatingCartCount) {
    floatingCartCount.textContent = itemCount;
    floatingCartCount.style.display = itemCount === 0 ? "none" : "inline-block";
  }

  const cartCountBadge = document.getElementById("cart-count-badge");
  if (cartCountBadge) {
    cartCountBadge.textContent = itemCount;
    cartCountBadge.style.display = itemCount === 0 ? "none" : "inline-block";
  }
}

// Justerar till svensk valuta
export const currencySek = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
});

// Skapa produktkort
export const createProductCard = (product) => {
  const productLi = document.createElement("li");
  productLi.style.minWidth = "210px";
  productLi.classList.add("list-group-item");

  const isOutOfStock = product.stock_quantity <= 0;
  if (isOutOfStock) {
    productLi.classList.add("out-of-stock");
  }

  const productLink = document.createElement("a");
  productLink.classList.add("text-decoration-none");
  productLink.setAttribute("data-id", product.id);
  productLink.setAttribute("data-bs-toggle", "modal");
  productLink.setAttribute("data-bs-target", "#productModal");
  productLink.href = "#";

  const divImg = document.createElement("div");
  divImg.classList.add("d-flex", "justify-content-center");

  if (isOutOfStock) {
    const outOfStockBadge = document.createElement("div");
    outOfStockBadge.classList.add("out-of-stock-badge", "position-absolute");
    outOfStockBadge.innerHTML =
      '<span class="badge bg-danger">Slut i lager</span>';
    divImg.appendChild(outOfStockBadge);
  }

  const productImg = document.createElement("img");
  productImg.classList.add("img-fluid");
  productImg.style.height = "200px";
  productImg.src = product.image_url;

  const divProductInfo = document.createElement("div");
  divProductInfo.classList.add(
    "d-flex",
    "flex-column",
    "align-items-center",
    "fw-semibold",
    "pt-3"
  );

  const productTitle = document.createElement("p");
  productTitle.classList.add("text-dark");
  productTitle.textContent = product.name;

  const productPrice = document.createElement("p");
  productPrice.classList.add("text-danger", "fs-4");
  productPrice.textContent = currencySek.format(product.price);

  const divProductButton = document.createElement("div");
  divProductButton.classList.add("py-2");

  const productButton = document.createElement("button");
  productButton.classList.add("btn", "btn-sky", "w-100", "shadow-sm");
  productButton.textContent = "Köp";

  if (isOutOfStock) {
    productButton.classList.add("btn-secondary");
    productButton.textContent = "Tillfälligt slut";
    productButton.disabled = true;
  } else {
    productButton.classList.add("btn-sky");
    productButton.textContent = "Köp";
    productButton.addEventListener("click", (e) => {
      e.preventDefault();
      addToCart(product);
    });
  }

  divImg.append(productImg);
  divProductInfo.append(productTitle, productPrice);
  divProductButton.append(productButton);
  productLink.append(divImg, divProductInfo);
  productLi.append(productLink, divProductButton);

  return productLi;
};
