// Justerar till svensk valuta
export const currencySek = new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" });

// Skapa produktkort
export const createProductCard = (product) => {

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