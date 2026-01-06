import { useEffect, useState } from "react";
import { authFetch } from "../services/api";
import FolderTree from "./FolderTree";

export default function MoveFolderModal({
    folderId,
    folderName,
    onClose,
}) {
    const [tree, setTree] = useState([]);
    const [selected, setSelected] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTree();
    }, []);

    const fetchTree = async () => {
        const load = async (parent) => {
            const res = await authFetch(`/folders/${parent}`);
            const data = await res.json();

            return Promise.all(
                data.map(async f => ({
                    ...f,
                    children: await load(f._id),
                }))
            );
        };

        setTree(await load("root"));
    };

    const confirmMove = async () => {
        if (!selected) return;

        if (selected._id === folderId) {
            setError("Cannot move a folder into itself");
            return;
        }

        const res = await authFetch(`/folders/${selected._id}`);
        const siblings = await res.json();

        if (siblings.some(f => f.name === folderName)) {
            setError("Destination already contains a folder with this name");
            return;
        }

        await authFetch(`/folders/${folderId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ parent: selected._id }),
        });

        window.location.reload();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>Move folder</h3>

                <FolderTree
                    tree={tree}
                    selectedId={selected?._id}
                    disabledId={folderId}
                    onSelect={setSelected}
                />

                {error && <p className="error">{error}</p>}

                <div className="modal-actions">
                    <button onClick={onClose}>Cancel</button>
                    <button
                        disabled={!selected}
                        onClick={confirmMove}
                    >
                        Move here
                    </button>
                </div>
            </div>
        </div>
    );
}
