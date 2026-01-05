import { useEffect, useRef } from "react";

function ActionMenu({ actions, onClose }) {
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="action-menu"
      onMouseLeave={onClose}
      tabIndex={0}
    >
      {actions.map((action, index) => (
        <div
          key={index}
          className="action-menu-item"
          onClick={() => {
            action.onClick();
            onClose();
          }}
        >
          {action.label}
        </div>
      ))}
    </div>
  );
}

export default ActionMenu;
