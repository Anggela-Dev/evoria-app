import React, { useState, useEffect } from "react";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    category: "",
    capacity: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("❌ Gagal ambil data event:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:5000/api/events/${editId}`
      : "http://localhost:5000/api/events";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      alert(data.message || "Berhasil disimpan!");
      setForm({
        title: "",
        date: "",
        location: "",
        category: "",
        capacity: "",
        description: "",
      });
      setEditId(null);
      fetchEvents();
    } catch (err) {
      console.error("❌ Gagal simpan event:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus event ini?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data.message);
      fetchEvents();
    } catch (err) {
      console.error("❌ Gagal hapus event:", err);
    }
  };

  const handleEdit = (event) => {
    setEditId(event.id);
    setForm({
      title: event.title,
      date: event.date,
      location: event.location,
      category: event.category,
      capacity: event.capacity,
      description: event.description,
    });
    window.scrollTo({ top: 0, behavior: "smooth" }); // otomatis scroll ke form
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-center">🎯 Event Management</h2>

      {/* ✅ Form Tambah / Edit */}
      <form
        onSubmit={handleSubmit}
        className="mb-4 p-4 border rounded bg-light shadow-sm"
      >
        <h5 className="fw-semibold mb-3 text-center">
          {editId ? "✏️ Edit Event" : "➕ Tambah Event"}
        </h5>

        <div className="row g-3">
          <div className="col-md-6 col-12">
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Judul Event"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3 col-6">
            <input
              type="date"
              name="date"
              className="form-control"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3 col-6">
            <input
              type="number"
              name="capacity"
              className="form-control"
              placeholder="Kapasitas"
              value={form.capacity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 col-12">
            <input
              type="text"
              name="location"
              className="form-control"
              placeholder="Lokasi"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 col-12">
            <select
              name="category"
              className="form-select"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Kategori</option>
              <option value="Seminar">Seminar</option>
              <option value="Workshop">Workshop</option>
              <option value="Kompetisi">Kompetisi</option>
              <option value="Hiburan">Hiburan</option>
            </select>
          </div>
          <div className="col-12">
            <textarea
              name="description"
              className="form-control"
              rows="3"
              placeholder="Deskripsi event..."
              value={form.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>

        <div className="text-end mt-3 d-flex flex-wrap gap-2 justify-content-end">
          <button type="submit" className="btn btn-primary flex-grow-1 flex-md-grow-0">
            {editId ? "💾 Simpan Perubahan" : "➕ Tambah Event"}
          </button>
          {editId && (
            <button
              type="button"
              className="btn btn-secondary flex-grow-1 flex-md-grow-0"
              onClick={() => {
                setEditId(null);
                setForm({
                  title: "",
                  date: "",
                  location: "",
                  category: "",
                  capacity: "",
                  description: "",
                });
              }}
            >
              ❌ Batal
            </button>
          )}
        </div>
      </form>

      {/* ✅ Daftar Event (Responsive) */}
      <div className="table-responsive shadow-sm">
        <table className="table table-bordered align-middle">
          <thead className="table-primary text-center">
            <tr>
              <th>#</th>
              <th>Judul</th>
              <th>Tanggal</th>
              <th>Lokasi</th>
              <th>Kategori</th>
              <th>Kapasitas</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((ev, idx) => (
                <tr key={ev.id}>
                  <td>{idx + 1}</td>
                  <td>{ev.title}</td>
                  <td>{ev.date}</td>
                  <td>{ev.location}</td>
                  <td>{ev.category}</td>
                  <td>{ev.capacity}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(ev)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(ev.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted py-3">
                  Belum ada event yang terdaftar 😅
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminEvents;
