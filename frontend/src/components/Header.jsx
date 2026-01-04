import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user } = useAuth();

  if (!user) {
    return null; // o spinner
  }

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <Link to="/">My Full-Stack App</Link>
      </div>

      <div style={styles.userActions}>
        {user.name} <FaUser />
        <Link to="/logout">
          <FaSignOutAlt />
        </Link>
      </div>
    </header>
  );
}

const styles = {
    header: {
        display: "flex",
        alignItems: "center",              /* Centra verticalmente */
        justifyContent: "space-between",   /* Logo a la izquierda, usuario a la derecha */
        backgroundColor: "#f5f5f5",      /* Color de fondo claro */
        height: "60px",                    /* Altura del header */
        padding: "0 16px",                 /* Espaciado horizontal */
        width: "-webkit-fill-available",   /* Ocupa todo el ancho disponible */
    },

    /* Logo / nombre de la aplicación */
    logo: {
        display: "flex",
        alignItems: "center",
    },

    /* Información / acciones del usuario */
    userActions: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "12px"                        /* Espacio entre elementos internos */
    }
};

export default Header;