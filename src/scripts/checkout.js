import { getBaseUrl } from "../utils/api.js";
import { currencySek } from "./services.js";

// Hämtar varukorgen från localStorage??
const cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  const paymentRadios = document.querySelectorAll(
    'input[name="paymentMethod"]'
  );

  setupFormValidation();

  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      updatePaymentFieldsVisibility();
    });
  });

  updatePaymentFieldsVisibility();

  displayOrderSummary();

  const placeOrderButton = document.getElementById("place-order");
  if (placeOrderButton) {
    placeOrderButton.addEventListener("click", handleOrderSubmission);
  }
});

function updatePaymentFieldsVisibility() {
  const selectedPayment = document.querySelector(
    'input[name="paymentMethod"]:checked'
  ).id;
  const cardNumberContainer = document.getElementById("card-number-container");

  cardNumberContainer.style.display = "none";

  if (selectedPayment === "creditCard") {
    cardNumberContainer.style.display = "block";
  }
}

function setupFormValidation() {
  const emailInput = document.getElementById("email");
  emailInput.addEventListener("input", function () {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value) && this.value.length > 0) {
      this.classList.add("is-invalid");
      if (
        !this.nextElementSibling ||
        !this.nextElementSibling.classList.contains("invalid-feedback")
      ) {
        const feedback = document.createElement("div");
        feedback.classList.add("invalid-feedback");
        feedback.textContent = "Vänligen ange en giltig e-postadress.";
        this.parentNode.insertBefore(feedback, this.nextSibling);
      }
    } else {
      this.classList.remove("is-invalid");
      if (
        this.nextElementSibling &&
        this.nextElementSibling.classList.contains("invalid-feedback")
      ) {
        this.nextElementSibling.remove();
      }
    }
  });

  const cardInput = document.getElementById("cardNumber");
  if (cardInput) {
    cardInput.addEventListener("input", function (e) {
      this.value = this.value.replace(/\D/g, "");

      if (this.value.length > 16) {
        this.value = this.value.slice(0, 16);
      }

      if (this.value.length > 0 && this.value.length < 16) {
        this.classList.add("is-invalid");
        if (
          !this.nextElementSibling ||
          !this.nextElementSibling.classList.contains("invalid-feedback")
        ) {
          const feedback = document.createElement("div");
          feedback.classList.add("invalid-feedback");
          feedback.textContent = "Kortnumret måste innehålla 16 siffror.";
          this.parentNode.insertBefore(feedback, this.nextSibling);
        }
      } else {
        this.classList.remove("is-invalid");
        if (
          this.nextElementSibling &&
          this.nextElementSibling.classList.contains("invalid-feedback")
        ) {
          this.nextElementSibling.remove();
        }
      }
    });
  }

  const phoneInput = document.getElementById("phone");
  phoneInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");

    if (this.value.length > 12) {
      this.value = this.value.slice(0, 12);
    }

    if (this.value.length > 0 && this.value.length < 8) {
      this.classList.add("is-invalid");
      if (
        !this.nextElementSibling ||
        !this.nextElementSibling.classList.contains("invalid-feedback")
      ) {
        const feedback = document.createElement("div");
        feedback.classList.add("invalid-feedback");
        feedback.textContent = "Telefonnumret måste innehålla minst 8 siffror.";
        this.parentNode.insertBefore(feedback, this.nextSibling);
      }
    } else {
      this.classList.remove("is-invalid");
      if (
        this.nextElementSibling &&
        this.nextElementSibling.classList.contains("invalid-feedback")
      ) {
        this.nextElementSibling.remove();
      }
    }
  });

  const zipInput = document.getElementById("zipCode");
  zipInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");

    // Max 5 bokstäver då det är svenskt postkod
    if (this.value.length > 5) {
      this.value = this.value.slice(0, 5);
    }

    if (this.value.length > 0 && this.value.length < 5) {
      this.classList.add("is-invalid");
      if (
        !this.nextElementSibling ||
        !this.nextElementSibling.classList.contains("invalid-feedback")
      ) {
        const feedback = document.createElement("div");
        feedback.classList.add("invalid-feedback");
        feedback.textContent = "Postnummer måste innehålla 5 siffror.";
        this.parentNode.insertBefore(feedback, this.nextSibling);
      }
    } else {
      this.classList.remove("is-invalid");
      if (
        this.nextElementSibling &&
        this.nextElementSibling.classList.contains("invalid-feedback")
      ) {
        this.nextElementSibling.remove();
      }
    }
  });

  const nameInputs = [
    document.getElementById("firstName"),
    document.getElementById("lastName"),
  ];

  nameInputs.forEach((input) => {
    input.addEventListener("input", function () {
      if (this.value.length > 50) {
        this.value = this.value.slice(0, 50);
      }
    });
  });

  const addressInputs = [
    document.getElementById("address"),
    document.getElementById("address2"),
    document.getElementById("city"),
  ];

  addressInputs.forEach((input) => {
    input.addEventListener("input", function () {
      if (this.value.length > 100) {
        this.value = this.value.slice(0, 100);
      }
    });
  });

  const notesInput = document.getElementById("notes");
  notesInput.addEventListener("input", function () {
    if (this.value.length > 500) {
      this.value = this.value.slice(0, 500);

      if (!document.getElementById("notes-counter")) {
        const counter = document.createElement("small");
        counter.id = "notes-counter";
        counter.classList.add("text-muted");
        this.parentNode.appendChild(counter);
      }

      document.getElementById(
        "notes-counter"
      ).textContent = `${this.value.length}/500 tecken`;
    }
  });
}

function formatPrice(price) {
  return currencySek.format(price);
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

  const table = document.createElement("table");
  table.classList.add("table", "table-sm");

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

async function handleOrderSubmission() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const address2 = document.getElementById("address2").value.trim();
  const city = document.getElementById("city").value.trim();
  const zipCode = document.getElementById("zipCode").value.trim();
  const notes = document.getElementById("notes").value.trim();
  const paymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked'
  ).id;
  const cardNumber = document.getElementById("cardNumber").value.trim();

  const inputs = document.querySelectorAll(".form-control");
  inputs.forEach((input) => input.classList.remove("is-invalid"));

  let isValid = true;
  const requiredFields = [
    { field: firstName, id: "firstName", message: "Förnamn måste anges" },
    { field: lastName, id: "lastName", message: "Efternamn måste anges" },
    { field: email, id: "email", message: "E-post måste anges" },
    { field: phone, id: "phone", message: "Telefonnummer måste anges" },
    { field: address, id: "address", message: "Adress måste anges" },
    { field: city, id: "city", message: "Stad måste anges" },
    { field: zipCode, id: "zipCode", message: "Postnummer måste anges" },
  ];

  requiredFields.forEach((item) => {
    if (!item.field) {
      document.getElementById(item.id).classList.add("is-invalid");
      if (
        !document.getElementById(item.id).nextElementSibling ||
        !document
          .getElementById(item.id)
          .nextElementSibling.classList.contains("invalid-feedback")
      ) {
        const feedback = document.createElement("div");
        feedback.classList.add("invalid-feedback");
        feedback.textContent = item.message;
        document
          .getElementById(item.id)
          .parentNode.insertBefore(
            feedback,
            document.getElementById(item.id).nextSibling
          );
      }
      isValid = false;
    }
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    document.getElementById("email").classList.add("is-invalid");
    if (
      !document.getElementById("email").nextElementSibling ||
      !document
        .getElementById("email")
        .nextElementSibling.classList.contains("invalid-feedback")
    ) {
      const feedback = document.createElement("div");
      feedback.classList.add("invalid-feedback");
      feedback.textContent = "Vänligen ange en giltig e-postadress";
      document
        .getElementById("email")
        .parentNode.insertBefore(
          feedback,
          document.getElementById("email").nextSibling
        );
    }
    isValid = false;
  }

  const phoneRegex = /^\d{8,12}$/;
  if (phone && !phoneRegex.test(phone)) {
    document.getElementById("phone").classList.add("is-invalid");
    if (
      !document.getElementById("phone").nextElementSibling ||
      !document
        .getElementById("phone")
        .nextElementSibling.classList.contains("invalid-feedback")
    ) {
      const feedback = document.createElement("div");
      feedback.classList.add("invalid-feedback");
      feedback.textContent = "Telefonnumret måste innehålla 8-12 siffror";
      document
        .getElementById("phone")
        .parentNode.insertBefore(
          feedback,
          document.getElementById("phone").nextSibling
        );
    }
    isValid = false;
  }

  const zipRegex = /^\d{5}$/;
  if (zipCode && !zipRegex.test(zipCode)) {
    document.getElementById("zipCode").classList.add("is-invalid");
    if (
      !document.getElementById("zipCode").nextElementSibling ||
      !document
        .getElementById("zipCode")
        .nextElementSibling.classList.contains("invalid-feedback")
    ) {
      const feedback = document.createElement("div");
      feedback.classList.add("invalid-feedback");
      feedback.textContent = "Postnummer måste innehålla 5 siffror";
      document
        .getElementById("zipCode")
        .parentNode.insertBefore(
          feedback,
          document.getElementById("zipCode").nextSibling
        );
    }
    isValid = false;
  }

  if (paymentMethod === "creditCard") {
    const cardRegex = /^\d{16}$/;
    if (!cardNumber || !cardRegex.test(cardNumber)) {
      document.getElementById("cardNumber").classList.add("is-invalid");
      if (
        !document.getElementById("cardNumber").nextElementSibling ||
        !document
          .getElementById("cardNumber")
          .nextElementSibling.classList.contains("invalid-feedback")
      ) {
        const feedback = document.createElement("div");
        feedback.classList.add("invalid-feedback");
        feedback.textContent = "Kortnummer måste innehålla 16 siffror";
        document
          .getElementById("cardNumber")
          .parentNode.insertBefore(
            feedback,
            document.getElementById("cardNumber").nextSibling
          );
      }
      isValid = false;
    }
  }

  if (!isValid) {
    const firstInvalid = document.querySelector(".is-invalid");
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  const addressInfo = {
    first_name: firstName,
    last_name: lastName,
    street: address + (address2 ? ", " + address2 : ""),
    city: city,
    zip: zipCode,
  };

  const cartItems = cart.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
  }));

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 49;
  const total = subtotal + shipping;

  const orderData = {
    cart: cartItems,
    order_info: {
      payment_method:
        paymentMethod === "creditCard"
          ? "card"
          : paymentMethod === "swish"
          ? "swish"
          : "klarna",
      phone_number: phone,
      shipping_address: addressInfo,
      billing_address: addressInfo,
      customer_notes: notes,
      email: email,
      first_name: firstName,
      last_name: lastName,
      card_number: paymentMethod === "creditCard" ? cardNumber : null,
    },
    total_cost: total,
  };

  try {
    const orderButton = document.getElementById("place-order");
    const originalText = orderButton.textContent;
    orderButton.textContent = "Bearbetar...";
    orderButton.disabled = true;

    const url = `${getBaseUrl()}orders`;
    const response = await fetch(url, {
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

    localStorage.removeItem("cart");

    sessionStorage.setItem(
      "orderConfirmation",
      JSON.stringify({
        orderData: orderData,
        result: result,
      })
    );

    window.location.href = "/src/checkout/confirmation.html";
  } catch (error) {
    console.error("Error creating order:", error);
    alert("Vi kunde inte slutföra din beställning. Vissa produkter kan ha begränsad tillgång i lager just nu. Hör gärna av dig till oss så hjälper vi dig vidare!");

    orderButton.textContent = originalText;
    orderButton.disabled = false;
  }
}
