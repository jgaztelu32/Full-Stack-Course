import { useEffect, useState } from "react";
import Header from "../components/Header";

function Dashboard() {
    const token = localStorage.getItem("token");
    const folder = localStorage.getItem("folder") || "root";
    const urlFolders = "http://localhost:8000/api/folders/" + folder;
    const urlCurrent = "http://localhost:8000/api/folders/current/" + folder;
    const urlFiles = "http://localhost:8000/api/files/folder/" + folder;
    const [folders, setFolders] = useState(null);
    const [current, setCurrent] = useState(null);
    const [files, setFiles] = useState(null);

    useEffect(() => {
        if (!token) {
            window.location.href = "/login";
            return;
        }

        const getFolders = async () => {
            try {
                const res = await fetch( urlFolders, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    window.location.href = "/login";
                    return;
                }

                const data = await res.json();

                setFolders(data);
            } catch (err) {
                console.error(err.message);
                window.location.href = "/login";
            }
        };

        const getCurrent = async () => {
            try {
                const res = await fetch( urlCurrent, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    window.location.href = "/login";
                    return;
                }

                const data = await res.json();

                setCurrent({
                    id: data._id,
                    name: data.name,
                    parent: data.parent || "root",
                });
            } catch (err) {
                console.error(err.message);
                window.location.href = "/login";
            }
        };

        const getFiles = async () => {
            try {
                const res = await fetch( urlFiles, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    setFiles(null);
                    return;
                }

                const data = await res.json();

                setFiles(data);
            } catch (err) {
                console.error(err.message);
                window.location.href = "/login";
            }
        };

        getFolders();
        if (folder !== "root") {
            getCurrent();
            getFiles();
        }
    }, [token]);

    const handleFolderClick = (folderId) => {
        localStorage.setItem("folder", folderId);
        window.location.reload();
    };

    const handleFileClick = (fileId) => {
        console.log("Downloading file with ID:", fileId);
    }

  return (
    <div>
        <div style={styles.container}>
            <Header />
        </div>
        <div className="content" style={{ padding: "20px" }}>
            <p>Current folder: {current?.name || "Root"}</p>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Size</th>
                </tr>
                </thead>
                <tbody>
                    {current && (
                        <tr>
                            <td>
                                <span
                                    className="folder-name"
                                    style={{ cursor: "pointer", color: "blue" }}
                                    onClick={() => {
                                        localStorage.setItem("folder", current?.parent || "root");
                                        window.location.reload();
                                    }}>..</span>
                            </td>
                            <td></td>
                        </tr>
                    )}
                {folders && folders.map((item) => (
                    <tr key={item._id}>
                        <td><span
                            className="folder-name"
                            style={{ cursor: "pointer", color: "blue" }}
                            onClick={() => handleFolderClick(item._id)}>{item.name}</span>
                        </td>
                        <td>-</td>
                    </tr>
                ))}
                {files && files.map((item) => (
                    <tr key={item._id}>
                        <td><span
                            className="file-name"
                            style={{ cursor: "pointer", color: "blue" }}
                            onClick={() => handleFileClick(item._id)}>{item.name}</span>
                        </td>
                        <td>{item.size}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}

const styles = {
    container: {
        width: "100%",
        display: "flex",
        alignItems: "top",
        justifyContent: "left",
        background: "#f5f5f5",
    }
}

export default Dashboard;
