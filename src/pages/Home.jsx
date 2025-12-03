import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortType, setSortType] = useState("Terbaru");
  const navigate = useNavigate();

  // ================= Format tanggal lokal Indonesia =================
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  // ================= Fetch Data =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events/public/all");
        if (!res.ok) throw new Error("Server Offline");

        const data = await res.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        console.log("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  // ================= Filter & Search & Sort =================
  useEffect(() => {
    let data = [...events];

    // Filter kategori
    if (selectedCategory !== "Semua") {
      data = data.filter(ev =>
        ev.category?.trim().toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search by title
    if (searchTerm.trim() !== "") {
      data = data.filter(ev =>
        ev.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    if (sortType === "Terbaru") {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortType === "Terlama") {
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortType === "Terdekat") {
      data.sort((a, b) => Math.abs(new Date(a.date) - new Date()) - Math.abs(new Date(b.date) - new Date()));
    }

    setFilteredEvents(data);
  }, [searchTerm, selectedCategory, sortType, events]);

  // ================= Dynamic Badge Color =================
  const badgeColor = (cat) => {
    switch (cat) {
      case "Seminar": return "bg-primary";
      case "Workshop": return "bg-success";
      case "Kompetisi": return "bg-danger";
      case "Hiburan": return "bg-warning text-dark";
      default: return "bg-secondary";
    }
  };

  return (
    <div className="container py-4 mb-5">

      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Evoria</h2>
        <p className="text-muted">Temukan & kelola event kampus dengan mudah 🔥</p>
      </div>

      {/* Search & Filter & Sort */}
      <div className="d-flex flex-wrap gap-2 justify-content-between mb-4">

        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "300px" }}
          placeholder="Cari event..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="form-select"
          style={{ maxWidth: "180px" }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="Semua">Semua Kategori</option>
          <option value="Seminar">Seminar</option>
          <option value="Workshop">Workshop</option>
          <option value="Kompetisi">Kompetisi</option>
          <option value="Hiburan">Hiburan</option>
        </select>

        <select
          className="form-select"
          style={{ maxWidth: "180px" }}
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="Terbaru">Terbaru</option>
          <option value="Terlama">Terlama</option>
          <option value="Terdekat">Terdekat</option>
        </select>
      </div>

      {/* Event List */}
      <div className="row">
        {filteredEvents.map((event) => (
          <div key={event.id} className="col-lg-4 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100"
              style={{
                backdropFilter: "blur(10px)",
                background: "rgba(255,255,255,0.85)",
                transition: "0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1.0)"}
            >
              <div className="card-body">
                <h5 className="fw-bold">{event.title}</h5>
                <p className="text-muted mb-1">📅 {formatDate(event.date)}</p>
                <p className="text-muted">📍 {event.location}</p>

                <span className={`badge ${badgeColor(event.category)}`}>
                  {event.category}
                </span>

                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={() => navigate(`/event/${event.id}`)}
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center mt-5 text-muted">
          <h5>Tidak ada event ditemukan 😅</h5>
        </div>
      )}
    </div>
  );
}

export default Home;
