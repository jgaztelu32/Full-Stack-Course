export default function FolderTree({
    tree,
    selectedId,
    onSelect,
    disabledId,
    level = 0,
}) {
    return (
        <ul className={level === 0 ? "folder-tree" : ""}>
            {tree.map(folder => {
                const isDisabled = folder._id === disabledId;

                return (
                    <li key={folder._id}>
                        <span
                            style={{
                                cursor: isDisabled ? "not-allowed" : "pointer",
                                opacity: isDisabled ? 0.5 : 1,
                                color: folder._id === selectedId ? "blue" : "inherit",
                            }}
                            onClick={() => {
                                if (!isDisabled) {
                                    onSelect(folder);
                                }
                            }}
                        >
                            📁 {folder.name}
                        </span>

                        {!isDisabled && folder.children?.length > 0 && (
                            <FolderTree
                                tree={folder.children}
                                onSelect={onSelect}
                                disabledId={disabledId}
                                level={level + 1}
                            />
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
