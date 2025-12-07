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

  // Format tanggal & waktu
  const formattedDate = new Date(event.date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedStart = event.start_time
  ? event.start_time.slice(0, 5) // Format HH:MM
  : "-";

const formattedEnd = event.end_time
  ? event.end_time.slice(0, 5)
  : "-";

const formattedTime = `${formattedStart} - ${formattedEnd}`;


  return (
    <div className="container my-5 d-flex justify-content-center">
      <div
        className="shadow-lg"
        style={{
          maxWidth: "650px",
          width: "100%",
          borderRadius: "16px",
          padding: "3px", // untuk gradient border
          backgroundImage: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          transition: "0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <div
          className="card-body"
          style={{
            borderRadius: "14px",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)",
            padding: "24px",
          }}
        >
          {/* Banner Event */}
          {event.image && (
            <img
              src={event.image}
              alt="Banner Event"
              className="img-fluid rounded mb-4"
              style={{ height: "260px", objectFit: "cover" }}
            />
          )}

          <h2 className="fw-bold text-center mb-3">{event.title}</h2>

          <div className="text-center text-muted mb-3" style={{ lineHeight: "1.6" }}>
            <p>📅 {formattedDate}</p>
            <p>🕒 {formattedTime}</p>
            <p>📍 {event.location}</p>
          </div>

          <p className="text-secondary mb-4" style={{ lineHeight: "1.7" }}>
            {event.description}
          </p>

          <div className="d-flex flex-column align-items-center">
            <button
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                border: "none",
                color: "white",
                fontWeight: "600",
                fontSize: "16px",
                borderRadius: "12px",
                padding: "12px 24px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
                transition: "0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "linear-gradient(135deg, #2563eb, #7c3aed)";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 16px rgba(124,58,237,0.55)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "linear-gradient(135deg, #3b82f6, #8b5cf6)";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(59,130,246,0.4)";
              }}
              onClick={handleRegister}
            >
              Daftar Sekarang 🚀
            </button>

            {message && (
              <p className="mt-3 fw-semibold text-success text-center">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;
