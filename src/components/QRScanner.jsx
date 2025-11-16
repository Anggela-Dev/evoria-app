import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

function QRScanner() {
  const [data, setData] = useState("Belum ada hasil scan");
  const [status, setStatus] = useState("");

  const handleScan = async (result) => {
    if (result?.text) {
      setData(result.text);
      setStatus("⏳ Mengirim data presensi...");

      try {
        const response = await fetch("http://localhost:5000/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: 1, // sementara dummy
            event_id: 1, // sementara dummy juga
          }),
        });

        const resData = await response.json();
        if (response.ok) {
          setStatus("✅ Presensi berhasil dikirim!");
        } else {
          setStatus("❌ Gagal: " + resData.message);
        }
      } catch (err) {
        console.error(err);
        setStatus("⚠️ Error koneksi ke server");
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h5>Scan QR Code</h5>
      <div style={{ width: "250px", margin: "auto" }}>
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={handleScan}
          style={{ width: "100%" }}
        />
      </div>
      <p className="mt-3">
        Hasil Scan: <b>{data}</b>
      </p>
      <p>{status}</p>
    </div>
  );
}

export default QRScanner;
