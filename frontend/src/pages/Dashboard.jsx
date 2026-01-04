function Dashboard(){
    const token = localStorage.getItem("token");
    if (!token) {
        window.location = "/login"
    }
    return <div>Dashboard: {token}</div>
}

export default Dashboard