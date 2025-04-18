import { verifyToken, baseUrl, loggedUser, logOutUser, adminCheck, GetAsync, orderStatus, PatchAsync } from "./services.js";

import { InitDataTable } from "../js/datatables.js";

await verifyToken();
adminCheck();
document.getElementById("logout").addEventListener("click", logOutUser);
document.getElementById("logged-user-name").textContent = loggedUser.email;
    
const statusBadge = (value, type) => {
    let badgeClass = "";
    let badgeText = "";

    if (type === "orderStatus") {
        switch (value) {
            case "processing":
                badgeClass = "text-bg-warning";
                badgeText = "Ordern behandlas";
                break;
            case "out_for_delivery":
                badgeClass = "text-bg-primary";
                badgeText = "Ordern är ute för leverans";
                break;
            case "delivered":
                badgeClass = "text-bg-success";
                badgeText = "Ordern är levererad";
                break;
            case "canceled":
                badgeClass = "text-bg-danger";
                badgeText = "Ordern är avbruten";
                break;
            case "returned":
                badgeClass = "text-bg-secondary";
                badgeText = "Ordern är returnerad";
                break;
        }
    } else {
        switch (value) {
            case "pending":
                badgeClass = "text-bg-warning";
                badgeText = "Väntar på betalning";
                break;
            case "paid":
                badgeClass = "text-bg-success";
                badgeText = "Betalad";
                break;
            case "failed":
                badgeClass = "text-bg-danger";
                badgeText = "Betalning misslyckades";
                break;
            case "refunded":
                badgeClass = "text-bg-secondary";
                badgeText = "Återbetalad";
                break;
        }
    }

    return `<span class="badge ${badgeClass}">${badgeText}</span>`;
}

var columns = [
{ 
    data: "null", 
    render: function(data, type, row) {
        let names = row.order_information.map(orderInfo => {
            return `${orderInfo.shipping_address.first_name} ${orderInfo.shipping_address.last_name}`;
        });

        return names.join(", ");
    },
    width: "260px"
},
{
    data: "status",
    render: function(data, type, row) {
        let badgeClass = "";
        let badgeText = "";
        
        switch (data) {
            case "processing":
                badgeClass = "text-bg-warning";
                badgeText = "Behandlas";
                break;
            case "out_for_delivery":
                badgeClass = "text-bg-primary";
                badgeText = "Ute för leverans";
                break;
            case "delivered":
                badgeClass = "text-bg-success";
                badgeText = "Levererad";
                break;
            case "canceled":
                badgeClass = "text-bg-danger";
                badgeText = "Avbruten";
                break;
            case "returned":
                badgeClass = "text-bg-secondary";
                badgeText = "Returnerad";
                break;
        }
    
        return `<span class="badge ${badgeClass}">${badgeText}</span>`;
    },
    width: "150px"
},
{
    data: "payment_status",
    render: function(data, type, row) {
        let badgeClass = "";
        let badgeText = "";
        
        switch (data) {
            case "pending":
                badgeClass = "text-bg-warning";
                badgeText = "Väntar på betalning";
                break;
            case "paid":
                badgeClass = "text-bg-success";
                badgeText = "Betalad";
                break;
            case "failed":
                badgeClass = "text-bg-danger";
                badgeText = "Betalning misslyckades";
                break;
            case "refunded":
                badgeClass = "text-bg-secondary";
                badgeText = "Återbetalad";
                break;
        }
        
        return `<span class="badge ${badgeClass}">${badgeText}</span>`;
    },
    width: "150px"
},
{ data: "total_price", render: function(data, type, row) { return `${data} kr`; }, width: "100px", className: "text-end" },
{ data: "created_at", render: DataTable.render.date("YYYY-MM-DD HH:mm"), width: "150px", className: "text-end", },
{
    data: null,
    width: "100px",
    className: "text-end",
    orderable: false,
    fnCreatedCell: function (nTd, sData, oData) {
        nTd.innerHTML =`
        <a href="#" data-bs-toggle="modal" data-bs-target="#orderDetailsModal" data-order-id="${oData.id}" style="display:inline; color: #4a4e54;" class="nav-link me-3"><i class="fa fa-file fa-sm"></i></a>
        <a href="#" data-bs-toggle="modal" data-bs-target="#updateModal" data-product-id="${oData.id}" style="display:inline; color: #4a4e54;" class="nav-link me-3"><i class="fa fa-pen fa-sm"></i></a>`;
    }
}];
    
let dataTable = InitDataTable("#order-list", `${baseUrl}/admin/orders`, columns, [5, "desc"]);


const orderDetailsModal = document.getElementById("orderDetailsModal");
const modal = new bootstrap.Modal(orderDetailsModal);

orderDetailsModal.addEventListener("hidden.bs.modal", function () {
    dataTable.ajax.reload();
});

// const getMaskedCreditCard = (cardNumber) => {
//     let creditCardNumber = cardNumber;
//     let maskedCreditCard = "**** **** **** " + creditCardNumber.slice(-4);

//     return maskedCreditCard;
// }

orderDetailsModal.addEventListener("show.bs.modal", async (event) => {
    const successMessage = document.getElementById("success-message");
    successMessage.textContent = "";
    successMessage.style.display = "none";

    const orderId = event.relatedTarget.dataset.orderId;
    const order = await GetAsync(`${baseUrl}/admin/orders/${orderId}`, {withCredentials: true});
    
    document.getElementById("order-number").textContent = `Ordernummer: ${order.data.id}`;
    document.getElementById("order-date").textContent = new Date(order.data.created_at).toLocaleString("sv-SE", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
    
    const orderStatusSelect = document.getElementById("order-status");
    orderStatusSelect.innerHTML = "";

    orderStatus.forEach(status => {
        const option = document.createElement("option");
        option.text = status.swe;
        option.value = status.eng;
        option.selected = order.data.status === status.eng ? true : false;
        orderStatusSelect.append(option);
    });
    orderStatusSelect.addEventListener("change", async (event) => {
        const selectValue = event.target.value;

        try {
            await PatchAsync(`${baseUrl}/admin/orders/${orderId}`, { status: selectValue }, {withCredentials: true});
            successMessage.textContent = "Orderstatus uppdaterad!"
            successMessage.style.display = "";

        } catch (error) {
            console.log(error);
        }
    });

    document.getElementById("shipping-full-name").textContent = `${order.data.order_information[0].shipping_address.first_name} ${order.data.order_information[0].shipping_address.last_name}`;
    document.getElementById("shipping-street").textContent = `${order.data.order_information[0].shipping_address.street}`;
    document.getElementById("shipping-zip-city").textContent = `${order.data.order_information[0].shipping_address.zip} ${order.data.order_information[0].shipping_address.city}`;

    document.getElementById("billing-full-name").textContent = `${order.data.order_information[0].billing_address.first_name} ${order.data.order_information[0].billing_address.last_name}`;
    document.getElementById("billing-street").textContent = `${order.data.order_information[0].billing_address.street}`;
    document.getElementById("billing-zip-city").textContent = `${order.data.order_information[0].billing_address.zip} ${order.data.order_information[0].billing_address.city}`;

    document.getElementById("payment-status").innerHTML = `<span class="fw-semibold">Status:</span> ${statusBadge(order.data.payment_status, "paymentStatus")}`;
    document.getElementById("payment-type").src = `/admin/assets/images/payment/${order.data.payment_method}.svg`;
    document.getElementById("card-number").textContent = order.data.payment_method === "card" && order.data.order_information[0].card_last4 ? "**** **** **** " + order.data.order_information[0].card_last4 : ""; 

    let totalPriceProduct = 0;

    const productIds = order.data.order_items.map(item => item.product_id);
    const productPromises = productIds.map(productId => GetAsync(`${baseUrl}/products/${productId}`));
    const products = await Promise.all(productPromises);
    
    const productList = document.getElementById("products-list");
    productList.innerHTML = "";

    order.data.order_items.forEach((orderItem, index) => {
        const product = products[index].data;

        totalPriceProduct += orderItem.price * orderItem.quantity;

        const tr = document.createElement("tr");

        const productImageTd = document.createElement("td");
        productImageTd.classList.add("col-1")
        const productImage = document.createElement("img");
        productImage.src = product.image_url;
        productImage.style.height = "50px";
        productImage.style.width = "auto";
        productImageTd.append(productImage)
        tr.append(productImageTd);

        // Lägg till produktnamn
        const productNameTd = document.createElement("td");
        productNameTd.textContent = product.name;
        tr.append(productNameTd);

        // Lägg till antal
        const quantityTd = document.createElement("td");
        quantityTd.textContent = orderItem.quantity;
        tr.append(quantityTd);

        // Lägg till styckpris
        const priceTd = document.createElement("td");
        priceTd.textContent = `${orderItem.price} kr`;
        tr.append(priceTd);

        // Lägg till totalpris
        const totalPriceTd = document.createElement("td");
        totalPriceTd.textContent = `${orderItem.price * orderItem.quantity} kr`;
        tr.append(totalPriceTd);

        // Lägg till raden till tabellen
        productList.append(tr);
    });

        document.getElementById("order-total-product-price").textContent = `${totalPriceProduct} kr`;
        document.getElementById("order-total-price").textContent = `${totalPriceProduct + 49} kr`;
});
