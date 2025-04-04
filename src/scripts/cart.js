const cart = JSON.parse(localStorage.getItem("cart")) || [];
const shippingCost = 49; // Fixed shipping cost
const taxRate = 0.12;
console.log(cart.length);


document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});

function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateSummary();
}

function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    const continueButtonContainer = document.getElementById("continue-button-container");
    cartContainer.innerHTML = "";
    continueButtonContainer.innerHTML = ""; // Clear the existing button if any

    cart.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("d-flex", "align-items-center", "border-bottom", "pb-2", "mb-2", "p-2", "flex-wrap");

        // Product Image (Responsive)
        const productImg = document.createElement("img");
        productImg.src = product.image_url;
        productImg.style.width = "50px";
        productImg.classList.add("me-3", "img-fluid");

        // Product Name (Fixed Width)
        const productName = document.createElement("div");
        productName.innerHTML = `<strong>${product.name}</strong>`;
        productName.classList.add("text-truncate"); 
        productName.style.width = "150px"; // Ensure consistent width
        productName.style.whiteSpace = "nowrap";
        productName.style.overflow = "hidden";
        productName.style.textOverflow = "ellipsis";

        // Quantity Controls (Editable Input)
        const quantityContainer = document.createElement("div");
        quantityContainer.classList.add("d-flex", "align-items-center", "justify-content-center", "flex-grow-1");

        const minusBtn = document.createElement("button");
        minusBtn.textContent = "-";
        minusBtn.classList.add("btn", "btn-outline-secondary", "me-1");
        minusBtn.onclick = () => changeQuantity(product.id, -1);

        const quantityInput = document.createElement("input");
        quantityInput.type = "text";  // Change to text input to allow custom values
        quantityInput.value = product.quantity;
        quantityInput.classList.add("form-control", "text-center");
        quantityInput.style.width = "50px";
        
        // Allow only numeric input
        quantityInput.addEventListener('input', (event) => {
            let newQuantity = event.target.value.replace(/\D/g, ''); // Remove non-digit characters
            if (newQuantity === '') {
                newQuantity = 0; // If empty, reset to 0
            }
            event.target.value = newQuantity;
            product.quantity = parseInt(newQuantity);
            updateCart();  // Update the cart and summary
        });

        const plusBtn = document.createElement("button");
        plusBtn.textContent = "+";
        plusBtn.classList.add("btn", "btn-outline-secondary", "ms-1");
        plusBtn.onclick = () => changeQuantity(product.id, 1);

        quantityContainer.append(minusBtn, quantityInput, plusBtn);

        // Price (Fixed Width for Alignment)
        const productPrice = document.createElement("div");
        productPrice.innerHTML = `${product.price} kr`;
        productPrice.classList.add("text-end");
        productPrice.style.width = "80px"; // Ensures price column is aligned

        // Remove Button (Fixed Position on Right)
        const removeBtn = document.createElement("button");
        removeBtn.classList.add("btn", "btn-sm", "px-2", "py-1", "ms-3");
        const trashIcon = document.createElement("i");
        trashIcon.classList.add("bi", "bi-trash3", "text-danger");
        removeBtn.appendChild(trashIcon);
        removeBtn.onclick = () => removeFromCart(product.id);

        // Flex Container for Name & Quantity (Ensures Alignment)
        const nameAndQuantityWrapper = document.createElement("div");
        nameAndQuantityWrapper.classList.add("d-flex", "align-items-center", "flex-grow-1", "flex-wrap");
        nameAndQuantityWrapper.append(productName, quantityContainer);

        // Append elements to product card in order
        productCard.append(productImg, nameAndQuantityWrapper, productPrice, removeBtn);
        cartContainer.append(productCard);
    });

    // Create Continue button if there are products in the cart
    if (cart.length > 0) {
        const continueBtnContainer = document.createElement("div");
        continueBtnContainer.classList.add("d-flex", "justify-content-center", "mt-3");

        const continueBtn = document.createElement("button");
        continueBtn.textContent = "Till kassan";
        continueBtn.classList.add("btn", "btn-success");
        continueBtn.style.width = "100%";

        continueBtnContainer.append(continueBtn);
        continueButtonContainer.append(continueBtnContainer); // Add the button to the summary section
    }

    updateSummary();
}

function changeQuantity(id, amount) {
    let product = cart.find(item => item.id === id);
    if (product) {
        product.quantity += amount;
        if (product.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCart();
        }
    }
}

function removeFromCart(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        cart.splice(index, 1);
    }
    updateCart();
}

function updateSummary() {
    const totalProductPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalTax = totalProductPrice * taxRate;
    const totalCost = totalProductPrice + shippingCost;
    
    document.getElementById("total-product-price").textContent = `${totalProductPrice} kr`;
    document.getElementById("tax").textContent = `${totalTax.toFixed(2)} kr`;
    document.getElementById("shipping-cost").textContent = `${shippingCost} kr`;
    document.getElementById("total-cost").textContent = `${totalCost} kr`;
}