function Header() {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return null;
}

export default Header;