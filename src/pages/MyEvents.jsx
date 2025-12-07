import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState(new Set());

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const fetchMyEvents = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/registration/${userId}`);
      const data = await res.json();

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : [];

      setEvents(list);
      return list;
    } catch (err) {
      console.error("Gagal mengambil event:", err);
      return [];
    }
  };

  const fetchAttendanceStatus = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/attendance/status/${userId}`
      );

      const attended = await res.json();

      if (Array.isArray(attended)) {
        setAttendedEvents(new Set(attended));
      } else {
        setAttendedEvents(new Set());
      }
    } catch (err) {
      console.error("Gagal ambil status presensi:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchMyEvents();
      await fetchAttendanceStatus();
    };

    load();
  }, []);

  const handleCancel = async (eventId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/registration/${userId}/${eventId}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      alert(data.message);

      setEvents(events.filter((e) => e.id !== eventId));

      const updated = new Set(attendedEvents);
      updated.delete(eventId);
      setAttendedEvents(updated);
    } catch (err) {
      console.error("Gagal membatalkan event:", err);
    }
  };

  return (
    <div className="container py-4 mb-5">
      <h3 className="fw-bold text-center mb-4">🎟️ My Registered Events</h3>

      {events.length === 0 ? (
        <p className="text-center text-muted">Belum ada event yang kamu daftar 😅</p>
      ) : (
        <div className="row">
          {events.map((event) => {
            const sudahPresensi = attendedEvents.has(event.id);

            return (
              <div key={event.id} className="col-lg-4 col-md-6 mb-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{
                    backdropFilter: "blur(10px)",
                    background: "rgba(255,255,255,0.85)",
                    transition: "0.25s",
                    padding: "2px",
                    backgroundImage: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1.0)")
                  }
                >
                  <div
                    className="card-body"
                    style={{
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.85)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "16px",
                    }}
                  >
                    <h5 className="fw-bold">{event.title}</h5>

                    <p className="text-muted mb-1">
                      📅{" "}
                      {new Date(event.date).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    <p className="text-muted mb-1">📍 {event.location}</p>

                    <span
                      className={`badge ${
                        event.status === "confirmed"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {event.status}
                    </span>

                    {sudahPresensi ? (
                      <button
                        className="w-100 mt-3"
                        style={{
                          height: "45px",
                          borderRadius: "12px",
                          fontWeight: "600",
                          background: "gray",
                          color: "white",
                          border: "none",
                          cursor: "default",
                        }}
                        disabled
                      >
                        ✔ Sudah Presensi
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          navigate("/dashboard", {
                            state: { eventId: event.id },
                          })
                        }
                        className="w-100 mt-3"
                        style={{
                          height: "45px",
                          borderRadius: "12px",
                          fontWeight: "600",
                          color: "white",
                          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(139,92,246,0.4)",
                          transition: "0.25s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background =
                            "linear-gradient(135deg, #2563eb, #7c3aed)";
                          e.target.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background =
                            "linear-gradient(135deg, #3b82f6, #8b5cf6)";
                          e.target.style.transform = "translateY(0)";
                        }}
                      >
                        📸 Presensi
                      </button>
                    )}

                    <button
                      onClick={() => handleCancel(event.id)}
                      className="w-100 mt-2"
                      style={{
                        height: "45px",
                        borderRadius: "12px",
                        fontWeight: "600",
                        color: "white",
                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(220,38,38,0.4)",
                        transition: "0.25s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background =
                          "linear-gradient(135deg, #b91c1c, #991b1b)";
                        e.target.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background =
                          "linear-gradient(135deg, #ef4444, #dc2626)";
                        e.target.style.transform = "translateY(0)";
                      }}
                    >
                      ❌ Batal Ikut
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyEvents;
