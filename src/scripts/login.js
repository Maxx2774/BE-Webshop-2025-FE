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
// import { fetchProducts } from '../utils/api.js'

// async function getAndLogProducts() {
//   try {
//     const products = await fetchProducts();
//     console.log(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//   }
// }

import { getBaseUrl } from '../utils/api.js'

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegisterLink = document.getElementById('show-register');
  const showLoginLink = document.getElementById('show-login');
  const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
  
  // Handle Register Form Submission
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    registerUser(email, password);
  });

  // Handle Login Form Submission
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    loginUser(email, password);
  });

  // Show Register Form
  showRegisterLink.addEventListener('click', function () {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    document.getElementById('loginModalLabel').textContent = 'Registrera ett konto';
  });

  // Show Login Form
  showLoginLink.addEventListener('click', function () {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    document.getElementById('loginModalLabel').textContent = 'Logga in';
  });

  // Function to handle User Registration
  async function registerUser(email, password) {
    const url = `${getBaseUrl()}auth/register`; // Register endpoint
    const data = { email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (response.status === 201) {
        alert('Registration successful. You can now log in.');
        showLoginForm();
      } else {
        alert('Registration failed. Please try again.');
        console.log(response.status)
        console.log(result)
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('There was an error registering. Please try again later.');
    }
  }

  // Function to handle User Login
  async function loginUser(email, password) {
    const url = `${getBaseUrl()}auth/signin`; // Sign in endpoint
    const data = { email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (response.status === 200) {
        // Store the user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        alert('Login successful');
        loginModal.hide(); // Close the modal
        window.location.reload(); // Optionally reload the page
      } else {
        alert('Invalid login credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('There was an error logging in. Please try again later.');
    }
  }

  // Function to handle User Logout
  async function logoutUser() {
    const url = `${getBaseUrl()}auth/signout`; // Sign out endpoint

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove user data from localStorage and alert the user
      localStorage.removeItem('user');
      alert('You have logged out');
      window.location.reload(); // Optionally reload the page
    } catch (error) {
      console.error('Logout error:', error);
      alert('There was an error logging out. Please try again later.');
    }
  }

  // Optional: Add a logout button to handle user logout
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', logoutUser);
  }

  // Helper function to show login form
  function showLoginForm() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    document.getElementById('loginModalLabel').textContent = 'Logga in';
  }

  // Helper function to show register form
  function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    document.getElementById('loginModalLabel').textContent = 'Registrera ett konto';
  }
});