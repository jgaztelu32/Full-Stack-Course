import { useEffect, useState } from "react";
import { authFetch } from "../services/api";

export default function FileRenameModal() {
    const [open, setOpen] = useState(false);
    const [fileId, setFileId] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            const { fileId, name, description } = e.detail;

            setFileId(fileId);
            setName(name || "");
            setDescription(description || "");
            setOpen(true);
        };

        window.addEventListener("open-file-rename", handler);
        return () => window.removeEventListener("open-file-rename", handler);
    }, []);

    const close = () => {
        setOpen(false);
        setName("");
        setDescription("");
    };

    const submit = async () => {
        setLoading(true);
        try {
            const res = await authFetch(`/files/${fileId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, description }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Update failed");
            }

            close();
            window.location.reload(); // luego se puede cambiar por state
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-file-rename">
                <h2>Rename file</h2>

                <span>
                    Name
                </span>
                <div>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <span>
                    Description
                </span>
                <div>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="actions">
                    <button onClick={close} disabled={loading}>
                        Cancel
                    </button>
                    <button onClick={submit} disabled={loading || !name}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
