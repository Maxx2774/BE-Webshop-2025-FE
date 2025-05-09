window.addEventListener("DOMContentLoaded", () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#208502", "#002aa8", "#4CAF50", "#FFC107"],
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#208502", "#002aa8", "#4CAF50", "#FFC107"],
    });
  }, 250);

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#208502", "#002aa8", "#4CAF50", "#FFC107"],
    });
  }, 400);
});

document.addEventListener("DOMContentLoaded", () => {
  const orderData = JSON.parse(sessionStorage.getItem("orderConfirmation"));

  if (!orderData) {
    window.location.href = "/index.html";
    return;
  }

  const orderDetails = document.getElementById("order-details");
  if (!orderDetails) return;

  const customerInfo = document.createElement("div");
  customerInfo.innerHTML = `
      <p><strong>Namn:</strong> ${orderData.orderData.order_info.first_name} ${
    orderData.orderData.order_info.last_name
  }</p>
      <p><strong>Email:</strong> ${orderData.orderData.order_info.email}</p>
      <p><strong>Telefon:</strong> ${
        orderData.orderData.order_info.phone_number
      }</p>
      <hr>
      <p><strong>Leveransadress:</strong><br>
      ${orderData.orderData.order_info.shipping_address.street}<br>
      ${orderData.orderData.order_info.shipping_address.zip} ${
    orderData.orderData.order_info.shipping_address.city
  }</p>
      <hr>
      <p><strong>Betalningsmetod:</strong> ${getPaymentMethodName(
        orderData.orderData.order_info.payment_method
      )}</p>
      <p><strong>Total kostnad:</strong> ${
        orderData.orderData.total_cost
      } SEK</p>
    `;

  orderDetails.appendChild(customerInfo);
});

function getPaymentMethodName(method) {
  switch (method) {
    case "card":
      return "Kreditkort";
    case "swish":
      return "Swish";
    case "klarna":
      return "Klarna";
    default:
      return method;
  }
}
