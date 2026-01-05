import { FaEllipsisH, FaUpload, FaFolder } from "react-icons/fa";
import Header from "../components/Header";
import { useDashboardData } from "../hooks/useDashboardData";
import ActionMenu from "../components/ActionMenu";
import { folderActions } from "../components/FolderActions";
import { fileActions } from "../components/FileActions";
import { useState } from "react";
import UploadModal from "../components/UploadModal";

function Dashboard() {
    const [showUpload, setShowUpload] = useState(false);
    const {
        folders,
        files,
        current,
        loading,
        goToFolder,
    } = useDashboardData();

    const [menu, setMenu] = useState(null); // { x, y, actions }

    const openFolderMenu = (e, folderId) => {
        e.stopPropagation();
        setMenu({
            x: e.clientX,
            y: e.clientY,
            actions: folderActions(folderId),
        });
    };

    const openFileMenu = (e, fileId) => {
    e.stopPropagation();
        setMenu({
            x: e.clientX,
            y: e.clientY,
            actions: fileActions(fileId),
        });
    };

    const closeMenu = () => setMenu(null);

  return (
    <div>
      <div className="header-container">
        <Header />
      </div>

      <div className="content" style={{ padding: "20px" }}>
        <div className="dashboard-header">
            <div className="current-folder">Current folder: {current?.name || "Root"}</div>
            <div className="current-actions">
                <button><FaFolder /> New folder</button>
                <button onClick={() => setShowUpload(true)}><FaUpload /> Upload file</button>
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
                <td className="column-file-size">-</td>
                <td className="column-menu">
                  <span
                    className="context-menu"
                    onClick={(e) => openFolderMenu(e, folder._id)}
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
                    onClick={(e) => openFileMenu(e, file._id)}
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
    </div>
  );
}

export default Dashboard;
