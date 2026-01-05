const API_URL = "http://localhost:8000/api";

const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    if (res.status === 401) {
        window.location.href = "/login";
        throw new Error("Unauthorized");
    }

    return res;
};

export { authFetch };