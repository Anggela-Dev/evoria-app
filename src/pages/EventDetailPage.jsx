import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/public/event/${id}`);
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error("Gagal mengambil detail event:", err);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return alert("Harap login terlebih dahulu!");

      const response = await fetch("http://localhost:5000/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          event_id: id,
        }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error(error);
      setMessage("Terjadi kesalahan saat mendaftar.");
    }
  };

  if (!event) return <p className="text-center mt-5">Loading...</p>;

  // Format tanggal & waktu biar tidak muncul Txxxxx
  const formattedDate = new Date(event.date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = event.time
    ? new Date(event.time).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Waktu belum ditentukan";

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4" style={{ maxWidth: "650px", width: "100%" }}>
        
        {/* Jika ada gambar event */}
        {event.image && (
          <img
            src={event.image}
            alt="Banner Event"
            className="img-fluid rounded mb-3"
            style={{ height: "260px", objectFit: "cover" }}
          />
        )}

        <h2 className="fw-bold text-center">{event.title}</h2>

        <div className="text-center text-muted mb-3">
          <p>📅 {formattedDate}</p>
          <p>🕒 {formattedTime}</p>
          <p>📍 {event.location}</p>
        </div>

        <p className="pt-2 text-secondary" style={{ lineHeight: "1.7" }}>
          {event.description}
        </p>

        <div className="d-flex flex-column align-items-center">
          <button
            className="btn btn-primary mt-3 px-4 py-2"
            style={{ fontSize: "16px" }}
            onClick={handleRegister}
          >
            Daftar Sekarang 🚀
          </button>

          {message && (
            <p className="mt-3 fw-semibold text-success">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;
