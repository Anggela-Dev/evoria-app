import express from "express";
import db from "../db.js";

const router = express.Router();

/* Dashboard Event berdasarkan creator/admin */
router.get("/dashboard", (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: "user_id diperlukan" });
  }

  const sql = `
    SELECT e.id, e.title, COUNT(r.id) AS total_registrations
    FROM events e
    LEFT JOIN registrations r ON r.event_id = e.id
    WHERE e.created_by = ?
    GROUP BY e.id
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("❌ QUERY ERROR:", err);
      return res.status(500).json({ message: "Gagal ambil data dashboard" });
    }

    return res.json(results);
  });
});

export default router;
