export const fileActions = (fileId) => [
    {
        label: "Download file",
        onClick: () => {
            console.log("Download file:", fileId);
        },
    },
    {
        label: "Rename file",
        onClick: () => {
            console.log("Rename file:", fileId);
        },
    },
    {
        label: "Move file",
        onClick: () => {
            console.log("Move file:", fileId);
        },
    },
    {
        label: "Delete file",
        onClick: () => {
            console.log("Delete file:", fileId);
        },
    },
];
