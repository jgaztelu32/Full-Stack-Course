import { useState } from "react";
import { uploadFile } from "../services/fileService";

function UploadModal({ currentFolder, onClose, onSuccess }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const addFiles = (newFiles) => {
    setFiles(prev => {
      const existingNames = prev.map(f => f.name);
      const filtered = [...newFiles].filter(
        f => !existingNames.includes(f.name)
      );
      return [...prev, ...filtered];
    });
  };

  const removeFile = (name) => {
    setFiles(files.filter(f => f.name !== name));
  };

    const handleUpload = async () => {
        setUploading(true);

        try {
            for (const file of files) {
            const metadata = {
                name: file.name,
                description: `Uploaded file ${file.name}`,
                parent: currentFolder,
            };

            console.log("Uploading:", metadata);

            const res = await uploadFile({ file, metadata });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Error uploading ${file.name}`);
            }
            }

            onSuccess();
            onClose();
        } catch (err) {
            alert(err.message);
        } finally {
            setUploading(false);
        }
    };


  return (
    <div className="modal-backdrop">
      <div className="modal">

        <h3>Upload files</h3>

        {/* File picker */}
        <input
          type="file"
          multiple
          onChange={(e) => addFiles(e.target.files)}
        />

        {/* Drag & drop */}
        <div
          className="dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
        >
          Drag & drop files here
        </div>

        {/* File list */}
        <ul>
          {files.map(file => (
            <li key={file.name}>
              {file.name}
              <span
                style={{ color: "red", cursor: "pointer", marginLeft: 8 }}
                onClick={() => removeFile(file.name)}
              >
                ✕
              </span>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleUpload}
            disabled={!files.length || uploading}
          >
            Upload now
          </button>
        </div>

      </div>
    </div>
  );
}

export default UploadModal;
