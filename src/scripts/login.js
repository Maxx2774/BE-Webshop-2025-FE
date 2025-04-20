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

function showLoginError(message) {
  const notification = document.getElementById("login-notification");
  notification.className = "alert alert-danger mb-3";
  notification.textContent = message;
  notification.classList.remove("d-none");
}

function showLoginSuccess(message) {
  const notification = document.getElementById("login-notification");
  notification.className = "alert alert-success mb-3";
  notification.textContent = message;
  notification.classList.remove("d-none");
}

function showRegisterError(message) {
  const notification = document.getElementById("register-notification");
  notification.className = "alert alert-danger mb-3";
  notification.textContent = message;
  notification.classList.remove("d-none");
}

function showRegisterSuccess(message) {
  const notification = document.getElementById("register-notification");
  notification.className = "alert alert-success mb-3";
  notification.textContent = message;
  notification.classList.remove("d-none");
}

function hideNotifications() {
  document.getElementById("login-notification").classList.add("d-none");
  document.getElementById("register-notification").classList.add("d-none");
}

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
      showRegisterError("Ange en giltig e-postadress.");
      return;
    }

    if (!passwordRegex.test(password)) {
      showRegisterError("Lösenordet måste vara minst 6 tecken långt.");
      return;
    }

    if (password !== confirmPassword) {
      showRegisterError("Lösenorden matchar inte!");
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
        showRegisterSuccess("Registrering lyckades! Du kan nu logga in.");
        setTimeout(showLoginForm, 1000);
      } else {
        showRegisterError("Registrering misslyckades. Försök igen.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      showRegisterError(
        "Ett fel uppstod vid registrering. Försök igen senare."
      );
    }
  }

  //Handle User Login
  async function loginUser(email, password) {
    const url = `${getBaseUrl()}auth/signin`;
    const data = { email, password };
    const loginSpinner = document.getElementById("login-spinner");
    const loginButton = document.getElementById("login-submit-btn");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // Include cookies in the request
      });

      loginSpinner.classList.add("d-none");
      loginButton.disabled = false;

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(result.user));
        checkAdminStatus(result.user);
        showLoginSuccess("Inloggning lyckades!");
        setTimeout(() => {
          loginModal.hide();
          document.getElementById("login-button").classList.add("d-none");
          document.getElementById("logout-button").classList.remove("d-none");
        }, 1000);
      } else {
        showLoginError("Hmm... stämmer allt?");
      }
    } catch (error) {
      console.error("Login error:", error);
      showLoginError("Hmm... stämmer allt?");
      loginSpinner.classList.add("d-none");
      loginButton.disabled = false;
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
      showLoginError("Ange en giltig e-postadress.");

      return;
    }

    if (password.length < minPasswordLength) {
      showLoginError("Lösenordet måste vara minst 5 tecken långt.");
      return;
    }

    const loginSpinner = document.getElementById("login-spinner");
    const loginButton = document.getElementById("login-submit-btn");

    hideNotifications();
    loginSpinner.classList.remove("d-none");
    loginButton.disabled = true;

    setTimeout(() => {
      loginUser(email, password);
    }, 1500); // Hur länge spinnern visas
  });

  // Helper function to show login form
  function showLoginForm() {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    document.getElementById("loginModalLabel").textContent = "Logga in";
    hideNotifications();
  }

  // Helper function to show register form
  function showRegisterForm() {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    document.getElementById("loginModalLabel").textContent =
      "Registrera ett konto";
    hideNotifications();
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
