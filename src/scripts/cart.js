const renderCart = () => {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalPrice = 0;
  let prucent = 0.12;
  const deliveryCost = 50; // Fast leveranskostnad

  // Skapa container för varukorg + sammanfattning
  const cartWrapper = document.createElement("div");
  cartWrapper.classList.add("d-flex", "justify-content-between", "gap-4");

  // Skapa en div för varorna
  const cartItemsDiv = document.createElement("div");
  cartItemsDiv.classList.add("w-75"); // 75% bredd för produkterna

  cart.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add(
      "card",
      "mb-2",
      "p-2",
      "d-flex",
      "flex-row",
      "align-items-center",
      "gap-2"
    );

    const img = document.createElement("img");
    img.src = product.image_url;
    img.classList.add("img-fluid");
    img.style.width = "80px";

    const textDiv = document.createElement("div");
    textDiv.classList.add("flex-grow-1");
    textDiv.innerHTML = `<p class='mb-1 fw-bold'>${product.name}</p>
                             <p class='text-danger fw-semibold'>
                               ${new Intl.NumberFormat("sv-SE", {
                                 style: "currency",
                                 currency: "SEK",
                               }).format(product.price)}
                             </p>`;

    const quantityDiv = document.createElement("div");
    quantityDiv.classList.add("d-flex", "align-items-center", "gap-2");

    const minusBtn = document.createElement("button");
    minusBtn.classList.add("btn", "btn-outline-danger", "btn-sm");
    minusBtn.textContent = "-";
    minusBtn.onclick = () => updateQuantity(product.id, -1);

    const quantitySpan = document.createElement("span");
    quantitySpan.textContent = product.quantity;
    quantitySpan.classList.add("fw-bold");

    const plusBtn = document.createElement("button");
    plusBtn.classList.add("btn", "btn-outline-success", "btn-sm");
    plusBtn.textContent = "+";
    plusBtn.onclick = () => updateQuantity(product.id, 1);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "btn-outline-danger", "btn-sm");
    deleteBtn.textContent = "Ta bort";
    deleteBtn.onclick = () => removeProductFromCart(product.id);

    quantityDiv.append(minusBtn, quantitySpan, plusBtn, deleteBtn);
    card.append(img, textDiv, quantityDiv);
    cartItemsDiv.appendChild(card);
    //let sum = product.price * product.quantity;
    //let totmedmoms = sum + totalPrice;        
    totalPrice += product.price * product.quantity;; // Uppdatera totalpris
    
  });

  // Skapa en div för totalsumman
  const cartSummaryDiv = document.createElement("div");
  cartSummaryDiv.classList.add(
    "w-25",
    "bg-light",
    "p-3",
    "rounded",
    "shadow-sm"
  );
  cartSummaryDiv.style.height = "300px";
  cartSummaryDiv.innerHTML = `
        <h5 class="fw-bold">Orderöversikt</h5>
        <p><strong>Antal produkter:</strong> <span id="total-products">${
          cart.length
        }</span></p>
        <p><strong>Totalpris varor:</strong> <span id="total-price">${new Intl.NumberFormat(
          "sv-SE",
          { style: "currency", currency: "SEK" }
        ).format(totalPrice)}</span></p>
        <p><strong>Leveranskostnad:</strong> <span id="delivery-cost">${new Intl.NumberFormat(
          "sv-SE",
          { style: "currency", currency: "SEK" }
        ).format(deliveryCost)}</span></p>
        <hr>
        <h5><strong>Totalt att betala:</strong> <span id="total-with-delivery">${new Intl.NumberFormat(
          "sv-SE",
          { style: "currency", currency: "SEK" }
        ).format(totalPrice + deliveryCost)}</span></h5>
    `;

  // Lägg till varor och totalsumma i cartWrapper
  cartWrapper.appendChild(cartItemsDiv);
  cartWrapper.appendChild(cartSummaryDiv);

  // Lägg till allt i cartContainer
  cartContainer.appendChild(cartWrapper);
};

// Funktion för att uppdatera produktens kvantitet
const updateQuantity = (productId, change) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let product = cart.find((item) => item.id === productId);

  if (product) {
    product.quantity += change;
    if (product.quantity <= 0) {
      cart = cart.filter((item) => item.id !== productId);
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart(); // Uppdatera hela varukorgen
};

// Funktion för att ta bort en produkt från varukorgen
const removeProductFromCart = (productId) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart(); // Uppdatera efter borttagning
};

// Kör renderCart vid sidladdning
document.addEventListener("DOMContentLoaded", renderCart);
