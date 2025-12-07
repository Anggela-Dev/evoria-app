import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    category: "",
    capacity: "",
    description: "",
  });

  const [editId, setEditId] = useState(null);
  const [qrEventId, setQrEventId] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const adminId = user?.id;

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events", {
        headers: { "x-admin-id": adminId },
      });
      setEvents(await res.json());
    } catch (err) {
      console.error("❌ Error fetch:", err);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Kategori yang dipilih:", form.category); // << ini
    const payload = { ...form, category: form.category || null };
    if (!form.category) {
      alert("Kategori wajib dipilih!");
      return;
    }

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:5000/api/events/${editId}`
      : "http://localhost:5000/api/events";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-admin-id": adminId },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      alert(data.message || "Berhasil!");
      setForm({
        title: "", date: "", start_time: "", end_time: "",
        location: "", category: "", capacity: "", description: "",
      });
      setEditId(null);
      fetchEvents();
    } catch (err) {
      console.error("❌ Error save:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus event?")) return;
    await fetch(`http://localhost:5000/api/events/${id}`, {
      method: "DELETE",
      headers: { "x-admin-id": adminId },
    });
    fetchEvents();
  };

  const handleEdit = (ev) => {
    setEditId(ev.id);
    setForm({
      title: ev.title || "",
      date: ev.date || "",
      start_time: ev.start_time || "",
      end_time: ev.end_time || "",
      location: ev.location || "",
      category: ev.category || "", // <- jangan biarkan null
      capacity: ev.capacity || "",
      description: ev.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container py-3">
      <h2 className="fw-bold text-center mb-4">📅 Manage Event</h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border rounded bg-light shadow-sm mb-4"
        style={{ maxWidth: 900, margin: "0 auto" }}
      >
        <h5 className="text-center mb-3">
          {editId ? "✏️ Edit Event" : "➕ Tambah Event"}
        </h5>

        <div className="row g-3">
          <div className="col-12">
            <input
              name="title" placeholder="Judul Event"
              className="form-control" required
              value={form.title} onChange={handleChange}
            />
          </div>

          <div className="col-6 col-md-4">
            <input type="date" name="date" className="form-control"
              required value={form.date} onChange={handleChange} />
          </div>

          <div className="col-6 col-md-4">
            <input type="time" name="start_time" className="form-control"
              required value={form.start_time} onChange={handleChange} />
          </div>

          <div className="col-6 col-md-4">
            <input type="time" name="end_time" className="form-control"
              value={form.end_time} onChange={handleChange} />
          </div>

          <div className="col-6 col-md-4">
            <input type="number" name="capacity" placeholder="Kapasitas"
              className="form-control" required value={form.capacity} onChange={handleChange} />
          </div>

          <div className="col-12 col-md-8">
            <input name="location" placeholder="Lokasi Event"
              className="form-control" required value={form.location} onChange={handleChange} />
          </div>

          <div className="col-12 col-md-6">
            <select name="category" className="form-select"
              required value={form.category} onChange={handleChange}>
              <option value="">Pilih Kategori</option>
              <option value="Seminar">Seminar</option>
              <option value="Workshop">Workshop</option>
              <option value="Kompetisi">Kompetisi</option>
              <option value="Hiburan">Hiburan</option>
            </select>
          </div>

          <div className="col-12">
            <textarea name="description" rows="3" className="form-control"
              placeholder="Deskripsi event..." required
              value={form.description} onChange={handleChange} />
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-end flex-wrap mt-3">
          <button className="btn btn-primary">{editId ? "Simpan" : "Tambah"}</button>
          {editId && (
            <button type="button" className="btn btn-secondary"
              onClick={() => {
                setEditId(null);
                setForm({
                  title:"", date:"", start_time:"", end_time:"",
                  location:"", category:"", capacity:"", description:""
                });
              }}>
              Batal
            </button>
          )}
        </div>
      </form>

      {/* TABLE */}
      <div className="table-responsive shadow-sm rounded overflow-x-auto">
        <table className="table table-striped align-middle text-center">
          <thead className="table-primary">
            <tr>
              <th>#</th><th>Judul</th><th>Tanggal</th><th>Waktu</th>
              <th>Lokasi</th><th>Kategori</th><th>Kuota</th><th>QR</th><th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {events.length ? events.map((ev,i)=>(
              <tr key={ev.id}>
                <td>{i+1}</td>
                <td className="text-break">{ev.title}</td>
                <td>{new Date(ev.date).toLocaleDateString('id-ID')}</td>
                <td>{ev.start_time.slice(0,5)}{ev.end_time && (" - "+ev.end_time.slice(0,5))}</td>
                <td className="text-break">{ev.location}</td>
                <td>{ev.category || "-"}</td><td>{ev.capacity}</td>

                <td>
                  <button className="btn btn-dark btn-sm"
                    onClick={()=>setQrEventId(ev.id)}>📱</button>
                </td>

                <td className="d-flex flex-wrap gap-1 justify-content-center">
                  <button className="btn btn-info btn-sm"
                    onClick={()=>navigate(`/admin/event/${ev.id}`)}>📄</button>

                  <button className="btn btn-secondary btn-sm"
                    onClick={()=>navigate(`/admin/events/${ev.id}/attendance`)}>👥</button>

                  <button className="btn btn-warning btn-sm"
                    onClick={()=>handleEdit(ev)}>✏️</button>

                  <button className="btn btn-danger btn-sm"
                    onClick={()=>handleDelete(ev.id)}>🗑️</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="9" className="text-muted py-3">Belum ada event</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* QR MODAL */}
      {qrEventId && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75
                        d-flex justify-content-center align-items-center"
          style={{zIndex:9999}} onClick={()=>setQrEventId(null)}>

          <div className="bg-white p-4 rounded shadow text-center"
                style={{maxWidth:300, width:"90%"}} onClick={(e)=>e.stopPropagation()}>
            <h5 className="mb-3">QR Event #{qrEventId}</h5>

            <QRCodeCanvas size={200} value={`http://localhost:5000/event/${qrEventId}`} />

            <button className="btn btn-secondary mt-3" onClick={()=>setQrEventId(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEvents;
