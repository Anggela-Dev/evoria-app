import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/dashboard?user_id=${userId}`
      );
      const data = await res.json();

      let arr = [];
      if (Array.isArray(data)) arr = data;
      else if (Array.isArray(data.events)) arr = data.events;
      else if (Array.isArray(data.data)) arr = data.data;

      setEvents(arr);
    } catch (error) {
      console.error("Gagal load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // ========== GRADIENT BAR COLOR ==========
  const gradientBar = (ctx) => {
    const chart = ctx.chart;
    const { ctx: canvas, chartArea } = chart;

    if (!chartArea) return null;

    const grad = canvas.createLinearGradient(0, 0, 0, chartArea.bottom);
    grad.addColorStop(0, "#7F67FF"); // ungu
    grad.addColorStop(1, "#4DB6FF"); // biru

    return grad;
  };

  return (
    <div
      className="py-4 px-3"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6E4AFF, #4DB6FF)",
      }}
    >
      <h2 className="fw-bold text-center mb-4 text-white">
        📊 Admin Dashboard
      </h2>

      {/* ===================== CHART CARD ===================== */}
      {!loading && events.length > 0 && (
        <div
          className="card shadow mb-5"
          style={{
            borderRadius: "14px",
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          <div className="card-body text-white">
            <h5 className="text-center fw-bold mb-4">
              📈 Grafik Jumlah Registrasi per Event
            </h5>

            <div style={{ height: "350px" }}>
              <Bar
                data={{
                  labels: events.map((e) => e.title),
                  datasets: [
                    {
                      label: "Total Registrasi",
                      data: events.map((e) => e.total_registrations),
                      backgroundColor: gradientBar,
                      borderRadius: 8,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: "white" } },
                  },
                  scales: {
                    x: {
                      ticks: { color: "white" },
                    },
                    y: {
                      ticks: { color: "white" },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ===================== TABLE CARD ===================== */}
      <div
        className="card shadow"
        style={{
          borderRadius: "14px",
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <div className="card-body text-white">
          <h5 className="fw-bold mb-3">📄 Event yang Kamu Buat</h5>

          {loading ? (
            <p>Loading...</p>
          ) : events.length === 0 ? (
            <p className="text-light">Belum ada event yang kamu buat.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped text-white">
                <thead style={{ background: "#7F67FF", color: "white" }}>
                  <tr>
                    <th>#</th>
                    <th>Nama Event</th>
                    <th>Total Registrasi</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e, i) => (
                    <tr key={e.id} style={{ background: "rgba(255,255,255,0.1)" }}>
                      <td>{i + 1}</td>
                      <td>{e.title}</td>
                      <td>{e.total_registrations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
