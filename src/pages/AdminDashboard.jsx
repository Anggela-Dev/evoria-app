import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("user_id"); // ID Admin yang login

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/dashboard?user_id=${userId}`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("❌ API tidak mengembalikan array:", data);
        return;
      }

      setEvents(data);
    } catch (error) {
      console.error("Gagal load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">

      <h2 className="fw-bold text-center mb-4">📊 Admin Dashboard</h2>

      {/* =================== CHART =================== */}
      {!loading && events.length > 0 && (
        <div className="mb-5 shadow p-4 rounded" style={{ height: "400px" }}>
          <h4 className="text-center mb-4">📈 Grafik Jumlah Registrasi per Event</h4>

          <Bar
            data={{
              labels: events.map(e => e.title),
              datasets: [{
                label: "Total Registrasi",
                data: events.map(e => e.total_registrations),
                backgroundColor: "rgba(54,162,235,0.6)"
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" }
              },
              scales: {
                x: { ticks: { autoSkip: false, maxRotation: 30 }},
                y: { beginAtZero: true }
              }
            }}
          />
        </div>
      )}

      {/* =================== TABLE =================== */}
      <div className="shadow p-3 rounded">
        <h4 className="mb-3">📄 Detail Event yang Kamu Buat</h4>

        {loading ? (
          <p>Loading...</p>
        ) : events.length === 0 ? (
          <p className="text-muted">Belum ada event yang kamu buat.</p>
        ) : (
          <table className="table table-bordered table-striped">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Nama Event</th>
                <th>Total Registrasi</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, i) => (
                <tr key={e.id}>
                  <td>{i + 1}</td>
                  <td>{e.title}</td>
                  <td>{e.total_registrations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
