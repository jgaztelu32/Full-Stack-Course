import { useEffect, useState } from "react";
import FolderTree from "./FolderTree";
import { authFetch } from "../services/api";

export default function MoveFileModal({ file, currentFolderId, onClose, onSuccess }) {
    const [tree, setTree] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);

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
        setLoading(false);
    };

    const handleMove = async () => {
        if (!selected) return;

        try {
            const res = await authFetch(`/files/${file._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ parent: selected._id }),
            });

            if (!res.ok) throw new Error();
            onSuccess();
        } catch {
            alert("Error moving file");
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>Move file: {file.name}</h3>

                {loading ? (
                    <p>Loading folders...</p>
                ) : (
                    <FolderTree
                        tree={tree}
                        onSelect={setSelected}
                        selectedId={selected?._id}
                    />
                )}

                <div className="modal-actions">
                    <button onClick={onClose}>Cancel</button>
                    <button
                        onClick={handleMove}
                        disabled={!selected}
                    >
                        Move
                    </button>
                </div>
            </div>
        </div>
    );
}
