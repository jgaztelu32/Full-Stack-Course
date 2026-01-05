export const folderActions = (folderId) => [
    {
        label: "Rename folder",
        onClick: () => {
            console.log("Rename folder:", folderId);
        },
    },
    {
        label: "Move folder",
        onClick: () => {
            console.log("Move folder:", folderId);
        },
    },
    {
        label: "Delete folder",
        onClick: () => {
            console.log("Delete folder:", folderId);
        },
    },
];
