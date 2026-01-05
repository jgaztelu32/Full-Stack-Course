import { FaEllipsisH } from "react-icons/fa";
import Header from "../components/Header";
import { useDashboardData } from "../hooks/useDashboardData";

function Dashboard() {
    const {
        folders,
        files,
        current,
        loading,
        goToFolder,
        folderActions,
        fileActions,
    } = useDashboardData();

    return (
        <div>
            <div style={styles.container}>
                <Header />
            </div>

            <div className="content" style={{ padding: "20px" }}>
                <p>Current folder: {current?.name || "Root"}</p>

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
                                        style={styles.link}
                                        onClick={() => goToFolder(current.parent)}
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
                                        style={styles.link}
                                        onClick={() => goToFolder(folder._id)}
                                    >
                                        {folder.name}
                                    </span>
                                </td>
                                <td className="column-file-size">-</td>
                                <td className="column-menu"><span className="context-menu"
                                    onClick={() => folderActions(folder._id)}>
                                    <FaEllipsisH style={{ cursor: "pointer" }} /></span></td>
                            </tr>
                        ))}

                        {files?.map(file => (
                            <tr key={file._id}>
                                <td className="column-name">{file.name}</td>
                                <td className="column-file-size">{file.size}</td>
                                <td className="column-menu"><span className="context-menu"
                                    onClick={() => fileActions(file._id)}>
                                        <FaEllipsisH style={{ cursor: "pointer" }} /></span>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>

                {loading && <span>Loading...</span>}
            </div>
        </div>
    );
}

const styles = {
    container: {
        width: "100%",
        background: "#f5f5f5",
    },
    link: {
        cursor: "pointer",
        color: "blue",
    },
};

export default Dashboard;
