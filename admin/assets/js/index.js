import { verifyToken, GetAsync, baseUrl, loggedUser, logOutUser } from './services.js';

await verifyToken();
document.getElementById("logout").addEventListener("click", logOutUser);
document.getElementById("logged-user-name").textContent = loggedUser.email;

const getProducts = await GetAsync(`${baseUrl}/products`);

document.getElementById("product-count").textContent = getProducts.data.length;