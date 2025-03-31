export const baseUrl = "https://webshopbackend.vercel.app";
export const unitWeight = ["st", "kg", "hg", "g", "liter"];

// HTTP metoder
export const GetAsync = async (url, data = null, credentials = null) => {
    try {
        const response = await axios.get(url, data, credentials);
        return response;
    } catch (error) {
        return error;
    }
}

export const DeleteAsync = async (url, data, credentials = null) => {
    try {
        const response = await axios.delete(url, data, credentials);
        return response;
    } catch (error) {
        return error;
    }
}

export const PostAsync = async (url, data, credentials = null) => {
    try {
        const response = await axios.post(url, data, credentials);
        return response;
    } catch (error) {
        return error;
    }
}

// Verifiera om användaren är inloggad
export const verifyToken = async () => {
    const response = await GetAsync(`${baseUrl}/auth/verify`, { withCredentials: true });

    if (response.status === 401) {
        console.log("Ogiltig token. Omdirigerar till inloggning.");
        window.location.href = "/admin/index.html";
    }
};