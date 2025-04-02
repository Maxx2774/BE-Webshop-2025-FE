export const baseUrl = "https://webshopbackend.vercel.app";
export const unitWeight = ["st", "kg", "hg", "g", "liter"];
export let loggedUser = {};

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
        const response = await axios.delete(url, { data, ...credentials });
        return response;
    } catch (error) {
        return error;
    }
};

export const PostAsync = async (url, data = null, credentials = null) => {
    try {
        const response = await axios.post(url, data, credentials);
        return response;
    } catch (error) {
        return error;
    }
}

export const PatchAsync = async (url, data, credentials = null) => {
    try {
        const response = await axios.patch(url, data, credentials);
        return response;
    } catch (error) {
        return error;
    }
};

// Verifiera om användaren är inloggad
export const verifyToken = async () => {
    const response = await GetAsync(`${baseUrl}/auth/verify`, { withCredentials: true });

    if (response.status === 401) {
        console.log("Ogiltig token. Omdirigerar till inloggning.");
        window.location.href = "/admin/index.html";
    } else {
        loggedUser = response.data.user;
    }
};

//Logga ut
export const logOutUser = async () => {
    try {
        await PostAsync(`https://webshopbackend.vercel.app/auth/signout`, null, {withCredentials: true});
        loggedUser = {};
        window.location.href = "/admin/index.html";
    } catch (error) {
        console.error(error);
    }
}

export const adminCheck = () => {
    if (!loggedUser || Object.keys(loggedUser).length === 0) {
      window.location.href = "/admin/index.html";
    } else if (!loggedUser.admin) {
      window.location.href = "/admin/dashboard/access-denied.html";
    }
  };
