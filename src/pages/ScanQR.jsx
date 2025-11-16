import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

function ScanQR() {
  const [result, setResult] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleResult = (res) => {
    if (res && res?.text && !confirmed) {
      setResult(res.text);
      setConfirmed(true);
      alert(`✅ Presensi berhasil! Kode: ${res.text}`);
    }
  };

  return (
    <div className="container mt-4 text-center">
      <h3 className="fw-bold mb-4">📸 Scan QR Code Presensi</h3>
      {!confirmed ? (
        <>
          <div style={{ width: "300px", height: "300px", margin: "auto" }}>
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={(res) => handleResult(res)}
              style={{ width: "100%" }}
            />
          </div>
          <p className="text-muted mt-3">Arahkan kamera ke QR Code acara</p>
        </>
      ) : (
        <div className="alert alert-success mt-4">
          <h5>✅ Presensi Tercatat</h5>
          <p>Kode Event: {result}</p>
        </div>
      )}
    </div>
  );
}

export default ScanQR;
