import { getBaseUrl } from "../utils/api.js";
import { createProductCard, currencySek } from "./services.js";

const productSearch = async (searchQ) => {
    if (!searchQ.trim()) {
        document.getElementById("product-container").innerHTML = "";
        return;
    }

    history.pushState(null, "", `?search=${encodeURIComponent(searchQ)}`);

    try {
        const response = await axios.get(`${getBaseUrl().replace(/\/$/, "")}/products?search=${encodeURIComponent(searchQ)}`);

        let productContainer = document.getElementById("product-container");
        productContainer.innerHTML = "";

        let data = response.data;
        console.log(response.status)
        if (data.length === 0 || data.status === 404) {
            productContainer.innerHTML = "<p>Inga resultat hittades.</p>";
        } else {
            const productResultDiv = document.createElement("div");
            const productResultText = document.createElement("p");
            productResultText.classList.add("fs-4", "fw-semibold", "mb-3");
            productResultText.innerHTML = `Resultat för produkt <span class="fw-bold">${searchQ}</span>`;

            const productResultUl = document.createElement("ul");
            productResultUl.classList.add("list-group", "list-group-horizontal");
            productResultUl.setAttribute("id", "result-product-list");

            data.forEach(product => {
                const resultProducts = createProductCard(product);
                productResultUl.append(resultProducts);
            });

            productResultDiv.append(productResultText, productResultUl);
            productContainer.append(productResultDiv);
        }
    } catch (error) {
        console.error(error);
    }
}

document.getElementById("search-product-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    let searchQ = document.getElementById("search-product-q").value;
    if (!searchQ) return;

    await productSearch(searchQ);
});

window.addEventListener("load", function () {
    const params = new URLSearchParams(window.location.search);
    const searchQ = params.get("search");

    if (searchQ) {
        document.getElementById("search-product-q").value = searchQ;
        productSearch(searchQ);
    }
});