import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState(new Set());

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
console.log("USER LOCALSTORAGE:", user);
console.log("USER ID:", userId);

  /* ============================================================
     1) Ambil daftar event user
  ============================================================ */
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

  /* ============================================================
     2) Ambil semua event_id yang sudah dipresensi user
     Backend return contoh: [1,3,5]
  ============================================================ */
  const fetchAttendanceStatus = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/attendance/status/${userId}`
      );

      const attended = await res.json();
if (Array.isArray(attended)) {
  setAttendedEvents(new Set(attended));
} else {
  console.warn("Format tidak sesuai, isi:", attended);
  setAttendedEvents(new Set());
}

    } catch (err) {
      console.error("Gagal ambil status presensi:", err);
    }
  };

  /* ============================================================
     3) Load awal
  ============================================================ */
  useEffect(() => {
    const load = async () => {
      await fetchMyEvents();
      await fetchAttendanceStatus();
    };

    load();
  }, []);

  /* ============================================================
     4) Batalkan event
  ============================================================ */
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

  /* ============================================================
     5) UI Render
  ============================================================ */
  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-bold text-center">🎟️ My Registered Events</h3>

      {events.length === 0 ? (
        <p className="text-center text-muted">
          Belum ada event yang kamu daftar 😅
        </p>
      ) : (
        <div className="row">
          {events.map((event) => {
            const sudahPresensi = attendedEvents.has(event.id);

            return (
              <div key={event.id} className="col-md-4 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">{event.title}</h5>
<p className="text-muted mb-1">
  📅 {new Date(event.date).toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric' })}
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

                    {/* PRESENSI BUTTON */}
                    {sudahPresensi ? (
                      <button className="btn btn-success btn-sm mt-3 w-100" disabled>
                        ✔ Sudah Presensi
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          navigate("/dashboard", {
                            state: { eventId: event.id },
                          })
                        }
                        className="btn btn-outline-primary btn-sm mt-3 w-100"
                      >
                        📸 Presensi
                      </button>
                    )}

                    <button
                      onClick={() => handleCancel(event.id)}
                      className="btn btn-outline-danger btn-sm mt-2 w-100"
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
