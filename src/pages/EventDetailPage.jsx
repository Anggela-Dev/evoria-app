import React, { useState } from "react";

function EventDetailPage() {
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1,   // nanti bisa diganti user login
          event_id: 1,  // event yang sedang dilihat
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal melakukan request");
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error(error);
      setMessage("Terjadi kesalahan saat mendaftar.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Workshop UI/UX Mastery</h1>
      <p>Pelatihan interaktif seputar desain antarmuka dan UX.</p>
      <button className="btn btn-primary" onClick={handleRegister}>
        Daftar Sekarang
      </button>

      {message && (
        <p className="mt-3 fw-semibold text-success">{message}</p>
      )}
    </div>
  );
}

export default EventDetailPage;
