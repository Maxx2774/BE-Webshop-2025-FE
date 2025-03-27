const loginCredentials = async (credentials) => {
    try {
        const response = await axios.post("https://webshopbackend.vercel.app/auth/signin", credentials, { withCredentials: true });
        console.log(response);

        if (response.data) {
            alert("Inloggning lyckades");
        } else {
            alert("Inloggning misslyckad");
        }
    } catch (error) {
        console.log(error);
    }
};

document.getElementById("btn-login").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userCredentials = { email: email, password: password }

    loginCredentials(userCredentials);
});