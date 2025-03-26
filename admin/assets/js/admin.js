const loginCredentials = async (credentials) => {
        const response = await axios.post("https://webshopbackend.vercel.app/auth/signin", credentials);
        console.log(response);
    
        if (response) {
            alert("Inloggning lyckades")
        } 
    }

document.getElementById("btn-login").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userCredentials = { email: email, password: password }

    loginCredentials(userCredentials);
});