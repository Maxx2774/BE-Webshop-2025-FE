// document.addEventListener("DOMContentLoaded", initLogin);

// function initLogin() {
//   const loginForm = document.getElementById("loginForm");

//   loginForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     handleLogin();
//   });
// }

// function handleLogin() {
//   const username = document.getElementById("username").value;
//   const password = document.getElementById("password").value;

//   // Basic demo login - NOT SECURE
//   if (username === "admin" && password === "admin") {
//     window.location.href = "admin.html";
//   } else {
//     alert("Invalid credentials: LOGGING IN ANYWAY");
//     window.location.href = "admin.html";
//   }
// }
import { fetchProducts } from '../utils/api.js'

async function getAndLogProducts() {
  try {
    const products = await fetchProducts();
    console.log(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

getAndLogProducts();