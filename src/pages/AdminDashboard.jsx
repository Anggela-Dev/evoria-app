import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState("");

  useEffect(() => {
    fetchRegistrations();
  }, [selectedEvent]);

  const fetchRegistrations = async () => {
    try {
      const url = selectedEvent
        ? `http://localhost:5000/api/registration/event/${selectedEvent}`
        : "http://localhost:5000/api/registration";
      const res = await fetch(url);
      const data = await res.json();
      setRegistrations(data);
    } catch (error) {
      console.error("❌ Gagal ambil data registrasi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (eventId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/registration/promote/${eventId}`,
        { method: "PUT" }
      );
      const data = await res.json();
      alert(data.message);
      fetchRegistrations();
    } catch (err) {
      console.error("❌ Gagal mempromosikan:", err);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-center">🧑‍💼 Admin Dashboard</h2>

      {/* Filter event ID */}
      <div className="mb-3 d-flex justify-content-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Masukkan Event ID (opsional)"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        />
        <button className="btn btn-primary ms-2" onClick={fetchRegistrations}>
          🔍 Cari
        </button>
      </div>

      {loading ? (
        <p className="text-center text-muted">Memuat data...</p>
      ) : registrations.length === 0 ? (
        <p className="text-center text-muted">
          Belum ada data registrasi ditemukan.
        </p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Nama Peserta</th>
              <th>Email</th>
              <th>Event ID</th>
              <th>Status</th>
              <th>Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{reg.username || "-"}</td>
                <td>{reg.email || "-"}</td>
                <td>{reg.event_id}</td>
                <td>
                  <span
                    className={`badge ${
                      reg.status === "confirmed"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {reg.status}
                  </span>
                </td>
                <td>
                  {reg.status === "waitlist" && (
                    <button
                      onClick={() => handlePromote(reg.event_id)}
                      className="btn btn-outline-success btn-sm"
                    >
                      ⬆️ Promote
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
