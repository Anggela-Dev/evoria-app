import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EvoriaLogo from "../Evoria.png";
import SloganImg from "../Slogan.png";

function Home() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortType, setSortType] = useState("Terbaru");
  const navigate = useNavigate();
  const [upcoming, setUpcoming] = useState(null);

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  useEffect(() => {
    if (events.length === 0) return;

    const upcomingEvents = events.filter(
      (ev) => new Date(ev.date) >= new Date()
    );

    if (upcomingEvents.length > 0) {
      const nearest = upcomingEvents.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      )[0];
      setUpcoming(nearest);
    }
  }, [events]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events/public/all");
        if (!res.ok) throw new Error("Server Offline");
        console.log(events.map(ev => `[${ev.category}]`));

        const data = await res.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        console.log("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let data = [...events];

    if (selectedCategory !== "Semua") {
  data = data.filter(ev => {
    const cat = (ev.category || "").trim().toLowerCase();
    return cat === selectedCategory.toLowerCase();
  });
}




    if (searchTerm.trim() !== "") {
      data = data.filter((ev) =>
        ev.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortType === "Terbaru") {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortType === "Terlama") {
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortType === "Terdekat") {
      data.sort(
        (a, b) =>
          Math.abs(new Date(a.date) - new Date()) -
          Math.abs(new Date(b.date) - new Date())
      );
    }

    setFilteredEvents(data);
  }, [searchTerm, selectedCategory, sortType, events]);

  const badgeColor = (cat) => {
    switch (cat) {
      case "Seminar":
        return "bg-primary";
      case "Workshop":
        return "bg-success";
      case "Kompetisi":
        return "bg-danger";
      case "Hiburan":
        return "bg-warning text-dark";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container py-4 mb-5">
      {/* Upcoming Event Modal */}
      {upcoming && (
        <div
          className="modal show fade d-block"
          style={{ background: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reminder Event</h5>
                <button
                  className="btn-close"
                  onClick={() => setUpcoming(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Jangan lupa, kamu punya event: <b>{upcoming.title}</b> 🎉
                </p>
                <p>Mulai: {formatDate(upcoming.date)}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/event/${upcoming.id}`)}
                >
                  Lihat Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-4">
        <img
          src={EvoriaLogo}
          alt="Evoria"
          style={{ width: "200px", marginBottom: "10px" }}
        />
<img 
  src={SloganImg} 
  alt="Evoria Slogan"
  style={{ width: "220px", marginTop: "-80px" }}
/>
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
                      borderRadius: "10px", // agak kecil dari container biar border kelihatan
                      background: "rgba(255,255,255,0.85)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "16px",
                    }}
                  >                
                <h5 className="fw-bold">{event.title}</h5>
                <p className="text-muted mb-1">📅 {formatDate(event.date)}</p>
                <p className="text-muted">📍 {event.location}</p>

                <span className={`badge ${badgeColor(event.category)}`}>
                  {event.category}
                </span>

                <button
                  className="w-100 mt-3"
                  style={{
                    height: "48px",
                    borderRadius: "12px",
                    fontWeight: "600",
                    letterSpacing: "0.3px",
                    color: "white",
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", // biru ke ungu
                    border: "none",
                    boxShadow: "0 4px 12px rgba(139,92,246,0.4)",
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
                    e.target.style.boxShadow = "0 4px 12px rgba(139,92,246,0.4)";
                  }}
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
