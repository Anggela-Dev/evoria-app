import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/events`)
      .then((res) => {
        const found = res.data.find((e) => e.id === parseInt(id));
        setEvent(found);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!event) {
    return <p className="text-center mt-5">Loading event details...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="card shadow border-0">
          <div className="card-body">
            <h3 className="fw-bold">{event.title}</h3>
            <p className="text-muted">
              📅 {event.date} | 📍 {event.location}
            </p>
            <hr />
            <p>{event.description}</p>
            <button className="btn btn-primary">Daftar Sekarang</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventDetailPage;
