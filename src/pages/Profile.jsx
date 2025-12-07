import React, { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleChangePassword = async () => {
    if (!oldPass || !newPass) {
      alert("Isi password lama dan baru dulu!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          oldPassword: oldPass,
          newPassword: newPass,
        }),
      });

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        setShowPasswordModal(false);
        setOldPass("");
        setNewPass("");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  if (!user) {
    return (
      <div className="container text-center mt-5">
        <h4>⚠️ Kamu belum login.</h4>
        <p>Silakan login untuk melihat profilmu.</p>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: "500px" }}>
      <h3 className="fw-bold text-center mb-4">👤 Profil Pengguna</h3>

      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body text-center p-4">
          <h4 className="fw-bold mb-1">{user.username}</h4>
          <p className="text-muted">📧 {user.email}</p>

          <span
            className={`badge px-3 py-2 rounded-pill ${
              user.role === "admin" ? "bg-danger" : "bg-primary"
            }`}
          >
            {user.role}
          </span>

          <hr className="my-4" />

          {/* BUTTON GANTI PASSWORD */}
          <button
            className="btn btn-outline-primary w-100 rounded-4"
            onClick={() => setShowPasswordModal(true)}
          >
            🔒 Ganti Password
          </button>
        </div>
      </div>

      {/* =============================================================
          MODAL GANTI PASSWORD
      ============================================================= */}
      {showPasswordModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header">
                <h5 className="modal-title">🔒 Ganti Password</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowPasswordModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <label className="form-label">Password Lama</label>
                <input
                  type="password"
                  className="form-control mb-3"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                />

                <label className="form-label">Password Baru</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Batal
                </button>

                <button className="btn btn-primary" onClick={handleChangePassword}>
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
