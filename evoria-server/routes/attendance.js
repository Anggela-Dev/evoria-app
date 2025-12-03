import express from "express";
import db from "../db.js";

const router = express.Router();

/* ============================================================
   1) SCAN PRESENSI
============================================================ */
router.post("/scan", async (req, res) => {
  const { event_id, user_id } = req.body;

  console.log("=== DEBUG SCAN ===");
  console.log("EventID diterima:", event_id);
  console.log("UserID diterima:", user_id);

  try {

    // CEK EVENT
    const eventRows = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM events WHERE id = ?", [event_id], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    if (eventRows.length === 0) {
      return res.status(400).json({ message: "Event tidak ditemukan" });
    }

    // CEK REGISTRASI
    const regRows = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM registrations WHERE event_id = ? AND user_id = ?", 
      [event_id, user_id], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    if (regRows.length === 0) {
      return res.status(403).json({ message: "Anda tidak terdaftar pada event ini" });
    }

    // CEK PRESENSI DUPLIKAT
    const attRows = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM attendance WHERE event_id = ? AND user_id = ?", 
      [event_id, user_id], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    if (attRows.length > 0) {
      return res.status(409).json({ message: "Anda sudah melakukan presensi sebelumnya" });
    }

    // SIMPAN PRESENSI
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO attendance (event_id, user_id, scan_time) VALUES (?, ?, NOW())",
        [event_id, user_id],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });

    return res.json({ message: "Presensi berhasil", event_id });

  } catch (err) {
    console.error("SCAN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Ambil semua event yang sudah dipresensi user
router.get("/status/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const rows = await new Promise((resolve, reject) => {
      db.query(
        "SELECT event_id FROM attendance WHERE user_id = ?",
        [userId],
        (err, result) => {
          if (err) reject(err);
          resolve(result);  // langsung hasil array rows
        }
      );
    });

    const attendedEvents = rows.map(r => r.event_id);

    return res.json(attendedEvents); // frontend nerima array lagi seperti awal
  } catch (err) {
    console.error("STATUS ERROR:", err);
    res.status(500).json({ message: "Gagal mengambil status presensi" });
  }
});

/* ============================================================
   2) GET LIST PESERTA PRESENSI BERDASARKAN EVENT_ID
============================================================ */
router.get("/", async (req, res) => {
  const { event_id } = req.query;

  if (!event_id) {
    return res.status(400).json({ message: "event_id diperlukan" });
  }

  try {
    db.query(
      `SELECT attendance.id, attendance.user_id, attendance.scan_time,
              users.username
       FROM attendance
       JOIN users ON users.id = attendance.user_id
       WHERE attendance.event_id = ?
       ORDER BY attendance.scan_time DESC`,
      [event_id],
      (err, result) => {
        if (err) {
          console.error("GET ATTENDANCE LIST ERROR:", err);
          return res.status(500).json({ message: "Query gagal", error: err });
        }
        res.json(result);
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server bermasalah" });
  }
});




export default router;
