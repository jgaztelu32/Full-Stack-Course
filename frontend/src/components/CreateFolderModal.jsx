import { useState } from "react";
import "./CreateFolderModal.css";

function CreateFolderModal({ parentId, onCreate, onCancel }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!name.trim() || !description.trim()) {
            setError("Name and description are required");
            return;
        }

        onCreate({
            name: name.trim(),
            description: description.trim(),
            parent: parentId,
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-folders">
                <h3>Create new folder</h3>
                <div className="modal-upper-block">
                    <input
                        type="text"
                        placeholder="Folder name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="modal-lower-block">
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {error && <p className="modal-error">{error}</p>}

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn-create" onClick={handleSubmit}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateFolderModal;
