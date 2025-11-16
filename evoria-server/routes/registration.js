import express from "express";
import db from "../db.js";
console.log("📦 registrationRoutes loaded! ✅");

const router = express.Router();

// POST - daftar event baru
router.post("/", (req, res) => {
  const { user_id, event_id } = req.body;
  if (!user_id || !event_id)
    return res.status(400).json({ message: "user_id dan event_id wajib diisi" });

  const checkSql = `
    SELECT 
      (SELECT COUNT(*) FROM registrations WHERE event_id = ? AND status = 'confirmed') AS current_participants,
      e.capacity
    FROM events e
    WHERE e.id = ?;
  `;

  db.query(checkSql, [event_id, event_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal cek kapasitas" });

    const { current_participants, capacity } = result[0];
    const status = current_participants >= capacity ? "waitlist" : "confirmed";

    const insertSql =
      "INSERT INTO registrations (user_id, event_id, status) VALUES (?, ?, ?)";
    db.query(insertSql, [user_id, event_id, status], (err2) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ message: "Gagal mendaftar" });
      }
      res.json({
        message:
          status === "waitlist"
            ? "⚠️ Kuota penuh, kamu masuk daftar tunggu!"
            : "✅ Pendaftaran berhasil dikonfirmasi!",
      });
    });
  });
});

// ✅ GET - daftar event yang diikuti user
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT e.id, e.title, e.date, e.location, r.status
    FROM registrations r
    JOIN events e ON r.event_id = e.id
    WHERE r.user_id = ?
    ORDER BY e.date ASC;
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ Gagal ambil event user:", err);
      return res.status(500).json({ message: "Gagal mengambil data event." });
    }

    if (results.length === 0) {
      return res.json({ message: "Belum ada event yang kamu ikuti.", data: [] });
    }

    res.json(results);
  });
});

// PUT - promosi peserta dari waitlist ke confirmed
router.put("/promote/:eventId", (req, res) => {
  const { eventId } = req.params;

  const sql = `
    UPDATE registrations r
    JOIN (
      SELECT id FROM registrations
      WHERE event_id = ? AND status = 'waitlist'
      ORDER BY registered_at ASC
      LIMIT 1
    ) AS w ON r.id = w.id
    SET r.status = 'confirmed', r.promoted_at = NOW();
  `;

  db.query(sql, [eventId], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Gagal mempromosikan peserta" });
    if (result.affectedRows === 0)
      return res.json({ message: "Tidak ada peserta di daftar tunggu" });
    res.json({
      message: "✅ Satu peserta berhasil dipromosikan ke daftar peserta aktif!",
    });
  });
});
console.log("🛠️ Registration routes loaded");
router.use((req, res, next) => {
  console.log("➡️ Hit registration route:", req.method, req.url);
  next();
});

// DELETE - batal ikut event
router.delete("/:userId/:eventId", (req, res) => {
  const { userId, eventId } = req.params;

  const sql = "DELETE FROM registrations WHERE user_id = ? AND event_id = ?";
  db.query(sql, [userId, eventId], (err, result) => {
    if (err) {
      console.error("❌ Gagal membatalkan event:", err);
      return res.status(500).json({ message: "Gagal membatalkan event" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event tidak ditemukan di daftar kamu" });
    }

    res.json({ message: "✅ Pendaftaran event berhasil dibatalkan!" });
  });
});

export default router;
