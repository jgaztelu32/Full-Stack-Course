import { useState } from "react";
import { renameFolder } from "../services/folderService";

export default function RenameFolderModal({
    folderId,
    currentName,
    currentDescription = "",
    onClose,
    onSuccess,
}) {
    const [name, setName] = useState(currentName);
    const [description, setDescription] = useState(currentDescription);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !description.trim()) {
            alert("Name and description are required");
            return;
        }

        try {
            setLoading(true);
            await renameFolder(folderId, { name, description });
            onSuccess();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-file-rename">
                <h3>Rename folder</h3>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <div>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <div>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
