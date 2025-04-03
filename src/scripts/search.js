import { getBaseUrl } from "../utils/api.js";

const productSearch = async (searchQ) => {
    if (!searchQ.trim()) {
        document.getElementById("product-result-list").innerHTML = ""; // Rensa resultat om fältet är tomt
        return;
    }

    history.pushState(null, "", `?search=${encodeURIComponent(searchQ)}`);

    try {
        const response = await axios.get(`${getBaseUrl().replace(/\/$/, "")}/products?search=${encodeURIComponent(searchQ)}`);

        let resultsDiv = document.getElementById("product-result-list");
        resultsDiv.innerHTML = "";

        let data = response.data;
        if (data.length === 0) {
            resultsDiv.innerHTML = "<p>Inga resultat hittades.</p>";
        } else {
            let ul = document.createElement("ul");
            data.forEach(item => {
                let li = document.createElement("li");
                li.textContent = item.name;
                ul.append(li);
            });
            resultsDiv.append(ul);
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