import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyEvents() {
  const [events, setEvents] = useState([]);
  const userId = 1; // sementara dummy
  const navigate = useNavigate();

  const fetchMyEvents = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/registration/${userId}`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Gagal mengambil event:", err);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleCancel = async (eventId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/registration/${userId}/${eventId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      alert(data.message);

      // refresh daftar event
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (err) {
      console.error("Gagal membatalkan:", err);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-bold text-center">🎟️ My Registered Events</h3>

      {events.length === 0 ? (
        <p className="text-center text-muted">
          Belum ada event yang kamu daftar 😅
        </p>
      ) : (
        <div className="row">
          {events.map((event) => (
            <div key={event.id} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="card-text text-muted mb-1">📅 {event.date}</p>
                  <p className="card-text text-muted mb-1">📍 {event.location}</p>
                  <span
                    className={`badge ${
                      event.status === "confirmed"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {event.status}
                  </span>

                  {/* Tombol presensi hanya muncul kalau status confirmed */}
                  {event.status === "confirmed" && (
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="btn btn-outline-primary btn-sm mt-3 w-100"
                    >
                      📸 Presensi
                    </button>
                  )}

                  {/* Tombol batal ikut */}
                  <button
                    onClick={() => handleCancel(event.id)}
                    className="btn btn-outline-danger btn-sm mt-2 w-100"
                  >
                    ❌ Batal Ikut
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyEvents;
