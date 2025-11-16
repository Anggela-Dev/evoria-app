import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const navigate = useNavigate();

  useEffect(() => {
    // ambil dari server dulu, kalau gagal -> fallback ke dummy
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events");
        if (!res.ok) throw new Error("Server offline");
        const data = await res.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch {
        // fallback dummy data
        const dummyEvents = [
          {
            id: 1,
            title: "Workshop UI/UX Design",
            date: "2025-11-10",
            location: "Lab Multimedia",
            category: "Workshop",
            description:
              "Pelatihan interaktif tentang prinsip desain antarmuka modern untuk aplikasi mobile dan website.",
          },
          {
            id: 2,
            title: "Tech Talk: Future of AI",
            date: "2025-11-15",
            location: "Aula Utama",
            category: "Seminar",
            description:
              "Diskusi mendalam seputar perkembangan Artificial Intelligence di tahun 2025 dan dampaknya terhadap industri.",
          },
          {
            id: 3,
            title: "Startup Pitch Day",
            date: "2025-11-20",
            location: "Auditorium Kampus",
            category: "Kompetisi",
            description:
              "Ajang kompetisi startup antar mahasiswa dengan dewan juri dari pelaku industri teknologi.",
          },
          {
            id: 4,
            title: "Web Development Bootcamp",
            date: "2025-11-25",
            location: "Lab Riset Informatika",
            category: "Workshop",
            description:
              "Bootcamp intensif membangun aplikasi web modern menggunakan React dan Node.js.",
          },
          {
            id: 5,
            title: "Festival Musik Kampus",
            date: "2025-12-01",
            location: "Lapangan Utama",
            category: "Hiburan",
            description:
              "Pertunjukan musik tahunan yang menampilkan band dan penyanyi dari berbagai fakultas.",
          },
        ];
        setEvents(dummyEvents);
        setFilteredEvents(dummyEvents);
      }
    };
    fetchData();
  }, []);

  // Fungsi filter berdasarkan kategori & search
  useEffect(() => {
    let data = events;

    // filter kategori
    if (selectedCategory !== "Semua") {
      data = data.filter((ev) => ev.category === selectedCategory);
    }

    // filter pencarian
    if (searchTerm.trim() !== "") {
      data = data.filter((ev) =>
        ev.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(data);
  }, [searchTerm, selectedCategory, events]);

  return (
    <div className="container py-4 mb-5">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold" style={{ color: "#007bff" }}>
          Evoria
        </h2>
        <p className="text-muted mb-1">
          Kelola & temukan acara kampus dengan mudah 🔥
        </p>
      </div>

      {/* Filter & Search */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
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
          style={{ maxWidth: "200px" }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="Semua">Semua Kategori</option>
          <option value="Seminar">Seminar</option>
          <option value="Workshop">Workshop</option>
          <option value="Kompetisi">Kompetisi</option>
          <option value="Hiburan">Hiburan</option>
        </select>
      </div>

      {/* Event List */}
      <div className="row">
        {filteredEvents.map((event) => (
          <div key={event.id} className="col-md-4 col-sm-6 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-start">
                <h5 className="card-title fw-semibold">{event.title}</h5>
                <p className="card-text text-muted mb-1">📅 {event.date}</p>
                <p className="card-text text-muted">📍 {event.location}</p>
                <p className="card-text">
                  <span className="badge bg-primary">{event.category}</span>
                </p>
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => navigate(`/event/${event.id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center text-muted mt-5">
          <p>Event tidak ditemukan 😅</p>
        </div>
      )}
    </div>
  );
}

export default Home;
