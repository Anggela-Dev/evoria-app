import React from "react";
import QRCode from "react-qr-code";

function QRGenerator({ eventId }) {
  const qrValue = JSON.stringify({
    event_id: eventId,
    token: "EVORIA-" + Math.random().toString(36).substring(2, 10)
  });

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h5>QR Code Presensi</h5>
      <QRCode value={qrValue} size={180} />
      <p className="text-muted mt-2">Scan untuk presensi acara #{eventId}</p>
    </div>
  );
}

export default QRGenerator;
