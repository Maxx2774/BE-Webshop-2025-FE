const errorMessage = document.getElementById("error");

const loginCredentials = async (credentials) => {
    try {
        const response = await axios.post("https://webshopbackend.vercel.app/auth/signin", credentials, { withCredentials: true });
        console.log(response.status);

        if (response.status === 200) {
            window.location.href = "/admin/dashboard/index.html";  
        }

    } catch (error) {
        if (error.response && error.response.status === 401) {
            errorMessage.textContent = "Felaktig e-postadress eller lösenord, försök igen!";
        } else {
            console.log("Ett oväntat fel inträffade. Försök igen senare.");
        }
        console.log(error);
    }
};

document.getElementById("btn-login").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        errorMessage.textContent = "Fyll i både e-postadress och lösenord.";
        return;
    }

    const userCredentials = { email: email, password: password }
    loginCredentials(userCredentials);
});