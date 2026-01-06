import {
    FaDownload,
    FaEdit,
    FaArrowsAlt,
    FaTrashAlt,
} from "react-icons/fa";
import { authFetch } from "../services/api";

/**
 * Context menu actions for a file
 * @param {string} fileId
 * @param {object} file
 * @param {function} setMoveFile
 */
export const fileActions = (fileId, file, setMoveFile) => [
    {
        icon: <FaDownload />,
        label: "Download file",
        onClick: async () => {
            try {
                const res = await authFetch(`/files/${fileId}`, {
                    method: "GET",
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message || "Download failed");
                }

                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;

                const disposition = res.headers.get("Content-Disposition");
                let filename = "file";

                if (disposition && disposition.includes("filename=")) {
                    filename = disposition
                        .split("filename=")[1]
                        .replace(/"/g, "");
                }

                a.download = filename || "file";

                document.body.appendChild(a);
                a.click();

                // Limpieza
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

            } catch (err) {
                alert(err.message);
            }
        },
    },
    {
        icon: <FaEdit />,
        label: "Rename file",
        onClick: () => {
            console.log("file", file);
            window.dispatchEvent(
                new CustomEvent("open-file-rename", {
                    detail: {
                        fileId,
                        name: file.name,
                        description: file.description,
                    },
                })
            );
        },
    },
    {
        icon: <FaArrowsAlt />,
        label: "Move file",
        onClick: () => {
            setMoveFile(file);
        },
    },
    {
        icon: <FaTrashAlt />,
        label: "Delete file",
        danger: true,
        onClick: async () => {
            const confirmed = window.confirm(
                "Are you sure you want to delete this file?\nThis action cannot be undone."
            );

            if (!confirmed) return;

            try {
                const res = await authFetch(`/files/${fileId}`, {
                    method: "DELETE",
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message || "Delete failed");
                }

                // Simple refresh (later we can replace with state update)
                window.location.reload();
            } catch (err) {
                alert(err.message);
            }
        },
    },
];
