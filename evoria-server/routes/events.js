import express from "express";
import db from "../db.js";

const router = express.Router();

// 🔹 Ambil semua event
router.get("/", (req, res) => {
  db.query("SELECT * FROM events ORDER BY date ASC", (err, results) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data event" });
    res.json(results);
  });
});

// 🔹 Tambah event baru
router.post("/", (req, res) => {
  const { title, description, location, date, capacity } = req.body;
  const sql = "INSERT INTO events (title, description, location, date, capacity) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [title, description, location, date, capacity], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal menambahkan event" });
    res.json({ message: "✅ Event berhasil ditambahkan!" });
  });
});

// 🔹 Update event
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, location, date, capacity } = req.body;
  const sql = "UPDATE events SET title=?, description=?, location=?, date=?, capacity=? WHERE id=?";
  db.query(sql, [title, description, location, date, capacity, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal mengubah event" });
    res.json({ message: "✏️ Event berhasil diperbarui!" });
  });
});

// 🔹 Hapus event
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM events WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal menghapus event" });
    res.json({ message: "🗑️ Event berhasil dihapus!" });
  });
});

export default router;
