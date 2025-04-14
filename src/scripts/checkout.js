// Get cart from localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const baseUrl = "https://webshopbackend.vercel.app";

document.addEventListener("DOMContentLoaded", () => {
  const paymentRadios = document.querySelectorAll(
    'input[name="paymentMethod"]'
  );
  const cardNumberContainer = document.getElementById("card-number-container");

  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      cardNumberContainer.style.display =
        this.id === "creditCard" ? "block" : "none";
    });
  });

  cardNumberContainer.style.display = document.getElementById("creditCard")
    .checked
    ? "block"
    : "none";

  displayOrderSummary();

  const placeOrderButton = document.getElementById("place-order");
  if (placeOrderButton) {
    placeOrderButton.addEventListener("click", handleOrderSubmission);
  }
});

function formatPrice(price) {
  return `${price} kr`;
}

function displayOrderSummary() {
  const summaryContainer = document.getElementById("checkout-summary");
  if (!summaryContainer) return;

  summaryContainer.innerHTML = "";

  if (cart.length === 0) {
    summaryContainer.innerHTML =
      "<p class='text-center'>Din varukorg är tom</p>";
    document.getElementById("place-order").disabled = true;
    return;
  }

  // Create summary table
  const table = document.createElement("table");
  table.classList.add("table", "table-sm");

  // Table header
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Produkt</th>
      <th class="text-center">Antal</th>
      <th class="text-end">Pris</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  let subtotal = 0;

  cart.forEach((item) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = item.name;

    const quantityCell = document.createElement("td");
    quantityCell.textContent = item.quantity;
    quantityCell.classList.add("text-center");

    const priceCell = document.createElement("td");
    const itemTotal = item.price * item.quantity;
    priceCell.textContent = formatPrice(itemTotal);
    priceCell.classList.add("text-end");

    row.appendChild(nameCell);
    row.appendChild(quantityCell);
    row.appendChild(priceCell);
    tbody.appendChild(row);

    subtotal += itemTotal;
  });

  table.appendChild(tbody);

  const tfoot = document.createElement("tfoot");

  // Calculate values
  const shipping = 49;
  const taxRate = 0.12;
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + shipping;

  tfoot.innerHTML = `
    <tr>
      <td colspan="2"><strong>Delsumma:</strong></td>
      <td class="text-end">${formatPrice(subtotal)}</td>
    </tr>
    <tr>
      <td colspan="2"><strong>Moms (12%):</strong></td>
      <td class="text-end">${formatPrice(tax)}</td>
    </tr>
    <tr>
      <td colspan="2"><strong>Frakt:</strong></td>
      <td class="text-end">${formatPrice(shipping)}</td>
    </tr>
    <tr>
      <td colspan="2"><strong>Totalt:</strong></td>
      <td class="text-end"><strong>${formatPrice(total)}</strong></td>
    </tr>
  `;

  table.appendChild(tfoot);
  summaryContainer.appendChild(table);
}

// Handle order submission
async function handleOrderSubmission() {
  // Get form values
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const address2 = document.getElementById("address2").value;
  const city = document.getElementById("city").value;
  const zipCode = document.getElementById("zipCode").value;
  const notes = document.getElementById("notes").value;
  const paymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked'
  ).value;
  const cardNumber = document.getElementById("cardNumber").value;

  // Validate required fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !address ||
    !city ||
    !zipCode
  ) {
    alert("Vänligen fyll i alla obligatoriska fält");
    return;
  }

  // Validate card number if paying by card
  if (paymentMethod === "creditCard" && !cardNumber) {
    alert("Vänligen ange kortnummer");
    return;
  }

  // Format address
  const addressInfo = {
    first_name: firstName,
    last_name: lastName,
    street: address + (address2 ? ", " + address2 : ""),
    city: city,
    zip: zipCode,
  };

  // Format cart items
  const cartItems = cart.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
  }));

  // Calculate total cost
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 49;
  const total = subtotal + shipping;

  // Create order data object
  const orderData = {
    cart: cartItems,
    order_info: {
      payment_method:
        paymentMethod === "creditCard"
          ? "card"
          : paymentMethod === "swish"
          ? "swish"
          : "invoice",
      phone_number: phone,
      shipping_address: addressInfo,
      billing_address: addressInfo, // Using same address for billing and shipping
      customer_notes: notes,
      email: email,
      first_name: firstName,
      last_name: lastName,
      card_number: paymentMethod === "creditCard" ? cardNumber : null,
    },
    total_cost: total, // Include the total cost in the order data
  };

  try {
    // Display loading state
    const orderButton = document.getElementById("place-order");
    const originalText = orderButton.textContent;
    orderButton.textContent = "Bearbetar...";
    orderButton.disabled = true;

    // Send POST request to create order
    const response = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();

    // Clear cart
    localStorage.removeItem("cart");

    // Store order confirmation details in session storage
    sessionStorage.setItem(
      "orderConfirmation",
      JSON.stringify({
        orderData: orderData,
        result: result,
      })
    );

    // Redirect to confirmation page
    window.location.href = "/src/checkout/confirmation.html";
  } catch (error) {
    console.error("Error creating order:", error);
    alert("Det uppstod ett fel vid beställningen. Försök igen senare.");

    // Reset button state
    orderButton.textContent = originalText;
    orderButton.disabled = false;
  }
}
