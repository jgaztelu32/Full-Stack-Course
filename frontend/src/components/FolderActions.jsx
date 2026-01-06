import {
    FaEdit,
    FaArrowsAlt,
    FaTrashAlt,
} from "react-icons/fa";
import { authFetch } from "../services/api";

/**
 * Context menu actions for a folder
 * @param {string} folderId
 */
export const folderActions = (folderId) => [
    {
        icon: <FaEdit />,
        label: "Rename folder",
        onClick: () => {
            alert("Rename folder (not implemented yet)");
        },
    },
    {
        icon: <FaArrowsAlt />,
        label: "Move folder",
        onClick: () => {
            alert("Move folder (not implemented yet)");
        },
    },
    {
        icon: <FaTrashAlt />,
        label: "Delete folder",
        danger: true,
        onClick: async () => {
            const confirmed = window.confirm(
                "Are you sure you want to delete this folder?\nAll its contents will be permanently deleted."
            );

            if (!confirmed) return;

            try {
                const res = await authFetch(`/folders/${folderId}`, {
                    method: "DELETE",
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message || "Delete failed");
                }

                // Simple refresh for now
                window.location.reload();
            } catch (err) {
                alert(err.message);
            }
        },
    },
];
