import express from "express";
import db from "../db.js";

const router = express.Router();

// =============================
// 🔹 REGISTER USER
// =============================
router.post("/register", (req, res) => {
  const { fullName, email, password, role } = req.body;

  // Validasi input
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  // Default role = student jika tidak diisi
  const userRole = role || "student";

  const q =
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(q, [fullName, email, password, userRole], (err, data) => {
    if (err) {
      console.error("❌ Error register:", err);
      return res.status(500).json({ message: "Gagal mendaftar" });
    }
    res.json({ success: true, message: "✅ Registrasi berhasil!" });
  });
});

// =============================
// 🔹 LOGIN USER
// =============================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email dan password wajib diisi" });

  const q = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(q, [email, password], (err, data) => {
    if (err) {
      console.error("❌ Error login:", err);
      return res.status(500).json(err);
    }

    if (data.length > 0) {
      const user = data[0];
      res.json({
        success: true,
        message: "✅ Login berhasil!",
        user,
      });
    } else {
      res.json({ success: false, message: "❌ Email atau password salah!" });
    }
  });
});

export default router;
