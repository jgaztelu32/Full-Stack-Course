import { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/users/whoami", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          window.location.href = "/login";
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err.message);
        window.location.href = "/login";
      }
    };

    fetchUser();
  }, [token]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return <div>Dashboard: {user.name}</div>;
}

export default Dashboard;
