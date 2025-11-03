import React from "react";

function EventCard({ event }) {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h5 className="card-title">{event.title}</h5>
        <p className="card-text mb-1">
          <strong>Date:</strong> {event.date}
        </p>
        <p className="card-text mb-2">
          <strong>Location:</strong> {event.location}
        </p>
        <button className="btn btn-outline-primary btn-sm w-100">View Details</button>
      </div>
    </div>
  );
}

export default EventCard;
