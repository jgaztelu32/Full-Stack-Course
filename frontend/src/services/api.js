const API_URL = "http://localhost:8000/api";

const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
    };

    // Add JSON content-type only if body is NOT FormData
    if (
        options.body &&
        !(options.body instanceof FormData) &&
        !headers["Content-Type"]
    ) {
        headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Unauthorized");
    }

    return res;
};

export { authFetch };
