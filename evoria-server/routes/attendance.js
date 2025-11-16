import express from "express";
import db from "../db.js";

const router = express.Router();

// Menyimpan presensi hasil scan
router.post("/", (req, res) => {
  const { user_id, event_id } = req.body;

  if (!user_id || !event_id) {
    return res.status(400).json({ message: "user_id dan event_id wajib diisi" });
  }

  const sql = "INSERT INTO attendance (user_id, event_id) VALUES (?, ?)";
  db.query(sql, [user_id, event_id], (err, result) => {
    if (err) {
      console.error("❌ Gagal menyimpan presensi:", err);
      return res.status(500).json({ message: "Gagal menyimpan presensi" });
    }
    res.json({ message: "✅ Presensi berhasil disimpan", result });
  });
});

export default router;
