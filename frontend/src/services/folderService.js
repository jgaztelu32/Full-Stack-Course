import { authFetch } from "./api";

/**
 * Crear una carpeta
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.description
 * @param {string} data.parent
 */
export const createFolder = async (data) => {
    const res = await authFetch("/folders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error creating folder");
    }

    return res.json();
};

