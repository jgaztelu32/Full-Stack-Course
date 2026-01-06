import {
    FaEdit,
    FaArrowsAlt,
    FaTrashAlt,
} from "react-icons/fa";
import { authFetch } from "../services/api";

/**
 * Context menu actions for a folder
 * @param {string} folderId
 * @param {function} openMoveModal
 * @param {function} openRenameModal
 * @param {object} folder
 */
export const folderActions = (folderId, openMoveModal, openRenameModal, folder) => [
    {
        icon: <FaEdit />,
        label: "Rename folder",
        onClick: () => {
            openRenameModal({
                id: folderId,
                name: folder.name,
                description: folder.description
            });
        },
    },
    {
        icon: <FaArrowsAlt />,
        label: "Move folder",
        onClick: () => openMoveModal(folderId),
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

