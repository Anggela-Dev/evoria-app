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
// =============================
// 🔹 CHANGE PASSWORD
// =============================
router.put("/change-password", (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Semua field wajib diisi" });
  }

  // 1. Cek apakah password lama benar
  const qCheck = "SELECT * FROM users WHERE id = ? AND password = ?";
  db.query(qCheck, [userId, oldPassword], (err, data) => {
    if (err) {
      console.error("❌ Error saat verifikasi password:", err);
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }

    if (data.length === 0) {
      return res.json({
        success: false,
        message: "Password lama salah!",
      });
    }

    // 2. Update password
    const qUpdate = "UPDATE users SET password = ? WHERE id = ?";
    db.query(qUpdate, [newPassword, userId], (err2) => {
      if (err2) {
        console.error("❌ Error update password:", err2);
        return res
          .status(500)
          .json({ message: "Gagal mengubah password" });
      }

      return res.json({
        success: true,
        message: "Password berhasil diubah!",
      });
    });
  });
});

export default router;
