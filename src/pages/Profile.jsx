import React, { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="container text-center mt-5">
        <h4>⚠️ Kamu belum login.</h4>
        <p>Silakan login untuk melihat profilmu.</p>
      </div>
    );
  }

  return (
    <div className="container text-center mt-5">
      <h3 className="fw-bold mb-3">👤 Profil Pengguna</h3>
      <div className="card mx-auto shadow-sm" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h5 className="card-title">{user.username}</h5>
          <p className="card-text text-muted mb-1">📧 {user.email}</p>
          <p className="card-text">
            🧩 <strong>Role:</strong>{" "}
            <span
              className={`badge ${
                user.role === "admin"
                  ? "bg-danger"
                  : "bg-primary"
              }`}
            >
              {user.role}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
