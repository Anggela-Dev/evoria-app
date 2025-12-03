import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import axios from "axios";

function Dashboard() {
  const [confirmed, setConfirmed] = useState(false);

 const handleScan = async (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) return;

  console.log("RAW QR DATA:", data);

  try {
    const scannedText = data[0].rawValue;   // <<=== INI YANG BENER
    console.log("SCANNED TEXT:", scannedText);

    const url = new URL(scannedText);
    const pathParts = url.pathname.split("/");
    const eventId = pathParts[pathParts.length - 1];

    console.log("EVENT ID:", eventId);

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    const res = await fetch("http://localhost:5000/api/attendance/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_id: eventId,
        user_id: userId
      })
    });

    const json = await res.json();
    alert(json.message);

  } catch (err) {
    console.error("Scan error:", err);
  }
};



  return (
    <div className="container mt-4 text-center">
      <h3 className="fw-bold mb-4">📸 Scan QR Presensi</h3>

      {!confirmed ? (
        <Scanner
          onScan={handleScan}
          onError={(error) => console.error(error)}
          scanDelay={300}
          style={{ width: 300, height: 300, margin: "auto" }}
        />
      ) : (
        <div className="alert alert-success mt-4">
          <h5>Presensi Berhasil</h5>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
