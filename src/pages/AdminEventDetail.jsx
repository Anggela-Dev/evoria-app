import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

function AdminEventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [qrData, setQrData] = useState("");

  // Ambil admin ID dari localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const adminId = user?.id;

  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${id}`, {
      headers: { "x-admin-id": adminId }
    })
      .then(res => res.json())
      .then(data => setEvent(data))
      .catch(err => console.error("Gagal ambil event:", err));
  }, [id]);

  const generateBarcode = () => {
    const payload = {
      event_id: id,
      token: `EVT-${id}-${Date.now()}`,
      type: "attendance"
    };

    setQrData(JSON.stringify(payload));
  };

  if (!event) {
    return <p className="text-center mt-5">Memuat detail event...</p>;
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-center">📄 Detail Event</h2>

      <div className="card shadow p-4 mb-4">
        <h3>{event.title}</h3>
        <p>
        <strong>Tanggal:</strong>{" "}
        {new Date(event.date).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        })}
        </p>
        {event.start_time && (
        <p>
            <strong>Waktu Mulai:</strong> {event.start_time.slice(0, 5)}
        </p>
        )}

        {event.end_time && (
        <p>
            <strong>Waktu Selesai:</strong> {event.end_time.slice(0, 5)}
        </p>
        )}

        <p><strong>Lokasi:</strong> {event.location}</p>
        <p><strong>Kategori:</strong> {event.category}</p>
        <p><strong>Kapasitas:</strong> {event.capacity}</p>
        <p><strong>Deskripsi:</strong> {event.description}</p>
      </div>

      <div className="text-center">
        <button className="btn btn-dark" onClick={generateBarcode}>
          🎟️ Generate Barcode Presensi
        </button>

        {qrData && (
          <div className="mt-4">
            <h5>Scan Barcode Presensi</h5>
                <QRCodeCanvas value={qrData} size={200} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminEventDetail;
