import { useEffect, useState } from "react";
import { authFetch } from "../services/api";

export function useDashboardData() {
    const [folders, setFolders] = useState(null);
    const [files, setFiles] = useState(null);
    const [current, setCurrent] = useState(null);
    const [loading, setLoading] = useState(false);

    const folder = localStorage.getItem("folder") || "root";

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return;
        }

        const loadData = async () => {
            setLoading(true);

            try {
                // Folders
                const foldersRes = await authFetch(`/folders/${folder}`);
                setFolders(await foldersRes.json());

                if (folder !== "root") {
                    // Current folder
                    const currentRes = await authFetch(`/folders/current/${folder}`);
                    const currentData = await currentRes.json();

                    setCurrent({
                        id: currentData._id,
                        name: currentData.name,
                        parent: currentData.parent || "root",
                    });

                    // Files
                    const filesRes = await authFetch(`/files/folder/${folder}`);
                    setFiles(await filesRes.json());
                } else {
                    setCurrent(null);
                    setFiles(null);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [folder]);

    const goToFolder = (id) => {
        localStorage.setItem("folder", id);
        window.location.reload();
    };

    const folderActions = (id) => {
        console.log("Folder actions for:", id);
        // Implement folder actions logic here
    };

    const fileActions = (id) => {
        console.log("File actions for:", id);
        // Implement file actions logic here
    };

    return {
        folders,
        files,
        current,
        loading,
        goToFolder,
        folderActions,
        fileActions,
    };
}
