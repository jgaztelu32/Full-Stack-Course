import { FaEllipsisH, FaUpload, FaFolder } from "react-icons/fa";
import { useState } from "react";

import Header from "../components/Header";
import ActionMenu from "../components/ActionMenu";
import UploadModal from "../components/UploadModal";
import CreateFolderModal from "../components/CreateFolderModal";
import MoveFolderModal from "../components/MoveFolderModal";
import FileRenameModal from "../components/modal-file-rename";
import { useDashboardData } from "../hooks/useDashboardData";
import { folderActions } from "../components/FolderActions";
import { fileActions } from "../components/FileActions";
import { createFolder } from "../services/folderService";
import MoveFileModal from "../components/MoveFileModal";
import RenameFolderModal from "../components/RenameFolderModal";

function Dashboard() {
    const {
        folders,
        files,
        current,
        loading,
        goToFolder,
    } = useDashboardData();

    const [menu, setMenu] = useState(null);
    const [showUpload, setShowUpload] = useState(false);
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [moveFolder, setMoveFolder] = useState(null);
    const [moveFile, setMoveFile] = useState(null);
    const [renameFolder, setRenameFolder] = useState(null);

    const closeMenu = () => setMenu(null);

    const openFolderMenu = (e, folder) => {
        e.stopPropagation();
        setMenu({
            x: e.clientX,
            y: e.clientY,
            actions: folderActions(folder._id, setMoveFolder, setRenameFolder, folder),
        });
    };

    const openFileMenu = (e, fileId) => {
        e.stopPropagation();
        setMenu({
            x: e.clientX,
            y: e.clientY,
            actions: fileActions(fileId, files.find(f => f._id === fileId), setMoveFile),
        });
    };

    const handleCreateFolder = async (data) => {
        try {
            await createFolder(data);
            setShowCreateFolder(false);
            window.location.reload();
        } catch {
            alert("Error creating folder");
        }
    };

    const movingFolder = folders?.find(f => f._id === moveFolder);

    return (
        <div>
            <div className="header-container">
                <Header />
            </div>

            <div className="content" style={{ padding: "20px" }}>
                <div className="dashboard-header">
                    <div className="current-folder">
                        Current folder: {current?.name || "Root"}
                    </div>

                    <div className="current-actions">
                        <button onClick={() => setShowCreateFolder(true)}>
                            <FaFolder /> New folder
                        </button>

                        {current && (
                            <button onClick={() => setShowUpload(true)}>
                                <FaUpload /> Upload file
                            </button>
                        )}
                    </div>
                </div>

                {showUpload && (
                    <UploadModal
                        currentFolder={current?.id}
                        onClose={() => setShowUpload(false)}
                        onSuccess={() => window.location.reload()}
                    />
                )}

                <table className="content-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th className="table-header-size">Size</th>
                            <th className="table-header-actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {current && (
                            <tr>
                                <td className="parent-folder">
                                    <span
                                        className="folder-link"
                                        onClick={() => goToFolder(current.parent)}
                                        title="Go up"
                                    >
                                        ..
                                    </span>
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                        )}

                        {folders?.map(folder => (
                            <tr key={folder._id}>
                                <td className="column-name">
                                    <span
                                        className="folder-link"
                                        onClick={() => goToFolder(folder._id)}
                                    >
                                        {folder.name}
                                    </span>
                                </td>
                                <td className="column-file-size">Folder</td>
                                <td className="column-menu">
                                    <span
                                        className="context-menu"
                                        onClick={(e) => openFolderMenu(e, folder)}
                                    >
                                        <FaEllipsisH />
                                    </span>
                                </td>
                            </tr>
                        ))}

                        {files?.map(file => (
                            <tr key={file._id}>
                                <td className="column-name">{file.name}</td>
                                <td className="column-file-size">{file.size}</td>
                                <td className="column-menu">
                                    <span
                                        className="context-menu"
                                        onClick={(e) => openFileMenu(e, file._id, file)}
                                    >
                                        <FaEllipsisH />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {loading && <span>Loading...</span>}
            </div>

            {menu && (
                <div
                    style={{
                        position: "fixed",
                        top: menu.y,
                        left: menu.x,
                        zIndex: 2000,
                    }}
                >
                    <ActionMenu actions={menu.actions} onClose={closeMenu} />
                </div>
            )}

            {showCreateFolder && (
                <CreateFolderModal
                    parentId={current?.id || "root"}
                    onCreate={handleCreateFolder}
                    onCancel={() => setShowCreateFolder(false)}
                />
            )}

            {moveFolder && movingFolder && (
                <MoveFolderModal
                    folderId={moveFolder}
                    folderName={movingFolder.name}
                    onClose={() => setMoveFolder(null)}
                />
            )}
            {moveFile && (
                <MoveFileModal
                    file={moveFile}
                    onClose={() => setMoveFile(null)}
                    onSuccess={() => window.location.reload()}
                />
            )}
            {renameFolder && (
                <RenameFolderModal
                    folderId={renameFolder.id}
                    currentName={renameFolder.name}
                    currentDescription={renameFolder.description}
                    onClose={() => setRenameFolder(null)}
                    onSuccess={() => {
                        setRenameFolder(null);
                        window.location.reload()}
                    }
                />
            )}


            <FileRenameModal />
        </div>
    );
}

export default Dashboard;
