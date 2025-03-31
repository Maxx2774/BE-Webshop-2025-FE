import { verifyToken, GetAsync, baseUrl } from './services.js';

await verifyToken();

const getProducts = await GetAsync(`${baseUrl}/products`);

document.getElementById("product-count").textContent = getProducts.data.length;