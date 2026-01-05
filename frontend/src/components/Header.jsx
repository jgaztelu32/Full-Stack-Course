import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user } = useAuth();

  if (!user) {
    return null; // o spinner
  }

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/"><img src="/cloudfiles_logo_transparent.svg" alt="Cloud Files" /></Link>
      </div>

      <div className="user-actions">
        {user.name} <FaUser />
        <Link to="/logout">
          <span className="logout-icon"><FaSignOutAlt /></span>
        </Link>
      </div>
    </header>
  );
}

export default Header;