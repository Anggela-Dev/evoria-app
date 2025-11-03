import express from "express";
import db from "../db.js";

const router = express.Router();

// GET semua event
router.get("/", (req, res) => {
  const q = "SELECT * FROM events ORDER BY date ASC";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

// POST tambah event
router.post("/", (req, res) => {
  const { title, date, location, description } = req.body;
  const q = "INSERT INTO events (title, date, location, description) VALUES (?, ?, ?, ?)";
  db.query(q, [title, date, location, description], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ success: true, message: "Event added successfully!" });
  });
});

// DELETE event
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const q = "DELETE FROM events WHERE id = ?";
  db.query(q, [id], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ success: true, message: "Event deleted successfully!" });
  });
});


// ⚠️ Ini penting banget!
export default router;
