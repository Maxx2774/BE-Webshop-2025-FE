import { getBaseUrl } from "../utils/api.js";

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const showRegisterLink = document.getElementById("show-register");
const showLoginLink = document.getElementById("show-login");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const adminButton = document.getElementById("admin-button");
const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^.{6,}$/;

// Säkerhetsmeddelande. Visa meddelande när användaren klickar på "Logga in" eller "Registrera".
document.addEventListener("DOMContentLoaded", function () {
  showLoginLink.addEventListener("click", function () {
    document.getElementById("security-message").style.display = "block";
  });

  showRegisterLink.addEventListener("click", function () {
    document.getElementById("security-message").style.display = "block";
  });

  async function checkUserLoggedIn() {
    try {
      const response = await fetch(`${getBaseUrl()}auth/verify`, {
        method: "GET",
        credentials: "include", // Ensures cookies are sent with the request
      });

      const data = await response.json();

      if (data.valid) {
        if (!localStorage.getItem("user")) {
          localStorage.setItem("user", JSON.stringify(data.user)); // Store user data if not already set
        }
        logoutButton.classList.remove("d-none");
        loginButton.classList.add("d-none");
        checkAdminStatus(data.user);
      } else {
        localStorage.removeItem("user");
        logoutButton.classList.add("d-none");
        loginButton.classList.remove("d-none");
        hideAdminFeatures();
      }
    } catch (error) {
      console.error("Error checking session:", error);
      logoutButton.classList.add("d-none");
      loginButton.classList.remove("d-none");
    }
  }
  checkUserLoggedIn();

  // Handle Register Form Submission
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById(
      "register-confirm-password"
    ).value;

    if (!emailRegex.test(email)) {
      alert("Invalid email format. Please enter a valid email.");
      return;
    }

    if (!passwordRegex.test(password)) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    registerUser(email, password);
  });

  // // Show Register Form
  // showRegisterLink.addEventListener('click', function () {
  //   loginForm.style.display = 'none';
  //   registerForm.style.display = 'block';
  //   document.getElementById('loginModalLabel').textContent = 'Registrera ett konto';
  // });

  // // Show Login Form
  // showLoginLink.addEventListener('click', function () {
  //   registerForm.style.display = 'none';
  //   loginForm.style.display = 'block';
  //   document.getElementById('loginModalLabel').textContent = 'Logga in';
  // });
  showLoginLink.addEventListener("click", showLoginForm);
  showRegisterLink.addEventListener("click", showRegisterForm);

  // Handle User Registration
  async function registerUser(email, password) {
    const url = `${getBaseUrl()}auth/register`;
    const data = { email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (response.status === 201) {
        alert("Registration successful. You can now log in.");
        showLoginForm();
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("There was an error registering. Please try again later.");
    }
  }

  //Handle User Login
  async function loginUser(email, password) {
    const url = `${getBaseUrl()}auth/signin`;
    const data = { email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // Include cookies in the request
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(result.user));
        checkAdminStatus(result.user);
        alert("Login successful");
        loginModal.hide();
        logoutButton.classList.remove("d-none");
        loginButton.classList.add("d-none");
      } else {
        alert("Invalid login credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("There was an error logging in. Please try again later.");
    }
  }

  // Handle Login Form Submission
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Validate email and password
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const minPasswordLength = 5;

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < minPasswordLength) {
      alert("Password must be at least 5 characters long.");
      return;
    }

    loginUser(email, password);
  });

  // Helper function to show login form
  function showLoginForm() {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    document.getElementById("loginModalLabel").textContent = "Logga in";
  }

  // Helper function to show register form
  function showRegisterForm() {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    document.getElementById("loginModalLabel").textContent =
      "Registrera ett konto";
  }
});

async function logoutUser() {
  try {
    const response = await fetch(`${getBaseUrl()}auth/signout`, {
      method: "POST",
      credentials: "include", // Ensures the cookie is sent and cleared
    });

    let data;
    try {
      data = await response.json();
    } catch (error) {
      data = { success: response.ok, message: "Logged out successfully" }; // Fallback for non-JSON response
    }

    if (data.success) {
      localStorage.removeItem("user");
      logoutButton.classList.add("d-none");
      loginButton.classList.remove("d-none");
      hideAdminFeatures();
      alert("Logged out successfully!");
    } else {
      console.error("⚠️ Logout failed:", data.message);
    }
  } catch (error) {
    console.error("⚠️ Error during logout:", error);
  }
}

logoutButton.addEventListener("click", logoutUser);

function showAdminFeatures() {
  if (adminButton) adminButton.classList.remove("d-none");
}

function hideAdminFeatures() {
  if (adminButton) adminButton.classList.add("d-none");
}

function checkAdminStatus(user) {
  if (user.admin) {
    showAdminFeatures(); // Show admin UI elements
  } else {
    hideAdminFeatures(); // Hide admin UI elements
  }
}
