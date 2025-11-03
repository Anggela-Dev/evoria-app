import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const q = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(q, [email, password], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length > 0) {
      res.json({ success: true, user: data[0] });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  });
});

export default router;
